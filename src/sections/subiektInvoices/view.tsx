import axios from 'axios';
import { useState, ChangeEvent } from 'react';

import { Box, Button } from '@mui/material';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { useSettingsContext } from 'src/components/settings';


export default function SubiektGtInvoices() {
    const settings = useSettingsContext();

    const [file, setFile] = useState<File | null>(null);

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setFile(event.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!file) return alert("Wybierz plik XML najpierw.");

        const formData = new FormData();
        formData.append("xmlFile", file);

        try {
            const response = await axios.post("http://localhost:5005/subiekt/upload-xml", formData, {
                headers: { "Content-Type": "multipart/form-data" },
                responseType: 'blob'
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'converted_file.epp'); // or extract from response headers
            document.body.appendChild(link);
            link.click();
            link.parentNode?.removeChild(link);

            console.log("File downloaded successfully");
        } catch (error) {
            console.error("Upload error:", error);
        }

        return null;
    };

    return (
        <Container
            maxWidth={settings.themeStretch ? false : 'lg'}
            sx={{
                flexGrow: 1,
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <Typography variant="h4">
                Konwerter Faktur dla Subiekt GT
            </Typography>
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                mb: 4
            }}>

                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'start',
                        alignItems: 'center',
                        gap: 4,
                        mt: {
                            xs: 4,
                            md: 4,
                        },
                    }}
                >
                    <Button
                        variant='contained'
                        color='primary'
                        component='label'
                    >
                        Wybierz Plik XML
                        <input
                            type="file"
                            accept=".xml"
                            hidden
                            onChange={handleFileChange}
                        />
                    </Button>
                    {file && <Typography>{file.name}</Typography>}
                    <Button
                        variant='contained'
                        color='secondary'
                        onClick={handleUpload}
                    >
                        Konwertuj na EPP
                    </Button>
                </Box>

            </Box>


        </Container>
    );
}