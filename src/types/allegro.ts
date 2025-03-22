export type TAuction = {
    id: string;
    name: string;
    stock: {
        available: number;
        sold: number;
    };
    sellingMode: {
        price: {
            amount: number;
        };
    };
    primaryImage: {
        url: string;
    };
}


export type TSale = {
    payment: {
        finishedAt: string;
    };
    buyer: {
        login: string;
    };
    lineItems: {
        offer: {
            name: string;
        };
    }[];
}
