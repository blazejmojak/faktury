import { Helmet } from 'react-helmet-async';

import Testy from 'src/sections/fakturySubiekt/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> Faktury Subiekt </title>
      </Helmet>

      <Testy />
    </>
  );
}
