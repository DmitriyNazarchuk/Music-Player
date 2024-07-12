import React, { useState, useMemo, useEffect } from "react";
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
import { setTrack, play, pause, replay } from "../../redux/slice/playerSlice";
import TrackList from "./TrackList";
import InfiniteScroll from "react-infinite-scroll-component";

const tracksPerPage = 50;

const PageTracks = () => {
  const dispatch = useDispatch();
  const track = useSelector((state) => state.persistedReducer.player.track);
  const isPlaying = useSelector(
    (state) => state.persistedReducer.player.isPlaying
  );
  const { data: playlist, isLoading } = useGetTracksQuery({
    skip: 0,
    limit: 1000,
  });

  const [displayedTracks, setDisplayedTracks] = useState([]);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    if (playlist) {
      setDisplayedTracks(playlist.TrackFind.slice(0, tracksPerPage));
    }
  }, [playlist]);

  const fetchMoreTracks = () => {
    if (displayedTracks.length >= (playlist?.TrackFind.length || 0)) {
      setHasMore(false);
      return;
    }
    const nextTracks = playlist.TrackFind.slice(
      displayedTracks.length,
      displayedTracks.length + tracksPerPage
    );
    setDisplayedTracks((prevTracks) => [...prevTracks, ...nextTracks]);
  };

  const tracksToDisplay = useMemo(() => displayedTracks, [displayedTracks]);

  const handlePlay = (track) => {
    dispatch(setTrack(track));
    dispatch(play());
  };

  const handleStop = () => {
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
      <CardContent sx={{ my: 1 }}>
        <Typography component="h1" variant="h4" sx={{ marginBottom: "10px" }}>
          Треки
        </Typography>
      </CardContent>
      <InfiniteScroll
        dataLength={tracksToDisplay.length}
        next={fetchMoreTracks}
        hasMore={hasMore}
        loader={<CircularProgress />}
        endMessage={
          <Typography style={{ textAlign: "center" }}>
            <b>Больше треков нет</b>
          </Typography>
        }
        style={{ overflow: "hidden" }}
      >
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
      </InfiniteScroll>
    </Box>
  );
};

export default PageTracks;
