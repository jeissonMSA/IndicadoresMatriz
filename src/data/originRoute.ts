import { INestedItem } from "../components/NestedList/types";
const AporteNacional: INestedItem[] = [
  {
    label: "_WTCONSULTABASE",
    type: "CTE",
    children: [
      {
        label: "_Inventario",
        type: "CTE",
        children: [
          {
            label: "ISNULL(cmh.Total, 0)",
            alias: "ConsumoAnalisis",
            type: "FUNCTION",
            children: [
              {
                label: "Compras.ConsumoMaterialHistorico",
                type: "VIEW",
                children: [
                  {
                    label: "SUM(Cantidad) AS Total",
                    children: [
                      {
                        label: "cantidad: vista Compras.EntradasySalidas",
                        children: [
                          {
                            label: "DM.iCantidad AS Cantidad AlmDetMovimientos",
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    label: "IIF(g.MaterialImportado = 1, 'SI', 'NO') AS AporteNacional",
    children: [
      {
        label: "g: genMateriales (campo MaterialImportado)",
      },
    ],
  },
];
const ConsumoAnalisis: INestedItem[] = [];

const consultaFinal: INestedItem[] = [];
const consultaBase: INestedItem[] = [];

export const originRoute = {
  AporteNacional,
};
