import type { FieldProps } from 'formik';
import { ErrorMessage, useFormikContext, Field } from 'formik';

import type { AutocompleteRenderInputParams } from '@mui/material';
import { Autocomplete, TextField } from '@mui/material';

type OptionType = {
  label: string;
  value: string | number;
};

type MuiAutoCompleteProps = {
  name: string;
  label: string;
  optionsList: OptionType[];
  required?: boolean;
  disabled?: boolean;
  onChange?: (event: { target: { name: string; value: unknown } }) => void;
  errors: Record<string, unknown>;
  touched: Record<string, boolean | undefined>;
};

const MuiAutoComplete: React.FC<MuiAutoCompleteProps> = ({ name, errors, touched, optionsList, label, required, onChange, disabled }) => {
  const { handleBlur, setFieldValue, initialValues } = useFormikContext<Record<string, unknown>>();
  return (
    <Field name={name}>
      {({ field }: FieldProps) => (
        <Autocomplete
          //  name={field.name}
          value={optionsList.find((option) => option.value === field.value) || null}
          options={optionsList}
          disabled={disabled}
          getOptionLabel={(option) => option.label}
          // getOptionLabel={(option) => option?.label?.toString?.() || ''}
          onChange={(event, value) => {
            const selectedValue: unknown = value?.value ?? initialValues[name];

            void setFieldValue(name, selectedValue);
            console.log(value);
            if (onChange) {
              const syntheticEvent = {
                target: {
                  name,
                  value: selectedValue,
                },
              };
              onChange(syntheticEvent);
            }
          }}
          renderOption={(props, option) => (
            <li {...props} key={option?.value} style={{ fontSize: '13px' }}>
              {option?.label}
            </li>
          )}
          onBlur={handleBlur}
          clearOnBlur
          renderInput={(params: AutocompleteRenderInputParams) => (
            <TextField
              label={label}
              variant="standard"
              inputProps={params.inputProps}
              fullWidth
              autoComplete="off"
              required={required}
              disabled={disabled}
              //  onBlur={params.onBlur}
              slotProps={{
                inputLabel: {
                  style: { fontSize: '13px' },
                  ...params.InputLabelProps,
                },

                input: {
                  ...params.InputProps,
                },
              }}
              sx={{
                '& .MuiInputBase-input': {
                  fontSize: '13px',
                },
              }}
              helperText={<ErrorMessage name={name} />}
              error={Boolean(errors[name] && touched[name])}
            />
          )}
        />
      )}
    </Field>
  );
};

export default MuiAutoComplete;
