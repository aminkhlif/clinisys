// src/pages/LoginPage.jsx
import { useState } from 'react';
import { useNavigate, useLocation, Link as RouterLink } from 'react-router-dom';
import { Box, Paper, Typography, TextField, Button, Link, Stack } from '@mui/material';
import { useAuth } from '../context/AuthContext.jsx';

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

function LoginPage() {
  const { connecter } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [nomUtilisateur, setNomUtilisateur] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [erreur, setErreur] = useState('');
  const [enCours, setEnCours] = useState(false);

  const destinationApresConnexion = location.state?.from?.pathname || '/';

  const soumettre = async (e) => {
    e.preventDefault();
    if (!nomUtilisateur.trim() || !motDePasse) {
      setErreur('Veuillez renseigner votre nom d\'utilisateur et votre mot de passe');
      return;
    }
    setEnCours(true);
    setErreur('');
    try {
      await connecter(nomUtilisateur.trim(), motDePasse);
      navigate(destinationApresConnexion, { replace: true });
    } catch (err) {
      setErreur(err.response?.data?.message || 'Nom d\'utilisateur ou mot de passe incorrect');
    } finally {
      setEnCours(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: TRIANGLE_PATTERN_URL,
        backgroundSize: '120px 120px',
        backgroundColor: '#0A0A0A',
        p: 2,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: '100%',
          maxWidth: 380,
          p: 4,
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Stack alignItems="center" spacing={1.5} sx={{ mb: 3.5 }}>
          <Box component="svg" viewBox="0 0 32 32" sx={{ width: 40, height: 40 }}>
            <rect x="3" y="3" width="12" height="12" rx="3" fill="#121212" opacity="0.95" />
            <rect x="17" y="3" width="12" height="12" rx="3" fill="#121212" opacity="0.55">
              <animate attributeName="opacity" values="0.35;0.85;0.35" dur="3.2s" repeatCount="indefinite" />
            </rect>
            <rect x="3" y="17" width="12" height="12" rx="3" fill="#121212" opacity="0.55">
              <animate attributeName="opacity" values="0.85;0.35;0.85" dur="3.2s" repeatCount="indefinite" />
            </rect>
            <rect x="17" y="17" width="12" height="12" rx="3" fill="#121212" opacity="0.95" />
          </Box>
          <Typography variant="h5">Connexion</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Accédez à votre espace MenuFlow
          </Typography>
        </Stack>

        <Box component="form" onSubmit={soumettre} noValidate>
          <Stack spacing={2}>
            <TextField
              label="Nom d'utilisateur"
              value={nomUtilisateur}
              onChange={(e) => setNomUtilisateur(e.target.value)}
              autoFocus
              fullWidth
            />
            <TextField
              label="Mot de passe"
              type="password"
              value={motDePasse}
              onChange={(e) => setMotDePasse(e.target.value)}
              error={Boolean(erreur)}
              helperText={erreur}
              fullWidth
            />
            <Button type="submit" variant="contained" fullWidth disabled={enCours} sx={{ py: 1.2 }}>
              {enCours ? 'Connexion…' : 'Se connecter'}
            </Button>
          </Stack>
        </Box>

        <Typography variant="body2" sx={{ textAlign: 'center', color: 'text.secondary', mt: 3 }}>
          Pas encore de compte ?{' '}
          <Link component={RouterLink} to="/register" sx={{ color: 'grey.900', fontWeight: 600 }}>
            Créer un compte
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
}

export default LoginPage;