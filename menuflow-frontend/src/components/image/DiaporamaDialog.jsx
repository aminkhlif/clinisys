// src/components/image/DiaporamaDialog.jsx
import { useEffect, useState } from 'react';
import { Dialog, Box, IconButton, Typography, Stack } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

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

  const precedent = () => setIndexActuel((prev) => (prev - 1 + images.length) % images.length);
  const suivant = () => setIndexActuel((prev) => (prev + 1) % images.length);

  return (
    <Dialog open={ouvert} onClose={onFermer} fullScreen>
      <Box sx={{ position: 'relative', height: '100vh', bgcolor: '#0A0A0A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <IconButton
          onClick={onFermer}
          sx={{ position: 'absolute', top: 20, right: 20, color: '#FFFFFF', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}
        >
          <CloseIcon />
        </IconButton>

        <IconButton
          onClick={precedent}
          sx={{ position: 'absolute', left: 20, color: 'rgba(255,255,255,0.6)', '&:hover': { color: '#FFFFFF', bgcolor: 'rgba(255,255,255,0.1)' } }}
        >
          <ChevronLeftIcon fontSize="large" />
        </IconButton>
        <IconButton
          onClick={suivant}
          sx={{ position: 'absolute', right: 20, color: 'rgba(255,255,255,0.6)', '&:hover': { color: '#FFFFFF', bgcolor: 'rgba(255,255,255,0.1)' } }}
        >
          <ChevronRightIcon fontSize="large" />
        </IconButton>

        <Box
          component="img"
          src={urlImage}
          alt={imageActuelle.nom}
          sx={{ maxWidth: '88%', maxHeight: '80%', objectFit: 'contain', borderRadius: 2 }}
        />

        <Stack spacing={1} alignItems="center" sx={{ position: 'absolute', bottom: 32, width: '100%' }}>
          <Typography sx={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.9rem' }}>
            {imageActuelle.description}
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem' }}>
            {indexActuel + 1} / {images.length}
          </Typography>
        </Stack>
      </Box>
    </Dialog>
  );
}

export default DiaporamaDialog;