import { Field, ErrorMessage, useFormikContext } from 'formik';
import { TextField } from '@mui/material';

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
const Alphanumeric = ({ name, errors, touched, disabled, required, fullWidth = true }: MuiAutoCompleteProps) => {
  const { setFieldValue } = useFormikContext();

  const handleInputChange = (e: { target: { value: string } }): void => {
    const regex = /^[a-zA-Z0-9]+$/;

    if (e.target.value === '' || regex.test(e.target.value)) {
      void setFieldValue(name, e.target.value);
    }
  };

  return (
    <Field
      as={TextField}
      name={name}
      fullWidth={fullWidth}
      disabled={disabled}
      required={required}
      autoComplete="off"
      variant="outlined"
      onChange={handleInputChange}
      inputProps={{ maxLength: 15 }}
      helperText={<ErrorMessage name={name} />}
      error={Boolean(errors[name] && touched[name])}
    />
  );
};

export default Alphanumeric;
