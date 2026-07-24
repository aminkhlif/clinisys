// src/pages/ModulesPage.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Stack, Typography, Button, TextField, InputAdornment, Grid, Skeleton,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import { useSnackbar } from 'notistack';
import axiosClient from '../api/axiosClient.js';
import ModuleCard from '../components/module/ModuleCard.jsx';
import ModuleFormDialog from '../components/module/ModuleFormDialog.jsx';
import ConfirmDialog from '../components/common/ConfirmDialog.jsx';
import TopBar from '../components/layout/TopBar.jsx';

// Fond très discret : léger dégradé, plus de motif visuellement chargé.
const PAGE_BACKGROUND = 'linear-gradient(180deg, #FAFAFA 0%, #F3F4F6 100%)';

function ModulesPage() {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [modules, setModules] = useState([]);
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
        background: PAGE_BACKGROUND,
      }}
    >
      <TopBar breadcrumb="Modules" />

      {/* Barre d'outils : titre, recherche, création */}
      <Box
        sx={{
          bgcolor: 'rgba(255,255,255,0.85)',
          backdropFilter: 'blur(8px)',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          spacing={1.5}
          sx={{ maxWidth: 1200, width: '100%', boxSizing: 'border-box', mx: 'auto', px: { xs: 2, sm: 4 }, py: 2 }}
        >
          <Box>
            <Typography variant="h5">Modules</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.25 }}>
              Sélectionnez un module pour gérer ses menus et sous-menus
            </Typography>
          </Box>
          <Stack direction="row" spacing={1.5} sx={{ flexShrink: 0 }}>
            <TextField
              size="small"
              placeholder="Rechercher un module…"
              value={recherche}
              onChange={(e) => setRecherche(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" />
                    </InputAdornment>
                  ),
                },
              }}
              sx={{
                width: 260,
                bgcolor: 'background.paper',
                '& .MuiOutlinedInput-root': {
                  height: 46,
                  borderRadius: '14px',
                  boxShadow: '0 1px 2px rgba(16,24,40,0.05)',
                },
              }}
            />
            <Button startIcon={<AddIcon />} variant="contained" onClick={ouvrirCreation}>
              Nouveau module
            </Button>
          </Stack>
        </Stack>
      </Box>

      <Box sx={{ maxWidth: 1200, mx: 'auto', px: { xs: 2, sm: 4 }, pt: { xs: 4, sm: 5 }, pb: { xs: 3, sm: 4 } }}>
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
            {modules.map((module, index) => (
              <Grid key={module.id} size={{ xs: 12, sm: 6, md: 4 }}>
                <ModuleCard
                  module={module}
                  index={index}
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