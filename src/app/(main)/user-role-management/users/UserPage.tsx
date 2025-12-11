'use client';
import { Box, Grid, IconButton, MenuItem } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { type ReactNode, useEffect, useState } from 'react';
import MuiDialog from '@/components/shared-ui/MuiDialog';
import { Formik } from 'formik';
import FormikController from '@/components/mui-components/formik-controller/FormikController';
import MuiButton from '@/components/mui-components/button/MuiButton';
import CustomCard from '@/components/shared-ui/CustomCard';
import AgGrid from '@/components/shared-ui/AgGrid';
import type { DataObjectType, Row } from '@/helper-function/PropTypes';
import { buttonName, handleDateTime, selectMenuItem } from '@/helper-function/pageUtils';
import InfoDialog from '@/components/shared-ui/InfoDialog';
import PageTitles from '@/helper-function/pageTitles';
import Header from '@/components/ui/Header';
import { initialValuesUserPage, userStatus, validationSchemaActiveorSuspend, validationSchemaResetPassword, validationSchemaUserPage } from './utils';
import axios from 'axios';
import { activateorSuspend, createUser, getAllUsersList, getRoleData, resetPassword, updateUser } from '@/config/apiConfig';
import { ApiResponse, useResponseHandler } from '@/components/store.js/useResponseHandler';
import { UserPageType } from './types';
import { useAuth } from '@/provider/AuthProvider';

const ActionRenderer = (params: { data: DataObjectType } & { onEdit: (data: DataObjectType) => void; onDelete: (data: DataObjectType) => void }): ReactNode => {
  const { data, onEdit, onDelete } = params;
  const { user } = useAuth();
  return (
    <Box className="flex justify-center justiffy-around ">
      <IconButton onClick={() => onEdit(data)} disabled={data?.loginUsername === user?.loginUsername}>
        <EditIcon sx={{ fontSize: '18px', color: 'var(--color-primary) disabled:!bg-gray-200 disabled:!text-gray-500' }} />
      </IconButton>
      {/* <IconButton onClick={() => onDelete(data)}>
        <DeleteIcon sx={{ fontSize: '18px', color: 'var(--color-primary)' }} />
      </IconButton> */}
    </Box>
  );
};
const ViewRenderer = () => {
  return (
    <Box>
      {/* <button>View</button> */}
      <MuiButton type="grid-btn">View</MuiButton>
    </Box>
  );
};

