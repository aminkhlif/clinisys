// src/components/sousMenu/SousMenuItem.jsx
import { ListItemButton, ListItemText, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

function SousMenuItem({ sousMenu, selectionne, onSelect, onEdit, onDelete }) {
  return (
   <ListItemButton
  sx={{
    pl: 4,
    borderRadius: 2,
    mx: 1,
    '&.Mui-selected': {
      bgcolor: '#1DC7EA',
      '&:hover': { bgcolor: '#17b3d4' },
    },
  }}
  selected={selectionne}
  onClick={onSelect}
>
      <ListItemText  sx={{ '& .MuiListItemText-primary': { color: 'rgba(255,255,255,0.85)' } }} primary={sousMenu.nom} />
      <IconButton sx={{ color: 'rgba(255,255,255,0.6)' }} size="small" onClick={(e) => { e.stopPropagation(); onEdit(); }}>
        <EditIcon fontSize="small" />
      </IconButton>
      <IconButton sx={{ color: 'rgba(255,255,255,0.6)' }} size="small" onClick={(e) => { e.stopPropagation(); onDelete(); }}>
        <DeleteIcon fontSize="small" />
      </IconButton>
    </ListItemButton>
  );
}

export default SousMenuItem;