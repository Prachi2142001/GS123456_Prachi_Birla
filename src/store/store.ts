import { configureStore } from '@reduxjs/toolkit';
import storesReducer from './storesSlice';
import skusReducer from './skusSlice';
import planningReducer from './planningSlice';
import authReducer from './authSlice';
import chartReducer from './chartSlice';

export const store = configureStore({
  reducer: {
    stores: storesReducer,
    skus: skusReducer,
    planning: planningReducer,
    auth: authReducer,
    chart: chartReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
