// src/components/layout/Sidebar.jsx
import { useEffect, useRef, useState } from 'react';
import {
  Box, TextField, InputAdornment, List, Button, Stack, Typography, Skeleton, IconButton, Tooltip, Fade,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate, useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import axiosClient from '../../api/axiosClient.js';
import MenuFormDialog from '../menu/MenuFormDialog.jsx';
import SousMenuFormDialog from '../sousMenu/SousMenuFormDialog.jsx';
import MenuItem from '../menu/MenuItem.jsx';
import ConfirmDialog from '../common/ConfirmDialog.jsx';

function Sidebar() {
  const { enqueueSnackbar } = useSnackbar();
  const { moduleId, sousMenuId } = useParams();
  const navigate = useNavigate();

  const [confirmation, setConfirmation] = useState(null);
  const [menus, setMenus] = useState([]);
  const [chargementMenus, setChargementMenus] = useState(true);
  const [sousMenusParMenu, setSousMenusParMenu] = useState({});
  const [menusOuverts, setMenusOuverts] = useState({});
  const [recherche, setRecherche] = useState('');
  const boutonNouveauMenuRef = useRef(null);

  const [dialogMenuOuvert, setDialogMenuOuvert] = useState(false);
  const [menuEnEdition, setMenuEnEdition] = useState(null);

  const [dialogSousMenuOuvert, setDialogSousMenuOuvert] = useState(false);
  const [sousMenuEnEdition, setSousMenuEnEdition] = useState(null);
  const [menuParentPourAjout, setMenuParentPourAjout] = useState(null);

  const chargerMenus = async (termeRecherche = '') => {
    try {
      const params = { moduleId, ...(termeRecherche ? { recherche: termeRecherche } : {}) };
      const res = await axiosClient.get('/menus', { params });
      setMenus(res.data);
    } catch {
      enqueueSnackbar('Impossible de charger les menus', { variant: 'error' });
    } finally {
      setChargementMenus(false);
    }
  };

  const chargerSousMenus = async (menuId) => {
    try {
      const res = await axiosClient.get('/sous-menus', { params: { menuId } });
      setSousMenusParMenu((prev) => ({ ...prev, [menuId]: res.data }));
    } catch {
      enqueueSnackbar('Impossible de charger les sous-menus', { variant: 'error' });
    }
  };

  useEffect(() => {
    setChargementMenus(true);
    setMenusOuverts({});
    setSousMenusParMenu({});
    chargerMenus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moduleId]);

  useEffect(() => {
    const delai = setTimeout(() => {
      chargerMenus(recherche);
    }, 300);
    return () => clearTimeout(delai);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recherche]);

  const basculerMenu = (menuId) => {
    const estOuvert = !menusOuverts[menuId];
    setMenusOuverts((prev) => ({ ...prev, [menuId]: estOuvert }));
    if (estOuvert && !sousMenusParMenu[menuId]) {
      chargerSousMenus(menuId);
    }
  };

  const confirmerSuppression = async () => {
    try {
      if (confirmation.type === 'menu') {
        await axiosClient.delete(`/menus/${confirmation.cible.id}`);
        chargerMenus(recherche);
        enqueueSnackbar('Menu supprimé', { variant: 'success' });
      } else if (confirmation.type === 'sousMenu') {
        const sousMenu = confirmation.cible;
        await axiosClient.delete(`/sous-menus/${sousMenu.id}`);
        chargerSousMenus(sousMenu.menuId);
        if (sousMenuId === String(sousMenu.id)) {
          navigate(`/modules/${moduleId}`);
        }
        enqueueSnackbar('Sous-menu supprimé', { variant: 'success' });
      }
    } catch {
      enqueueSnackbar('La suppression a échoué', { variant: 'error' });
    } finally {
      setConfirmation(null);
    }
  };

  const ouvrirCreationMenu = () => {
    setMenuEnEdition(null);
    setDialogMenuOuvert(true);
  };

  const ouvrirEditionMenu = (menu) => {
    setMenuEnEdition(menu);
    setDialogMenuOuvert(true);
  };

  const demanderSuppressionMenu = (menu) => {
    setConfirmation({ type: 'menu', cible: menu });
  };

  const ouvrirCreationSousMenu = (menuId) => {
    setSousMenuEnEdition(null);
    setMenuParentPourAjout(menuId);
    setDialogSousMenuOuvert(true);
  };

  const ouvrirEditionSousMenu = (sousMenu) => {
    setSousMenuEnEdition(sousMenu);
    setMenuParentPourAjout(sousMenu.menuId);
    setDialogSousMenuOuvert(true);
  };

  const demanderSuppressionSousMenu = (sousMenu) => {
    setConfirmation({ type: 'sousMenu', cible: sousMenu });
  };

  const apresSauvegardeMenu = () => {
    setDialogMenuOuvert(false);
    chargerMenus(recherche);
    enqueueSnackbar(menuEnEdition ? 'Menu mis à jour' : 'Menu créé', { variant: 'success' });
    // Le Dialog MUI restaure le focus sur le bouton déclencheur APRÈS sa fermeture ;
    // un blur() immédiat serait donc écrasé. On le déclenche après coup (setTimeout 0),
    // une fois que cette restauration de focus a eu lieu.
    setTimeout(() => boutonNouveauMenuRef.current?.blur(), 0);
  };

  const apresSauvegardeSousMenu = () => {
    setDialogSousMenuOuvert(false);
    chargerSousMenus(menuParentPourAjout);
    enqueueSnackbar(sousMenuEnEdition ? 'Sous-menu mis à jour' : 'Sous-menu créé', { variant: 'success' });
    setTimeout(() => document.activeElement?.blur(), 0);
  };

  return (
    <Box sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ py: 2, px: 0.5, mb: 1 }}>
        <Tooltip title="Retour aux modules" arrow>
          <IconButton
            size="small"
            onClick={() => navigate('/')}
            sx={{
              color: 'rgba(255,255,255,0.6)',
              transition: 'color 0.15s, background-color 0.15s',
              '&:hover': { color: '#FFFFFF', bgcolor: 'rgba(255,255,255,0.1)' },
            }}
          >
            <ArrowBackIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Box component="svg" viewBox="0 0 32 32" sx={{ width: 26, height: 26 }}>
          <rect x="3" y="3" width="12" height="12" rx="3" fill="#FFFFFF" opacity="0.95" />
          <rect x="17" y="3" width="12" height="12" rx="3" fill="#FFFFFF" opacity="0.55">
            <animate attributeName="opacity" values="0.35;0.85;0.35" dur="3.2s" repeatCount="indefinite" />
          </rect>
          <rect x="3" y="17" width="12" height="12" rx="3" fill="#FFFFFF" opacity="0.55">
            <animate attributeName="opacity" values="0.85;0.35;0.85" dur="3.2s" repeatCount="indefinite" />
          </rect>
          <rect x="17" y="17" width="12" height="12" rx="3" fill="#FFFFFF" opacity="0.95" />
        </Box>
      </Stack>

      <TextField
        sx={{
          mb: 1.5,
          '& .MuiOutlinedInput-root': {
            bgcolor: 'rgba(255,255,255,0.06)',
            color: 'white',
            borderRadius: 2,
            fontSize: '0.875rem',
            transition: 'background-color 0.15s',
          },
          '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.12)' },
          '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.24)' },
          '& .Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.5)' },
        }}
        size="small"
        placeholder="Rechercher un menu…"
        value={recherche}
        onChange={(e) => setRecherche(e.target.value)}
        name="recherche-menus"
        autoComplete="off"
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" sx={{ color: 'rgba(255,255,255,0.4)' }} />
              </InputAdornment>
            ),
            endAdornment: recherche ? (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  onClick={() => setRecherche('')}
                  sx={{ color: 'rgba(255,255,255,0.4)', '&:hover': { color: '#FFFFFF' } }}
                >
                  <ClearIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ) : null,
          },
        }}
        fullWidth
      />

      <Button
        startIcon={<AddIcon />}
        variant="contained"
        fullWidth
        onClick={ouvrirCreationMenu}
        ref={boutonNouveauMenuRef}
        sx={{
          mb: 2,
          bgcolor: 'rgba(255,255,255,0.1)',
          color: '#FFFFFF',
          transition: 'background-color 0.15s',
          '&:hover': { bgcolor: 'rgba(255,255,255,0.16)' },
        }}
      >
        Nouveau menu
      </Button>

      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          mx: -1,
          '&::-webkit-scrollbar': { width: 6 },
          '&::-webkit-scrollbar-thumb': {
            bgcolor: 'rgba(255,255,255,0.15)',
            borderRadius: 3,
          },
          '&::-webkit-scrollbar-thumb:hover': { bgcolor: 'rgba(255,255,255,0.25)' },
          '&::-webkit-scrollbar-track': { bgcolor: 'transparent' },
        }}
      >
        {chargementMenus ? (
          <Stack spacing={1} sx={{ px: 1 }}>
            {[...Array(4)].map((_, i) => (
              <Skeleton
                key={i}
                variant="rounded"
                height={40}
                sx={{ bgcolor: 'rgba(255,255,255,0.06)', borderRadius: 2 }}
              />
            ))}
          </Stack>
        ) : menus.length === 0 ? (
          <Fade in>
            <Box sx={{ px: 2, py: 4, textAlign: 'center' }}>
              <SearchIcon sx={{ fontSize: 28, color: 'rgba(255,255,255,0.15)', mb: 1 }} />
              <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>
                {recherche ? 'Aucun menu ne correspond' : 'Aucun menu pour le moment'}
              </Typography>
              {recherche && (
                <Button
                  size="small"
                  onClick={() => setRecherche('')}
                  sx={{ mt: 1, color: 'rgba(255,255,255,0.5)', textTransform: 'none' }}
                >
                  Effacer la recherche
                </Button>
              )}
            </Box>
          </Fade>
        ) : (
          <List dense sx={{ px: 1 }}>
            {menus.map((menu) => (
              <MenuItem
                key={menu.id}
                menu={menu}
                ouvert={Boolean(menusOuverts[menu.id])}
                sousMenus={sousMenusParMenu[menu.id] || []}
                sousMenuIdActif={sousMenuId}
                onToggle={() => basculerMenu(menu.id)}
                onEdit={ouvrirEditionMenu}
                onDelete={demanderSuppressionMenu}
                onAjouterSousMenu={ouvrirCreationSousMenu}
                onEditSousMenu={ouvrirEditionSousMenu}
                onDeleteSousMenu={demanderSuppressionSousMenu}
                onSelectSousMenu={(id) => navigate(`/modules/${moduleId}/sous-menus/${id}`)}
              />
            ))}
          </List>
        )}
      </Box>

      <MenuFormDialog
        ouvert={dialogMenuOuvert}
        menu={menuEnEdition}
        moduleId={moduleId}
        onFermer={() => setDialogMenuOuvert(false)}
        onSauvegarde={apresSauvegardeMenu}
      />

      <SousMenuFormDialog
        ouvert={dialogSousMenuOuvert}
        sousMenu={sousMenuEnEdition}
        menuId={menuParentPourAjout}
        onFermer={() => setDialogSousMenuOuvert(false)}
        onSauvegarde={apresSauvegardeSousMenu}
      />
      <ConfirmDialog
        ouvert={Boolean(confirmation)}
        titre={confirmation?.type === 'menu' ? 'Supprimer ce menu ?' : 'Supprimer ce sous-menu ?'}
        message={
          confirmation?.type === 'menu'
            ? 'Ce menu et tous ses sous-menus seront supprimés définitivement.'
            : 'Ce sous-menu et toutes ses images seront supprimés définitivement.'
        }
        onConfirmer={confirmerSuppression}
        onAnnuler={() => setConfirmation(null)}
      />
    </Box>
  );
}

export default Sidebar;