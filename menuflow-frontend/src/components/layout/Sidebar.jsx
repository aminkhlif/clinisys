// src/components/layout/Sidebar.jsx
import { useEffect, useState } from 'react';
import {
  Box, TextField, InputAdornment, List, Button, Stack, Typography, Skeleton,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate, useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import axiosClient from '../../api/axiosClient.js';
import MenuFormDialog from '../menu/MenuFormDialog.jsx';
import SousMenuFormDialog from '../sousMenu/SousMenuFormDialog.jsx';
import MenuItem from '../menu/MenuItem.jsx';
import ConfirmDialog from '../common/ConfirmDialog.jsx';

function Sidebar() {
  const { enqueueSnackbar } = useSnackbar();
  const [confirmation, setConfirmation] = useState(null);
  const [menus, setMenus] = useState([]);
  const [chargementMenus, setChargementMenus] = useState(true);
  const [sousMenusParMenu, setSousMenusParMenu] = useState({});
  const [menusOuverts, setMenusOuverts] = useState({});
  const [recherche, setRecherche] = useState('');

  const [dialogMenuOuvert, setDialogMenuOuvert] = useState(false);
  const [menuEnEdition, setMenuEnEdition] = useState(null);

  const [dialogSousMenuOuvert, setDialogSousMenuOuvert] = useState(false);
  const [sousMenuEnEdition, setSousMenuEnEdition] = useState(null);
  const [menuParentPourAjout, setMenuParentPourAjout] = useState(null);

  const navigate = useNavigate();
  const { sousMenuId } = useParams();

  const chargerMenus = async (termeRecherche = '') => {
    try {
      const params = termeRecherche ? { recherche: termeRecherche } : {};
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
    chargerMenus();
  }, []);

  useEffect(() => {
    const delai = setTimeout(() => {
      chargerMenus(recherche);
    }, 300);
    return () => clearTimeout(delai);
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
          navigate('/');
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
  };

  const apresSauvegardeSousMenu = () => {
    setDialogSousMenuOuvert(false);
    chargerSousMenus(menuParentPourAjout);
    enqueueSnackbar(sousMenuEnEdition ? 'Sous-menu mis à jour' : 'Sous-menu créé', { variant: 'success' });
  };

  return (
    <Box sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ py: 3, px: 1, mb: 1, display: 'flex', justifyContent: 'center' }}>
        <Box
          component="svg"
          viewBox="0 0 32 32"
          sx={{ width: 40, height: 40 }}
        >
          <rect x="3" y="3" width="12" height="12" rx="3" fill="#FFFFFF" opacity="0.95" />
          <rect
            x="17" y="3" width="12" height="12" rx="3" fill="#FFFFFF" opacity="0.55"
          >
            <animate attributeName="opacity" values="0.35;0.85;0.35" dur="3.2s" repeatCount="indefinite" />
          </rect>
          <rect
            x="3" y="17" width="12" height="12" rx="3" fill="#FFFFFF" opacity="0.55"
          >
            <animate attributeName="opacity" values="0.85;0.35;0.85" dur="3.2s" repeatCount="indefinite" />
          </rect>
          <rect x="17" y="17" width="12" height="12" rx="3" fill="#FFFFFF" opacity="0.95" />
        </Box>
      </Box>

      <TextField
        sx={{
          mb: 1.5,
          '& .MuiOutlinedInput-root': {
            bgcolor: 'rgba(255,255,255,0.06)',
            color: 'white',
            borderRadius: 2,
            fontSize: '0.875rem',
          },
          '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.12)' },
          '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.24)' },
          '& .Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.5)' },
        }}
        size="small"
        placeholder="Rechercher un menu…"
        value={recherche}
        onChange={(e) => setRecherche(e.target.value)}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" sx={{ color: 'rgba(255,255,255,0.4)' }} />
              </InputAdornment>
            ),
          },
        }}
        fullWidth
      />

      <Button
        startIcon={<AddIcon />}
        variant="contained"
        fullWidth
        onClick={ouvrirCreationMenu}
        sx={{
          mb: 2,
          bgcolor: 'rgba(255,255,255,0.1)',
          color: '#FFFFFF',
          '&:hover': { bgcolor: 'rgba(255,255,255,0.16)' },
        }}
      >
        Nouveau menu
      </Button>

      <Box sx={{ flex: 1, overflowY: 'auto', mx: -1 }}>
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
          <Box sx={{ px: 2, py: 4, textAlign: 'center' }}>
            <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>
              {recherche ? 'Aucun menu ne correspond' : 'Aucun menu pour le moment'}
            </Typography>
          </Box>
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
                onSelectSousMenu={(id) => navigate(`/sous-menus/${id}`)}
              />
            ))}
          </List>
        )}
      </Box>

      <MenuFormDialog
        ouvert={dialogMenuOuvert}
        menu={menuEnEdition}
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