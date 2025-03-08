import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AgGridReact } from 'ag-grid-react';
import { ColDef, ValueGetterParams, CellValueChangedEvent } from 'ag-grid-community';
import { RootState } from '../store/store';
import { updatePlanningRow, calculateDifferences, setPlanningData } from '../store/planningSlice';
import { PlanningGridRow } from '../types/planning';

const PlanningPage: React.FC = () => {
  const dispatch = useDispatch();
  const { planningData, loading, error } = useSelector((state: RootState) => state.planning);
  const { stores } = useSelector((state: RootState) => state.stores);
  const { skus } = useSelector((state: RootState) => state.skus);

  useEffect(() => {
    dispatch(calculateDifferences());
  }, [dispatch]);

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
      field: 'category',
      headerName: 'Category',
      filter: true,
      sortable: true
    },
    {
      field: 'price',
      headerName: 'Price ($)',
      sortable: true,
      type: 'numericColumn',
      valueFormatter: (params: any) => `$${params.value.toFixed(2)}`
    },
    {
      field: 'cost',
      headerName: 'Cost ($)',
      sortable: true,
      type: 'numericColumn',
      valueFormatter: (params: any) => `$${params.value.toFixed(2)}`
    },
    {
      field: 'week',
      headerName: 'Week',
      filter: true,
      sortable: true
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
      type: 'numericColumn',
      valueFormatter: (params: any) => `$${params.value.toFixed(2)}`
    },
    {
      field: 'gmDollars',
      headerName: 'GM ($)',
      valueGetter: (params: ValueGetterParams) => {
        const data = params.data as PlanningGridRow;
        return ((data.units * data.price) - (data.units * data.cost)).toFixed(2);
      },
      type: 'numericColumn',
      valueFormatter: (params: any) => `$${params.value.toFixed(2)}`
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
      type: 'numericColumn',
      valueFormatter: (params: any) => `${params.value.toFixed(1)}%`
    },
    {
      field: 'currentStock',
      headerName: 'Current Stock',
      sortable: true,
      type: 'numericColumn'
    },
    {
      field: 'requiredStock',
      headerName: 'Required Stock',
      editable: true,
      sortable: true,
      type: 'numericColumn'
    },
    {
      field: 'difference',
      headerName: 'Difference',
      valueGetter: (params: ValueGetterParams) => {
        const data = params.data as PlanningGridRow;
        return data.requiredStock - data.currentStock;
      },
      type: 'numericColumn',
      cellStyle: (params): { color: string } => {
        const value = params.value as number;
        return value < 0 ? { color: 'red' } : { color: 'green' };
      }
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
    dispatch(updatePlanningRow(updatedRow));
    dispatch(calculateDifferences());
  };

  if (loading) {
    return <div className="flex items-center justify-center h-full">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  return (
    <div className="h-full p-4">
      <h1 className="text-2xl font-bold mb-4">Planning Grid</h1>
      <div className="ag-theme-alpine h-[calc(100vh-200px)]">
        <AgGridReact
          rowData={planningData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          animateRows={true}
          rowSelection="multiple"
          onCellValueChanged={onCellValueChanged}
        />
      </div>
    </div>
  );
};

export default PlanningPage;
