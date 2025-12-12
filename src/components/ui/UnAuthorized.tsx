import { Box } from '@mui/material';
import MuiTypography from '../mui-components/typography/MuiTypography';
import CustomCard from '../shared-ui/CustomCard';
import type { ReactNode } from 'react';

const UnAuthorized = ({className="w-4/5 px-40 py-52  mx-8 my-10 absolute rounded min-h-[500px]"}): ReactNode => {
  return (
    <Box>
      <CustomCard className={className}>
        <Box>
          <MuiTypography className="sm:text-md md:text-xl font-semibold tracking-tight leading-8">Please contact your administrator to obtain the necessary permissions.</MuiTypography>
        </Box>
      </CustomCard>
    </Box>
  );
};

export default UnAuthorized;
