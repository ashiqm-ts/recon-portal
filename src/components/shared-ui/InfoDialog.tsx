import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import type { PaperProps } from '@mui/material/Paper';
import Paper from '@mui/material/Paper';
import type { DraggableEventHandler } from 'react-draggable';
import Draggable from 'react-draggable';
import type { ReactNode } from 'react';
import { useRef, useState } from 'react';
import MuiButton from '@/components/mui-components/button/MuiButton';
import { Typography } from '@mui/material';
import { useDialogStore } from '../store.js/useDialogStore';
import MuiTypography from '../mui-components/typography/MuiTypography';
import GridContainer from '../mui-components/grid/GridContainer';
import GridItem from '../mui-components/grid/GridItem';

type DialogType = {
  open?: boolean;
  columnDefs?: {
    field: string;
    headerName: string;
    valueGetter?: (params: any) => any;
  }[];
  width?: string | number;
  children?: React.ReactNode;
  dialogTitle?: string;
};

function PaperComponent(props: PaperProps): ReactNode {
  const nodeRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleStop: DraggableEventHandler = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <Draggable nodeRef={nodeRef} handle="#draggable-dialog-title" cancel={'[class*="MuiDialogContent-root"]'} position={position} onStop={handleStop}>
      <Paper {...props} ref={nodeRef} />
    </Draggable>
  );
}

const InfoDialog: React.FC<DialogType> = ({ width = 800, dialogTitle, columnDefs }) => {
  const { isOpen, content, closeDialog } = useDialogStore();

  const handleCancel = () => {
    closeDialog();
  };
  console.log('content,', content);
  const renderRowDetails = (row: unknown) => {
    console.log(columnDefs);
    return (
      <GridContainer spacing={2} mb={1}>
        {columnDefs?.map((col) => {
          let value;

          if (col.valueGetter) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            value = col.valueGetter({ data: row });
          } else if (col.field) {
            const fieldParts = col.field.split('.');
            value = fieldParts.reduce<unknown>((acc, key) => {
              if (acc && typeof acc === 'object' && key in acc) {
                return (acc as Record<string, unknown>)[key];
              }
              return undefined;
            }, row);
          } else {
            value = undefined;
          }
          if (!value) return null;
          console.log(value);
          console.log(col);
          return (
            <GridItem md={4} sm={6} xs={12} key={col.field}>
              <MuiTypography variant="h3">{col.headerName}</MuiTypography>
              <MuiTypography variant="body1">{value !== undefined && value !== null ? String(value) : '-'}</MuiTypography>
            </GridItem>
          );
        })}
      </GridContainer>
    );
  };

  return (
    <Dialog
      open={isOpen}
      PaperComponent={PaperComponent}
      sx={{
        '& .MuiDialog-container': {
          '& .MuiPaper-root': {
            width: '100%',
            maxWidth: width,
            minWidth: width,
            borderRadius: '10px',

            '@media (max-width:600px)': {
              width: '75%',
              minWidth: '75%',
            },
            '@media (max-width:960px)': {
              width: '75%',
              minWidth: '75%',
            },
            '@media (min-width:960px)': {
              width: '500px',
            },
          },
        },
      }}
    >
      <DialogTitle sx={{ cursor: 'pointer' }} id="draggable-dialog-title">
        <Typography fontSize={18} fontWeight={600} mt={1}>
          {dialogTitle}
        </Typography>
      </DialogTitle>

      <DialogContent
        sx={{
          maxHeight: '350px',
          overflow: 'auto',
          marginLeft: '4px',
          paddingTop: '0px',
        }}
      >
        {renderRowDetails(content)}
      </DialogContent>
      <DialogActions sx={{ margin: '10px' }}>
        <MuiButton type="cancel-btn" onClick={handleCancel}>
          Cancel
        </MuiButton>
      </DialogActions>
    </Dialog>
  );
};
export default InfoDialog;
