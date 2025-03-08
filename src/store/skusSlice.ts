import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SKU, SKUsState } from '../types/sku';
import { sampleSKUs } from '../data/sampleData';

const initialState: SKUsState = {
  skus: sampleSKUs,
  loading: false,
  error: null,
  selectedSKU: null,
  filters: {},
  sorting: {
    field: 'name',
    direction: 'asc'
  }
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
    deleteSKU: (state, action: PayloadAction<string>) => {
      state.skus = state.skus.filter(sku => sku.id !== action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setSelectedSKU: (state, action: PayloadAction<SKU | null>) => {
      state.selectedSKU = action.payload;
    },
    setFilters: (state, action: PayloadAction<SKUsState['filters']>) => {
      state.filters = action.payload;
    },
    setSorting: (state, action: PayloadAction<SKUsState['sorting']>) => {
      state.sorting = action.payload;
    }
  }
});

export const {
  setSKUs,
  addSKU,
  updateSKU,
  deleteSKU,
  setLoading,
  setError,
  setSelectedSKU,
  setFilters,
  setSorting
} = skusSlice.actions;

export default skusSlice.reducer;
