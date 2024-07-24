import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  Button,
  TextField,
  Box,
  Typography,
  IconButton,
  Grid,
  Table,
  TableCell,
  TableContainer,
  TableRow,
  TableHead,
  Paper,
  TableBody,
  CircularProgress,
  Modal,
  InputBase,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useUpsertPlaylistMutation, useGetPlaylistIdQuery, useSearchTrackQuery } from "../../redux/api";
import Basic from "../Dropzone/Basic";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import SearchIcon from "@mui/icons-material/Search";
import AddCircleSharpIcon from "@mui/icons-material/AddCircleSharp";
import { setSearchResults } from "../../redux/slice/searchSlice";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const PageCreatingAndEditingPlaylist = () => {
  const dispatch = useDispatch();
  const [upsertPlaylistMutation] = useUpsertPlaylistMutation();
  const [tracksId, setTracksId] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { id: paramId } = useParams();
  const { isLoadingSerch, refetch: serchRefetch } = useSearchTrackQuery({
    title: searchQuery,
  });
  const id = paramId || "";
  const { data, isLoading, refetch } = useGetPlaylistIdQuery({ _id: id });
  const [playlist, setMyPlaylist] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [tracks, setTracks] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [loadFile, setLoadFile] = useState(false);
  const [searchResults, setSearchTracks] = useState([]);
  const [trackTitle, setTrackTitle] = useState("");
  const [trackArtist, setTrackArtist] = useState("");
  const [trackAlbum, setTrackAlbum] = useState("");

  useEffect(() => {
    if (data?.PlaylistFindOne) {
      const { name, description, tracks } = data.PlaylistFindOne;
      setMyPlaylist(data.PlaylistFindOne);
      setName(name || "");
      setDescription(description || "");
      setTracks(tracks || []);
      setTracksId(tracks.map((i) => i._id));
    }
    if (searchQuery === "") {
      setSearchTracks([]);
    }
  }, [data, searchQuery]);

  const handleUploadResult = (id) => {
    setTracksId((prevIds) => [...prevIds, id]);
    addTrack(id, trackTitle, trackArtist, trackAlbum);
  };

  const navigate = useNavigate();

  const creatPlaylist = async () => {
    try {
      const playlistId = id || "";
      const newTracksId = tracksId.map((i) => ({ _id: i }));
      const res = await upsertPlaylistMutation({
        playlistId,
        namePls: name,
        descriptionPls: description,
        tracksId: newTracksId,
        id3: {
          title: trackTitle,
          artist: trackArtist,
          album: trackAlbum,
        },
      });
      if (res) {
        if (id === "") {
          navigate(-1);
        } else {
          setOpenModal(true);
          setLoadFile(true);
          await refetch();
        }
      }
      setName("");
      setDescription("");
      setTrackTitle("");
      setTrackArtist("");
      setTrackAlbum("");
    } catch (error) {
      console.error(error);
    }
  };

 const addTrack = async (trackId,) => {
    tracksId.push(trackId);
    try {
      const playlistId = id || "";
      const newTracksId = tracksId.map((i) => ({ _id: i }));
      const res = await upsertPlaylistMutation({
        playlistId,
        namePls: name,
        descriptionPls: description,
        tracksId: newTracksId,
      });
      if (res) {
        await refetch();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (trackId) => {
    try {
      const updatedTracks = tracks.filter((i) => i._id !== trackId);
      const updatedTracksId = updatedTracks.map((i) => ({ _id: i._id }));
      await upsertPlaylistMutation({
        playlistId: id,
        namePls: name,
        descriptionPls: description,
        tracksId: updatedTracksId,
      });
      setTracks(updatedTracks);
      await refetch();
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearch = async (event) => {
    if (event.key === "Enter" || event.key === "Tab") {
      event.preventDefault();
      const { data: searchResults } = await serchRefetch();
      if (searchResults && searchResults.TrackFind) {
        setSearchTracks(searchResults.TrackFind);
      }
    }
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Grid container>
      <Grid item xs={12}>
        <Typography variant="h4" component="h2" gutterBottom>
          {id ? "Редагувати Плейлист" : "Створити Плейлист"}
        </Typography>
        <Box component="form" sx={{ width: "600px" }}>
          <TextField
            fullWidth
            label="Назва Плейлиста"
            value={name}
            onChange={(e) => setName(e.target.value)}
            variant="outlined"
            sx={{ my: 2 }}
          />
          <TextField
            fullWidth
            label="Опис"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            variant="outlined"
            sx={{ my: 2 }}
          />
          <Box sx={{ my: 2, display: "flex", flexDirection: "row", alignItems: "flex-start" }}>
            <Box>
              <Typography variant="body2" sx={{ color: "#ced4d2", textAlign: "center" }}>
                Завантажити трек:
              </Typography>
            </Box>
            <Box sx={{ width: "300px" }}>
              <Basic uploadResult={handleUploadResult} prop={loadFile}
              trackTitle={trackTitle}
              trackArtist={trackArtist}
              trackAlbum={trackAlbum} />
            </Box>
          </Box>
          <TextField
            fullWidth
            label="Назва трека"
            value={trackTitle}
            onChange={(e) => setTrackTitle(e.target.value)}
            variant="outlined"
            sx={{ my: 2 }}
          />
          <TextField
            fullWidth
            label="Виконавець"
            value={trackArtist}
            onChange={(e) => setTrackArtist(e.target.value)}
            variant="outlined"
            sx={{ my: 2 }}
          />
          <TextField
            fullWidth
            label="Альбом"
            value={trackAlbum}
            onChange={(e) => setTrackAlbum(e.target.value)}
            variant="outlined"
            sx={{ my: 2 }}
          />
        </Box>
        <Button variant="contained" color="primary" onClick={creatPlaylist}>
          {id ? "Зберегти зміни" : "Створити Плейлист"}
        </Button>
      </Grid>
      <Grid item xs={12} sx={{ mt: 4 }}>
        <Typography variant="h6" component="h4">
          Треки у плейлисті
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Дія</TableCell>
                <TableCell>Назва трека</TableCell>
                <TableCell>Альбом</TableCell>
                <TableCell>Виконавець</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tracks.map((track) => (
                <TableRow key={track._id}>
                  <TableCell>
                    <IconButton onClick={() => handleDelete(track._id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                  <TableCell>{track.id3?.title || "Без назви"}</TableCell>
                  <TableCell>{track.id3?.album || "Без назви"}</TableCell>
                  <TableCell>{track.id3?.artist || "Без назви"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
      
      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Плейлист оновлено
          </Typography>
          <IconButton
            aria-label="close"
            onClick={() => setOpenModal(false)}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseOutlinedIcon />
          </IconButton>
        </Box>
      </Modal>
    </Grid>
  );
};

export default PageCreatingAndEditingPlaylist;
