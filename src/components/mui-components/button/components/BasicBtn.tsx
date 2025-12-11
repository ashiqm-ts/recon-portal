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

const BasicBtn = ({
  children,
  disabled,
  variant = 'contained',
  size = 'small',
  onClick,
  className = '!font-normal !normal-case !bg-[var(--color-primary)] !text-white hover:!bg-[var(--color-accent)] hover:!text-[var(--color-primary)] disabled:!bg-gray-200 disabled:!text-gray-500',
  component,
  ...rest
}: ButtonProp): ReactNode => {
  return (
    <Button variant={variant} size={size} className={className} onClick={onClick} disabled={disabled} component={component} {...rest}>
      {children}
    </Button>
  );
};

export default BasicBtn;
