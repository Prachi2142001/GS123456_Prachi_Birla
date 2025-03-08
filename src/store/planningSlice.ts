import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PlanningGridRow } from '../types/planning';
import { samplePlanningData } from '../data/sampleData';

interface PlanningState {
  planningData: PlanningGridRow[];
  loading: boolean;
  error: string | null;
  filters: {
    store?: string;
    category?: string;
    week?: string;
  };
  sorting: {
    field: keyof PlanningGridRow;
    direction: 'asc' | 'desc';
  };
}

const initialState: PlanningState = {
  planningData: samplePlanningData,
  loading: false,
  error: null,
  filters: {},
  sorting: {
    field: 'store',
    direction: 'asc'
  }
};

const planningSlice = createSlice({
  name: 'planning',
  initialState,
  reducers: {
    setPlanningData: (state, action: PayloadAction<PlanningGridRow[]>) => {
      state.planningData = action.payload;
    },
    updatePlanningRow: (state, action: PayloadAction<PlanningGridRow>) => {
      const index = state.planningData.findIndex(row => row.id === action.payload.id);
      if (index !== -1) {
        state.planningData[index] = action.payload;
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setFilters: (state, action: PayloadAction<PlanningState['filters']>) => {
      state.filters = action.payload;
    },
    setSorting: (state, action: PayloadAction<PlanningState['sorting']>) => {
      state.sorting = action.payload;
    },
    calculateDifferences: (state) => {
      state.planningData = state.planningData.map(row => ({
        ...row,
        difference: row.requiredStock - row.currentStock
      }));
    }
  }
});

export const {
  setPlanningData,
  updatePlanningRow,
  setLoading,
  setError,
  setFilters,
  setSorting,
  calculateDifferences
} = planningSlice.actions;

export default planningSlice.reducer;
