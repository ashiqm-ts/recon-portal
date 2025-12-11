import { Button } from '@mui/material';
import type { ReactNode } from 'react';
interface ButtonProp {
  children?: ReactNode;
  disabled?: boolean;
  variant?: 'contained' | 'outlined';
  size?: 'small' | 'medium' | 'large';
  sx?: () => void;
  onClick?: () => void;
  className?: string;
}
const GridBtn = ({ children, disabled, className, onClick, variant = 'contained', size = 'small' }: ButtonProp): ReactNode => {
  return (
    <Button
      variant={variant}
      size={size}
      disabled={disabled}
      className={className}
      onClick={onClick}
      sx={{
        textTransform: 'none',
        color: 'var(--color-accent)',
        width: '110px',
        height: '25px',
        borderRadius: '10px',
        backgroundColor: 'var(--color-secondary)',
        '&:hover': {
          color: 'var(--color-primary)',
          backgroundColor: 'var(--color-accent1)',
        },
      }}
    >
      {children}
    </Button>
  );
};

export default GridBtn;
