import { Card } from '@mui/material';
import type { ReactNode } from 'react';

interface PropType {
  children: ReactNode;
}

const CardComponent = ({ children, ...rest }: PropType): ReactNode => {
  return (
    <Card variant="outlined" sx={{ width: 'auto', padding: 4, m: 4, borderRadius: 0, minHeight: '500px' }} {...rest}>
      {children}
    </Card>
  );
};
export default CardComponent;
