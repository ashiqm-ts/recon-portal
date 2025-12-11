import type { GridProps } from '@mui/material';
import { Grid } from '@mui/material';
import type { ReactNode } from 'react';

type GridContainerProps = GridProps & {
  children: ReactNode;
};

const GridContainer: React.FC<GridContainerProps> = ({ children, spacing = 2, ...rest }) => {
  return (
    <Grid container spacing={spacing} {...rest}>
      {children}
    </Grid>
  );
};

export default GridContainer;
