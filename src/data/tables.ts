export const tables = {
  genMateriales: {
    label: "genMateriales",
    description: "Catálogo de materiales con sus propiedades y estados",
    alias: ["g"],
    fields: [
      { name: "IdMaterial", type: "int" },
      { name: "NomMaterial", type: "string" },
      { name: "MaterialImportado", type: "boolean" },
      { name: "AporteNacional", type: "string" },
      { name: "IdEstado", type: "int" },
      { name: "sReferencia", type: "string" },
      { name: "IdClaDetalle", type: "int" },
      { name: "LandedCost", type: "decimal" },
      { name: "LeadTime", type: "int" },
    ],
  },

  AlmMatUbicaciones: {
    label: "AlmMatUbicaciones",
    description: "Ubicaciones de materiales en bodegas con su inventario",
    alias: ["m"],
    fields: [
      { name: "IdMaterial", type: "int" },
      { name: "IdBodega", type: "int" },
      { name: "iStock", type: "int" },
      { name: "CostoProm", type: "decimal" },
      { name: "IdEstado", type: "int" },
    ],
  },

  AlmDetMovimientos: {
    label: "AlmDetMovimientos",
    description: "Detalle de movimientos de inventario",
    alias: ["DM", "f", "i"],
    fields: [
      { name: "IdDetMovimiento", type: "int" },
      { name: "IdMaterial", type: "int" },
      { name: "IdMovimiento", type: "int" },
      { name: "FechaDetMov", type: "date" },
      { name: "iCantidad", type: "int" },
      { name: "CostoUni", type: "decimal" },
    ],
  },

  AlmMovimientos: {
    label: "AlmMovimientos",
    description: "Movimientos generales de inventario",
    alias: ["h", "k", "M"],
    fields: [
      { name: "IdMovimiento", type: "int" },
      { name: "IdBodega", type: "int" },
      { name: "NoOC", type: "string" },
      { name: "IdConcepto", type: "int" },
      { name: "IdProveedor", type: "int" },
      { name: "IdentificacionProcesa", type: "string" },
      { name: "IdBodegaDest", type: "int" },
    ],
  },

  "Compras.ConsumoMaterialHistorico": {
    label: "Compras.ConsumoMaterialHistorico",
    description: "Consumo histórico de materiales",
    alias: ["cmh"],
    fields: [
      { name: "IdMaterial", type: "int" },
      { name: "Total", type: "decimal" },
    ],
  },

  AlmClaDetalles: {
    label: "AlmClaDetalles",
    description: "Clasificación detallada de materiales",
    alias: ["j", "CD"],
    fields: [
      { name: "IdClaDetalle", type: "int" },
      { name: "IdClaMayor", type: "int" },
    ],
  },

  AlmClaMayores: {
    label: "AlmClaMayores",
    description: "Clasificación mayor de materiales",
    alias: ["c", "CM"],
    fields: [{ name: "IdClaMayor", type: "int" }],
  },

  "Compras.ConsumoPromedioMaterial": {
    label: "Compras.ConsumoPromedioMaterial",
    description: "Estadísticas de consumo promedio de materiales",
    alias: [],
    fields: [
      { name: "IdMaterial", type: "int" },
      { name: "PromedioConsumo", type: "decimal" },
      { name: "DesvEstandar", type: "decimal" },
      { name: "MediaDia", type: "decimal" },
      { name: "ConsumoMaximo", type: "decimal" },
      { name: "ConsumoMinimo", type: "decimal" },
    ],
  },

  "Compras.CondicionesAbc": {
    label: "Compras.CondicionesAbc",
    description: "Condiciones de clasificación ABC",
    alias: [],
    fields: [
      { name: "CondicionesAbcClasificacion", type: "string" },
      { name: "CondicionesAbcMinimo", type: "decimal" },
      { name: "CondicionesAbcMaximo", type: "decimal" },
      { name: "CondicionesAbcValor", type: "decimal" },
      { name: "CondicionesAbcId", type: "int" },
    ],
  },

  AlmSolicitudes: {
    label: "AlmSolicitudes",
    description: "Solicitudes de materiales",
    alias: ["als", "S"],
    fields: [
      { name: "IdSolicitud", type: "int" },
      { name: "IdProveedor", type: "int" },
      { name: "NoOC", type: "string" },
      { name: "idoctipo", type: "int" },
      { name: "idsolestado", type: "int" },
      { name: "idbodega", type: "int" },
    ],
  },

  AlmDetSolicitudes: {
    label: "AlmDetSolicitudes",
    description: "Detalle de solicitudes de materiales",
    alias: ["ald", "DS"],
    fields: [
      { name: "IdSolicitud", type: "int" },
      { name: "IdMaterial", type: "int" },
      { name: "iCantidadSol", type: "int" },
      { name: "iCantidadIng", type: "int" },
    ],
  },

  GenProveedores: {
    label: "GenProveedores",
    description: "Catálogo de proveedores",
    alias: ["gp", "P"],
    fields: [
      { name: "IdProveedor", type: "int" },
      { name: "NomProveedor", type: "string" },
    ],
  },

  genBodegas: {
    label: "genBodegas",
    description: "Catálogo de bodegas",
    alias: ["bod", "B", "bd"],
    fields: [{ name: "IdBodega", type: "int" }],
  },

  "Compras.BackOrderSolicitud": {
    label: "Compras.BackOrderSolicitud",
    description: "Backorder de solicitudes de compra",
    alias: [],
    fields: [
      { name: "BackOrderSolicitudCantidadPendiente", type: "int" },
      { name: "materialid", type: "int" },
      { name: "BackOrderSolicitudEstado", type: "string" },
    ],
  },

  "Compras.PrecioDolarMateriales": {
    label: "Compras.PrecioDolarMateriales",
    description: "Precios en dólares de los materiales",
    alias: [],
    fields: [
      { name: "PrecioDolarMaterialesValor", type: "decimal" },
      { name: "PrecioDolarMaterialesReferencia", type: "string" },
    ],
  },

  "Compras.LiquidacionImportaciones": {
    label: "Compras.LiquidacionImportaciones",
    description: "Liquidación de costos de importación",
    alias: [],
    fields: [
      { name: "LandedCost", type: "decimal" },
      { name: "CodMaterial", type: "string" },
    ],
  },

  GenParametrizacion: {
    label: "GenParametrizacion",
    description: "Parámetros generales del sistema",
    alias: [],
    fields: [
      { name: "VALOR", type: "string" },
      { name: "parametro", type: "string" },
    ],
  },

  AlmConceptos: {
    label: "AlmConceptos",
    description: "Conceptos relacionados a movimientos de almacén",
    alias: ["C"],
    fields: [{ name: "IdConcepto", type: "int" }],
  },
};
