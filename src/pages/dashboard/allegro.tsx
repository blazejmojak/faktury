import { Helmet } from 'react-helmet-async';

import Allegro from 'src/sections/ustawienia-allegro/view';

// ----------------------------------------------------------------------

export default function Page() {
    return (
        <>
            <Helmet>
                <title> Ustawienia Allegro</title>
            </Helmet>

            <Allegro />
        </>
    );
}
