// src/components/sousMenu/SousMenuItem.jsx
import { ListItemButton, ListItemText, IconButton, Stack } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

function SousMenuItem({ sousMenu, selectionne, onSelect, onEdit, onDelete }) {
  return (
    <ListItemButton
      sx={{
        pl: 4,
        borderRadius: 2,
        mb: 0.25,
        color: selectionne ? '#0A0A0A' : 'rgba(255,255,255,0.65)',
        bgcolor: selectionne ? '#FFFFFF' : 'transparent',
        '&:hover': {
          bgcolor: selectionne ? '#FFFFFF' : 'rgba(255,255,255,0.06)',
        },
        '&.Mui-selected': {
          bgcolor: '#FFFFFF',
          '&:hover': { bgcolor: '#FFFFFF' },
        },
        '& .row-actions': { opacity: 0 },
        '&:hover .row-actions': { opacity: 1 },
      }}
      selected={selectionne}
      onClick={onSelect}
    >
      <ListItemText
        primary={sousMenu.nom}
        slotProps={{ primary: { sx: { fontSize: '0.825rem', fontWeight: selectionne ? 600 : 500 } } }}
      />
      <Stack direction="row" className="row-actions" sx={{ transition: 'opacity 120ms ease' }}>
        <IconButton
          size="small"
          onClick={(e) => { e.stopPropagation(); onEdit(); }}
          sx={{
            color: selectionne ? 'rgba(10,10,10,0.5)' : 'rgba(255,255,255,0.5)',
            '&:hover': { bgcolor: selectionne ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.1)' },
          }}
        >
          <EditIcon fontSize="small" />
        </IconButton>
        <IconButton
          size="small"
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          sx={{
            color: selectionne ? 'rgba(10,10,10,0.5)' : 'rgba(255,255,255,0.5)',
            '&:hover': { bgcolor: selectionne ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.1)' },
          }}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Stack>
    </ListItemButton>
  );
}

export default SousMenuItem;