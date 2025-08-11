type typeItem = "CTE" | "VIEW" | "TABLE" | "SP" | "FUNCTION" | "OTHER";
export interface INestedItem {
  label: string;
  alias?: string;
  type?: typeItem;
  children?: INestedItem[];
}
