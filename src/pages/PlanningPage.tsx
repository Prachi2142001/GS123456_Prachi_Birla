import React, { useCallback, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AgGridReact } from 'ag-grid-react';
import { ColDef, CellValueChangedEvent } from 'ag-grid-community';
import { RootState } from '../store/store';
import { Store, SKU, WeekData } from '../types';
import { updatePlanningData } from '../store/planningSlice';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import './PlanningPage.css';

interface PlanningRowData {
  storeId: string;
  skuId: string;
  store: string;
  sku: string;
  weekId: string;
  salesUnits: number;
  salesDollars: number;
  gmDollars: number;
  gmPercentage: number;
}

const PlanningPage: React.FC = () => {
  const dispatch = useDispatch();
  const { stores } = useSelector((state: RootState) => state.stores);
  const { skus } = useSelector((state: RootState) => state.skus);
  const { planningData } = useSelector((state: RootState) => state.planning);

  const columnDefs = useMemo<ColDef[]>(() => [
    { 
      field: 'store',
      headerName: 'Store',
      filter: true,
      sortable: true,
      editable: false,
      width: 150 
    },
    { 
      field: 'sku',
      headerName: 'SKU',
      filter: true,
      sortable: true,
      editable: false,
      width: 150 
    },
    { 
      field: 'weekId',
      headerName: 'Week',
      filter: true,
      sortable: true,
      editable: false,
      width: 100 
    },
    { 
      field: 'salesUnits',
      headerName: 'Sales Units',
      filter: 'agNumberColumnFilter',
      sortable: true,
      editable: true,
      type: 'numericColumn',
      width: 120,
      valueParser: params => Number(params.newValue)
    },
    { 
      field: 'salesDollars',
      headerName: 'Sales ($)',
      filter: 'agNumberColumnFilter',
      sortable: true,
      editable: true,
      type: 'numericColumn',
      valueFormatter: params => `$${params.value.toFixed(2)}`,
      valueParser: params => Number(params.newValue),
      width: 120 
    },
    { 
      field: 'gmDollars',
      headerName: 'GM ($)',
      filter: 'agNumberColumnFilter',
      sortable: true,
      editable: true,
      type: 'numericColumn',
      valueFormatter: params => `$${params.value.toFixed(2)}`,
      valueParser: params => Number(params.newValue),
      width: 120 
    },
    { 
      field: 'gmPercentage',
      headerName: 'GM %',
      filter: 'agNumberColumnFilter',
      sortable: true,
      editable: false,
      type: 'numericColumn',
      valueFormatter: params => `${params.value.toFixed(2)}%`,
      width: 100 
    }
  ], []);

  const rowData = useMemo(() => {
    const data: PlanningRowData[] = [];
    
    stores.forEach(store => {
      skus.forEach(sku => {
        const storeData = planningData[store.id];
        if (storeData) {
          const skuData = storeData[sku.id];
          if (skuData) {
            Object.entries(skuData).forEach(([weekId, weekData]) => {
              data.push({
                storeId: store.id,
                skuId: sku.id,
                store: store.name,
                sku: sku.name,
                weekId,
                ...weekData
              });
            });
          }
        }
      });
    });
    
    return data;
  }, [stores, skus, planningData]);

  const defaultColDef = useMemo(() => ({
    resizable: true,
    filter: true,
    suppressKeyboardEvent: (params: any) => {
      // Allow keyboard navigation
      return false;
    }
  }), []);

  const onCellValueChanged = useCallback((event: CellValueChangedEvent) => {
    const data = event.data as PlanningRowData;
    const field = event.column.getColId();
    const newValue = event.newValue;

    if (field === 'salesUnits' || field === 'salesDollars' || field === 'gmDollars') {
      dispatch(updatePlanningData({
        storeId: data.storeId,
        skuId: data.skuId,
        weekId: data.weekId,
        data: {
          [field]: newValue
        }
      }));
    }
  }, [dispatch]);

  return (
    <div className="planning-page">
      <h1>Planning Grid</h1>
      <div className="ag-theme-alpine" style={{ height: 'calc(100vh - 200px)', width: '100%' }}>
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          animateRows={true}
          onCellValueChanged={onCellValueChanged}
          enableRangeSelection={true}
          enableFillHandle={true}
          undoRedoCellEditing={true}
          undoRedoCellEditingLimit={20}
        />
      </div>
    </div>
  );
};

export default PlanningPage;
