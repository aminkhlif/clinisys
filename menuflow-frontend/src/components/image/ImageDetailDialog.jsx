// src/components/image/ImageDetailDialog.jsx
import { useEffect, useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box, IconButton, Stack,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
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
          <Stack direction="row" spacing={0.5}>
            <IconButton onClick={() => setConfirmationSuppression(true)} size="small" title="Supprimer">
              <DeleteOutlineIcon fontSize="small" />
            </IconButton>
            <IconButton onClick={onFermer} size="small" title="Fermer">
              <CloseIcon fontSize="small" />
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <Box
            sx={{
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2,
              bgcolor: 'grey.50',
              p: 1.5,
              mb: 2,
            }}
          >
            <Box
              component="img"
              src={urlImage}
              alt={image.nom}
              sx={{
                width: '100%',
                maxHeight: 400,
                objectFit: 'contain',
                display: 'block',
                borderRadius: 1,
              }}
            />
          </Box>

          <Stack direction="row" alignItems="flex-start" spacing={1}>
            <TextField
              fullWidth
              multiline
              minRows={2}
              maxRows={4}
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={!modeEdition}
              error={Boolean(erreur)}
              helperText={erreur}
              sx={{ '& textarea': { resize: 'none' } }}
            />
            {!modeEdition && (
              <IconButton onClick={() => setModeEdition(true)} sx={{ mt: 0.5 }} title="Modifier la description">
                <EditOutlinedIcon fontSize="small" />
              </IconButton>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button startIcon={<DownloadOutlinedIcon />} onClick={telecharger}>Télécharger</Button>
          <Box sx={{ flex: 1 }} />
          <Button onClick={onFermer}>Fermer</Button>
          {modeEdition ? (
            <Button variant="contained" onClick={sauvegarderDescription} disabled={enCours}>
              {enCours ? 'Enregistrement…' : 'Enregistrer'}
            </Button>
          ) : (
            <Button variant="contained" onClick={() => onOuvrirActions(image)}>Modifier</Button>
          )}
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