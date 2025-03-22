
export type TOfferType = {
    id: string;
    external: {
        id: string;
    };
    name: string;
    sellingMode: {
        price: {
            amount: string;
        };
    };
    stock: {
        available: number;
        sold: number;
    };
    publish: boolean;
};

