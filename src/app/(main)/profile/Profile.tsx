'use client';

import MuiButton from '@/components/mui-components/button/MuiButton';
import FormikController from '@/components/mui-components/formik-controller/FormikController';
import MuiTypography from '@/components/mui-components/typography/MuiTypography';
import { useResponseHandler } from '@/components/store.js/useResponseHandler';
import { modifyUserPassword } from '@/config/apiConfig';
import { useAuth } from '@/provider/AuthProvider';
import { Box, Card, Divider, Grid } from '@mui/material';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import type { ReactNode } from 'react';

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

  const handleSubmit = async (values) => {
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
    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', padding: 2 }}>
      <Box sx={{ flex: '1 1 45%', minWidth: 300 }}>
        <Card sx={{ padding: 3, borderRadius: 2, minHeight: 500 }}>
          <MuiTypography variant="h5">Profile Details</MuiTypography>
          <Divider sx={{ marginBottom: 3 }} />

          <Formik initialValues={user ?? {}} onSubmit={() => {}}>
            <Form>
              <Grid container spacing={3}  >
                <Grid size={{ xs: 6 }}>
                  <FormikController control="textField" name="userId" label="User ID" disabled />
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <FormikController control="textField" name="roleName" label="Role Name" disabled />
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <FormikController control="textField" name="firstName" label="First Name" disabled />
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <FormikController control="textField" name="lastName" label="Last Name" disabled />
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <FormikController control="textField" name="email" label="Email" disabled />
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <FormikController control="textField" name="mobile" label="Mobile" disabled />
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <FormikController control="textField" name="loginUsername" label="Username" disabled />
                </Grid>
              </Grid>
            </Form>
          </Formik>
        </Card>
      </Box>

      <Box sx={{ flex: '1 1 45%', minWidth: 300 }}>
        <Card sx={{ padding: 3, borderRadius: 2, minHeight: 500 }}>
          <MuiTypography variant="h5">Password Management</MuiTypography>
          <Divider sx={{ marginBottom: 3 }} />

          <Formik initialValues={initialValuesPassword} validationSchema={validationSchema} onSubmit={handleSubmit}>
            <Form>
              <Grid container spacing={3}>
                <Grid size={{ xs: 6 }}>
                  <FormikController control="textField" name="oldPassword" label="Old Password" type="password" required />
                </Grid>
                <Grid size={{ xs: 6 }}></Grid>
                <Grid size={{ xs: 6 }}>
                  <FormikController control="textField" name="newPassword" label="New Password" type="password" required />
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <FormikController control="textField" name="confirmPassword" label="Confirm Password" type="password" required />
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <MuiButton type="submit" variant="contained">
                    Change Password
                  </MuiButton>
                </Grid>
              </Grid>
            </Form>
          </Formik>
        </Card>
      </Box>
    </Box>
  );
}
