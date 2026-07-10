// src/components/image/ImageDetailDialog.jsx
import { useEffect, useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box, IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import axiosClient from '../../api/axiosClient.js';

function ImageDetailDialog({ image, onFermer, onModifie, onOuvrirActions }) {
  const [description, setDescription] = useState('');
  const [modeEdition, setModeEdition] = useState(false);
  const [erreur, setErreur] = useState('');

  useEffect(() => {
    if (image) {
      setDescription(image.description);
      setModeEdition(false);
      setErreur('');
    }
  }, [image]);

  if (!image) return null;

  const urlImage = `data:${image.typeContenu};base64,${image.donneesBase64}`;

  const sauvegarderDescription = async () => {
    if (!description.trim()) {
      setErreur('La description est obligatoire');
      return;
    }
    try {
      await axiosClient.patch(`/images/${image.id}/description`, null, { params: { description } });
      setModeEdition(false);
      onModifie();
    } catch (err) {
      setErreur(err.response?.data?.description || 'Une erreur est survenue');
    }
  };

  const supprimer = async () => {
    if (!window.confirm('Supprimer cette image ?')) return;
    await axiosClient.delete(`/images/${image.id}`);
    onFermer();
    onModifie();
  };

  const telecharger = () => {
    const lien = document.createElement('a');
    lien.href = urlImage;
    lien.download = image.nom || 'image';
    lien.click();
  };

  return (
    <Dialog open={Boolean(image)} onClose={onFermer} fullWidth maxWidth="md">
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        Détails de la capture
        <IconButton onClick={onFermer}><CloseIcon /></IconButton>
      </DialogTitle>
      <DialogContent>
        <Box
          component="img"
          src={urlImage}
          alt={image.nom}
          sx={{ width: '100%', maxHeight: 400, objectFit: 'contain', mb: 2, border: '1px solid #eee' }}
        />
        <TextField
          fullWidth
          multiline
          rows={2}
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={!modeEdition}
          error={Boolean(erreur)}
          helperText={erreur}
        />
      </DialogContent>
      <DialogActions>
        <Button color="error" onClick={supprimer}>Supprimer</Button>
        <Button onClick={telecharger}>Télécharger</Button>
        {modeEdition ? (
          <Button variant="contained" onClick={sauvegarderDescription}>Enregistrer</Button>
        ) : (
          <Button variant="contained" onClick={() => onOuvrirActions(image)}>Modifier</Button>
        )}
        <Button onClick={onFermer}>Fermer</Button>
      </DialogActions>
    </Dialog>
  );
}

export default ImageDetailDialog;