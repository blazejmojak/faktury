import { Helmet } from 'react-helmet-async';

import Testy from 'src/sections/testy/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> Testy </title>
      </Helmet>

      <Testy />
    </>
  );
}
