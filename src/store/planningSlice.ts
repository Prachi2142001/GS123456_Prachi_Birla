import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PlanningState, PlanningGridRow } from '../types/planning';

const initialState: PlanningState = {
  planningData: [],
  loading: false,
  error: null
};

const planningSlice = createSlice({
  name: 'planning',
  initialState,
  reducers: {
    setPlanningData: (state, action: PayloadAction<PlanningGridRow[]>) => {
      state.planningData = action.payload;
    },
    updatePlanningData: (state, action: PayloadAction<PlanningGridRow>) => {
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
    }
  }
});

export const { setPlanningData, updatePlanningData, setLoading, setError } = planningSlice.actions;
export default planningSlice.reducer;
