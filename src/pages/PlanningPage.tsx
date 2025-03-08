import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AgGridReact } from 'ag-grid-react';
import { ColDef, ValueGetterParams, CellValueChangedEvent, IAggFuncParams } from 'ag-grid-community';
import { RootState } from '../store/store';
import { updatePlanningData } from '../store/planningSlice';
import { PlanningGridRow, WeekData } from '../types/planning';
import { format } from 'date-fns';

const PlanningPage: React.FC = () => {
  const dispatch = useDispatch();
  const { planningData } = useSelector((state: RootState) => state.planning);
  const { skus } = useSelector((state: RootState) => state.skus);
  const { stores } = useSelector((state: RootState) => state.stores);

  // Generate weeks for the current year
  const weeks = useMemo(() => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const weeks: string[] = [];
    for (let week = 1; week <= 52; week++) {
      weeks.push(`${year}-W${week.toString().padStart(2, '0')}`);
    }
    return weeks;
  }, []);

  // Create column groups by month
  const columnDefs = useMemo(() => {
    const baseColumns: ColDef[] = [
      {
        headerName: 'Store',
        field: 'store',
        pinned: 'left',
        filter: true,
      },
      {
        headerName: 'SKU',
        field: 'sku',
        pinned: 'left',
        filter: true,
      },
      {
        headerName: 'Price',
        field: 'price',
        pinned: 'left',
      },
      {
        headerName: 'Cost',
        field: 'cost',
        pinned: 'left',
      },
    ];

    const weekCols: ColDef[] = [];
    let currentMonth = '';
    let monthGroup: ColDef[] = [];

    weeks.forEach(week => {
      const date = new Date(week.replace('W', '-').replace('-', '/'));
      const month = format(date, 'MMMM yyyy');

      if (currentMonth && month !== currentMonth) {
        weekCols.push({
          headerName: currentMonth,
          children: monthGroup,
        } as ColDef);
        monthGroup = [];
      }
      currentMonth = month;

      const weekColumns: ColDef[] = [
        {
          headerName: 'Units',
          field: `units_${week}`,
          editable: true,
          type: 'numericColumn',
        },
        {
          headerName: 'Sales',
          field: `sales_${week}`,
          valueGetter: (params: ValueGetterParams) => {
            const units = params.data[`units_${week}`] || 0;
            const price = params.data.price || 0;
            return units * price;
          },
        },
        {
          headerName: 'GM',
          field: `gm_${week}`,
          valueGetter: (params: ValueGetterParams) => {
            const units = params.data[`units_${week}`] || 0;
            const price = params.data.price || 0;
            const cost = params.data.cost || 0;
            return units * (price - cost);
          },
        },
      ];

      monthGroup.push({
        headerName: `Week ${week.split('-W')[1]}`,
        children: weekColumns,
      } as ColDef);
    });

    // Add the last month group
    if (monthGroup.length > 0) {
      weekCols.push({
        headerName: currentMonth,
        children: monthGroup,
      } as ColDef);
    }

    return [...baseColumns, ...weekCols];
  }, [weeks]);

  // Prepare grid data
  const rowData = useMemo(() => {
    const data: PlanningGridRow[] = [];

    stores.forEach(store => {
      skus.forEach(sku => {
        const row: PlanningGridRow = {
          id: `${store.id}-${sku.id}`,
          store: store.name,
          sku: sku.name,
          price: sku.price,
          cost: sku.cost,
        };

        weeks.forEach(week => {
          const weekData: WeekData = planningData[store.id]?.[sku.id]?.[week] || { units: 0 };
          (row as any)[`units_${week}`] = weekData.units;
        });

        data.push(row);
      });
    });

    return data;
  }, [stores, skus, planningData, weeks]);

  const defaultColDef = {
    resizable: true,
    filter: true,
    sortable: true,
    minWidth: 100,
    suppressMenu: true,
  };

  const gridOptions = {
    enableRangeSelection: true,
    enableFillHandle: true,
    suppressCopyRowsToClipboard: true,
  };

  const onCellValueChanged = (event: CellValueChangedEvent) => {
    const [storeId, skuId] = event.data.id.split('-');
    const weekId = event.colDef.field?.replace('units_', '') || '';
    
    if (weekId && event.newValue !== event.oldValue) {
      dispatch(updatePlanningData({
        storeId,
        skuId,
        weekId,
        data: { units: event.newValue || 0 },
      }));
    }
  };

  return (
    <div className="h-full w-full p-4">
      <div className="ag-theme-alpine h-full w-full">
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          onCellValueChanged={onCellValueChanged}
          gridOptions={gridOptions}
          suppressAggFilteredOnly={true}
        />
      </div>
    </div>
  );
};

export default PlanningPage;
