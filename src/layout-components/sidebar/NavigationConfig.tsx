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
  to?: string;
  icon?: any;
  children?: NavItem[];
};

export const links: NavItem[] = [
  {
    label: 'User Role Management',
    icon: ManageAccountsIcon,
    to: '/user-role-management',
    children: [
      { label: 'Users', to: '/user-role-management/users', icon: PersonAddAltIcon },
      { label: 'Roles', to: '/user-role-management/roles', icon: SupervisedUserCircleIcon },
      { label: 'User Group', to: '/user-role-management/user-group', icon: GroupAddIcon },
    ],
  },
  {
    label: 'File Reconciliation',
    icon: FileCopyIcon,
    to: '/file-reconciliation',
  },
   {
    label: 'Notification Settings',
    icon: NotificationsIcon,
    to: '/notification-settings',
  },
];
