import axios from 'axios';

import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { useSettingsContext } from 'src/components/settings';

// ----------------------------------------------------------------------

export default function Allegro() {
    const settings = useSettingsContext();

    const handleLogin = (accountNumber: string) => {
        window.location.href = `http://localhost:5005/allegro/auth?accountNumber=${accountNumber}`;
    };

    const getRefreshToken = async (account: string) => {
        // if (!refreshToken || refreshToken === '') {
        //     console.error('No refresh token');
        //     return;
        // }

        try {
            const response = await axios.get(`http://localhost:5005/allegro/refresh-token?account=${account}`);
            console.log('Refresh Token:', response.data.refresh_token);
            localStorage.setItem('allegroRefreshToken', response.data.refresh_token);
        } catch (error) {
            console.error('Error refreshing token:', error);

        }
    }


    return (
        <Container maxWidth={settings.themeStretch ? false : 'xl'}>
            <Typography variant="h4"> Allegro Ustawienia </Typography>

            <div className='allegro-login'>
                <h4>Login to Allegro</h4>
                <div className="allegro-buttons">
                    <Button variant="contained" color="warning" onClick={() => handleLogin('gsm1')}>Połącz z Allegro GSM-HURT_PL 1</Button>
                    <Button variant="contained" color="warning" onClick={() => handleLogin('gsm2')}>Połącz z Allegro GSM-HURT_PL 2</Button>
                    <Button variant="contained" color="warning" onClick={() => handleLogin('pavel-lux')}>Połącz z Allegro PAVEL-LUX</Button>

                </div>
                <div className="allegro-buttons">
                    <Button variant="contained" color="error" onClick={() => getRefreshToken('gsm1')}>Odśwież Token GSM 1</Button>
                    <Button variant="contained" color="error" onClick={() => getRefreshToken('gsm2')}>Odśwież Token GSM 2</Button>
                    <Button variant="contained" color="error" onClick={() => getRefreshToken('pavel-lux')}>PAVEL-LUX</Button>

                </div>
            </div>
        </Container>
    );
}
