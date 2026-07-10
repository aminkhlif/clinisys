// src/components/common/ConfirmDialog.jsx
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';

function ConfirmDialog({ ouvert, titre, message, onConfirmer, onAnnuler }) {
  return (
    <Dialog open={ouvert} onClose={onAnnuler} maxWidth="xs" fullWidth>
      <DialogTitle>{titre}</DialogTitle>
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onAnnuler}>Annuler</Button>
        <Button variant="contained" color="error" onClick={onConfirmer}>Supprimer</Button>
      </DialogActions>
    </Dialog>
  );
}

export default ConfirmDialog;