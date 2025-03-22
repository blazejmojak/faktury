import { Helmet } from 'react-helmet-async';

import SubiektGtInvoices from 'src/sections/subiektInvoices/view';

// ----------------------------------------------------------------------

export default function Page() {
    return (
        <>
            <Helmet>
                <title> Subiekt GT Sekcja</title>
            </Helmet>

            <SubiektGtInvoices />
        </>
    );
}
