import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import type { GridApi, Column, FirstDataRenderedEvent, ColDef, PaginationChangedEvent } from 'ag-grid-community';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import { useCallback, useMemo, useRef } from 'react';
import { Search } from 'lucide-react';
import { Box } from '@mui/material';
import MuiButton from '../mui-components/button/MuiButton';

ModuleRegistry.registerModules([AllCommunityModule]);

const CustomGrid: React.FC<any> = (props) => {
  const { actionButton } = props;
  const containerStyle = useMemo(() => ({ width: '100%', height: '100%' }), []);
  const gridStyle = useMemo(() => ({ height: '50%', width: '100%' }), []);

  const defaultColDef = {
    filter: true,
    resizable: true,
    sortable: true,
    wrapText: true,
    wrapHeaderText: true,
    minWidth: 100,
    maxWidth: 800,
    headerStyle: { fontSize: '14px' },
    autoHeight: true,
    headerClass: 'custom-header-center',
    cellStyle: (params: any) => {
      const isNumber = typeof params.value === 'number';
      return {
        textAlign: isNumber ? 'right' : 'left',
        paddingTop: '5px',
      };
    },
  };

  const gridRef = useRef<AgGridReact>(null);
  const columnApiRef = useRef<Column | null>(null);
  const pagination = true;
  const paginationPageSize = 10;
  const paginationPageSizeSelector = [10, 20, 50, 100];

  const onFilterTextChanged = useCallback(() => {
    gridRef.current!.api.setGridOption('quickFilterText', (document.getElementById('filter-text-box') as HTMLInputElement).value);
  }, []);

  const autoSizeColumns = useCallback(({ api, columnApi }: { api: GridApi; columnApi: any }) => {
    const columns = columnApi.getColumns();
    if (!columns) return;

    setTimeout(() => {
      columnApi.autoSizeColumns(columns.map((col: { getId: () => any }) => col.getId()));

      const totalColumnWidth = columns.reduce((acc: any, col: { getColId: () => any }) => {
        const state = columnApi.getColumnState().find((c: { colId: any }) => c.colId === col.getColId());
        return acc + (state?.width || 0);
      }, 0);

      const gridWidth = document.querySelector('.ag-body-viewport')?.clientWidth || 0;

      const isFullWidth = totalColumnWidth >= gridWidth;

      if (isFullWidth && columns.length >= 5) {
        columnApi.autoSizeColumns(columns.map((col: { getId: () => any }) => col.getId()));
      } else {
        api.sizeColumnsToFit();
      }
    }, 10);
  }, []);

  const handleFirstDataRendered = useCallback(
    (params: FirstDataRenderedEvent) => {
      if (columnApiRef.current) {
        autoSizeColumns({ api: params.api, columnApi: columnApiRef.current });
      }
    },
    [autoSizeColumns]
  );

  const handlePaginationChanged = useCallback(
    (params: PaginationChangedEvent) => {
      if (columnApiRef.current) {
        autoSizeColumns({ api: params.api, columnApi: columnApiRef.current });
      }
    },
    [autoSizeColumns]
  );
  return (
    <Box style={containerStyle} className="ag-theme-balham">
      <Box mb={2} className="flex items-center gap-2">
        {actionButton && actionButton?.label && (
          <MuiButton type="basic-btn" className={actionButton.className} onClick={actionButton?.handleActionButton}>
            {actionButton && actionButton?.addIcon && <GroupAddIcon sx={{ fontSize: '20px', paddingRight: '4px' }} />}
            {actionButton?.label}
          </MuiButton>
        )}
        <Box py={0.5} ml={1} className="flex items-center gap-2 border-0 border-b border-[#9BBCC1] outline-none text-sm bg-transparent focus:border-b-2 focus:border-[var(--color-secondary)]">
          <input id="filter-text-box" type="text" placeholder="Search" onInput={onFilterTextChanged} className="text-sm focus:outline-none w-40" />
          <Search size={16} className="text-[var(--color-secondary)]" />
        </Box>
      </Box>
      <Box style={gridStyle}>
        <AgGridReact
          ref={gridRef}
          columnDefs={props.columnDefs}
          rowData={props.rowData}
          defaultColDef={defaultColDef}
          pagination={pagination}
          paginationPageSize={paginationPageSize}
          paginationPageSizeSelector={paginationPageSizeSelector}
          rowHeight={35}
          theme="legacy"
          headerHeight={45}
          domLayout="autoHeight"
          overlayNoRowsTemplate="No Rows To Show"
          onFirstDataRendered={handleFirstDataRendered}
          onPaginationChanged={handlePaginationChanged}
        />
      </Box>
    </Box>
  );
};
export default CustomGrid;
