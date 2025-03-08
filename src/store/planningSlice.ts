import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PlanningState, UpdatePlanningDataPayload, WeekData } from '../types/planning';

const initialState: PlanningState = {
  planningData: {},
  loading: false,
  error: null,
};

const planningSlice = createSlice({
  name: 'planning',
  initialState,
  reducers: {
    updatePlanningData: (state, action: PayloadAction<UpdatePlanningDataPayload>) => {
      const { storeId, skuId, weekId, data } = action.payload;

      // Initialize nested objects if they don't exist
      if (!state.planningData[storeId]) {
        state.planningData[storeId] = {};
      }
      if (!state.planningData[storeId][skuId]) {
        state.planningData[storeId][skuId] = {};
      }
      if (!state.planningData[storeId][skuId][weekId]) {
        state.planningData[storeId][skuId][weekId] = {
          units: 0,
          salesUnits: 0,
          salesDollars: 0,
          gmDollars: 0,
          gmPercentage: 0,
        };
      }

      // Update the data
      state.planningData[storeId][skuId][weekId] = {
        ...state.planningData[storeId][skuId][weekId],
        ...data,
      };
    },
    bulkUpdatePlanningData: (state, action: PayloadAction<UpdatePlanningDataPayload[]>) => {
      action.payload.forEach(({ storeId, skuId, weekId, data }) => {
        // Initialize nested objects if they don't exist
        if (!state.planningData[storeId]) {
          state.planningData[storeId] = {};
        }
        if (!state.planningData[storeId][skuId]) {
          state.planningData[storeId][skuId] = {};
        }
        if (!state.planningData[storeId][skuId][weekId]) {
          state.planningData[storeId][skuId][weekId] = {
            units: 0,
            salesUnits: 0,
            salesDollars: 0,
            gmDollars: 0,
            gmPercentage: 0,
          };
        }

        // Update the data
        state.planningData[storeId][skuId][weekId] = {
          ...state.planningData[storeId][skuId][weekId],
          ...data,
        };
      });
    },
    clearPlanningData: (state) => {
      state.planningData = {};
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  updatePlanningData,
  bulkUpdatePlanningData,
  clearPlanningData,
  setLoading,
  setError,
} = planningSlice.actions;

export default planningSlice.reducer;
