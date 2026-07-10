// src/components/image/DiaporamaDialog.jsx
import { useEffect, useState } from 'react';
import { Dialog, Box, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

function DiaporamaDialog({ ouvert, images, onFermer }) {
  const [indexActuel, setIndexActuel] = useState(0);

  useEffect(() => {
    if (!ouvert) return;
    setIndexActuel(0);
  }, [ouvert]);

  useEffect(() => {
    if (!ouvert || images.length === 0) return;
    const intervalle = setInterval(() => {
      setIndexActuel((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(intervalle);
  }, [ouvert, images.length]);

  if (!ouvert || images.length === 0) return null;

  const imageActuelle = images[indexActuel];
  const urlImage = `data:${imageActuelle.typeContenu};base64,${imageActuelle.donneesBase64}`;

  return (
    <Dialog open={ouvert} onClose={onFermer} fullScreen>
      <Box sx={{ position: 'relative', height: '100vh', bgcolor: 'black', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <IconButton onClick={onFermer} sx={{ position: 'absolute', top: 16, right: 16, color: 'white' }}>
          <CloseIcon />
        </IconButton>

        <Box
          component="img"
          src={urlImage}
          alt={imageActuelle.nom}
          sx={{ maxWidth: '90%', maxHeight: '85%', objectFit: 'contain' }}
        />

        <Typography sx={{ position: 'absolute', bottom: 24, color: 'white' }}>
          {indexActuel + 1} / {images.length} — {imageActuelle.description}
        </Typography>
      </Box>
    </Dialog>
  );
}

export default DiaporamaDialog;