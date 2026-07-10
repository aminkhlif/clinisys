// src/components/image/ImageCard.jsx
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  Card, CardMedia, CardContent, CardActions, Checkbox, Typography, IconButton, Box,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import MovieFilterIcon from '@mui/icons-material/MovieFilter';

function ImageCard({ image, selectionnee, onBasculerSelection, onOuvrirDetail, onOuvrirActions }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: image.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: 'grab',
  };

  const urlImage = `data:${image.typeContenu};base64,${image.donneesBase64}`;

  return (
    <Card ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Box sx={{ position: 'relative' }}>
        <Checkbox
          checked={selectionnee}
          onClick={(e) => { e.stopPropagation(); onBasculerSelection(); }}
          onPointerDown={(e) => e.stopPropagation()}
          sx={{ position: 'absolute', top: 4, left: 4, bgcolor: 'rgba(255,255,255,0.85)', borderRadius: 1 }}
        />
        <CardMedia component="img" height="140" image={urlImage} alt={image.nom} />
      </Box>
      <CardContent sx={{ py: 1 }}>
        <Typography variant="body2" noWrap sx={{ color: '#2C2C2C', fontWeight: 500 }}>
          {image.nom}
        </Typography>
      </CardContent>
      <CardActions sx={{ justifyContent: 'flex-end' }} onPointerDown={(e) => e.stopPropagation()}>
        <IconButton size="small" onClick={onOuvrirDetail}>
          <VisibilityIcon fontSize="small" sx={{ color: '#1DC7EA' }} />
        </IconButton>
        <IconButton size="small" onClick={onOuvrirActions}>
          <MovieFilterIcon fontSize="small" sx={{ color: '#FB404B' }} />
        </IconButton>
      </CardActions>
    </Card>
  );
}

export default ImageCard;