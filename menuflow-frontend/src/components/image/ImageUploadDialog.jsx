// src/components/image/ImageUploadDialog.jsx
import { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Box, Typography,
} from '@mui/material';
import UploadFileOutlinedIcon from '@mui/icons-material/UploadFileOutlined';
import axiosClient from '../../api/axiosClient.js';

function ImageUploadDialog({ ouvert, sousMenuId, onFermer, onSauvegarde }) {
  const [fichier, setFichier] = useState(null);
  const [description, setDescription] = useState('');
  const [erreur, setErreur] = useState('');
  const [enCours, setEnCours] = useState(false);
  const [survole, setSurvole] = useState(false);

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

    setEnCours(true);
    try {
      await axiosClient.post('/images', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      reinitialiser();
      onSauvegarde();
    } catch (err) {
      setErreur(err.response?.data?.description || 'Une erreur est survenue');
    } finally {
      setEnCours(false);
    }
  };

  const gererDepot = (e) => {
    e.preventDefault();
    setSurvole(false);
    if (e.dataTransfer.files?.[0]) setFichier(e.dataTransfer.files[0]);
  };

  return (
    <Dialog open={ouvert} onClose={fermer} fullWidth maxWidth="sm">
      <DialogTitle>Ajouter une capture</DialogTitle>
      <DialogContent>
        <Box
          component="label"
          onDragOver={(e) => { e.preventDefault(); setSurvole(true); }}
          onDragLeave={() => setSurvole(false)}
          onDrop={gererDepot}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1,
            my: 2,
            py: 4,
            px: 2,
            border: '1.5px dashed',
            borderColor: survole ? 'grey.900' : 'grey.200',
            bgcolor: survole ? 'grey.50' : 'transparent',
            borderRadius: 3,
            cursor: 'pointer',
            transition: 'all 140ms ease',
            '&:hover': { borderColor: 'grey.400' },
          }}
        >
          <UploadFileOutlinedIcon sx={{ color: 'grey.500' }} />
          <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center' }}>
            {fichier ? fichier.name : 'Glissez une image ici, ou cliquez pour parcourir'}
          </Typography>
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={(e) => setFichier(e.target.files[0])}
          />
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
        <Button onClick={fermer} disabled={enCours}>Annuler</Button>
        <Button variant="contained" onClick={envoyer} disabled={enCours}>
          {enCours ? 'Envoi…' : 'Enregistrer'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ImageUploadDialog;