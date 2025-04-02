import { useState } from "react";

import { Box, Button, TextField, Typography } from "@mui/material";

type WarehouseEditorProps = {
    sku: string;
    eanIndex: number;
    skuIndex: number;
    minimumStock: number;
    changeMinimumStock: (
        sku: string,
        eanIndex: number,
        skuIndex: number,
        minimumStock: number
    ) => Promise<void>;
};

const WarehouseEditor = ({
    sku,
    eanIndex,
    skuIndex,
    minimumStock,
    changeMinimumStock
}: WarehouseEditorProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [tempStock, setTempStock] = useState<string>(minimumStock.toString());

    const parsed = parseFloat(tempStock);
    const isValidNumber =
        !Number.isNaN(parsed) &&
        Number.isFinite(parsed) &&
        parsed >= 0 &&
        Number.isInteger(parsed);

    const handleEditClick = () => {
        setTempStock(minimumStock.toString());
        setIsEditing(true);
    };

    const handleAcceptClick = () => {
        if (isValidNumber) {
            const integerValue = Math.floor(parsed); // lub Math.round(parsed)

            changeMinimumStock(sku, eanIndex, skuIndex, integerValue)
                .then(() => {
                    setIsEditing(false);
                })
                .catch((error) => {
                    console.error("Error changing stock:", error);
                });
        }
    };

    const handleCancelClick = () => {
        setTempStock(minimumStock.toString());
        setIsEditing(false);
    };

    return (
        <Box>
            {isEditing ? (
                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 1 }}>
                     <TextField
                        value={tempStock}
                        onChange={(e) => setTempStock(e.target.value)}
                        error={!isValidNumber && tempStock !== ""}
                        helperText={!isValidNumber && tempStock !== "" ? "Podaj liczbę całkowitą nie mniejszą niż 0" : ""}
                        variant="outlined"
                        size="small"
                        fullWidth
                        type="number"
                        inputProps={{ step: "1", min: 0 }}
                    />
                    <Button size="small" variant="contained" onClick={handleAcceptClick} disabled={!isValidNumber}>
                        Akceptuj
                    </Button>
                    <Button size="small" variant="text" color="error" onClick={handleCancelClick}>
                        Anuluj
                    </Button>
                </Box>
            ) : (
                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 1 }}>
                    <Typography sx={{ fontSize: 14, color: 'gray', wordBreak: 'break-word' }}>
                        Stan Minimalny: {minimumStock}
                    </Typography>
                    <Button size="small" variant="outlined" onClick={handleEditClick}>
                        Edytuj
                    </Button>
                </Box>
            )}
        </Box>
    );
};

export default WarehouseEditor;
