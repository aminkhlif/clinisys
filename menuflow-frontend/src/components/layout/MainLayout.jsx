// src/components/layout/MainLayout.jsx
import { AppBar, Box, Drawer, Toolbar } from '@mui/material';
import Sidebar from './Sidebar.jsx';

const DRAWER_WIDTH = 300;

// Motif facetté (triangles) en dégradés de gris, tuilé sur le fond noir de la sidebar
const TRIANGLE_PATTERN_SVG = `
  <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120">
    <rect width="120" height="120" fill="#0A0A0A" />
    <polygon points="0,0 60,0 0,60" fill="#161616" />
    <polygon points="60,0 120,0 120,60 60,60" fill="#101010" />
    <polygon points="0,60 60,60 0,120" fill="#121212" />
    <polygon points="60,60 120,60 120,120 60,120" fill="#181818" />
    <polygon points="60,0 60,60 0,60" fill="#0D0D0D" />
    <polygon points="120,0 120,60 60,60" fill="#141414" />
    <polygon points="60,60 60,120 0,120" fill="#0F0F0F" />
    <polygon points="120,60 120,120 60,120" fill="#131313" />
  </svg>
`;
const TRIANGLE_PATTERN_URL = `url("data:image/svg+xml,${encodeURIComponent(TRIANGLE_PATTERN_SVG)}")`;

function MainLayout({ children }) {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          ml: { md: `${DRAWER_WIDTH}px` },
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
        }}
      >
        <Toolbar sx={{ minHeight: 64 }}>
          <Box
            component="svg"
            viewBox="0 0 32 32"
            sx={{ width: 28, height: 28 }}
          >
            <rect x="3" y="3" width="12" height="12" rx="3" fill="#121212" opacity="0.95" />
            <rect
              x="17" y="3" width="12" height="12" rx="3" fill="#121212" opacity="0.55"
            >
              <animate attributeName="opacity" values="0.35;0.85;0.35" dur="3.2s" repeatCount="indefinite" />
            </rect>
            <rect
              x="3" y="17" width="12" height="12" rx="3" fill="#121212" opacity="0.55"
            >
              <animate attributeName="opacity" values="0.85;0.35;0.85" dur="3.2s" repeatCount="indefinite" />
            </rect>
            <rect x="17" y="17" width="12" height="12" rx="3" fill="#121212" opacity="0.95" />
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
            backgroundColor: '#0A0A0A',
            backgroundImage: TRIANGLE_PATTERN_URL,
            backgroundSize: '120px 120px',
            backgroundRepeat: 'repeat',
            color: '#FFFFFF',
            border: 'none',
          },
        }}
      >
        <Sidebar />
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3, md: 4 },
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          maxWidth: '100%',
          backgroundImage: 'radial-gradient(circle, #DDDDDD 1px, transparent 1px)',
          backgroundSize: '22px 22px',
          backgroundPosition: '-11px -11px',
        }}
      >
        <Toolbar sx={{ minHeight: 64 }} />
        {children}
      </Box>
    </Box>
  );
}

export default MainLayout;