type TOffer = {
    accountName: string;
    offerId: string;
};

type TNewTyped = {
    date: string;
    available: number;
    externalId: string;
    offerIds: TOffer[];
    soldLast30Days: number;
};

export const newTypedData: TNewTyped[] = [
    {
        date: "2025-02-19T09:51:42.336Z",
        available: 10,
        externalId: "0000012345",
        offerIds: [
            { accountName: "gsm1", offerId: "offer123" },
            { accountName: "gsm2", offerId: "offer456" }
        ],
        soldLast30Days: 15
    },
    {
        date: "2025-02-20T10:22:33.123Z",
        available: 5,
        externalId: "0000067890",
        offerIds: [
            { accountName: "gsm1", offerId: "offer789" },
            { accountName: "gsm2", offerId: "offer012" }
        ],
        soldLast30Days: 8
    }
];
