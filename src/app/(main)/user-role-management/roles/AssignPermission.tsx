import { Box, List, ListItem, ListItemText, Switch, Tab, Tabs, Typography } from '@mui/material';
import React, { useState } from 'react';
// import { tabData } from "@/app/(main)/user-role-management/roles/utils";
import { useDialog } from '@/provider/DialogProvider';
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}
interface GrdchildState {
  [permissionId: string]: boolean;
}

interface ChildState {
  checked: boolean;
  grandchildren: GrdchildState;
}

interface ParentState {
  checked: boolean;
  children: {
    [childId: string]: ChildState;
  };
}

type AssignedState = {
  [parentId: string]: ParentState;
};
interface AssignPermissionProps {
  assigned: AssignedState;
  setAssigned: React.Dispatch<React.SetStateAction<AssignedState>>;
}

function TabPanel(props: TabPanelProps): React.JSX.Element {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} id={`vertical-tabpanel-${index}`} aria-labelledby={`vertical-tab-${index}`} {...other}>
      {value === index && <Box>{children}</Box>}
    </div>
  );
}
function a11yProps(index: number): { permissionId: string; 'aria-controls': string } {
  return {
    permissionId: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}
const switchDesign = {
  transform: 'scale(0.8)',
  '& .MuiSwitch-switchBase.Mui-checked': {
    color: 'var(--color-secondary)',
  },
  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
    backgroundColor: 'var(--color-primary)',
  },
  '& .MuiSwitch-track': {
    backgroundColor: '#424242',
  },
};
export default function AssignPermission({ assigned, setAssigned, rolePermissions }: AssignPermissionProps): React.JSX.Element {
  const { handleResponse } = useDialog();
  const [value, setValue] = useState(0);
  const handleChange = (event: React.SyntheticEvent, newValue: number): void => {
    setValue(newValue);
  };

  const handleSwitch = (parentId: string, childId?: string, grdchldId?: string): void => {
    const newState = structuredClone(assigned);
    const parent = newState[parentId];
    // const minAllowed = tabData.find(t => t.permissionId === parentId)?.minAllowedPermissions ?? 0;
    // const maxAllowed = tabData.find(t => t.permissionId === parentId)?.maxAllowedPermissions ?? Infinity;
    if (grdchldId && childId) {
      const child = parent.children[childId];
      const isCurrentlyChecked = child.grandchildren[grdchldId];
      const totalCheckedPermissions = Object.values(parent.children)
        .flatMap((ch: ChildState) => (ch.grandchildren ? Object.values(ch.grandchildren) : []))
        .filter(Boolean).length;
      // if (isCurrentlyChecked && totalCheckedPermissions <= minAllowed) {
      //     handleResponse(`At least ${minAllowed} permissions must be selected`, true);
      //     return;
      // }
      // if (!isCurrentlyChecked && totalCheckedPermissions >= maxAllowed) {
      //     handleResponse(`Max ${maxAllowed} permissions allowed.`, true);
      //     return;
      // }
      child.grandchildren[grdchldId] = !isCurrentlyChecked;
      child.checked = Object.values(child.grandchildren).some(Boolean);
      parent.checked = Object.values(parent.children).some((c) => c.checked);
      setAssigned(newState);
      return;
    }
    if (childId && !grdchldId) {
      const child = parent.children[childId];
      const newChildState = !child.checked;
      // const hasGrandchild = Object.keys(child.grandchildren).length > 0;
      // if (hasGrandchild && newChildState) {
      //     handleResponse("Please select grandchild instead.",true);
      //     return;
      // }
      const totalChecked = Object.values(parent.children).filter((c) => c.checked).length;
      // if (!newChildState && totalChecked <= minAllowed) {
      //     handleResponse(`At least ${minAllowed} permission(s) must remain selected.`, true);
      //     return;
      // }
      // if (newChildState && totalChecked >= maxAllowed) {
      //     handleResponse(`Only ${maxAllowed} permission(s) allowed.`, true);
      //     return;
      // }
      if (!newChildState) {
        Object.keys(child.grandchildren).forEach((gid) => {
          child.grandchildren[gid] = false;
        });
      }
      child.checked = newChildState;
      parent.checked = Object.values(parent.children).some((c) => c.checked);
      setAssigned(newState);
      return;
    }
    const newParentChecked = !parent.checked;
    if (newParentChecked) {
      const totalPermissions = Object.values(parent.children).length;
      // if (totalPermissions > maxAllowed) {
      //     // alert(`Cannot enable all. Max ${maxAllowed} permissions allowed`);
      //     return;
      // }
    } else {
      Object.entries(parent.children).forEach(([_, ch]) => {
        ch.checked = false;
        if (ch.grandchildren) {
          Object.keys(ch.grandchildren).forEach((gid) => {
            ch.grandchildren[gid] = false;
          });
        }
      });
    }
    parent.checked = newParentChecked;
    setAssigned(newState);
  };
  return (
    <>
      <Typography sx={{ fontWeight: 'bold', fontFamily: 'sans-serif', fontSize: '15px', marginTop: '30px', marginBottom: '20px' }}>Assign Permissions</Typography>
      <Box className="flex ">
        <Box sx={{ maxHeight: 200, overflowY: 'auto' }}>
          <Tabs
            orientation="vertical"
            variant="scrollable"
            value={value}
            scrollButtons={false}
            onChange={handleChange}
            sx={{
              '& .MuiTabs-indicator': {
                backgroundColor: 'var( --color-secondary)',
                display: 'none',
              },
            }}
          >
            {rolePermissions?.map((tab, index) => (
              <Tab
                key={index}
                label={tab.permission}
                {...a11yProps(index)}
                sx={{
                  fontSize: '14px',
                  color: 'var(--color-secondary)',
                  textTransform: 'none',
                  alignItems: 'flex-start',
                  minHeight: 0,
                  paddingY: 1,
                  '&.Mui-selected': {
                    color: 'white',
                    backgroundColor: 'var(--color-secondary)',
                  },
                }}
              />
            ))}
          </Tabs>
        </Box>
        <Box sx={{ maxHeight: 200, overflowY: 'auto', pr: '2.5rem' }}>
          {rolePermissions?.map((tab, index) => (
            <TabPanel key={index} value={value} index={index}>
              <Box className="flex justify-between items-center w-full">
                <Typography variant="h5" color="var(--color-primary)" sx={{ fontSize: '14px', fontWeight: '900px', pl: '2rem' }}>
                  {tab.permission}
                </Typography>
                <Switch sx={switchDesign} checked={assigned[tab.permissionId]?.checked} onChange={() => handleSwitch(tab.permissionId)} />
              </Box>
              <List sx={{ pl: 2, pt: 0 }}>
                {tab.children?.map((child, childId) => (
                  <React.Fragment key={childId}>
                    <ListItem disablePadding>
                      <Box className="flex justify-between items-center w-full">
                        <ListItemText
                          primary={child.permission}
                          sx={{
                            '& .MuiTypography-root': { color: 'var(--color-secondary)', fontSize: '13px', fontWeight: '800px', pl: '2rem' },
                          }}
                        />
                        <Switch sx={switchDesign} checked={assigned[tab.permissionId]?.children?.[child.permissionId]?.checked} onChange={() => handleSwitch(tab.permissionId, child.permissionId)} />
                      </Box>
                    </ListItem>
                    {child?.children && (
                      <List sx={{ pl: 2, pt: 0 }}>
                        {child.children?.map((grdchld, grdchldId) => (
                          <ListItem disablePadding key={grdchldId}>
                            <Box className="flex justify-between items-center w-full">
                              <ListItemText
                                primary={grdchld.permission}
                                sx={{
                                  '& .MuiTypography-root': { color: 'var(--color-primary)', fontSize: '13px', pl: '2rem' },
                                }}
                              />
                              <Switch sx={switchDesign} checked={assigned[tab.permissionId]?.children[child.permissionId]?.grandchildren?.[grdchld.permissionId]} onChange={() => handleSwitch(tab.permissionId, child.permissionId, grdchld.permissionId)} />
                            </Box>
                          </ListItem>
                        ))}
                      </List>
                    )}
                  </React.Fragment>
                ))}
              </List>
            </TabPanel>
          ))}
        </Box>
      </Box>
    </>
  );
}
