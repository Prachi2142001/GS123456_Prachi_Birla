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
          gmPercentage: 0
        }))
      );
      dispatch(setPlanningData(initialData));
    }
  }, [stores, skus, planningData.length, dispatch]);

  const columnDefs = useMemo<ColDef[]>(() => [
    { 
      field: 'store',
      headerName: 'Store',
      filter: true,
      sortable: true
    },
    { 
      field: 'sku',
      headerName: 'SKU',
      filter: true,
      sortable: true
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
    flex: 1,
    minWidth: 100,
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

  if (loading) {
    return <div className="p-4">Loading planning data...</div>;
  }

  return (
    <div className="p-4 h-full">
      <h1 className="text-2xl font-bold mb-4">Planning Grid</h1>
      <div className="ag-theme-alpine h-[calc(100vh-200px)]">
        <AgGridReact
          rowData={planningData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          onCellValueChanged={onCellValueChanged}
          enableRangeSelection={true}
          animateRows={true}
        />
      </div>
    </div>
  );
};

export default PlanningPage;
