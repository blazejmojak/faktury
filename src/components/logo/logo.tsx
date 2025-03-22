import { forwardRef } from 'react';

import Link from '@mui/material/Link';
// import { useTheme } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Box, { BoxProps } from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { RouterLink } from 'src/routes/components';

// ----------------------------------------------------------------------

export interface LogoProps extends BoxProps {
  disabledLink?: boolean;
}

const Logo = forwardRef<HTMLDivElement, LogoProps>(
  ({ disabledLink = false, sx, ...other }, ref) => {
    // const theme = useTheme();

    // const PRIMARY_LIGHT = theme.palette.primary.light;

    // const PRIMARY_MAIN = theme.palette.primary.main;

    // const PRIMARY_DARK = theme.palette.primary.dark;

    // OR using local (public folder)
    // -------------------------------------------------------
    const logo = (
      <Container sx={{ display: 'flex', alignItems: 'center', paddingTop: 2 }}>
        <Box
          component="img"
          src="/logo/logo-gsm-hurt.webp"
          sx={{ width: 40, height: 40, cursor: 'pointer', marginRight: 3 }}
        />
        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
          ERP
        </Typography>
      </Container>
    );

    if (disabledLink) {
      return logo;
    }

    return (
      <Link component={RouterLink} href="/" sx={{ display: 'contents' }}>
        {logo}
      </Link>
    );
  }
);

export default Logo;
