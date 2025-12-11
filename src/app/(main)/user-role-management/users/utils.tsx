import { type UserPageType } from './types';
import * as Yup from 'yup';

export const initialValuesUserPage: UserPageType = { firstName: '', lastName: '', email: '', mobile: '', loginUsername: '', roleId: '', userStatusId: '' };
export const validationSchemaUserPage = Yup.object().shape({
  loginUsername: Yup.string()
    .required('Required')
    .max(64, 'Maximum length required is 64')
    .matches(/^(?=.*[A-Za-z0-9])[A-Za-z0-9,.-]*$/, 'Only Alphanumeric along with - and .')
    .min(5, 'Minimum length required is 5'),
  roleId: Yup.string().required('Required'),
  firstName: Yup.string()
    .required('Required')
    .max(64, 'Maximum length required is 64')
    .matches(/^(?=.*[A-Za-z])[A-Za-z ,.&-]*$/, 'Only Alphabets along with Space and &,-.')
    .min(1, 'Minimum length required is 1'),
  lastName: Yup.string()
    .required('Required')
    .max(64, 'Maximum length required is 64')
    .matches(/^(?=.*[A-Za-z])[A-Za-z ,.&-]*$/, 'Only Alphabets along with Space and &,-.')
    .min(1, 'Minimum length required is 1'),
  email: Yup.string()
    .required('Required')
    .email('Enter valid email')
    .matches(/^[a-zA-Z0-9.-]+@[a-z0-9.-]+\.[a-z]{2,}$/, 'Enter valid email')
    .max(128, 'Maximum length required is 128'),
  mobile: Yup.number()
    .required('Required')
    .typeError('Enter Please enter Numeric Values only')
    .lessThan(1000000000000000, 'Maximum length required is 15')
    .moreThan(10000000, 'Minimum length required is 8'),
});
export const validationSchemaActiveorSuspend = Yup.object().shape({
  reason: Yup.string().required('Required').max(255, 'Maximum length required is 255'),
});
export const validationSchemaResetPassword = Yup.object().shape({
  reason: Yup.string().required('Required').max(255, 'Maximum length required is 255'),
});

export const userStatus = (value: number) => {
  switch (value) {
    case 1:
      return 'Created';
    case 2:
      return 'Active';
    case 3:
      return 'Inactive';
    case 4:
      return 'Locked';
    case 5:
      return 'Deleted';
    case 6:
      return 'Unlocked';
    default:
      return 'Unknown';
  }
};
