'use client';
import MuiButton from '@/components/mui-components/button/MuiButton';
import FormikController from '@/components/mui-components/formik-controller/FormikController';
import MuiTypography from '@/components/mui-components/typography/MuiTypography';
import { useResponseHandler } from '@/components/store.js/useResponseHandler';
import { changePassword, forgotPassword, modifyUserPassword } from '@/config/apiConfig';
import { useAuth } from '@/provider/AuthProvider';
import { Box, Card, Grid, Typography } from '@mui/material';
import { Form, Formik } from 'formik';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import type { ReactNode } from 'react';
import * as Yup from 'yup';

export default function Profile(): ReactNode {
  const { handleApiResponse } = useResponseHandler();
  const { user } = useAuth();
  const initialValuesPassword = {
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  };

  const validationSchema = Yup.object().shape({
    oldPassword: Yup.string().required('Required'),
    newPassword: Yup.string()
      .required('Required')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*[\]{}()?"\\,><':;|_~`=+-])[a-zA-Z\d!@#$%^&*[\]{}()?"\\,><':;|_~`=+-]{12,99}$/,
        'Must contain at least 12 Characters, 1 Uppercase, 1 Lowercase, 1 Special Character, and 1 Number'
      ),
    confirmPassword: Yup.string()
      .required('Required')
      .oneOf([Yup.ref('newPassword'), null], 'Passwords must match'),
  });
  const searchParams = new URLSearchParams(document.location.search);
  const token = encodeURI(searchParams.get('token'));
  console.log(token);
  const handleSubmit = async (values) => {
    console.log(values);
    const payload = {
      loginUserName: user?.loginUsername,
      oldPassword: values.oldPassword,
      newPassword: values.newPassword,
    };
    const res = await modifyUserPassword(payload);
    handleApiResponse({
      response: res.data,
      showSuccessMessage: true,
    });
  };
  return (
    <Box className="flex">
      <Box sx={{ margin: '12px', width: '50% ' }}>
        <Card className="w-full rounded min-h-[480px] ">
          <Box className="flex justify-between">
            <Box className="flex justify-startfont-bold text-xl flex items-center" sx={{ marginLeft: '10px', marginTop: '10px' }}>
              <MuiTypography>Profile Details</MuiTypography>
            </Box>
          </Box>
          <Formik initialValues={user ?? {}} onSubmit={() => {}}>
            <Grid container spacing={5} sx={{ padding: '12px' }}>
              <Grid size={{ xs: 6 }}>
                <FormikController control="textField" name="userId" disabled label="User ID" required />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <FormikController control="textField" name="roleName" disabled label="Role Name" required />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <FormikController control="textField" name="firstName" disabled label="First Name" required />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <FormikController control="textField" name="lastName" disabled label="Last Name" required />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <FormikController control="textField" name="email" disabled label="Email" required />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <FormikController control="textField" name="mobile" disabled label="Mobile" required />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <FormikController control="textField" name="loginUsername" disabled label="User Name" required />
              </Grid>
            </Grid>
          </Formik>
        </Card>
      </Box>
      <Box sx={{ margin: '12px', width: '50% ' }}>
        <Card className="w-full  rounded min-h-[480px] ">
          <Box className="flex justify-between">
            <Box className="flex justify-startfont-bold text-xl flex items-center" sx={{ marginLeft: '10px', marginTop: '10px' }}>
              <MuiTypography>Password Management</MuiTypography>
            </Box>
          </Box>
          <Formik initialValues={initialValuesPassword} validationSchema={validationSchema} onSubmit={handleSubmit}>
            <Grid container spacing={5} sx={{ padding: '12px' }}>
              <Grid size={{ xs: 6 }}>
                <FormikController control="textField" name="oldPassword" label="Old Password" required />
              </Grid>
              <Grid size={{ xs: 6 }}></Grid>
              <Grid size={{ xs: 6 }}>
                <FormikController control="textField" name="newPassword" label="New Password" required />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <FormikController control="textField" name="confirmPassword" label="Confirm Password" required />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <MuiButton type="submit">Change Password</MuiButton>
              </Grid>
            </Grid>
          </Formik>
        </Card>
      </Box>
    </Box>
  );
}
