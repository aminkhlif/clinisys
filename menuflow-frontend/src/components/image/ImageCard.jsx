// src/components/image/ImageCard.jsx
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  Card, CardMedia, CardContent, CardActions, Checkbox, Typography, IconButton, Box,
} from '@mui/material';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import TuneOutlinedIcon from '@mui/icons-material/TuneOutlined';

function ImageCard({ image, selectionnee, onBasculerSelection, onOuvrirDetail, onOuvrirActions }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: image.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
    cursor: 'grab',
  };

  const urlImage = `data:${image.typeContenu};base64,${image.donneesBase64}`;

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      sx={{
        outline: selectionnee ? '2px solid #121212' : 'none',
        outlineOffset: -1,
        '&:hover': { borderColor: 'grey.400' },
      }}
    >
      <Box sx={{ position: 'relative' }}>
        <Checkbox
          checked={selectionnee}
          onClick={(e) => { e.stopPropagation(); onBasculerSelection(); }}
          onPointerDown={(e) => e.stopPropagation()}
          sx={{
            position: 'absolute',
            top: 6,
            left: 6,
            bgcolor: 'rgba(255,255,255,0.9)',
            borderRadius: 1,
            p: 0.5,
            '&:hover': { bgcolor: 'rgba(255,255,255,1)' },
          }}
        />
        <CardMedia component="img" height="150" image={urlImage} alt={image.nom} sx={{ objectFit: 'cover' }} />
      </Box>
      <CardContent sx={{ py: 1, px: 1.5, '&:last-child': { pb: 1 } }}>
        <Typography variant="body2" noWrap sx={{ color: 'text.primary', fontWeight: 600 }}>
          {image.nom}
        </Typography>
      </CardContent>
      <CardActions sx={{ justifyContent: 'flex-end', px: 1, pb: 1, pt: 0 }} onPointerDown={(e) => e.stopPropagation()}>
        <IconButton size="small" onClick={onOuvrirDetail}>
          <VisibilityOutlinedIcon fontSize="small" />
        </IconButton>
        <IconButton size="small" onClick={onOuvrirActions}>
          <TuneOutlinedIcon fontSize="small" />
        </IconButton>
      </CardActions>
    </Card>
  );
}

export default ImageCard;