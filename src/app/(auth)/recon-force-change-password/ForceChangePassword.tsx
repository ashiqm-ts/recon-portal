'use client';
import MuiButton from '@/components/mui-components/button/MuiButton';
import FormikController from '@/components/mui-components/formik-controller/FormikController';
import { useResponseHandler } from '@/components/store.js/useResponseHandler';
import { changePassword, forgotPassword } from '@/config/apiConfig';
import { Box, Card, Grid, Typography } from '@mui/material';
import { Form, Formik } from 'formik';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import type { ReactNode } from 'react';
import * as Yup from 'yup';

export default function ForcePasswordPage(): ReactNode {
  const { handleApiResponse } = useResponseHandler();
  const initialValues = {
    newPassword: '',
    confirmPassword: '',
  };
  const validationSchema = Yup.object().shape({
    newPassword: Yup.string()
      .required('Required')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*[\]{}()?"\\,><':;|_~`=+-])[a-zA-Z\d!@#$%^&*[\]{}()?"\\,><':;|_~`=+-]{12,99}$/,
        'Must contain atleast 12 Characters, 1 Uppercase, 1 Lowercase, 1 Special Character, and 1 Number'
      ),
    confirmPassword: Yup.string()
      .required('Required')
      .oneOf([Yup.ref('newPassword'), null], 'Password must match'),
  });
  //   const searchParams = new URLSearchParams(document.location.search);
  //   const token = encodeURI(searchParams.get('token'));
  //   console.log(token);
  //   const handleSubmit = async (values) => {
  //     console.log(values);
  //     const payload = {
  //       token,
  //       newPassword: values.newPassword,
  //     };
  //     const res = await changePassword(payload);
  //     handleApiResponse({
  //       response: res.data,
  //       onSuccess: () => {
  //         setTimeout(() => {
  //           redirect('/sign-in');
  //         }, 2000);
  //       },
  //       showSuccessMessage: true,
  //     });
  //   };
  return (
    <Box>
      <Card sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', position: 'relative', top: '30px', left: '420px', width: '500px', height: '550px' }}>
        <Box>
          <Typography sx={{ fontSize: '30px', fontWeight: '800' }}>Change Password</Typography>
        </Box>
        <Box sx={{ width: '400px' }}>
          <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={() => {}}>
            {({ values, resetForm }) => (
              <Form noValidate>
                <Grid container spacing={2} justifyContent="center">
                  <Grid sx={{ marginTop: '15px', width: '100%' }} size={{ xs: 11, sm: 7, md: 9, lg: 9 }}>
                    <FormikController control="textField" label="Password" required name="newPassword" fullWidth={true} />
                  </Grid>
                  <Grid sx={{ marginTop: '15px', width: '100%' }} size={{ xs: 11, sm: 7, md: 9, lg: 9 }}>
                    <FormikController control="textField" label="Change Password" required name="confirmPassword" fullWidth={true} />
                  </Grid>
                  <Grid sx={{ marginTop: '15px', width: '100%' }} size={{ xs: 11, sm: 7, md: 9, lg: 9 }}>
                    <MuiButton type="submit" fullWidth>
                      Change Password
                    </MuiButton>
                  </Grid>
                </Grid>
              </Form>
            )}
          </Formik>
        </Box>
      </Card>
    </Box>
  );
}
