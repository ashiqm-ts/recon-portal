import { Box, Typography } from '@mui/material';
import type { ReactNode } from 'react';

export default function Footer(): ReactNode {
  return (
    <Box
      sx={{
        bottom: 0,
        left: 0,
        bgcolor: 'var(--color-background, #f9f9f9)',
        py: 1,
        textAlign: 'center',
      }}
    >
      <Typography variant="body2" sx={{ fontSize: '12px', color: 'text.secondary' }}>
        TechSwing Solutions Private Limited Copyright © {new Date().getFullYear()}. All rights reserved.
      </Typography>
    </Box>
  );
}
