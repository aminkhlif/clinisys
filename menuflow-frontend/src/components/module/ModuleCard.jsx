// src/components/module/ModuleCard.jsx
import { Card, CardActionArea, Box, Typography, IconButton, Stack } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import WidgetsOutlinedIcon from '@mui/icons-material/WidgetsOutlined';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

function ModuleCard({ module, onOuvrir, onEdit, onDelete }) {
  return (
    <Card
      sx={{
        position: 'relative',
        '&:hover': { borderColor: 'grey.400', transform: 'translateY(-2px)' },
        '&:hover .fleche': { opacity: 1, transform: 'translateX(0)' },
        '& .row-actions': { opacity: 0 },
        '&:hover .row-actions': { opacity: 1 },
      }}
    >
      <CardActionArea onClick={onOuvrir} sx={{ p: 2.5, height: '100%' }}>
        <Stack direction="row" alignItems="flex-start" justifyContent="space-between">
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 2,
              bgcolor: 'grey.900',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <WidgetsOutlinedIcon sx={{ color: '#FFFFFF', fontSize: 20 }} />
          </Box>
          <ChevronRightIcon
            className="fleche"
            sx={{ color: 'grey.400', opacity: 0, transform: 'translateX(-4px)', transition: 'all 160ms ease' }}
          />
        </Stack>

        <Typography variant="subtitle1" sx={{ mt: 2, mb: 0.5 }}>
          {module.nom}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {module.nombreMenus != null ? `${module.nombreMenus} menu${module.nombreMenus > 1 ? 's' : ''}` : 'Voir les menus'}
        </Typography>
      </CardActionArea>

      <Stack
        direction="row"
        className="row-actions"
        sx={{ position: 'absolute', top: 8, right: 8, transition: 'opacity 140ms ease' }}
      >
        <IconButton
          size="small"
          onClick={(e) => { e.stopPropagation(); onEdit(); }}
          sx={{ bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider' }}
        >
          <EditIcon fontSize="small" />
        </IconButton>
        <IconButton
          size="small"
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          sx={{ bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', ml: 0.5 }}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Stack>
    </Card>
  );
}

export default ModuleCard;