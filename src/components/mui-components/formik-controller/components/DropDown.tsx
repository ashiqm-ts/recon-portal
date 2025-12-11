import { TextField } from '@mui/material';
import { ErrorMessage, Field } from 'formik';
import type { ReactNode } from 'react';

/** DropDown
 * Mui TextField with select prop component
 */
type MuiAutoCompleteProps = {
  name: string;
  label: string;
  required?: boolean;
  disabled?: boolean;
  onChange?: (event: { target: { name: string; value: unknown } }) => void;
  errors: Record<string, unknown>;
  touched: Record<string, boolean | undefined>;
  children: React.ReactNode;
};
const DropDown = ({
  name,
  errors,
  touched,
  label,
  required,

  children,
}: MuiAutoCompleteProps): ReactNode => {
  return (
    <Field
      as={TextField}
      name={name}
      label={label}
      fullWidth
      required={required}
      select
      autoComplete="off"
      variant="standard"
      InputLabelProps={{ sx: { color: 'var(--color-secondary)', fontSize: '13px' } }}
      helperText={<ErrorMessage name={name} />}
      error={Boolean(errors[name] && touched[name])}
    >
      {children}
    </Field>
  );
};

export default DropDown;
