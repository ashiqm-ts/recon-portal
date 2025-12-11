import { Box } from '@mui/material';
import MuiTypography from '../mui-components/typography/MuiTypography';
interface HeaderProps {
  name: string;
  align?: 'left' | 'center' | 'right';
  color?: string;
  mt?: number;
}

const Header: React.FC<HeaderProps> = ({ name, align = 'left', color = 'inherit', mt = 0 }) => {
  return (
    <Box mb={2} mt={mt} textAlign={align}>
      <MuiTypography className="font-bold text-xl" color={color}>
        {name}
      </MuiTypography>
    </Box>
  );
};

export default Header;
