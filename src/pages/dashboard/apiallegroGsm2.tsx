import { Helmet } from 'react-helmet-async';

import ApiAllegroGsm2 from 'src/sections/apiallegroGsm2/view';

// ----------------------------------------------------------------------

export default function Page() {
    return (
        <>
            <Helmet>
                <title> Api Allegro GSM2</title>
            </Helmet>

            <ApiAllegroGsm2 />
        </>
    );
}
