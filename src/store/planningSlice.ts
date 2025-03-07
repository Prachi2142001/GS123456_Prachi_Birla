import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PlanningState, WeekData } from '../types';

const initialState: PlanningState = {
    planningData: {},
    loading: false,
    error: null,
};

const calculateWeekData = (
    salesUnits: number,
    price: number,
    cost: number
): WeekData => {
    const salesDollars = salesUnits * price;
    const gmDollars = salesDollars - (salesUnits * cost);
    const gmPercentage = salesDollars > 0 ? (gmDollars / salesDollars) * 100 : 0;

    return {
        salesUnits,
        salesDollars,
        gmDollars,
        gmPercentage,
    };
};

const planningSlice = createSlice({
    name: 'planning',
    initialState,
    reducers: {
        updateSalesUnits: (
            state,
            action: PayloadAction<{
                storeId: string;
                skuId: string;
                weekId: string;
                salesUnits: number;
                price: number;
                cost: number;
            }>
        ) => {
            const { storeId, skuId, weekId, salesUnits, price, cost } = action.payload;
            
            // Initialize nested structure if it doesn't exist
            if (!state.planningData[storeId]) {
                state.planningData[storeId] = {};
            }
            if (!state.planningData[storeId][skuId]) {
                state.planningData[storeId][skuId] = {};
            }

            // Calculate and update all values
            state.planningData[storeId][skuId][weekId] = calculateWeekData(salesUnits, price, cost);
        },
        updatePriceForAllUnits: (
            state,
            action: PayloadAction<{
                skuId: string;
                price: number;
                cost: number;
            }>
        ) => {
            const { skuId, price, cost } = action.payload;
            
            // Recalculate all entries for the SKU with new price
            Object.keys(state.planningData).forEach(storeId => {
                if (state.planningData[storeId][skuId]) {
                    Object.keys(state.planningData[storeId][skuId]).forEach(weekId => {
                        const { salesUnits } = state.planningData[storeId][skuId][weekId];
                        state.planningData[storeId][skuId][weekId] = calculateWeekData(salesUnits, price, cost);
                    });
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
    updateSalesUnits,
    updatePriceForAllUnits,
    setLoading,
    setError,
} = planningSlice.actions;

export default planningSlice.reducer;
