// src/pages/ModulesPage.jsx
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Stack, Typography, Button, TextField, InputAdornment, Grid, Skeleton, Breadcrumbs,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import { useSnackbar } from 'notistack';
import axiosClient from '../api/axiosClient.js';
import ModuleCard from '../components/module/ModuleCard.jsx';
import ModuleFormDialog from '../components/module/ModuleFormDialog.jsx';
import ConfirmDialog from '../components/common/ConfirmDialog.jsx';
import UserMenu from '../components/auth/UserMenu.jsx';
import { dotGridBackgroundSx } from '../theme/backgrounds.js';

function ModulesPage() {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [modules, setModules] = useState([]);
  const boutonNouveauModuleRef = useRef(null);
  const [chargement, setChargement] = useState(true);
  const [recherche, setRecherche] = useState('');

  const [dialogOuvert, setDialogOuvert] = useState(false);
  const [moduleEnEdition, setModuleEnEdition] = useState(null);
  const [confirmation, setConfirmation] = useState(null);
  const [suppressionEnCours, setSuppressionEnCours] = useState(false);
  const [moduleMisEnAvantId, setModuleMisEnAvantId] = useState(null);

  const chargerModules = async (termeRecherche = '') => {
    setChargement(true);
    try {
      const params = termeRecherche ? { recherche: termeRecherche } : {};
      const res = await axiosClient.get('/modules', { params });
      setModules(res.data);
    } catch {
      enqueueSnackbar('Impossible de charger les modules', { variant: 'error' });
    } finally {
      setChargement(false);
    }
  };

  useEffect(() => {
    chargerModules();
  }, []);

  useEffect(() => {
    const delai = setTimeout(() => chargerModules(recherche), 300);
    return () => clearTimeout(delai);
  }, [recherche]);

  const ouvrirCreation = () => {
    setModuleEnEdition(null);
    setDialogOuvert(true);
  };

  const ouvrirEdition = (module) => {
    setModuleEnEdition(module);
    setDialogOuvert(true);
  };

  const apresSauvegarde = async (moduleCreeOuModifie) => {
    setDialogOuvert(false);
    await chargerModules(recherche);
    enqueueSnackbar(moduleEnEdition ? 'Module mis à jour' : 'Module créé', { variant: 'success' });
    setTimeout(() => boutonNouveauModuleRef.current?.blur(), 0);

    // Mise en avant visuelle de la card nouvellement créée / modifiée
    if (moduleCreeOuModifie?.id) {
      setModuleMisEnAvantId(moduleCreeOuModifie.id);
      setTimeout(() => setModuleMisEnAvantId(null), 2200);
    }
  };

  const confirmerSuppression = async () => {
    setSuppressionEnCours(true);
    try {
      await axiosClient.delete(`/modules/${confirmation.id}`);
      chargerModules(recherche);
      enqueueSnackbar('Module supprimé', { variant: 'success' });
    } catch {
      enqueueSnackbar('La suppression a échoué', { variant: 'error' });
    } finally {
      setSuppressionEnCours(false);
      setConfirmation(null);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        ...dotGridBackgroundSx,
      }}
    >
      {/* Bandeau haut collant : logo + fil d'ariane */}
      <Box
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 5,
          bgcolor: 'rgba(255,255,255,0.85)',
          backdropFilter: 'blur(8px)',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ maxWidth: 1200, width: '100%', mx: 'auto', px: { xs: 2, sm: 4 }, py: 1.5 }}
        >
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Box component="svg" viewBox="0 0 32 32" sx={{ width: 26, height: 26 }}>
              <rect x="3" y="3" width="12" height="12" rx="3" fill="#121212" opacity="0.95" />
              <rect x="17" y="3" width="12" height="12" rx="3" fill="#121212" opacity="0.55">
                <animate attributeName="opacity" values="0.35;0.85;0.35" dur="3.2s" repeatCount="indefinite" />
              </rect>
              <rect x="3" y="17" width="12" height="12" rx="3" fill="#121212" opacity="0.55">
                <animate attributeName="opacity" values="0.85;0.35;0.85" dur="3.2s" repeatCount="indefinite" />
              </rect>
              <rect x="17" y="17" width="12" height="12" rx="3" fill="#121212" opacity="0.95" />
            </Box>
            <Breadcrumbs separator="›" sx={{ fontSize: '0.85rem', '& .MuiBreadcrumbs-separator': { color: 'text.secondary' } }}>
              <Typography sx={{ fontWeight: 700, letterSpacing: '0.03em', fontSize: '0.85rem' }}>
                MENUFLOW
              </Typography>
              <Typography sx={{ color: 'text.secondary', fontSize: '0.85rem' }}>Modules</Typography>
            </Breadcrumbs>
          </Stack>
          <UserMenu variant="light" />
        </Stack>

        {/* Barre d'outils collante elle aussi : recherche, tri, création */}
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          spacing={1.5}
          sx={{ maxWidth: 1200, width: '100%', mx: 'auto', px: { xs: 2, sm: 4 }, pb: 2 }}
        >
          <Box>
            <Typography variant="h5">Modules</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.25 }}>
              Sélectionnez un module pour gérer ses menus et sous-menus
            </Typography>
          </Box>
          <Stack direction="row" spacing={1.5}>
            <TextField
              size="small"
              placeholder="Rechercher un module…"
              value={recherche}
              onChange={(e) => setRecherche(e.target.value)}
              name="recherche-modules"
              autoComplete="off"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" />
                    </InputAdornment>
                  ),
                },
              }}
              sx={{ width: 240, bgcolor: 'background.paper' }}
            />
            <Button startIcon={<AddIcon />} variant="contained" onClick={ouvrirCreation} ref={boutonNouveauModuleRef}>
              Nouveau module
            </Button>
          </Stack>
        </Stack>
      </Box>

      <Box sx={{ maxWidth: 1200, mx: 'auto', px: { xs: 2, sm: 4 }, py: { xs: 3, sm: 4 } }}>
        {chargement ? (
          <Grid container spacing={2.5}>
            {[...Array(6)].map((_, i) => (
              <Grid key={i} size={{ xs: 12, sm: 6, md: 4 }}>
                <Skeleton variant="rounded" height={148} />
              </Grid>
            ))}
          </Grid>
        ) : modules.length === 0 ? (
          <Box
            sx={{
              border: '1px dashed',
              borderColor: 'divider',
              borderRadius: 3,
              py: 10,
              textAlign: 'center',
              bgcolor: 'background.paper',
            }}
          >
            <Typography sx={{ color: 'text.secondary' }}>
              {recherche ? 'Aucun module ne correspond à cette recherche' : 'Aucun module pour le moment'}
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={2.5}>
            {modules.map((module) => (
              <Grid key={module.id} size={{ xs: 12, sm: 6, md: 4 }}>
                <ModuleCard
                  module={module}
                  misEnAvant={moduleMisEnAvantId === module.id}
                  onOuvrir={() => navigate(`/modules/${module.id}`)}
                  onEdit={() => ouvrirEdition(module)}
                  onDelete={() => setConfirmation(module)}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      <ModuleFormDialog
        ouvert={dialogOuvert}
        module={moduleEnEdition}
        onFermer={() => setDialogOuvert(false)}
        onSauvegarde={apresSauvegarde}
      />
      <ConfirmDialog
        ouvert={Boolean(confirmation)}
        titre="Supprimer ce module ?"
        message="Ce module et tous ses menus, sous-menus et images seront supprimés définitivement."
        onConfirmer={confirmerSuppression}
        onAnnuler={() => setConfirmation(null)}
        enCours={suppressionEnCours}
      />
    </Box>
  );
}

export default ModulesPage;