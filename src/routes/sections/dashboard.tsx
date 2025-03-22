import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import { AuthGuard } from 'src/auth/guard';
import DashboardLayout from 'src/layouts/dashboard';
import SubiektSection from 'src/pages/dashboard/subiektSection';

import { LoadingScreen } from 'src/components/loading-screen';

import Generator20 from 'src/sections/generator20/view';
import ApiAllegroGsm1 from 'src/sections/apiallegroGsm1/view';
import ApiAllegroGsm2 from 'src/sections/apiallegroGsm2/view';
import ApiAllegroPavelLux from 'src/sections/apiallegroPavelLux/view';


// ----------------------------------------------------------------------

const IndexPage = lazy(() => import('src/pages/dashboard/one'));
const PageTwo = lazy(() => import('src/pages/dashboard/gs1lista'));
const GS1Add = lazy(() => import('src/pages/dashboard/gs1add'));
const Testy = lazy(() => import('src/pages/dashboard/test'));
const PageFour = lazy(() => import('src/pages/dashboard/four'));
const PageFive = lazy(() => import('src/pages/dashboard/five'));
const PageSix = lazy(() => import('src/pages/dashboard/six'));
const Allegro = lazy(() => import('src/pages/dashboard/allegro'));
const AllegroSection = lazy(() => import('src/pages/dashboard/allegroSection'));
const RaportSprzedazy = lazy(() => import('src/pages/dashboard/raportSprzedazy'));

// ----------------------------------------------------------------------

export const dashboardRoutes = [
  {
    path: 'dashboard',
    element: (
      <AuthGuard>
        <DashboardLayout>
          <Suspense fallback={<LoadingScreen />}>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      </AuthGuard>
    ),
    children: [
      { element: <IndexPage />, index: true },
      { path: 'gs1lista', element: <PageTwo /> },
      { path: 'gs1add', element: <GS1Add /> },
      { path: 'apiallegro-gsm1', element: <ApiAllegroGsm1 /> },
      { path: 'apiallegro-gsm2', element: <ApiAllegroGsm2 /> },
      { path: 'apiallegro-pavel-lux', element: <ApiAllegroPavelLux /> },
      {
        path: 'allegro',
        children: [
          { element: <AllegroSection />, index: true },
          { path: 'raport-sprzedazy', element: <RaportSprzedazy /> },
          { path: 'generator-20', element: <Generator20 /> },
        ],
      },
      {
        path: 'subiekt-gt',
        children: [
          { element: <SubiektSection />, index: true },
        ],
      },
      {
        path: 'ustawienia',
        children: [
          { element: <Allegro />, index: true },
        ],
      },
      { path: 'testy', element: <Testy /> },
      {
        path: 'group',
        children: [
          { element: <PageFour />, index: true },
          { path: 'five', element: <PageFive /> },
          { path: 'six', element: <PageSix /> },
        ],
      },
    ],
  },
];
