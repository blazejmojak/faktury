import { Helmet } from 'react-helmet-async';

import AllegroIncreasePrice from 'src/sections/allegro/view';


// ----------------------------------------------------------------------

export default function Page() {
    return (
        <>
            <Helmet>
                <title> Allegro Zwiększenie Ceny</title>
            </Helmet>

            <AllegroIncreasePrice />
        </>
    );
}
