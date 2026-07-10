// src/components/menu/MenuFormDialog.jsx
import { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';
import axiosClient from '../../api/axiosClient.js';

function MenuFormDialog({ ouvert, menu, onFermer, onSauvegarde }) {
  const [nom, setNom] = useState('');
  const [erreur, setErreur] = useState('');

  useEffect(() => {
    setNom(menu ? menu.nom : '');
    setErreur('');
  }, [menu, ouvert]);

  const sauvegarder = async () => {
    try {
      if (menu) {
        await axiosClient.put(`/menus/${menu.id}`, { nom });
      } else {
        await axiosClient.post('/menus', { nom });
      }
      onSauvegarde();
    } catch (err) {
      if (err.response?.data?.nom) {
        setErreur(err.response.data.nom);
      } else {
        setErreur('Une erreur est survenue');
      }
    }
  };

  return (
    <Dialog open={ouvert} onClose={onFermer} fullWidth maxWidth="xs">
      <DialogTitle>{menu ? 'Modifier le menu' : 'Nouveau menu'}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          fullWidth
          margin="dense"
          label="Nom du menu"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          error={Boolean(erreur)}
          helperText={erreur}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onFermer}>Annuler</Button>
        <Button variant="contained" onClick={sauvegarder}>Enregistrer</Button>
      </DialogActions>
    </Dialog>
  );
}

export default MenuFormDialog;