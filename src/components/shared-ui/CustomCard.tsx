import { Card } from '@mui/material';
import type { ReactNode } from 'react';

interface PropType {
  children?: ReactNode;
  minHeight?: string;
  borderRadius?: string;
  className?: string;
}

const CustomCard: React.FC<PropType> = (props) => {
  const { children, minHeight, borderRadius, ...rest } = props;
  return (
    <Card
      variant="outlined"
      sx={{
        width: 'calc(100% - 32px)',
        padding: 2,
        margin: 2,
        borderRadius: borderRadius || 0,
        minHeight: minHeight || 'calc(100vh - 130px)',
        boxSizing: 'border-box',
        transition: 'all 0.3s ease',
      }}
      {...rest}
    >
      {children}
    </Card>
  );
};

export default CustomCard;
