'use client';
import MuiButton from '@/components/mui-components/button/MuiButton';
import MuiTypography from '@/components/mui-components/typography/MuiTypography';
import CustomCard from '@/components/shared-ui/CustomCard';
import { Box, Button, Card, FormLabel, Grid, IconButton, Tab, Typography } from '@mui/material';
import { Form, Formik } from 'formik';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import DownloadIcon from '@mui/icons-material/Download';
import AgGrid from '@/components/shared-ui/AgGrid';
import { initialValuesATMEJournalCBSFile, validationSchemaATMEJournalCBSFile } from './utils';
import { fileUploadATM, getUploadedFile, viewBase64file } from '@/config/apiConfig';
import { ApiResponse, useResponseHandler } from '@/components/store.js/useResponseHandler';
import { DataObjectType } from '@/helper-function/PropTypes';
import { handleDateTime } from '@/helper-function/pageUtils';

const DownloadRenderer = (params: { data: DataObjectType } & { onDownload: (data: DataObjectType) => void }): ReactNode => {
  const { data, onDownload } = params;

  return (
    <Box className="flex justify-center items-center">
      <IconButton onClick={() => onDownload(data)}  disabled={data.jobStatus === 'Processing'}>
        <DownloadIcon sx={{ fontSize: '18px', color: 'var(--color-primary) disabled:!bg-gray-200 disabled:!text-gray-500' }} />
      </IconButton>
    </Box>
  );
};

