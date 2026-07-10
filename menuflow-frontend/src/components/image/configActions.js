// src/components/image/configActions.js
export const CONFIG_ACTIONS = {
  FLOU: { label: 'Flou', largeurDefaut: 100, hauteurDefaut: 100, couleur: false, intensite: true, couleurAffichage: 'rgba(59,130,246,0.35)' },
  RECTANGLE: { label: 'Rectangle', largeurDefaut: 120, hauteurDefaut: 80, couleur: true, intensite: false, couleurDefaut: '#FF0000' },
  FOCUS: { label: 'Focus', largeurDefaut: 150, hauteurDefaut: 100, couleur: false, intensite: false, couleurAffichage: 'rgba(0,0,0,0.4)' },
  CURSEUR_STATIQUE: { label: 'Curseur statique', largeurDefaut: 40, hauteurDefaut: 40, couleur: true, intensite: false, couleurDefaut: '#3B82F6' },
  CURSEUR_STATIQUE_BLANC: { label: 'Curseur statique blanc', largeurDefaut: 40, hauteurDefaut: 40, couleur: false, intensite: false, couleurAffichage: '#FFFFFF' },
  CURSEUR_CLICK: { label: 'Curseur click', largeurDefaut: 40, hauteurDefaut: 40, couleur: true, intensite: false, couleurDefaut: '#3B82F6' },
};

export const LISTE_ACTIONS = Object.keys(CONFIG_ACTIONS);