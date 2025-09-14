import React, { useState, useEffect } from 'react';
import { FaPlay, FaPause } from 'react-icons/fa';
import { SkipForward, SkipBack, Volume2, Download } from 'lucide-react';
import { useAudio } from '../context/AudioContext';

function GlobalAudioPlayer() {
  const { state, dispatch, audioRef } = useAudio();
  const [currentAudio, setCurrentAudio] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);

  useEffect(() => {
    if (state.currentSong && state.currentSong.url) {
      loadSong(state.currentSong);
    }
  }, [state.currentSong]);

  useEffect(() => {
    if (currentAudio) {
      if (state.isPlaying && !isPlaying) {
        currentAudio.play().catch(console.error);
        setIsPlaying(true);
      } else if (!state.isPlaying && isPlaying) {
        currentAudio.pause();
        setIsPlaying(false);
      }
    }
  }, [state.isPlaying, currentAudio, isPlaying]);

  const loadSong = async (song) => {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.src = '';
    }

    try {
      const audio = new Audio(song.url);
      audio.volume = volume;
      
      audio.addEventListener('loadedmetadata', () => {
        setDuration(audio.duration);
        dispatch({ type: 'SET_DURATION', payload: audio.duration });
      });

      audio.addEventListener('timeupdate', () => {
        setCurrentTime(audio.currentTime);
        dispatch({ type: 'SET_CURRENT_TIME', payload: audio.currentTime });
      });

      audio.addEventListener('ended', () => {
        setIsPlaying(false);
        dispatch({ type: 'TOGGLE_PLAY' });
        // Auto play next song if available
        if (state.playlist.length > 1) {
          dispatch({ type: 'NEXT_SONG' });
        }
      });

      audio.addEventListener('error', (e) => {
        console.error('Audio error:', e);
        setIsPlaying(false);
      });

      setCurrentAudio(audio);
      audioRef.current = audio;

      if (state.isPlaying) {
        await audio.play();
        setIsPlaying(true);
      }

    } catch (error) {
      console.error('Error loading song:', error);
    }
  };

  const togglePlayPause = async () => {
    if (currentAudio) {
      if (isPlaying) {
        currentAudio.pause();
        setIsPlaying(false);
        dispatch({ type: 'TOGGLE_PLAY' });
      } else {
        try {
          await currentAudio.play();
          setIsPlaying(true);
          dispatch({ type: 'TOGGLE_PLAY' });
        } catch (error) {
          console.error('Error playing audio:', error);
        }
      }
    }
  };

  const handleProgressClick = (e) => {
    if (currentAudio) {
      const progressBar = e.currentTarget;
      const rect = progressBar.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const width = rect.width;
      const newTime = (clickX / width) * duration;
      
      currentAudio.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    dispatch({ type: 'SET_VOLUME', payload: newVolume });
    if (currentAudio) {
      currentAudio.volume = newVolume;
    }
  };

  const nextSong = () => {
    if (state.playlist.length > 1) {
      dispatch({ type: 'NEXT_SONG' });
    }
  };

  const prevSong = () => {
    if (state.playlist.length > 1) {
      dispatch({ type: 'PREV_SONG' });
    }
  };

  const formatTime = (time) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const downloadSong = () => {
    if (state.currentSong && state.currentSong.url) {
      const link = document.createElement('a');
      link.href = state.currentSong.url;
      link.download = `${state.currentSong.title} - ${state.currentSong.artist}.mp3`;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (!state.currentSong) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-700 z-50 shadow-2xl">
      <div className="max-w-screen-xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Song Info */}
          <div className="flex items-center gap-4 min-w-0 flex-1 max-w-sm">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg">
              <span className="text-white font-bold text-lg">
                {state.currentSong.title.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="min-w-0">
              <div className="text-white font-semibold truncate text-sm">
                {state.currentSong.title}
              </div>
              <div className="text-gray-400 text-xs truncate">
                {state.currentSong.artist}
              </div>
            </div>
          </div>

          {/* Main Controls */}
          <div className="flex flex-col items-center gap-2 flex-1 max-w-lg">
            {/* Control Buttons */}
            <div className="flex items-center gap-4">
              <button
                onClick={prevSong}
                className="text-gray-400 hover:text-white transition-colors disabled:opacity-50"
                disabled={state.playlist.length <= 1}
                title="Previous"
              >
                <SkipBack size={20} />
              </button>
              
              <button
                onClick={togglePlayPause}
                className="bg-white text-black rounded-full p-3 hover:bg-gray-200 transition-all transform hover:scale-105 shadow-lg"
                title={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <FaPause size={18} /> : <FaPlay size={18} />}
              </button>
              
              <button
                onClick={nextSong}
                className="text-gray-400 hover:text-white transition-colors disabled:opacity-50"
                disabled={state.playlist.length <= 1}
                title="Next"
              >
                <SkipForward size={20} />
              </button>
            </div>

            {/* Progress Bar */}
            <div className="flex items-center gap-3 w-full">
              <span className="text-xs text-gray-400 min-w-0 font-mono">
                {formatTime(currentTime)}
              </span>
              
              <div 
                className="flex-1 h-2 bg-gray-700 rounded-full cursor-pointer relative group"
                onClick={handleProgressClick}
              >
                <div 
                  className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full relative transition-all"
                  style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                >
                  <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
              </div>
              
              <span className="text-xs text-gray-400 min-w-0 font-mono">
                {formatTime(duration)}
              </span>
            </div>
          </div>

          {/* Volume and Actions */}
          <div className="flex items-center gap-4 flex-1 max-w-sm justify-end">
            <button
              onClick={downloadSong}
              className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-800 rounded-full"
              title="Download"
            >
              <Download size={18} />
            </button>
            
            <div className="flex items-center gap-2">
              <Volume2 size={18} className="text-gray-400" />
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={handleVolumeChange}
                className="w-24 h-1 bg-gray-700 rounded-full appearance-none cursor-pointer slider"
                title={`Volume: ${Math.round(volume * 100)}%`}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GlobalAudioPlayer;