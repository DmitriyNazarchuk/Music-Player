import { createSlice } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";

const initialState = {
  isPlaying: false,
  isStopped: true,
  duration: 0,
  track: null,
  playlist: null,
  playlistIndex: 0,
  currentTime: 0,
  volume: 0.5,
  error: null,
};

export const audio = new Audio();
audio.crossOrigin = "anonymous";

let audioContext, analyser, source;

document.body.onclick = () => {
  if (audioContext) return;
  audioContext = new (window.AudioContext || window.webkitAudioContext)();
// Analyser
  analyser = audioContext.createAnalyser();
  analyser.fftSize = 256;

  source = audioContext.createMediaElementSource(audio); 


  source.connect(analyser);
  source.connect(audioContext.destination);
};

export const getAnalyser = () => analyser;

const playerSlice = createSlice({
  name: "player",
  initialState,
  reducers: {
    play(state) {
        
      if (state.track && state.track.url) {
          if (audio.src !== `${backendUrl}${state.track.url}`) {
              audio.src = `${backendUrl}${state.track.url}`
              audio.load()
              audio.addEventListener('canplaythrough', 
                audio.play, 
                false);
          }
          audio.volume = state.volume;
          // audio.play()
          state.isPlaying = true
          state.isStopped = false
      }
    },
    
  // Реплей
  replay(state) {
    if (state.track && state.track.url) {
      if (audio.src !== `${backendUrl}${state.track.url}`) {
        audio.src = `${backendUrl}${state.track.url}`
        audio.load()
      }
      audio.currentTime = state.currentTime;
      audio.volume = state.volume;
      audio.play();
      state.isPlaying = true;
      state.isStopped = false;
    }
  },

    
    pause(state) {
      audio.pause();
      state.isPlaying = false;
    },
    stop(state) {
      state.currentTime = 0;
      audio.pause();
      
      
    },
    setTrack(state, { payload }) {
      state.track = payload;
    },
    setDuration(state, { payload }) {
      state.duration = payload;
    },
    nextTrack(state) {
      if (state.playlist && state.playlist.tracks) {
        const nextIndex = state.playlistIndex + 1;

        if (state.playlist.tracks[nextIndex]) {
          state.track = state.playlist.tracks[nextIndex];
          state.playlistIndex = nextIndex;
        }
      }
    },
    prevTrack(state) {
      if (state.playlist && state.playlist.tracks) {
        const prevIndex = state.playlistIndex - 1;
        if (state.playlist.tracks[prevIndex]) {
          state.track = state.playlist.tracks[prevIndex];
          state.playlistIndex = prevIndex;
        }
      }
    },
    setPlaylist(state, { payload }) {
      if (payload === null) {
        state.playlist = null;
        state.playlistIndex = 0;
        return;
      }
      const validTracks = payload.tracks.filter((track) => track.url);

      state.playlist = { ...payload, tracks: validTracks };
      if (state.track && state.playlist) {
        const trackIndex = state.playlist.tracks.findIndex(
          (track) => track._id === state.track._id
        );
        if (trackIndex !== -1) {
          state.playlistIndex = trackIndex;
        } else {
          state.playlistIndex = 0;
        }
      } else {
        state.playlistIndex = 0;
      }
    },
    setCurrentTime(state, { payload }) {
      state.currentTime = payload;
      if (audio.currentTime !== payload) {
        audio.currentTime = payload;
        state.currentTime = payload;
      }
    },
    setVolume(state, { payload }) {
      audio.volume = payload;
      state.volume = payload;
    },
  },
});

export const {
  play,
  replay,
  pause,
  stop,
  setTrack,
  setDuration,
  nextTrack,
  prevTrack,
  setPlaylist,
  setCurrentTime,
  setVolume,
} = playerSlice.actions;

export default playerSlice.reducer;

export const backendUrl = "http://player.node.ed.asmer.org.ua/";
