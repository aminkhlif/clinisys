// src/components/image/ImageActionsDialog.jsx
import { useEffect, useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box, Stack, Typography, Grid, Divider, Slider, Chip,
} from '@mui/material';
import BlurOnOutlinedIcon from '@mui/icons-material/BlurOnOutlined';
import CropSquareOutlinedIcon from '@mui/icons-material/CropSquareOutlined';
import CenterFocusWeakOutlinedIcon from '@mui/icons-material/CenterFocusWeakOutlined';
import AdsClickOutlinedIcon from '@mui/icons-material/AdsClickOutlined';
import NearMeOutlinedIcon from '@mui/icons-material/NearMeOutlined';
import UndoOutlinedIcon from '@mui/icons-material/UndoOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import { useSnackbar } from 'notistack';
import axiosClient from '../../api/axiosClient.js';
import {
  listerActions, creerAction, modifierAction, supprimerAction, validerActions, annulerActions,
} from '../../api/actionsClient.js';
import { CONFIG_ACTIONS, LISTE_ACTIONS } from './configActions.js';
import ImageEditorCanvas from './ImageEditorCanvas.jsx';

const ICONE_ACTION = {
  FLOU: BlurOnOutlinedIcon,
  RECTANGLE: CropSquareOutlinedIcon,
  FOCUS: CenterFocusWeakOutlinedIcon,
  CURSEUR_STATIQUE: NearMeOutlinedIcon,
  CURSEUR_STATIQUE_BLANC: NearMeOutlinedIcon,
  CURSEUR_CLICK: AdsClickOutlinedIcon,
};

function ImageActionsDialog({ image, onFermer, onSauvegarde }) {
  const { enqueueSnackbar } = useSnackbar();
  const [description, setDescription] = useState('');
  const [nouveauFichier, setNouveauFichier] = useState(null);
  const [erreur, setErreur] = useState('');
  const [actions, setActions] = useState([]);
  const [couleurChoisie, setCouleurChoisie] = useState('#3B82F6');
  const [intensiteFlou, setIntensiteFlou] = useState(5);
  const [enCours, setEnCours] = useState(false);
  const [dernierTypeAjoute, setDernierTypeAjoute] = useState(null);

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

  const typeNecessiteCouleur = LISTE_ACTIONS.some((t) => CONFIG_ACTIONS[t].couleur);
  const typeNecessiteIntensite = LISTE_ACTIONS.some((t) => CONFIG_ACTIONS[t].intensite);

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
    setDernierTypeAjoute(type);
    setTimeout(() => setDernierTypeAjoute(null), 900);
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
    setEnCours(true);
    try {
      await validerActions(image.id);
      onSauvegarde();
      enqueueSnackbar('Actions appliquées à l\'image', { variant: 'success' });
    } catch {
      enqueueSnackbar("La validation a échoué", { variant: 'error' });
    } finally {
      setEnCours(false);
    }
  };

  const sauvegarderDescriptionEtFichier = async () => {
    if (!description.trim()) {
      setErreur('La description est obligatoire');
      return;
    }
    setEnCours(true);
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
      enqueueSnackbar('Modifications enregistrées', { variant: 'success' });
    } catch (err) {
      setErreur(err.response?.data?.description || 'Une erreur est survenue');
    } finally {
      setEnCours(false);
    }
  };

  return (
    <Dialog open={Boolean(image)} onClose={onFermer} fullWidth maxWidth="lg">
      <DialogTitle>Édition de la capture</DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 8 }}>
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

          <Grid size={{ xs: 12, md: 4 }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1.5 }}>
              <Typography variant="subtitle1">Annotations</Typography>
              {actions.length > 0 && (
                <Chip size="small" label={`${actions.length} posée${actions.length > 1 ? 's' : ''}`} />
              )}
            </Stack>

            <Grid container spacing={1} sx={{ mb: 2 }}>
              {LISTE_ACTIONS.map((type) => {
                const Icone = ICONE_ACTION[type];
                return (
                  <Grid size={6} key={type}>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<Icone fontSize="small" />}
                      onClick={() => ajouterAction(type)}
                      sx={{
                        fontSize: '0.75rem',
                        justifyContent: 'flex-start',
                        borderColor: dernierTypeAjoute === type ? 'grey.900' : 'grey.200',
                        bgcolor: dernierTypeAjoute === type ? 'grey.100' : 'transparent',
                      }}
                    >
                      {CONFIG_ACTIONS[type].label}
                    </Button>
                  </Grid>
                );
              })}
            </Grid>

            {(typeNecessiteCouleur || typeNecessiteIntensite) && (
              <Box sx={{ mb: 2.5, p: 1.5, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                  Réglages pour la prochaine annotation
                </Typography>
                {typeNecessiteCouleur && (
                  <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mt: 1.5 }}>
                    <Typography variant="body2" sx={{ minWidth: 60 }}>Couleur</Typography>
                    <Box
                      component="input"
                      type="color"
                      value={couleurChoisie}
                      onChange={(e) => setCouleurChoisie(e.target.value)}
                      sx={{
                        width: 36, height: 28, border: '1px solid', borderColor: 'divider',
                        borderRadius: 1, p: 0, cursor: 'pointer', bgcolor: 'transparent',
                      }}
                    />
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>{couleurChoisie}</Typography>
                  </Stack>
                )}
                {typeNecessiteIntensite && (
                  <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mt: 1 }}>
                    <Typography variant="body2" sx={{ minWidth: 60 }}>Intensité</Typography>
                    <Slider
                      size="small"
                      value={intensiteFlou}
                      onChange={(e, v) => setIntensiteFlou(v)}
                      min={1}
                      max={20}
                      sx={{ color: 'grey.900' }}
                    />
                    <Typography variant="caption" sx={{ minWidth: 20, color: 'text.secondary' }}>{intensiteFlou}</Typography>
                  </Stack>
                )}
              </Box>
            )}

            <Stack direction="row" spacing={1} sx={{ mb: 2.5 }}>
              <Button
                fullWidth
                size="small"
                startIcon={<UndoOutlinedIcon fontSize="small" />}
                onClick={annulerDerniereAction}
                disabled={actions.length === 0}
              >
                Dernière
              </Button>
              <Button fullWidth size="small" onClick={annulerToutesLesActions} disabled={actions.length === 0}>
                Tout annuler
              </Button>
            </Stack>

            <Divider sx={{ mb: 2.5 }} />

            <Typography variant="subtitle1" sx={{ mb: 1 }}>Remplacer l'image</Typography>
            <Button variant="outlined" component="label" fullWidth sx={{ mb: 2.5 }}>
              {nouveauFichier ? nouveauFichier.name : 'Choisir un fichier'}
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={(e) => setNouveauFichier(e.target.files[0])}
              />
            </Button>

            <Button
              startIcon={<CheckCircleOutlineIcon />}
              variant="contained"
              fullWidth
              onClick={validerToutesLesActions}
              disabled={actions.length === 0 || enCours}
            >
              Valider les annotations
            </Button>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={sauvegarderDescriptionEtFichier} disabled={enCours}>
          {enCours ? 'Enregistrement…' : 'Sauvegarder'}
        </Button>
        <Button onClick={onFermer}>Fermer</Button>
      </DialogActions>
    </Dialog>
  );
}

export default ImageActionsDialog;