'use client';

import { Switch, FormHelperText, Box } from '@mui/material';
import { useField } from 'formik';
import MuiTypography from '../../typography/MuiTypography';

type MuiSwitchProps = {
  name: string;
  label: string;
  disabled?: boolean;
  required?: boolean;
  onChange?: (event: { target: { name: string; value: boolean } }) => void;
};

const MuiSwitch: React.FC<MuiSwitchProps> = ({ name, label, disabled, required, onChange }) => {
  const [field, meta, helpers] = useField<Record<string, unknown>>({ name, type: 'checkbox' });

  return (
    <Box mt={2}>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <MuiTypography variant="body2" color={meta.touched && meta.error ? 'error' : 'text.primary'}>
          {label}
          {required ? ' *' : ''}
        </MuiTypography>

        <Switch
          {...field}
          checked={Boolean(field.value)}
          sx={{
            '& .MuiSwitch-switchBase.Mui-checked': {
              color: 'var(--color-secondary)',
            },
            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
              backgroundColor: 'var(--color-secondary)',
            },
            '& .MuiSwitch-track': {
              backgroundColor: '#b0b0b0',
              opacity: 1,
            },
          }}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            const checked: boolean = e.target.checked;
            helpers.setValue(checked);
            if (onChange) onChange({ target: { name, value: e.target.checked } });
          }}
          disabled={disabled}
        />
      </Box>
      {meta.touched && meta.error && <FormHelperText error>{meta.error}</FormHelperText>}
    </Box>
  );
};

export default MuiSwitch;
