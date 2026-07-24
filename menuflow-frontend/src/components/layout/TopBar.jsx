// src/components/layout/TopBar.jsx
// Bandeau d'en-tête UNIQUE, partagé par ModulesPage et MainLayout.
// Toute la logique de logo / fil d'ariane / menu utilisateur vit ici et
// UNIQUEMENT ici : il n'y a donc plus qu'un seul endroit à corriger si un
// jour l'alignement pose à nouveau problème.
import { Box, Breadcrumbs, Typography } from '@mui/material';
import UserMenu from '../auth/UserMenu.jsx';

function Logo({ size = 26, color = '#121212' }) {
  return (
    <Box component="svg" viewBox="0 0 32 32" sx={{ width: size, height: size, flexShrink: 0 }}>
      <rect x="3" y="3" width="12" height="12" rx="3" fill={color} opacity="0.95" />
      <rect x="17" y="3" width="12" height="12" rx="3" fill={color} opacity="0.55">
        <animate attributeName="opacity" values="0.35;0.85;0.35" dur="3.2s" repeatCount="indefinite" />
      </rect>
      <rect x="3" y="17" width="12" height="12" rx="3" fill={color} opacity="0.55">
        <animate attributeName="opacity" values="0.85;0.35;0.85" dur="3.2s" repeatCount="indefinite" />
      </rect>
      <rect x="17" y="17" width="12" height="12" rx="3" fill={color} opacity="0.95" />
    </Box>
  );
}

/**
 * @param {string}  breadcrumb   Libellé affiché après "MENUFLOW ›" (optionnel)
 * @param {boolean} fixed        true = position fixed (utilisé au-dessus d'une sidebar, ex: MainLayout)
 *                                false = position sticky (utilisé seul, ex: ModulesPage)
 * @param {number}  drawerOffset Largeur de la sidebar en px, seulement utile si fixed=true
 */
function TopBar({ breadcrumb, fixed = false, drawerOffset = 0 }) {
  return (
    <Box
      sx={{
        position: fixed ? 'fixed' : 'sticky',
        top: 0,
        left: fixed ? { xs: 0, md: drawerOffset } : 0,
        right: 0,
        zIndex: (theme) => theme.zIndex.drawer + 1,
        // Flex natif et explicite : pas de Stack imbriqué, pas d'ambiguïté
        // sur la largeur -> garantit que justify-content s'applique bien.
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 2,
        boxSizing: 'border-box',
        width: fixed ? { xs: '100%', md: `calc(100% - ${drawerOffset}px)` } : '100%',
        minHeight: 64,
        px: { xs: 2, sm: 4 },
        bgcolor: 'rgba(255,255,255,0.92)',
        backdropFilter: 'blur(8px)',
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      {/* Côté gauche : logo + fil d'ariane. flex:1 + minWidth:0 permet au
          texte de se tronquer proprement au lieu de pousser le menu
          utilisateur hors de l'écran. */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          flex: '1 1 auto',
          minWidth: 0,
          overflow: 'hidden',
        }}
      >
        <Logo />
        <Breadcrumbs
          separator="›"
          sx={{
            fontSize: '0.85rem',
            minWidth: 0,
            '& .MuiBreadcrumbs-ol': { flexWrap: 'nowrap' },
            '& .MuiBreadcrumbs-separator': { color: 'text.secondary', flexShrink: 0 },
          }}
        >
          <Typography sx={{ fontWeight: 700, letterSpacing: '0.03em', fontSize: '0.85rem', flexShrink: 0 }}>
            MENUFLOW
          </Typography>
          {breadcrumb && (
            <Typography
              sx={{
                color: 'text.secondary',
                fontSize: '0.85rem',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {breadcrumb}
            </Typography>
          )}
        </Breadcrumbs>
      </Box>

      {/* Côté droit : jamais compressé, toujours collé au bord droit. */}
      <Box sx={{ flexShrink: 0 }}>
        <UserMenu variant="light" />
      </Box>
    </Box>
  );
}

export default TopBar;