// ----------------------------------------------------------------------

const ROOTS = {
  AUTH: '/auth',
  DASHBOARD: '/dashboard',
};

// ----------------------------------------------------------------------

export const paths = {
  minimalUI: 'https://mui.com/store/items/minimal-dashboard/',
  // AUTH
  auth: {
    jwt: {
      login: `${ROOTS.AUTH}/jwt/login`,
      register: `${ROOTS.AUTH}/jwt/register`,
    },
  },
  // DASHBOARD
  dashboard: {
    root: ROOTS.DASHBOARD,
    one: `${ROOTS.DASHBOARD}/one`,
    gs1lista: `${ROOTS.DASHBOARD}/gs1lista`,
    gs1add: `${ROOTS.DASHBOARD}/gs1add`,
    apiallegroGsm1: `${ROOTS.DASHBOARD}/apiallegro-gsm1`,
    apiallegroGsm2: `${ROOTS.DASHBOARD}/apiallegro-gsm2`,
    apiallegroPavelLux: `${ROOTS.DASHBOARD}/apiallegro-pavel-lux`,
    allegro: {
      root: `${ROOTS.DASHBOARD}/allegro`,
      raportSprzedazy: `${ROOTS.DASHBOARD}/allegro/raport-sprzedazy`,
      generator20: `${ROOTS.DASHBOARD}/allegro/generator-20`,

    },
    subiektgt: {
      root: `${ROOTS.DASHBOARD}/subiekt-gt`,
    },
    ustawienia: {
      root: `${ROOTS.DASHBOARD}/ustawienia`,
    },
    testy: `${ROOTS.DASHBOARD}/testy`,
    group: {
      root: `${ROOTS.DASHBOARD}/group`,
      five: `${ROOTS.DASHBOARD}/group/five`,
      six: `${ROOTS.DASHBOARD}/group/six`,
    },
  },
};
