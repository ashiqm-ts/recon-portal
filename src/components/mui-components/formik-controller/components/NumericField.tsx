import { Field, ErrorMessage, useFormikContext } from 'formik';
import { TextField } from '@mui/material';
import type { ReactNode } from 'react';

//  Number component to accept 0-9
type MuiAutoCompleteProps = {
  name: string;
  label: string;
  disabled?: boolean;
  onChange?: (event: { target: { name: string; value: unknown } }) => void;
  errors: Record<string, unknown>;
  touched: Record<string, boolean | undefined>;
  fullWidth?: boolean;
  required?: boolean;
};
const NumericField = ({ name, errors, touched, disabled, label, required, fullWidth = true, ...rest }: MuiAutoCompleteProps): ReactNode => {
  const { setFieldValue } = useFormikContext();

  const handleInputChange = (e: { target: { value: string } }): void => {
    const regex = /^[0-9\b]+$/;
    if (e.target.value === '' || regex.test(e.target.value)) {
      void setFieldValue(name, e.target.value);
    }
  };

  return (
   <Field
      as={TextField}
      name={name}
      label={label}
      fullWidth={fullWidth}
      disabled={disabled}
      required={required}
      onChange={handleInputChange}
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

export default NumericField;
