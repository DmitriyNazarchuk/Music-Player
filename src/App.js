import React, { useState, useEffect } from "react";
import './App.css';
import store from "./redux/store";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './componets/Header';
import Aside from './componets/Aside';
import PageMain from './componets/pages/PageMain';
import PageSearchTracks from './componets/pages/PageSearchTracks';
import PageTracks from './componets/pages/PageTracks'
import FooterPlayer from "./componets/FooterPlayer";
import {useSelector} from 'react-redux';
import PagePlayList from "./componets/pages/PagePlayList";
import PageSinglePlaylist from "./componets/pages/PageSinglePlaylist";

function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(store.getState().auth);
  const isPlaying = useSelector(state => state.persistedReducer.player.isPlaying);
  
  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      let time = store.getState().persistedReducer.player.currentTime;
      if(isPlaying) {
        document.title = `Аудіо плеєр ${Math.floor(time / 60) < 10 ? "0" : ""}${Math.floor(time / 60)} : ${Math.round(time % 60) < 10 ? "0" : ""}${Math.round(time % 60)}`
      } else {
        document.title = `Аудіо плеєр`;
      }
      const authState = store.getState().persistedReducer.auth;
      setIsLoggedIn(authState.token);
    })
    return () => unsubscribe()
  }, [isPlaying])

  return (
    <Router>
      <Header props={isLoggedIn}></Header>
      <Routes>
        {isLoggedIn ?
          <>
            <Route element={<Aside />} >
              <Route path="/" element={<PageMain props={isLoggedIn} />} /> 
              <Route path="tracks" element={<PageTracks />} />
              <Route path="playlists" element={<PagePlayList />} />
              <Route path="search" element={<PageSearchTracks />} />
              <Route path="playlist/:id" element={<PageSinglePlaylist/>} />

            </Route>
          </>
          :
          <>
            <Route path="/" element={<PageMain props={isLoggedIn} />} />
            <Route element={<Aside />} >
            <Route path="playlists" element={<PagePlayList />} />
            <Route path="search" element={<PageSearchTracks />} />
            <Route path="playlist/:id" element={<PageSinglePlaylist/>} />


             
            </Route>
          </>
        }
      </Routes>
      {isLoggedIn && <FooterPlayer />}
    </Router>
  );
}


export default App;
