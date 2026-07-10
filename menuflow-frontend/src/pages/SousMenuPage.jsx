// src/pages/SousMenuPage.jsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Stack, Typography, Button, TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import axiosClient from '../api/axiosClient.js';
import ImageGrid from '../components/image/ImageGrid.jsx';
import ImageUploadDialog from '../components/image/ImageUploadDialog.jsx';
import ImageDetailDialog from '../components/image/ImageDetailDialog.jsx';
import ImageActionsDialog from '../components/image/ImageActionsDialog.jsx';
import DiaporamaDialog from '../components/image/DiaporamaDialog.jsx';
import ConfirmDialog from '../components/common/ConfirmDialog.jsx';

function SousMenuPage() {
  const { sousMenuId } = useParams();
  const [sousMenu, setSousMenu] = useState(null);
  const [images, setImages] = useState([]);
  const [selectionnees, setSelectionnees] = useState([]);
  const [recherche, setRecherche] = useState('');

  const [dialogUploadOuvert, setDialogUploadOuvert] = useState(false);
  const [imageDetail, setImageDetail] = useState(null);
  const [imageActions, setImageActions] = useState(null);
  const [diaporamaOuvert, setDiaporamaOuvert] = useState(false);
 const [confirmationSuppression, setConfirmationSuppression] = useState(false);
  const chargerSousMenu = async () => {
    const res = await axiosClient.get(`/sous-menus/${sousMenuId}`);
    setSousMenu(res.data);
  };

  const chargerImages = async (termeRecherche = '') => {
    const params = termeRecherche ? { sousMenuId, description: termeRecherche } : { sousMenuId };
    const res = await axiosClient.get('/images', { params });
    setImages(res.data);
  };

  useEffect(() => {
    if (!sousMenuId) return;
    setSelectionnees([]);
    setRecherche('');
    chargerSousMenu();
    chargerImages();
  }, [sousMenuId]);

  useEffect(() => {
    const delai = setTimeout(() => {
      chargerImages(recherche);
    }, 300);
    return () => clearTimeout(delai);
  }, [recherche]);

 const confirmerSuppressionSelectionnees = async () => {
    await axiosClient.delete('/images', { params: { ids: selectionnees }, paramsSerializer: { indexes: null } });
    setSelectionnees([]);
    setConfirmationSuppression(false);
    chargerImages(recherche);
  };

  const genererVideo = async () => {
    await axiosClient.patch(`/sous-menus/${sousMenuId}/video`, null, { params: { genere: true } });
    chargerSousMenu();
  };

  const devaliderVideo = async () => {
    await axiosClient.patch(`/sous-menus/${sousMenuId}/video`, null, { params: { genere: false } });
    chargerSousMenu();
  };

  if (!sousMenu) {
    return <Typography>Chargement...</Typography>;
  }

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Stack direction="row" spacing={2}>
          <Button variant="contained" onClick={() => setDialogUploadOuvert(true)}>
            Ajouter une capture
          </Button>
          <Button
            variant="outlined"
            color="error"
            disabled={selectionnees.length === 0}
            onClick={() => setConfirmationSuppression(true)}
          >
            Supprimer sélectionnés
          </Button>
        </Stack>

        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            startIcon={<PlayArrowIcon />}
            onClick={() => setDiaporamaOuvert(true)}
            disabled={images.length === 0}
          >
            Aperçu
          </Button>
          <Button variant="contained" onClick={genererVideo} disabled={sousMenu.videoGeneree}>
            Générer la vidéo
          </Button>
          <Button variant="contained" color="error" onClick={devaliderVideo} disabled={!sousMenu.videoGeneree}>
            Dévalider la vidéo
          </Button>
        </Stack>
      </Stack>

      <Typography variant="h5" sx={{ mb: 2 }}>{sousMenu.nom}</Typography>

      <TextField
        size="small"
        placeholder="Rechercher une image par description..."
        value={recherche}
        onChange={(e) => setRecherche(e.target.value)}
        slotProps={{
  input: {
    startAdornment: (
      <InputAdornment position="start">
        <SearchIcon fontSize="small" />
      </InputAdornment>
    ),
  },
}}
        sx={{ mb: 2, width: 350 }}
      />

      <ImageGrid
        images={images}
        selectionnees={selectionnees}
        onChangerSelection={setSelectionnees}
        onReordonne={setImages}
        onOuvrirDetail={setImageDetail}
        onOuvrirActions={setImageActions}
      />

      <ImageUploadDialog
        ouvert={dialogUploadOuvert}
        sousMenuId={sousMenuId}
        onFermer={() => setDialogUploadOuvert(false)}
        onSauvegarde={() => { setDialogUploadOuvert(false); chargerImages(recherche); }}
      />

      <ImageDetailDialog
        image={imageDetail}
        onFermer={() => setImageDetail(null)}
        onModifie={() => chargerImages(recherche)}
        onOuvrirActions={(img) => { setImageDetail(null); setImageActions(img); }}
      />

      <ImageActionsDialog
        image={imageActions}
        onFermer={() => setImageActions(null)}
        onSauvegarde={() => { setImageActions(null); chargerImages(recherche); }}
      />

      <DiaporamaDialog
        ouvert={diaporamaOuvert}
        images={images}
        onFermer={() => setDiaporamaOuvert(false)}
      />
      <ConfirmDialog
        ouvert={confirmationSuppression}
        titre="Supprimer les images sélectionnées ?"
        message={`${selectionnees.length} image(s) seront supprimées définitivement.`}
        onConfirmer={confirmerSuppressionSelectionnees}
        onAnnuler={() => setConfirmationSuppression(false)}
      />
    </Box>
  );
}

export default SousMenuPage;