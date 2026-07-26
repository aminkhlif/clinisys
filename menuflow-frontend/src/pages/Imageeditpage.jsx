// src/pages/ImageEditPage.jsx
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box, AppBar, Toolbar, IconButton, Typography, Button, TextField, Stack, Grid, Divider, Chip,
  Skeleton, Breadcrumbs, Tooltip,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import BlurOnOutlinedIcon from '@mui/icons-material/BlurOnOutlined';
import CropSquareOutlinedIcon from '@mui/icons-material/CropSquareOutlined';
import CenterFocusWeakOutlinedIcon from '@mui/icons-material/CenterFocusWeakOutlined';
import AdsClickOutlinedIcon from '@mui/icons-material/AdsClickOutlined';
import NearMeOutlinedIcon from '@mui/icons-material/NearMeOutlined';
import UndoOutlinedIcon from '@mui/icons-material/UndoOutlined';
import UploadFileOutlinedIcon from '@mui/icons-material/UploadFileOutlined';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import CircleIcon from '@mui/icons-material/Circle';
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

function formaterTaille(octets) {
  if (!octets) return '';
  const ko = octets / 1024;
  if (ko < 1024) return `${ko.toFixed(0)} Ko`;
  return `${(ko / 1024).toFixed(1)} Mo`;
}

function ImageEditPage() {
  const { moduleId, sousMenuId, imageId } = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const [image, setImage] = useState(null);
  const [premierChargement, setPremierChargement] = useState(true);
  const [nomModule, setNomModule] = useState('');
  const [nomSousMenu, setNomSousMenu] = useState('');
  const [description, setDescription] = useState('');
  const [nouveauFichier, setNouveauFichier] = useState(null);
  const [survolFichier, setSurvolFichier] = useState(false);
  const [erreur, setErreur] = useState('');
  const [actions, setActions] = useState([]);
  const [couleurChoisie, setCouleurChoisie] = useState(COULEUR_PAR_DEFAUT);
  const [enCours, setEnCours] = useState(false);
  const [dernierTypeAjoute, setDernierTypeAjoute] = useState(null);
  const [actionSelectionneeId, setActionSelectionneeId] = useState(null);
  const [dimensionsNaturelles, setDimensionsNaturelles] = useState(null);

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

  const chargerContexte = async () => {
    try {
      const resSousMenu = await axiosClient.get(`/sous-menus/${sousMenuId}`);
      setNomSousMenu(resSousMenu.data.nom);
    } catch {
      // silencieux, contexte uniquement
    }
    try {
      const resModule = await axiosClient.get(`/modules/${moduleId}`);
      setNomModule(resModule.data.nom);
    } catch {
      // silencieux, contexte uniquement
    }
  };

  useEffect(() => {
    chargerImage();
    chargerActions();
    chargerContexte();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageId]);

  // Avertit l'utilisateur avant de quitter/rafraîchir l'onglet s'il y a des changements non enregistrés
  const modificationsNonSauvegardees = useMemo(() => {
    if (!image) return false;
    return description !== image.description || Boolean(nouveauFichier) || actions.length > 0;
  }, [description, image, nouveauFichier, actions]);

  useEffect(() => {
    const gererAvantFermeture = (e) => {
      if (!modificationsNonSauvegardees) return;
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', gererAvantFermeture);
    return () => window.removeEventListener('beforeunload', gererAvantFermeture);
  }, [modificationsNonSauvegardees]);

  const retourAuSousMenu = () => {
    navigate(`/modules/${moduleId}/sous-menus/${sousMenuId}`);
  };

  if (premierChargement || !image) {
    return (
      <Box sx={{ minHeight: '100vh', ...dotGridBackgroundSx }}>
        <Skeleton variant="rectangular" height={64} />
        <Box sx={{ maxWidth: 1300, mx: 'auto', p: { xs: 2, sm: 4 } }}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 8 }}>
              <Skeleton variant="rounded" height={420} />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Skeleton variant="rounded" height={280} />
            </Grid>
          </Grid>
        </Box>
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

  const choisirFichier = (fichier) => {
    if (fichier && fichier.type.startsWith('image/')) {
      setNouveauFichier(fichier);
    }
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
            <Breadcrumbs
              separator="›"
              sx={{
                fontSize: '0.7rem',
                '& .MuiBreadcrumbs-separator': { color: 'text.secondary', mx: 0.5 },
                '& .MuiBreadcrumbs-li': { minWidth: 0 },
              }}
            >
              {nomModule && (
                <Typography noWrap sx={{ color: 'text.secondary', fontSize: '0.7rem', maxWidth: 140 }}>
                  {nomModule}
                </Typography>
              )}
              {nomSousMenu && (
                <Typography noWrap sx={{ color: 'text.secondary', fontSize: '0.7rem', maxWidth: 160 }}>
                  {nomSousMenu}
                </Typography>
              )}
            </Breadcrumbs>
            <Stack direction="row" alignItems="center" spacing={0.75}>
              <Typography variant="subtitle1" noWrap>Édition de la capture</Typography>
              {modificationsNonSauvegardees && (
                <Tooltip title="Modifications non enregistrées">
                  <CircleIcon sx={{ fontSize: 7, color: 'grey.500' }} />
                </Tooltip>
              )}
            </Stack>
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
              maxHeight="calc(100vh - 320px)"
              onDimensionsChargees={setDimensionsNaturelles}
            />

            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mt: 1, mb: 2 }}>
              <Stack direction="row" alignItems="center" spacing={0.75}>
                <ImageOutlinedIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  {image.nom}
                  {dimensionsNaturelles && ` · ${dimensionsNaturelles.largeur}×${dimensionsNaturelles.hauteur}px`}
                  {nouveauFichier && ` · ${formaterTaille(nouveauFichier.size)} (nouveau fichier)`}
                </Typography>
              </Stack>
            </Stack>

            <TextField
              fullWidth
              multiline
              rows={2}
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              error={Boolean(erreur)}
              helperText={erreur}
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

              <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
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
              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 2.5 }}>
                Astuce : sélectionnez une annotation puis <b>Suppr</b> pour l'effacer, <b>Échap</b> pour désélectionner.
              </Typography>

              <Divider sx={{ mb: 2.5 }} />

              <Typography variant="subtitle1" sx={{ mb: 1 }}>Remplacer l'image</Typography>
              <Box
                component="label"
                onDragOver={(e) => { e.preventDefault(); setSurvolFichier(true); }}
                onDragLeave={() => setSurvolFichier(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setSurvolFichier(false);
                  choisirFichier(e.dataTransfer.files?.[0]);
                }}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 0.75,
                  py: 2.5,
                  px: 2,
                  border: '1.5px dashed',
                  borderColor: survolFichier ? 'grey.900' : 'grey.200',
                  bgcolor: survolFichier ? 'grey.50' : 'transparent',
                  borderRadius: 2,
                  cursor: 'pointer',
                  transition: 'all 140ms ease',
                  '&:hover': { borderColor: 'grey.400' },
                }}
              >
                <UploadFileOutlinedIcon sx={{ color: 'grey.500', fontSize: 20 }} />
                <Typography variant="caption" sx={{ color: 'text.secondary', textAlign: 'center' }}>
                  {nouveauFichier ? nouveauFichier.name : 'Glissez une image, ou cliquez pour parcourir'}
                </Typography>
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={(e) => choisirFichier(e.target.files[0])}
                />
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

export default ImageEditPage;