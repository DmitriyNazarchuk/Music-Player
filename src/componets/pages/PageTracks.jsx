import React, { useState, useMemo, useEffect } from "react";
import { useGetTracksQuery, useGetTracksCountQuery } from "../../redux/api";
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
  IconButton,
  InputBase,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { setTrack, play, pause, replay } from "../../redux/slice/playerSlice";
import TrackList from "./TrackList";
import InfiniteScroll from "react-infinite-scroll-component";

const tracksPerPage = 50;

const PageTracks = () => {
  const dispatch = useDispatch();
  const [page, setPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const track = useSelector((state) => state.persistedReducer.player.track);
  const isPlaying = useSelector(
    (state) => state.persistedReducer.player.isPlaying
  );
  const { data: playlist, isLoading, title} = useGetTracksQuery({
    skip: tracksPerPage * page,
    limit: tracksPerPage,
    title: searchQuery,
  });

  const { data: count } = useGetTracksCountQuery({
    title: searchQuery,
  });
  const [displayedTracks, setDisplayedTracks] = useState([]);
  console.log(count, displayedTracks);

  useEffect(() => {
    if (playlist && playlist.TrackFind && playlist.TrackFind.length) {
      console.log(playlist);
      setDisplayedTracks((tracks) => [...tracks, ...playlist.TrackFind]);
    }
  }, [playlist]);

  const fetchMoreTracks = () => {
    setPage((page) => page + 1);
  };

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
        <InputBase
          sx={{ width: "400px", color: "#000" }}
          placeholder="Пошук музики…"
          value={searchQuery}
          onChange={(e) => {
            setPage(0);
            setDisplayedTracks([]);
            setSearchQuery(e.target.value);
          }}
        />
      </CardContent>
      <InfiniteScroll
        dataLength={displayedTracks.length}
        next={fetchMoreTracks}
        hasMore={displayedTracks.length < count.TrackCount}
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
              tracks={displayedTracks}
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
