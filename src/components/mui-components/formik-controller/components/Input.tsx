import { TextField } from '@mui/material';
import { Field, ErrorMessage } from 'formik';
import type { ReactNode } from 'react';

/** Input
 * Mui TextField component
 */

type MuiAutoCompleteProps = {
  name: string;
  label: string;
  disabled?: boolean;
  errors: Record<string, unknown>;
  onChange?: (event: { target: { name: string; value: unknown } }) => void;
  touched: Record<string, boolean | undefined>;
  fullWidth?: boolean;
  required?: boolean;
};
const Input = ({ name, label, errors, touched, disabled, required, onChange, fullWidth = true, ...rest }: MuiAutoCompleteProps): ReactNode => {
  return (
    <Field
      as={TextField}
      name={name}
      label={label}
      fullWidth={fullWidth}
      disabled={disabled}
      required={required}
      // InputProps={{
      //   disableUnderline: true,
      // }}
      // onChange={onChange}
      autoComplete="off"
      variant="standard"
      InputLabelProps={{ sx: { fontSize: '13px' } }}
      InputProps={{ sx: { fontSize: '13px' } }}
      helperText={<ErrorMessage name={name} />}
      error={Boolean(errors[name] && touched[name])}
      {...rest}
    />
  );
};

export default Input;
