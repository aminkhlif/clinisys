// src/App.jsx
import { Routes, Route } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import MainLayout from './components/layout/MainLayout.jsx';
import ModulesPage from './pages/ModulesPage.jsx';
import SousMenuPage from './pages/SousMenuPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import ProtectedRoute from './components/auth/ProtectedRoute.jsx';

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

// Wrapper affiché pour un module donné : sidebar + routes internes (accueil / sous-menu)
function ModuleShell() {
  return (
    <MainLayout>
      <Routes>
        <Route index element={<AccueilPage />} />
        <Route path="sous-menus/:sousMenuId" element={<SousMenuPage />} />
      </Routes>
    </MainLayout>
  );
}

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Routes publiques */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Toutes les autres routes exigent d'être authentifié */}
        <Route path="/" element={<ProtectedRoute><ModulesPage /></ProtectedRoute>} />
        <Route path="/modules/:moduleId/*" element={<ProtectedRoute><ModuleShell /></ProtectedRoute>} />
      </Routes>
    </AuthProvider>
  );
}

export default App;