'use client';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import { Badge } from '@mui/material';
import type { ReactNode } from 'react';

export default function Notification(): ReactNode {
  return (
    <Badge
      badgeContent={0}
      sx={{
        '& .MuiBadge-badge': {
          backgroundColor: 'var(--color-primary)',
          color: 'var(--color-accent)',
        },
      }}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      overlap="circular"
    >
      <NotificationsOutlinedIcon sx={{ color: 'var(--color-primary)', width: '30px', height: '30px' }} />
    </Badge>
  );
}
