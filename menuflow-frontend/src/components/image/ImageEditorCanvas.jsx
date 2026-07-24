// src/components/image/ImageEditorCanvas.jsx
import { useEffect, useRef, useState } from 'react';
import { Box } from '@mui/material';
import ActionOverlay from './ActionOverlay.jsx';

function ImageEditorCanvas({
  urlImage, actions, onDeplace, onRedimensionne, onSupprime,
  actionSelectionneeId, onSelectionnerAction, maxHeight = 420,
}) {
  const imgRef = useRef(null);
  const [echelle, setEchelle] = useState(1);
  const [dimensions, setDimensions] = useState({ largeur: 0, hauteur: 0 });

  const recalculerEchelle = () => {
    if (imgRef.current && imgRef.current.naturalWidth) {
      setEchelle(imgRef.current.clientWidth / imgRef.current.naturalWidth);
      setDimensions({
        largeur: imgRef.current.naturalWidth,
        hauteur: imgRef.current.naturalHeight,
      });
    }
  };

  useEffect(() => {
    recalculerEchelle();
    window.addEventListener('resize', recalculerEchelle);
    return () => window.removeEventListener('resize', recalculerEchelle);
  }, [urlImage]);

  return (
    <Box
      sx={{
        position: 'relative',
        display: 'inline-block',
        maxWidth: '100%',
        borderRadius: 2,
        overflow: 'hidden',
        border: '1px solid',
        borderColor: 'divider',
        bgcolor: 'grey.50',
      }}
      onMouseDown={() => onSelectionnerAction(null)}
      onDragStart={(e) => e.preventDefault()}
    >
      <Box
        component="img"
        ref={imgRef}
        src={urlImage}
        alt="édition"
        onLoad={recalculerEchelle}
        draggable={false}
        onDragStart={(e) => e.preventDefault()}
        sx={{
          width: '100%',
          maxHeight,
          display: 'block',
          userSelect: 'none',
          WebkitUserDrag: 'none',
          pointerEvents: 'none',
        }}
      />
      {actions.map((action) => (
        <ActionOverlay
          key={action.id}
          action={action}
          echelle={echelle}
          limites={dimensions}
          selectionnee={actionSelectionneeId === action.id}
          onSelect={() => onSelectionnerAction(action.id)}
          onDeplace={onDeplace}
          onRedimensionne={onRedimensionne}
          onSupprime={onSupprime}
        />
      ))}
    </Box>
  );
}

export default ImageEditorCanvas;