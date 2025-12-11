'use client';
import { Box, IconButton } from '@mui/material';
import type { JSX, ReactNode } from 'react';
import { useState, useCallback } from 'react';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';

const PILL_WIDTH = 75;
const PILL_HEIGHT = 28;
const INNER_MARGIN = 2;
const ACTIVE_BG = 'white';
const OUTER_BG = 'var(--color-primary)';
const MODES = ['light', 'dark'];

export default function Pill(): ReactNode {
  const [mode, setMode] = useState<(typeof MODES)[number]>('dark');
  const isLight = mode === 'light';

  const ICONS: Record<(typeof MODES)[number], JSX.Element> = {
    light: <LightModeIcon sx={{ color: OUTER_BG }} />,
    dark: <DarkModeIcon sx={{ color: OUTER_BG }} />,
  };

  const BUTTON_ICONS: Record<(typeof MODES)[number], JSX.Element> = {
    light: <LightModeIcon />,
    dark: <DarkModeIcon />,
  };

  const handleToggle = useCallback((newMode: (typeof MODES)[number]) => {
    console.log(newMode);
    setMode(newMode);
  }, []);

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        bgcolor: OUTER_BG,
        borderRadius: PILL_HEIGHT / 2,
        width: PILL_WIDTH,
        height: PILL_HEIGHT,
        p: `${INNER_MARGIN}px`,
        position: 'relative',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: INNER_MARGIN,
          left: isLight ? INNER_MARGIN : `calc(50% + ${INNER_MARGIN}px)`,
          width: `calc(50% - ${INNER_MARGIN * 2}px)`,
          height: `calc(100% - ${INNER_MARGIN * 2}px)`,
          borderRadius: PILL_HEIGHT / 2,
          bgcolor: ACTIVE_BG,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'left 0.3s ease',
          zIndex: 0,
        }}
      >
        {ICONS[mode]}
      </Box>

      {MODES.map((m) => (
        <IconButton
          key={m}
          onClick={() => handleToggle(m)}
          sx={{
            flex: 1,
            zIndex: 1,
            color: 'white',
            visibility: mode === m ? 'hidden' : 'visible',
          }}
        >
          {BUTTON_ICONS[m]}
        </IconButton>
      ))}
    </Box>
  );
}
