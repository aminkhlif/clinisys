// src/pages/RegisterPage.jsx
import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
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

function RegisterPage() {
  const { inscrire } = useAuth();
  const navigate = useNavigate();

  const [nomUtilisateur, setNomUtilisateur] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [confirmationMotDePasse, setConfirmationMotDePasse] = useState('');
  const [erreurs, setErreurs] = useState({});
  const [enCours, setEnCours] = useState(false);

  const soumettre = async (e) => {
    e.preventDefault();
    const nouvellesErreurs = {};

    if (nomUtilisateur.trim().length < 3) {
      nouvellesErreurs.nomUtilisateur = 'Le nom d\'utilisateur doit contenir au moins 3 caractères';
    }
    if (motDePasse.length < 6) {
      nouvellesErreurs.motDePasse = 'Le mot de passe doit contenir au moins 6 caractères';
    }
    if (confirmationMotDePasse !== motDePasse) {
      nouvellesErreurs.confirmation = 'Les mots de passe ne correspondent pas';
    }

    if (Object.keys(nouvellesErreurs).length > 0) {
      setErreurs(nouvellesErreurs);
      return;
    }

    setEnCours(true);
    setErreurs({});
    try {
      await inscrire(nomUtilisateur.trim(), motDePasse);
      navigate('/', { replace: true });
    } catch (err) {
      setErreurs({ nomUtilisateur: err.response?.data?.nomUtilisateur || 'Une erreur est survenue' });
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
          <Typography variant="h5">Créer un compte</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Rejoignez MenuFlow en quelques secondes
          </Typography>
        </Stack>

        <Box component="form" onSubmit={soumettre} noValidate>
          <Stack spacing={2}>
            <TextField
              label="Nom d'utilisateur"
              value={nomUtilisateur}
              onChange={(e) => setNomUtilisateur(e.target.value)}
              error={Boolean(erreurs.nomUtilisateur)}
              helperText={erreurs.nomUtilisateur}
              autoFocus
              fullWidth
            />
            <TextField
              label="Mot de passe"
              type="password"
              value={motDePasse}
              onChange={(e) => setMotDePasse(e.target.value)}
              error={Boolean(erreurs.motDePasse)}
              helperText={erreurs.motDePasse}
              fullWidth
            />
            <TextField
              label="Confirmer le mot de passe"
              type="password"
              value={confirmationMotDePasse}
              onChange={(e) => setConfirmationMotDePasse(e.target.value)}
              error={Boolean(erreurs.confirmation)}
              helperText={erreurs.confirmation}
              fullWidth
            />
            <Button type="submit" variant="contained" fullWidth disabled={enCours} sx={{ py: 1.2 }}>
              {enCours ? 'Création…' : 'Créer mon compte'}
            </Button>
          </Stack>
        </Box>

        <Typography variant="body2" sx={{ textAlign: 'center', color: 'text.secondary', mt: 3 }}>
          Déjà un compte ?{' '}
          <Link component={RouterLink} to="/login" sx={{ color: 'grey.900', fontWeight: 600 }}>
            Se connecter
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
}

export default RegisterPage;