import React, { createContext, useContext, useReducer, useState, useRef } from 'react';
import GlobalAudioPlayer from '../components/GlobalAudioPlayer';

const AudioContext = createContext();

const audioReducer = (state, action) => {
  switch (action.type) {
    case 'SET_CURRENT_SONG':
      return { ...state, currentSong: action.payload, isPlaying: true };
    case 'TOGGLE_PLAY':
      return { ...state, isPlaying: !state.isPlaying };
    case 'SET_PLAYLIST':
      return { ...state, playlist: action.payload };
    case 'SET_CURRENT_TIME':
      return { ...state, currentTime: action.payload };
    case 'SET_DURATION':
      return { ...state, duration: action.payload };
    case 'SET_VOLUME':
      return { ...state, volume: action.payload };
    case 'NEXT_SONG':
      const currentIndex = state.playlist.findIndex(song => song.id === state.currentSong?.id);
      const nextIndex = (currentIndex + 1) % state.playlist.length;
      return { 
        ...state, 
        currentSong: state.playlist[nextIndex] || null,
        isPlaying: true 
      };
    case 'PREV_SONG':
      const prevCurrentIndex = state.playlist.findIndex(song => song.id === state.currentSong?.id);
      const prevIndex = prevCurrentIndex === 0 ? state.playlist.length - 1 : prevCurrentIndex - 1;
      return { 
        ...state, 
        currentSong: state.playlist[prevIndex] || null,
        isPlaying: true 
      };
    default:
      return state;
  }
};

export const AudioProvider = ({ children }) => {
  const [state, dispatch] = useReducer(audioReducer, {
    currentSong: null,
    playlist: [],
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 0.7
  });

  const audioRef = useRef(null);

  return (
    <AudioContext.Provider value={{ state, dispatch, audioRef }}>
      {children}
      <GlobalAudioPlayer />
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};