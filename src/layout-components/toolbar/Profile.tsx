'use client';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import { Badge } from '@mui/material';
import type { ReactNode } from 'react';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

export default function Profile(): ReactNode {
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
      <AccountCircleIcon sx={{ color: 'var(--color-primary)', width: '30px', height: '30px' }} />
    </Badge>
  );
}
