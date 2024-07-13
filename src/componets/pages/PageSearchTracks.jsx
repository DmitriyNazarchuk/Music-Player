import React, { useState } from 'react';
import { CardContent, IconButton, Grid, Table, TableCell, TableContainer, TableRow, TableHead, Box, Paper, Typography, TableBody } from "@mui/material";
import { useDispatch, useSelector } from 'react-redux';
import { PlayArrow } from "@mui/icons-material";
import PauseRounded from '@mui/icons-material/PauseRounded';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { setTrack, play, stop } from '../../redux/slice/playerSlice';

const PageSearchTracks = () => {
    const dispatch = useDispatch();
    const playerState = useSelector(state => state.persistedReducer.player);
    const tracks = useSelector((state) => state.persistedReducer.search.searchTracks);
    const [track, setTrackById] = useState(playerState.track);
    
    const totalTracks = tracks?.length || 0;
    const tracksPerPage = 50;
    const totalPages = Math.ceil(totalTracks / tracksPerPage);
    const [currentPage, setCurrentPage] = useState(1); 
    const startIndex = (currentPage - 1) * tracksPerPage;
    const endIndex = startIndex + tracksPerPage;
    const tracksToDisplay = tracks?.slice(startIndex, endIndex);
  
    const handlePageChange = (event, newPage) => {
        setCurrentPage(newPage);
    };

    const handlePlay = (track) => {
        setTrackById(track);
        dispatch(setTrack(track));
        dispatch(play());
    };

    const handleStop = () => {
        dispatch(stop());
    };

    return (
        <Grid container sx={{ mx: 5, my: 3, width: '80%' }}>
            {tracksToDisplay.length <= 0 ?
                <Box>
                    <CardContent sx={{ width: '100%' }} >
                        <Typography component="h1" variant="h4" sx={{ marginBottom: '30px' }}>Жодного треку за запитом не знайдено</Typography>
                    </CardContent>
                </Box>
                :
                <>
                    <Box>
                        <CardContent sx={{ width: '100%' }} >
                            <Typography component="h1" variant="h4" sx={{ marginBottom: '30px' }}>Знайдено такі треки</Typography>
                        </CardContent>
                    </Box>
                    <TableContainer component={Paper} sx={{ width: '100%' }} >
                        <Table aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell><IconButton /></TableCell>
                                    <TableCell>Назва</TableCell>
                                    <TableCell>Альбом</TableCell>
                                    <TableCell>Виконавець</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {tracksToDisplay?.map((result, index) =>
                                    <TableRow key={index}>
                                        <TableCell >
                                            {playerState?.track?._id === result._id && playerState?.isPlaying === true ?
                                                <IconButton onClick={() => { handleStop() }}>
                                                    <PauseRounded />
                                                </IconButton>
                                                :
                                                <IconButton onClick={() => { handlePlay(result) }}>
                                                    <PlayArrow />
                                                </IconButton>
                                            }
                                        </TableCell>
                                        <TableCell >
                                            {result.id3 === null ? 'Без назви' : result.id3.title !== null ? result.id3.title : 'Без назви'}
                                        </TableCell>
                                        <TableCell >
                                            {result.id3 === null ? 'Без назви' : result.id3.album !== null ? result.id3.album : 'Без назви'}
                                        </TableCell>
                                        <TableCell >
                                            {result.id3 === null ? 'Без назви' : result.id3.artist !== null ? result.id3.artist : 'Без назви'}
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Stack spacing={2} sx={{ my: 2 }}>
                        <Pagination
                            count={totalPages}
                            page={currentPage}
                            onChange={handlePageChange}
                        />
                    </Stack>
                </>
            }
        </Grid>
    )
}

export default PageSearchTracks;