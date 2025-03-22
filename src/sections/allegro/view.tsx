import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Table from '@mui/material/Table';
import Paper from '@mui/material/Paper';
import { Box, Button } from '@mui/material';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import CircularProgress from '@mui/material/CircularProgress';

import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';

import { TOfferType } from 'src/types/offers';

export default function SubiektGtInvoices() {
    const settings = useSettingsContext();
    const navigate = useNavigate();
    const [selectedOffers, setSelectedOffers] = useState<TOfferType[]>([]);
    const [offersLoading, setOffersLoading] = useState<boolean>(false);

    const status = 'ACTIVE';
    const minSold = 2;
    const maxSold = 2000;
    const available = 20;


    const totalBefore: number = selectedOffers.reduce((acc, offer) => acc + parseFloat(offer.sellingMode.price.amount) * offer.stock.available, 0);

    const totalAfter: number = totalBefore * 1.2;

    const totalProfit: number = totalAfter - totalBefore;

    console.log('selectedOffers', selectedOffers);


    const getOffersFromAllAccounts = async () => {
        setSelectedOffers([]);
        setOffersLoading(true);
        const response = await axios.get(`http://localhost:5005/allegro/offers-all?status=${status}&minSold=${minSold}&maxSold=${maxSold}&available=${available}`);
        console.log(response.data.offers);
        setSelectedOffers(response.data.offers);
        setOffersLoading(false);
    }



    const increasePriceForAllAccounts = async () => {
        const auctionsToChangePrice = selectedOffers.map((offer) => {
            const firstPrice = parseFloat(offer.sellingMode.price.amount);
            const newPrice = (firstPrice * 1.2).toFixed(2);
            // const newPrice = (firstPrice + 0.20).toFixed(2);


            return {
                externalId: offer.external.id,
                firstPrice: firstPrice.toFixed(2),
                newPrice,
                available: offer.stock.available,
                sold: offer.stock.sold,
                date: new Date().toISOString()
            };
        });

        console.log('auctionsToChangePrice', auctionsToChangePrice);

        const testAuctionsToChangePrice = [
            {
                "externalId": "0000044189",
                "firstPrice": "11.99",
                "newPrice": "14.39",
                "available": 3,
                "sold": 7,
                "date": "2025-02-19T09:51:42.336Z"
            },
            {
                "externalId": "0000028560",
                "firstPrice": "16.49",
                "newPrice": "19.79",
                "available": 2,
                "sold": 7,
                "date": "2025-02-19T09:51:42.336Z"
            }
        ]

        console.log('testAuctionsToChangePrice', testAuctionsToChangePrice);

        const response = await axios.post('http://localhost:5005/allegro/change-price-all-accounts', {
            auctionsToChangePrice
        });

        if (response.status === 200) {
            console.log('response', response.data);
            navigate('/');
        }
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
                Allegro Zwiększenie ceny
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

                    <Button
                        onClick={() => getOffersFromAllAccounts()}
                        variant="contained"
                        color="success"
                        startIcon={<Iconify icon="mingcute:add-line" />}
                    >
                        Wytypuj Proukty ze wszystkich kont
                    </Button>
                    <Button
                        disabled
                        onClick={() => increasePriceForAllAccounts()}
                        variant="contained"
                        color="warning"
                        startIcon={<Iconify icon="mingcute:add-line" />}
                    >
                        Zwiększ cenę + 20% na wszystkich kontach
                    </Button>

                </Box>
            </Box>

            <Box sx={{
                display: 'flex',
                justifyContent: 'flex-start',
                alignItems: 'center',
                gap: 5,
                mb: {
                    xs: 3,
                    md: 5,
                },
            }}>
                <div>
                    Wartość przed zwiększeniem: {totalBefore.toFixed(2)}
                </div>
                <div>
                    Wartość po zwiększeniu: {totalAfter.toFixed(2)}
                </div>
                <div>
                    Optymistyczny zysk: {totalProfit.toFixed(2)}
                </div>

            </Box>

            {offersLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    <CircularProgress />
                </Box>
            ) : (

                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Lp.</TableCell>
                                <TableCell>Nazwa</TableCell>
                                <TableCell align="right">Id</TableCell>
                                <TableCell align="right">SKU</TableCell>
                                <TableCell align="right">Cena (PLN)</TableCell>
                                <TableCell align="right">Dostępne:</TableCell>
                                <TableCell align="right">Sprzedane:</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {selectedOffers.length > 0 && selectedOffers.map((row, index) => (
                                <TableRow
                                    key={row.id}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row">
                                        {index + 1}
                                    </TableCell>

                                    <TableCell component="th" scope="row">
                                        {row.name}
                                    </TableCell>
                                    <TableCell align="right">{row.id}</TableCell>
                                    <TableCell align="right">{row.external.id}</TableCell>
                                    <TableCell align="right">{parseFloat(row.sellingMode.price.amount).toFixed(2)}</TableCell>
                                    <TableCell align="right">{row.stock.available}</TableCell>
                                    <TableCell align="right">{row.stock.sold}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Container>
    );
}