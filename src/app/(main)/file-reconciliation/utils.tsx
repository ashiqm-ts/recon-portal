import * as Yup from 'yup';
export const initialValuesATMEJournalCBSFile = { atmEJournalFile: undefined, switchExtractFile: undefined, cbsFile: undefined };
export const initialValuesRTGSFile = { rtgsFile: undefined };
export const initialValuesemPAYPOSFile = { emPAYPOSFile: undefined };
export const validationSchemaATMEJournalCBSFile = Yup.object().shape({
  atmEJournalFile: Yup.mixed()
    .required('Required')
    .test('fileSize', 'File size should be 50 MB or less', (value) => {
      console.log('fileSize,', value.size);
      return value && value.size <= 50000000;
    }),
  switchExtractFile: Yup.mixed()
    .required('Required')
    .test('fileSize', 'File size should be 50 MB or less', (value) => {
      console.log('fileSize,', value.size);
      return value && value.size <= 50000000;
    }),
  cbsFile: Yup.mixed()
    .required('Required')
    .test('fileSize', 'File size should be 50 MB or less', (value) => {
      console.log('fileSize,', value.size);
      return value && value.size <= 50000000;
    }),
});
export const validationSchemaRTGSFile = Yup.object().shape({
  rtgsFile: Yup.mixed()
    .required('Required')
    .test('fileSize', 'File size should be 50 MB or less', (value) => {
      console.log('fileSize,', value.size);
      return value && value.size <= 50000000;
    }),
});
export const validationSchemaemPAYPOSFile = Yup.object().shape({
  emPAYPOSFile: Yup.mixed()
    .required('Required')
    .test('fileSize', 'File size should be 50 MB or less', (value) => {
      console.log('fileSize,', value.size);
      return value && value.size <= 50000000;
    }),
});
