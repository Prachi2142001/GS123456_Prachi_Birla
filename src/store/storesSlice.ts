import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Store, StoresState } from '../types';

const initialState: StoresState = {
    stores: [],
    loading: false,
    error: null,
};

const storesSlice = createSlice({
    name: 'stores',
    initialState,
    reducers: {
        addStore: (state, action: PayloadAction<Store>) => {
            state.stores.push(action.payload);
        },
        updateStore: (state, action: PayloadAction<Store>) => {
            const index = state.stores.findIndex(store => store.id === action.payload.id);
            if (index !== -1) {
                state.stores[index] = action.payload;
            }
        },
        removeStore: (state, action: PayloadAction<string>) => {
            state.stores = state.stores.filter(store => store.id !== action.payload);
        },
        reorderStores: (state, action: PayloadAction<Store[]>) => {
            state.stores = action.payload;
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
    addStore,
    updateStore,
    removeStore,
    reorderStores,
    setLoading,
    setError,
} = storesSlice.actions;

export default storesSlice.reducer;
