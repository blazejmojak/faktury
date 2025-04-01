import { useState } from "react";

import { Box, Button, TextField, Typography } from "@mui/material";

type PriceEditorProps = {
    sku: string;
    priceType: string;
    eanIndex: number;
    skuIndex: number;
    price: number;
    changePrice: (sku: string, priceType: string, price: number, eanIndex: number, skuIndex: number) => Promise<void>;
};

const PriceEditor: React.FC<PriceEditorProps> = ({ sku, priceType, eanIndex, skuIndex, price, changePrice }: PriceEditorProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [tempPrice, setTempPrice] = useState<string>(price.toString());


    const handleEditClick = () => {
        setTempPrice(price.toFixed(2)); // Always reset to latest prop value
        setIsEditing(true);
    };
    
    const handleAcceptClick = () => {
        console.log('temp price is: ', tempPrice);

        changePrice(sku, priceType, parseFloat(tempPrice), eanIndex, skuIndex)
            .then(() => {
                setTempPrice((prev) => (parseFloat(prev) || 0).toFixed(2));
                setIsEditing(false);
            }).catch((error: any) => {
                // Revert tempPrice to the original price if the change fails
                console.error("Error changing price:", error);
                setTempPrice(price.toFixed(2));
            });

    };


    return (
        <Box>
            {isEditing ? (
                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 1 }}>
                    <TextField
                        value={tempPrice}
                        onChange={(e) => {
                            const { value } = e.target;
                            // Allow the raw string to be set
                            if (/^\d*\.?\d{0,2}$/.test(value)) {
                                console.log(tempPrice);
                                setTempPrice(value);
                            }
                        }}
                        onBlur={() => {
                            // Convert to a number on blur
                            setTempPrice((prev) => (parseFloat(prev) || 0).toFixed(2));
                        }}
                        variant="outlined"
                        size="small"
                        fullWidth
                        type="number"
                        inputProps={{ step: "0.01" }}
                    />
                    <Button size="small" variant="contained" onClick={handleAcceptClick}>
                        Akceptuj
                    </Button>
                    <Button size="small" variant="text" color="error"
                        onClick={() => {
                            setTempPrice(price.toFixed(2));
                            setIsEditing(false);
                        }}>
                        Anuluj
                    </Button>
                </Box>
            ) : (
                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 1 }}>
                    <Typography sx={{ fontSize: 14, color: 'gray', wordBreak: 'break-word' }}>
                        {priceType.toUpperCase()}: {price || 0}
                    </Typography>
                    <Button size="small" variant="outlined" onClick={handleEditClick}>
                        Edytuj
                    </Button>
                </Box>
            )}
        </Box>
    )
}

export default PriceEditor;
