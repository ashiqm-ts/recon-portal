'use client';
import { type ReactNode, useEffect, useState } from 'react';
import { Box, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MuiDialog from '@/components/shared-ui/MuiDialog';
import { Formik } from 'formik';
import FormikController from '@/components/mui-components/formik-controller/FormikController';
import MuiButton from '@/components/mui-components/button/MuiButton';
import CustomCard from '@/components/shared-ui/CustomCard';
import AgGrid from '@/components/shared-ui/AgGrid';
import Header from '@/components/ui/Header';
// import { tabData } from '@/app/(main)/user-role-management/roles/utils';
import type { TabData } from '@/app/(main)/user-role-management/roles/utils';
import * as Yup from 'yup';
import type { FormikHelpers } from 'formik';
import { useDialog } from '@/provider/DialogProvider';
import {
  createRole,
  createUserGroup,
  deleteUser,
  getAllPermissionsList,
  getAllPermissionsListUserGroup,
  getAllRolesList,
  getAllUserGroupList,
  getUserGroupUsers,
  updateRole,
  updateUserGroup,
  userGroupAddUser,
} from '@/config/apiConfig';
import { ApiResponse, useResponseHandler } from '@/components/store.js/useResponseHandler';
import { DataObjectType } from '@/helper-function/PropTypes';
import { tabData } from '../user-group/utils';
import { handleDateTime } from '@/helper-function/pageUtils';
import AssignPermissionUserGroup from './AssignPermissionUserGroup';
import MuiTypography from '@/components/mui-components/typography/MuiTypography';

interface GrdchildState {
  [id: string]: boolean;
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

const validationSchemaUserGroup = Yup.object().shape({
  userGroupName: Yup.string()
    .required('Required')
    .max(64, 'Maximum length required is 64')
    .matches(/^(?=.*[A-Za-z])[A-Za-z ,.&-]*$/, 'Only Alphabets along with Space and &,-.')
    .min(1, 'Minimum length required is 1'),
});
const validationSchemaAddUser = Yup.object().shape({
  userId: Yup.string()
    .required('Required')
    .matches(/^[0-9]+$/, 'Please enter Numeric Values only')
    .min(9, 'Minimum length required is 9')
    .max(9, 'Maximum length required is 9'),
});
const ActionRenderer = (params: { data: DataObjectType } & { onEdit: (data: DataObjectType) => void; onAddUser: (data: DataObjectType) => void }): ReactNode => {
  const { data, onEdit, onAddUser } = params;
  return (
    <Box className="flex justify-center items-center">
      <MuiButton type="grid-btn" onClick={() => onAddUser(data)}>
        Add User
      </MuiButton>
      <IconButton onClick={() => onEdit(data)}>
        <EditIcon sx={{ fontSize: '18px', color: 'var(--color-primary)' }} />
      </IconButton>
    </Box>
  );
};

const DeleteRenderer = (params: { data: DataObjectType } & { onDelete: (data: DataObjectType) => void }): ReactNode => {
  const { data, onDelete } = params;

  return (
    <Box className="flex justify-center items-center">
      <IconButton onClick={() => onDelete(data)}>
        <DeleteIcon sx={{ fontSize: '18px', color: 'var(--color-primary)' }} />
      </IconButton>
    </Box>
  );
};

export default function UserGroupPage(): ReactNode {
  const { handleResponse } = useDialog();
  const { handleApiResponse } = useResponseHandler();
  const [pageControl, setPageControl] = useState({ isEdit: false, isOpen: false, selectedValues: undefined, isAddUser: false, isGroupUser: false });
  const [rowData, setRowData] = useState([]);
  const [rowDataUsers, setRowDataUsers] = useState([]);
  const [userGroupPermissions, setUserGroupPermissions] = useState([]);
  const [userGroupIdValue, setUserGroupIdValue] = useState('');
  // function buildTree(list) {
  //   const map = {}; // Map permissionId → item
  //   const roots = []; // Items with no parents

  //   // Initialize map
  //   list.forEach((item) => {
  //     map[item.permissionId] = { ...item, children: [] };
  //   });

  //   // Build hierarchy
  //   list.forEach((item) => {
  //     if (item.children) {
  //       item.children.forEach((childId) => {
  //         if (map[childId]) {
  //           map[item.permissionId].children.push(map[childId]);
  //           map[childId]._hasParent = true; // mark child as having parent
  //         }
  //       });
  //     }
  //   });

  //   // Root items = those without parents
  //   Object.values(map).forEach((item) => {
  //     if (!item._hasParent) roots.push(item);
  //     delete item._hasParent;
  //   });

  //   return roots;
  // }
  // const tree = buildTree(rolePermissions);

  const checkPermissions = (data: TabData[]): AssignedState => {
    const initialState: AssignedState = {};

    data.forEach((parent) => {
      const childrenState: { [childId: string]: ChildState } = {};

      parent.children?.forEach((child) => {
        const grandchildrenState: GrdchildState = {};

        // Set grandchildren checked state
        if (child.children && child.children.length > 0) {
          child.children.forEach((grandchild) => {
            grandchildrenState[grandchild.permissionId] = grandchild.isAssigned === true;
          });
        }

        // Build child state
        childrenState[child.permissionId] = {
          checked: child.isAssigned === true,
          grandchildren: grandchildrenState,
        };
      });

      // Build parent state
      initialState[parent.permissionId] = {
        checked: parent.isAssigned === true,
        children: childrenState,
      };
    });

    return initialState;
  };
  const initialPermissions = checkPermissions(userGroupPermissions);
  console.log('initialPermissions,', initialPermissions);
  const initialValues = {
    userGroupName: '',
    permissions: initialPermissions,
  };

  const handleSubmitAddUser = async (values,{resetForm}) => {
    const payload = {
      userId: values?.userId,
      userGroupId: userGroupIdValue,
    };
    const res = await userGroupAddUser(payload);
    handleApiResponse({
      response: res?.data as ApiResponse,
      onSuccess: () => {
        getUsersList(userGroupIdValue);
        setPageControl((prev) => ({ ...prev, isEdit: false, isOpen: false, isGroupUser: false, selectedValues: undefined }));
      resetForm()
      },
      showSuccessMessage: true,
    });
  };
  const handleEdit =async (data): null => {

    const payload = {
      userGroupId: data.id,
    };
    const res = await getAllPermissionsListUserGroup(payload);
    handleApiResponse({
      response: res?.data as ApiResponse,
      onSuccess: () => {
        setUserGroupPermissions(res.data.data);
        setPageControl((prev) => ({ ...prev, isEdit: true, isOpen: true, selectedValues: { ...data, permissions: checkPermissions(res.data.data) } }));
      },
    });
  };

  const getUsersList = async (id) => {
    const payload = {
      userGroupId: id,
    };
    const res = await getUserGroupUsers(payload);
    handleApiResponse({
      response: res?.data as ApiResponse,
      onSuccess: () => {
        setRowDataUsers(res.data.data);
      },
    });
  };

  const handleAddUser = (data) => {
    setPageControl((prev) => ({ ...prev, isAddUser: true, isOpen: false, isEdit: false, isGroupUser: false }));
    setUserGroupIdValue(data.id);
    getUsersList(data.id);
  };
  const columnDefs = [
    {
      field: 'userGroupName',
      headerName: 'User Group Name',
    },

    {
      field: 'createdDatetime',
      headerName: 'Created DateTime',
      valueGetter: handleDateTime('createdDatetime'),
    },
    {
      field: 'createdBy',
      headerName: 'Created By',
    },
    {
      field: 'lastUpdatedDatetime',
      headerName: 'Modified DateTime',
      valueGetter: handleDateTime('lastUpdatedDatetime'),
    },
    {
      field: 'lastUpdatedBy',
      headerName: 'Modified By',
    },
    {
      field: 'action',
      headerName: 'Actions',
      filter: false,
      resizable: false,
      editable: false,
      sortable: false,
      cellRenderer: ActionRenderer,
      cellStyle: { display: 'flex', justifyContent: 'center', alignItems: 'center' },
      cellRendererParams: {
        onAddUser: (params) => handleAddUser(params),
        onEdit: (params) => handleEdit(params),
      },
    },
  ];
  const handleDelete =async (data) => {
    const payload = {
      userId: data?.userId,
      userGroupId: userGroupIdValue,
    };
    const res = await deleteUser(payload);
    handleApiResponse({
      response: res?.data as ApiResponse,
      onSuccess: () => {
        getUsersList(userGroupIdValue);
      },
      showSuccessMessage: true,
    });
  };

  const columnDefsUsers = [
    {
      field: 'userId',
      headerName: 'User ID',
    },
    {
      field: 'loginUsername',
      headerName: 'User Name',
    },

    {
      field: 'firstName',
      headerName: 'First Name',
    },
    {
      field: 'lastName',
      headerName: 'Last Name',
    },
    {
      field: 'createdDatetime',
      headerName: 'Created DateTime',
      valueGetter: handleDateTime('createdDatetime'),
    },
    {
      field: 'lastUpdatedDatetime',
      headerName: 'Modified DateTime',
      valueGetter: handleDateTime('lastUpdatedDatetime'),
    },
    {
      field: 'action',
      headerName: 'Actions',
      filter: false,
      resizable: false,
      editable: false,
      sortable: false,
      cellRenderer: DeleteRenderer,
      cellStyle: { display: 'flex', justifyContent: 'center', alignItems: 'center' },
      cellRendererParams: {
        onDelete: (params) => handleDelete(params),
      },
    },
  ];
  const handleAdd = (): void => {
    setPageControl((prev) => ({ ...prev, isEdit: false, isOpen: true }));
  };
  console.log('initial', initialValues);

  const handleSubmit = async (values: typeof initialValues, actions: FormikHelpers<typeof initialValues>): void => {
    const parentPerm: string[] = [];
    userGroupPermissions.forEach((parent) => {
      const parentState = values.permissions[parent.permissionId];
      if (!parentState) return;
      let totalSelected = 0;
      Object.values(parentState.children).forEach((child) => {
        if (Object.keys(child.grandchildren).length > 0) {
          totalSelected += Object.values(child.grandchildren).filter(Boolean).length;
        } else if (child.checked) {
          totalSelected++;
        }
      });
      const minAllowed = parent.minAllowedPermissions ?? 0;
      if (totalSelected < minAllowed) {
        parentPerm.push(`${parent.permission} -Minimum required permission: ${minAllowed}`);
      }
    });

    if (parentPerm.length > 0) {
      handleResponse(`Please select the minimum allowed permission:\n\n${parentPerm.join('\n')}`, true);
      actions.setSubmitting(false);
      return;
    }

    const collectSelectedPermissionIds = (permissions: AssignedState): string[] => {
      const selectedIds: string[] = [];

      Object.entries(permissions).forEach(([parentId, parent]) => {
        if (parent.checked) selectedIds.push(parentId);

        Object.entries(parent.children).forEach(([childId, child]) => {
          if (child.checked) selectedIds.push(childId);

          Object.entries(child.grandchildren).forEach(([grandId, isChecked]) => {
            if (isChecked) selectedIds.push(grandId);
          });
        });
      });

      return selectedIds;
    };
    console.log(values.permissions);
    console.log(collectSelectedPermissionIds(values.permissions));
    // const permissionIdList = collectSelectedPermissionIds(values.permissions);
    function findIdsByPermissionIds(data, targets) {
      const result = [];

      function search(node) {
        if (!node) return;

        // Trim to handle trailing spaces in permissionId
        const pid = (node.permissionId || '').trim();

        if (targets.includes(pid)) {
          result.push(node.id);
        }

        if (Array.isArray(node.children)) {
          node.children.forEach((child) => search(child));
        }
      }

      // If data itself is an array, iterate it
      if (Array.isArray(data)) {
        data.forEach((item) => search(item));
      } else {
        search(data);
      }

      return result;
    }
    const idList = findIdsByPermissionIds(userGroupPermissions, collectSelectedPermissionIds(values.permissions));
    const data = {
      userGroupName: values.userGroupName,
      instnId: 1,
      permissionIdList: idList,
    };
    if (pageControl?.isEdit) {
      const updateData = { id: pageControl?.selectedValues?.id, canEdit: pageControl?.selectedValues.canEdit, isDeleted: pageControl?.selectedValues.isDeleted, ...data };
      console.log('Final data:', updateData);
      const res = await updateUserGroup(updateData);
      handleApiResponse({
        response: res?.data as ApiResponse,
        onSuccess: () => {
          getAllUserGroup();
          setPageControl((prev) => ({ ...prev, isEdit: false, isOpen: false, selectedValues: undefined }));
        },
        showSuccessMessage: true,
      });
    } else {
      console.log('Final data:', data);
      const res = await createUserGroup(data);
      handleApiResponse({
        response: res?.data as ApiResponse,
        onSuccess: () => {
          getAllUserGroup();
          setPageControl((prev) => ({ ...prev, isEdit: false, isOpen: false, selectedValues: undefined }));
        },
        showSuccessMessage: true,
      });
    }
  };

  const getAllUserGroup = async () => {
    const payload = {
      instnId: 1,
    };
    const res = await getAllUserGroupList(payload);
    handleApiResponse({
      response: res?.data as ApiResponse,
      onSuccess: () => {
        setRowData(res.data.data);
      },
    });
  };
  const getAllPermissions = async (value) => {
    const payload = {
      userGroupId: value,
    };
    const res = await getAllPermissionsListUserGroup(payload);
    handleApiResponse({
      response: res?.data as ApiResponse,
      onSuccess: () => {
        setUserGroupPermissions(res.data.data);
      },
    });
  };
  const getApis = () => {
    Promise.all([getAllUserGroup(), getAllPermissions(null)]);
  };
  useEffect(() => {
    getApis();
  }, []);
  return (
    <Box>
      <CustomCard>
        <Header name="User Group" />
        <Box className="flex justify-end">
          <MuiButton type="basic-btn" onClick={handleAdd}>
            Add New
          </MuiButton>
        </Box>
        <AgGrid rowData={rowData} columnDefs={columnDefs} />
      </CustomCard>
      {pageControl.isOpen && (
        <Formik initialValues={pageControl?.isEdit ? pageControl.selectedValues : initialValues} onSubmit={handleSubmit} validationSchema={validationSchemaUserGroup} enableReinitialize>
          {({ values, setFieldValue }) => (
            <MuiDialog
              open={pageControl.isOpen}
              onClose={() => setPageControl((prev) => ({ ...prev, isOpen: false }))}
              width="700px"
              dialogTitle={pageControl.isEdit ? 'Edit User Group' : 'Add User Group'}
            >
              <Grid container spacing={3} justifyContent="center">
                <Grid size={{ xs: 6 }}>
                  <FormikController control="textField" label="Name" name="userGroupName" required disabled={pageControl?.isEdit} />
                </Grid>
                <Grid size={{ xs: 6 }}></Grid>
              </Grid>
              <AssignPermissionUserGroup assigned={values.permissions} setAssigned={(newVal) => void setFieldValue('permissions', newVal)} userGroupPermissions={userGroupPermissions} />
            </MuiDialog>
          )}
        </Formik>
      )}
      <Dialog
        className="z-20"
        sx={{
          '& .MuiDialog-container': {
            '& .MuiPaper-root': {
              width: '100%',
              maxWidth: '70%',
              borderRadius: '15px',
            },
          },
        }}
        open={pageControl.isAddUser}
        onClose={() => {
          setPageControl((prev) => ({ ...prev, isAddUser: false }));
        }}
      >
        <DialogTitle>
          <Box className="flex justify-between">
            <MuiTypography>View Users</MuiTypography>
          </Box>
        </DialogTitle>

        <DialogContent>
          <Box className="my-2 flex justify-end">
            <MuiButton type="basic-btn" onClick={() => setPageControl((prev) => ({ ...prev, isGroupUser: true }))}>
              Add New
            </MuiButton>
          </Box>

          <AgGrid rowData={rowDataUsers} columnDefs={columnDefsUsers} />
        </DialogContent>
        <DialogActions>
          <Box className="my-2">
            <MuiButton onClick={() => setPageControl((prev) => ({ ...prev, isAddUser: false }))} type="cancel-btn">
              Cancel
            </MuiButton>
          </Box>
        </DialogActions>
      </Dialog>

      <Formik initialValues={{ userId: '' }} onSubmit={handleSubmitAddUser} validationSchema={validationSchemaAddUser}>
        {({ resetForm }) => (
          <MuiDialog width="400px" dialogTitle={'Add User'} open={pageControl.isGroupUser} onClose={() => setPageControl((prev) => ({ ...prev, isGroupUser: false }))} resetForm={resetForm}>
            <Grid container>
              <Grid size={{ xs: 12 }}>
                <FormikController control="textField" name="userId" label="User ID" inputProps={{ maxlength: 9 }} required />
              </Grid>
            </Grid>
          </MuiDialog>
        )}
      </Formik>
    </Box>
  );
}
