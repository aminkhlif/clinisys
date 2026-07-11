// src/components/image/ActionOverlay.jsx
import { useRef } from 'react';
import { Box, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { CONFIG_ACTIONS } from './configActions.js';

function ActionOverlay({ action, echelle, limites, selectionnee, onSelect, onDeplace, onRedimensionne, onSupprime }) {
  const dragRef = useRef(null);
  const config = CONFIG_ACTIONS[action.type];

  const gererDebutDrag = (e) => {
    e.stopPropagation();
    onSelect();
    const xDepart = e.clientX;
    const yDepart = e.clientY;
    const xInitial = action.x;
    const yInitial = action.y;
    const xMax = Math.max(0, limites.largeur - action.largeur);
    const yMax = Math.max(0, limites.hauteur - action.hauteur);

    const gererMouvement = (moveEvent) => {
      const deltaX = (moveEvent.clientX - xDepart) / echelle;
      const deltaY = (moveEvent.clientY - yDepart) / echelle;
      const nouveauX = Math.min(Math.max(0, Math.round(xInitial + deltaX)), xMax);
      const nouveauY = Math.min(Math.max(0, Math.round(yInitial + deltaY)), yMax);
      onDeplace(action.id, nouveauX, nouveauY, false);
    };

    const gererFin = (upEvent) => {
      const deltaX = (upEvent.clientX - xDepart) / echelle;
      const deltaY = (upEvent.clientY - yDepart) / echelle;
      const nouveauX = Math.min(Math.max(0, Math.round(xInitial + deltaX)), xMax);
      const nouveauY = Math.min(Math.max(0, Math.round(yInitial + deltaY)), yMax);
      onDeplace(action.id, nouveauX, nouveauY, true);
      document.removeEventListener('mousemove', gererMouvement);
      document.removeEventListener('mouseup', gererFin);
    };

    document.addEventListener('mousemove', gererMouvement);
    document.addEventListener('mouseup', gererFin);
  };

  const gererDebutResize = (e) => {
    e.stopPropagation();
    const xDepart = e.clientX;
    const yDepart = e.clientY;
    const largeurInitiale = action.largeur;
    const hauteurInitiale = action.hauteur;
    const largeurMax = limites.largeur - action.x;
    const hauteurMax = limites.hauteur - action.y;

    const gererMouvement = (moveEvent) => {
      const deltaX = (moveEvent.clientX - xDepart) / echelle;
      const deltaY = (moveEvent.clientY - yDepart) / echelle;
      const nouvelleLargeur = Math.min(Math.max(10, Math.round(largeurInitiale + deltaX)), largeurMax);
      const nouvelleHauteur = Math.min(Math.max(10, Math.round(hauteurInitiale + deltaY)), hauteurMax);
      onRedimensionne(action.id, nouvelleLargeur, nouvelleHauteur, false);
    };

    const gererFin = (upEvent) => {
      const deltaX = (upEvent.clientX - xDepart) / echelle;
      const deltaY = (upEvent.clientY - yDepart) / echelle;
      const nouvelleLargeur = Math.min(Math.max(10, Math.round(largeurInitiale + deltaX)), largeurMax);
      const nouvelleHauteur = Math.min(Math.max(10, Math.round(hauteurInitiale + deltaY)), hauteurMax);
      onRedimensionne(action.id, nouvelleLargeur, nouvelleHauteur, true);
      document.removeEventListener('mousemove', gererMouvement);
      document.removeEventListener('mouseup', gererFin);
    };

    document.addEventListener('mousemove', gererMouvement);
    document.addEventListener('mouseup', gererFin);
  };

  const couleurFond = config.couleur
    ? (action.couleur || config.couleurDefaut)
    : config.couleurAffichage;

  const estCurseur = action.type.startsWith('CURSEUR');
  const estRectangleOuFocus = action.type === 'RECTANGLE' || action.type === 'FOCUS';

  return (
    <Box
      ref={dragRef}
      onMouseDown={gererDebutDrag}
      sx={{
        position: 'absolute',
        left: action.x * echelle,
        top: action.y * echelle,
        width: action.largeur * echelle,
        height: action.hauteur * echelle,
        border: selectionnee ? '2px dashed #121212' : '1px solid rgba(0,0,0,0.25)',
        backgroundColor: estRectangleOuFocus ? 'transparent' : (action.type === 'FLOU' ? couleurFond : 'transparent'),
        outline: estRectangleOuFocus ? `3px solid ${couleurFond}` : 'none',
        borderRadius: estCurseur ? '50%' : 0,
        cursor: 'move',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {estCurseur && (
        <Box
          sx={{
            width: '60%',
            height: '60%',
            backgroundColor: couleurFond,
            clipPath: 'polygon(0 0, 0 80%, 30% 60%, 45% 100%, 65% 90%, 45% 55%, 80% 55%)',
          }}
        />
      )}

      {selectionnee && (
        <>
          <IconButton
            size="small"
            onClick={(e) => { e.stopPropagation(); onSupprime(action.id); }}
            sx={{
              position: 'absolute',
              top: -16,
              right: -16,
              bgcolor: '#FFFFFF',
              border: '1px solid',
              borderColor: 'divider',
              width: 24,
              height: 24,
              '&:hover': { bgcolor: 'grey.100' },
            }}
          >
            <CloseIcon sx={{ fontSize: 14, color: 'grey.900' }} />
          </IconButton>
          <Box
            onMouseDown={gererDebutResize}
            sx={{
              position: 'absolute',
              bottom: -6,
              right: -6,
              width: 14,
              height: 14,
              bgcolor: '#121212',
              border: '2px solid white',
              borderRadius: '50%',
              cursor: 'nwse-resize',
            }}
          />
        </>
      )}
    </Box>
  );
}

export default ActionOverlay;