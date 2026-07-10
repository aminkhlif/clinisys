// src/components/image/ImageActionsDialog.jsx
import { useEffect, useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box, Stack, Typography, Grid, Slider,
} from '@mui/material';
import axiosClient from '../../api/axiosClient.js';
import {
  listerActions, creerAction, modifierAction, supprimerAction, validerActions, annulerActions,
} from '../../api/actionsClient.js';
import { CONFIG_ACTIONS, LISTE_ACTIONS } from './configActions.js';
import ImageEditorCanvas from './ImageEditorCanvas.jsx';

function ImageActionsDialog({ image, onFermer, onSauvegarde }) {
  const [description, setDescription] = useState('');
  const [nouveauFichier, setNouveauFichier] = useState(null);
  const [erreur, setErreur] = useState('');
  const [actions, setActions] = useState([]);
  const [couleurChoisie, setCouleurChoisie] = useState('#3B82F6');
  const [intensiteFlou, setIntensiteFlou] = useState(5);

  useEffect(() => {
    if (image) {
      setDescription(image.description);
      setNouveauFichier(null);
      setErreur('');
      chargerActions();
    }
  }, [image]);

  const chargerActions = async () => {
    if (!image) return;
    const data = await listerActions(image.id);
    setActions(data);
  };

  if (!image) return null;

  const urlAffichee = nouveauFichier
    ? URL.createObjectURL(nouveauFichier)
    : `data:${image.typeContenu};base64,${image.donneesBase64}`;

 const ajouterAction = async (type) => {
    const config = CONFIG_ACTIONS[type];
    const nouvelle = await creerAction({
      type,
      x: 20,
      y: 20,
      largeur: config.largeurDefaut,
      hauteur: config.hauteurDefaut,
      couleur: config.couleur ? couleurChoisie : null,
      intensite: config.intensite ? intensiteFlou : null,
      imageId: image.id,
    });
    setActions((prev) => [...prev, nouvelle]);
  };

  const annulerDerniereAction = async () => {
    if (actions.length === 0) return;
    const derniere = actions[actions.length - 1];
    await supprimerAction(derniere.id);
    setActions((prev) => prev.slice(0, -1));
  };

  const deplacerAction = (actionId, x, y, persister) => {
    setActions((prev) => prev.map((a) => (a.id === actionId ? { ...a, x, y } : a)));
    if (persister) {
      const action = actions.find((a) => a.id === actionId);
      modifierAction(actionId, { ...action, x, y });
    }
  };

  const redimensionnerAction = (actionId, largeur, hauteur, persister) => {
    setActions((prev) => prev.map((a) => (a.id === actionId ? { ...a, largeur, hauteur } : a)));
    if (persister) {
      const action = actions.find((a) => a.id === actionId);
      modifierAction(actionId, { ...action, largeur, hauteur });
    }
  };

  const supprimerUneAction = async (actionId) => {
    await supprimerAction(actionId);
    setActions((prev) => prev.filter((a) => a.id !== actionId));
  };

  const annulerToutesLesActions = async () => {
    await annulerActions(image.id);
    setActions([]);
  };

  const validerToutesLesActions = async () => {
    await validerActions(image.id);
    onSauvegarde();
  };

  const sauvegarderDescriptionEtFichier = async () => {
    if (!description.trim()) {
      setErreur('La description est obligatoire');
      return;
    }
    try {
      if (nouveauFichier) {
        const formData = new FormData();
        formData.append('fichier', nouveauFichier);
        await axiosClient.put(`/images/${image.id}/fichier`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }
      await axiosClient.patch(`/images/${image.id}/description`, null, { params: { description } });
      onSauvegarde();
    } catch (err) {
      setErreur(err.response?.data?.description || 'Une erreur est survenue');
    }
  };

  return (
    <Dialog open={Boolean(image)} onClose={onFermer} fullWidth maxWidth="lg">
      <DialogTitle>Visualisation de la Vidéo</DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <ImageEditorCanvas
              urlImage={urlAffichee}
              actions={actions}
              onDeplace={deplacerAction}
              onRedimensionne={redimensionnerAction}
              onSupprime={supprimerUneAction}
            />
            <TextField
              fullWidth
              multiline
              rows={2}
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              error={Boolean(erreur)}
              helperText={erreur}
              sx={{ mt: 2 }}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>Actions</Typography>
            <Stack spacing={1} sx={{ mb: 3 }}>
              {LISTE_ACTIONS.map((type) => (
                <Button key={type} variant="outlined" onClick={() => ajouterAction(type)}>
                  {CONFIG_ACTIONS[type].label}
                </Button>
              ))}
              <Button variant="outlined" color="warning" onClick={annulerToutesLesActions}>
                Annuler
              </Button>
            </Stack>

            <Typography variant="subtitle1" sx={{ mb: 1 }}>Remplacer l'image</Typography>
            <Button variant="outlined" component="label" fullWidth sx={{ mb: 3 }}>
              Choisir un fichier
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={(e) => setNouveauFichier(e.target.files[0])}
              />
            </Button>

            <Button variant="contained" color="success" fullWidth onClick={validerToutesLesActions} disabled={actions.length === 0}>
              Valider les actions sur l'image
            </Button>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={sauvegarderDescriptionEtFichier}>Sauvegarder</Button>
        <Button onClick={onFermer}>Fermer</Button>
      </DialogActions>
    </Dialog>
  );
}

export default ImageActionsDialog;