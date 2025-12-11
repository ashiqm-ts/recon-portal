import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModule, ModuleRegistry, type FirstDataRenderedEvent, type GridSizeChangedEvent, type PaginationChangedEvent, type Column, type AgGridEvent } from 'ag-grid-community';
import { type ReactNode, useCallback, useMemo, useRef } from 'react';
import { Search } from 'lucide-react';
import { Box } from '@mui/material';
import { FilterIcon } from '@/helper-function/pageUtils';
import { agGridTheme } from '@/lib/agGridTheme';
import { useDialogStore } from '../store.js/useDialogStore';

ModuleRegistry.registerModules([AllCommunityModule]);

interface GridTypes {
  columnDefs: { [x: string]: unknown }[];
  rowData: { [x: string]: unknown }[];
}

const AgGrid = ({ columnDefs, rowData, ...props }: GridTypes): ReactNode => {
  const containerStyle = useMemo(() => ({ width: '100%', height: '100%' }), []);
  const gridStyle = useMemo(() => ({ height: '50%', width: '100%' }), []);
  const { openCustomDialog } = useDialogStore();

  const defaultColDef = {
    filter: true,
    resizable: true,
    sortable: true,
    wrapText: true,
    wrapHeaderText: true,
    minWidth: 150,
    maxWidth: 800,
    headerStyle: { fontSize: '14px' },
    autoHeight: true,
    headerClass: 'custom-header-center',
    icons: {
      filter: FilterIcon,
    },
    cellStyle: (params: { value: number }): { textAlign: string; paddingTop: string } => {
      const isNumber = typeof params.value === 'number';
      return {
        textAlign: isNumber ? 'right' : 'left',
        paddingTop: '5px',
      };
    },
  };

  const gridRef = useRef<AgGridReact>(null);
  const pagination = true;
  const paginationPageSize = 10;
  const paginationPageSizeSelector = [10, 20, 50, 100];
  const handleRowDoubleClicked = (event: { data: string | number | boolean }) => {
    openCustomDialog(event?.data);
  };

  const onFilterTextChanged = useCallback(() => {
    gridRef.current!.api.setGridOption('quickFilterText', (document.getElementById('filter-text-box') as HTMLInputElement).value);
  }, []);

  const onFirstDataRendered = useCallback((params: FirstDataRenderedEvent | GridSizeChangedEvent | PaginationChangedEvent | AgGridEvent) => {
    const columns = params.api.getColumns() as Column[];
    if (!columns) return;
    params.api.autoSizeColumns(columns.map((column) => column.getId()));

    const columnStates = params.api.getColumnState();
    const totalColumnWidth = columns.reduce((acc, column) => {
      const colState = columnStates.find((c) => c.colId === column.getColId());
      return acc + (colState?.width ?? 0);
    }, 0);

    const gridWidth = document.querySelector('.ag-body-viewport')?.clientWidth || 0;

    const isFullWidth = totalColumnWidth >= gridWidth;
    if (isFullWidth) {
      params.api.autoSizeColumns(columns.map((column) => column.getId()));
    } else {
      params.api.sizeColumnsToFit();
    }
  }, []);
  return (
    <Box style={containerStyle} className="ag-theme-balham">
      <Box mb={2} className="flex items-center gap-2">
        <Box py={0.5} ml={1} className="flex items-center gap-2 border-0 border-b border-[#9BBCC1] outline-none text-sm bg-transparent focus:border-b-2 focus:border-[var(--color-secondary)]">
          <input id="filter-text-box" type="text" placeholder="Search" onInput={onFilterTextChanged} className="text-sm focus:outline-none w-40" />
          <Search size={16} className="text-[var(--color-secondary)]" />
        </Box>
      </Box>
      <Box style={gridStyle}>
        <AgGridReact
          ref={gridRef}
          columnDefs={columnDefs}
          rowData={rowData}
          defaultColDef={defaultColDef}
          pagination={pagination}
          paginationPageSize={paginationPageSize}
          paginationPageSizeSelector={paginationPageSizeSelector}
          rowHeight={35}
          theme={agGridTheme}
          headerHeight={40}
          domLayout="autoHeight"
          overlayNoRowsTemplate="No Rows To Show"
          onFirstDataRendered={(params) => onFirstDataRendered(params)}
          onPaginationChanged={(params) => onFirstDataRendered(params)}
          onGridSizeChanged={(params) => onFirstDataRendered(params)}
          onRowDoubleClicked={handleRowDoubleClicked}
          {...props}
        />
      </Box>
    </Box>
  );
};
export default AgGrid;
