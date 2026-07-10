// src/components/image/ImageUploadDialog.jsx
import { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Box,
} from '@mui/material';
import axiosClient from '../../api/axiosClient.js';

function ImageUploadDialog({ ouvert, sousMenuId, onFermer, onSauvegarde }) {
  const [fichier, setFichier] = useState(null);
  const [description, setDescription] = useState('');
  const [erreur, setErreur] = useState('');

  const reinitialiser = () => {
    setFichier(null);
    setDescription('');
    setErreur('');
  };

  const fermer = () => {
    reinitialiser();
    onFermer();
  };

  const envoyer = async () => {
    if (!fichier) {
      setErreur('Veuillez sélectionner un fichier');
      return;
    }
    if (!description.trim()) {
      setErreur('La description est obligatoire');
      return;
    }

    const formData = new FormData();
    formData.append('fichier', fichier);
    formData.append('description', description);
    formData.append('sousMenuId', sousMenuId);

    try {
      await axiosClient.post('/images', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      reinitialiser();
      onSauvegarde();
    } catch (err) {
      setErreur(err.response?.data?.description || 'Une erreur est survenue');
    }
  };

  return (
    <Dialog open={ouvert} onClose={fermer} fullWidth maxWidth="sm">
      <DialogTitle>Ajouter une capture</DialogTitle>
      <DialogContent>
        <Box sx={{ my: 2 }}>
          <Button variant="outlined" component="label">
            Choisir un fichier
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={(e) => setFichier(e.target.files[0])}
            />
          </Button>
          {fichier && <Box sx={{ mt: 1 }}>{fichier.name}</Box>}
        </Box>
        <TextField
          fullWidth
          multiline
          rows={3}
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          error={Boolean(erreur)}
          helperText={erreur}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={fermer}>Annuler</Button>
        <Button variant="contained" onClick={envoyer}>Enregistrer</Button>
      </DialogActions>
    </Dialog>
  );
}

export default ImageUploadDialog;