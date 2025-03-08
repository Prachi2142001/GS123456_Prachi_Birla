// Planning types
export interface WeekData {
  units: number;
  salesUnits?: number;
  salesDollars?: number;
  gmDollars?: number;
  gmPercentage?: number;
}

export interface SKUWeekData {
  [weekId: string]: WeekData;
}

export interface StoreSKUData {
  [skuId: string]: SKUWeekData;
}

export interface PlanningData {
  [storeId: string]: StoreSKUData;
}

export interface PlanningState {
  planningData: PlanningData;
  loading: boolean;
  error: string | null;
}

export interface UpdatePlanningDataPayload {
  storeId: string;
  skuId: string;
  weekId: string;
  data: Partial<WeekData>;
}

// Planning grid types
export interface PlanningGridRow {
  id: string;
  store: string;
  sku: string;
  price: number;
  cost: number;
  [key: string]: any; // For dynamic week columns
}

export interface PlanningGridColumn {
  field: string;
  headerName: string;
  children?: PlanningGridColumn[];
  [key: string]: any; // For AG-Grid column properties
}
