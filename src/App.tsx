import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import Layout from './components/layout/Layout';
import './App.css';

// Lazy load pages for better performance
const StoresPage = React.lazy(() => import('./pages/StoresPage'));
const SKUsPage = React.lazy(() => import('./pages/SKUsPage'));
const PlanningPage = React.lazy(() => import('./pages/PlanningPage'));
const ChartPage = React.lazy(() => import('./pages/ChartPage'));

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <React.Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Navigate to="/stores" replace />} />
              <Route path="stores" element={<StoresPage />} />
              <Route path="skus" element={<SKUsPage />} />
              <Route path="planning" element={<PlanningPage />} />
              <Route path="chart" element={<ChartPage />} />
            </Route>
          </Routes>
        </React.Suspense>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
