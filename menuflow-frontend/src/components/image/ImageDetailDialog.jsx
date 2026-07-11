// src/components/image/ImageDetailDialog.jsx
import { useEffect, useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box, IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import { useSnackbar } from 'notistack';
import axiosClient from '../../api/axiosClient.js';
import ConfirmDialog from '../common/ConfirmDialog.jsx';

function ImageDetailDialog({ image, onFermer, onModifie, onOuvrirActions }) {
  const { enqueueSnackbar } = useSnackbar();
  const [description, setDescription] = useState('');
  const [modeEdition, setModeEdition] = useState(false);
  const [erreur, setErreur] = useState('');
  const [enCours, setEnCours] = useState(false);
  const [confirmationSuppression, setConfirmationSuppression] = useState(false);

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
    setEnCours(true);
    try {
      await axiosClient.patch(`/images/${image.id}/description`, null, { params: { description } });
      setModeEdition(false);
      onModifie();
      enqueueSnackbar('Description mise à jour', { variant: 'success' });
    } catch (err) {
      setErreur(err.response?.data?.description || 'Une erreur est survenue');
    } finally {
      setEnCours(false);
    }
  };

  const supprimer = async () => {
    try {
      await axiosClient.delete(`/images/${image.id}`);
      setConfirmationSuppression(false);
      onFermer();
      onModifie();
      enqueueSnackbar('Image supprimée', { variant: 'success' });
    } catch {
      enqueueSnackbar('La suppression a échoué', { variant: 'error' });
    }
  };

  const telecharger = () => {
    const lien = document.createElement('a');
    lien.href = urlImage;
    lien.download = image.nom || 'image';
    lien.click();
  };

  return (
    <>
      <Dialog open={Boolean(image)} onClose={onFermer} fullWidth maxWidth="md">
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Détails de la capture
          <IconButton onClick={onFermer} size="small"><CloseIcon fontSize="small" /></IconButton>
        </DialogTitle>
        <DialogContent>
          <Box
            component="img"
            src={urlImage}
            alt={image.nom}
            sx={{
              width: '100%',
              maxHeight: 420,
              objectFit: 'contain',
              mb: 2,
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2,
              bgcolor: 'grey.50',
            }}
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
          <Button onClick={() => setConfirmationSuppression(true)}>Supprimer</Button>
          <Button startIcon={<DownloadOutlinedIcon />} onClick={telecharger}>Télécharger</Button>
          {modeEdition ? (
            <Button variant="contained" onClick={sauvegarderDescription} disabled={enCours}>
              {enCours ? 'Enregistrement…' : 'Enregistrer'}
            </Button>
          ) : (
            <Button variant="contained" onClick={() => onOuvrirActions(image)}>Modifier</Button>
          )}
          <Button onClick={onFermer}>Fermer</Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog
        ouvert={confirmationSuppression}
        titre="Supprimer cette image ?"
        message="Cette action est définitive et ne peut pas être annulée."
        onConfirmer={supprimer}
        onAnnuler={() => setConfirmationSuppression(false)}
      />
    </>
  );
}

export default ImageDetailDialog;