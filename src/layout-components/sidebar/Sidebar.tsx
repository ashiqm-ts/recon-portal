'use client';

import { useState, useCallback, useMemo, Fragment, type ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { List, ListItemButton, ListItemIcon, ListItemText, Collapse, Typography, Box, useTheme, useMediaQuery } from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import type { NavItem } from '@/layout-components/sidebar/NavigationConfig';
import { links } from '@/layout-components/sidebar/NavigationConfig';
import { useNavigation } from '@/provider/NavigationContext';
import { usePageStateStore } from '@/components/store.js/usePageStateStore';
import { useDialogStore } from '@/components/store.js/useDialogStore';
import Image from 'next/image';

export default function Sidebar(): ReactNode {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const clearEditData = usePageStateStore((state) => state.clearEditData);
  const mobScreen = isSmallScreen;
  const pathname = usePathname();
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const { startLoading } = useNavigation();
  const { closeDialog } = useDialogStore();

  const handleToggle = useCallback((label: string) => {
    setOpenMenu((prev) => (prev === label ? null : label));
  }, []);
  const closeCustomHooks = (): void => {
    clearEditData();
    closeDialog();
  };

  const activeItemStyle = useMemo(
    () => ({
      '&:hover': {
        backgroundColor: 'var(--color-accent)',
        color: 'var(--color-primary)',
      },
      '&.Mui-selected': {
        backgroundColor: 'var(--color-secondary)',
        color: 'var(--background)',
      },
      '&.Mui-selected:hover': {
        backgroundColor: 'var(--color-secondary)',
        opacity: 0.9,
      },
    }),
    []
  );

  const renderChild = useCallback(
    (child: NavItem) => {
      if (!child.to) return null;

      return (
        <ListItemButton
          key={child.to}
          component={Link}
          href={child.to}
          onClick={(e) => {
            if (pathname === child.to) {
              e.preventDefault();
              return;
            }
            closeCustomHooks();
            startLoading();
          }}
          selected={pathname === child.to}
          sx={{
            ...activeItemStyle,

            pl: 2,
            py: 0.5,

            cursor: pathname === child.to ? 'default' : 'pointer',
          }}
        >
          {child.icon && (
            <ListItemIcon sx={{ color: 'inherit', minWidth: 'auto', mr: 1 }}>
              <child.icon />
            </ListItemIcon>
          )}
          {!mobScreen && <ListItemText primary={<Typography fontSize={12}>{child.label}</Typography>} />}
        </ListItemButton>
      );
    },
    [pathname, startLoading, activeItemStyle, mobScreen]
  );

  const renderMenu = useMemo(
    () =>
      links?.map((item: NavItem) => {
        const hasChildren = Boolean(item.children?.length);
        const isChildActive = hasChildren && item.children?.some((child) => pathname === child.to);

        return (
          <Fragment key={item.label}>
            {hasChildren ? (
              <>
                <ListItemButton onClick={() => handleToggle(item.label)} selected={isChildActive} sx={{ pl: 1 }}>
                  {item.icon && (
                    <ListItemIcon sx={{ color: 'inherit', minWidth: 'auto', mr: 1 }}>
                      <item.icon />
                    </ListItemIcon>
                  )}
                  {!mobScreen && <ListItemText primary={<Typography fontSize={12}>{item.label}</Typography>} />}
                  {openMenu === item.label ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse
                  in={openMenu === item.label}
                  timeout={500}
                  easing={{
                    enter: 'cubic-bezier(0.4, 0, 0.2, 1)',
                    exit: 'cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                  unmountOnExit
                >
                  <List component="div" disablePadding>
                    {item.children?.map(renderChild)}
                  </List>
                </Collapse>
              </>
            ) : (
              <ListItemButton
                onClick={(e) => {
                  if (pathname === item.to) {
                    e.preventDefault();
                    return;
                  }
                  closeCustomHooks();
                  startLoading();
                }}
                component={Link}
                href={item.to || '#'}
                selected={pathname === item.to}
                sx={{
                  ...activeItemStyle,
                  
                  pl: 1,
                  cursor: pathname === item.to ? 'default' : 'pointer',
                }}
              >
                {item.icon && (
                  <ListItemIcon sx={{ color: 'inherit', minWidth: 'auto', mr: 1 }}>
                    <item.icon />
                  </ListItemIcon>
                )}
                {!mobScreen && <ListItemText primary={<Typography fontSize={12}>{item.label}</Typography>} />}
              </ListItemButton>
            )}
          </Fragment>
        );
      }),
    [links, pathname, openMenu, handleToggle, renderChild, activeItemStyle, mobScreen]
  );

  return (
    <aside className="left-0 top-0 h-screen bg-white text-[var(--color-secondary)] flex flex-col">
      <Box className="flex justify-center py-4 shrink-0">
        <Image src="/logo.png" alt="logo" width={mobScreen ? 60 : 120} height={50} loading="lazy" style={{ objectFit: 'contain' }} />
      </Box>

      <Box className="flex-1 overflow-y-auto">
        <List component="nav">{renderMenu}</List>
      </Box>
    </aside>
  );
}
