'use client';
import React from 'react';
import type { ReactNode } from 'react';
import { Box, Typography } from '@mui/material';

export default function ErrorBoundary({ error }: { readonly error: Error }): ReactNode {
  console.log('error', error);
  console.log('error name', error.name);
  if (error.name === 'ChunkLoadError' || error.name === 'NotFoundError') {
    window.location.reload();
    return null;
  }

  return (
    <Box
      sx={{
        minHeight: '90vh',
        width: '100%',
        bgcolor: 'grey.50',
        p: 4,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box
          sx={{
            width: 28,
            height: 28,
            borderRadius: '50%',
            bgcolor: 'primary.main',
            color: 'common.white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            fontSize: 24,
          }}
        >
          !
        </Box>
        <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary' }}>
          Something went wrong
        </Typography>
      </Box>
      <Box
        sx={{
          mt: 2,
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 3,
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
        }}
      >
        <Box>
          <Typography sx={{ color: 'text.primary', fontWeight: 600, fontSize: 18 }}>{error?.message || 'Unexpected error occurred.'}</Typography>
        </Box>
      </Box>
    </Box>
  );
}
