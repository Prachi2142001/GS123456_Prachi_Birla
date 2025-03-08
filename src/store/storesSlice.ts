import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Store, StoresState } from '../types';

const initialState: StoresState = {
    stores: [],
    loading: false,
    error: null,
    selectedStore: null,
    filters: {
        status: undefined,
        type: undefined,
        searchTerm: undefined,
    },
    sorting: {
        field: 'order',
        direction: 'asc',
    },
};

const storesSlice = createSlice({
    name: 'stores',
    initialState,
    reducers: {
        setStores: (state, action: PayloadAction<Store[]>) => {
            state.stores = action.payload;
        },
        addStore: (state, action: PayloadAction<Store>) => {
            state.stores.push(action.payload);
        },
        updateStore: (state, action: PayloadAction<Store>) => {
            const index = state.stores.findIndex(store => store.id === action.payload.id);
            if (index !== -1) {
                state.stores[index] = action.payload;
            }
        },
        deleteStore: (state, action: PayloadAction<string>) => {
            state.stores = state.stores.filter(store => store.id !== action.payload);
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },
        setSelectedStore: (state, action: PayloadAction<Store | null>) => {
            state.selectedStore = action.payload;
        },
        setFilters: (state, action: PayloadAction<Partial<StoresState['filters']>>) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        setSorting: (state, action: PayloadAction<StoresState['sorting']>) => {
            state.sorting = action.payload;
        },
        clearFilters: (state) => {
            state.filters = initialState.filters;
        },
    },
});

export const {
    setStores,
    addStore,
    updateStore,
    deleteStore,
    setLoading,
    setError,
    setSelectedStore,
    setFilters,
    setSorting,
    clearFilters,
} = storesSlice.actions;

export default storesSlice.reducer;
