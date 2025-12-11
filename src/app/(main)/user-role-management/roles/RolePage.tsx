'use client';
import { type ReactNode, useEffect, useState } from 'react';
import { Box, Grid, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import MuiDialog from '@/components/shared-ui/MuiDialog';
import { Formik } from 'formik';
import FormikController from '@/components/mui-components/formik-controller/FormikController';
import MuiButton from '@/components/mui-components/button/MuiButton';
import CustomCard from '@/components/shared-ui/CustomCard';
import AgGrid from '@/components/shared-ui/AgGrid';
import AssignPermission from '@/app/(main)/user-role-management/roles/AssignPermission';
import Header from '@/components/ui/Header';
// import { tabData } from '@/app/(main)/user-role-management/roles/utils';
import type { TabData } from '@/app/(main)/user-role-management/roles/utils';
import * as Yup from 'yup';
import type { FormikHelpers } from 'formik';
import { useDialog } from '@/provider/DialogProvider';
import { createRole, getAllPermissionsList, getAllRolesList, updateRole } from '@/config/apiConfig';
import { ApiResponse, useResponseHandler } from '@/components/store.js/useResponseHandler';
import { DataObjectType } from '@/helper-function/PropTypes';
import { tabData } from '../user-group/utils';
import { handleDateTime } from '@/helper-function/pageUtils';
import { useAuth } from '@/provider/AuthProvider';
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

const validationSchemaRoles = Yup.object().shape({
  roleName: Yup.string()
    .required('Required')
    .max(64, 'Maximum length required is 64')
    .matches(/^(?=.*[A-Za-z])[A-Za-z ,.&-]*$/, 'Only Alphabets along with Space and &,-.')
    .min(1, 'Minimum length required is 1'),
  roleDesc: Yup.string()
    .required('Required')
    .matches(/^[-,&A-Za-z0-9. ']*$/, 'Only Alphanumeric along with Space and &,-.')
    .max(255, 'Maximum length required is 255'),
});
const ActionRenderer = (params: { data: DataObjectType } & { onEdit: (data: DataObjectType) => void; onDelete: (data: DataObjectType) => void }): ReactNode => {
  const { data, onEdit, onDelete } = params;
  const { user } = useAuth();
  return (
    <Box className="flex justify-center justiffy-around">
      <IconButton onClick={() => onEdit(data)} disabled={data?.id === user?.roleId}>
        <EditIcon sx={{ fontSize: '18px', color: 'var(--color-primary) disabled:!bg-gray-200 disabled:!text-gray-500  ' }} />
      </IconButton>
    </Box>
  );
};

export default function RolePage(): ReactNode {
  const { handleResponse } = useDialog();
  const { handleApiResponse } = useResponseHandler();

  const [pageControl, setPageControl] = useState({ isEdit: false, isOpen: false, selectedValues: undefined });
  const [rowData, setRowData] = useState([]);
  const [rolePermissions, setRolePermissions] = useState([]);

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

  // const clearPermissions = (data: TabData[]): AssignedState => {
  //   console.log('data,', data);
  //   const initialState: AssignedState = {};
  //   data.forEach((parent) => {
  //     const childrenState: { [childId: string]: ChildState } = {};
  //     parent.children?.forEach((child) => {
  //       const grandchildrenState: GrdchildState = {};
  //       if (child.children && child.children.length > 0) {
  //         child.children.forEach((grandchild) => {
  //           grandchildrenState[grandchild.permissionId] = false;
  //         });
  //       }
  //       childrenState[child.permissionId] = {
  //         checked: false,
  //         grandchildren: grandchildrenState,
  //       };
  //     });
  //     initialState[parent.permissionId] = {
  //       checked: false,
  //       children: childrenState,
  //     };
  //   });
  //   return initialState;
  // };
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

  console.log('rolePermissions,', rolePermissions);
  const initialPermissions = checkPermissions(rolePermissions);
  console.log('initialPermissions,', initialPermissions);
  console.log('pageControl,', pageControl?.selectedValues);
  const initialValues = {
    roleName: '',
    roleDesc: '',
    permissions: initialPermissions,
  };
  const handleEdit = async (data): null => {
    // getAllPermissions(data?.id);
    // setPageControl((prev) => ({ ...prev, isEdit: true, isOpen: true, selectedValues: { ...data, permissions: initialPermissions } }));
    // return null;
    const payload = {
      roleId: data.id,
    };
    const res = await getAllPermissionsList(payload);
    handleApiResponse({
      response: res?.data as ApiResponse,
      onSuccess: () => {
        setRolePermissions(res.data.data);
        setPageControl((prev) => ({ ...prev, isEdit: true, isOpen: true, selectedValues: { ...data, permissions: checkPermissions(res.data.data) } }));
      },
    });
  };
  const columnDefs = [
    {
      field: 'roleId',
      headerName: 'ID',
      cellStyle: { textAlign: 'left' },
    },
    {
      field: 'roleName',
      headerName: 'Role Name',
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
        onEdit: (params) => handleEdit(params),
      },
    },
  ];
  const handleAdd = (): void => {
    setPageControl((prev) => ({ ...prev, isEdit: false, isOpen: true }));
  };
  console.log('initial', initialValues);

  const handleSubmit = async (values: typeof initialValues, actions: FormikHelpers<typeof initialValues>): void => {
    const parentPerm: string[] = [];
    rolePermissions.forEach((parent) => {
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
    const idList = findIdsByPermissionIds(rolePermissions, collectSelectedPermissionIds(values.permissions));
    const data = {
      roleName: values.roleName,
      roleDesc: values.roleDesc,
      instnId: 1,
      permissionIdList: idList,
    };
    if (pageControl?.isEdit) {
      const updateData = { id: pageControl?.selectedValues?.id, canEdit: pageControl?.selectedValues.canEdit, isDeleted: pageControl?.selectedValues.isDeleted, ...data };
      console.log('Final data:', updateData);
      const res = await updateRole(updateData);
      handleApiResponse({
        response: res?.data as ApiResponse,
        onSuccess: () => {
          getAllRoles();
          setPageControl((prev) => ({ ...prev, isEdit: false, isOpen: false, selectedValues: undefined }));
        },
        showSuccessMessage: true,
      });
    } else {
      console.log('Final data:', data);
      const res = await createRole(data);
      handleApiResponse({
        response: res?.data as ApiResponse,
        onSuccess: () => {
          getAllRoles();
          setPageControl((prev) => ({ ...prev, isEdit: false, isOpen: false, selectedValues: undefined }));
        },
        showSuccessMessage: true,
      });
    }
  };

  const getAllRoles = async () => {
    const payload = {
      instnId: 1,
    };
    const res = await getAllRolesList(payload);
    handleApiResponse({
      response: res?.data as ApiResponse,
      onSuccess: () => {
        setRowData(res.data.data);
      },
    });
  };
  const getAllPermissions = async (value) => {
    const payload = {
      roleId: value,
    };
    const res = await getAllPermissionsList(payload);
    handleApiResponse({
      response: res?.data as ApiResponse,
      onSuccess: () => {
        setRolePermissions(res.data.data);
      },
    });
  };
  const getApis = () => {
    Promise.all([getAllRoles(), getAllPermissions(null)]);
  };
  useEffect(() => {
    getApis();
  }, []);
  return (
    <Box>
      <CustomCard>
        <Header name="Roles" />
        <Box className="flex justify-end">
          <MuiButton type="basic-btn" onClick={handleAdd}>
            Add New
          </MuiButton>
        </Box>
        <AgGrid rowData={rowData} columnDefs={columnDefs} />
      </CustomCard>
      {pageControl.isOpen && (
        <Formik initialValues={pageControl?.isEdit ? pageControl.selectedValues : initialValues} onSubmit={handleSubmit} validationSchema={validationSchemaRoles} enableReinitialize>
          {({ values, setFieldValue }) => (
            <MuiDialog open={pageControl.isOpen} onClose={() => setPageControl((prev) => ({ ...prev, isOpen: false }))} width="700px" dialogTitle={pageControl.isEdit ? 'Edit Role' : 'Add Role'}>
              <Grid container spacing={3} justifyContent="center">
                <Grid size={{ xs: 6 }}>
                  <FormikController control="textField" label="Name" name="roleName" required disabled={pageControl?.isEdit}/>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <FormikController control="textField" label="Description" name="roleDesc" />
                </Grid>
              </Grid>
              <AssignPermission assigned={values.permissions} setAssigned={(newVal) => void setFieldValue('permissions', newVal)} rolePermissions={rolePermissions} />
            </MuiDialog>
          )}
        </Formik>
      )}
    </Box>
  );
}
