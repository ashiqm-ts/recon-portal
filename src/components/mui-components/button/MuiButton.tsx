import BasicCancelBtn from '@/components/mui-components/button/components/BasicCancelBtn';
import SubmitBtn from '@/components/mui-components/button/components/SubmitBtn';
import BasicBtn from '@/components/mui-components/button/components/BasicBtn';
import GridBtn from '@/components/mui-components/button/components/GridBtn';
import type { ReactNode } from 'react';

interface ButtonProp {
  type?: string;
  children?: ReactNode;
  disabled?: boolean;
  isNoDirty?: boolean;
  disableIsSubmit?: boolean;
  variant?: 'contained' | 'outlined';
  size?: 'small' | 'medium' | 'large';
  sx?: () => void;
  onClick?: () => void;
  className?: string;
  component?: string;
  fullWidth?: boolean;
}

const MuiButton = (props: ButtonProp): ReactNode => {
  const { type, onClick, disabled, children, className, variant, size, isNoDirty, disableIsSubmit, sx, component, fullWidth } = props;
  switch (type) {
    case 'submit':
      return (
        <SubmitBtn disabled={disabled} className={className} variant={variant} size={size} disableIsSubmit={disableIsSubmit} sx={sx} isNoDirty={isNoDirty} component={component} fullWidth={fullWidth}>
          {children}
        </SubmitBtn>
      );
    case 'basic-btn':
      return (
        <BasicBtn disabled={disabled} className={className} variant={variant} size={size} onClick={onClick} component={component}>
          {children}
        </BasicBtn>
      );
    case 'cancel-btn':
      return (
        <BasicCancelBtn onClick={onClick} disabled={disabled} className={className} variant={variant} size={size}>
          {children}
        </BasicCancelBtn>
      );
    case 'grid-btn':
      return (
        <GridBtn onClick={onClick} disabled={disabled} className={className} variant={variant} size={size}>
          {children}
        </GridBtn>
      );
    default:
      return null;
  }
};

export default MuiButton;
