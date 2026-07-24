// src/components/auth/UserMenu.jsx
import { Stack, Typography, IconButton, Tooltip, Avatar } from '@mui/material';
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

  const initiale = utilisateur.nomUtilisateur.charAt(0).toUpperCase();

  return (
    <Stack direction="row" alignItems="center" spacing={1}>
      <Stack
        direction="row"
        alignItems="center"
        spacing={1}
        sx={{
          pl: 0.5,
          pr: 1.5,
          py: 0.5,
          borderRadius: 999,
          bgcolor: estSombre ? 'rgba(255,255,255,0.08)' : 'grey.100',
        }}
      >
        <Avatar
          sx={{
            width: 26,
            height: 26,
            fontSize: '0.75rem',
            fontWeight: 700,
            bgcolor: estSombre ? 'rgba(255,255,255,0.9)' : 'grey.900',
            color: estSombre ? '#121212' : '#FFFFFF',
          }}
        >
          {initiale}
        </Avatar>
        <Typography
          sx={{
            fontSize: '0.85rem',
            fontWeight: 600,
            color: estSombre ? 'rgba(255,255,255,0.9)' : 'text.primary',
          }}
        >
          {utilisateur.nomUtilisateur}
        </Typography>
      </Stack>

      <Tooltip title="Déconnexion">
        <IconButton
          size="small"
          onClick={gererDeconnexion}
          sx={{
            color: estSombre ? 'rgba(255,255,255,0.6)' : 'text.secondary',
            '&:hover': {
              bgcolor: estSombre ? 'rgba(255,255,255,0.1)' : 'grey.100',
              color: estSombre ? '#FFFFFF' : 'text.primary',
            },
          }}
        >
          <LogoutOutlinedIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </Stack>
  );
}

export default UserMenu;