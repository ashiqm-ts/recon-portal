import { Box, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { useRouter } from 'next/navigation';
import { usePageStateStore } from '../store.js/usePageStateStore';
import type { ReactNode } from 'react';

export const ActionRenderer = ({ data, path }: { data: unknown; path: string }): ReactNode => {
  const router = useRouter();
  const setEditData = usePageStateStore((state) => state?.setEditData);
  const navigate = (data: unknown): void => {
    console.log(data);
    setEditData(data);
    router.push(path);
  };
  return (
    <Box className="flex justify-center justiffy-around">
      <IconButton onClick={() => navigate(data)}>
        <EditIcon sx={{ fontSize: '18px', color: 'var(--color-primary)' }} />
      </IconButton>
    </Box>
  );
};
