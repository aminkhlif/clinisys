// src/components/layout/Sidebar.jsx
import { useEffect, useState } from 'react';
import {
  Box, TextField, InputAdornment, List, Button, Stack, Typography
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate, useParams } from 'react-router-dom';
import axiosClient from '../../api/axiosClient.js';
import MenuFormDialog from '../menu/MenuFormDialog.jsx';
import SousMenuFormDialog from '../sousMenu/SousMenuFormDialog.jsx';
import MenuItem from '../menu/MenuItem.jsx';
import ConfirmDialog from '../common/ConfirmDialog.jsx';
function Sidebar() {
  const [confirmation, setConfirmation] = useState(null);
  // confirmation = { type: 'menu' | 'sousMenu', cible: menu|sousMenu } ou null
  const [menus, setMenus] = useState([]);
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
    const params = termeRecherche ? { recherche: termeRecherche } : {};
    const res = await axiosClient.get('/menus', { params });
    setMenus(res.data);
  };

  const chargerSousMenus = async (menuId) => {
    const res = await axiosClient.get('/sous-menus', { params: { menuId } });
    setSousMenusParMenu((prev) => ({ ...prev, [menuId]: res.data }));
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
    if (confirmation.type === 'menu') {
      await axiosClient.delete(`/menus/${confirmation.cible.id}`);
      chargerMenus(recherche);
    } else if (confirmation.type === 'sousMenu') {
      const sousMenu = confirmation.cible;
      await axiosClient.delete(`/sous-menus/${sousMenu.id}`);
      chargerSousMenus(sousMenu.menuId);
      if (sousMenuId === String(sousMenu.id)) {
        navigate('/');
      }
    }
    setConfirmation(null);
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
  };

  const apresSauvegardeSousMenu = () => {
    setDialogSousMenuOuvert(false);
    chargerSousMenus(menuParentPourAjout);
  };

  return (
    
    <Box sx={{ p: 2 }}>
      <Box sx={{ py: 3, px: 2, textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', mb: 2 }}>
        <Typography variant="h6" sx={{ color: '#FFFFFF', fontWeight: 700, letterSpacing: 1 }}>
          MENUFLOW
        </Typography>
      </Box>
      <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <TextField sx={{
  '& .MuiOutlinedInput-root': { bgcolor: 'rgba(255,255,255,0.08)', color: 'white', borderRadius: 2 },
  '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' },
}}
          size="small"
          placeholder="Rechercher un menu..."
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
          fullWidth
        />
      </Stack>

      <Button startIcon={<AddIcon />} variant="contained" fullWidth onClick={ouvrirCreationMenu} sx={{ mb: 2 }}>
        Nouveau menu
      </Button>

      <List dense>
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