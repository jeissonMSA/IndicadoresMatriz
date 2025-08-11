# WITHs del Procedimiento Almacenado

## [wt_valortotal](./with.md#wt_valortotal)

**Campos:**

- valor
- aportenacional

**Tablas origen:**

- [almdetmovimientos](elements/tables.mdx#almdetmovimientos)
- [almmovimientos](elements/tables.mdx#almmovimientos)
- [genmateriales](elements/tables.mdx#genmateriales)
- [almcladetalles](elements/tables.mdx#almcladetalles)
- [almclamayores](elements/tables.mdx#almclamayores)
- [almmatubicaciones](elements/tables.mdx#almmatubicaciones)
- [compras.consumomaterialhistorico](elements/tables.mdx#comprasconsumomaterialhistorico)

## [wtmanodeobra](./with.md#wtmanodeobra)

**Campos:**

- valormanodeobra

**Tablas origen:**

- Usa parámetros del SP (no usa tablas directas)

## [\_inventario](./with.md#_inventario)

**Campos:**

- idmaterial
- aportenacional
- nommaterial
- inventariohoy
- consumoanalisis
- costototal
- costo

**Tablas origen:**

- [almdetmovimientos](elements/tables.mdx#almdetmovimientos)
- [almmovimientos](elements/tables.mdx#almmovimientos)
- [almmatubicaciones](elements/tables.mdx#almmatubicaciones)
- [genmateriales](elements/tables.mdx#genmateriales)
- [compras.consumomaterialhistorico](elements/tables.mdx#comprasconsumomaterialhistorico)
- [wt_valortotal](./with.md#wt_valortotal) (subconsulta)

## [\_inventariobodega](./with.md#_inventariobodega)

**Campos:**

- idmaterial
- inventariohoy
- idbodega

**Tablas origen:**

- [almmatubicaciones](elements/tables.mdx#almmatubicaciones)

## [\_pivotinventario](./with.md#_pivotinventario)

**Campos:**

- idmaterial
- pruebas_almacén zonal calle 80
- pruebas_tintal
- pruebas_alimentadores
- pruebas_suba

**Tablas origen:**

- [\_inventariobodega](./with.md#_inventariobodega)

## [\_operacionescontribucion](./with.md#_operacionescontribucion)

**Campos:**

- contribucion
- costo
- consumoanalisis
- idmaterial

**Tablas origen:**

- [\_inventario](./with.md#_inventario)

## [wt_materiale](./with.md#wt_materiale)

**Campos:**

- idmaterial
- cantidad
- idbodega

**Tablas origen:**

- [almdetmovimientos](elements/tables.mdx#almdetmovimientos)
- [almmovimientos](elements/tables.mdx#almmovimientos)
- [almconceptos](elements/tables.mdx#almconceptos)
- [genmateriales](elements/tables.mdx#genmateriales)
- [almccostos](elements/tables.mdx#almccostos)
- [genproveedores](elements/tables.mdx#genproveedores)
- [almoperadores](elements/tables.mdx#almoperadores)
- [genautobuses](elements/tables.mdx#genautobuses)
- [genbodegas](elements/tables.mdx#genbodegas)
- [almcladetalles](elements/tables.mdx#almcladetalles)
- [almclamayores](elements/tables.mdx#almclamayores)
- [genpersonal](elements/tables.mdx#genpersonal)

## [\_pivotconsumo](./with.md#_pivotconsumo)

**Campos:**

- idmaterial
- consumo almacén zonal calle 80
- consumo tintal
- consumo alimentadores
- consumo suba

**Tablas origen:**

- [wt_materiale](./with.md#wt_materiale)

## [\_wtultimaentrada](./with.md#_wtultimaentrada)

**Campos:**

- idmaterial
- costo

**Tablas origen:**

- [almdetmovimientos](elements/tables.mdx#almdetmovimientos)
- [almmovimientos](elements/tables.mdx#almmovimientos)
- [almconceptos](elements/tables.mdx#almconceptos)
- [genmateriales](elements/tables.mdx#genmateriales)
- [almccostos](elements/tables.mdx#almccostos)
- [genproveedores](elements/tables.mdx#genproveedores)
- [almoperadores](elements/tables.mdx#almoperadores)
- [genautobuses](elements/tables.mdx#genautobuses)
- [genbodegas](elements/tables.mdx#genbodegas)
- [almcladetalles](elements/tables.mdx#almcladetalles)
- [almclamayores](elements/tables.mdx#almclamayores)
- [genpersonal](elements/tables.mdx#genpersonal)

## [\_wtpreciodolar](./with.md#_wtpreciodolar)

**Campos:**

- preciodolarmaterialesvalor
- idmaterial

**Tablas origen:**

- [genmateriales](elements/tables.mdx#genmateriales)
- [compras.preciodolarmateriales](elements/tables.mdx#compraspreciodolarmateriales)

## [\_wtpreciodecompra](./with.md#_wtpreciodecompra)

**Campos:**

- idmaterial
- preciodecompra

**Tablas origen:**

- [\_inventario](./with.md#_inventario)
- [\_wtultimaentrada](./with.md#_wtultimaentrada)
- [\_wtpreciodolar](./with.md#_wtpreciodolar)
- [genmateriales](elements/tables.mdx#genmateriales)
- [compras.liquidacionimportaciones](elements/tables.mdx#comprasliquidacionimportaciones)
- [almsolicitudes](elements/tables.mdx#almsolicitudes)
- [genproveedores](elements/tables.mdx#genproveedores)
- [almdetsolicitudes](elements/tables.mdx#almdetsolicitudes)

## [\_wtbackorder](./with.md#_wtbackorder)

**Campos:**

- cantidadbackorder
- materialid

**Tablas origen:**

- [compras.backordersolicitud](elements/tables.mdx#comprasbackordersolicitud)

## [\_wtmaterialespendientes](./with.md#_wtmaterialespendientes)

**Campos:**

- idmaterial
- pendiente

**Tablas origen:**

- [almdetsolicitudes](elements/tables.mdx#almdetsolicitudes)
- [almsolicitudes](elements/tables.mdx#almsolicitudes)
- [genmateriales](elements/tables.mdx#genmateriales)
- [genproveedores](elements/tables.mdx#genproveedores)
- [genbodegas](elements/tables.mdx#genbodegas)

## [\_wtconsultabase](./with.md#_wtconsultabase)

**Alias:**

- cb en [\_WTCONSULTAFINAL](#_wtconsultafinal)

**Campos:**

- aportenacional
- idmaterial
- nommaterial
- inventariohoy
- consumoanalisis
- costototal
- contribucion
- costounitario
- clasificacion
- nomproveedor
- leadtime
- promedioconsumo
- desvestandar
- safetystock
- reorderpoint
- costodeordenar
- costodeinventariound
- preciodecompra
- consumomaximo
- consumominimo

**Tablas origen:**

- [\_inventario](./with.md#_inventario)
- [compras.consumopromediomaterial](elements/tables.mdx#comprasconsumopromediomaterial)
- [\_operacionescontribucion](./with.md#_operacionescontribucion)
- [\_wtpreciodecompra](./with.md#_wtpreciodecompra)
- [almsolicitudes](elements/tables.mdx#almsolicitudes)
- [genproveedores](elements/tables.mdx#genproveedores)
- [almdetsolicitudes](elements/tables.mdx#almdetsolicitudes)
- [genmateriales](elements/tables.mdx#genmateriales)
- [wtmanodeobra](./with.md#wtmanodeobra) (subconsulta)

## [\_wtconsultafinal](./with.md#_wtconsultafinal)

**Alias:**

- b en Merge de Compras.Matriz
  **Campos:**

- Todos los campos de [\_wtconsultabase](./with.md#_wtconsultabase) más:
  - eoq
  - orden
  - backorder
  - transito
  - inventariodeposicion
  - cantsugerida
  - inventarios por bodega
  - consumos por bodega

**Tablas origen:**

- [\_wtconsultabase](./with.md#_wtconsultabase)
- [\_pivotconsumo](./with.md#_pivotconsumo)
- [\_wtpreciodecompra](./with.md#_wtpreciodecompra)
- [\_wtbackorder](./with.md#_wtbackorder)
- [\_pivotinventario](./with.md#_pivotinventario)
- [\_wtmaterialespendientes](./with.md#_wtmaterialespendientes)
