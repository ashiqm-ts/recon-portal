export interface TabData {
  id: string;
  label: string;
  minAllowedPermissions?: number;
  maxAllowedPermissions?: number;
  children?: TabData[];
}
export const tabData: TabData[] = [
 
  // {
  //     id: 'P00020',
  //     label: "User Role Management",
  //     maxAllowedPermissions: 2,
  //     children: [{
  //         id: 'P00021',
  //         label: "Users",
  //         maxAllowedPermissions: 2,
  //         children: [{ id: 'P00024', label: "Create User" }, { id: 'P00025', label: "Edit User" }, { id: 'P00026', label: "Delete User" }]
  //     },
  //     {
  //         id: 'P00022',
  //         label: "Roles",
  //         maxAllowedPermissions: 1,
  //         children: [{ id: 'P00027', label: "Create Role" }, { id: 'P00028', label: "Assign Permissions" }]
  //     },
  //     {
  //         id: 'P00023',
  //         label: "User Group",
  //     }
  //     ],
  // },
];