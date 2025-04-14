// FlagCommentEditor.jsx
import React, { useState } from 'react';

import { TextField, Button, Typography, Stack } from '@mui/material';

import { TAllOffersBySku } from 'src/types/subiektAllegro';


interface FlagCommentEditorProps {
  offer: TAllOffersBySku;
  ind: number;
  index: number;
  changeFlagComment: (comment: string, ind: number, index: number, nazwaFlagi: string, towarIdDb: number) => void;
  type: 'add' | 'edit'
}

const FlagCommentEditor: React.FC<FlagCommentEditorProps> = ({ offer, ind, index, changeFlagComment, type }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempComment, setTempComment] = useState(offer.komentarzFlagi || "");
  const [afterEdit, setAfterEdit] = useState(false);

  const handleEditClick = () => setIsEditing(true);

  const nazwaFlagi = type === 'edit' ? offer.nazwaFlagi : "03 Zamówione u dostawcy";

  const handleAcceptClick = () => {
    setIsEditing(false);
    changeFlagComment(tempComment, ind, index, nazwaFlagi, offer.subiektDBTowarId);
    setAfterEdit(true);
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
            {offer.komentarzFlagi || ""}
          </Typography>
          <Button size="small" variant="outlined" onClick={handleEditClick}>
            {(type === 'edit' || afterEdit) ? 'Edytuj' : 'Dodaj Flagę 03' }
          </Button>
        </>
      )}
    </Stack>
  );
};

export default FlagCommentEditor;
