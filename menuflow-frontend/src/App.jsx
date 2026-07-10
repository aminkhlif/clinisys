// src/App.jsx
import { Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout.jsx';
import SousMenuPage from './pages/SousMenuPage.jsx';
import { Box, Typography } from '@mui/material';

function AccueilPage() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5">Sélectionnez un sous-menu dans le menu latéral</Typography>
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