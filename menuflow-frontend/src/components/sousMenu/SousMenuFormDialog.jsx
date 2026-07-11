// src/components/sousMenu/SousMenuFormDialog.jsx
import { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';
import axiosClient from '../../api/axiosClient.js';

function SousMenuFormDialog({ ouvert, sousMenu, menuId, onFermer, onSauvegarde }) {
  const [nom, setNom] = useState('');
  const [erreur, setErreur] = useState('');
  const [enCours, setEnCours] = useState(false);

  useEffect(() => {
    setNom(sousMenu ? sousMenu.nom : '');
    setErreur('');
  }, [sousMenu, ouvert]);

  const sauvegarder = async () => {
    if (!nom.trim()) {
      setErreur('Le nom est obligatoire');
      return;
    }
    setEnCours(true);
    try {
      if (sousMenu) {
        await axiosClient.put(`/sous-menus/${sousMenu.id}`, { nom, menuId });
      } else {
        await axiosClient.post('/sous-menus', { nom, menuId });
      }
      onSauvegarde();
    } catch (err) {
      setErreur(err.response?.data?.nom || 'Une erreur est survenue');
    } finally {
      setEnCours(false);
    }
  };

  return (
    <Dialog open={ouvert} onClose={onFermer} fullWidth maxWidth="xs">
      <DialogTitle>{sousMenu ? 'Modifier le sous-menu' : 'Nouveau sous-menu'}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          fullWidth
          margin="dense"
          label="Nom du sous-menu"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sauvegarder()}
          error={Boolean(erreur)}
          helperText={erreur}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onFermer} disabled={enCours}>Annuler</Button>
        <Button variant="contained" onClick={sauvegarder} disabled={enCours}>
          {enCours ? 'Enregistrement…' : 'Enregistrer'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default SousMenuFormDialog;