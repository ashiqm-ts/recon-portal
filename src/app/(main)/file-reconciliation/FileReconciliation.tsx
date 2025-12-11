'use client';
import { Box, Grid, IconButton, Tab } from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { type ReactNode, useEffect, useState } from 'react';
import MuiDialog from '@/components/shared-ui/MuiDialog';
import { Formik } from 'formik';
import FormikController from '@/components/mui-components/formik-controller/FormikController';
import MuiButton from '@/components/mui-components/button/MuiButton';
import CustomCard from '@/components/shared-ui/CustomCard';
import AgGrid from '@/components/shared-ui/AgGrid';
import type { DataObjectType } from '@/helper-function/PropTypes';
import { buttonName } from '@/helper-function/pageUtils';
import InfoDialog from '@/components/shared-ui/InfoDialog';
import PageTitles from '@/helper-function/pageTitles';
import Header from '@/components/ui/Header';
import ATMEJournalSwitchExtractCBSFile from './ATME-JournalSwitchExtractCBSFile';
import RTGSFile from './RTGSFile';
import EmPAYPOSFile from './emPAYPOSFile';
import { getUploadedFile } from '@/config/apiConfig';
import { useAuth } from '@/provider/AuthProvider';
import { ApiResponse, useResponseHandler } from '@/components/store.js/useResponseHandler';

export default function FileReconciliation(): ReactNode {
  const [tabValue, setTabValue] = useState('1');
  const { handleApiResponse } = useResponseHandler();

  
  return (
    <Box>
      <CustomCard>
        <Header name={PageTitles?.fileReconciliation} />
        <Box>
          <TabContext value={tabValue}>
            <TabList
              onChange={(_, newValue: string) => {
                setTabValue(newValue);
              }}
            >
              <Tab label="ATM Transaction, Switch-Extract & CBS File" value="1" sx={{ color: '#2a4947' }} />
              <Tab label="RTGS" value="2" sx={{ color: '#2a4947' }} />
              <Tab label="emPAY POS" value="3" sx={{ color: '#2a4947' }} />
            </TabList>
            <TabPanel value="1" index={0}>
              <ATMEJournalSwitchExtractCBSFile />
            </TabPanel>
            <TabPanel value="2" index={1}>
              <RTGSFile />
            </TabPanel>
            <TabPanel value="3" index={2}>
              <EmPAYPOSFile />
            </TabPanel>
          </TabContext>
        </Box>
      </CustomCard>
    </Box>
  );
}
