import companies from "./data/companies";

console.log(companies);

type TItems = {
    ean: string;
    quantity: string;
    price: string;
};

export const readXMLFile = (
    file: Blob,
    company: string
): Promise<{
    invoiceNumber: string;
    sellDate: string;
    invoiceDate: string;
    allItems: TItems[];
}> => new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
        const xmlString =
            e.target && typeof e.target.result === "string"
                ? e.target.result
                : "";
        const parser = new DOMParser();
        const doc = parser.parseFromString(xmlString, "text/xml");

        let nip = "";
        let invoiceNumber = "";
        let sellDate = "";
        let invoiceDate = "";
        let allItems: TItems[] = [];

        if (
            company === "aptel" ||
            company === "dro"
        ) {
            nip = doc.querySelector("Naglowek Sprzedawca NIP")?.textContent || "";
            console.log('nip is: ', nip)
            nip = nip.replace(/-/g, "");

            if (company === "aptel" && nip !== companies.aptel.nip) {
                reject(new Error("Błędnie wybrana firma"))
            }
            if (company === "dro" && nip !== companies.dro.nip) {
                reject(new Error("Błędnie wybrana firma"))
            }

            invoiceNumber =
                doc.querySelector("Naglowek Numer")?.textContent || "";
            sellDate = doc.querySelector("Naglowek Data")?.textContent || "";
            invoiceDate = doc.querySelector("Naglowek Data")?.textContent || "";

            const items = Array.from(
                doc.querySelectorAll("Pozycje Pozycja")
            ).map((item) => ({
                ean: item.querySelector("EAN")?.textContent || "",
                quantity: item.querySelector("Ilosc")?.textContent || "",
                price: item.querySelector("Cena_netto")?.textContent || "",
            }));

            allItems = items;
        } else if (
            company === "atrax" ||
            company === "mcm" ||
            company === "telcon" ||
            company === "ddMedia" ||
            company === "toptel" ||
            company === "verna" ||
            company === "partner"
        ) {
            nip = doc.querySelector("Invoice-Parties Seller TaxID")?.textContent || "";
            console.log('nip is: ', nip)
            nip = nip.replace(/-/g, "");

            if (company === "atrax" && nip !== companies.atrax.nip) {
                reject(new Error("Błędnie wybrana firma"))
            }
            if (company === "mcm" && nip !== companies.mcm.nip) {
                reject(new Error("Błędnie wybrana firma"))
            }
            if (company === "telcon" && nip !== companies.telcon.nip) {
                reject(new Error("Błędnie wybrana firma"))
            }
            if (company === "ddMedia" && nip !== companies.ddMedia.nip) {
                reject(new Error("Błędnie wybrana firma"))
            }
            if (company === "toptel" && nip !== companies.toptel.nip) {
                reject(new Error("Błędnie wybrana firma"))
            }
            if (company === "verna" && nip !== companies.verna.nip) {
                reject(new Error("Błędnie wybrana firma"))
            }
            if (company === "partner" && nip !== companies.partner.nip) {
                reject(new Error("Błędnie wybrana firma"))
            }

            invoiceNumber =
                doc.querySelector("Invoice-Header InvoiceNumber")?.textContent || "";
            sellDate =
                doc.querySelector("Invoice-Header SalesDate")?.textContent || "";
            invoiceDate =
                doc.querySelector("Invoice-Header InvoiceDate")?.textContent || "";

            const items = Array.from(
                doc.querySelectorAll("Invoice-Lines Line Line-Item")
            ).map((item) => ({
                ean: item.querySelector("EAN")?.textContent || "brak",
                quantity:
                    item.querySelector("InvoiceQuantity")?.textContent || "",
                price:
                    item.querySelector("InvoiceUnitNetPrice")?.textContent || "",
            }));

            allItems = items;
        } else if (company === "roter") {
            invoiceNumber =
                doc.querySelector("DokumentHandlowy NumerDokumentu")?.textContent ||
                "";
            sellDate =
                doc.querySelector("DokumentHandlowy DataSprzedazy")?.textContent ||
                "";
            invoiceDate =
                doc.querySelector("DokumentHandlowy DataWystawienia")?.textContent ||
                "";

            const items = Array.from(
                doc.querySelectorAll("PozycjaDokumentu")
            ).map((item) => ({
                ean:
                    item.querySelector("Towar Kod")?.textContent || "",
                quantity: item.querySelector("Ilosc")?.textContent || "",
                price: item.querySelector("Cena")?.textContent || "",
            }));

            allItems = items;
        } else if (company === "tf1") {
            invoiceNumber =
                doc.querySelector("NAGLOWEK NUMER_DOKUMENTU")?.textContent || "";
            sellDate =
                doc.querySelector("NAGLOWEK DATA")?.textContent || "";
            invoiceDate =
                doc.querySelector("NAGLOWEK DATA_WYSTAWIENIA")?.textContent || "";

            const items = Array.from(
                doc.querySelectorAll("POZYCJE POZYCJA")
            ).map((item) => ({
                ean: item.getAttribute("SYMBOL") || "",
                quantity: item.getAttribute("ILOSC") || "",
                price: item.getAttribute("CENA_PO_UPUSCIE") || "",
            }));

            allItems = items;
        } else if (company === "flavour") {
            invoiceNumber =
                doc.querySelector("Fa P_2")?.textContent || "";
            sellDate =
                doc.querySelector("Fa P_6")?.textContent || "";
            invoiceDate =
                doc.querySelector("Fa P_1")?.textContent || "";

            const items = Array.from(
                doc.querySelectorAll("Fa FaWiersz")
            ).map((item) => ({
                ean: item.querySelector("Indeks")?.textContent || "",
                quantity: item.querySelector("P_8B")?.textContent || "",
                price: item.querySelector("P_9B")?.textContent
                    ? (parseFloat(item.querySelector("P_9B")?.textContent || "0") / 1.23).toFixed(2)
                    : "",
            }));

            allItems = items;
        }

        // Resolve the promise with the desired data
        resolve({ invoiceNumber, sellDate, invoiceDate, allItems });
    };

    reader.onerror = (error) => {
        reject(error);
    };

    if (!(file instanceof Blob)) {
        reject(new TypeError("The provided file is not a valid Blob or File object."));
        return;
    }
    reader.readAsText(file);
});
