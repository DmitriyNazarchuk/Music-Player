import React, { useState, useMemo } from "react";
import { useGetTracksQuery } from "../../redux/api";
import {
  CircularProgress,
  CardContent,
  Table,
  TableCell,
  TableContainer,
  TableRow,
  TableHead,
  Box,
  Paper,
  Typography,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { IconButton } from "@mui/material";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { setTrack, play, stop, replay, pause} from "../../redux/slice/playerSlice";
import TrackList from "./TrackList";

const tracksPerPage = 50;
const PageTracks = () => {
  const dispatch = useDispatch();
  const track = useSelector((state) => state.persistedReducer.player.track);
  const isPlaying = useSelector(
    (state) => state.persistedReducer.player.isPlaying
  );
  const { data: playlist, isLoading } = useGetTracksQuery({
    skip: 0,
    limit: 150,
  });

  const totalPages = useMemo(
    () => Math.ceil(playlist?.TrackFind.length || 0 / tracksPerPage),
    [playlist, tracksPerPage]
  );
  const [currentPage, setCurrentPage] = useState(1);
  const tracksToDisplay = useMemo(
    () =>
      playlist?.TrackFind.slice(
        (currentPage - 1) * tracksPerPage,
        (currentPage - 1) * tracksPerPage + tracksPerPage
      ),
    [tracksPerPage, currentPage, playlist]
  );
  console.log(track, isPlaying);
  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const handlePlay = (track) => {
    dispatch(setTrack(track));
    dispatch(play());
  };

  const handleStop = () => {
    console.log(isPlaying);
    if (isPlaying) {
      dispatch(pause());
    } else {
      dispatch(replay());
    }
  };


  return isLoading ? (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        margin: "100px",
      }}
    >
      <CircularProgress />
    </Box>
  ) : (
    <Box sx={{ padding: "5px" }}>
      <Box>
        <CardContent sx={{ my: 1 }}>
          <Typography component="h1" variant="h4" sx={{ marginBottom: "10px" }}>
            Треки
          </Typography>
        </CardContent>
      </Box>
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>
                <IconButton />
              </TableCell>
              <TableCell>Назва</TableCell>
              <TableCell>Альбом</TableCell>
              <TableCell>Виконавець</TableCell>
            </TableRow>
          </TableHead>
          <TrackList
            tracks={tracksToDisplay}
            track={track}
            isPlaying={isPlaying}
            handlePlay={handlePlay}
            handleStop={handleStop}
          />
        </Table>
      </TableContainer>
      <Stack spacing={2}>
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={handlePageChange}
        />
      </Stack>
    </Box>
  );
};

export default PageTracks;
