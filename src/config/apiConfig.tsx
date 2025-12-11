import axiosInstance from './axios';
import { jwtServiceConfig } from './jwtServiceConfig';
import { ApiResponseType } from '@/helper-function/PropTypes';
import { UserPageType } from '@/app/(main)/user-role-management/users/types';
import { loginType } from '@/app/(auth)/sign-in/types';

interface TransactionRoute {
  id: string;
  source: string;
  destination: string;
  txnType: string;
}

interface TypeResponse {
  responseCode: number;
  data: TransactionRoute[];
  message?: string;
  errors?: { message: string }[];
}
interface ResponseType {
  data: ApiResponseType;
}

//auth
export const getLogin = (data: loginType): Promise<ResponseType> => {
  const response = axiosInstance.post(jwtServiceConfig.authAuthenticationLogin, data, {
    headers: {
      channel: '01',
      instnId: 1,
    },
  });
  return response;
};
export const getLogout = (data): Promise<ResponseType> => {
  const response = axiosInstance.post(jwtServiceConfig.authAuthenticationLogout, data, {
    headers: {
      channel: '01',
      instnId: 1,
    },
  });
  return response;
};
export const getRefresh = (data: loginType): Promise<ResponseType> => {
  // delete axiosInstance.defaults.headers.post['Authorization'];
  const response = axiosInstance.post(jwtServiceConfig.authAuthenticationRefresh, data, {
    headers: {
      channel: '01',
      instnId: 1,
    },
  });
  return response;
};
export const getRegenerate = (data: loginType): Promise<ResponseType> => {
  // delete axiosInstance.defaults.headers.post['Authorization'];
  const response = axiosInstance.post(jwtServiceConfig.authAuthenticationRegenerateToken, data, {
    headers: {
      channel: '01',
      instnId: 1,
    },
  });
  return response;
};
export const forgotPassword = (data: loginType): Promise<ResponseType> => {
  const response = axiosInstance.post(jwtServiceConfig.authAuthenticationForgotPassword, data, {
    headers: {
      channel: '',
      instnId: 1,
    },
  });
  return response;
};
export const changePassword = (data: loginType): Promise<ResponseType> => {
  const response = axiosInstance.post(jwtServiceConfig.authAuthenticationChangePassword, data, {
    headers: {
      channel: '',
      instnId: 1,
    },
  });
  return response;
};
export const modifyUserPassword = (data: loginType): Promise<ResponseType> => {
  const response = axiosInstance.post(jwtServiceConfig.authAuthenticationModifyUserPassword, data, {
    headers: {
      channel: '',
      instnId: 1,
    },
  });
  return response;
};
//user page
export const getRoleData = (data): Promise<ResponseType> => {
  const response = axiosInstance.post(jwtServiceConfig.authRoleViewAllDropdown, data);
  return response;
};
export const getAllUsersList = (data): Promise<ResponseType> => {
  const response = axiosInstance.post(jwtServiceConfig.authUserViewAll, data);
  return response;
};
export const createUser = (data: UserPageType): Promise<ResponseType> => {
  const response = axiosInstance.post(jwtServiceConfig.authUserAdd, data);
  return response;
};
export const updateUser = (data: UserPageType): Promise<ResponseType> => {
  const response = axiosInstance.post(jwtServiceConfig.authUserEdit, data);
  return response;
};

export const resetPassword = (data: { reason: string; loginUsername: string }): Promise<ResponseType> => {
  const response = axiosInstance.post(jwtServiceConfig.authAuthenticationResetPassword, data);
  return response;
};

export const activateorSuspend = (data: { remarks: string }): Promise<ResponseType> => {
  const response = axiosInstance.post(jwtServiceConfig.authUserActivateOrSuspend, data);
  return response;
};

export const getAllRolesList = (data): Promise<ResponseType> => {
  const response = axiosInstance.post(jwtServiceConfig.authRoleViewAll, data);
  return response;
};

export const createRole = (data): Promise<ResponseType> => {
  const response = axiosInstance.post(jwtServiceConfig.authRoleSaveRole, data);
  return response;
};
export const updateRole = (data): Promise<ResponseType> => {
  const response = axiosInstance.post(jwtServiceConfig.authRoleEditRole, data);
  return response;
};
export const getAllPermissionsList = (data): Promise<ResponseType> => {
  const response = axiosInstance.post(jwtServiceConfig.authPermissionGetPermissionsForRole, data);
  return response;
};

export const getAllUserGroupList = (data): Promise<ResponseType> => {
  const response = axiosInstance.post(jwtServiceConfig.authUserGroupGetAll, data);
  return response;
};
export const getUserGroupUsers = (data): Promise<ResponseType> => {
  const response = axiosInstance.post(jwtServiceConfig.authUserGroupGetUserGrpUsers, data);
  return response;
};
export const getAllPermissionsListUserGroup = (data): Promise<ResponseType> => {
  const response = axiosInstance.post(jwtServiceConfig.authUserGroupGetUserGrpPermissions, data);
  return response;
};
export const createUserGroup = (data): Promise<ResponseType> => {
  const response = axiosInstance.post(jwtServiceConfig.authUserGroupCreateUserGroup, data);
  return response;
};
export const updateUserGroup = (data): Promise<ResponseType> => {
  const response = axiosInstance.post(jwtServiceConfig.authUserGroupAddOrEditUserGroup, data);
  return response;
};
export const userGroupAddUser = (data): Promise<ResponseType> => {
  const response = axiosInstance.post(jwtServiceConfig.authUserGroupAddUser, data);
  return response;
};
export const deleteUser = (data): Promise<ResponseType> => {
  const response = axiosInstance.post(jwtServiceConfig.authUserGroupDeleteUser, data);
  return response;
};
export const fileUploadATM = (data): Promise<ResponseType> => {
  const response = axiosInstance.post(jwtServiceConfig.fleUploadMultipleFile, data, {
    headers: {
      channelId: '01',
      instnId: 1,
      agencyCode: 'BOB',
    },
  });
  return response;
};
export const getUploadedFile = (data): Promise<ResponseType> => {
  const response = axiosInstance.post(jwtServiceConfig.fleGetAllUploadedFileDetails, data, {
    headers: {
      channelId: '01',
      instnId: 1,
      agencyCode: 'BOB',
    },
  });
  return response;
};
export const viewBase64file = (data): Promise<ResponseType> => {
  const response = axiosInstance.post(jwtServiceConfig.fleViewFileBase64, data, {
    headers: {
      channelId: '01',
      instnId: 1,
      agencyCode: 'BOB',
    },
  });
  return response;
};
