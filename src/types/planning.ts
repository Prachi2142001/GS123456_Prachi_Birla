// Planning types
export interface PlanningGridRow {
  id: string;
  storeId: string;
  store: string;
  skuId: string;
  sku: string;
  category: string;
  price: number;
  cost: number;
  quantity: number;
  week: string;
  units: number;
  salesUnits: number;
  salesDollars: number;
  gmDollars: number;
  gmPercentage: number;
}

export interface PlanningState {
  planningData: PlanningGridRow[];
  loading: boolean;
  error: string | null;
}

// Planning grid types
export interface PlanningGridColumn {
  field: string;
  headerName: string;
  children?: PlanningGridColumn[];
  [key: string]: any; // For AG-Grid column properties
}
