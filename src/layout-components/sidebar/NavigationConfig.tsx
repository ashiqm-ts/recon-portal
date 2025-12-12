import {
  Dashboard as DashboardIcon,
  CreditCard as CreditCardIcon,
  AddCard as AddCardIcon,
  Preview as PreviewIcon,
  ManageAccounts as ManageAccountsIcon,
  PersonAddAlt as PersonAddAltIcon,
  SupervisedUserCircle as SupervisedUserCircleIcon,
  GroupAdd as GroupAddIcon,
  FileCopy as FileCopyIcon,
  Notifications as NotificationsIcon,
} from '@mui/icons-material';
import { Route as RouteIcon, Binary as BinaryIcon, Landmark as InstitutionIcon, PencilRuler as PencilRulerIcon, Waypoints as WaypointsIcon } from 'lucide-react';
import Image from 'next/image';

export type NavItem = {
  label: string;
  permissionId: string;
  to?: string;
  icon?: any;
  children?: NavItem[];
};


export const links: NavItem[] = [
  {
    label: 'User Role Management',
    permissionId: 'P00025',
    icon: ManageAccountsIcon,
    to: '/user-role-management',
    children: [
      { label: 'Users',permissionId: 'P00026', to: '/user-role-management/users', icon: PersonAddAltIcon },
      { label: 'Roles',permissionId: 'P00027', to: '/user-role-management/roles', icon: SupervisedUserCircleIcon },
      { label: 'User Group', permissionId: 'P00028',to: '/user-role-management/user-group', icon: GroupAddIcon },
    ],
  },
  {
    label: 'File Reconciliation',
    icon: FileCopyIcon,
    permissionId: 'P00084',
    to: '/file-reconciliation',
  },
  {
    label: 'Notification Settings',
    icon: NotificationsIcon,
    permissionId: 'P00001',
    to: '/notification-settings',
  },
];
 export const noPermissionRoutes = [
  "/sign-in",
  "/forgot-password",
  "/profile",
  "/recon-force-change-password"
];
