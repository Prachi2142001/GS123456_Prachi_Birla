import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SKU, SKUsState } from '../types/sku';

const initialState: SKUsState = {
    skus: [],
    loading: false,
    error: null,
};

const skusSlice = createSlice({
    name: 'skus',
    initialState,
    reducers: {
        setSKUs: (state, action: PayloadAction<SKU[]>) => {
            state.skus = action.payload;
        },
        addSKU: (state, action: PayloadAction<SKU>) => {
            state.skus.push(action.payload);
        },
        updateSKU: (state, action: PayloadAction<SKU>) => {
            const index = state.skus.findIndex(sku => sku.id === action.payload.id);
            if (index !== -1) {
                state.skus[index] = action.payload;
            }
        },
        removeSKU: (state, action: PayloadAction<string>) => {
            state.skus = state.skus.filter(sku => sku.id !== action.payload);
        },
        updatePriceAndCost: (state, action: PayloadAction<{ id: string; price: number; cost: number }>) => {
            const index = state.skus.findIndex(sku => sku.id === action.payload.id);
            if (index !== -1) {
                state.skus[index].price = action.payload.price;
                state.skus[index].cost = action.payload.cost;
            }
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
    setSKUs,
    addSKU,
    updateSKU,
    removeSKU,
    updatePriceAndCost,
    setLoading,
    setError,
} = skusSlice.actions;

export default skusSlice.reducer;