export default function ATMEJournalSwitchExtractCBSFile(): ReactNode {
  const [file1, setFile1] = useState(undefined);
  const [file2, setFile2] = useState(undefined);
  const [file3, setFile3] = useState(undefined);
  const { handleApiResponse } = useResponseHandler();

  const btnClass = {
    textTransform: 'none',
    color: 'var(--color-accent)',
    width: '110px',
    height: '25px',
    borderRadius: '10px',
    backgroundColor: 'var(--color-secondary)',
    '&:hover': {
      color: 'var(--color-primary)',
      backgroundColor: 'var(--color-accent1)',
    },
  };
  const [rowData, setRowData] = useState([]);
  const downloadCSVFile = (img, reqId) => {
    console.log(img);
    console.log(reqId);
    const linkSource = `data:application/csv;base64,${img}`;
    const downloadLink = document.createElement('a');
    const fileName = `${reqId}`;
    downloadLink.href = linkSource;
    downloadLink.target = '_blank';
    downloadLink.download = fileName;
    downloadLink.click();
  };
  const viewReceipt = async (value) => {
    const payload = {
      fileNameWithPath: `${value.outputFilePath}${value.outputFileName}`,
    };
    console.log(payload);
    const res = await viewBase64file(payload);
    handleApiResponse({
      response: res?.data as ApiResponse,
      onSuccess: () => {
        const img = res?.data?.data?.base64String;
        const reqId = value?.outputFileName;
        downloadCSVFile(img, reqId);
      },
    });
  };
  const handleDownload = (data) => {
    viewReceipt(data);
  };
  const columnDefs = [
    { field: 'id', headerName: 'Job ID' },
    { field: 'ejFileName', headerName: 'ATM E-Journal File' },
    { field: 'switchExtractFileName', headerName: 'Switch Extract File' },
    { field: 'lastUpdatedBy', headerName: 'Uploaded By' },
    {
      field: 'createdDateTime',
      headerName: 'DateTime',
      valueGetter: handleDateTime('createdDateTime'),
    },
    { field: 'jobStatus', headerName: 'Status' },
    { field: 'outputFileName', headerName: 'Output File Name' },
    {
      field: 'action',
      headerName: 'Actions',
      filter: false,
      resizable: false,
      editable: false,
      sortable: false,
      cellRenderer: DownloadRenderer,
      cellStyle: { display: 'flex', justifyContent: 'center', alignItems: 'center' },
      cellRendererParams: {
        onDownload: (params) => handleDownload(params),
      },
    },
  ];
  const handleOnChange = (event, keyName, updateFile, setFieldValue) => {
    const file = event.currentTarget.files[0];
    if (!file) return;
    updateFile(file);
    setFieldValue(keyName, file);
    event.target.value = '';
  };

  const handleSubmitATMFile = async (values, resetForm) => {
    console.log(values);
    console.log(file1);
    console.log(file2);
    console.log(file3);
    const formData = new FormData();
    formData.append(
      'jsonData',
      JSON.stringify({
        jobType: 'EJ_SW',
        fileDefinitions: [
          { fileName: values?.atmEJournalFile.name, definitionName: 'EJF' },
          { fileName: values?.switchExtractFile.name, definitionName: 'EXT' },
        ],
      })
    );
    formData.append('fileList', values?.atmEJournalFile);
    formData.append('fileList', values?.switchExtractFile);
    // formData.append('fileList', values?.cbsFile);

    const res = await fileUploadATM(formData);
    handleApiResponse({
      response: res?.data as ApiResponse,
      onSuccess: () => {
        getUploadedFiles('EJ_SW');
        resetForm();
      },
      showSuccessMessage: true,
    });
  };
  const getUploadedFiles = async (value) => {
    console.log('ATM');
    console.log(value);
    const payload = {
      jobType: 'EJ_SW',
    };
    const res = await getUploadedFile(payload);
    handleApiResponse({
      response: res?.data as ApiResponse,
      onSuccess: () => {
        setRowData(res.data.data);
      },
    });
  };
  useEffect(() => {
    getUploadedFiles('EJ_SW');
  }, []);
  return (
    <Box>
      <Box>
        <Formik initialValues={initialValuesATMEJournalCBSFile} validationSchema={validationSchemaATMEJournalCBSFile} onSubmit={handleSubmitATMFile} validateOnBlur={false}>
          {({ values, setFieldValue, resetForm, errors }) => (
            <Box className="my-4">
              <Box className="mt-8">
                <Form noValidate>
                  <Box className="flex flex-col lg:flex-row md:flex-row gap-2 my-8 px-4 sm:px-8 md:px-8">
                    <Card className="flex flex-col items-start w-full h-[140px] p-8 mr-4 rounded-none overflow-auto ">
                      <Box className="flex-column my-8">
                        <Box sx={{ marginTop: '10px', marginLeft: '10px' }}>
                          <FormLabel sx={{ fontWeight: 'bold', color: '#000', fontSize: '14px', marginTop: '10px', marginLeft: '10px' }}>ATM E - Journal File</FormLabel>
                        </Box>
                        <div className="flex items-center mt-28">
                          <Box sx={{ marginTop: '10px', marginLeft: '20px' }}>
                            <span>Choose file (.jrn)</span>
                          </Box>
                          <div className="mx-12 flex">
                            <Box sx={{ marginTop: '10px', marginLeft: '20px' }}>
                              <Button type="basic" component="label" sx={btnClass}>
                                <Typography className="text-13 font-medium tracking-tight">Browse</Typography>
                                <input
                                  type="file"
                                  name="atmEJournalFile"
                                  required
                                  multiple
                                  hidden
                                  accept=".jrn"
                                  onChange={(event) => {
                                    handleOnChange(event, 'atmEJournalFile', setFile1, setFieldValue);
                                  }}
                                />
                              </Button>
                            </Box>
                            <div>
                              {errors?.atmEJournalFile && (
                                <Box style={{ color: '#EE1D30' }} sx={{ marginLeft: '14px', marginTop: '10px', whiteSpace: 'normal', wordBreak: 'break-word' }}>
                                  {errors?.atmEJournalFile}
                                </Box>
                              )}
                            </div>
                          </div>
                        </div>
                        <Box className="mt-6 flex-row" sx={{ marginTop: '10px', marginLeft: '20px' }}>
                          <span className="text-xs break-words max-w-[300px] inline-block">
                            {values?.atmEJournalFile?.name}
                            {values?.atmEJournalFile && (
                              <CloseIcon
                                onClick={() => {
                                  setFieldValue('atmEJournalFile', undefined);
                                  setFile1(undefined);
                                }}
                                style={{ marginLeft: '8px', fontSize: '16px' }}
                              />
                            )}
                          </span>
                        </Box>
                      </Box>
                    </Card>
                    <Card className="flex flex-col items-start w-full h-[140px] p-8 mx-4 rounded-none overflow-auto ">
                      <Box className="flex-column my-8">
                        <Box className="my-8" sx={{ marginTop: '10px', marginLeft: '10px' }}>
                          <FormLabel sx={{ fontWeight: 'bold', color: '#000', fontSize: '14px' }}>Switch Extract File</FormLabel>
                        </Box>
                        <Box className="flex items-center" sx={{ marginTop: '10px', marginLeft: '10px' }}>
                          <div>
                            <span className="text-xs">Choose file (.txt)</span>
                          </div>
                          <div className="mx-12 flex">
                            <Box sx={{ marginLeft: '20px' }}>
                              <Button type="basic" component="label" sx={btnClass}>
                                <Typography className="text-13 font-medium tracking-tight">Browse</Typography>
                                <input
                                  type="file"
                                  name="switchExtractFile"
                                  required
                                  multiple
                                  hidden
                                  accept=".txt"
                                  onChange={(event) => {
                                    handleOnChange(event, 'switchExtractFile', setFile2, setFieldValue);
                                  }}
                                />
                              </Button>
                            </Box>
                            <div>
                              {errors?.switchExtractFile && (
                                <Box style={{ color: '#EE1D30' }} sx={{ marginLeft: '14px', whiteSpace: 'normal', wordBreak: 'break-word' }}>
                                  {errors?.switchExtractFile}
                                </Box>
                              )}
                            </div>
                          </div>
                        </Box>
                        <Box className="mt-6 flex-row" sx={{ marginTop: '10px', marginLeft: '10px' }}>
                          <span className="text-xs break-words max-w-[300px] inline-block">
                            {values?.switchExtractFile && values?.switchExtractFile?.name}
                            {values?.switchExtractFile && (
                              <CloseIcon
                                onClick={() => {
                                  setFieldValue('switchExtractFile', undefined);
                                  setFile2(undefined);
                                }}
                                style={{ marginLeft: '8px', fontSize: '16px' }}
                              />
                            )}
                          </span>
                        </Box>
                      </Box>
                    </Card>
                    <Card className="flex flex-col items-start w-full h-[140px] p-8 mx-4 rounded-none overflow-auto ">
                      <Box className="flex-column my-8">
                        <Box className="my-8" sx={{ marginTop: '10px', marginLeft: '10px' }}>
                          <FormLabel sx={{ fontWeight: 'bold', color: '#000', fontSize: '14px' }}>CBS File</FormLabel>
                        </Box>
                        <Box className="flex items-center mt-28" sx={{ marginTop: '10px', marginLeft: '10px' }}>
                          <Box>
                            <span className="text-xs">Choose file (.csv)</span>
                          </Box>
                          <div className="mx-12 flex">
                            <Box sx={{ marginLeft: '20px' }}>
                              <Button type="basic" component="label" sx={btnClass}>
                                <Typography className="text-13 font-medium tracking-tight">Browse</Typography>

                                <input
                                  type="file"
                                  name="cbsFile"
                                  required
                                  multiple
                                  hidden
                                  accept=".csv"
                                  onChange={(event) => {
                                    handleOnChange(event, 'cbsFile', setFile3, setFieldValue);
                                  }}
                                />
                              </Button>
                            </Box>
                            <div>
                              {errors?.cbsFile && (
                                <Box style={{ color: '#EE1D30' }} sx={{ marginLeft: '14px', whiteSpace: 'normal', wordBreak: 'break-word' }}>
                                  {errors?.cbsFile}
                                </Box>
                              )}
                            </div>
                          </div>
                        </Box>
                        <Box className="mt-6 flex-row" sx={{ marginTop: '10px', marginLeft: '10px' }}>
                          <span className="text-xs break-words max-w-[300px] inline-block">
                            {values?.cbsFile && values?.cbsFile?.name}
                            {values?.cbsFile && (
                              <CloseIcon
                                onClick={() => {
                                  setFieldValue('cbsFile', undefined);
                                  setFile3(undefined);
                                }}
                                style={{ marginLeft: '8px', fontSize: '16px' }}
                              />
                            )}{' '}
                          </span>
                        </Box>
                      </Box>
                    </Card>
                  </Box>
                  <Box>
                    <Box className="flex justify-end mt-20 px-4">
                      <Box>
                        <Button
                          type="submit"
                          className="!normal-case !font-normal !bg-green-primary !text-white hover:!bg-mist-green hover:!text-green-primary disabled:!bg-gray-200 disabled:!text-gray-500"
                          sx={{ marginTop: '20px' }}
                          onClick={() => handleSubmitATMFile(values, resetForm)}
                          disabled={
                            values?.atmEJournalFile === undefined ||
                            values?.atmEJournalFile === null ||
                            values?.switchExtractFile === undefined ||
                            values?.switchExtractFile === null ||
                            values?.cbsFile === undefined ||
                            values?.cbsFile === null
                          }
                        >
                          Reconcile
                        </Button>
                      </Box>
                    </Box>
                  </Box>
                </Form>
              </Box>
            </Box>
          )}
        </Formik>
      </Box>
      <AgGrid rowData={rowData} columnDefs={columnDefs} />
    </Box>
  );
}
