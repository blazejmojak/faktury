// FlagCommentEditor.jsx
import React, { useState } from 'react';

import { TextField, Button, Typography, Stack } from '@mui/material';

import { TAllOffersBySku } from 'src/types/subiektAllegro';


interface FlagCommentEditorProps {
  offer: TAllOffersBySku;
  ind: number;
  index: number;
  changeFlagComment: (comment: string, ind: number, index: number, nazwaFlagi: string, towarIdDb: number) => void;
}

const FlagCommentEditor: React.FC<FlagCommentEditorProps> = ({ offer, ind, index, changeFlagComment }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempComment, setTempComment] = useState(offer.komentarzFlagi || "");

  const handleEditClick = () => setIsEditing(true);

  const handleAcceptClick = () => {
    setIsEditing(false);
    changeFlagComment(tempComment, ind, index, offer.nazwaFlagi, offer.subiektDBTowarId);
    // setTempComment(tempComment || "");
    // changeFlagCommentInSubiekt(tempComment, offer.nazwaFlagi, offer.subiektDBTowarId);
  };

  return (
    <Stack spacing={1}>
      {isEditing ? (
        <>
          <TextField
            value={tempComment}
            onChange={(e) => setTempComment(e.target.value)}
            variant="outlined"
            size="medium"
            fullWidth
            multiline
            rows={4} // Adjust the number of rows as needed
          />
          <Button size="small" variant="contained" onClick={handleAcceptClick}>
            Akceptuj
          </Button>
        </>
      ) : (
        <>
          <Typography sx={{ fontSize: 14, color: 'gray', wordBreak: 'break-word' }}>
            {offer.komentarzFlagi || "Brak komentarza"}
          </Typography>
          <Button size="small" variant="outlined" onClick={handleEditClick}>
            Edytuj
          </Button>
        </>
      )}
    </Stack>
  );
};

export default FlagCommentEditor;
