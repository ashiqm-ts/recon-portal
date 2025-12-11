import type { GridProps } from '@mui/material';
import { Grid } from '@mui/material';
import type { ReactNode } from 'react';

type GridItemProps = GridProps & {
  children?: ReactNode;
  xs?: number;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
};

const GridItem: React.FC<GridItemProps> = ({ children, ...rest }) => {
  const { xs, sm, md, lg, xl, ...other } = rest;
  return (
    <Grid size={{ xs: xs, sm: sm, md: md, lg: lg, xl: xl }}  {...other}>
      {children}
    </Grid>
  );
};

export default GridItem;
