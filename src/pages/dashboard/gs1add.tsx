import { Helmet } from 'react-helmet-async';

import GS1View from 'src/sections/gs1add/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> GS1 Add New</title>
      </Helmet>

      <GS1View />
    </>
  );
}
