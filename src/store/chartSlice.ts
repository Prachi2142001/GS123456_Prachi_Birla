import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Store } from '../types/store';
import { SKU } from '../types/sku';

interface ChartData {
  storeMetrics: {
    storeName: string;
    totalSKUs: number;
    totalValue: number;
  }[];
  skuMetrics: {
    category: string;
    count: number;
    averagePrice: number;
  }[];
  loading: boolean;
  error: string | null;
}

const initialState: ChartData = {
  storeMetrics: [],
  skuMetrics: [],
  loading: false,
  error: null,
};

const chartSlice = createSlice({
  name: 'chart',
  initialState,
  reducers: {
    setStoreMetrics: (state, action: PayloadAction<ChartData['storeMetrics']>) => {
      state.storeMetrics = action.payload;
    },
    setSKUMetrics: (state, action: PayloadAction<ChartData['skuMetrics']>) => {
      state.skuMetrics = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setStoreMetrics, setSKUMetrics, setLoading, setError } = chartSlice.actions;
export default chartSlice.reducer;
