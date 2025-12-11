import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';

import { Button } from '@mui/material';
import { useFormikContext } from 'formik';

type SubmitBtnProps = {
  disabled?: boolean;
  disableIsSubmit?: boolean;
  sx?: object;
  children: React.ReactNode;
  isNoDirty?: boolean;
  size?: 'small' | 'medium' | 'large';
  variant?: 'text' | 'outlined' | 'contained';
  className?: string;
  component?: string;
  typeSubmit?: boolean;
  fullWidth?: boolean;
};

const SubmitBtn = ({
  disabled,
  children,
  isNoDirty,
  disableIsSubmit,
  size = 'small',
  variant = 'contained',
  sx,
  className = '!normal-case !font-normal !bg-green-primary !text-white hover:!bg-mist-green hover:!text-green-primary disabled:!bg-gray-200 disabled:!text-gray-500',
  typeSubmit,
  component,
  fullWidth
}: SubmitBtnProps): ReactNode => {
  const [isDisabled, setIsDisabled] = useState(false);
  const { dirty, isSubmitting, values } = useFormikContext();
  useEffect(() => {
    if (typeSubmit) {
      if (isSubmitting) {
        setIsDisabled(true);
      }
    } else if (!disableIsSubmit) {
      if (disabled) {
        setIsDisabled(true);
      } else if (isSubmitting) {
        setIsDisabled(true);
      } else if (!dirty && !isSubmitting && !isNoDirty) {
        setIsDisabled(true);
      } else if (isNoDirty) setIsDisabled(false);
    }
    return (): void => {
      if (isSubmitting && !dirty) {
        setIsDisabled(false);
      } else if (!dirty) {
        setIsDisabled(false);
      } else if (isSubmitting) {
        setIsDisabled(false);
      } else if (typeSubmit) setIsDisabled(false);
    };
  }, [isSubmitting, dirty, isNoDirty, disabled, disableIsSubmit, typeSubmit, values]);
  return (
    <Button variant={variant} size={size} type="submit" sx={sx} disabled={isDisabled} disableElevation disableRipple className={className} component={component} fullWidth={fullWidth}>
      {children}
    </Button>
  );
};

export default SubmitBtn;
