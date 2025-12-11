'use client';

import { Box, Button, Card, FormLabel, Grid, IconButton, Tab, Typography } from '@mui/material';
import { Form, Formik } from 'formik';
import { useState, type ReactNode } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import DownloadIcon from '@mui/icons-material/Download';
import AgGrid from '@/components/shared-ui/AgGrid';
import { initialValuesemPAYPOSFile, validationSchemaemPAYPOSFile } from './utils';

const handleDownload = (data) => {
  const handleView = () => {};
  return (
    <Box>
      <IconButton onClick={() => handleView(data)}>
        <DownloadIcon />
      </IconButton>
    </Box>
  );
};

export default function emPAYPOSFile(): ReactNode {
  const [file, setFile] = useState(undefined);

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
  const [rowData, setRowData] = useState([
    {
      id: 16,
      emPAYPOSFile: 'test.xlsx',
      switchExtractFileName: 'test.xlsx',
      lastUpdatedBy: 'john.smith@gmail.com',
      jobStatus: 'Completed',
      createdDateTime: 'August 5,2021',
      outputFileName: 'test.xlsx',
    },
  ]);
  const columnDefs = [
    { field: 'id', headerName: 'Job ID' },
    { field: 'emPAYPOSFile', headerName: 'emPAY POS File' },
    { field: 'lastUpdatedBy', headerName: 'Uploaded By' },
    {
      field: 'createdDateTime',
      headerName: 'DateTime',
      type: 'dataTimeFormat',
    },
    { field: 'jobStatus', headerName: 'Status' },
    { field: 'outputFileName', headerName: 'Output File Name' },
    {
      field: 'action',
      headerName: 'Download',
      cellRenderer: ({ data }) => handleDownload(data),
    },
  ];
  const handleOnChange = (event, keyName, updateFile, setFieldValue) => {
    const file = event.currentTarget.files[0];
    if (!file) return;
    updateFile(file);
    setFieldValue(keyName, file);
    event.target.value = '';
  };
  const handleSubmitATMFile = () => {};
  return (
    <Box>
      <Box>
        <Formik initialValues={initialValuesemPAYPOSFile} validationSchema={validationSchemaemPAYPOSFile} onSubmit={handleSubmitATMFile} validateOnBlur={false}>
          {({ values, setFieldValue, resetForm, errors }) => (
            <Box className="my-4">
              <Box className="mt-8">
                <Form noValidate>
                  <Box className="flex flex-col lg:flex-row md:flex-row gap-2 my-8 px-4 sm:px-8 md:px-8">
                    <Card className="flex flex-col items-start w-88 h-[140px] p-8 mr-4 rounded-none overflow-auto ">
                      <Box className="flex-column my-8">
                        <Box sx={{ marginTop: '10px', marginLeft: '10px' }}>
                          <FormLabel sx={{ fontWeight: 'bold', color: '#000', fontSize: '14px', marginTop: '10px', marginLeft: '10px' }}>emPAY POS File</FormLabel>
                        </Box>
                        <div className="flex items-center mt-28">
                          <Box sx={{ marginTop: '10px', marginLeft: '20px' }}>
                            <span>Choose File (.xlsx) </span>
                          </Box>
                          <div className="mx-12 flex">
                            <Box sx={{ marginTop: '10px', marginLeft: '20px' }}>
                              <Button type="basic" component="label" sx={btnClass}>
                                <Typography className="text-13 font-medium tracking-tight">Browse</Typography>
                                <input
                                  type="file"
                                  name="emPAYPOSFile"
                                  required
                                  multiple
                                  hidden
                                  accept=".xlsx"
                                  onChange={(event) => {
                                    console.log(event);
                                    handleOnChange(event, 'emPAYPOSFile', setFile, setFieldValue);
                                  }}
                                />
                              </Button>
                            </Box>
                            <div>
                              {errors?.emPAYPOSFile && (
                                <Box style={{ color: '#EE1D30' }} sx={{ marginLeft: '14px', marginTop: '10px', whiteSpace: 'normal', wordBreak: 'break-word' }}>
                                  {errors?.emPAYPOSFile}
                                </Box>
                              )}
                            </div>
                          </div>
                        </div>
                        <Box className="mt-6 flex-row" sx={{ marginTop: '10px', marginLeft: '20px' }}>
                          <span className="text-xs break-words max-w-[300px] inline-block">
                            {values?.emPAYPOSFile?.name}
                            {values?.emPAYPOSFile && (
                              <CloseIcon
                                onClick={() => {
                                  setFieldValue('emPAYPOSFile', undefined);
                                  setFile(undefined);
                                }}
                                style={{ marginLeft: '8px', fontSize: '16px' }}
                              />
                            )}
                          </span>
                        </Box>
                      </Box>
                    </Card>
                  </Box>
                  <Box>
                    <Box className="flex justify-end mt-20 px-4">
                      <Box>
                        <Button
                          type="basic"
                          className="!normal-case !font-normal !bg-green-primary !text-white hover:!bg-mist-green hover:!text-green-primary disabled:!bg-gray-200 disabled:!text-gray-500"
                          sx={{ marginTop: '20px' }}
                          disabled={values?.emPAYPOSFile === undefined}
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
