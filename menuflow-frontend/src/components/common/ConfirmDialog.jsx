// src/components/common/ConfirmDialog.jsx
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';

function ConfirmDialog({ ouvert, titre, message, onConfirmer, onAnnuler, enCours = false }) {
  return (
    <Dialog open={ouvert} onClose={onAnnuler} maxWidth="xs" fullWidth>
      <DialogTitle>{titre}</DialogTitle>
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onAnnuler} disabled={enCours}>Annuler</Button>
        <Button variant="contained" onClick={onConfirmer} disabled={enCours}>
          {enCours ? 'Suppression…' : 'Supprimer'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ConfirmDialog;