# Salida del SP `Compras.IndicadoresMatriz`

## Campos Principales

:::Note
Todos los campos que retorna están en [\_WTCONSULTAFINAL](elements/with.md_WTCONSULTAFINAL) y el nombre de este datos en el resto del sp sera tal cual como el titulo pero sin la palabra matriz (si hay algún cambio se colocara el alias)
:::

### MatrizAporteNacional

- **Campo**: `IIF(g.MaterialImportado = 1, 'SI', 'NO')`
- **Origen**:
  <div data-toggle-list />
  - [\_WTCONSULTABASE](elements/with.md#_wtconsultabase)>[\_Inventario](elements/with.md#_inventario)
    - `IIF(g.MaterialImportado = 1, 'SI', 'NO') AporteNacional`
      - **g**: [genMateriales](elements/tables.mdx#genmateriales) (campo `MaterialImportado`)
- **Descripción**: Clasifica el material como nacional o importado según su procedencia
- **Valores esperados**: `'SI'` (importado) / `'NO'` (nacional)

### MatrizIdMaterial

- **Origen**: Campo `IdMaterial` de [genMateriales](elements/tables.mdx#genmateriales)
- **Descripción**: Identificador único del material en el sistema
- **Valores esperados**: Enteros positivos (ej. 10045)

### MatriznomMaterial

- **Fórmula**: `CONVERT(VARCHAR(100), (CONVERT(VARCHAR(100), m.IdMaterial) + '-' + g.NomMaterial))`
- **Origen**:
  <div data-toggle-list />
  - [genMateriales](elements/tables.mdx#genmateriales) (campos `IdMaterial` y `NomMaterial`)

- **Descripción**: Nombre descriptivo que combina ID y nombre del material
- **Valores esperados**: Cadenas de texto (ej. "10045-Tornillo hexagonal M6")

### MatrizInventarioHoy

- **Fórmula**: [`SUM(m.istock)`](./legible_output_data#inventario-actual)
- **Origen**:
  <div data-toggle-list />

  - [\_WTCONSULTABASE](elements/with.md#_wtconsultabase) > `SUM(InventarioHoy) AS InventarioHoy`
    - [\_Inventario](elements/with.md#_inventario) > `SUM(m.istock) InventarioHoy`
      - **m**: Tabla [AlmMatUbicaciones](elements/tables.mdx#almmatubicaciones) (campo `istock`)
  - > Filtrado por CTE [\_Inventario](elements/with.md#_inventario) `ON m.IdMaterial = a.IdMaterial AND m.IdBodega = a.Idbodega`

- **Proceso**: Sumatoria del stock disponible por material en todas las bodegas
- **Valores esperados**: Enteros ≥ 0

### MatrizConsumoAnalisis

- **Origen**:
  <div data-toggle-list />

  - [\_WTCONSULTABASE](elements/with.md#_wtconsultabase) > [\_Inventario](elements/with.md#_inventario)
    - `ISNULL(cmh.Total, 0) AS ConsumoAnalisis`
      - **cmh**: Vista [Compras.ConsumoMaterialHistorico](elements/view.md#consumomaterialhistorico)
        - `SUM(Cantidad)Total`
          - **cantidad**: vista [Compras.EntradasySalidas](elements/view.md#entradasysalidas)
            - `DM.iCantidad Cantidad`
              - [AlmDetMovimientos](elements/tables.mdx#almdetmovimientos)
  - Datos provenientes de [AlmDetMovimientos](elements/tables.mdx#almdetmovimientos)

- **Descripción**: Consumo histórico en el período definido por `@RangoMesConsumo`
- **Valores esperados**: Números reales ≥ 0

### MatrizCostoTotal

- **Fórmula**: [`SUM(m.istock * m.CostoProm)`](./legible_output_data.md#valor-del-inventario)
- **Origen**:
  <div data-toggle-list />

  - [\_WTCONSULTABASE](elements/with.md#_wtconsultabase) > [\_Inventario](elements/with.md#_inventario)
    - `SUM(m.istock * m.CostoProm)`
      - **m**: Tabla [AlmMatUbicaciones](elements/tables.mdx#almmatubicaciones)
  - Tabla [AlmMatUbicaciones](elements/tables.mdx#almmatubicaciones) (campos `istock` y `CostoProm`)
  - Calculado en [\_Inventario](elements/with.md#_inventario)

- **Descripción**: Valor monetario total del inventario disponible
- **Valores esperados**: Números reales ≥ 0 (en pesos colombianos)

### MatrizContribucion

- **Fórmula**: [`(ConsumoAnalisis/costo)`](./legible_output_data.md#importancia-del-producto)
- **Origen**:
  <div data-toggle-list />
  - [\_WTCONSULTABASE](elements/with.md#_wtconsultabase) > [\_OperacionesContribucion](elements/with.md#_operacionescontribucion)
    - `(IIF(costo IS NULL OR costo = 0,0,(ConsumoAnalisis / costo))) Contribucion`
      - **ConsumoAnalisis**: [\_Inventario](elements/with.md#_inventario)> `ISNULL(cmh.Total, 0) AS ConsumoAnalisis`
        - **cmh**: Vista [Compras.ConsumoMaterialHistorico](elements/view.md#consumomaterialhistorico)
          - `SUM(Cantidad)Total`
            - **cantidad**: vista [Compras.EntradasySalidas](elements/view.md#entradasysalidas)
              - `DM.iCantidad Cantidad`
                - [AlmDetMovimientos](elements/tables.mdx#almdetmovimientos)
      - **Costo**: [\_Inventario](elements/with.md#_inventario)
        - `( SELECT valor FROM WT_ValorTotal WHERE g.aportenacional = aportenacional) costo`
          - **valor**: [WT_ValorTotal](elements/with.md#wt_valortotal) >`SUM(ISNULL(cmh.Total, 0)) AS valor`
            - **cmh**: Vista [Compras.ConsumoMaterialHistorico](elements/view.md#consumomaterialhistorico)
              - `SUM(Cantidad)Total`
                - **cantidad**: vista [Compras.EntradasySalidas](elements/view.md#entradasysalidas)
                  - `DM.iCantidad Cantidad`
                    - [AlmDetMovimientos](elements/tables.mdx#almdetmovimientos)
  - Datos base de [Compras.ConsumoMaterialHistorico](elements/view.md#consumomaterialhistorico)

- **Descripción**: Porcentaje que representa el consumo del material respecto al total
- **Valores esperados**: Decimales entre 0 y 1

:::note
La diferencia entre Costo Y ConsumoAnalisis es la suma, uno es la suma de todos los valores, mientras que el otro es el valor como tal
:::

### MatrizCostoUnitario

- **Fórmula**: [`IIF(SUM(CostoTotal) = 0, 0, SUM(CostoTotal)/SUM(InventarioHoy))`](./legible_output_data#costo-por-unidad)
- **Origen**:
  <div data-toggle-list />

  - [\_WTCONSULTABASE](elements/with.md#_wtconsultabase) as cb
    - `( IIF(SUM(CostoTotal) = 0 ,0 , SUM(CostoTotal) / SUM(InventarioHoy))) AS CostoUnitario`
      - **CostoTotal**: [\_Inventario](elements/with.md)>`SUM(m.istock * m.CostoProm) CostoTotal`
        - **m**: [AlmMatUbicaciones](elements/tables.mdx#almmatubicaciones) (istock, CostoProm)
      - **InventarioHoy**: `SUM(m.istock) InventarioHoy`
        - **m**: [AlmMatUbicaciones](elements/tables.mdx#almmatubicaciones) (istock)
  - Calculado a partir de `MatrizCostoTotal` y `MatrizInventarioHoy`
  - Datos base de [AlmMatUbicaciones](elements/tables.mdx#almmatubicaciones)

- **Descripción**: Costo promedio por unidad de material
- **Valores esperados**: Números reales ≥ 0

### MatrizClasificacion

- **Origen**:
  <div data-toggle-list />

  - [\_WTCONSULTABASE](elements/with.md#_wtconsultabase) as cb >

    ```SQL
      ISNULL(
          (
              SELECT TOP 1 CondicionesAbcClasificacion
              FROM Compras.CondicionesAbc
              WHERE
                  (
                      IIF(oc.Contribucion = 0, -1, oc.Contribucion)
                      BETWEEN CondicionesAbcMinimo AND CondicionesAbcMaximo
                  )
                  OR (
                      IIF(PromedioConsumo = 0, -1, (ISNULL(CPM.DesvEstandar, 0) + PromedioConsumo)) >= CondicionesAbcValor
                  )
              ORDER BY CondicionesAbcId ASC
          ),
          'SIN ROTACIÓN'
      ) AS Clasificacion
    ```

    - **oc**: [\_OperacionesContribucion](elements/with.md/_OperacionesContribucion) >
      ```SQL
        SELECT CONVERT(NUMERIC(18, 6),
          IIF(ISNULL(costo, 0) = 0,
            ISNULL(costo, 0),
            (ConsumoAnalisis / ISNULL(costo, 0)))
        ) Contribucion
      ```
      - **costo**: [\_Inventario](elements/with.md#_inventario) > `(SELECT valor FROM WT_ValorTotal WHERE g.aportenacional = aportenacional) costo`
        - **valor**: [WT_ValorTotal](elements/with.md#wt_valortotal) >`SUM(ISNULL(cmh.Total, 0)) AS valor`
          - **cmh**: Vista [Compras.ConsumoMaterialHistorico](elements/view.md#consumomaterialhistorico) > `SUM(Cantidad)Total`
            - **cantidad**: vista [Compras.EntradasySalidas](elements/view.md#entradasysalidas) > `DM.iCantidad Cantidad`
              - [AlmDetMovimientos](elements/tables.mdx#almdetmovimientos)
        - **g**: [genMateriales](elements/tables.mdx#genmateriales) (campo `MaterialImportado`)
      - **ConsumoAnalisis**: [\_Inventario](elements/with.md#_inventario)> `ISNULL(cmh.Total, 0) AS ConsumoAnalisis`
    - **CondicionesAbcMinimo**: [Compras.CondicionesAbc](elements/tables.mdx#compras.condicionesabc)
    - **CondicionesAbcMaximo**: [Compras.CondicionesAbc](elements/tables.mdx#compras.condicionesabc)
    - **PromedioConsumo**: [Compras.ConsumoPromedioMaterial](elements/view.md#consumopromedioMaterial) > `(SUM(a.Total)/(SELECT convert(int,Valor) FROM GenParametrizacion WHERE Parametro = 'RangoMesConsumo'))PromedioConsumo`
      - **a**: `sum(MovimientoMensual.Total) Total` > `SUM(Cantidad) Total`
        - **cantidad**: vista [Compras.EntradasySalidas](elements/view.md#entradasysalidas) > `DM.iCantidad Cantidad`
          - [AlmDetMovimientos](elements/tables.mdx#almdetmovimientos)
    - **CPM**: [Compras.ConsumoPromedioMaterial](elements/view.md#consumopromedioMaterial) 
      - **DesvEstandar**: `stdev(a.Total)DesvEstandar`
        - **a**: `sum(MovimientoMensual.Total) Total` > `SUM(Cantidad) Total`
          - **cantidad**: vista [Compras.EntradasySalidas](elements/view.md#entradasysalidas) > `DM.iCantidad Cantidad`
            - [AlmDetMovimientos](elements/tables.mdx#almdetmovimientos)
    - **CondicionesAbcValor**: [Compras.CondicionesAbc](elements/tables.mdx#compras.condicionesabc)

  - Tabla [Compras.CondicionesAbc](elements/tables.mdx#comprascondicionesabc)
  - Asignado según rangos de contribución

- **Descripción**: Clasificación ABC del material basada en su rotación
- **Valores esperados**:
  - 'A' (Alta rotación)
  - 'B' (Media rotación)
  - 'C' (Baja rotación)
  - 'SIN ROTACIÓN'

### MatrizNomProveedor

- **Fromula**: 
  ```sql
    SELECT TOP 1 gp.NomProveedor
      FROM AlmSolicitudes als
           INNER JOIN GenProveedores gp ON als.IdProveedor = gp.IdProveedor
           INNER JOIN AlmDetSolicitudes ald ON als.IdSolicitud = ald.IdSolicitud
      WHERE ald.IdMaterial = _Inventario.IdMaterial
        AND als.NoOC NOT IN (20,61,89,111,79)
      ORDER BY als.NoOC DESC
  ```
- **Origen**:
  <div data-toggle-list /> 
  - [\_WTCONSULTABASE](elements/with.md#_wtconsultabase) > 
    ```sql
      (SELECT TOP 1 gp.NomProveedor
        FROM AlmSolicitudes AS als
            INNER JOIN GenProveedores AS gp ON als.IdProveedor = gp.IdProveedor
            INNER JOIN AlmDetSolicitudes AS ald ON als.IdSolicitud = ald.IdSolicitud
        WHERE ald.IdMaterial = _Inventario.IdMaterial) AS NomProveedor
      ```
  - Consulta a [AlmSolicitudes](elements/tables.mdx#almsolicitudes) y [GenProveedores](elements/tables.mdx#genproveedores)
  - Última OC por material

- **Descripción**: Nombre del proveedor principal del material
- **Valores esperados**:
  - Nombres de proveedores (ej. "Distribuidora Andina S.A.")
  - 'N/A' para materiales sin historial de compras

### MatrizLeadTime

- **Origen**:
  <div data-toggle-list />

  - Campo `LeadTime` de [genMateriales](elements/tables.mdx#genmateriales)

- **Descripción**: Tiempo estimado de entrega desde la orden hasta la recepción
- **Valores esperados**: Enteros ≥ 0 (días hábiles)

### MatrizPromedioConsumo

- **Origen**:
  <div data-toggle-list />
  - [\_WTCONSULTABASE](elements/with.md#_wtconsultabase) > `ISNULL(cpm.PromedioConsumo, 0)`
    - **CPM**: [Compras.ConsumoPromedioMaterial](elements/view.md#consumopromedioMaterial) >
      - **PromedioConsumo**: [Compras.ConsumoPromedioMaterial](elements/view.md#consumopromedioMaterial) > `(SUM(a.Total)/(SELECT convert(int,Valor) FROM GenParametrizacion WHERE Parametro = 'RangoMesConsumo'))PromedioConsumo`
        - **a**: `sum(MovimientoMensual.Total) Total` > `SUM(Cantidad) Total`
          - **cantidad**: vista [Compras.EntradasySalidas](elements/view.md#entradasysalidas) > `DM.iCantidad Cantidad`
            - [AlmDetMovimientos](elements/tables.mdx#almdetmovimientos)
  - Vista [Compras].[ConsumoPromedioMaterial](elements/view.md#consumopromediomaterial)
  - Datos calculados desde [AlmDetMovimientos](elements/tables.mdx#almdetmovimientos)

- **Descripción**: Consumo diario promedio en el período analizado
- **Valores esperados**: Números reales ≥ 0

### MatrizDesvEstandar

- **Formula**: [Variabilidad del Uso](./legible_output_data.md#variabilidad-del-uso)
- **Origen**:
  <div data-toggle-list />
   - [\_WTCONSULTABASE](elements/with.md#_wtconsultabase) > `ISNULL(cpm.DesvEstandar, 0) DesvEstandar`
    - **CPM**: [Compras.ConsumoPromedioMaterial](elements/view.md#consumopromedioMaterial) 
      - **DesvEstandar**: `stdev(a.Total) DesvEstandar`
        - **a**: `sum(MovimientoMensual.Total) Total` > `SUM(Cantidad) Total`
          - **cantidad**: vista [Compras.EntradasySalidas](elements/view.md#entradasysalidas) > `DM.iCantidad Cantidad`
            - [AlmDetMovimientos](elements/tables.mdx#almdetmovimientos)

  - Vista [Compras].[ConsumoPromedioMaterial](elements/view.md#consumopromediomaterial)

- **Descripción**: Variabilidad del consumo del material
- **Valores esperados**: Números reales ≥ 0

### MatrizSafetyStock

- **Fórmula**: [`ROUND((cpm.MediaDia - @ComprasSafetyStock), 0)`](./legible_output_data.md#stock-de-seguridad)
- **Origen**:
  <div data-toggle-list />
  - [\_WTCONSULTABASE](elements/with.md#_wtconsultabase) > `ISNULL(ROUND((cpm.MediaDia * @ComprasSafetyStock) ,0) ,0) SafetyStock`
    - **CPM**: [Compras.ConsumoPromedioMaterial](elements/view.md#consumopromedioMaterial)
      - **MediaDia**:
        ```sql
          (
              AVG(a.Total) / 
              CONVERT(INT, (
                  SELECT VALOR 
                  FROM GenParametrizacion 
                  WHERE PARAMETRO = 'ComprasDiasMediaxDia'
              ))
          ) AS MediaDia
        ```
        - **a**: `sum(MovimientoMensual.Total) Total` > `SUM(Cantidad) Total`
          - **cantidad**: vista [Compras.EntradasySalidas](elements/view.md#entradasysalidas) > `DM.iCantidad Cantidad`
            - [AlmDetMovimientos](elements/tables.mdx#almdetmovimientos)
- **Parámetros**:
  - `@ComprasSafetyStock` de [GenParametrizacion](elements/tables.mdx#genparametrizacion)
- **Descripción**: Stock mínimo para cubrir fluctuaciones de demanda
- **Valores esperados**: Enteros ≥ 0

### MatrizReorderPoint

- **Fórmula**: [`((cpm.MediaDia * LeadTime) + cpm.DesvEstandar + SafetyStock)`](./legible_output_data.md#punto-de-reorden)
- **Origen**:  
    <div data-toggle-list />
  - [\_WTCONSULTABASE](elements/with.md#_wtconsultabase) > 
    ```SQL
        ISNULL(
        (
            (
                cpm.MediaDia *
                (
                    SELECT ISNULL(LeadTime, 0)
                    FROM genMateriales
                    WHERE IdMaterial = _Inventario.IdMaterial
                )
            )
            + cpm.DesvEstandar
            + ISNULL(
                ROUND(cpm.MediaDia * @ComprasSafetyStock, 0),
                0
            )
        ),
        0
    ) AS ReorderPoint

    ```
    - **CPM**: [Compras.ConsumoPromedioMaterial](elements/view.md#consumopromedioMaterial)
      - **MediaDia**:
        ```sql
          (
              AVG(a.Total) / 
              CONVERT(INT, (
                  SELECT VALOR 
                  FROM GenParametrizacion 
                  WHERE PARAMETRO = 'ComprasDiasMediaxDia'
              ))
          ) AS MediaDia
        ```
        - **a**: `sum(MovimientoMensual.Total) Total` > `SUM(Cantidad) Total`
          - **cantidad**: vista [Compras.EntradasySalidas](elements/view.md#entradasysalidas) > `DM.iCantidad Cantidad`
            - [AlmDetMovimientos](elements/tables.mdx#almdetmovimientos)
      - **DesvEstandar**: `stdev(a.Total) DesvEstandar`
          - **a**: `sum(MovimientoMensual.Total) Total` > `SUM(Cantidad) Total`
            - **cantidad**: vista [Compras.EntradasySalidas](elements/view.md#entradasysalidas) > `DM.iCantidad Cantidad`
              - [AlmDetMovimientos](elements/tables.mdx#almdetmovimientos)

    
- **Componentes**:
  - `MediaDia`: De [Compras.ConsumoPromedioMaterial](elements/view.md#consumopromediomaterial)
  - `LeadTime`: De [genMateriales](elements/tables.mdx#genmateriales)
- **Descripción**: Punto para disparar una nueva orden de compra
- **Valores esperados**: Enteros ≥ 0

### MatrizCostoDeOrdenar

- **Fórmula**: ` WTMANODEOBRA.ValorManoDeObra/( COUNT(*) FROM _Inventario)`
- **Origen**:
  <div data-toggle-list />

  - [\_WTCONSULTABASE](elements/with.md#_wtconsultabase) >
    ```sql
      IIF(_Inventario.AporteNacional = 'SI',
            (
              ( pc.PrecioDeCompra * @PorcentajeCostoOrdenar)+
              ((SELECT WTMANODEOBRA.ValorManoDeObra FROM WTMANODEOBRA)/(SELECT COUNT(*) FROM _Inventario))
            ),(
              (SELECT WTMANODEOBRA.ValorManoDeObra FROM WTMANODEOBRA)/(SELECT COUNT(*) FROM _Inventario)
            )
          )CostoDeOrdenar 
    ```
      - **PC**: [\_WTPRECIODECOMPRA](elements/with.md#_wtpreciodecompra)
        - **PrecioDeCompra**:
          ```sql
            (IIF(
                PrecioDolarMaterialesValor IS NULL,
                -- Si PrecioDolarMaterialesValor ES NULL:
                IIF(
                    IIF(SUM(CostoTotal) = 0, 0, SUM(CostoTotal) / SUM(InventarioHoy)) = 0,
                    -- Si el promedio ES 0 → usar el costo de respaldo de la unidad (ue.Costo)
                    ue.Costo,
                    -- Si el promedio NO es 0 → usar el promedio de costo calculado
                    IIF(SUM(CostoTotal) = 0, 0, SUM(CostoTotal) / SUM(InventarioHoy))
                ),

                -- Si PrecioDolarMaterialesValor NO ES NULL:
                -- Se asume que es un valor en dólares y se convierte a pesos (multiplicando por 3000)
                (PrecioDolarMaterialesValor * 3000) --!!! ESTA QUEMADO
            )

            -- ELSE (en caso de que todo lo anterior falle):
            ELSE 
            IIF(
                -- Repetimos la lógica del promedio de costo
                IIF(SUM(CostoTotal) = 0, 0, SUM(CostoTotal) / SUM(InventarioHoy)) = 0,

                -- Si el promedio ES 0 → usar costo de respaldo
                ue.Costo,

                -- Si NO es 0 → usar promedio
                IIF(SUM(CostoTotal) = 0, 0, SUM(CostoTotal) / SUM(InventarioHoy))
            )

            -- Valor por defecto final, si nada se cumple o falla el cálculo: 0
            ,0
            ) AS 'PrecioDeCompra'

          ``` 
          - **PrecioDolarMaterialesValor**: [_WTPRECIODOLAR](elements/with.md#_wtpreciodolar) > `MAX(pdm.PrecioDolarMaterialesValor)`
            - **pdm**: `Compras.PrecioDolarMateriales pdm`
          - **CostoTotal**: [\_Inventario](elements/with.md)>`SUM(m.istock * m.CostoProm) CostoTotal`
            - **m**: [AlmMatUbicaciones](elements/tables.mdx#almmatubicaciones) (istock, CostoProm)
          - **InventarioHoy**: `SUM(m.istock) InventarioHoy`
            - **m**: [AlmMatUbicaciones](elements/tables.mdx#almmatubicaciones) (istock)
      - **WTMANODEOBRA**: 
        - **ValorManoDeObra** `SELECT SUM(Valor) ValorManoDeObra`
          - **valor**:
            ```sql
              SELECT(@CostoCoord / @ComprasDiasMediaxDia) Valor
			        UNION
			        SELECT (@CostoCompras / @ComprasDiasMediaxDia ) Valor
			        UNION
			        SELECT (@CostoAlmacen / @ComprasDiasMediaxDia) Valor
              -- valor es la suma de estas diviciones
            ```  
  - Parámetros de [GenParametrizacion](elements/tables.mdx#genparametrizacion)

- **Descripción**: Costo administrativo de realizar un pedido
- **Valores esperados**: Números reales ≥ 0

### MatrizCostoDeInventarioUnd

- **Fórmula**: `PrecioDeCompra - @RentaMesCDT`
- **origen**: [\_WTCONSULTABASE](elements/with.md#_wtconsultabase) > `(pc.PrecioDeCompra * @RentaMesCDT) CostoDeInventarioUnd`
  <div data-toggle-list />
  - **PC**: 
    - [\_WTPRECIODECOMPRA](elements/with.md#_wtpreciodecompra)
      - **PrecioDeCompra**:
          ```sql
            (IIF(
                PrecioDolarMaterialesValor IS NULL,
                -- Si PrecioDolarMaterialesValor ES NULL:
                IIF(
                    IIF(SUM(CostoTotal) = 0, 0, SUM(CostoTotal) / SUM(InventarioHoy)) = 0,
                    -- Si el promedio ES 0 → usar el costo de respaldo de la unidad (ue.Costo)
                    ue.Costo,
                    -- Si el promedio NO es 0 → usar el promedio de costo calculado
                    IIF(SUM(CostoTotal) = 0, 0, SUM(CostoTotal) / SUM(InventarioHoy))
                ),
                -- Si PrecioDolarMaterialesValor NO ES NULL:
                -- Se asume que es un valor en dólares y se convierte a pesos (multiplicando por 3000)
                (PrecioDolarMaterialesValor * 3000) --!!! ESTA QUEMADO
            )
            -- ELSE (en caso de que todo lo anterior falle):
            ELSE 
            IIF(
                -- Repetimos la lógica del promedio de costo
                IIF(SUM(CostoTotal) = 0, 0, SUM(CostoTotal) / SUM(InventarioHoy)) = 0,
                -- Si el promedio ES 0 → usar costo de respaldo
                ue.Costo,
                -- Si NO es 0 → usar promedio
                IIF(SUM(CostoTotal) = 0, 0, SUM(CostoTotal) / SUM(InventarioHoy))
            )
            -- Valor por defecto final, si nada se cumple o falla el cálculo: 0
            ,0
            ) AS 'PrecioDeCompra'
          ``` 
            - **PrecioDolarMaterialesValor**: [_WTPRECIODOLAR](elements/with.md#_wtpreciodolar) > `MAX(pdm.PrecioDolarMaterialesValor)`
              - **pdm**: `Compras.PrecioDolarMateriales pdm`
            - **CostoTotal**: [\_Inventario](elements/with.md)>`SUM(m.istock * m.CostoProm) CostoTotal`
              - **m**: [AlmMatUbicaciones](elements/tables.mdx#almmatubicaciones) (istock, CostoProm)
            - **InventarioHoy**: `SUM(m.istock) InventarioHoy`
              - **m**: [AlmMatUbicaciones](elements/tables.mdx#almmatubicaciones) (istock)
- **Componentes**:
  - `PrecioDeCompra`: De CTE [\_WTPRECIODECOMPRA](elements/with.md#_wtpreciodecompra)
  - `@RentaMesCDT`: De [GenParametrizacion](elements/tables.mdx#genparametrizacion)
- **Descripción**: Costo de oportunidad por mantener inventario
- **Valores esperados**: Números reales ≥ 0

### MatrizPrecioDeCompra

- **Origen**:
  <div data-toggle-list />
  - [_WTPRECIODECOMPRA](elements/with.md#_wtpreciodecompra) AS pdc
    - **PrecioDeCompra**:
      ```sql
        (IIF(
            PrecioDolarMaterialesValor IS NULL,
            -- Si PrecioDolarMaterialesValor ES NULL:
            IIF(
                IIF(SUM(CostoTotal) = 0, 0, SUM(CostoTotal) / SUM(InventarioHoy)) = 0,
                -- Si el promedio ES 0 → usar el costo de respaldo de la unidad (ue.Costo)
                ue.Costo,
                -- Si el promedio NO es 0 → usar el promedio de costo calculado
                IIF(SUM(CostoTotal) = 0, 0, SUM(CostoTotal) / SUM(InventarioHoy))
            ),
            -- Si PrecioDolarMaterialesValor NO ES NULL:
            -- Se asume que es un valor en dólares y se convierte a pesos (multiplicando por 3000)
            (PrecioDolarMaterialesValor * 3000) --!!! ESTA QUEMADO
        )
        -- ELSE (en caso de que todo lo anterior falle):
        ELSE 
        IIF(
            -- Repetimos la lógica del promedio de costo
            IIF(SUM(CostoTotal) = 0, 0, SUM(CostoTotal) / SUM(InventarioHoy)) = 0,
            -- Si el promedio ES 0 → usar costo de respaldo
            ue.Costo,
            -- Si NO es 0 → usar promedio
            IIF(SUM(CostoTotal) = 0, 0, SUM(CostoTotal) / SUM(InventarioHoy))
        )
        -- Valor por defecto final, si nada se cumple o falla el cálculo: 0
        ,0
        ) AS 'PrecioDeCompra'
      ``` 
      - **PrecioDolarMaterialesValor**: [_WTPRECIODOLAR](elements/with.md#_wtpreciodolar) > `MAX(pdm.PrecioDolarMaterialesValor)`
        - **pdm**: `Compras.PrecioDolarMateriales pdm`
      - **CostoTotal**: [\_Inventario](elements/with.md)>`SUM(m.istock * m.CostoProm) CostoTotal`
        - **m**: [AlmMatUbicaciones](elements/tables.mdx#almmatubicaciones) (istock, CostoProm)
      - **InventarioHoy**: `SUM(m.istock) InventarioHoy`
        - **m**: [AlmMatUbicaciones](elements/tables.mdx#almmatubicaciones) (istock)

  - CTE [\_WTPRECIODECOMPRA](elements/with.md#_wtpreciodecompra)
  - Datos de:
    - [genMateriales](elements/tables.mdx#genmateriales)
    - [Compras.LiquidacionImportaciones](elements/tables.mdx#comprasliquidacionimportaciones)
    - [Compras.PrecioDolarMateriales](elements/tables.mdx#compraspreciodolarmateriales)

- **Descripción**: Último precio unitario pagado por el material
- **Valores esperados**: Números reales > 0

### MatrizEOQ

- **Fórmula**: [Formula](./legible_output_data.md#cantidad-ideal-de-compra-eoq)
  ```sql
  IIF(CostoDeInventarioUnd = 0, 0,
          ROUND((sqrt((2 - PromedioConsumo - CostoDeOrdenar)/CostoDeInventarioUnd)),0)
  )
  ``` 
- **Origen**:
  <div data-toggle-list />
   ```sql
      IIF(CostoDeInventarioUnd = 0,
        0,ROUND((sqrt((2 * cb.PromedioConsumo * cb.CostoDeOrdenar)/CostoDeInventarioUnd)),0)
      ) EOQ
    ```
    - **cb** : [\_WTCONSULTABASE](elements/with.md#_wtconsultabase)
      - **PromedioConsumo**: `ISNULL(cpm.PromedioConsumo, 0) PromedioConsumo`
        - **CPM**: [Compras.ConsumoPromedioMaterial](elements/view.md#consumopromedioMaterial) >
          - **PromedioConsumo**: [Compras.ConsumoPromedioMaterial](elements/view.md#consumopromedioMaterial) > `(SUM(a.Total)/(SELECT convert(int,Valor) FROM GenParametrizacion WHERE Parametro = 'RangoMesConsumo'))PromedioConsumo`
            - **a**: `sum(MovimientoMensual.Total) Total` > `SUM(Cantidad) Total`
              - **cantidad**: vista [Compras.EntradasySalidas](elements/view.md#entradasysalidas) > `DM.iCantidad Cantidad`
                - [AlmDetMovimientos](elements/tables.mdx#almdetmovimientos)
      - **CostoDeOrdenar**: 
        ```sql
          IIF(_Inventario.AporteNacional = 'SI',
                (
                  ( pc.PrecioDeCompra * @PorcentajeCostoOrdenar)+
                  ((SELECT WTMANODEOBRA.ValorManoDeObra FROM WTMANODEOBRA)/(SELECT COUNT(*) FROM _Inventario))
                ),(
                  (SELECT WTMANODEOBRA.ValorManoDeObra FROM WTMANODEOBRA)/(SELECT COUNT(*) FROM _Inventario)
                )
          ) CostoDeOrdenar 
        ```
        - **PC**: [\_WTPRECIODECOMPRA](elements/with.md#_wtpreciodecompra)
          - **PrecioDeCompra**:
            ```sql
              (IIF(
                  PrecioDolarMaterialesValor IS NULL,
                  -- Si PrecioDolarMaterialesValor ES NULL:
                  IIF(
                      IIF(SUM(CostoTotal) = 0, 0, SUM(CostoTotal) / SUM(InventarioHoy)) = 0,
                      -- Si el promedio ES 0 → usar el costo de respaldo de la unidad (ue.Costo)
                      ue.Costo,
                      -- Si el promedio NO es 0 → usar el promedio de costo calculado
                      IIF(SUM(CostoTotal) = 0, 0, SUM(CostoTotal) / SUM(InventarioHoy))
                  ),

                  -- Si PrecioDolarMaterialesValor NO ES NULL:
                  -- Se asume que es un valor en dólares y se convierte a pesos (multiplicando por 3000)
                  (PrecioDolarMaterialesValor * 3000) --!!! ESTA QUEMADO
              )

              -- ELSE (en caso de que todo lo anterior falle):
              ELSE 
              IIF(
                  -- Repetimos la lógica del promedio de costo
                  IIF(SUM(CostoTotal) = 0, 0, SUM(CostoTotal) / SUM(InventarioHoy)) = 0,

                  -- Si el promedio ES 0 → usar costo de respaldo
                  ue.Costo,

                  -- Si NO es 0 → usar promedio
                  IIF(SUM(CostoTotal) = 0, 0, SUM(CostoTotal) / SUM(InventarioHoy))
              )

              -- Valor por defecto final, si nada se cumple o falla el cálculo: 0
              ,0
              ) AS 'PrecioDeCompra'
            ``` 
            - **PrecioDolarMaterialesValor**: [_WTPRECIODOLAR](elements/with.md#_wtpreciodolar) > `MAX(pdm.PrecioDolarMaterialesValor)`
              - **pdm**: `Compras.PrecioDolarMateriales pdm`
            - **CostoTotal**: [\_Inventario](elements/with.md)>`SUM(m.istock * m.CostoProm) CostoTotal`
              - **m**: [AlmMatUbicaciones](elements/tables.mdx#almmatubicaciones) (istock, CostoProm)
            - **InventarioHoy**: `SUM(m.istock) InventarioHoy`
              - **m**: [AlmMatUbicaciones](elements/tables.mdx#almmatubicaciones) (istock)
        - **WTMANODEOBRA**: 
          - **ValorManoDeObra** `SELECT SUM(Valor) ValorManoDeObra`
            - **valor**:
              ```sql
                SELECT(@CostoCoord / @ComprasDiasMediaxDia) Valor
			          UNION
			          SELECT (@CostoCompras / @ComprasDiasMediaxDia ) Valor
			          UNION
			          SELECT (@CostoAlmacen / @ComprasDiasMediaxDia) Valor
                -- valor es la suma de estas diviciones
              ```
    - **CostoDeInventarioUnd**: [\_WTCONSULTABASE](elements/with.md#_wtconsultabase) > `(pc.PrecioDeCompra * @RentaMesCDT) CostoDeInventarioUnd`
      - **PC**: [\_WTPRECIODECOMPRA](elements/with.md#_wtpreciodecompra)
        - **PrecioDeCompra**:
          ```sql
            (IIF(
                PrecioDolarMaterialesValor IS NULL,
                -- Si PrecioDolarMaterialesValor ES NULL:
                IIF(
                    IIF(SUM(CostoTotal) = 0, 0, SUM(CostoTotal) / SUM(InventarioHoy)) = 0,
                    -- Si el promedio ES 0 → usar el costo de respaldo de la unidad (ue.Costo)
                    ue.Costo,
                    -- Si el promedio NO es 0 → usar el promedio de costo calculado
                    IIF(SUM(CostoTotal) = 0, 0, SUM(CostoTotal) / SUM(InventarioHoy))
                ),

                -- Si PrecioDolarMaterialesValor NO ES NULL:
                -- Se asume que es un valor en dólares y se convierte a pesos (multiplicando por 3000)
                (PrecioDolarMaterialesValor * 3000) --!!! ESTA QUEMADO
            )

            -- ELSE (en caso de que todo lo anterior falle):
            ELSE 
            IIF(
                -- Repetimos la lógica del promedio de costo
                IIF(SUM(CostoTotal) = 0, 0, SUM(CostoTotal) / SUM(InventarioHoy)) = 0,

                -- Si el promedio ES 0 → usar costo de respaldo
                ue.Costo,

                -- Si NO es 0 → usar promedio
                IIF(SUM(CostoTotal) = 0, 0, SUM(CostoTotal) / SUM(InventarioHoy))
            )

            -- Valor por defecto final, si nada se cumple o falla el cálculo: 0
            ,0
            ) AS 'PrecioDeCompra'
          ``` 
            - **PrecioDolarMaterialesValor**: [_WTPRECIODOLAR](elements/with.md#_wtpreciodolar) > `MAX(pdm.PrecioDolarMaterialesValor)`
              - **pdm**: `Compras.PrecioDolarMateriales pdm`
            - **CostoTotal**: [\_Inventario](elements/with.md)>`SUM(m.istock * m.CostoProm) CostoTotal`
              - **m**: [AlmMatUbicaciones](elements/tables.mdx#almmatubicaciones) (istock, CostoProm)
            - **InventarioHoy**: `SUM(m.istock) InventarioHoy`
              - **m**: [AlmMatUbicaciones](elements/tables.mdx#almmatubicaciones) (istock)
- **Componentes**:
  - `PromedioConsumo`: De [Compras.ConsumoPromedioMaterial](elements/view.md#consumopromediomaterial)
  - `CostoDeOrdenar`: Calculado previamente
- **Descripción**: Cantidad óptima de compra según modelo EOQ
- **Valores esperados**: Enteros ≥ 0
k

### MatrizOrden
- **Fórmula**:
  ```sql
  IIF(CantSugerida <= 0, 'NO ORDENAR',
    IIF(InventarioDePosicion > ReorderPoint, 'NO ORDENAR', 'ORDENAR')
  )
  ```
- **Origen**:
  <div data-toggle-list />
  ```sql 
    (IIF(
      (
        cb.InventarioHoy + ISNULL(mp.Pendiente,0) -
        ISNULL(bo.CantidadBackOrder, 0)
      ) > ReorderPoint, 'NO ORDENAR', 'ORDENAR')) AS Orden
  ```
    - **cb**: [\_WTCONSULTABASE](elements/with.md#_wtconsultabase)
      - **InventarioHoy**: `SUM(m.istock) InventarioHoy`
        - **m**: [AlmMatUbicaciones](elements/tables.mdx#almmatubicaciones) (istock)
    - **mp**: [_WTMATERIALESPENDIENTES](elements/with.md#_wtmaterialespendientes)
      - **Pendiente**: `SUM(DS.iCantidadSol - DS.iCantidadIng) [Pendiente]`
        - **DS**: [almDetSolicitudes](elements/tables.mdx#almDetSolicitudes)
    - **bo**: [_WTBACKORDER](elements/with.md#_wtbackorder)
      - **CantidadBackOrder**: `SUM(ISNULL(BackOrderSolicitudCantidadPendiente,0))CantidadBackOrder`
        - **BackOrderSolicitudCantidadPendiente** : [compras.BackOrderSolicitud](elements/tables.mdx#compras.backordersolicitud) 
    - **ReorderPoint**:
      ```sql
        -- Cálculo del Reorder Point (punto de reorden)
        ISNULL(
            (
                -- Media de consumo diario * Lead Time del material
                (cpm.MediaDia * (
                    SELECT ISNULL(LeadTime, 0)
                    FROM genMateriales
                    WHERE IdMaterial = _Inventario.IdMaterial
                ))
                -- + Desviación estándar
                + cpm.DesvEstandar
                -- + Stock de seguridad
                + ISNULL(
                    ROUND(
                        (cpm.MediaDia * @ComprasSafetyStock),
                        0
                    ),
                    0
                )
            ),
            0
        ) AS ReorderPoint
      ```  
      - **CPM**: [Compras.ConsumoPromedioMaterial](elements/view.md#consumopromedioMaterial)
        - **MediaDia**:
          ```sql
            (
                AVG(a.Total) / 
                CONVERT(INT, (
                    SELECT VALOR 
                    FROM GenParametrizacion 
                    WHERE PARAMETRO = 'ComprasDiasMediaxDia'
                ))
            ) AS MediaDia
          ```
          - **a**: `sum(MovimientoMensual.Total) Total` > `SUM(Cantidad) Total`
            - **cantidad**: vista [Compras.EntradasySalidas](elements/view.md#entradasysalidas) > `DM.iCantidad Cantidad`
              - [AlmDetMovimientos](elements/tables.mdx#almdetmovimientos)
        - **DesvEstandar**: `stdev(a.Total) DesvEstandar`
            - **a**: `sum(MovimientoMensual.Total) Total` > `SUM(Cantidad) Total`
              - **cantidad**: vista [Compras.EntradasySalidas](elements/view.md#entradasysalidas) > `DM.iCantidad Cantidad`
                - [AlmDetMovimientos](elements/tables.mdx#almdetmovimientos)
       - **_Inventario**:**IdMaterial**

- **Lógica**:
  - Compara `InventarioDePosicion` con `ReorderPoint`
  - Considera `CantSugerida`
- **Descripción**: Recomendación de compra automatizada
- **Valores esperados**: 'ORDENAR' / 'NO ORDENAR'

### MatrizBackOrder

- **Origen**:
  <div data-toggle-list />
  `ISNULL(bo.CantidadBackOrder, 0) BackOrder`
    - **bo**: [_WTBACKORDER](elements/with.md#_wtbackorder)
      - **CantidadBackOrder**: `SUM(ISNULL(BackOrderSolicitudCantidadPendiente,0))CantidadBackOrder`
        - **BackOrderSolicitudCantidadPendiente** : [compras.BackOrderSolicitud](elements/tables.mdx#compras.backordersolicitud) 
- **Descripción**: Cantidad pendiente por entregar de órdenes confirmadas
- **Valores esperados**: Enteros ≥ 0

### MatrizTransito

- **Origen**:
  <div data-toggle-list />
  - `ISNULL(mp.Pendiente,0) Transito`
    - **mp**: [_WTMATERIALESPENDIENTES](elements/with.md#_wtmaterialespendientes)
      - **Pendiente**: `SUM(DS.iCantidadSol - DS.iCantidadIng) [Pendiente]`
        - **DS**: [almDetSolicitudes](elements/tables.mdx#almDetSolicitudes)

- **Descripción**: Cantidad de material en órdenes aprobadas no recibidas
- **Valores esperados**: Enteros ≥ 0

### MatrizConsumoMaximo

- **Origen**:
  <div data-toggle-list />

  - Vista [Compras].[ConsumoPromedioMaterial](elements/view.md#consumopromediomaterial)
    - `max(a.Total)ConsumoMaximo`
      - **a**: `sum(MovimientoMensual.Total) Total` > `SUM(Cantidad) Total`
        - **cantidad**: vista [Compras.EntradasySalidas](elements/view.md#entradasysalidas) > `DM.iCantidad Cantidad`
          - [AlmDetMovimientos](elements/tables.mdx#almdetmovimientos)

- **Descripción**: Consumo máximo histórico registrado
- **Valores esperados**: Números reales ≥ 0

### MatrizConsumoMinimo

- **Origen**:
  <div data-toggle-list />

  - Vista [Compras].[ConsumoPromedioMaterial](elements/view.md#consumopromediomaterial)
    - `min(a.Total)ConsumoMinimo`
      - **a**: `sum(MovimientoMensual.Total) Total` > `SUM(Cantidad) Total`
        - **cantidad**: vista [Compras.EntradasySalidas](elements/view.md#entradasysalidas) > `DM.iCantidad Cantidad`
          - [AlmDetMovimientos](elements/tables.mdx#almdetmovimientos)

- **Descripción**: Consumo mínimo histórico registrado
- **Valores esperados**: Números reales ≥ 0

### MatrizComprasSafetyStock

- **Origen**:
  <div data-toggle-list />

  - Parámetro `@ComprasSafetyStock` del SP
  - Valor fijo de [GenParametrizacion](elements/tables.mdx#genparametrizacion)

- **Descripción**: Días de stock de seguridad configurados
- **Valores esperados**: Enteros > 0 (ej. 15 días)

## Campos Detallados

### MatrizInventarioDePosicion

- **Fórmula**: `(InventarioHoy + Transito - BackOrder)`
- **Componentes**:

  1. `InventarioHoy`:

     - **Tabla origen**: [AlmMatUbicaciones](elements/tables.mdx#almmatubicaciones)
     - **Campo**: `istock`
     - **Proceso**: Sumatoria de stock físico disponible

  2. `Transito`:

     - **Tabla origen**: [almDetSolicitudes](elements/tables.mdx#almdetsolicitudes)
     - **Campos**: `iCantidadSol`, `iCantidadIng`
     - **Filtros**:
       - Estados 2,3,5 en [almSolicitudes](elements/tables.mdx#almsolicitudes)
       - Diferencia positiva entre solicitado e ingresado

  3. `BackOrder`:
     - **Tabla origen**: [compras.BackOrderSolicitud](elements/tables.mdx#comprasbackordersolicitud)
     - **Campo**: `BackOrderSolicitudCantidadPendiente`
     - **Filtro**: `BackOrderSolicitudEstado = 1`

- **Descripción**: Inventario neto considerando pendientes por recibir y entregar
- **Valores esperados**: Enteros (pueden ser negativos si hay más backorders que inventario)

### MatrizCantidadSugerida

- **Fórmula completa**:

  ```sql
  IIF(AporteNacional = 'NO',
          ISNULL(PromedioConsumo,0) + ISNULL(BackOrder,0) - ISNULL(Transito,0) - ISNULL(InventarioHoy,0),
          IIF(CostoDeInventarioUnd = 0, 0,
               (ROUND((sqrt((2 - PromedioConsumo - CostoDeOrdenar)/CostoDeInventarioUnd)),0))
               + ISNULL(BackOrder,0) - ISNULL(Transito,0)
          )
  )
  ```

- **Lógica por tipo de material**:

1. **Materiales Importados**:

   - **Fórmula**: `PromedioConsumo + BackOrder - Transito - InventarioHoy`
   - **Componentes**:
     - `PromedioConsumo`: De [Compras.ConsumoPromedioMaterial](elements/view.md#consumopromediomaterial)
     - `BackOrder`: De [compras.BackOrderSolicitud](elements/tables.mdx#comprasbackordersolicitud)
     - `Transito`: De [almDetSolicitudes](elements/tables.mdx#almdetsolicitudes)
     - `InventarioHoy`: De [AlmMatUbicaciones](elements/tables.mdx#almmatubicaciones)

2. **Materiales Nacionales**:
   - **Fórmula**: `EOQ + BackOrder - Transito`
   - **Componentes EOQ**:
     - `PromedioConsumo`: De [Compras.ConsumoPromedioMaterial](elements/view.md#consumopromediomaterial)
     - `CostoDeOrdenar`: Calculado previamente
     - `CostoDeInventarioUnd`: De [genMateriales](elements/tables.mdx#genmateriales) y [Compras.LiquidacionImportaciones](elements/tables.mdx#comprasliquidacionimportaciones)

- **Descripción**: Cantidad recomendada para ordenar considerando:
  - Para importados: Cubrir consumo promedio y backorders, menos lo que está en tránsito e inventario
  - Para nacionales: Usar modelo EOQ ajustado por backorders y tránsito
- **Valores esperados**: Enteros ≥ 0 (0 cuando no se recomienda ordenar)

## Campos por Bodega

### Inventario por Bodega

- **Pruebas_Almacén Zonal calle 80**
- **Pruebas_Tintal**
- **_Pruebas_Alimentadores_**
- **Pruebas_Suba**
- **Origen**:
  <div data-toggle-list />

  - CTE [\_PIVOTINVENTARIO](elements/with.md#_pivotinventario)
  - Datos base de [AlmMatUbicaciones](elements/tables.mdx#almmatubicaciones)

- **Proceso**: Pivot de bodegas 1,2,8,23
- **Descripción**: Desglose del inventario físico por ubicación
- **Valores esperados**: Enteros ≥ 0

### Consumo por Bodega

- **Consumo Almacén Zonal calle 80**
- **Consumo Tintal**
- **Consumo Alimentadores**
- **Consumo Suba**
- **Origen**:
  <div data-toggle-list />

  - CTE [\_PIVOTCONSUMO](elements/with.md#_pivotconsumo)
  - Datos base de [AlmDetMovimientos](elements/tables.mdx#almdetmovimientos)

- **Proceso**: Pivot de consumos por bodega
- **Descripción**: Desglose histórico de consumos por ubicación
- **Valores esperados**: Enteros ≥ 0


