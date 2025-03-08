import { Store, StoresState } from './store';
import { SKU, SKUsState } from './sku';

export type { Store, StoresState, SKU, SKUsState };

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

export interface PlanningState {
    planningData: Record<string, Record<string, Record<string, WeekData>>>;
    loading: boolean;
    error: string | null;
}
