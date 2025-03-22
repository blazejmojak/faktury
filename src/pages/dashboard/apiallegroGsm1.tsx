import { Helmet } from 'react-helmet-async';

import ApiAllegroGsm1 from 'src/sections/apiallegroGsm1/view';

// ----------------------------------------------------------------------

export default function Page() {
    return (
        <>
            <Helmet>
                <title> Api Allegro GSM1</title>
            </Helmet>

            <ApiAllegroGsm1 />
        </>
    );
}
