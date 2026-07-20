// src/components/module/ModuleFormDialog.jsx
import { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';
import axiosClient from '../../api/axiosClient.js';

function ModuleFormDialog({ ouvert, module, onFermer, onSauvegarde }) {
  const [nom, setNom] = useState('');
  const [erreur, setErreur] = useState('');
  const [enCours, setEnCours] = useState(false);

  useEffect(() => {
    setNom(module ? module.nom : '');
    setErreur('');
  }, [module, ouvert]);

  const sauvegarder = async () => {
    if (!nom.trim()) {
      setErreur('Le nom est obligatoire');
      return;
    }
    setEnCours(true);
    try {
      if (module) {
        await axiosClient.put(`/modules/${module.id}`, { nom });
      } else {
        await axiosClient.post('/modules', { nom });
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
      <DialogTitle>{module ? 'Modifier le module' : 'Nouveau module'}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          fullWidth
          margin="dense"
          label="Nom du module"
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

export default ModuleFormDialog;