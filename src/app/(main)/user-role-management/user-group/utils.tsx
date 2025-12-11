export interface TabData {
    id: string;
    label: string;
    minAllowedPermissions?: number;
    maxAllowedPermissions?: number;
    children?: TabData[];
}
export const tabData: TabData[] = [
   
   
];