// src/components/module/ModuleCard.jsx
import { Card, CardActionArea, Box, Typography, IconButton, Stack, Chip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import WidgetsOutlinedIcon from '@mui/icons-material/WidgetsOutlined';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

function ModuleCard({ module, onOuvrir, onEdit, onDelete, misEnAvant = false }) {
  const estVide = module.nombreMenus === 0;

  return (
    <Card
      sx={{
        position: 'relative',
        height: 148,
        display: 'flex',
        flexDirection: 'column',
        transition: 'border-color 160ms ease, box-shadow 160ms ease, transform 160ms ease',
        ...(misEnAvant && {
          borderColor: 'grey.900',
          boxShadow: '0 0 0 3px rgba(18,18,18,0.08)',
        }),
        '&:hover': {
          borderColor: 'grey.400',
          transform: 'translateY(-2px)',
          boxShadow: '0 8px 20px rgba(0,0,0,0.06)',
        },
        '&:hover .fleche': { opacity: 1, transform: 'translateX(0)' },
        '& .row-actions': { opacity: 0 },
        '&:hover .row-actions': { opacity: 1 },
      }}
    >
      <CardActionArea onClick={onOuvrir} sx={{ p: 2.25, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
        <Stack direction="row" alignItems="flex-start" justifyContent="space-between">
          <Box
            sx={{
              width: 38,
              height: 38,
              borderRadius: 2,
              bgcolor: estVide ? 'grey.300' : 'grey.900',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <WidgetsOutlinedIcon sx={{ color: '#FFFFFF', fontSize: 19 }} />
          </Box>
          <ChevronRightIcon
            className="fleche"
            sx={{ color: 'grey.400', opacity: 0, transform: 'translateX(-4px)', transition: 'all 160ms ease' }}
          />
        </Stack>

        <Box sx={{ flex: 1, minHeight: 0, mt: 1.25, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <Typography
            variant="subtitle1"
            title={module.nom}
            sx={{
              mb: 0.5,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              color: estVide ? 'text.secondary' : 'text.primary',
            }}
          >
            {module.nom}
          </Typography>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {module.nombreMenus != null ? `${module.nombreMenus} menu${module.nombreMenus > 1 ? 's' : ''}` : 'Voir les menus'}
            </Typography>
            {estVide && (
              <Chip
                size="small"
                label="Vide"
                sx={{ height: 18, fontSize: '0.65rem', bgcolor: 'grey.100', color: 'text.secondary' }}
              />
            )}
          </Stack>
        </Box>
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