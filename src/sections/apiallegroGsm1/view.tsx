import axios from 'axios';
import { useEffect } from 'react';


export default function ApiAllegroGsm1() {

    const handleCallback = async () => {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');

        if (code) {
            try {
                const response = await axios.get(`http://localhost:5005/allegro/callback?code=${code}&account=gsm1`);
                console.log('Access Token:', response.data.access_token, 'Refresh token', response.data.refresh_token);
                // localStorage.setItem('allegroAccessToken', response.data.access_token);
                // localStorage.setItem('allegroRefreshToken', response.data.refresh_token);
            } catch (error) {
                console.error('Error fetching access token:', error);
            }
        }
    };

    useEffect(() => {
        handleCallback();
    }, []);


    return (
        <div>
            Api Allegro GSM1
        </div>
    );
}
