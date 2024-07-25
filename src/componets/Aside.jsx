import React from "react";
import Album from "@mui/icons-material/Album";
import Audiotrack from "@mui/icons-material/Audiotrack";
import { NavLink, Outlet } from "react-router-dom";
import Grid from "@mui/material/Grid";
import { Box } from "@mui/material";
import AudiotrackOutlinedIcon from "@mui/icons-material/AudiotrackOutlined";
import AlbumOutlinedIcon from "@mui/icons-material/AlbumOutlined";

const Aside = () => {
  return (
    <Grid
      container
      sx={{
        paddingTop: "45px",
        height: "100%",
        display: "flex",
        flexWrap: "nowrap",
      }}
    >
      <Grid
        item
        sx={{
          position: "fixed",
          top: '30px', 
          left: 0, 
          height: "100vh", 
          width: "300px",
          padding: "30px",
          opacity: "0.8",
          display: "flex",
          flexDirection: "column",
          borderRadius: "4px",
         
        
          overflowY: "auto", 
        }}
      >
        <p
          style={{
            color: "#9c9b94",
            fontSize: "20px",
            fontWeight: "500",
            marginBottom: "20px",
          }}
        >
          Меню
        </p>
        <NavLink
          to="/playlists"
          style={{ textDecoration: "none" }}
        >
          <Box
            className="icon"
            sx={{
              display: "flex",
              alignItems: "center",
              padding: "10px",
              width: "100%",
            }}
          >
            <Album />
            <span
              className="link"
              style={{ marginLeft: "10px", color: "#f1fbff" }}
            >
              Плейлисти
            </span>
          </Box>
        </NavLink>
        <NavLink to="/tracks" style={{textDecoration: "none" }}>
          <Box
            className="icon"
            sx={{
              display: "flex",
              alignItems: "center",
              padding: "10px",
              width: "100%",
            }}
          >
            <Audiotrack />
            <span
              className="link"
              style={{marginLeft: "10px", color: "#f1fbff" }}
            >
              Треки
            </span>
          </Box>
        </NavLink>

        <NavLink to="/myPlaylist" style={{ textDecoration: "none" }}>
          <Box
            className="icon"
            sx={{
              display: "flex",
              alignItems: "center",
              padding: "10px",
              width: "100%",
            }}
          >
            <AlbumOutlinedIcon />
            <span
              className="link"
              style={{ marginLeft: "10px", color: "#f1fbff" }}
            >
              Мої плейлисти
            </span>
          </Box>
        </NavLink>

        <NavLink to="/myTracks" style={{ textDecoration: "none" }}>
          <Box
            className="icon"
            sx={{
              display: "flex",
              alignItems: "center",
              padding: "10px",
              width: "100%",
            }}
          >
            <AudiotrackOutlinedIcon />
            <span
              className="link"
              style={{ marginLeft: "10px", color: "#f1fbff" }}
            >
              Мої треки
            </span>
          </Box>
        </NavLink>
      </Grid>
      <Grid item sx={{ flexGrow: "1", marginLeft: "300px" }}> {/* Добавляем marginLeft для контента */}
        <Outlet />
      </Grid>
    </Grid>
  );
};

export default Aside;
