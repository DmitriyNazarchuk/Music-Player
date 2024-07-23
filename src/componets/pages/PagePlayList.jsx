import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { CircularProgress } from "@mui/material";
import { useGetPlaylistQuery } from '../../redux/api';
import { useNavigate } from "react-router-dom";


export default function PagePlaylist() {

  const { isLoading, data } = useGetPlaylistQuery();

  const navigate = useNavigate();

  const toPlaylist = async (id) => {
    navigate(`/playlist/${id}`);
    localStorage.setItem('Playlist', 'StrangerPlaylist')
  };

  return isLoading ?
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '100px' }}>
            <CircularProgress />
          </Box> :
          <>
            <Box sx={{ margin: '40px' }}>
              <Typography component="h1" variant="h4" sx={{color:"#d1d8d6", marginBottom: '5px' }}>Плейлисти</Typography>
            </Box>
            <Grid item sx={{ display: 'flex', flexWrap: 'wrap' }}>
              {data?.PlaylistFind?.map((playlist, index) => (
                playlist._id && playlist.name ?
                  <Grid item key={index} sx={{ margin: '30px' }}>
                    <Card sx={{background: "radial-gradient(circle, rgba(48,46,37,1) 0%, rgba(74,68,48,1) 56%);",minWidth: 300, height: 180 }} >
                      <CardContent>
                        <Typography sx={{color:"#d1d8d6"}} gutterBottom variant="h5" component="div">
                          {playlist.name ? playlist.name : 'Назви немає'}
                        </Typography>
                        <Typography sx={{color:"#d1d8d6"}} variant="body2" color="text.secondary">
                          {playlist.description || `Description`}
                        </Typography>
                      </CardContent>
                      <CardActions >
                        <Button sx={{color:"#d1d8d6"}} size="small" onClick={() => { toPlaylist(playlist._id) }}>Детальніше</Button>
                      </CardActions>
                    </Card>
                  </Grid>
                  : null
              ))}
            </Grid>
          </>
}