// src/components/menu/MenuFormDialog.jsx
import { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';
import axiosClient from '../../api/axiosClient.js';

function MenuFormDialog({ ouvert, menu, moduleId, onFermer, onSauvegarde }) {
  const [nom, setNom] = useState('');
  const [erreur, setErreur] = useState('');
  const [enCours, setEnCours] = useState(false);

  useEffect(() => {
    setNom(menu ? menu.nom : '');
    setErreur('');
  }, [menu, ouvert]);

  const sauvegarder = async () => {
    if (!nom.trim()) {
      setErreur('Le nom est obligatoire');
      return;
    }
    setEnCours(true);
    try {
      if (menu) {
        await axiosClient.put(`/menus/${menu.id}`, { nom });
      } else {
        await axiosClient.post('/menus', { nom, moduleId });
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
      <DialogTitle>{menu ? 'Modifier le menu' : 'Nouveau menu'}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          fullWidth
          margin="dense"
          label="Nom du menu"
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

export default MenuFormDialog;
