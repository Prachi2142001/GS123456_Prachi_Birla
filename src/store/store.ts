import { configureStore } from '@reduxjs/toolkit';
import storesReducer from './storesSlice';
import skusReducer from './skusSlice';
import planningReducer from './planningSlice';

export const store = configureStore({
    reducer: {
        stores: storesReducer,
        skus: skusReducer,
        planning: planningReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
