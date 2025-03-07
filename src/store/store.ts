import { configureStore } from '@reduxjs/toolkit';
import storesReducer from './storesSlice';
import skusReducer from './skusSlice';
import planningReducer from './planningSlice';
import authReducer from './authSlice';

export const store = configureStore({
  reducer: {
    stores: storesReducer,
    skus: skusReducer,
    planning: planningReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
