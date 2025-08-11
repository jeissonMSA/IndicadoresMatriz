# Actualización del Formato de Datos para Inventario y Logística

## 1. Estructura Actual

Actualmente, los datos se presentan en una tabla extensa con múltiples columnas que combinan información de materiales, inventario, consumo, costos y logística. Esta estructura, aunque completa, dificulta su lectura, mantenimiento, escalabilidad y la integración con otros sistemas. Además, no permite identificar ni consolidar fácilmente los datos por bodega.

**Ejemplo de formato actual:**


```json
{
  "MatrizId": 1,
  "MatrizAporteNacional": "NO",
  "MatrizIdMaterial": 828,
  "MatriznomMaterial": "828-ESPEJO LATERAL 3-394000",
  "MatrizInventarioHoy": 38.0,
  "MatrizCostoTotal": 1330000.0,
  "MatrizContribucion": 0.0,
  "MatrizCostoUnitario": 35000.0,
  "MatrizClasificacion": "A",
  "MatrizNomProveedor": "AUTOPARTES HUERTAS EU",
  "MatrizLeadTime": 0,
  "MatrizPromedioConsumo": 8.475,
  "MatrizDesvEstandar": 51.4461,
  "MatrizSafetyStock": 34.0,
  "MatrizReorderPoint": 85.446088,
  "MatrizCostoDeOrdenar": 26.0,
  "MatrizCostoDeInventarioUnd": 201.25,
  "MatrizPrecioDeCompra": 35000.0,
  "MatrizEOQ": 1,
  "MatrizOrden": "NO ORDENAR",
  "MatrizBackOrder": 19,
  "MatrizTransito": 50.0,
  "MatrizConsumoMaximo": 108.0,
  "MatrizConsumoMinimo": 3.0,
  "MatrizComprasSafetyStock": 15,
  "MatrizInventarioDePosicion": 69.0,
  "MatrizCantidadSugerida": -61,
  "MatrizInventarioCalle80": 9.0,
  "MatrizInventarioTintal": 14.0,
  "MatrizInventarioAlimentadores": 15.0,
  "MatrizInventarioSuba": 0.0,
  "MatrizConsumoCalle80": 124.0,
  "MatrizConsumoTintal": 170.0,
  "MatrizConsumoAlimentadores": 44.0,
  "MatrizConsumoSuba": 1.0,
  "MatrizConsumoAnalisis": 339.0
}

```

## 2. Nuevo Formato JSON

El nuevo formato organiza la información en bloques lógicos anidados, facilitando su interpretación, mantenimiento y automatización. Las principales secciones son:

* **`material`**: Datos del producto, proveedor y clasificación.
* **`inventario`**: Inventario total y por bodega.
* **`consumo`**: Estadísticas de consumo.
* **`logistica`**: Indicadores clave para gestión de stock.
* **`costos`**: Costos unitarios y totales.
* **`indicadores`**: Métricas adicionales como backorder.
* **`metadatos`**: Información de origen y actualización.

**Ejemplo de nuevo formato:**


```json
{ 
  "material": {
    "id": 4956,
    "nombre": "4956-SOLDADURA DE PVC HILO TRIANGULAR GRIS PARA PISO",
    "proveedor": "SOLUCIONES INTEGRALES PARA CARROCERIAS - SOINTCAR SAS",
    "clasificacion": "A",
    "esNacional": false
  },
  "inventario": {
    "total": {
      "actual": 432.00,
      "enTransito": 0.00,
      "disponible": 432.00
    },
    "porBodega": [
      {
        "bodega": "Calle80",
        "inventario": 176.00,
        "consumo": 450.00
      },
      {
        "bodega": "Tintal",
        "inventario": 72.00,
        "consumo": 122.00
      },
      {
        "bodega": "Alimentadores",
        "inventario": 178.00,
        "consumo": 260.00
      },
      {
        "bodega": "Suba",
        "inventario": 6.00,
        "consumo": 0.00
      }
    ]
  },
  "consumo": {
    "promedio": 20.8,
    "unidad": "unidades",
    "desviacionEstandar": 114.32,
    "maximo": 291.00,
    "minimo": 3.00,
    "analisisPeriodoTotal": 832.00
  },
  "logistica": {
    "leadTimeDias": 0,
    "stockSeguridad": 83.00,
    "puntoReorden": 197.32,
    "cantidadSugerida": 0,
    "orden": false,
    "cantidadOrdenEconomicaEOQ": 15,
    "comprasStockSeguridad": 15
  },
  "costos": {
    "unitarios": {
      "precioCompra": 893.3958,
      "costoInventarioUnidad": 5.137
    },
    "totales": {
      "costoTotal": 385946.97,
      "costoOrdenar": 26.00
    }
  },
  "indicadores": {
    "contribucion": 0.0,
    "backOrder": 0
  },
  "metadatos": {
    "fechaActualizacion": "2025-07-29",
    "usuario": "analista1",
    "origenDatos": "ERP"
  }
}
```

## 3. Ejemplo de Conversión

| Anterior (plano)        | Nuevo formato                         |
| ----------------------- | ------------------------------------- |
| `MatrizInventarioHoy`   | `inventario.total.actual`             |
| `MatrizCostoTotal`      | `costos.totales.costoTotal`           |
| `MatrizPromedioConsumo` | `consumo.promedio`                    |
| `MatrizEOQ`             | `logistica.cantidadOrdenEconomicaEOQ` |
| `MatrizNomProveedor`    | `material.proveedor`                  |

