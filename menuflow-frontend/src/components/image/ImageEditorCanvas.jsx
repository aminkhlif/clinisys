// src/components/image/ImageEditorCanvas.jsx
import { useCallback, useEffect, useRef, useState } from 'react';
import { Box, IconButton, Stack, Tooltip, CircularProgress } from '@mui/material';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import ZoomOutMapIcon from '@mui/icons-material/ZoomOutMap';
import ActionOverlay from './ActionOverlay.jsx';

const NIVEAUX_ZOOM = [0.5, 0.75, 1, 1.25, 1.5, 2];

function ImageEditorCanvas({
  urlImage, actions, onDeplace, onRedimensionne, onSupprime,
  actionSelectionneeId, onSelectionnerAction, maxHeight = 420, onDimensionsChargees,
}) {
  const imgRef = useRef(null);
  const conteneurRef = useRef(null);
  const [dimensionsNaturelles, setDimensionsNaturelles] = useState({ largeur: 0, hauteur: 0 });
  const [largeurDisponible, setLargeurDisponible] = useState(0);
  const [zoom, setZoom] = useState(1); // 1 = "ajusté au cadre"
  const [chargementImage, setChargementImage] = useState(true);

  // Largeur réellement disponible pour le canvas (recalculée au montage et au resize)
  useEffect(() => {
    const recalculerLargeur = () => {
      if (conteneurRef.current) {
        setLargeurDisponible(conteneurRef.current.clientWidth);
      }
    };
    recalculerLargeur();
    window.addEventListener('resize', recalculerLargeur);
    return () => window.removeEventListener('resize', recalculerLargeur);
  }, []);

  useEffect(() => {
    setChargementImage(true);
    setZoom(1);
  }, [urlImage]);

  const gererChargementImage = useCallback((e) => {
    const dims = {
      largeur: e.target.naturalWidth,
      hauteur: e.target.naturalHeight,
    };
    setDimensionsNaturelles(dims);
    setChargementImage(false);
    onDimensionsChargees?.(dims);
  }, [onDimensionsChargees]);

  // Échelle réelle et unique source de vérité pour positionner les annotations :
  // "ajusté" (zoom=1) = l'image occupe toute la largeur disponible, plafonnée par maxHeight.
  // Le zoom multiplie ensuite cette base — jamais de distorsion, jamais de désalignement.
  const echelleAjustee = dimensionsNaturelles.largeur > 0
    ? Math.min(
        largeurDisponible / dimensionsNaturelles.largeur,
        typeof maxHeight === 'number' ? maxHeight / dimensionsNaturelles.hauteur : Infinity,
      )
    : 1;
  const echelle = echelleAjustee * zoom;

  const largeurAffichee = dimensionsNaturelles.largeur * echelle;
  const hauteurAffichee = dimensionsNaturelles.hauteur * echelle;

  const zoomer = (sens) => {
    const indexActuel = NIVEAUX_ZOOM.reduce(
      (plusProche, val, i) => (Math.abs(val - zoom) < Math.abs(NIVEAUX_ZOOM[plusProche] - zoom) ? i : plusProche),
      0,
    );
    const nouvelIndex = Math.min(Math.max(indexActuel + sens, 0), NIVEAUX_ZOOM.length - 1);
    setZoom(NIVEAUX_ZOOM[nouvelIndex]);
  };

  // Suppression au clavier de l'annotation sélectionnée (Suppr / Retour arrière),
  // désélection avec Échap.
  useEffect(() => {
    const gererClavier = (e) => {
      const cible = e.target;
      const estDansUnChamp = cible.tagName === 'INPUT' || cible.tagName === 'TEXTAREA';
      if (estDansUnChamp) return;

      if ((e.key === 'Delete' || e.key === 'Backspace') && actionSelectionneeId) {
        e.preventDefault();
        onSupprime(actionSelectionneeId);
      } else if (e.key === 'Escape') {
        onSelectionnerAction(null);
      }
    };
    window.addEventListener('keydown', gererClavier);
    return () => window.removeEventListener('keydown', gererClavier);
  }, [actionSelectionneeId, onSupprime, onSelectionnerAction]);

  return (
    <Box>
      <Stack direction="row" alignItems="center" justifyContent="flex-end" spacing={0.5} sx={{ mb: 1 }}>
        <Tooltip title="Zoom arrière">
          <span>
            <IconButton size="small" onClick={() => zoomer(-1)} disabled={zoom <= NIVEAUX_ZOOM[0]}>
              <ZoomOutIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
        <Box
          component="button"
          onClick={() => setZoom(1)}
          sx={{
            border: 'none', bgcolor: 'transparent', cursor: 'pointer', fontSize: '0.75rem',
            color: 'text.secondary', fontWeight: 600, minWidth: 44, fontFamily: 'inherit',
            '&:hover': { color: 'text.primary' },
          }}
        >
          {Math.round(zoom * 100)}%
        </Box>
        <Tooltip title="Zoom avant">
          <span>
            <IconButton size="small" onClick={() => zoomer(1)} disabled={zoom >= NIVEAUX_ZOOM[NIVEAUX_ZOOM.length - 1]}>
              <ZoomInIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
        <Tooltip title="Ajuster au cadre">
          <IconButton size="small" onClick={() => setZoom(1)}>
            <ZoomOutMapIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Stack>

      <Box
        ref={conteneurRef}
        sx={{
          position: 'relative',
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'divider',
          bgcolor: 'grey.50',
          overflow: 'auto',
          maxHeight: typeof maxHeight === 'number' ? maxHeight + 2 : maxHeight,
        }}
        onMouseDown={(e) => { if (e.target === e.currentTarget) onSelectionnerAction(null); }}
        onDragStart={(e) => e.preventDefault()}
      >
        {chargementImage && (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 240 }}>
            <CircularProgress size={22} sx={{ color: 'grey.400' }} />
          </Box>
        )}
        <Box
          sx={{
            position: 'relative',
            width: largeurAffichee || '100%',
            height: hauteurAffichee || 'auto',
            mx: 'auto',
            display: chargementImage ? 'none' : 'block',
          }}
        >
          <Box
            component="img"
            ref={imgRef}
            src={urlImage}
            alt="édition"
            onLoad={gererChargementImage}
            draggable={false}
            onDragStart={(e) => e.preventDefault()}
            sx={{
              width: '100%',
              height: '100%',
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
              limites={dimensionsNaturelles}
              selectionnee={actionSelectionneeId === action.id}
              onSelect={() => onSelectionnerAction(action.id)}
              onDeplace={onDeplace}
              onRedimensionne={onRedimensionne}
              onSupprime={onSupprime}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
}

export default ImageEditorCanvas;