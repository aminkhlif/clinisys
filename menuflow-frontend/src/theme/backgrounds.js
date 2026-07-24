// src/theme/backgrounds.js
// Fond en grille de points, utilisé partout dans l'app pour une cohérence visuelle
// (initialement introduit dans MainLayout pour la zone de contenu des pages Sous-menu).
export const dotGridBackgroundSx = {
  backgroundImage: 'radial-gradient(circle, #DDDDDD 1px, transparent 1px)',
  backgroundSize: '22px 22px',
  backgroundPosition: '-11px -11px',
};

// Même motif, adapté aux fonds sombres (écrans de connexion / inscription)
export const dotGridBackgroundDarkSx = {
  backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.12) 1px, transparent 1px)',
  backgroundSize: '22px 22px',
  backgroundPosition: '-11px -11px',
};