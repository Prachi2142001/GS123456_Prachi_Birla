import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PlanningState, WeekData } from '../types';

interface UpdatePlanningDataPayload {
  storeId: string;
  skuId: string;
  weekId: string;
  data: Partial<WeekData>;
}

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
          salesUnits: 0,
          salesDollars: 0,
          gmDollars: 0,
          gmPercentage: 0,
        };
      }

      // Update only the provided fields
      state.planningData[storeId][skuId][weekId] = {
        ...state.planningData[storeId][skuId][weekId],
        ...data,
      };

      // Recalculate GM percentage if either sales or GM dollars changed
      if (data.salesDollars !== undefined || data.gmDollars !== undefined) {
        const currentData = state.planningData[storeId][skuId][weekId];
        if (currentData.salesDollars > 0) {
          currentData.gmPercentage = (currentData.gmDollars / currentData.salesDollars) * 100;
        } else {
          currentData.gmPercentage = 0;
        }
      }
    },
    bulkUpdatePlanningData: (state, action: PayloadAction<UpdatePlanningDataPayload[]>) => {
      action.payload.forEach(update => {
        const { storeId, skuId, weekId, data } = update;
        
        // Initialize nested objects if they don't exist
        if (!state.planningData[storeId]) {
          state.planningData[storeId] = {};
        }
        if (!state.planningData[storeId][skuId]) {
          state.planningData[storeId][skuId] = {};
        }
        if (!state.planningData[storeId][skuId][weekId]) {
          state.planningData[storeId][skuId][weekId] = {
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

        // Recalculate GM percentage
        const currentData = state.planningData[storeId][skuId][weekId];
        if (currentData.salesDollars > 0) {
          currentData.gmPercentage = (currentData.gmDollars / currentData.salesDollars) * 100;
        } else {
          currentData.gmPercentage = 0;
        }
      });
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
  setLoading,
  setError,
} = planningSlice.actions;

export default planningSlice.reducer;
