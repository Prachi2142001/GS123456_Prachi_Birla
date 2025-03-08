import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { AgCharts } from 'ag-charts-community';
import { AgChartOptions } from 'ag-charts-community';

interface ChartData {
  category: string;
  sales: number;
  margin: number;
}

const ChartPage: React.FC = () => {
  const { skus } = useSelector((state: RootState) => state.skus);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');
  const chartRef = React.useRef<HTMLDivElement>(null);
  const chartInstance = React.useRef<any>(null);

  useEffect(() => {
    // Aggregate data by category
    const aggregatedData = skus.reduce((acc, sku) => {
      const existingCategory = acc.find(item => item.category === sku.category);
      const margin = ((sku.price - sku.cost) / sku.price) * 100;
      
      if (existingCategory) {
        existingCategory.sales += sku.price * sku.quantity;
        existingCategory.margin = (existingCategory.margin + margin) / 2;
      } else {
        acc.push({
          category: sku.category,
          sales: sku.price * sku.quantity,
          margin: margin
        });
      }
      
      return acc;
    }, [] as ChartData[]);

    setChartData(aggregatedData);
  }, [skus]);

  useEffect(() => {
    if (chartRef.current && chartData.length > 0) {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      const options: AgChartOptions = {
        container: chartRef.current,
        title: {
          text: 'Sales and Margin by Category',
          fontSize: 24,
        },
        data: chartData,
        series: [
          {
            type: 'bar',
            xKey: 'category',
            yKey: 'sales',
            yName: 'Sales ($)',
            fill: '#2563eb',
            strokeWidth: 0,
          },
          {
            type: 'line',
            xKey: 'category',
            yKey: 'margin',
            yName: 'Margin (%)',
            stroke: '#dc2626',
            strokeWidth: 3,
            marker: {
              enabled: true,
              fill: '#dc2626',
            },
          },
        ],
        axes: [
          {
            type: 'category',
            position: 'bottom',
            title: {
              text: 'Category',
            },
          },
          {
            type: 'number',
            position: 'left',
            title: {
              text: 'Sales ($)',
            },
            label: {
              formatter: (params: { value: number }) => {
                return `$${params.value.toLocaleString()}`;
              },
            },
          },
          {
            type: 'number',
            position: 'right',
            title: {
              text: 'Margin (%)',
            },
            label: {
              formatter: (params: { value: number }) => {
                return `${params.value.toFixed(1)}%`;
              },
            },
          },
        ],
        legend: {
          position: 'bottom',
        },
      };

      chartInstance.current = AgCharts.create(options);
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [chartData]);

  return (
    <div className="flex flex-col h-full p-4 space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-2 sm:mb-0">Analytics Dashboard</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => setTimeRange('week')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              timeRange === 'week'
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Week
          </button>
          <button
            onClick={() => setTimeRange('month')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              timeRange === 'month'
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Month
          </button>
          <button
            onClick={() => setTimeRange('year')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              timeRange === 'year'
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Year
          </button>
        </div>
      </div>

      <div className="flex-grow w-full h-[calc(100vh-12rem)] min-h-[400px] bg-white rounded-lg shadow overflow-hidden p-4">
        <div ref={chartRef} className="w-full h-full" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">Total Sales</h3>
          <p className="mt-2 text-3xl font-bold text-indigo-600">
            ${chartData.reduce((sum, item) => sum + item.sales, 0).toLocaleString()}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">Average Margin</h3>
          <p className="mt-2 text-3xl font-bold text-red-600">
            {(chartData.reduce((sum, item) => sum + item.margin, 0) / (chartData.length || 1)).toFixed(1)}%
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">Total Categories</h3>
          <p className="mt-2 text-3xl font-bold text-green-600">
            {chartData.length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">Total SKUs</h3>
          <p className="mt-2 text-3xl font-bold text-yellow-600">
            {skus.length}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChartPage;
