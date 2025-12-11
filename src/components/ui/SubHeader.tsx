import { Box } from '@mui/material';
import MuiTypography from '../mui-components/typography/MuiTypography';
interface SubHeaderProps {
  name: string;
}

const SubHeader: React.FC<SubHeaderProps> = ({ name }) => {
  return (
    <Box mb={1} mt={2}>
      <MuiTypography variant='subtitle1' className="font-medium text-lg">{name}</MuiTypography>
    </Box>
  );
};

export default SubHeader;
