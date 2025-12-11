import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import type { GridApi, Column, FirstDataRenderedEvent, ColDef, PaginationChangedEvent } from 'ag-grid-community';
import { useCallback, useMemo, useRef } from 'react';
import { Search } from 'lucide-react';
import { agGridTheme } from '@/lib/agGridTheme';
import { Box, Grid, InputAdornment } from '@mui/material';
import MuiButton from '../mui-components/button/MuiButton';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import SearchIcon from '@mui/icons-material/Search';
import FormikController from '@/components/mui-components/formik-controller/FormikController';
import { Formik } from 'formik';

ModuleRegistry.registerModules([AllCommunityModule]);

const AgGrid1: React.FC<any> = (props) => {
  const { actionButton } = props;
  const containerStyle = useMemo(() => ({ width: '100%', height: 'auto' }), []);
  const gridStyle = useMemo(() => ({ height: 'auto', width: '100%' }), []);
  const defaultColDef = {
    // filter: true,
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
    gridRef.current!.api.resetRowHeights();
  }, []);

  const onFilterChanged = useCallback((params: any) => {
    params.api.resetRowHeights();
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
  const autoSizeStrategy = useMemo(() => {
    return {
      type: "fitCellContents",
      defaultMaxWidth: 800,
      defaultMinWidth: 100,
    };
  }, []);
  return (
    <Box style={containerStyle} className="ag-theme-balham">
    <Formik initialValues={{search:""}} onSubmit={()=>{}}>
      <Grid container justifyContent="flex-start" alignItems="center" >
        <Grid size={{ xs: 1 }}>
          {actionButton && actionButton?.label && (
            <MuiButton type="basic-btn" className={actionButton.className} onClick={actionButton?.handleActionButton}>
              {/* <GroupAddIcon sx={{ fontSize: "20px", paddingRight: "4px" }} /> */}
              {actionButton?.icon && actionButton.icon}
              {actionButton?.label}
            </MuiButton>
          )}
        </Grid>
         <Grid size={{ xs: 3 }} mb={2}>
          <FormikController
                  id="filter-text-box"
                  control="textField"
                  label="Search"
                  name="search"
                  onInput={onFilterTextChanged}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                         <SearchIcon sx={{ marginBottom:"7px",fontSize:"19px",color:"var(--color-secondary)"}}/>
                        {/* <Search size={17} className="text-[var(--color-secondary)] m-10 p-10"/> */}
                      </InputAdornment>
                    ),
                  }}
                />
         </Grid>
      </Grid>
      </Formik>


      <Box className="rounded-t-lg overflow-hidden" style={gridStyle}>
        <AgGridReact
          ref={gridRef}
          columnDefs={props.columnDefs}
          rowData={props.rowData}
          defaultColDef={defaultColDef}
          pagination={pagination}
          paginationPageSize={paginationPageSize}
          paginationPageSizeSelector={paginationPageSizeSelector}
          theme="legacy"
          rowHeight={35}
          headerHeight={40}
          onFilterChanged={onFilterChanged}
          domLayout="autoHeight"
          overlayNoRowsTemplate="No Rows To Show"
          suppressDragLeaveHidesColumns
          suppressSizeToFit
          autoSizeStrategy={autoSizeStrategy}
          onFirstDataRendered={handleFirstDataRendered}
          onPaginationChanged={handlePaginationChanged}
          {...props}
        />
      </Box>
    </Box>
  );
};
export default AgGrid1;