export default function UserPage(): ReactNode {
  const [pageControl, setPageControl] = useState({
    isEdit: false,
    isOpen: false,
    selectedValues: undefined,
    isResetPasswordOpen: false,
    isActiveSuspendOpen: false,
  });
  const { handleApiResponse } = useResponseHandler();
  const [rowData, setRowData] = useState([]);
  const [roleList, setRoleList] = useState<Row[]>([]);
  const { user } = useAuth();
  const handleEdit = (data): null => {
    void getRolesList();
    setPageControl((prev) => ({ ...prev, isEdit: true, isOpen: true, selectedValues: data }));
    return null;
  };
  const handleDelete = (row: { userId: unknown }): null => {
    const updatedRow = rowData.filter((item: { userId: unknown }) => item.userId !== row.userId);
    setRowData(updatedRow);
    return null;
  };
  const columnDefs = [
    {
      field: 'userId',
      headerName: 'ID',
    },
    // {
    //   field: 'userId',
    //   headerName: 'ID',
    //   cellStyle: { textAlign: 'left' },
    // },
    {
      field: 'firstName',
      headerName: 'First Name',
    },
    {
      field: 'lastName',
      headerName: 'Last Name',
    },
    {
      field: 'loginUsername',
      headerName: 'FullName',
    },
    {
      field: 'email',
      headerName: 'Email',
      // minWidth: 180,
    },

    {
      field: 'userStatusId',
      headerName: 'Status',
      valueGetter: ({ data }) => userStatus(data?.userStatusId),
    },
    {
      field: 'createdDatetime',
      headerName: 'Created DateTime',
      valueGetter: handleDateTime('createdDatetime'),
    },
    {
      field: 'lastUpdatedDatetime',
      headerName: 'Modified DateTime',
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
        onDelete: handleDelete,
      },
    },
    // {
    //   field: 'button',
    //   headerName: 'User Detail',
    //   filter: false,
    //   resizable: false,
    //   editable: false,
    //   sortable: false,
    //   cellStyle: { display: 'flex', justifyContent: 'center', alignItems: 'center' },
    //   cellRenderer: ViewRenderer,
    // },
  ];
  const getRolesList = async () => {
    const res = await getRoleData({ instnId: 1 });
    handleApiResponse({
      response: res?.data as ApiResponse,
      onSuccess: () => {
        setRoleList(res.data.data);
      },
    });
  };
  const handleAdd = (): void => {
    void getRolesList();
    setPageControl((prev) => ({ ...prev, isEdit: false, isOpen: true }));
  };
  const handleSubmit = async (values: UserPageType): void => {
    console.log(values);
    const payload = {
      loginUsername: values.loginUsername,
      roleId: values.roleId,
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      mobile: values.mobile,
      branchCodeList: ['ALL'],
    };
    if (pageControl?.isEdit) {
      const updateData = { id: pageControl?.selectedValues?.id, ...payload };
      const res = await updateUser(updateData);
      handleApiResponse({
        response: res?.data as ApiResponse,
        showSuccessMessage: true,
        onSuccess: () => {
          setPageControl((prev) => ({ ...prev, isEdit: false, isOpen: false, selectedValues: undefined }));
          getAllUsers();
        },
      });
    } else {
      const res = await createUser(payload);
      handleApiResponse({
        response: res?.data as ApiResponse,
        showSuccessMessage: true,
        onSuccess: () => {
          setPageControl((prev) => ({ ...prev, isEdit: false, isOpen: false, selectedValues: undefined }));
          getAllUsers();
        },
      });
    }
  };
  const handleSubmitResetPassword = async (values) => {
    const payload = {
      loginUserName: pageControl?.selectedValues?.loginUsername,
      reason: values.reason,
    };
    console.log(payload);
    const res = await resetPassword(payload);
    handleApiResponse({
      response: res?.data as ApiResponse,
      showSuccessMessage: true,
      onSuccess: () => {
        setPageControl((prev) => ({ ...prev, isEdit: false, isOpen: false, isResetPasswordOpen: false, selectedValues: undefined }));
        getAllUsers();
      },
    });
  };
  const handleSubmitActiveorSupsendUser = async (values) => {
    const payload = {
      id: pageControl?.selectedValues?.id,
      roleId: pageControl?.selectedValues?.roleId,
      branchCodeList: pageControl?.selectedValues?.branchCodeList,
      userStatus: pageControl?.selectedValues?.userStatusId === 2 ? 'A' : 'I',
      reason: values.reason,
    };
    const res = await activateorSuspend(payload);
    handleApiResponse({
      response: res?.data as ApiResponse,
      showSuccessMessage: true,
      onSuccess: () => {
        setPageControl((prev) => ({ ...prev, isEdit: false, isOpen: false, isActiveSuspendOpen: false, selectedValues: undefined }));
        getAllUsers();
      },
    });
  };
  const getAllUsers = async () => {
    const res = await getAllUsersList({});
    handleApiResponse({
      response: res?.data as ApiResponse,
      onSuccess: () => {
        setRowData(res.data.data);
      },
    });
  };
  useEffect(() => {
    void getAllUsers();
  }, []);
  return (
    <Box>
      <CustomCard>
        <Header name={PageTitles?.user} />
        <Box className="flex justify-end">
          <MuiButton type="basic-btn" onClick={handleAdd}>
            {buttonName}
          </MuiButton>
        </Box>
        <AgGrid rowData={rowData} columnDefs={columnDefs} />
      </CustomCard>
      {pageControl.isOpen && (
        <Formik initialValues={pageControl?.isEdit ? pageControl?.selectedValues : initialValuesUserPage} validationSchema={validationSchemaUserPage} onSubmit={handleSubmit}>
          <MuiDialog open={pageControl.isOpen} onClose={() => setPageControl((prev) => ({ ...prev, isOpen: false }))} width="700px" dialogTitle={pageControl.isEdit ? 'Edit User' : 'Add User'}>
            <Grid container spacing={3} justifyContent="center">
              <Grid size={{ xs: 6 }}>
                <FormikController control="textField" label="First Name" name="firstName" required />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <FormikController control="textField" label="Last Name" name="lastName" required />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <FormikController control="textField" label="Email" name="email" required />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <FormikController control="textField" label="Contact Number" name="mobile" required />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <FormikController control="textField" label="User Name" name="loginUsername" required disabled={pageControl?.isEdit} />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <FormikController label="Role Name" name="roleId" required control="autoComplete" optionsList={selectMenuItem('roleName', 'id', roleList)} />
              </Grid>
              {pageControl?.isEdit && (
                <>
                  <Grid size={{ xs: 6 }} sx={{ marginTop: '20px' }}>
                    <MuiButton type="basic-btn" onClick={() => setPageControl((prev) => ({ ...prev, isResetPasswordOpen: true }))}>
                      Reset Password
                    </MuiButton>
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <FormikController label="Status" name="userStatusId" control="switch" onChange={() => setPageControl((prev) => ({ ...prev, isActiveSuspendOpen: true }))} />
                  </Grid>
                </>
              )}
            </Grid>
          </MuiDialog>
        </Formik>
      )}
      <InfoDialog dialogTitle={`View ${PageTitles?.user}`} columnDefs={columnDefs} />
      <Formik initialValues={{ reason: '' }} onSubmit={handleSubmitActiveorSupsendUser} validationSchema={validationSchemaActiveorSuspend}>
        {({ resetForm }) => (
          <MuiDialog
            width="400px"
            dialogTitle="Activate User"
            open={pageControl.isActiveSuspendOpen}
            onClose={() => setPageControl((prev) => ({ ...prev, isActiveSuspendOpen: false }))}
            resetForm={resetForm}
          >
            <Grid container>
              <Grid size={{ xs: 12 }}>
                <FormikController control="textField" name="reason" label="Reason" inputProps={{ maxlength: 255 }} required />
              </Grid>
            </Grid>
          </MuiDialog>
        )}
      </Formik>
      <Formik initialValues={{ reason: '' }} onSubmit={handleSubmitResetPassword} validationSchema={validationSchemaResetPassword}>
        {({ resetForm }) => (
          <MuiDialog
            width="400px"
            dialogTitle={'Reset Password'}
            open={pageControl.isResetPasswordOpen}
            onClose={() => setPageControl((prev) => ({ ...prev, isResetPasswordOpen: false }))}
            resetForm={resetForm}
          >
            <Grid container>
              <Grid size={{ xs: 12 }}>
                <FormikController control="textField" name="reason" label="Reason" inputProps={{ maxlength: 255 }} required />
              </Grid>
            </Grid>
          </MuiDialog>
        )}
      </Formik>
    </Box>
  );
}
