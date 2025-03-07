// Store type definitions
export interface Store {
    id: string;
    name: string;
    order: number;
}

export interface SKU {
    id: string;
    name: string;
    price: number;
    cost: number;
}

export interface WeekData {
    salesUnits: number;
    salesDollars: number;
    gmDollars: number;
    gmPercentage: number;
}

export interface PlanningData {
    storeId: string;
    skuId: string;
    weekId: string;
    data: WeekData;
}

// State interfaces
export interface StoresState {
    stores: Store[];
    loading: boolean;
    error: string | null;
}

export interface SKUsState {
    skus: SKU[];
    loading: boolean;
    error: string | null;
}

export interface PlanningState {
    planningData: Record<string, Record<string, Record<string, WeekData>>>;
    loading: boolean;
    error: string | null;
}
