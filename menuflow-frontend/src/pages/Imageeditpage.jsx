// src/pages/ImageEditPage.jsx
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box, AppBar, Toolbar, IconButton, Typography, Button, TextField, Stack, Grid, Divider, Chip, Skeleton,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import BlurOnOutlinedIcon from '@mui/icons-material/BlurOnOutlined';
import CropSquareOutlinedIcon from '@mui/icons-material/CropSquareOutlined';
import CenterFocusWeakOutlinedIcon from '@mui/icons-material/CenterFocusWeakOutlined';
import AdsClickOutlinedIcon from '@mui/icons-material/AdsClickOutlined';
import NearMeOutlinedIcon from '@mui/icons-material/NearMeOutlined';
import UndoOutlinedIcon from '@mui/icons-material/UndoOutlined';
import { useSnackbar } from 'notistack';
import axiosClient from '../api/axiosClient.js';
import {
  listerActions, creerAction, modifierAction, supprimerAction, validerActions, annulerActions,
} from '../api/actionsClient.js';
import { CONFIG_ACTIONS, LISTE_ACTIONS } from '../components/image/configActions.js';
import ImageEditorCanvas from '../components/image/ImageEditorCanvas.jsx';
import { dotGridBackgroundSx } from '../theme/backgrounds.js';

const ICONE_ACTION = {
  FLOU: BlurOnOutlinedIcon,
  RECTANGLE: CropSquareOutlinedIcon,
  FOCUS: CenterFocusWeakOutlinedIcon,
  CURSEUR_STATIQUE: NearMeOutlinedIcon,
  CURSEUR_CLICK: AdsClickOutlinedIcon,
};

const INTENSITE_FLOU_PAR_DEFAUT = 8;
const COULEUR_PAR_DEFAUT = '#FF0000';

