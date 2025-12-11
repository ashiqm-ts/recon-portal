import { IconButton, InputAdornment, TextField } from '@mui/material';
import { Field, ErrorMessage } from 'formik';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import type { ReactNode } from 'react';

type MuiAutoCompleteProps = {
  name: string;
  label: string;
  disabled?: boolean;
  errors: Record<string, unknown>;
  touched: Record<string, boolean | undefined>;
  onChange?: (event: { target: { name: string; value: unknown } }) => void;
  fullWidth?: boolean;
  required?: boolean;
  showPassword?: boolean;
  setShowPassword?: (name?: boolean) => void;
};
const Password = ({ name, label, errors, touched, disabled, required, onChange, fullWidth = true, showPassword, setShowPassword, ...rest }: MuiAutoCompleteProps): ReactNode => {
  return (
    <Field
      as={TextField}
      name={name}
      label={label}
      fullWidth={fullWidth}
      disabled={disabled}
      required={required}
      autoComplete="off"
      variant="standard"
      type="text"
      helperText={<ErrorMessage name={name} />}
      error={Boolean(errors[name] && touched[name])}
      InputLabelProps={{ sx: { color: 'var(--color-secondary)' } }}
      inputProps={{ style: { WebkitTextSecurity: showPassword ? 'none' : 'disc' } }}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton onClick={() => setShowPassword?.(!showPassword)} edge="end">
              {showPassword ? <VisibilityIcon sx={{ color: 'var(--color-secondary)' }} /> : <VisibilityOffIcon sx={{ color: 'var(--color-secondary)' }} />}
            </IconButton>
          </InputAdornment>
        ),
      }}
      {...rest}
    />
  );
};

export default Password;
