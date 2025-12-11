import { Button } from '@mui/material';
import type { ReactNode } from 'react';

interface ButtonProp {
  children?: ReactNode;
  disabled?: boolean;
  variant?: 'contained' | 'outlined';
  size?: 'small' | 'medium' | 'large';
  onClick?: () => void;
  className?: string;
}

const BasicCancelBtn = ({
  children,
  disabled,
  className = '!font-normal !normal-case !color-green-primary !text-green-primary disabled:!bg-gray-200 disabled:!text-gray-400 ',
  onClick,
  variant = 'outlined',
  size = 'small',
}: ButtonProp): ReactNode => {
  return (
    <Button variant={variant} size={size} disabled={disabled} className={className} onClick={onClick}>
      {children}
    </Button>
  );
};

export default BasicCancelBtn;
