// src/pages/ModulesPage.jsx
import { useEffect, useRef, useState, useCallback } from 'react';
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

  const chargerModules = useCallback(async (termeRecherche = '') => {
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
  }, [enqueueSnackbar]);

  useEffect(() => {
    chargerModules();
  }, [chargerModules]);

  useEffect(() => {
    const delai = setTimeout(() => chargerModules(recherche), 300);
    return () => clearTimeout(delai);
  }, [recherche, chargerModules]);

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
      {/* Bandeau d'en-tête centralisé via le composant TopBar partagé */}
      <TopBar breadcrumb="Modules" />

      {/* Barre d'outils : recherche + création */}
      <Box
        sx={{
          maxWidth: 1200,
          width: '100%',
          mx: 'auto',
          px: { xs: 2, sm: 4 },
          pt: { xs: 2, sm: 3 },
          pb: 2,
        }}
      >
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          spacing={{ xs: 1.5, sm: 1.5 }}
        >
          {/* Section gauche : titre */}
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 650, letterSpacing: '-0.01em' }}>Modules</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.25 }}>
              Sélectionnez un module pour gérer ses menus et sous-menus
            </Typography>
          </Box>

          {/* Section droite : recherche + bouton création */}
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
                  endAdornment: recherche ? (
                    <InputAdornment position="end" sx={{ cursor: 'pointer' }}>
                      <Typography
                        variant="caption"
                        onClick={() => setRecherche('')}
                        sx={{ color: 'text.secondary', fontWeight: 500, '&:hover': { color: 'text.primary' } }}
                      >
                        Effacer
                      </Typography>
                    </InputAdornment>
                  ) : null,
                },
              }}
              sx={{ width: 240, bgcolor: 'background.paper' }}
            />
            <Button
              startIcon={<AddIcon />}
              variant="contained"
              onClick={ouvrirCreation}
              ref={boutonNouveauModuleRef}
              sx={{ whiteSpace: 'nowrap' }}
            >
              Nouveau module
            </Button>
          </Stack>
        </Stack>
      </Box>

      {/* Contenu principal */}
      <Box sx={{ maxWidth: 1200, mx: 'auto', px: { xs: 2, sm: 4 }, pb: { xs: 3, sm: 4 } }}>
        {chargement ? (
          <Grid container spacing={2.5}>
            {[...Array(6)].map((_, i) => (
              <Grid key={i} size={{ xs: 12, sm: 6, md: 4 }}>
                <Skeleton
                  variant="rounded"
                  height={160}
                  sx={{
                    borderRadius: 3,
                    animationDelay: `${i * 80}ms`,
                  }}
                />
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
              px: 4,
            }}
          >
            <Box
              component="svg"
              viewBox="0 0 64 64"
              sx={{ width: 56, height: 56, mx: 'auto', mb: 2, opacity: 0.25 }}
            >
              <rect x="6" y="6" width="22" height="22" rx="5" fill="#121212" />
              <rect x="36" y="6" width="22" height="22" rx="5" fill="#121212" opacity="0.5" />
              <rect x="6" y="36" width="22" height="22" rx="5" fill="#121212" opacity="0.5" />
              <rect x="36" y="36" width="22" height="22" rx="5" fill="#121212" />
            </Box>
            <Typography
              variant="h6"
              sx={{ fontWeight: 600, mb: 1, color: recherche ? 'text.secondary' : 'text.primary' }}
            >
              {recherche ? 'Aucun résultat' : 'Bienvenue dans Menuflow'}
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: 'text.secondary', mb: recherche ? 0 : 3, maxWidth: 340, mx: 'auto' }}
            >
              {recherche
                ? 'Essayez avec d\'autres termes de recherche ou vérifiez l\'orthographe.'
                : 'Créez votre premier module pour commencer à organiser vos menus et sous-menus.'}
            </Typography>
            {!recherche && (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={ouvrirCreation}
                sx={{ mt: 1 }}
              >
                Créer mon premier module
              </Button>
            )}
          </Box>
        ) : (
          <Grid container spacing={2.5}>
            {modules.map((module, index) => (
              <Grid
                key={module.id}
                size={{ xs: 12, sm: 6, md: 4 }}
                sx={{
                  animation: 'fadeSlideIn 350ms ease forwards',
                  animationDelay: `${index * 50}ms`,
                  opacity: 0,
                  '@keyframes fadeSlideIn': {
                    '0%': { opacity: 0, transform: 'translateY(8px)' },
                    '100%': { opacity: 1, transform: 'translateY(0)' },
                  },
                }}
              >
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
