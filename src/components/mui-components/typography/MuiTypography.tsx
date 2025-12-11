import Typography, { type TypographyProps } from '@mui/material/Typography';
interface TypographicProps {
  children: React.ReactNode;
  color?: string;
  variant?: TypographyProps['variant'];
  className?: string;
}

const MuiTypography: React.FC<TypographicProps> = ({ variant = 'h6', className = 'break-all', children, color }: TypographicProps) => {
  return (
    <Typography variant={variant} className={className} color={color}>
      {children}
    </Typography>
  );
};
export default MuiTypography;
