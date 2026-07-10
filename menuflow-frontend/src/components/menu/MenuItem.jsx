// src/components/menu/MenuItem.jsx
import { Box, ListItemButton, ListItemText, IconButton, Collapse, List, Divider } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SousMenuItem from '../sousMenu/SousMenuItem.jsx';

function MenuItem({
  menu,
  ouvert,
  sousMenus,
  sousMenuIdActif,
  onToggle,
  onEdit,
  onDelete,
  onAjouterSousMenu,
  onEditSousMenu,
  onDeleteSousMenu,
  onSelectSousMenu,
}) {
  return (
    <Box>
      <ListItemButton onClick={onToggle}>
        <ListItemText primary={menu.nom} />
        <IconButton size="small" onClick={(e) => { e.stopPropagation(); onEdit(menu); }}>
          <EditIcon fontSize="small" />
        </IconButton>
        <IconButton size="small" onClick={(e) => { e.stopPropagation(); onDelete(menu); }}>
          <DeleteIcon fontSize="small" />
        </IconButton>
        {ouvert ? <ExpandLessIcon /> : <ExpandMoreIcon />}
      </ListItemButton>

      <Collapse in={ouvert} timeout="auto" unmountOnExit>
        <List component="div" disablePadding dense>
          {sousMenus.map((sousMenu) => (
            <SousMenuItem
              key={sousMenu.id}
              sousMenu={sousMenu}
              selectionne={sousMenuIdActif === String(sousMenu.id)}
              onSelect={() => onSelectSousMenu(sousMenu.id)}
              onEdit={() => onEditSousMenu(sousMenu)}
              onDelete={() => onDeleteSousMenu(sousMenu)}
            />
          ))}
          <ListItemButton sx={{ pl: 4 }} onClick={() => onAjouterSousMenu(menu.id)}>
            <AddIcon fontSize="small" sx={{ mr: 1 }} />
            <ListItemText primary="Nouveau sous-menu" />
          </ListItemButton>
        </List>
      </Collapse>
      <Divider />
    </Box>
  );
}

export default MenuItem;