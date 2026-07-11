// src/components/menu/MenuItem.jsx
import { Box, ListItemButton, ListItemText, IconButton, Collapse, List, Stack } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
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
    <Box sx={{ mb: 0.5 }}>
      <ListItemButton
        onClick={onToggle}
        sx={{
          color: 'rgba(255,255,255,0.85)',
          '&:hover': { bgcolor: 'rgba(255,255,255,0.06)' },
          '& .row-actions': { opacity: 0 },
          '&:hover .row-actions': { opacity: 1 },
        }}
      >
        <ListItemText
          primary={menu.nom}
          slotProps={{ primary: { sx: { fontWeight: 600, fontSize: '0.875rem' } } }}
        />
        <Stack direction="row" className="row-actions" sx={{ transition: 'opacity 120ms ease' }}>
          <IconButton
            size="small"
            onClick={(e) => { e.stopPropagation(); onEdit(menu); }}
            sx={{ color: 'rgba(255,255,255,0.5)', '&:hover': { color: '#FFFFFF', bgcolor: 'rgba(255,255,255,0.1)' } }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            onClick={(e) => { e.stopPropagation(); onDelete(menu); }}
            sx={{ color: 'rgba(255,255,255,0.5)', '&:hover': { color: '#FFFFFF', bgcolor: 'rgba(255,255,255,0.1)' } }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Stack>
        <ExpandMoreIcon
          fontSize="small"
          sx={{
            color: 'rgba(255,255,255,0.4)',
            transform: ouvert ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 160ms ease',
            ml: 0.5,
          }}
        />
      </ListItemButton>

      <Collapse in={ouvert} timeout={180} unmountOnExit>
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
          <ListItemButton
            sx={{
              pl: 4,
              color: 'rgba(255,255,255,0.4)',
              '&:hover': { color: 'rgba(255,255,255,0.8)', bgcolor: 'rgba(255,255,255,0.06)' },
            }}
            onClick={() => onAjouterSousMenu(menu.id)}
          >
            <AddIcon fontSize="small" sx={{ mr: 1 }} />
            <ListItemText
              primary="Nouveau sous-menu"
              slotProps={{ primary: { sx: { fontSize: '0.8rem' } } }}
            />
          </ListItemButton>
        </List>
      </Collapse>
    </Box>
  );
}

export default MenuItem;