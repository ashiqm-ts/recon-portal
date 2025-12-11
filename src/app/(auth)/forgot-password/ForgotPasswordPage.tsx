'use client';
import MuiButton from '@/components/mui-components/button/MuiButton';
import FormikController from '@/components/mui-components/formik-controller/FormikController';
import { useResponseHandler } from '@/components/store.js/useResponseHandler';
import { forgotPassword } from '@/config/apiConfig';
import { Box, Card, Grid, Typography } from '@mui/material';
import { Form, Formik } from 'formik';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import type { ReactNode } from 'react';

export default function ForgotPasswordPage(): ReactNode {
  const { handleApiResponse } = useResponseHandler();
  const initialValues = {
    loginUserName: '',
  };
  const handleSubmit = async (values) => {
    console.log(values);
    const payload = {
      loginUserName: values?.username,
    };
    const res = await forgotPassword(payload);
    handleApiResponse({
      response: res.data,
      onSuccess: () => {
        setTimeout(() => {
          redirect('/sign-in');
        }, 2000);
      },
      showSuccessMessage: true,
    });
  };
  return (
    <Box>
      <Card sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', position: 'relative', top: '30px', left: '420px', width: '500px', height: '550px' }}>
        <Box>
          <Typography sx={{ fontSize: '30px', fontWeight: '800' }}>Forgot Password?</Typography>
          <Typography sx={{ fontSize: '14px', marginTop: '10px' }}>Fill the form to reset your password </Typography>
        </Box>
        <Box sx={{ width: '400px' }}>
          <Formik initialValues={initialValues} onSubmit={handleSubmit}>
            {({ values, resetForm }) => (
              <Form noValidate>
                <Grid container spacing={2} justifyContent="center">
                  <Grid sx={{ marginTop: '15px', width: '100%' }} size={{ xs: 11, sm: 7, md: 9, lg: 9 }}>
                    <FormikController control="textField" label="Username" required name="username" fullWidth={true} />
                  </Grid>
                  <Grid sx={{ marginTop: '15px', width: '100%' }} size={{ xs: 11, sm: 7, md: 9, lg: 9 }}>
                    <MuiButton type="submit" fullWidth>
                      Send Reset Link
                    </MuiButton>
                  </Grid>
                  <Grid sx={{ marginTop: '15px', width: '100%' }} size={{ xs: 11, sm: 7, md: 9, lg: 9 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                      <Typography sx={{ fontSize: '12px' }}>
                        Return to{' '}
                        <Link href="/sign-in">
                          <span style={{ textDecoration: 'underline', fontSize: '13px', marginLeft: '4px' }}>Login Page</span>
                        </Link>
                      </Typography>
                    </Box>
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
