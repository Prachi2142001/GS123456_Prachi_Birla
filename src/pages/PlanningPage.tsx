import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AgGridReact } from 'ag-grid-react';
import { ColDef, ValueGetterParams, CellValueChangedEvent } from 'ag-grid-community';
import { RootState } from '../store/store';
import { updatePlanningData, setPlanningData } from '../store/planningSlice';
import { PlanningGridRow } from '../types/planning';

const PlanningPage: React.FC = () => {
  const dispatch = useDispatch();
  const { planningData, loading } = useSelector((state: RootState) => state.planning);
  const { stores } = useSelector((state: RootState) => state.stores);
  const { skus } = useSelector((state: RootState) => state.skus);

  const columnDefs = useMemo<ColDef[]>(() => [
    {
      headerName: 'Store',
      field: 'store',
      minWidth: 120,
      flex: 1,
      resizable: true,
      filter: true,
      sortable: true,
    },
    {
      headerName: 'SKU',
      field: 'sku',
      minWidth: 120,
      flex: 1,
      resizable: true,
      filter: true,
      sortable: true,
    },
    {
      headerName: 'Current Stock',
      field: 'currentStock',
      minWidth: 100,
      flex: 1,
      resizable: true,
      filter: 'agNumberColumnFilter',
      sortable: true,
      type: 'numericColumn',
    },
    {
      headerName: 'Required Stock',
      field: 'requiredStock',
      minWidth: 100,
      flex: 1,
      resizable: true,
      filter: 'agNumberColumnFilter',
      sortable: true,
      type: 'numericColumn',
      editable: true,
    },
    {
      headerName: 'Difference',
      field: 'difference',
      minWidth: 100,
      flex: 1,
      resizable: true,
      valueGetter: (params: ValueGetterParams) => {
        const data = params.data as PlanningGridRow;
        return data.requiredStock - data.currentStock;
      },
      cellStyle: (params): { color: string } => {
        const value = params.value as number;
        return value < 0 ? { color: 'red' } : { color: 'green' };
      },
      type: 'numericColumn',
    },
    {
      field: 'category',
      headerName: 'Category',
      filter: true,
      sortable: true
    },
    {
      field: 'price',
      headerName: 'Price ($)',
      sortable: true,
      type: 'numericColumn'
    },
    {
      field: 'cost',
      headerName: 'Cost ($)',
      sortable: true,
      type: 'numericColumn'
    },
    {
      field: 'units',
      headerName: 'Units',
      editable: true,
      sortable: true,
      type: 'numericColumn'
    },
    {
      field: 'salesUnits',
      headerName: 'Sales Units',
      valueGetter: (params: ValueGetterParams) => {
        const data = params.data as PlanningGridRow;
        return data.units;
      },
      type: 'numericColumn'
    },
    {
      field: 'salesDollars',
      headerName: 'Sales ($)',
      valueGetter: (params: ValueGetterParams) => {
        const data = params.data as PlanningGridRow;
        return (data.units * data.price).toFixed(2);
      },
      type: 'numericColumn'
    },
    {
      field: 'gmDollars',
      headerName: 'GM ($)',
      valueGetter: (params: ValueGetterParams) => {
        const data = params.data as PlanningGridRow;
        return ((data.units * data.price) - (data.units * data.cost)).toFixed(2);
      },
      type: 'numericColumn'
    },
    {
      field: 'gmPercentage',
      headerName: 'GM %',
      valueGetter: (params: ValueGetterParams) => {
        const data = params.data as PlanningGridRow;
        const sales = data.units * data.price;
        const gm = sales - (data.units * data.cost);
        return sales > 0 ? ((gm / sales) * 100).toFixed(1) + '%' : '0%';
      },
      type: 'numericColumn'
    }
  ], []);

  const defaultColDef = useMemo(() => ({
    sortable: true,
    filter: true,
    resizable: true,
  }), []);

  const onCellValueChanged = (event: CellValueChangedEvent) => {
    const updatedRow = {
      ...event.data,
      salesUnits: event.data.units,
      salesDollars: event.data.units * event.data.price,
      gmDollars: (event.data.units * event.data.price) - (event.data.units * event.data.cost),
      gmPercentage: event.data.units > 0 
        ? (((event.data.units * event.data.price) - (event.data.units * event.data.cost)) / (event.data.units * event.data.price)) * 100
        : 0
    };
    dispatch(updatePlanningData(updatedRow));
  };

  useEffect(() => {
    // Initialize planning data if empty
    if (planningData.length === 0) {
      const initialData: PlanningGridRow[] = stores.flatMap(store =>
        skus.map(sku => ({
          id: `${store.id}-${sku.id}`,
          storeId: store.id,
          store: store.name,
          skuId: sku.id,
          sku: sku.name,
          category: sku.category,
          price: sku.price,
          cost: sku.cost,
          quantity: sku.quantity,
          week: new Date().toISOString().split('T')[0],
          units: 0,
          salesUnits: 0,
          salesDollars: 0,
          gmDollars: 0,
          gmPercentage: 0,
          currentStock: 0,
          requiredStock: 0,
          difference: 0
        }))
      );
      dispatch(setPlanningData(initialData));
    }
  }, [stores, skus, planningData.length, dispatch]);

  if (loading) {
    return <div className="p-4">Loading planning data...</div>;
  }

  return (
    <div className="flex flex-col h-full p-4 space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-2 sm:mb-0">Planning Grid</h1>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
          <button className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors w-full sm:w-auto">
            Export to Excel
          </button>
          <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors w-full sm:w-auto">
            Save Changes
          </button>
        </div>
      </div>

      <div className="flex-grow w-full h-[calc(100vh-12rem)] min-h-[400px] bg-white rounded-lg shadow overflow-hidden">
        <div className="ag-theme-alpine w-full h-full">
          <AgGridReact
            rowData={planningData}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            onCellValueChanged={onCellValueChanged}
            animateRows={true}
            rowSelection="multiple"
            enableRangeSelection={true}
            suppressRowClickSelection={true}
            pagination={true}
            paginationPageSize={10}
            domLayout="autoHeight"
          />
        </div>
      </div>
    </div>
  );
};

export default PlanningPage;
