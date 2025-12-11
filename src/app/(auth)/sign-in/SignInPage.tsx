import FormikController from '@/components/mui-components/formik-controller/FormikController';
import { Typography, Box, InputAdornment } from '@mui/material';
import { Form, Formik } from 'formik';
import Grid from '@mui/material/Grid';
import PersonIcon from '@mui/icons-material/Person';
import { type ReactNode, useState } from 'react';
import * as Yup from 'yup';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/provider/AuthProvider';
import MuiButton from '@/components/mui-components/button/MuiButton';
import { loginType } from './types';
import { getLogin } from '@/config/apiConfig';
import { useResponseHandler } from '@/components/store.js/useResponseHandler';
import axiosInstance from '@/config/axios';

export default function SignInPage(): ReactNode {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const { setUser, setTokenDetails } = useAuth();
  const { handleApiResponse } = useResponseHandler();
  const router = useRouter();
  const initialValues: loginType = {
    loginUserName: '',
    password: '',
  };
  const validationSchema = Yup.object().shape({
    loginUserName: Yup.string().required('Required'),
    password: Yup.string().required('Required'),
  });

  const handleSubmit = async (values: loginType, { resetForm }): Promise<null> => {
    console.log('values,', values);
    const payLoad = {
      loginUserName: values.loginUserName,
      password: values.password,
    };
    const res = await getLogin(payLoad);
    console.log(res.data.data);
    handleApiResponse({
      response: res.data,
      onSuccess: () => {
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${res.data.data.token}`;
        axiosInstance.defaults.headers.common['instnId'] = 1;
        axiosInstance.defaults.headers.common['channel'] = '01';
        setUser(res.data.data);
        setTokenDetails({ token: res.data.data.token, refreshToken: res.data.data.refreshToken });
        router.push('/user-role-management/users');
      },
      onError: () => {
        resetForm();
      },
    });
    return null;
  };
  return (
    <Box className="flex flex-col justify-center items-center h-screen bg-cover bg-no-repeat lg:flex-row" style={{ backgroundImage: "url('/background1.png')" }}>
      <Box className="lg:flex-[2.5] flex flex-col justify-center items-center">
        <Typography sx={{ fontSize: { xs: '16px', sm: '24px', md: '32px', lg: '40px' }, marginBottom: '17px', color: 'var(--color-primary)' }}>Welcome to Reconciliation Portal !</Typography>
        <Box sx={{ display: { xs: 'none', sm: 'none', md: 'block' } }}>
          <Image src="/greenimg.png" alt="" width={680} height={500} />
        </Box>
      </Box>
      <Box className="lg:flex-[1.5] flex flex-col justify-center items-center text-var(--color-primary)">
        <Image src="/logotransp.png" alt="" width={180} height={180} style={{ objectFit: 'contain' }} />
        {/* <img src="/logo.png" alt="" width="140px" height="70px" style={{ objectFit: 'contain' }}/> */}
        <Typography variant="h6" sx={{ fontSize: '20px', fontWeight: 'bold', margin: '10x', textAlign: 'center', fontFamily: 'sans-serif' }}>
          Login Your Account
        </Typography>

        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
          {({ values, resetForm }) => (
            <Form noValidate>
              <Grid container spacing={2} justifyContent="center">
                <Grid size={{ xs: 11, sm: 7, md: 9, lg: 9 }}>
                  <FormikController
                    control="textField"
                    label="User Name"
                    name="loginUserName"
                    required
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <PersonIcon sx={{ color: 'var(--color-secondary)' }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 11, sm: 7, md: 9, lg: 9 }}>
                  <FormikController control="password" label="Password" name="password" required showPassword={showPassword} setShowPassword={setShowPassword} />
                </Grid>
                <Grid size={{ xs: 11, sm: 7, md: 9, lg: 9 }}>
                  <Link href="/forgot-password">
                    <Typography fontSize={15} className="text-right cursor-pointer text-[var(--color-yellow)] font-sans">
                      Forgot Password?
                    </Typography>
                  </Link>
                </Grid>
                <Grid size={{ xs: 11, md: 9, lg: 9 }} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 2 }}>
                  <MuiButton type="submit" variant="outlined" className="!normal-case !rounded-[15px] !p-1  !text-[#2A4947] !font-bold !font-sans !bg-[#F5F8FF]">
                    Login
                  </MuiButton>
                </Grid>
              </Grid>
            </Form>
          )}
        </Formik>
      </Box>
    </Box>
  );
}
