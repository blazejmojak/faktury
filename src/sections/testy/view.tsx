import axios from 'axios';
import { useState, useEffect } from 'react';

import { Box, Button, CircularProgress, Container, TextField, Typography } from '@mui/material';

import { useSettingsContext } from 'src/components/settings';

import { TAllOffersBySkuAndAllegro } from 'src/types/subiektAllegro';

import { readXMLFile } from './readXMLFile';
import AllEanSkuOffersTable from './AllEanSkuOffersTable';

// ----------------------------------------------------------------------

export default function TestView() {
  const settings = useSettingsContext();
  const [file, setFile] = useState<File | null>(null);
  const [company, setCompany] = useState<string>('aptel');
  const [lastAllegroOffersUpdate, setLastAllegroOffersUpdate] = useState<{ gsm1: Date | null; gsm2: Date | null; pavelLux: Date | null }>({
    gsm1: null,
    gsm2: null,
    pavelLux: null,
  });

  const [allegroLoading, setAllegroLoading] = useState<boolean>(false);
  const [allegroResponse, setAllegroResponse] = useState<{ message: string, date: Date }>({ message: '', date: new Date() });

  const [allInvoiceItems, setAllInvoiceItems] = useState<any[]>([]);
  const [invoiceNumber, setInvoiceNumber] = useState<string>('');
  const [sellDate, setSellDate] = useState<string>('');
  const [invoiceDate, setInvoiceDate] = useState<string>('');

  const [invoiceError, setInvoiceError] = useState<string>('');

  const [allSkuByEan, setAllSkuByEan] = useState<TAllOffersBySkuAndAllegro[]>([]);
  const [allSkuLoading, setAllSkuLoading] = useState<boolean>(false);
  const [timerMessage, setTimerMessage] = useState<string>('');

  useEffect(() => {
    const response = axios.get('http://localhost:5005/allegro/get-last-update');
    response.then((res) => {
      setLastAllegroOffersUpdate({ gsm1: new Date(res.data.gsm1), gsm2: new Date(res.data.gsm2), pavelLux: new Date(res.data.pavelLux) });
    }
    );
  }, [allegroResponse])

  const getAllAllegroOffers = async () => {
    console.log('getAllAllegroOffers');
    setAllegroLoading(true);
    const response = await axios.get(`http://localhost:5005/allegro/get-all-offers`);
    console.log(response.data);
    setAllegroResponse({ message: response.data.message, date: new Date(response.data.date) });
    setAllegroLoading(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(null);
    setAllSkuByEan([]);
    setInvoiceError('');
    if (e.target.files) {
      setFile(e.target.files[0]);
      // sprawdź, który to rodzaj XML i zczytaj dane (nip firmy oraz pozycje towarów)
      readXMLFile(e.target.files[0], company)
        .then((data) => {
          if (data.allItems.length === 0) {
            setInvoiceError('Brak pozycji na fakturze lub Błędna firma');
            return;
          }
            setAllInvoiceItems(data.allItems.map(item => ({
              // if price is with comma "3,33" change that to dot "3.33"
            ...item,
            price: typeof item.price === 'string' ? item.price.replace(',', '.') : item.price
            })));
          setInvoiceNumber(data.invoiceNumber);
          setSellDate(`${data.sellDate.replace(/-/g, '')}000000`);
          setInvoiceDate(`${data.invoiceDate.replace(/-/g, '')}000000`);
        })
        .catch((error) => {
            setInvoiceError(error instanceof Error ? error.message : String(error));
        });

    }
  };

  const handleUpload = async () => {
      if (invoiceError) {
        return;
      }
  
      console.log('invoice number: ', invoiceNumber);
      console.log('sell date: ', sellDate);
      console.log('invoice date: ', invoiceDate);
      console.log('all invoice items: ', allInvoiceItems)
      setTimerMessage('Rozpoczęto pobieranie danych z Subiekta');
      let timer = allInvoiceItems.length;

    const interval = setInterval(() => {
      setTimerMessage (`Szacowane: ${timer} sekund do zakończenia`);
      timer -= 1;

      if (timer <= 0) {
        clearInterval(interval);
        console.log('Timer finished');
      }
    }, 1000);

    setAllSkuByEan([]);
    setAllSkuLoading(true);
    try {
      const allOffersBySupplierSku: TAllOffersBySkuAndAllegro[] = await Promise.all(
        allInvoiceItems.map(async skuItem => {
          if (skuItem.ean === 'brak') {
            return {
              checked: false,
              supplierEan: skuItem.ean,
              orderedQuantity: skuItem.quantity,
              supplierPrice: skuItem.price,
              allOffersBySKU: []
            };
          }
          const response = await axios.get(`http://localhost:5005/subiekt/towar?ean=${skuItem.ean}`);
          const skuData = response.data;
          return {
            checked: skuData.length > 0,
            supplierEan: skuItem.ean,
            orderedQuantity: skuItem.quantity,
            supplierPrice: skuItem.price,
            allOffersBySKU: skuData
          };
        })
      );

      console.log('aaa: ', allOffersBySupplierSku);

      setAllSkuByEan(allOffersBySupplierSku);
      clearInterval(interval);
      setAllSkuLoading(false);

    } catch (error) {
      console.error('Error during upload:', error);
    }


  };

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Typography variant="h4"> Faktury Subiekt GT </Typography>

      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        mb: 4
      }}>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'start',
            alignItems: 'center',
            gap: 4,
            mt: {
              xs: 4,
              md: 4,
            },
          }}
        >
          <Button
            variant='contained'
            color='primary'
            component='label'
            onClick={() => getAllAllegroOffers()}
          >
            Pobierz wszystkie oferty allegro
          </Button>
        </Box>

        <Box>
          Ostatnie pobranie ofert z Allegro:
          <li>GSM1: {lastAllegroOffersUpdate.gsm1 ? lastAllegroOffersUpdate.gsm1.toLocaleString() : 'Brak danych'}</li>
          <li>GSM2: {lastAllegroOffersUpdate.gsm2 ? lastAllegroOffersUpdate.gsm2.toLocaleString() : 'Brak danych'}</li>
          <li>Pavel Lux: {lastAllegroOffersUpdate.pavelLux ? lastAllegroOffersUpdate.pavelLux.toLocaleString() : 'Brak danych'}</li>
        </Box>


        {/* Pobierz wszystkie SKU z Subiekt według EAN Producenta */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'left',
            gap: 4,
            mt: {
              xs: 4,
              md: 4,
            },
          }}
        >

          <Typography variant="h4">
            Konwerter Faktur dla Subiekt GT
          </Typography>
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            mb: 4
          }}>

            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'start',
                alignItems: 'center',
                gap: 4,
                mt: {
                  xs: 4,
                  md: 4,
                },
              }}
            >
              <TextField
                sx={{ width: '200px' }}
                select
                label="Wybierz opcję"
                variant="outlined"
                SelectProps={{
                  native: true,
                }}
                onChange={(e) => {
                  setFile(null);
                  setAllSkuByEan([]);
                  setInvoiceError('');
                  setCompany(e.target.value)
                }}
              >
                <option value="aptel">Aptel</option>
                <option value="atrax">Atrax</option>
                <option value="ddMedia">DD Media</option>
                <option value="dro">Dro</option>
                <option value="flavour">Flavour</option>
                <option value="mcm">MCM</option>
                <option value="partner">Partner Telekom</option>
                <option value="roter">Roter</option>
                <option value="telcon">Telcon</option>
                <option value="tf1">TF1</option>
                <option value="toptel">Toptel</option>
                <option value="verna">Verna</option>
              </TextField>
              <Button
                variant='contained'
                color='primary'
                component='label'
              >
                Wybierz Plik XML
                <input
                  type="file"
                  accept=".xml"
                  hidden
                  onChange={handleFileChange}
                />
              </Button>
              {file && <Typography>{file.name}</Typography>}
              <Button
                variant='contained'
                color='secondary'
                onClick={handleUpload}
              >
                Weryfikuj
              </Button>
            </Box>

          </Box>

          {invoiceError && <Typography variant="h6" color="error">{invoiceError}</Typography>}

        </Box>

        {allegroLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <CircularProgress />
          </Box>)}

        {allegroResponse.message && (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <Typography>{allegroResponse.message}</Typography>
            <Typography>{new Date(allegroResponse.date).toLocaleString()}</Typography>
          </Box>
        )}

        {allSkuLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', gap: 2 }}>
            <Typography>{timerMessage}</Typography>
            <CircularProgress />
          </Box>)}

        {allSkuByEan.length > 0 && <AllEanSkuOffersTable allOffersBySkuAndAllegro={allSkuByEan} invoiceNumber={invoiceNumber} sellDate={sellDate} invoiceDate={invoiceDate} company={company} />}

      </Box>

    </Container >
  );
}
