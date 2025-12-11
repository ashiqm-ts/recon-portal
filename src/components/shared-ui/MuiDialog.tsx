import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import type { PaperProps } from '@mui/material/Paper';
import Paper from '@mui/material/Paper';
import type { DraggableEventHandler } from 'react-draggable';
import Draggable from 'react-draggable';
import { type ReactNode, useRef, useState } from 'react';
import MuiButton from '@/components/mui-components/button/MuiButton';
import { Typography } from '@mui/material';
import { Form, useFormikContext } from 'formik';

type DialogType = {
  open: boolean;
  onClose: () => void;
  width?: string | number;
  children: React.ReactNode;
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

const MuiDialog: React.FC<DialogType> = ({ open, onClose, width, children, dialogTitle }) => {
  const { resetForm } = useFormikContext();
  const handleCancel = (): void => {
    resetForm();
    onClose();
  };

  return (
    <Dialog
      open={open}
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
      <Form noValidate>
        <DialogContent
          sx={{
            maxHeight: '350px',
            overflow: 'auto',
            marginLeft: '4px',
            paddingTop: '0px',
          }}
        >
          {children}
        </DialogContent>
        <DialogActions sx={{ margin: '10px' }}>
          <MuiButton type="cancel-btn" onClick={handleCancel}>
            Cancel
          </MuiButton>
          <MuiButton type="submit">Submit</MuiButton>
        </DialogActions>
      </Form>
    </Dialog>
  );
};
export default MuiDialog;
