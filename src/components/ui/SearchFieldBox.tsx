import MuiButton from '@/components/mui-components/button/MuiButton';
import FormikController from '@/components/mui-components/formik-controller/FormikController';
import GridContainer from '@/components/mui-components/grid/GridContainer';
import GridItem from '@/components/mui-components/grid/GridItem';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';

interface SearchField {
  control: string;
  label: string;
  name: string;
  required?: boolean;
}

interface SearchFieldBoxProps {
  SearchFormFields: SearchField[];
  handleSubmit: (values: Record<string, unknown>) => void;
  gridSize?: number;
  withReset?: boolean;
}

const SearchFieldBox: React.FC<SearchFieldBoxProps> = ({ SearchFormFields, handleSubmit, gridSize = 3 }) => {
  type Field = { name: string; label: string; required?: boolean };

  const buildValidationSchema = (SearchFormFields: Field[]) => {
    const requiredFields = SearchFormFields.filter((f) => f.required).map((f) => f.name);
    const requiredFieldsLabel = SearchFormFields.filter((f) => f.required).map((f) => f.label);

    const schemaShape: Record<string, any> = {};
    requiredFields.forEach((fieldName) => {
      const otherFields = requiredFields.filter((f) => f !== fieldName);

      schemaShape[fieldName] = Yup.string().when(otherFields, {
        is: (...others: any[]) => others.every((val: string) => !val || val?.trim() === ''),
        then: () => Yup.string().required(`At least one of [${requiredFieldsLabel.join(', ')}] is mandatory`),
        otherwise: () => Yup.string().nullable(),
      });
    });

    const deps = requiredFields.flatMap((f) => requiredFields.filter((other) => other !== f).map((other) => [f, other] as [string, string]));

    return Yup.object().shape(schemaShape, deps);
  };

  const validationSchema = buildValidationSchema(SearchFormFields);
  const initialValues = Object.fromEntries(SearchFormFields.map((f) => [f.name, '']));

  return (
    <Formik initialValues={initialValues} enableReinitialize validationSchema={validationSchema} onSubmit={handleSubmit}>
      {() => (
        <Form noValidate>
          <GridContainer ml={1}>
            {SearchFormFields.map((item, index) => (
              <GridItem key={item.name || index} lg={gridSize} sm={6} xs={12}>
                <FormikController control={item.control} label={item.label} name={item.name} required={item.required} />
              </GridItem>
            ))}

            <GridItem lg={gridSize} sm={6} xs={12} mt={2}>
              <MuiButton isNoDirty type="submit">
                Search
              </MuiButton>
            </GridItem>
          </GridContainer>
        </Form>
      )}
    </Formik>
  );
};

export default SearchFieldBox;
