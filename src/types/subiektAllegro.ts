
export interface TAllOffers {
    account: string;
    offerId: string;
    price: string;
    status: string;
}

export interface TAllOffersBySku {
    checked: boolean; /* empty in allegro */
    sku: string;
    subiektDBTowarId: number;
    nazwaTowaru: string;
    stanMagazynowy: number,
    stanMinimalny: number,
    nazwaFlagi: string;
    komentarzFlagi: string | null;
    sklepInternetowy: boolean;
    ostatniaCenaZakupu: number;
    grupaTowarowaNazwa: string;
    skuQuantity?: number;
    cenaDetaliczna: number;
    cenaHurtowa: number;
    cenaSpecjalna: number;
    cenaAllegro: number;
    offers: TAllOffers[]
}


export interface TAllOffersBySkuAndAllegro {
    checked: boolean;  /* empty in subiekt */
    supplierEan: string;
    supplierName: string;
    orderedQuantity: string;
    supplierPrice: string;
    quantityError?: string;
    allOffersBySKU: TAllOffersBySku[];
}

export interface TEppFile {
        sku: string;
        quantity: number;
        price: string;
}