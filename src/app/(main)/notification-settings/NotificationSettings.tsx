'use client';

import { Box, Grid, IconButton, Switch, Typography, Tab, Card, TextField } from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { type ReactNode, useEffect, useState, useRef } from 'react';
import MuiDialog from '@/components/shared-ui/MuiDialog';
import { Field, Form, Formik } from 'formik';
import FormikController from '@/components/mui-components/formik-controller/FormikController';
import MuiButton from '@/components/mui-components/button/MuiButton';
import CustomCard from '@/components/shared-ui/CustomCard';
import AgGrid from '@/components/shared-ui/AgGrid';
import type { DataObjectType } from '@/helper-function/PropTypes';
import { buttonName } from '@/helper-function/pageUtils';
import InfoDialog from '@/components/shared-ui/InfoDialog';
import PageTitles from '@/helper-function/pageTitles';
import Header from '@/components/ui/Header';
import SettingsIcon from '@mui/icons-material/Settings';
import { FilterRounded } from '@mui/icons-material';

export default function FileReconciliation(): ReactNode {
  const [setting, setSetting] = useState<boolean>(false);
  const [parentIndex, setParentIndex] = useState<number>(0);
  const [childIndex, setChildIndex] = useState<number>(0);
  const [grChildIndex, setGrChildIndex] = useState<number>(0);
  const [tabValue, setTabValue] = useState<any>(0);

  const [featureValues, setFeatureValues] = useState({} as initialValueNotifyType);
  const [dynamicValues, setDynamicValues] = useState([]);
  const [error, setError] = useState({ isSmsText: false, isInAppText: false, isEmailSubject: false, isEmailGreeting: false, isEmailBody: false });
  const [newList, setNewList] = useState([]);
  const textFieldRefSmsText = useRef(null);
  const textFieldRefInAppText = useRef(null);
  const textFieldRefEmailSubject = useRef(null);
  const textFieldRefEmailGreeting = useRef(null);
  const textFieldRefEmailBody = useRef(null);
  const styleSwitch = {
    '& .MuiSwitch-switchBase.Mui-checked': {
      color: 'var(--color-secondary)',
    },
    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
      backgroundColor: 'var(--color-secondary)',
    },
    '& .MuiSwitch-track': {
      backgroundColor: '#b0b0b0',
      opacity: 1,
    },
  };
  const getAllNotificationFeatures = async () => {
    const response = [
      {
        featureId: 1,
        featureName: 'User Role Management',
        children: [
          {
            featureId: 2,
            featureName: 'Create User',
            events: [
              {
                id: 4671,
                instnId: 1,
                eventId: 'E0004',
                eventName: 'Notify User for user created',
                isSmsEnabled: 'Y',
                isEmailEnabled: 'Y',
                isInappEnabled: 'Y',
                smsText: 'Dear {userName},\\nYour user has been created.',
                inappText: 'Dear {userName}, Your user has been created.',
                emailGreeting: 'Dear {userName},',
                emailBody:
                  'Welcome to CardSYS System!\\nYour account has been created with Username: {userName}.\\nPlease click the following link to set your account password: {url}?token={token}\\nThis link will expire in {pswdExpiryTime} hours.',
                emailSubject: 'User Created',
              },
            ],
          },
          {
            featureId: 3,
            featureName: 'Update User',
            events: [
              {
                id: 4629,
                instnId: 1,
                eventId: 'E0008',
                eventName: 'Notify User for user updated',
                isSmsEnabled: 'N',
                isEmailEnabled: 'Y',
                isInappEnabled: 'Y',
                smsText: 'Dear {userId},\\nYour details have been successfully updated by {userId}.',
                inappText: 'Your details have been successfully updated by {userId}.',
                emailGreeting: 'Dear {userId},',
                emailBody: 'Your details have been successfully updated by {userId}.\\nRequest Details : \\nRequested By : {lastUpdatedBy}\\nRequested Datetime : {lastUpdatedDatetime}',
                emailSubject: 'User Updated',
              },
            ],
          },
          {
            featureId: 4,
            featureName: 'Delete User',
            events: [
              {
                id: 4687,
                instnId: 1,
                eventId: 'E0012',
                eventName: 'Delete User notification to user',
                isSmsEnabled: 'N',
                isEmailEnabled: 'Y',
                isInappEnabled: 'Y',
                smsText: 'Dear {firstName} {lastName},\\nDear {firstName} {lastName}, your user has been deleted.',
                inappText: 'Dear {firstName} {lastName}, your user has been deleted.',
                emailGreeting: 'Dear {firstName} {lastName},',
                emailBody: 'Your user has been successfully deleted.',
                emailSubject: 'User Deleted',
              },
            ],
          },
          {
            featureId: 5,
            featureName: 'Change user account status',
            events: [
              {
                id: 4634,
                instnId: 1,
                eventId: 'E0016',
                eventName: 'Change user account status notification to user',
                isSmsEnabled: 'N',
                isEmailEnabled: 'Y',
                isInappEnabled: 'Y',
                smsText: 'Dear {firstName} {lastName},\\nDear {firstName} {lastName}, your user account status has been changed.',
                inappText: 'Dear {firstName} {lastName}, your user account status has been changed.',
                emailGreeting: 'Dear {firstName} {lastName},',
                emailBody: 'Your user account status has been successfully changed.',
                emailSubject: 'User Account Status Changed',
              },
            ],
          },
          {
            featureId: 6,
            featureName: 'Reset Password',
            events: [
              {
                id: 4649,
                instnId: 1,
                eventId: 'E0020',
                eventName: 'Notify maker for password reset',
                isSmsEnabled: 'N',
                isEmailEnabled: 'Y',
                isInappEnabled: 'Y',
                smsText: 'Dear {userId},\\nYour Reset Password request has been successfully processed. Please check mail for link to change password.',
                inappText: 'Your Reset Password request has been successfully processed. Please check mail for link to change password.',
                emailGreeting: 'Dear {userId},',
                emailBody:
                  'Your Reset Password request has been successfully processed. Please be aware that the reset link will expire in {pswdExpiryTime} hours.\\nTo set a new password, click the following link: {url}?token={token}',
                emailSubject: 'Password Reset',
              },
            ],
          },
          {
            featureId: 7,
            featureName: 'Create Role',
            events: [
              {
                id: 4758,
                instnId: 1,
                eventId: 'E0392',
                eventName: 'Notify Role for role created',
                isSmsEnabled: 'N',
                isEmailEnabled: 'Y',
                isInappEnabled: 'Y',
                smsText: 'Dear {userId},\\nYou have been successfully created the Role "{roleName}".',
                inappText: 'You have been successfully created the Role "{roleName}".',
                emailGreeting: 'Dear {userId},',
                emailBody: 'You have been successfully created the Role "{roleName}".\\nRequest Details : \\nRequested By : {lastUpdatedBy}\\nRequested Datetime : {lastUpdatedDatetime}',
                emailSubject: 'Role Created',
              },
            ],
          },
          {
            featureId: 8,
            featureName: 'Update Role',
            events: [
              {
                id: 4638,
                instnId: 1,
                eventId: 'E0027',
                eventName: 'Notify maker for role updated',
                isSmsEnabled: 'N',
                isEmailEnabled: 'Y',
                isInappEnabled: 'Y',
                smsText: 'Dear {userId},\\nYou have been successfully updated the Role "{roleName}".',
                inappText: 'You have been successfully updated the Role "{roleName}".',
                emailGreeting: 'Dear {userId},',
                emailBody: 'You have been successfully updated the Role "{roleName}".\\nRequest Details : \\nRequested By : {lastUpdatedBy}\\nRequested Datetime : {lastUpdatedDatetime}',
                emailSubject: 'Role Updated',
              },
            ],
          },
          {
            featureId: 9,
            featureName: 'Change role status',
            events: [],
          },
          {
            featureId: 10,
            featureName: 'Delete Role',
            events: [
              {
                id: 4883,
                instnId: 1,
                eventId: 'E0399',
                eventName: 'Notify maker for role deleted',
                isSmsEnabled: 'N',
                isEmailEnabled: 'Y',
                isInappEnabled: 'Y',
                smsText: 'Dear {userId},\\nYou have been successfully deleted the Role "{roleName}".',
                inappText: 'You have been successfully deleted the Role "{roleName}".',
                emailGreeting: 'Dear {userId},',
                emailBody: 'You have been successfully deleted the Role "{roleName}".\\nRequest Details : \\nRequested By : {lastUpdatedBy}\\nRequested Datetime : {lastUpdatedDatetime}',
                emailSubject: 'Role Deleted',
              },
            ],
          },
          {
            featureId: 11,
            featureName: 'Add User Group',
            events: [
              {
                id: 4865,
                instnId: 1,
                eventId: 'E0402',
                eventName: 'Notify maker for user group created',
                isSmsEnabled: 'N',
                isEmailEnabled: 'Y',
                isInappEnabled: 'Y',
                smsText: 'Dear {userId},\\nYou have been successfully created the User Group "{userGroup}".',
                inappText: 'You have been successfully created the User Group "{userGroup}".',
                emailGreeting: 'Dear {userId},',
                emailBody: 'You have been successfully created the User Group "{userGroup}".\\nRequest Details : \\nRequested By : {lastUpdatedBy}\\nRequested Datetime : {lastUpdatedDatetime}',
                emailSubject: 'User Group Created',
              },
            ],
          },
          {
            featureId: 12,
            featureName: 'Update User Group',
            events: [
              {
                id: 4826,
                instnId: 1,
                eventId: 'E0405',
                eventName: 'Notify maker for user group updated',
                isSmsEnabled: 'N',
                isEmailEnabled: 'Y',
                isInappEnabled: 'Y',
                smsText: 'Dear {userId},\\nYou have been successfully updated the User Group "{userGroup}".',
                inappText: 'You have been successfully updated the User Group "{userGroup}".',
                emailGreeting: 'Dear {userId},',
                emailBody: 'You have been successfully updated the User Group "{userGroup}".\\nRequest Details : \\nRequested By : {lastUpdatedBy}\\nRequested Datetime : {lastUpdatedDatetime}',
                emailSubject: 'User Group Updated',
              },
            ],
          },
          {
            featureId: 13,
            featureName: 'Delete User Group',
            events: [
              {
                id: 4869,
                instnId: 1,
                eventId: 'E0408',
                eventName: 'Notify maker for user group deleted',
                isSmsEnabled: 'N',
                isEmailEnabled: 'Y',
                isInappEnabled: 'Y',
                smsText: 'Dear {userId},\\nYou have been successfully deleted the User Group "{userGroup}".',
                inappText: 'You have been successfully deleted the User Group "{userGroup}".',
                emailGreeting: 'Dear {userId},',
                emailBody: 'You have been successfully deleted the User Group "{userGroup}".\\nRequest Details : \\nRequested By : {lastUpdatedBy}\\nRequested Datetime : {lastUpdatedDatetime}',
                emailSubject: 'User Group Deleted',
              },
            ],
          },
          {
            featureId: 14,
            featureName: 'Add User in User Group',
            events: [
              {
                id: 4648,
                instnId: 1,
                eventId: 'E0046',
                eventName: 'Notify maker for user added in the user group',
                isSmsEnabled: 'N',
                isEmailEnabled: 'Y',
                isInappEnabled: 'Y',
                smsText: 'Dear {userId},\\nYou have been successfully added the user in the User Group "{userGroup}".',
                inappText: 'You have been successfully added the user in the User Group "{userGroup}".',
                emailGreeting: 'Dear {userId},',
                emailBody:
                  'You have been successfully added the user in the User Group "{userGroup}".\\nRequest Details : \\nRequested By : {lastUpdatedBy}\\nRequested Datetime : {lastUpdatedDatetime}',
                emailSubject: 'User Added In the User Group',
              },
            ],
          },
          {
            featureId: 15,
            featureName: 'Delete User from User group',
            events: [
              {
                id: 4728,
                instnId: 1,
                eventId: 'E0050',
                eventName: 'Notify maker for user removed in the user group',
                isSmsEnabled: 'N',
                isEmailEnabled: 'Y',
                isInappEnabled: 'Y',
                smsText: 'Dear {userId},\\nYou have been successfully removed the user in the "{userGroup}" group.',
                inappText: 'You have been successfully removed the user in the "{userGroup}" group.',
                emailGreeting: 'Dear {userId},',
                emailBody: 'You have been successfully removed the user in the "{userGroup}" group.\\nRequest Details : \\nRequested By : {lastUpdatedBy}\\nRequested Datetime : {lastUpdatedDatetime}',
                emailSubject: 'User Removed In the User Group',
              },
            ],
          },
          {
            featureId: 16,
            featureName: 'Forgot Password',
            events: [],
          },
          {
            featureId: 17,
            featureName: 'Update Profile',
            events: [],
          },
          {
            featureId: 18,
            featureName: 'Remove Profile',
            events: [],
          },
          {
            featureId: 19,
            featureName: 'Update Password',
            events: [],
          },
          {
            featureId: 72,
            featureName: 'Expiring Password',
            events: [
              {
                id: 4786,
                instnId: 1,
                eventId: 'E0415',
                eventName: 'Notify User for expiring password',
                isSmsEnabled: 'N',
                isEmailEnabled: 'Y',
                isInappEnabled: 'Y',
                smsText: 'Dear {userId},\\nYour Password has been expired. Kindly update your password right now.',
                inappText: 'Your Password has been expired. Kindly update your password right now.',
                emailGreeting: 'Dear {userId},',
                emailBody: 'Your Password has been expired. Kindly update your password right now.',
                emailSubject: 'Password Expired',
              },
            ],
          },
        ],
      },
    ];
    const list: NotificationType = response.map((item: responseType) => {
      return {
        parentFeatureId: item.featureId,
        parentFeatureName: item.featureName,
        children: item.children.map((subItem) => {
          return {
            featureId: subItem.featureId,
            featureName: subItem.featureName,
            events:
              subItem?.events.length > 0
                ? subItem.events.map((value) => {
                    return {
                      eventId: value.eventId,
                      eventName: value.eventName,
                      isSmsEnabled: value.isSmsEnabled ?? 'N',
                      isEmailEnabled: value.isEmailEnabled ?? 'N',
                      isInappEnabled: value.isInappEnabled ?? 'N',
                      smsText: value.smsText ?? '',
                      inappText: value.inappText ?? '',
                      emailGreeting: value.emailGreeting ?? '',
                      emailBody: value.emailBody ?? '',
                      emailSubject: value.emailSubject ?? '',
                    };
                  })
                : [],
          };
        }),
      };
    });
    console.log(list);
    const filterEventList = list.map((item) => {
      let filterEvents = [] as any;
      if (item.children.length > 0) {
        filterEvents = item.children.filter((value) => value.events.length > 0);
      }
      return {
        parentFeatureId: item.parentFeatureId,
        parentFeatureName: item.parentFeatureName,
        children: filterEvents,
      };
    });
    const notificationList: any = filterEventList.filter((value) => value.children.length > 0);
    console.log(notificationList);
    const intialValues: initialValueNotifyType = { notificationList };
    setFeatureValues(intialValues);
  };

  useEffect(() => {
    getAllNotificationFeatures();
  }, []);

  const handleChange = (e: any, newValue: string) => {
    console.log(e);
    setTabValue(newValue);
  };

  const handleNotification = async (eventId: number) => {
    console.log(eventId);
    const dynamicData = [
      {
        createdBy: null,
        createdDatetime: null,
        lastUpdatedBy: null,
        lastUpdatedDatetime: null,
        id: 142,
        eventId: 4,
        dynamicData: 'url',
      },
      {
        createdBy: null,
        createdDatetime: null,
        lastUpdatedBy: null,
        lastUpdatedDatetime: null,
        id: 144,
        eventId: 4,
        dynamicData: 'token',
      },
      {
        createdBy: null,
        createdDatetime: null,
        lastUpdatedBy: null,
        lastUpdatedDatetime: null,
        id: 145,
        eventId: 4,
        dynamicData: 'pswdExpiryTime',
      },
      {
        createdBy: null,
        createdDatetime: null,
        lastUpdatedBy: null,
        lastUpdatedDatetime: null,
        id: 143,
        eventId: 4,
        dynamicData: 'userName',
      },
    ];
    setSetting(true);

    const filterNames = dynamicData.map((item: { dynamicData: [] }) => item.dynamicData);
    setDynamicValues(filterNames);
    console.log('filterNames', filterNames);
  };

  const errorList = [];
  const handleChangeText = (e: EventPropType, setFieldValue: (name: string, value: string | number) => void, updateValue: string) => {
    setFieldValue(updateValue, e.target.value);
    if (e.target.value) {
      const mappingValue = Array.of(e.target.value);
      console.log(mappingValue);
      const regex = /\{(.*?)\}/g;
      const filteredText = mappingValue.reduce((accumulator, line) => {
        const matches = line.toString().match(regex);
        console.log(matches);
        if (matches) {
          matches.forEach((match) => {
            const textInsideBraces = match.substring(1, match.length - 1);
            accumulator.push(textInsideBraces);
          });
        }
        return accumulator;
      }, []);
      console.log(dynamicValues);
      const unmatchedValues = filteredText.filter((value) => !dynamicValues.includes(value));

      if (unmatchedValues.length > 0) {
        if (newList?.length > 0 && !newList.some((val) => val.keyName === updateValue)) {
          errorList.push({ keyName: updateValue, value: unmatchedValues[0] });

          setNewList([...newList, errorList[0]]);
        } else if (newList.length === 0 && unmatchedValues) {
          errorList.push({ keyName: updateValue, value: unmatchedValues[0] });
          setNewList([...newList, errorList[0]]);
        }
      } else if (unmatchedValues.length === 0 && newList.some((val) => val.keyName === updateValue)) {
        const updateList = newList.filter((item) => item.keyName !== updateValue);

        setNewList([...updateList]);
      }
    }
  };
  const handleChangeToggle = (e: EventPropType, setFieldValue: (name: string, value: string) => void, updateValue: string) => {
    setFieldValue(updateValue, e.target.checked === true ? 'Y' : 'N');
  };
  const validateField = (newList: { keyName: string }[]) => {
    if (newList.length > 0 && newList.some((val: { keyName: string }) => val.keyName.includes('smsText'))) {
      setError((prev) => ({ ...prev, isSmsText: true }));
    } else {
      setError((prev) => ({ ...prev, isSmsText: false }));
    }
    if (newList.length > 0 && newList.some((val: { keyName: string }) => val.keyName.includes('inappText'))) {
      setError((prev) => ({ ...prev, isInAppText: true }));
    } else {
      setError((prev) => ({ ...prev, isInAppText: false }));
    }
    if (newList.length > 0 && newList.some((val: { keyName: string }) => val.keyName.includes('emailSubject'))) {
      setError((prev) => ({ ...prev, isEmailSubject: true }));
    } else {
      setError((prev) => ({ ...prev, isEmailSubject: false }));
    }
    if (newList.length > 0 && newList.some((val: { keyName: string }) => val.keyName.includes('emailGreeting'))) {
      setError((prev) => ({ ...prev, isEmailGreeting: true }));
    } else {
      setError((prev) => ({ ...prev, isEmailGreeting: false }));
    }
    if (newList.length > 0 && newList.some((val: { keyName: string }) => val.keyName.includes('emailBody'))) {
      setError((prev) => ({ ...prev, isEmailBody: true }));
    } else {
      setError((prev) => ({ ...prev, isEmailBody: false }));
    }
  };
  const handleSubmit = (values: initialValueNotifyType) => {
    validateField(newList);
    if (newList.length === 0) {
      handleSubmitText(values);
    }
  };
  const handleSubmitText = async (values: initialValueNotifyType) => {
    const apiDatas = values?.notificationList?.map((item) => {
      if (item.children.length > 0) {
        return item.children.map((subItem) => subItem.events);
      } else {
        return null;
      }
    });
    const reqDatas = apiDatas.flat();
    const request = reqDatas.flat();
    const datas = request.map((value) => ({
      ...value,
      instnId,
    }));

    setSetting(false);
    getAllNotificationFeatures();
    setError((prev) => ({ ...prev, isSmsText: false, isInAppText: false, isEmailSubject: false, isEmailGreeting: false, isEmailBody: false }));
  };

  const handleDragStart = (e: any, value: any) => {
    e.dataTransfer.setData('text/plain', value);
  };

  const handleDrop = (e: any, values: any, setFieldValue: any, val: any) => {
    console.log('val', val);
    e.preventDefault();
    const draggedValue = e.dataTransfer.getData('text/plain');

    const textFieldSmsText = textFieldRefSmsText.current;
    const cursorPositionSmsText = textFieldSmsText.selectionStart;
    console.log('selectionStart', textFieldSmsText.selectionStart);

    const textFieldInAppText = textFieldRefInAppText.current;
    const cursorPositionInAppText = textFieldInAppText.selectionStart;

    const textFieldEmailSubject = textFieldRefEmailSubject.current;
    const cursorPositiontextFieldEmailSubject = textFieldEmailSubject.selectionStart;
    const textFieldEmailGreeting = textFieldRefEmailGreeting.current;
    const cursorPositiontextFieldEmailGreeting = textFieldEmailGreeting.selectionStart;
    const textFieldEmailBody = textFieldRefEmailBody.current;
    const cursorPositiontextFieldEmailBody = textFieldEmailBody.selectionStart;

    const smsTextFieldName = `notificationList[${parentIndex}].children[${childIndex}].events[${grChildIndex}].smsText`;
    const inAppTextFieldName = `notificationList[${parentIndex}].children[${childIndex}].events[${grChildIndex}].inappText`;
    const emailSubjectFieldName = `notificationList[${parentIndex}].children[${childIndex}].events[${grChildIndex}].emailSubject`;
    const emailGreetingFieldName = `notificationList[${parentIndex}].children[${childIndex}].events[${grChildIndex}].emailGreeting`;
    const emailBodyFieldName = `notificationList[${parentIndex}].children[${childIndex}].events[${grChildIndex}].emailBody`;

    const currentSmsText = values.notificationList[parentIndex]?.children[childIndex]?.events[grChildIndex]?.smsText || '';
    const currentInAppText = values.notificationList[parentIndex]?.children[childIndex]?.events[grChildIndex]?.inappText || '';
    const currentEmailSubject = values.notificationList[parentIndex]?.children[childIndex]?.events[grChildIndex]?.emailSubject || '';
    const currentEmailGreeting = values.notificationList[parentIndex]?.children[childIndex]?.events[grChildIndex]?.emailGreeting || '';
    const currentEmailBody = values.notificationList[parentIndex]?.children[childIndex]?.events[grChildIndex]?.emailBody || '';

    //  const updatedSmsText = currentSmsText.slice(0, cursorPosition)+ '' +'' + draggedValue + '' + currentSmsText.slice(cursorPosition);
    const updatedSmsText = `${currentSmsText.slice(0, cursorPositionSmsText)} ${draggedValue} ${currentSmsText.slice(cursorPositionSmsText)}`;
    const updatedInAppText = `${currentInAppText.slice(0, cursorPositionInAppText)} ${draggedValue} ${currentInAppText.slice(cursorPositionInAppText)}`;
    const updatedEmailSubject = `${currentEmailSubject.slice(0, cursorPositiontextFieldEmailSubject)} ${draggedValue} ${currentEmailSubject.slice(cursorPositiontextFieldEmailSubject)}`;
    const updatedEmailGreeting = `${currentEmailGreeting.slice(0, cursorPositiontextFieldEmailGreeting)} ${draggedValue} ${currentEmailSubject.slice(cursorPositiontextFieldEmailGreeting)}`;
    const updatedEmailBody = `${currentEmailBody.slice(0, cursorPositiontextFieldEmailBody)} ${draggedValue} ${currentEmailBody.slice(cursorPositiontextFieldEmailBody)}`;
    if (val === '1') {
      setFieldValue(smsTextFieldName, updatedSmsText);
    } else if (val === '2') {
      setFieldValue(inAppTextFieldName, updatedInAppText);
    } else if (val === '3') {
      setFieldValue(emailSubjectFieldName, updatedEmailSubject);
    } else if (val === '4') {
      setFieldValue(emailGreetingFieldName, updatedEmailGreeting);
    } else if (val === '5') {
      setFieldValue(emailBodyFieldName, updatedEmailBody);
    }
  };

  const handleDragOver = (e: any) => {
    e.preventDefault();
  };
  return (
    <Box>
      <CustomCard>
        <Header name={PageTitles?.notificationSettings} />
        <Box>
          {featureValues?.notificationList?.length > 0 && (
            <Formik initialValues={featureValues} onSubmit={handleSubmit} enableReinitialize={true}>
              {({ values, setFieldValue, resetForm }) => (
                <Form noValidate>
                  <TabContext value={tabValue}>
                    <TabList orientation="horizontal" key={tabValue} onChange={(e, newValue) => handleChange(e, newValue)}>
                      {values?.notificationList?.map((option: { id?: number; parentFeatureName?: string }) => (
                        <Tab key={option.id} label={option.parentFeatureName} className="normal-case focus:outline-none" sx={{ color: '#2a4947' }} />
                      ))}
                    </TabList>
                    <Box className="flex justify-end mx-16 mt-4">
                      <Box className="flex" sx={{ marginRight: '30px' }}>
                        <Typography sx={{ fontSize: '16px', fontWeight: 'bold' }}>SMS</Typography>
                      </Box>

                      <Box className="flex mx-4" sx={{ marginRight: '25px' }}>
                        <Typography sx={{ fontSize: '16px', fontWeight: 'bold' }}>In App</Typography>
                      </Box>

                      <Box className="flex mx-8" sx={{ marginRight: '20px' }}>
                        <Typography sx={{ fontSize: '16px', fontWeight: 'bold' }}>Email</Typography>
                      </Box>

                      <Box className="flex w-8" sx={{ marginRight: '25px' }}>
                        <Typography sx={{ fontSize: '16px', fontWeight: 'bold' }}>Custom Setting</Typography>
                      </Box>
                    </Box>
                    {values.notificationList[tabValue]?.children.length > 0 &&
                      values.notificationList[tabValue]?.children?.map((item, itemIndex) => (
                        <Box key={itemIndex}>
                          <TabPanel value={tabValue}>
                            {item?.events?.length > 0 && (
                              <>
                                <Box className="flex justify-start">
                                  <Typography className="font-bold" sx={{ fontSize: '16px', fontWeight: 'bold' }}>
                                    {item?.featureName}
                                  </Typography>
                                </Box>
                                <Box>
                                  {item?.events.map((subItem, subItemIndex) => {
                                    const smsEnabled = `notificationList[${tabValue}].children[${itemIndex}].events[${subItemIndex}].isSmsEnabled`;
                                    const inAppEnabled = `notificationList[${tabValue}].children[${itemIndex}].events[${subItemIndex}].isInappEnabled`;
                                    const emailEnabled = `notificationList[${tabValue}].children[${itemIndex}].events[${subItemIndex}].isEmailEnabled`;

                                    return (
                                      <Box className="flex justify-between" key={subItemIndex}>
                                        <Typography className="text-md my-8">{subItem.eventName}</Typography>
                                        <Box className="flex">
                                          <Box className="mx-6" sx={{ marginRight: '15px' }}>
                                            <Field sx={styleSwitch} as={Switch} checked={subItem.isSmsEnabled === 'Y'} disabled name={smsEnabled}></Field>
                                          </Box>

                                          <Box className="mx-4" sx={{ marginRight: '10px' }}>
                                            <Field sx={styleSwitch} as={Switch} checked={subItem.isInappEnabled === 'Y'} disabled name={inAppEnabled}></Field>
                                          </Box>

                                          <Box className="mx-4" sx={{ marginRight: '10px' }}>
                                            <Field sx={styleSwitch} as={Switch} onChange={() => {}} checked={subItem.isEmailEnabled === 'Y'} disabled name={emailEnabled}></Field>
                                          </Box>

                                          <Box
                                            onClick={() => {
                                              handleNotification(subItem.eventId);
                                              setParentIndex(tabValue);
                                              setChildIndex(itemIndex);
                                              setGrChildIndex(subItemIndex);
                                            }}
                                          >
                                            <Box className="flex justify-end cursor-pointer normal-case rounded-full  bg-green-primary text-white" sx={{ marginLeft: '12px', marginTop: '6px', padding:'2px' }}>
                                              <SettingsIcon />
                                            </Box>
                                          </Box>
                                        </Box>
                                      </Box>
                                    );
                                  })}
                                </Box>
                              </>
                            )}
                          </TabPanel>
                        </Box>
                      ))}
                  </TabContext>
                  <MuiDialog
                    open={setting}
                    dialogTitle={'Notification Settings'}
                    onClose={() => {
                      setSetting(false);
                      resetForm();
                      setError({ isSmsText: false, isInAppText: false, isEmailSubject: false, isEmailGreeting: false, isEmailBody: false });
                    }}
                    resetForm={resetForm}
                    width="900px"
                  >
                    <Box className="flex">
                      <Box className=" w-[80%]">
                        <Box className="my-4">
                          <Typography className="font-bold text-md" sx={{ fontSize: '15px', fontWeight: 'bold', marginTop: '20px' }}>
                            SMS
                          </Typography>
                          <Typography className="font-bold text-md">
                            <Grid container spacing={3}>
                              <Grid size={{ xs: 2 }}>
                                <Field
                                  as={Switch}
                                  sx={styleSwitch}
                                  onChange={(e: EventPropType) => handleChangeToggle(e, setFieldValue, `notificationList[${parentIndex}].children[${childIndex}].events[${grChildIndex}].isSmsEnabled`)}
                                  checked={values.notificationList[parentIndex]?.children[childIndex]?.events[grChildIndex]?.isSmsEnabled === 'Y'}
                                  name={`notificationList[${parentIndex}].children[${childIndex}].events[${grChildIndex}].isSmsEnabled`}
                                />
                              </Grid>
                              <Grid size={{ xs: 10 }}>
                                <Field
                                  as={TextField}
                                  inputRef={textFieldRefSmsText}
                                  variant="standard"
                                  autoComplete="off"
                                  fullWidth
                                  label="SMS Text"
                                  sx={{ display: 'flex', alignItems: 'center' }}
                                  onDrop={(e: any) => handleDrop(e, values, setFieldValue, '1')}
                                  onDragOver={handleDragOver}
                                  name={`notificationList[${parentIndex}].children[${childIndex}].events[${grChildIndex}].smsText`}
                                  value={values.notificationList[parentIndex]?.children[childIndex]?.events[grChildIndex]?.smsText}
                                  onChange={(e: EventPropType) => handleChangeText(e, setFieldValue, `notificationList[${parentIndex}].children[${childIndex}].events[${grChildIndex}].smsText`)}
                                />
                                {/* <IconButton
                                    size="small"
                                    sx={{ fontSize: '14px', cursor: 'pointer', marginLeft: '4px' }}
                                    onClick={() => handleRemoveValue(values.notificationList[parentIndex]?.children[childIndex]?.events[grChildIndex]?.smsText.split(' ').length - 1)}
                                  >
                                    <ClearIcon fontSize="small" />
                                  </IconButton> */}
                                {error.isSmsText && (
                                  <Box>
                                    <Typography className="text-red-secondaryColor text-sm ">Enter a valid input</Typography>
                                  </Box>
                                )}
                              </Grid>
                            </Grid>
                          </Typography>
                        </Box>
                        <Box className="my-8">
                          <Typography className="font-bold text-md my-2" sx={{ fontSize: '15px', fontWeight: 'bold', marginTop: '24px' }}>
                            In App
                          </Typography>
                          <Typography className="font-bold text-md">
                            <Grid container spacing={3}>
                              <Grid size={{ xs: 2 }}>
                                <Field
                                  as={Switch}
                                  sx={styleSwitch}
                                  checked={values.notificationList[parentIndex]?.children[childIndex]?.events[grChildIndex]?.isInappEnabled === 'Y'}
                                  onChange={(e: EventPropType) =>
                                    handleChangeToggle(e, setFieldValue, `notificationList[${parentIndex}].children[${childIndex}].events[${grChildIndex}].isInappEnabled`)
                                  }
                                  name={`notificationList[${parentIndex}].children[${childIndex}].events[${grChildIndex}].isInappEnabled`}
                                />
                              </Grid>
                              <Grid size={{ xs: 10 }}>
                                <Field
                                  as={TextField}
                                  variant="standard"
                                  inputRef={textFieldRefInAppText}
                                  fullWidth
                                  label="In App Text"
                                  autoComplete="off"
                                  onDrop={(e: any) => handleDrop(e, values, setFieldValue, '2')}
                                  onDragOver={handleDragOver}
                                  onChange={(e: EventPropType) => handleChangeText(e, setFieldValue, `notificationList[${parentIndex}].children[${childIndex}].events[${grChildIndex}].inappText`)}
                                  name={`notificationList[${parentIndex}].children[${childIndex}].events[${grChildIndex}].inappText`}
                                  //name={inAppText}
                                  value={values.notificationList[parentIndex]?.children[childIndex]?.events[grChildIndex]?.inappText}
                                />
                                {error.isInAppText && (
                                  <Box>
                                    <Typography className="text-red-secondaryColor text-sm ">Enter a valid input</Typography>
                                  </Box>
                                )}
                              </Grid>
                            </Grid>
                          </Typography>
                        </Box>
                        <Box className="my-4">
                          <Typography className="font-bold text-md my-2" sx={{ fontSize: '15px', fontWeight: 'bold', marginTop: '24px' }}>
                            Email
                          </Typography>
                          <Typography className="font-bold text-md">
                            <Grid container spacing={3} justifyContent="center">
                              <Grid size={{ xs: 2 }} sx={{ marginTop: '10px' }}>
                                <Field
                                  sx={styleSwitch}
                                  as={Switch}
                                  onChange={(e: EventPropType) =>
                                    handleChangeToggle(e, setFieldValue, `notificationList[${parentIndex}].children[${childIndex}].events[${grChildIndex}].isEmailEnabled`)
                                  }
                                  checked={values.notificationList[parentIndex]?.children[childIndex]?.events[grChildIndex]?.isEmailEnabled === 'Y'}
                                  name={`notificationList[${parentIndex}].children[${childIndex}].events[${grChildIndex}].isEmailEnabled`}
                                />
                              </Grid>
                              <Grid size={{ xs: 10 }} sx={{ marginTop: '10px' }}>
                                <Field
                                  as={TextField}
                                  variant="standard"
                                  fullWidth
                                  inputRef={textFieldRefEmailSubject}
                                  label="Email Subject"
                                  autoComplete="off"
                                  onDrop={(e: any) => handleDrop(e, values, setFieldValue, '3')}
                                  onDragOver={handleDragOver}
                                  name={`notificationList[${parentIndex}].children[${childIndex}].events[${grChildIndex}].emailSubject`}
                                  value={values.notificationList[parentIndex]?.children[childIndex]?.events[grChildIndex]?.emailSubject}
                                  onChange={(e: EventPropType) => handleChangeText(e, setFieldValue, `notificationList[${parentIndex}].children[${childIndex}].events[${grChildIndex}].emailSubject`)}
                                />
                                {error.isEmailSubject && (
                                  <Box>
                                    <Typography className="text-red-secondaryColor text-sm ">Enter a valid input</Typography>
                                  </Box>
                                )}
                              </Grid>
                            </Grid>
                            <>
                              <Grid container spacing={3} className="my-1">
                                <Grid size={{ xs: 2 }}></Grid>
                                <Grid size={{ xs: 10 }} sx={{ marginTop: '10px' }}>
                                  <Field
                                    as={TextField}
                                    variant="standard"
                                    fullWidth
                                    inputRef={textFieldRefEmailGreeting}
                                    label="Email Greeting"
                                    autoComplete="off"
                                    onDrop={(e: any) => handleDrop(e, values, setFieldValue, '4')}
                                    onDragOver={handleDragOver}
                                    name={`notificationList[${parentIndex}].children[${childIndex}].events[${grChildIndex}].emailGreeting`}
                                    value={values.notificationList[parentIndex]?.children[childIndex]?.events[grChildIndex]?.emailGreeting}
                                    onChange={(e: EventPropType) =>
                                      handleChangeText(e, setFieldValue, `notificationList[${parentIndex}].children[${childIndex}].events[${grChildIndex}].emailGreeting`)
                                    }
                                  />
                                  {error.isEmailGreeting && (
                                    <Box>
                                      <Typography className="text-red-secondaryColor text-sm ">Enter a valid input</Typography>
                                    </Box>
                                  )}
                                </Grid>
                              </Grid>
                              <Grid container spacing={3} className="my-1">
                                <Grid size={{ xs: 2 }}></Grid>
                                <Grid size={{ xs: 10 }} sx={{ marginTop: '10px' }}>
                                  <Field
                                    as={TextField}
                                    inputRef={textFieldRefEmailBody}
                                    variant="standard"
                                    fullWidth
                                    autoComplete="off"
                                    onDrop={(e: any) => handleDrop(e, values, setFieldValue, '5')}
                                    onDragOver={handleDragOver}
                                    label="Email Body"
                                    name={`notificationList[${parentIndex}].children[${childIndex}].events[${grChildIndex}].emailBody`}
                                    value={values.notificationList[parentIndex]?.children[childIndex]?.events[grChildIndex]?.emailBody}
                                    onChange={(e: EventPropType) => handleChangeText(e, setFieldValue, `notificationList[${parentIndex}].children[${childIndex}].events[${grChildIndex}].emailBody`)}
                                  />
                                  {error.isEmailBody && (
                                    <Box>
                                      <Typography className="text-red-secondaryColor text-sm ">Enter a valid input</Typography>
                                    </Box>
                                  )}
                                </Grid>
                              </Grid>
                            </>
                          </Typography>
                        </Box>
                      </Box>
                      <Box className="ml-5   w-[18%]">
                        <Typography className="ml-9" sx={{ fontSize: '14px', fontWeight: 'bold', marginLeft: '15px' }}>
                          Draggable
                        </Typography>
                        <Typography className="ml-5 mb-2" sx={{ fontSize: '14px', fontWeight: 'bold', marginLeft: '10px' }}>
                          Dynamic Values
                        </Typography>

                        <Box
                          className="pt-1"
                          sx={{
                            height: '330px',
                            border: '1px solid grey',
                            borderRadius: '8px',
                            margin: '0.5rem',
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                            backgroundColor: '#fff',
                            overflow: 'hidden',
                            //  paddingTop: '1rem',
                          }}
                          //   style={{ height: '370px' }}
                        >
                          {dynamicValues?.map((item) => (
                            <Typography className="pl-2 break-all text-sm font-sans text-left cursor-pointer" draggable onDragStart={(e: any) => handleDragStart(e, item)}>
                              {item}
                            </Typography>
                          ))}
                        </Box>
                      </Box>
                    </Box>
                  </MuiDialog>
                </Form>
              )}
            </Formik>
          )}
        </Box>
      </CustomCard>
    </Box>
  );
}
