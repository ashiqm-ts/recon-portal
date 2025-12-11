'use client';

import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CloseIcon from '@mui/icons-material/Close';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Typography, IconButton } from '@mui/material';
import { useDialog } from '../../provider/DialogProvider';
import type { ReactNode } from 'react';

const CustomDialog = (): ReactNode => {
  const { responseMsg, dialog, error, handleResponse } = useDialog();

  const handleClose = (): void => {
    handleResponse('', false);
  };

  return (
    <Dialog
      open={dialog}
      onClose={handleClose}
      PaperProps={{
        className: 'rounded-xl p-4',
      }}
    >
      <DialogTitle className="flex items-center justify-between">
        <Typography component="span" variant="h6" className={`flex items-center gap-2 font-semibold ${error ? 'text-red-600' : 'text-green-600'}`}>
          {error ? <ErrorOutlineIcon /> : <CheckCircleOutlineIcon />}
          {error ? 'Error' : 'Success'}
        </Typography>
        <IconButton onClick={handleClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent className="min-w-[300px]">
        <Typography variant="body1" className="text-gray-800">
          {responseMsg}
        </Typography>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} variant="contained" color="primary" className="normal-case">
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CustomDialog;
