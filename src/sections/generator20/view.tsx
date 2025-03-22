import axios from 'axios';
import { useState } from 'react';

import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { Box, Paper, Table, Button, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';

type TOffer = {
    accountName: string;
    offerId: string;
}

type TSoldOk = {
    date: string;
    externalId: string;
    offerIds: TOffer[];
    soldTotal: number;
    totalSoldLast7Days: number;
}

type TSoldNo = {
    date: string;
    available: number;
    externalId: string;
    offerIds: TOffer[];
    soldLast30Days: number;
}

type TNewTyped = {
    date: string;
    available: number;
    externalId: string;
    offerIds: TOffer[];
    soldLast30Days: number;
}

// ----------------------------------------------------------------------

export default function RaportSprzedazy() {
    const settings = useSettingsContext();
    const [soldOk, setSoldOk] = useState<TSoldOk[]>([]);
    const [soldNo, setSoldNo] = useState<TSoldNo[]>([]);
    const [newTyped, setNewTyped] = useState<TNewTyped[]>([]);


    const typeAfter7Days = async () => {
        console.log('typeAfter7Days clicked');
        setSoldOk([]);
        setSoldNo([]);
        setNewTyped([]);

        try {
            const response = await axios.get(`http://localhost:5005/allegro-typed/type7days`, {
            });

            console.log('response message', response.data);
            setSoldOk(response.data.soldOkFiltered);
            setSoldNo(response.data.soldNoFiltered);
            setNewTyped(response.data.newTypedFiltered);

        } catch (error) {
            console.error("Type After 7 days error:", error);
        }
    }

    const testArray: TNewTyped[] = [
        {
            externalId: "0000040670",
            offerIds: [
                {
                    accountName: "gsm1",
                    offerId: "13092207768"
                }
            ],
            available: 1,
            soldLast30Days: 2,
            date: "2025-02-27T07:29:33.735Z"
        },
        {
            externalId: "0000065524",
            offerIds: [
                {
                    accountName: "gsm1",
                    offerId: "16889182143"
                },
                {
                    accountName: "gsm2",
                    offerId: "16899716749"
                }
            ],
            available: 1,
            soldLast30Days: 4,
            date: "2025-02-27T07:29:33.734Z"
        }
    ];

    console.log('testArray', testArray);

    const correctPricesForTyped = async () => {
        console.log('typeAfter7Days clicked');

        try {
            const response = await axios.post(`http://localhost:5005/allegro-typed/correctPrices`, {
                soldOk,
                newTyped,
                soldNo
            });

            console.log('response message', response.data);


        } catch (error) {
            console.error("Type After 7 days error:", error);
        }
    }

    const backSoldNoToFirstPrice = async () => {
        console.log('backSoldNoToFirstPrice clicked');

        try {
            const response = await axios.post(`http://localhost:5005/allegro-typed/backToFirstPrice`, {
                soldNo
            });

            console.log('response message', response.data);
        } catch (error) {
            console.error("Type After 7 days error:", error);
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
                Typowanie do podniesienia ceny 7 dni.
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
                        onClick={() => typeAfter7Days()}
                        variant="contained"
                        color="success"
                        startIcon={<Iconify icon="mingcute:add-line" />}
                        sx={{ flexGrow: 1, alignSelf: 'flex-start' }}
                    >
                        Typowanie po 7 dniach
                    </Button>
                    <Button
                        disabled
                        onClick={() => correctPricesForTyped()}
                        variant="contained"
                        color="error"
                        startIcon={<Iconify icon="mingcute:add-line" />}
                        sx={{ flexGrow: 1, alignSelf: 'flex-start' }}
                    >
                        Podnieś cenę dla wytypowanych
                    </Button>
                    <Button
                        disabled
                        onClick={() => backSoldNoToFirstPrice()}
                        variant="contained"
                        color="secondary"
                        startIcon={<Iconify icon="mingcute:add-line" />}
                        sx={{ flexGrow: 1, alignSelf: 'flex-start' }}
                    >
                        Wróć do cen pierwotnych
                    </Button>

                </Box>
            </Box>

            <TableContainer component={Paper}>
                <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
                    Sold Ok - Pozostawienie ceny podniesionej o 20%
                </Typography>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Lp.</TableCell>
                            <TableCell>External Id</TableCell>
                            <TableCell>Oferty(Aukcje)</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Sprzedaż z 30 dni</TableCell>
                            <TableCell>Sprzedaż z 7 dni</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {soldOk.map((row, index) => (
                            <TableRow key={index}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>{row.externalId}</TableCell>
                                <TableCell>
                                    {row.offerIds.map((offer: TOffer, nextIndex) => (
                                        <div key={nextIndex}>{offer.offerId}</div>
                                    ))}
                                </TableCell>
                                <TableCell>{row.date}</TableCell>
                                <TableCell>{row.soldTotal}</TableCell>
                                <TableCell>{row.totalSoldLast7Days}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <TableContainer component={Paper} sx={{ mt: 4 }}>
                <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
                    New Typed - Podnieść ceny o 20%
                </Typography>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Lp.</TableCell>
                            <TableCell>External Id</TableCell>
                            <TableCell>Oferty(Aukcje)</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Dostępne</TableCell>
                            <TableCell>Sprzedaż z 30 dni</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {newTyped.map((row, index) => (
                            <TableRow key={index}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>{row.externalId}</TableCell>
                                <TableCell>
                                    {row.offerIds.map((offer: TOffer, nextIndex) => (
                                        <div key={nextIndex}>{offer.offerId}</div>
                                    ))}
                                </TableCell>
                                <TableCell>{row.date}</TableCell>
                                <TableCell>{row.available}</TableCell>
                                <TableCell>{row.soldLast30Days}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <TableContainer component={Paper} sx={{ mt: 4 }}>
                <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
                    Sold No - Obniżenie ceny do pierwotnej
                </Typography>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Lp.</TableCell>
                            <TableCell>External Id</TableCell>
                            <TableCell>Oferty(Aukcje)</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Dostępne</TableCell>
                            <TableCell>Sprzedaż z 30 dni</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {soldNo.map((row, index) => (
                            <TableRow key={index}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>{row.externalId}</TableCell>
                                <TableCell>
                                    {row.offerIds.map((offer: TOffer, nextIndex) => (
                                        <div key={nextIndex}>{offer.offerId}</div>
                                    ))}
                                </TableCell>
                                <TableCell>{row.date}</TableCell>
                                <TableCell>{row.available}</TableCell>
                                <TableCell>{row.soldLast30Days}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
}
