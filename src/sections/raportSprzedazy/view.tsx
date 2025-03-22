import axios from 'axios';
import { useState } from 'react';

import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, CircularProgress, TableHead, TableRow, TextField } from '@mui/material';

import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';

// ----------------------------------------------------------------------

export default function RaportSprzedazy() {
    const settings = useSettingsContext();
    const [sales, setSales] = useState<any>([]);
    const [priceIncreases, setPriceIncreases] = useState([]);
    const [salesLoading, setSalesLoading] = useState<boolean>(false);
    const [days, setDays] = useState<number>(1);

    const getSalesFromAllAccounts = async () => {
        console.log('getSalesFromAllAccounts');
        setSales([]);
        setSalesLoading(true);
        try {
            const response = await axios.get(`http://localhost:5005/allegro/sales-all?days=${days}`, {
            });
            console.log(response.data.salesFromAllAccounts);
            setSales(response.data.salesFromAllAccounts);
        } catch (error) {
            console.error('Error fetching sales data:', error);
        }
        setSalesLoading(false);
    }


    const getIncreasePriceFromLastWeek = async () => {
        console.log('getSalesFromAllAccounts');
        setSales([]);
        setSalesLoading(true);
        try {
            const response = await axios.get(`http://localhost:5005/allegro/getIncreaseFromLastWeek`, {
            });
            console.log(response.data);
            setPriceIncreases(response.data);
        } catch (error) {
            console.error('Error fetching sales data:', error);
        }
        setSalesLoading(false);
    }



    return (
        <Container
            maxWidth={settings.themeStretch ? false : 'lg'}
            sx={{
                flexGrow: 1,
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <Typography variant="h4">
                Raport Sprzedaży z Allegro
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
                        justifyContent: '',
                        alignItems: 'center',
                        gap: 4,
                        mt: {
                            xs: 4,
                            md: 4,
                        },
                    }}
                >
                    <TextField
                        onChange={(e) => setDays(Number(e.target.value))}
                        label="Wpisz ilość dni"
                        variant="outlined"
                        name="days"
                        helperText="Ilość dni do analizy (Max 7)"
                        sx={{ flexGrow: 1 }}
                    />
                    <Button
                        onClick={() => getSalesFromAllAccounts()}
                        variant="contained"
                        color="success"
                        startIcon={<Iconify icon="mingcute:add-line" />}
                        sx={{ flexGrow: 1, alignSelf: 'flex-start' }}
                    >
                        Cała sprzedaż Grupowana po SKU
                    </Button>
                    <Button
                        onClick={() => getIncreasePriceFromLastWeek()}
                        variant="contained"
                        color="info"
                        startIcon={<Iconify icon="mingcute:add-line" />}
                        sx={{ flexGrow: 1, alignSelf: 'flex-start' }}
                    >
                        Ostatni Wzrost Cen po SKU
                    </Button>
                </Box>
            </Box>

            {salesLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    <CircularProgress />
                </Box>
            ) : (

                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Lp.</TableCell>
                                <TableCell align="right">External Id</TableCell>
                                <TableCell align="right">Total Sold</TableCell>
                                <TableCell align="right">Offers Id</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {sales.length > 0 && sales.map((row: any, index: number) => (
                                <TableRow
                                    key={row.externalId}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row">
                                        {index + 1}
                                    </TableCell>


                                    <TableCell align="right">{row.externalId}</TableCell>
                                    <TableCell align="right">{row.totalSold}</TableCell>
                                    <TableCell align="right">
                                        {row.offerIds.map((offer: any, idx: number) => (
                                            <p key={idx}>Account: {offer.account}, Offer ID: {offer.offerId}</p>
                                        ))}
                                    </TableCell>

                                </TableRow>
                            ))}




                            {priceIncreases.length > 0 && priceIncreases.map((row: any, index: number) => (
                                <TableRow
                                    key={row.externalId}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row">
                                        {index + 1}
                                    </TableCell>


                                    <TableCell align="right">{row.externalId}</TableCell>
                                    <TableCell align="right">{row.soldTotal}</TableCell>
                                    <TableCell align="right">
                                        {row.offerIds.map((offer: any, idx: number) => (
                                            <p key={idx}>Account: {offer.account}, Offer ID: {offer.offerId}</p>
                                        ))}
                                    </TableCell>

                                </TableRow>
                            ))}






                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Container>
    );
}
