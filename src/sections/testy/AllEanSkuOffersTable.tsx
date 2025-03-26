import React, { useState } from "react";

import { Box, Grid, Container, TextField, Button, Checkbox } from "@mui/material";

import { TAllOffersBySkuAndAllegro, TEppFile } from "src/types/subiektAllegro";

import companies from "./data/companies";
import formatDate from "./helpers/formatDate";
import { generateEppFile } from "./helpers/generateEppFile";


type TType = {
    allOffersBySkuAndAllegro: TAllOffersBySkuAndAllegro[];
    invoiceNumber: string;
    sellDate: string;
    invoiceDate: string;
    company: string;
};

const checkPrice = (lastPrice: number, supplierPrice: string) => {
    const formattedSupplierPrice = parseFloat(supplierPrice.replace(',', '.'));

    let color = 'black';
    let fontWeight = 'normal';

    if (lastPrice / formattedSupplierPrice < 0.9) {
        color = 'red';
        fontWeight = 'bold';
    } else if (lastPrice / formattedSupplierPrice > 1.1) {
        color = 'green';
        fontWeight = 'bold';
    }


    return <span style={{ color, fontWeight }}> {lastPrice} </span>;
}

const extractNumber = (str: string) => {
    // Use a regular expression to find a number between ##
    const match = str.match(/##(\d+)##/);
    // If a match is found, return the number converted to an integer
    return match ? parseInt(match[1], 10) : 0;
}

const checkNumberInFlag = (flag: string) => {
    const number = extractNumber(flag);
    if (number > 0) {
        return number;
    }
    return null;
}

const setQuantityToEverySku = (allOffersBySkuAndAllegro: TAllOffersBySkuAndAllegro[]) => {
    // jeżeli allOffersBySkuAndAllegro.allOffersBySKU.length === 1 to dla każdego SKU ustaw orderedQuantity
    allOffersBySkuAndAllegro.forEach((ean) => {
        if (ean.allOffersBySKU.length === 1) {
            ean.allOffersBySKU[0].skuQuantity = parseFloat(ean.orderedQuantity);
        } else if (ean.allOffersBySKU.length > 1) {
            ean.allOffersBySKU.forEach((sku) => {
                sku.skuQuantity = sku.komentarzFlagi ? extractNumber(sku.komentarzFlagi) : 0;
            });
        }

        ean.allOffersBySKU.forEach((offer) => {
            if (offer.offers.length < 1) {
                offer.checked = true;
            }
        });
    }); 
    return allOffersBySkuAndAllegro;
}

const changeNumberPrice = (price: string) =>
    parseFloat(
        price.toString().replace(',', '.')
    ).toFixed(2);

export default function AllEanSkuOffersTable({ allOffersBySkuAndAllegro, invoiceNumber, sellDate, invoiceDate, company }: TType) {
    const [offersBySkuAndAllegro, setOffersBySkuAndAllegro] = useState<TAllOffersBySkuAndAllegro[]>(setQuantityToEverySku(allOffersBySkuAndAllegro));

    const updateAllegroEnded = () => {
        const endedSkuList = offersBySkuAndAllegro
            .flatMap(ean =>
                ean.allOffersBySKU.flatMap(sku =>
                    sku.offers
                        .filter(of => of.status === "ENDED")
                        .map(() => sku.sku)
                )
            )
            .filter((value, index, self) => self.indexOf(value) === index) // Remove duplicates
            .join(";");
        console.log(endedSkuList);

        const blob = new Blob([endedSkuList], { type: "text/plain;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
       
        const formattedDateToFileName = formatDate()
       
        link.download = `zakonczone-${company}-${invoiceNumber}-${formattedDateToFileName}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

    }

    const insertAllegroOffers = () => {
        const checkedSkuList = offersBySkuAndAllegro
            .flatMap(ean =>
                ean.allOffersBySKU
                    .filter(sku => sku.checked === true)
                    .map(sku => sku.sku)
            )
            .join(" - ");

        const blob = new Blob([checkedSkuList], { type: "text/plain;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;

        const formattedDateToFileName = formatDate()

        link.download = `do_wystawienia-${company}-${invoiceNumber}-${formattedDateToFileName}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    const changeQuantity = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, eanIndex: number, skuIndex: number) => {
        const newQuantity = e.target.value;

        // Create a new state structure with updated nested object
        const newOffersBySkuAndAllegro = offersBySkuAndAllegro.map((ean, currentEanIndex) => {
            if (currentEanIndex !== eanIndex) return ean;

            return {
                ...ean,
                allOffersBySKU: ean.allOffersBySKU.map((sku, currentSkuIndex) => {
                    if (currentSkuIndex !== skuIndex) return sku;
                    return {
                        ...sku,
                        skuQuantity: Number(newQuantity)
                    };
                })
            };
        });

        setOffersBySkuAndAllegro(newOffersBySkuAndAllegro);

    }

    const generateEpp = () => {

        let errorCount = 0;

        offersBySkuAndAllegro.forEach((ean) => {

            if (ean.checked === false) {
                ean.quantityError = undefined;
                return;
            }

            let totalOrderedQuantity = Number(ean.orderedQuantity.replace(',', '.'));

            ean.allOffersBySKU.forEach((sku) => {
                if (sku.skuQuantity) {
                    totalOrderedQuantity -= sku.skuQuantity;
                }
            });

            ean.quantityError = undefined;

            if (totalOrderedQuantity !== 0) {
                errorCount += 1;
                ean.quantityError = 'Błąd w ilości produktu';
            }
        })

        setOffersBySkuAndAllegro([...offersBySkuAndAllegro]);

        if (errorCount === 0) {
            // generate EPP
            console.log('Generate EPP');
            console.log(offersBySkuAndAllegro);

            const result: TEppFile[] = offersBySkuAndAllegro.flatMap(ean =>
                ean.allOffersBySKU
                    .filter(sku => sku.skuQuantity !== 0 && ean.checked !== false)
                    .map(sku => ({
                        sku: sku.sku,
                        quantity: sku.skuQuantity || 0,
                        price: ean.supplierPrice,
                    }))
            );

            console.log(result);
            generateEppFile(result, invoiceNumber, sellDate, invoiceDate, company as keyof typeof companies);
        }


    }


    function handleCheckboxChange(e: React.ChangeEvent<HTMLInputElement>, eanIndex: number): void {

        const newOffersBySkuAndAllegro = offersBySkuAndAllegro.map((ean, currentEanIndex) => {
            if (currentEanIndex !== eanIndex) return ean;
            return {
                ...ean,
                checked: e.target.checked
            };
        });

        setOffersBySkuAndAllegro(newOffersBySkuAndAllegro);

    }

    const changeCheckedToStartAllegroOffer = (checked: boolean, eanIndex: number, skuIndex: number) => {
        console.log(checked, eanIndex, skuIndex);
        const updatedOffersBySkuAndAllegro = offersBySkuAndAllegro.map((ean, currentEanIndex) => {
            if (currentEanIndex !== eanIndex) return ean;

            return {
                ...ean,
                allOffersBySKU: ean.allOffersBySKU.map((sku, currentSkuIndex) => {
                    if (currentSkuIndex !== skuIndex) return sku;
                    return {
                        ...sku,
                        checked: !sku.checked
                    };
                })
            };
        });

        setOffersBySkuAndAllegro(updatedOffersBySkuAndAllegro);
        
    }; 


    return (
        <Container>
            <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={2} marginY={4} sx={{ backgroundColor: 'black', color: 'white', paddingBottom: 2 }}>
                    <Grid item xs={1}>
                        -
                    </Grid>
                    <Grid item xs={1}>
                        Lp.
                    </Grid>
                    <Grid item xs={4}>
                        EAN Dostawcy
                    </Grid>
                    <Grid item xs={2}>
                        Ilość
                    </Grid>
                    <Grid item xs={2}>
                        Cena zakupu
                    </Grid>
                </Grid>

                {offersBySkuAndAllegro.map((sku, ind) => (
                    <React.Fragment key={ind}>
                        <Grid container spacing={2} sx={{ backgroundColor: 'gray', color: 'white', marginY: 1, paddingBottom: 1 }}>
                            <Grid item xs={1}>
                                <Checkbox
                                    checked={sku.checked || false}
                                    color="warning"
                                    onChange={(e) => handleCheckboxChange(e, ind)}
                                />
                            </Grid>
                            <Grid item xs={1}>
                                {ind + 1}
                            </Grid>
                            <Grid item xs={4}>
                                {sku.supplierEan}
                            </Grid>
                            <Grid item xs={2}>
                                {Number(sku.orderedQuantity.replace(',', '.'))}
                            </Grid>
                            <Grid item xs={2}>
                                {/* {parseFloat(sku.supplierPrice.replace(',', '.')).toFixed(2)} */}
                                {changeNumberPrice(sku.supplierPrice)}
                            </Grid>

                        </Grid>
                        {sku.quantityError && <Grid style={{ background: 'red', color: 'white', fontWeight: 'bold', padding: '10px', marginTop: '10px' }}>{sku.quantityError}</Grid>}
                        {sku.allOffersBySKU.length < 1 &&
                            <Grid container spacing={2} sx={{ backgroundColor: 'white', color: 'black', marginY: 1, paddingBottom: 2 }}>
                                <Grid item sx={{ color: 'red', fontWeight: 'bold' }}> Brak SKU dla danego EAN</Grid>
                            </Grid>}
                        {sku.allOffersBySKU.map((offer, index) => (
                            <Grid container spacing={2} key={index} sx={{ backgroundColor: 'white', color: 'black', marginY: 1, paddingBottom: 2, display: 'flex', alignItems: 'center' }}>
                                <Grid item xs={3}>
                                    {offer.nazwaTowaru}
                                </Grid>
                                <Grid item xs={2} sx={{ display: 'flex', justifyContent: 'right' }}>
                                    {offer.sku}
                                </Grid>
                                <Grid item xs={2}>
                                    <TextField type="number" onChange={(e) => changeQuantity(e, ind, index)} variant="outlined" value={offer.skuQuantity}
                                    />
                                </Grid>
                                <Grid item xs={2}>
                                    {checkPrice(offer.ostatniaCenaZakupu, sku.supplierPrice)}
                                </Grid>
                                <Grid item xs={2}>
                                    {offer.nazwaFlagi}
                                </Grid>
                                <Grid item xs={1}>
                                    {offer.komentarzFlagi ? checkNumberInFlag(offer.komentarzFlagi) : null}
                                </Grid>
                                {!offer.sklepInternetowy && <Grid container spacing={2} sx={{ backgroundColor: 'white', color: 'black', marginY: 1, paddingBottom: 0 }}>
                                    <Grid item sx={{ color: 'violet', fontWeight: 'bold' }}> Brak Sklepu Internetowego</Grid>
                                </Grid>}
                                {offer.offers.length < 1 ?
                                    <Grid container spacing={2} sx={{ backgroundColor: 'white', color: 'black', marginY: 1, paddingBottom: 2 }}>
                                        <Grid item sx={{ color: 'orange', fontWeight: 'bold' }}> Brak Ofert Allegro dla danego SKU </Grid>
                                        <Grid item>
                                            <Checkbox
                                                checked={offer.checked}
                                                color="primary"
                                                onChange={(e) => {
                                                   changeCheckedToStartAllegroOffer(e.target.checked, ind, index); // ind - eanIndex, index - skuIndex
                                                }}
                                            />
                                        </Grid>
                                    </Grid>
                                    :
                                    offer.offers.map((of, i) => (
                                        <Grid container spacing={2} key={i} sx={{ backgroundColor: 'white', color: 'gray', borderBottom: '1px solid gray', marginY: 1, marginX: 4, paddingBottom: 2, display: 'flex', alignItems: 'center' }}>

                                            <Grid item xs={2}>
                                                {of.account}
                                            </Grid>
                                            <Grid item xs={2} sx={{ display: 'flex', justifyContent: 'left' }}>
                                                {of.offerId}
                                            </Grid>
                                            <Grid item xs={2}>
                                                {parseFloat(of.price).toFixed(2)}
                                            </Grid>
                                            <Grid item xs={2}>
                                                {of.status}
                                            </Grid>
                                        </Grid>
                                    ))}
                            </Grid>

                        ))}
                    </React.Fragment>
                ))}
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: 2, gap: 2 }}>
                {/* <Button variant='contained' color='secondary' component='label' onClick={() => generateEpp()}>
                    Usuń/Modyfikuj Flagi
                </Button> */}
                <Button variant='contained' color='warning' component='label' onClick={() => insertAllegroOffers()}>
                    Lista Wystawić Allegro
                </Button>

                <Button variant='contained' color='secondary' component='label' onClick={() => updateAllegroEnded()}>
                    Lista Do Wznowienia Allegro
                </Button>

                <Button variant='contained' color='primary' component='label' onClick={() => generateEpp()}>
                    Generuj EPP
                </Button>
            </Box>
        </Container>
    )

}
