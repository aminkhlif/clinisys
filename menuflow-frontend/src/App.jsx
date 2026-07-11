// src/App.jsx
import { Routes, Route } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import MainLayout from './components/layout/MainLayout.jsx';
import SousMenuPage from './pages/SousMenuPage.jsx';

function AccueilPage() {
  return (
    <Box
      sx={{
        height: 'calc(100vh - 160px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        gap: 1,
      }}
    >
      <Typography variant="h6" sx={{ color: 'text.primary' }}>
        Aucun sous-menu sélectionné
      </Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary', maxWidth: 360 }}>
        Choisissez un sous-menu dans le panneau latéral pour afficher et gérer ses captures d'écran.
      </Typography>
    </Box>
  );
}

function App() {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<AccueilPage />} />
        <Route path="/sous-menus/:sousMenuId" element={<SousMenuPage />} />
      </Routes>
    </MainLayout>
  );
}

export default App;