import { Helmet } from 'react-helmet-async';

import TwoView from 'src/sections/gs1lista/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> GS1 Lista</title>
      </Helmet>

      <TwoView />
    </>
  );
}