function ImageEditPage() {
  const { moduleId, sousMenuId, imageId } = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const [image, setImage] = useState(null);
  const [premierChargement, setPremierChargement] = useState(true);
  const [nomSousMenu, setNomSousMenu] = useState('');
  const [description, setDescription] = useState('');
  const [nouveauFichier, setNouveauFichier] = useState(null);
  const [erreur, setErreur] = useState('');
  const [actions, setActions] = useState([]);
  const [couleurChoisie, setCouleurChoisie] = useState(COULEUR_PAR_DEFAUT);
  const [enCours, setEnCours] = useState(false);
  const [dernierTypeAjoute, setDernierTypeAjoute] = useState(null);
  const [actionSelectionneeId, setActionSelectionneeId] = useState(null);

  const chargerImage = async () => {
    try {
      const res = await axiosClient.get(`/images/${imageId}`);
      setImage(res.data);
      setDescription(res.data.description);
    } catch {
      enqueueSnackbar("Impossible de charger l'image", { variant: 'error' });
      retourAuSousMenu();
    } finally {
      setPremierChargement(false);
    }
  };

  const chargerActions = async () => {
    const data = await listerActions(imageId);
    setActions(data);
  };

  const chargerSousMenu = async () => {
    try {
      const res = await axiosClient.get(`/sous-menus/${sousMenuId}`);
      setNomSousMenu(res.data.nom);
    } catch {
      // Silencieux : le nom du sous-menu n'est qu'un élément de contexte, pas bloquant
    }
  };

  useEffect(() => {
    chargerImage();
    chargerActions();
    chargerSousMenu();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageId]);

  const retourAuSousMenu = () => {
    navigate(`/modules/${moduleId}/sous-menus/${sousMenuId}`);
  };

  if (premierChargement || !image) {
    return (
      <Box sx={{ p: 4 }}>
        <Skeleton variant="rounded" height={48} width={300} sx={{ mb: 3 }} />
        <Skeleton variant="rounded" height={420} />
      </Box>
    );
  }

  const urlAffichee = nouveauFichier
    ? URL.createObjectURL(nouveauFichier)
    : `data:${image.typeContenu};base64,${image.donneesBase64}`;

  const typeNecessiteCouleur = LISTE_ACTIONS.some((t) => CONFIG_ACTIONS[t].couleur);
  const actionSelectionnee = actions.find((a) => a.id === actionSelectionneeId) || null;
  const selectionAcceptesCouleur = actionSelectionnee && CONFIG_ACTIONS[actionSelectionnee.type]?.couleur;

  const ajouterAction = async (type) => {
    const config = CONFIG_ACTIONS[type];
    const nouvelle = await creerAction({
      type,
      x: 20,
      y: 20,
      largeur: config.largeurDefaut,
      hauteur: config.hauteurDefaut,
      couleur: config.couleur ? couleurChoisie : null,
      intensite: config.intensite ? INTENSITE_FLOU_PAR_DEFAUT : null,
      imageId: image.id,
    });
    setActions((prev) => [...prev, nouvelle]);
    setActionSelectionneeId(nouvelle.id);
    setDernierTypeAjoute(type);
    setTimeout(() => setDernierTypeAjoute(null), 900);
  };

  const changerCouleur = (nouvelleCouleur) => {
    setCouleurChoisie(nouvelleCouleur);
    if (selectionAcceptesCouleur) {
      setActions((prev) => prev.map((a) => (a.id === actionSelectionneeId ? { ...a, couleur: nouvelleCouleur } : a)));
      modifierAction(actionSelectionneeId, { ...actionSelectionnee, couleur: nouvelleCouleur });
    }
  };

  const annulerDerniereAction = async () => {
    if (actions.length === 0) return;
    const derniere = actions[actions.length - 1];
    await supprimerAction(derniere.id);
    setActions((prev) => prev.slice(0, -1));
    if (actionSelectionneeId === derniere.id) setActionSelectionneeId(null);
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
    if (actionSelectionneeId === actionId) setActionSelectionneeId(null);
  };

  const annulerToutesLesActions = async () => {
    await annulerActions(image.id);
    setActions([]);
    setActionSelectionneeId(null);
  };

  const toutSauvegarder = async () => {
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

      if (actions.length > 0) {
        await validerActions(image.id);
      }

      enqueueSnackbar('Modifications enregistrées', { variant: 'success' });
      setNouveauFichier(null);
      setActionSelectionneeId(null);
      // On reste sur la page : on recharge juste l'image et ses actions pour refléter
      // l'état sauvegardé (annotations validées et appliquées, éventuel nouveau fichier).
      await chargerImage();
      await chargerActions();
    } catch (err) {
      setErreur(err.response?.data?.description || 'Une erreur est survenue');
    } finally {
      setEnCours(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', ...dotGridBackgroundSx }}>
      <AppBar position="sticky" sx={{ top: 0 }}>
        <Toolbar sx={{ gap: 1.5 }}>
          <IconButton onClick={retourAuSousMenu} size="small">
            <ArrowBackIcon fontSize="small" />
          </IconButton>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="subtitle1" noWrap>Édition de la capture</Typography>
            {nomSousMenu && (
              <Typography variant="caption" noWrap sx={{ color: 'text.secondary', display: 'block', mt: -0.25 }}>
                {nomSousMenu}
              </Typography>
            )}
          </Box>
          <Button onClick={retourAuSousMenu}>Fermer</Button>
          <Button variant="contained" onClick={toutSauvegarder} disabled={enCours}>
            {enCours ? 'Enregistrement…' : 'Sauvegarder'}
          </Button>
        </Toolbar>
      </AppBar>

      <Box sx={{ maxWidth: 1300, mx: 'auto', p: { xs: 2, sm: 4 } }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 8 }}>
            <ImageEditorCanvas
              urlImage={urlAffichee}
              actions={actions}
              onDeplace={deplacerAction}
              onRedimensionne={redimensionnerAction}
              onSupprime={supprimerUneAction}
              actionSelectionneeId={actionSelectionneeId}
              onSelectionnerAction={setActionSelectionneeId}
              maxHeight="calc(100vh - 260px)"
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
            <Box sx={{ position: { md: 'sticky' }, top: { md: 88 } }}>
              <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1.5 }}>
                <Typography variant="subtitle1">Annotations</Typography>
                {actions.length > 0 && (
                  <Chip size="small" label={`${actions.length} posée${actions.length > 1 ? 's' : ''}`} />
                )}
              </Stack>

              <Grid container spacing={1} sx={{ mb: 2 }}>
                {LISTE_ACTIONS.map((type, index) => {
                  const Icone = ICONE_ACTION[type];
                  const dernierEtImpair = index === LISTE_ACTIONS.length - 1 && LISTE_ACTIONS.length % 2 !== 0;
                  return (
                    <Grid size={dernierEtImpair ? 12 : 6} key={type}>
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

            {typeNecessiteCouleur && (
              <Box sx={{ mb: 2.5, p: 1.5, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                  {selectionAcceptesCouleur ? 'Couleur de l\'annotation sélectionnée' : 'Couleur de la prochaine annotation'}
                </Typography>
                <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mt: 1.5 }}>
                  <Box
                    component="input"
                    type="color"
                    value={selectionAcceptesCouleur ? (actionSelectionnee.couleur || COULEUR_PAR_DEFAUT) : couleurChoisie}
                    onChange={(e) => changerCouleur(e.target.value)}
                    sx={{
                      width: 36, height: 28, border: '1px solid', borderColor: 'divider',
                      borderRadius: 1, p: 0, cursor: 'pointer', bgcolor: 'transparent',
                    }}
                  />
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    {selectionAcceptesCouleur ? (actionSelectionnee.couleur || COULEUR_PAR_DEFAUT) : couleurChoisie}
                  </Typography>
                </Stack>
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
            <Button variant="outlined" component="label" fullWidth>
              {nouveauFichier ? nouveauFichier.name : 'Choisir un fichier'}
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={(e) => setNouveauFichier(e.target.files[0])}
              />
            </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

export default ImageEditPage;