import { Helmet } from 'react-helmet-async';

import RaportSprzedazy from 'src/sections/raportSprzedazy/view';


// ----------------------------------------------------------------------

export default function Page() {
    return (
        <>
            <Helmet>
                <title> Raport Sprzedaży</title>
            </Helmet>

            <RaportSprzedazy />
        </>
    );
}
