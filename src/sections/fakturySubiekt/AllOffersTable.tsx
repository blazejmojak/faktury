import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material"

import { TAllOffersBySku } from "src/types/subiektAllegro"


export default function AllOffersTable({ allOffersBySku }: { allOffersBySku: TAllOffersBySku[] }) {
    console.log('table offers: ', allOffersBySku.length)
    return (
        <TableContainer component={Paper}>
            <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
                Wszystkie SKU
            </Typography>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Lp.</TableCell>
                        <TableCell>SKU</TableCell>
                        <TableCell>Dane</TableCell>
                        <TableCell>Flaga</TableCell>
                        <TableCell>Komentarz</TableCell>


                    </TableRow>
                </TableHead>
                <TableBody>
                    {allOffersBySku.map((row, index) => (
                        <TableRow key={index}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{row.sku}</TableCell>
                            <TableCell>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Konto</TableCell>
                                        <TableCell>ID Oferty</TableCell>
                                        <TableCell>Cena</TableCell>
                                        <TableCell>Status</TableCell>
                                    </TableRow>
                                </TableHead>
                                {row.offers.length < 1 && <Typography variant="body2" sx={{ fontWeight: 'bold' }} color="error">Brak ofert dla tego SKU</Typography>}
                                {row.offers.map((offer, nIndex) => (
                                        <TableBody>
                                            <TableRow>
                                                <TableCell>{offer.account}</TableCell>
                                                <TableCell>{offer.offerId}</TableCell>
                                                <TableCell> {Number(offer.price).toFixed(2)}</TableCell>
                                                <TableCell>{offer.status}</TableCell>
                                            </TableRow>
                                        </TableBody>
                                ))}
                            </TableCell>
                            <TableCell>{ row.nazwaFlagi }</TableCell>
                            <TableCell>{ row.komentarzFlagi }</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )

}