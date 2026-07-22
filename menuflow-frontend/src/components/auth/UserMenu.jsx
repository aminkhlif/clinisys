// src/components/auth/UserMenu.jsx
import { Stack, Typography, Button } from '@mui/material';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { useAuth } from '../../context/AuthContext.jsx';

function UserMenu({ variant = 'light' }) {
  const { utilisateur, deconnecter } = useAuth();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const gererDeconnexion = async () => {
    await deconnecter();
    enqueueSnackbar('Vous avez été déconnecté', { variant: 'success' });
    navigate('/login', { replace: true });
  };

  const estSombre = variant === 'dark';

  if (!utilisateur) return null;

  return (
    <Stack direction="row" alignItems="center" spacing={1.25}>
      <Typography
        sx={{
          fontSize: '0.85rem',
          fontWeight: 600,
          color: estSombre ? 'rgba(255,255,255,0.85)' : 'text.primary',
        }}
      >
        {utilisateur.nomUtilisateur}
      </Typography>
      <Button
        size="small"
        onClick={gererDeconnexion}
        startIcon={<LogoutOutlinedIcon fontSize="small" />}
        sx={{
          color: estSombre ? 'rgba(255,255,255,0.6)' : 'text.secondary',
          '&:hover': {
            bgcolor: estSombre ? 'rgba(255,255,255,0.1)' : 'grey.100',
            color: estSombre ? '#FFFFFF' : 'text.primary',
          },
        }}
      >
        Déconnexion
      </Button>
    </Stack>
  );
}

export default UserMenu;