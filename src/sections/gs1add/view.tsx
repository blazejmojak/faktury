import axios from 'axios';
import * as Yup from 'yup';
import { useState } from 'react';
import { Form, Field, Formik, ErrorMessage } from 'formik';

import { alpha } from '@mui/material/styles';
import { Box, Alert, Select, Button, MenuItem, Snackbar, Checkbox, Container, TextField, FormGroup, Typography, AlertColor, InputLabel, FormControl, FormControlLabel } from '@mui/material';

import { useSettingsContext } from 'src/components/settings';

import { gpcData } from '../../data/gpc';


type TInitialValues = {
  commonName: string;
  netContent: number;
  gpcCode: string;
  targetMarket: string[];
};

// ----------------------------------------------------------------------

export default function GS1View() {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<AlertColor>('success');
  const [state] = useState<{
    open: boolean;
    vertical: 'top' | 'bottom';
    horizontal: 'left' | 'center' | 'right';
  }>({
    open: false,
    vertical: 'top',
    horizontal: 'right',
  });

  const { vertical, horizontal } = state;


  const settings = useSettingsContext();

  const validationSchema = Yup.object({
    commonName: Yup.string().min(4, 'Minimum 4 znaki').max(150, 'Maksymalnie 150').required('Required'),
    netContent: Yup.number().default(1).required('Required'),
    gpcCode: Yup.string().required('Required'),
    targetMarket: Yup.array().of(Yup.string()).required('Required'),
  });

  const initialValues: TInitialValues = {
    commonName: 'test',
    netContent: 1,
    gpcCode: '10001178',
    targetMarket: ['PL', 'EU'],
  };

  const handleSubmit = (values: TInitialValues, { resetForm, setSubmitting }: { resetForm: () => void, setSubmitting: (isSubmitting: boolean) => void }) => {
    console.log('values:', values);
    axios.post('http://localhost:5005/api/save-product', values, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        setSnackbarMessage(`Produkt dodany do bazy z numerem GTIN: ${response.data.gtin}`);
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
        resetForm();
      })
      .catch((error) => {
        console.log(error);
        setSnackbarMessage(`${error.response.data}`);
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
        setSubmitting(false);
      });
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Typography variant="h4"> Dodaj Nowy GTIN </Typography>

      <Box
        sx={{
          mt: 5,
          width: 1,
          minHeight: 320,
          borderRadius: 2,
          padding: 2,
          bgcolor: (theme) => alpha(theme.palette.grey[500], 0.04),
          border: (theme) => `dashed 1px ${theme.palette.divider}`,
        }}
      >



        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {(formik) => (
            <Form>
              <Box
                className="form-group-gtin"
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  width: {
                    xs: '100%', // full width on small devices
                    md: '50%', // half width on medium and larger devices
                  },
                }}
              >
                <TextField
                  fullWidth
                  id="commonName"
                  name="commonName"
                  label="Nazwa Produktu"
                  value={formik.values.commonName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.commonName && Boolean(formik.errors.commonName)}
                  helperText={formik.touched.commonName && formik.errors.commonName}
                />

                <TextField
                  fullWidth
                  type="number"
                  id="netContent"
                  name="netContent"
                  label="Zawartość netto produktu (szt)"
                  value={formik.values.netContent}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.netContent && Boolean(formik.errors.netContent)}
                  helperText={formik.touched.netContent && formik.errors.netContent}
                />

                <FormControl fullWidth error={formik.touched.gpcCode && Boolean(formik.errors.gpcCode)}>
                  <InputLabel id="gpcCode-label">GPC Code</InputLabel>
                  <Field
                    as={Select}
                    labelId="gpcCode-label"
                    id="gpcCode"
                    name="gpcCode"
                    value={formik.values.gpcCode}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    label="GPC Code"
                  >
                    <MenuItem value="">
                      <em>Select GPC Code</em>
                    </MenuItem>
                    {gpcData.map((item) => (
                      <MenuItem key={item.value} value={item.value}>
                        {item.name}
                      </MenuItem>
                    ))}
                  </Field>
                  <ErrorMessage name="gpcCode" component="div" />
                </FormControl>

                <FormControl component="fieldset" error={formik.touched.targetMarket && Boolean(formik.errors.targetMarket)}>
                  <FormGroup row>
                    <FormControlLabel
                      control={
                        <Field
                          as={Checkbox}
                          type="checkbox"
                          name="targetMarket"
                          value="PL"
                          checked={formik.values.targetMarket.includes('PL')}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        />
                      }
                      label="PL"
                    />
                    <FormControlLabel
                      control={
                        <Field
                          as={Checkbox}
                          type="checkbox"
                          name="targetMarket"
                          value="EU"
                          checked={formik.values.targetMarket.includes('EU')}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        />
                      }
                      label="EU"
                    />
                  </FormGroup>
                  <ErrorMessage name="targetMarket" component="div" />
                </FormControl>

                <div>
                  <Button variant="contained" type="submit" disabled={formik.isSubmitting}>
                    Wyślij
                  </Button>

                </div>
              </Box>
            </Form>
          )}
        </Formik>
      </Box>

      <Snackbar open={snackbarOpen} anchorOrigin={{ vertical, horizontal }}
        autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container >
  );
}
