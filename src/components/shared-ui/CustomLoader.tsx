import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

import { useDialog } from '../../provider/DialogProvider';
import type { ReactNode } from 'react';

const CustomLoader = (): ReactNode => {
  const { loader } = useDialog();

  return (
    <Backdrop
      className="z-40"
      sx={{
        color: '#fff',
        zIndex: (theme) => theme.zIndex.modal + 1,
      }}
      open={loader}
    >
      <CircularProgress className="z-40" color="inherit" />
    </Backdrop>
  );
};

export default CustomLoader;
