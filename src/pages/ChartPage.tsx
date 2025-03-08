import React, { useEffect, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AgCharts } from 'ag-charts-community';
import type { 
  AgChartOptions, 
  AgBarSeriesOptions, 
  AgLineSeriesOptions,
  AgBarSeriesTooltipRendererParams,
  AgLineSeriesTooltipRendererParams
} from 'ag-charts-community';
import { RootState } from '../store/store';
import { chartService } from '../services/chartService';
import { setStoreMetrics, setSKUMetrics, setLoading, setError } from '../store/chartSlice';

interface StoreMetric {
  storeName: string;
  totalSKUs: number;
  totalValue: number;
}

interface CategoryMetric {
  category: string;
  count: number;
  averagePrice: number;
}

const ChartPage: React.FC = () => {
  const dispatch = useDispatch();
  const { storeMetrics, skuMetrics, loading, error } = useSelector((state: RootState) => state.chart);
  const storeChartRef = React.useRef<HTMLDivElement>(null);
  const categoryChartRef = React.useRef<HTMLDivElement>(null);
  const storeChartInstance = React.useRef<any>(null);
  const categoryChartInstance = React.useRef<any>(null);

  const loadChartData = useCallback(async () => {
    try {
      dispatch(setLoading(true));
      const [storeData, skuData] = await Promise.all([
        chartService.getStoreMetrics(),
        chartService.getSKUMetrics(),
      ]);
      dispatch(setStoreMetrics(storeData));
      dispatch(setSKUMetrics(skuData));
    } catch (err) {
      dispatch(setError(err instanceof Error ? err.message : 'Failed to load chart data'));
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  useEffect(() => {
    loadChartData();
  }, [loadChartData]);

  const options: AgChartOptions = useMemo(() => ({
    container: storeChartRef.current!,
    autoSize: true,
    title: {
      text: 'Store Performance Overview',
      fontSize: 20,
      fontWeight: 'bold',
    },
    background: {
      fill: '#ffffff',
    },
    data: storeMetrics,
    series: [
      {
        type: 'bar',
        xKey: 'storeName',
        yKey: 'totalSKUs',
        yName: 'Total SKUs',
        fill: '#2563eb',
        tooltip: {
          renderer: (params: AgBarSeriesTooltipRendererParams<StoreMetric>) => {
            return `Total SKUs: ${params.datum.totalSKUs}`;
          },
        },
      } as AgBarSeriesOptions<StoreMetric>,
      {
        type: 'line',
        xKey: 'storeName',
        yKey: 'totalValue',
        yName: 'Total Value ($)',
        stroke: '#dc2626',
        marker: {
          fill: '#dc2626',
          stroke: '#dc2626',
        },
        tooltip: {
          renderer: (params: AgLineSeriesTooltipRendererParams<StoreMetric>) => {
            return `Total Value: ${new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
            }).format(params.datum.totalValue)}`;
          },
        },
      } as AgLineSeriesOptions<StoreMetric>,
    ],
    axes: [
      {
        type: 'category',
        position: 'bottom',
        title: {
          text: 'Store',
          fontSize: 14,
        },
      },
      {
        type: 'number',
        position: 'left',
        title: {
          text: 'Total SKUs',
          fontSize: 14,
        },
        keys: ['totalSKUs'],
      },
      {
        type: 'number',
        position: 'right',
        title: {
          text: 'Total Value ($)',
          fontSize: 14,
        },
        keys: ['totalValue'],
        label: {
          formatter: (params: { value: number }) => 
            new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
            }).format(params.value),
        },
      },
    ],
    legend: {
      position: 'bottom',
      spacing: 40,
    },
  }), [storeMetrics]);

  const categoryOptions: AgChartOptions = useMemo(() => ({
    container: categoryChartRef.current!,
    autoSize: true,
    title: {
      text: 'SKU Category Analysis',
      fontSize: 20,
      fontWeight: 'bold',
    },
    background: {
      fill: '#ffffff',
    },
    data: skuMetrics,
    series: [
      {
        type: 'bar',
        xKey: 'category',
        yKey: 'count',
        yName: 'SKU Count',
        fill: '#0891b2',
        tooltip: {
          renderer: (params: AgBarSeriesTooltipRendererParams<CategoryMetric>) => {
            return `SKU Count: ${params.datum.count}`;
          },
        },
      } as AgBarSeriesOptions<CategoryMetric>,
      {
        type: 'line',
        xKey: 'category',
        yKey: 'averagePrice',
        yName: 'Average Price ($)',
        stroke: '#4f46e5',
        marker: {
          fill: '#4f46e5',
          stroke: '#4f46e5',
        },
        tooltip: {
          renderer: (params: AgLineSeriesTooltipRendererParams<CategoryMetric>) => {
            return `Average Price: ${new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
            }).format(params.datum.averagePrice)}`;
          },
        },
      } as AgLineSeriesOptions<CategoryMetric>,
    ],
    axes: [
      {
        type: 'category',
        position: 'bottom',
        title: {
          text: 'Category',
          fontSize: 14,
        },
      },
      {
        type: 'number',
        position: 'left',
        title: {
          text: 'SKU Count',
          fontSize: 14,
        },
        keys: ['count'],
      },
      {
        type: 'number',
        position: 'right',
        title: {
          text: 'Average Price ($)',
          fontSize: 14,
        },
        keys: ['averagePrice'],
        label: {
          formatter: (params: { value: number }) => 
            new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
            }).format(params.value),
        },
      },
    ],
    legend: {
      position: 'bottom',
      spacing: 40,
    },
  }), [skuMetrics]);

  useEffect(() => {
    if (storeChartRef.current && storeMetrics.length > 0) {
      if (storeChartInstance.current) {
        storeChartInstance.current.destroy();
      }
      storeChartInstance.current = AgCharts.create(options);
    }
    return () => {
      if (storeChartInstance.current) {
        storeChartInstance.current.destroy();
      }
    };
  }, [options, storeMetrics]);

  useEffect(() => {
    if (categoryChartRef.current && skuMetrics.length > 0) {
      if (categoryChartInstance.current) {
        categoryChartInstance.current.destroy();
      }
      categoryChartInstance.current = AgCharts.create(categoryOptions);
    }
    return () => {
      if (categoryChartInstance.current) {
        categoryChartInstance.current.destroy();
      }
    };
  }, [categoryOptions, skuMetrics]);

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Analytics Dashboard</h1>
        <p className="mt-2 text-gray-600">Visualizing store performance and SKU metrics</p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div ref={storeChartRef} style={{ height: '400px' }} />
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div ref={categoryChartRef} style={{ height: '400px' }} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ChartPage;
