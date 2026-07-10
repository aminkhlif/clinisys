// src/components/image/ImageEditorCanvas.jsx
import { useEffect, useRef, useState } from 'react';
import { Box } from '@mui/material';
import ActionOverlay from './ActionOverlay.jsx';

function ImageEditorCanvas({ urlImage, actions, onDeplace, onRedimensionne, onSupprime }) {
  const imgRef = useRef(null);
  const [echelle, setEchelle] = useState(1);
  const [dimensions, setDimensions] = useState({ largeur: 0, hauteur: 0 });
  const [actionSelectionnee, setActionSelectionnee] = useState(null);

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
      sx={{ position: 'relative', display: 'inline-block', maxWidth: '100%' }}
      onMouseDown={() => setActionSelectionnee(null)}
    >
      <Box
        component="img"
        ref={imgRef}
        src={urlImage}
        alt="édition"
        onLoad={recalculerEchelle}
        sx={{ width: '100%', maxHeight: 400, display: 'block', border: '1px solid #eee' }}
      />
      {actions.map((action) => (
        <ActionOverlay
          key={action.id}
          action={action}
          echelle={echelle}
          limites={dimensions}
          selectionnee={actionSelectionnee === action.id}
          onSelect={() => setActionSelectionnee(action.id)}
          onDeplace={onDeplace}
          onRedimensionne={onRedimensionne}
          onSupprime={onSupprime}
        />
      ))}
    </Box>
  );
}

export default ImageEditorCanvas;