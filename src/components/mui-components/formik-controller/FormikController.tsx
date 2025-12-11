/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { useFormikContext } from 'formik';
import DropDown from './components/DropDown';
import Input from './components/Input';
import MuiSwitch from './components/MuiSwitch';
import MuiAutoComplete from './components/AutoComplete';
import Password from './components/Password';
import NumericField from './components/NumericField';
import Alphanumeric from './components/Alphanumeric';

/** Formik Controller Component
 * This component is used to centralize the inputs across the entire application.
 */

const FormikController = (props: { [x: string]: any; control: any }) => {
  const { control, name, label, optionsList, onChange, disabled, required, fullWidth, children, showPassword, setShowPassword, ...rest } = props;
  const { errors, touched } = useFormikContext();

  switch (control) {
    case 'textField':
      return <Input name={name} label={label} required={required} onChange={onChange} disabled={disabled} errors={errors} touched={touched} fullWidth={fullWidth} {...rest} />;
    case 'select':
      return (
        <DropDown name={name} label={label} required={required} onChange={onChange} disabled={disabled} errors={errors} touched={touched}>
          {children}
        </DropDown>
      );
    case 'switch':
      return <MuiSwitch name={name} label={label} required={required} onChange={onChange} disabled={disabled} />;

    case 'autoComplete':
      return <MuiAutoComplete name={name} label={label} optionsList={optionsList} required={required} onChange={onChange} disabled={disabled} errors={errors} touched={touched} />;
    case 'password':
      return (
        <Password
          name={name}
          label={label}
          required={required}
          onChange={onChange}
          disabled={disabled}
          errors={errors}
          touched={touched}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
          {...rest}
        />
      );
    case 'number':
      return <NumericField name={name} label={label} required={required} onChange={onChange} disabled={disabled} errors={errors} touched={touched} />;
    case 'alphanumeric':
      return <Alphanumeric name={name} label={label} required={required} onChange={onChange} disabled={disabled} errors={errors} touched={touched} />;
    default:
      return null;
  }
};

export default FormikController;
