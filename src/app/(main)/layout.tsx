'use client';

import Footer from '@/layout-components/Footer';
import Sidebar from '@/layout-components/sidebar/Sidebar';
import ToolBar from '@/layout-components/toolbar/Toolbar';
import { Box, GlobalStyles, useMediaQuery, useTheme } from '@mui/material';
import NavigationLoader from '@/components/shared-ui/NavigationLoader';
import { NavigationProvider } from '@/provider/NavigationContext';
import { links } from '@/layout-components/sidebar/NavigationConfig';
import UnAuthorized from '@/components/ui/UnAuthorized';
import type { ReactNode } from 'react';

const scrollBarCustomStyle = {
  '::-webkit-scrollbar': { width: '5px', height: '5px', backgroundColor: '#f3f6f4' },
  '::-webkit-scrollbar-thumb': { backgroundColor: '#b0c4c0', borderRadius: '8px' },
  '::-webkit-scrollbar-thumb:hover': { backgroundColor: '#8aa6a0' },
};

export default function WithSidebarLayout({ children }: { readonly children: ReactNode }): ReactNode {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  if (!links || links.length === 0) return <UnAuthorized />;

  const sidebarWidth = isSmallScreen ? 70 : 180;

  return (
    <NavigationProvider>
      <Box className="w-screen h-screen overflow-hidden">
        <GlobalStyles styles={scrollBarCustomStyle} />
        <NavigationLoader />
        <Box className="flex w-full h-full">
          <Box sx={{ width: sidebarWidth, flexShrink: 0, backgroundColor: 'white' }}>
            <Sidebar />
          </Box>

          <Box className="flex flex-col flex-1 h-full">
            <Box className="sticky top-0 z-20">
              <ToolBar />
            </Box>
            <Box className="flex-1 overflow-auto bg-[#538890]">{children}</Box>
            <Footer />
          </Box>
        </Box>
      </Box>
    </NavigationProvider>
  );
}
