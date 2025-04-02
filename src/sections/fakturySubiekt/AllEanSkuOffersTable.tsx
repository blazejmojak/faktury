import axios from "axios";
import React, { useState } from "react";

import { Box, Grid, Container, TextField, Button, Checkbox } from "@mui/material";

import { TAllOffersBySkuAndAllegro, TEppFile } from "src/types/subiektAllegro";

import PriceEditor from "./PriceEditor";
import companies from "./data/companies";
import formatDate from "./helpers/formatDate";
import WarehouseEditor from "./WarehouseEditor";
import FlagCommentEditor from "./FlagCommentEditor";
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

    if (lastPrice / formattedSupplierPrice < 0.95) {
        color = 'red';
        fontWeight = 'bold';
    } else if (lastPrice / formattedSupplierPrice > 1.05) {
        color = 'green';
        fontWeight = 'bold';
    }

    return <span style={{ color, fontWeight }}> {lastPrice ? lastPrice.toFixed(2) : 'BRAK'} </span>;
}

const extractNumber = (str: string) => {
    // Use a regular expression to find a number between ##
    const match = str.match(/##(\d+)##/);
    // If a match is found, return the number converted to an integer
    return match ? parseInt(match[1], 10) : 0;
}

// const checkNumberInFlag = (flag: string) => {
//     const number = extractNumber(flag);
//     if (number > 0) {
//         return number;
//     }
//     return null;
// }

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

    const changeFlagComment = async (comment: string, eanIndex: number, skuIndex: number, nazwaFlagi: string, towarSubiektDbId: number, deleteFlagName = false) => {
        try {
            const updatedOffersBySkuAndAllegro = offersBySkuAndAllegro.map((ean, currentEanIndex) => {
                if (currentEanIndex !== eanIndex) return ean;

                return {
                    ...ean,
                    allOffersBySKU: ean.allOffersBySKU.map((sku, currentSkuIndex) => {
                        if (currentSkuIndex !== skuIndex) return sku;
                        return {
                            ...sku,
                            komentarzFlagi: comment,
                            nazwaFlagi: deleteFlagName ? "" : sku.nazwaFlagi
                        };
                    })
                };
            });

            const changeFlag = await changeFlagCommentInSubiekt(comment, nazwaFlagi, towarSubiektDbId);
            if (changeFlag === 'ok') {
                console.log("Flaga zmieniona pomyślnie w Subiekcie.");
                setOffersBySkuAndAllegro(updatedOffersBySkuAndAllegro);
            } else {
                console.error("Błąd podczas zmiany flagi w Subiekcie (Błąd SFERA).");
            }
        } catch (error) {
            console.error("Error updating flag comment:", error);
            alert("Wystąpił błąd podczas zmiany flagi. Błąd SFERA!");
        }



    }

    const changeFlagCommentInSubiekt = async (comment: string, nazwaFlagi: string, towarSubiektDbId: number) => {

        try {
            const response = await axios.post(`http://localhost:5005/subiekt/changeFlagComment`, {
                towarSubiektDbId,
                nazwaFlagi,
                comment
            });

            if (response.status === 200) {
                return 'ok';
            }
            console.error("Error changing flag comment in Subiekt database:", response.statusText);
            return 'error';

        } catch (error) {
            console.error("An error occurred while changing the flag comment:", error);
            alert("Wystąpił błąd podczas zmiany flagi w Subiekcie. Błąd SFERA!");
            return 'error';
        }
    }

    const deleteFlag = async (eanIndex: number, skuIndex: number, comment: string, nazwaFlagi: string, towarSubiektDbId: number) => {
        changeFlagComment("", eanIndex, skuIndex, nazwaFlagi, towarSubiektDbId, true);
        // changeFlagCommentInSubiekt("", "", towarSubiektDbId);
    }

    const changePrice = async (sku: string, priceType: string, price: number, eanIndex: number, skuIndex: number) => {
        try {

            const response = await axios.post(`http://localhost:5005/subiekt/changePrice`, {
                sku,
                priceType,
                price
            });

            if (response.status !== 200) {
                console.error("Error changing price in Subiekt database:", response.statusText);
                alert("Błąd zmiany ceny w Subiekcie. Błąd SFERA!");
                return;
            }

            const updatedOffersBySkuAndAllegro = offersBySkuAndAllegro.map((ean, currentEanIndex) => {
                if (currentEanIndex !== eanIndex) return ean;

                return {
                    ...ean,
                    allOffersBySKU: ean.allOffersBySKU.map((productSku, currentSkuIndex) => {
                        if (currentSkuIndex !== skuIndex) return productSku;
                        return {
                            ...productSku,
                            [priceType]: price,
                        };
                    })
                };
            });

            setOffersBySkuAndAllegro(updatedOffersBySkuAndAllegro);
        } catch (error) {
            console.error("Error changing price:", error);
            alert("Wystąpił błąd podczas zmiany ceny. Błąd SFERA!");
        }

    }

    const changeMinimumStock = async (
        sku: string,
        eanIndex: number,
        skuIndex: number,
        minimumStock: number
    ) => {
        try {
            const response = await axios.post(`http://localhost:5005/subiekt/changeMinimumStock`, {
                sku,
                minimumStock
            });
    
            if (response.status !== 200) {
                console.error("Error changing minimum stock in Subiekt database:", response.statusText);
                alert("Błąd zmiany stanu minimalnego w Subiekcie. Błąd SFERA!");
                return;
            }
    
            const updatedOffersBySkuAndAllegro = offersBySkuAndAllegro.map((ean, currentEanIndex) => {
                if (currentEanIndex !== eanIndex) return ean;
    
                return {
                    ...ean,
                    allOffersBySKU: ean.allOffersBySKU.map((productSku, currentSkuIndex) => {
                        if (currentSkuIndex !== skuIndex) return productSku;
                        return {
                            ...productSku,
                            stanMinimalny: minimumStock
                        };
                    })
                };
            });
    
            setOffersBySkuAndAllegro(updatedOffersBySkuAndAllegro);
        } catch (error) {
            console.error("Error changing minimum stock:", error);
            alert("Wystąpił błąd podczas zmiany stanu minimalnego. Błąd SFERA!");
        }
    };


    return (
        <Container maxWidth="xl">
            <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={2} marginY={4} sx={{ backgroundColor: 'black', color: 'white', paddingBottom: 2 }}>
                    <Grid item xs={1}>
                        -
                    </Grid>
                    <Grid item xs={1}>
                        Lp.
                    </Grid>
                    <Grid item xs={2.5}>
                        EAN Dostawcy
                    </Grid>
                    <Grid item xs={4.5}>
                        Nazwa dostawcy
                    </Grid>
                    <Grid item xs={1.5}>
                        Ilość
                    </Grid>
                    <Grid item xs={1.5}>
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
                            <Grid item xs={2.5}>
                                {sku.supplierEan}
                            </Grid>
                            <Grid item xs={4.5}>
                                {sku.supplierName}
                            </Grid>
                            <Grid item xs={1.5}>
                                {Number(sku.orderedQuantity.replace(',', '.'))}
                            </Grid>
                            <Grid item xs={1.5}>
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
                            <Grid container spacing={1} key={index} sx={{ backgroundColor: 'white', color: 'black', marginY: 1, paddingBottom: 2, display: 'flex', alignItems: 'center' }}>
                                <Grid item xs={3.5}>
                                    {offer.nazwaTowaru}
                                </Grid>
                                <Grid item xs={2} sx={{ display: 'flex', justifyContent: 'left' }}>
                                    {offer.sku}
                                </Grid>
                                <Grid item xs={1}>
                                    <TextField type="number" onChange={(e) => changeQuantity(e, ind, index)} variant="outlined" value={offer.skuQuantity}
                                    />
                                </Grid>
                                <Grid item xs={1.5}>
                                    {checkPrice(offer.ostatniaCenaZakupu, sku.supplierPrice)}
                                </Grid>
                                <Grid item xs={2} sx={{ fontSize: '10pt' }}>
                                    {offer.nazwaFlagi}
                                </Grid>
                                <Grid item xs={2} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 1 }}>
                                    {offer.komentarzFlagi && <FlagCommentEditor
                                        offer={offer}
                                        ind={ind}
                                        index={index}
                                        changeFlagComment={changeFlagComment}
                                    />}
                                    {offer.nazwaFlagi === "03 Zamówione u dostawcy" && (
                                        <Button
                                            size="small"
                                            variant="outlined"
                                            color="error"
                                            onClick={() => {
                                                if (window.confirm("Na pewno usunąć flagę?")) {
                                                    // deleteFlag(ind, index, offer.komentarzFlagi || "", offer.nazwaFlagi, offer.subiektDBTowarId);
                                                    deleteFlag(ind, index, "", "", offer.subiektDBTowarId);

                                                }
                                            }}
                                        >
                                            Usuń Flagę
                                        </Button>
                                    )}
                                    {/* {offer.komentarzFlagi && (
                                        <Button
                                            size="small"
                                            variant="outlined"
                                            color="primary"
                                            onClick={() => console.log("Edytuj flagę")}
                                        >
                                            Edytuj FL
                                        </Button>
                                    )} */}
                                </Grid>
                                <Grid sx={{ color: 'gray', fontSize: '14px' }}>
                                    Stan magazynowy: {offer.stanMagazynowy} <br />
                                    {offer.stanMinimalny && <WarehouseEditor sku={offer.sku} eanIndex={ind} skuIndex={index} minimumStock={offer.stanMinimalny} changeMinimumStock={changeMinimumStock} />}
                                </Grid>
                                <Grid sx={{ color: 'green', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', width: '100%', marginTop: '20px' }}>
                                    {offer.cenaSpecjalna && <PriceEditor sku={offer.sku} priceType="cenaSpecjalna" eanIndex={ind} skuIndex={index} price={offer.cenaSpecjalna} changePrice={changePrice} />}
                                    {offer.cenaHurtowa && <PriceEditor sku={offer.sku} priceType="cenaHurtowa" eanIndex={ind} skuIndex={index} price={offer.cenaHurtowa} changePrice={changePrice} />}
                                    {offer.cenaDetaliczna && <PriceEditor sku={offer.sku} priceType="cenaDetaliczna" eanIndex={ind} skuIndex={index} price={offer.cenaDetaliczna} changePrice={changePrice} />}
                                    {offer.cenaAllegro && <PriceEditor sku={offer.sku} priceType="cenaAllegro" eanIndex={ind} skuIndex={index} price={offer.cenaAllegro} changePrice={changePrice} />}
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
