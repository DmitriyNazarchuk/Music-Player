import React from "react";
import { TableBody, TableRow, TableCell, IconButton } from "@mui/material";
import { PlayArrow, PauseRounded } from "@mui/icons-material";

const TrackList = ({ tracks, track, isPlaying, handlePlay, handleStop }) => {
    return (
        
      <TableBody>
        {tracks &&
          Array.isArray(tracks) &&
          tracks.map((item, index) => (
            <TableRow key={index}>
              <TableCell>
                {track?._id === item._id && isPlaying === true ? (
                  <IconButton
                    onClick={() => {
                      console.log(isPlaying, track);
                      handleStop();
                    }}
                  >
                    <PauseRounded />
                  </IconButton>
                ) : (
                  <IconButton
                    onClick={() => {
                      handlePlay(item);
                    }}
                  >
                    <PlayArrow />
                  </IconButton>
                )}
              </TableCell>
              <TableCell>
                {item.id3 === null
                  ? "Без назви"
                  : item.id3.title !== null
                  ? item.id3.title
                  : "Без назви"}
              </TableCell>
              <TableCell>
                {item.id3 === null
                  ? "Без назви"
                  : item.id3.album !== null
                  ? item.id3.album
                  : "Без назви"}
              </TableCell>
              <TableCell>
                {item.id3 === null
                  ? "Без назви"
                  : item.id3.artist !== null
                  ? item.id3.artist
                  : "Без назви"}
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    );
  };
  
  export default TrackList;