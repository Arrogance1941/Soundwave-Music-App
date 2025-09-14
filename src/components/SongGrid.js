import React from 'react';
import { FaPlay, FaPause } from 'react-icons/fa';
import { Download } from 'lucide-react';
import { useAudio } from '../context/AudioContext';

function SongGrid({ songs, onPlaySong }) {
  const { state, dispatch } = useAudio();

  const playPause = (song) => {
    if (state.currentSong?.id === song.id) {
      // Same song - toggle play/pause
      dispatch({ type: 'TOGGLE_PLAY' });
    } else {
      // Different song - play new song
      dispatch({ type: 'SET_CURRENT_SONG', payload: song });
      dispatch({ type: 'SET_PLAYLIST', payload: songs });
    }

    if (onPlaySong) {
      onPlaySong(song);
    }
  };

  const downloadSong = async (song, event) => {
    event.stopPropagation();
    try {
      const link = document.createElement('a');
      link.href = song.url;
      link.download = `${song.title} - ${song.artist}.mp3`;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading song:', error);
      alert('Unable to download this song.');
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-24">
      {songs.map(song => (
        <SongCard 
          key={song.id} 
          song={song} 
          isPlaying={state.currentSong?.id === song.id && state.isPlaying}
          onPlay={() => playPause(song)}
          onDownload={(e) => downloadSong(song, e)}
        />
      ))}
    </div>
  );
}

function SongCard({ song, isPlaying, onPlay, onDownload }) {
  return (
    <div className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition-all duration-300 group cursor-pointer">
      <div className="relative mb-4">
        {/* Album Art Placeholder */}
        <div className="w-full aspect-square bg-gradient-to-br from-purple-600 to-blue-600 rounded-md flex items-center justify-center relative overflow-hidden">
          <div className="text-white text-4xl font-bold opacity-20">
            {song.title.charAt(0).toUpperCase()}
          </div>
          
          {/* Play Button Overlay */}
          <button 
            onClick={onPlay}
            className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
              isPlaying 
                ? 'bg-black bg-opacity-50 opacity-100' 
                : 'bg-black bg-opacity-0 opacity-0 group-hover:opacity-100 group-hover:bg-opacity-50'
            }`}
          >
            <div className="bg-green-500 text-black rounded-full p-4 transform transition-transform duration-300 hover:scale-110">
              {isPlaying ? <FaPause size={24} /> : <FaPlay size={24} />}
            </div>
          </button>
        </div>
      </div>

      {/* Song Info */}
      <div className="space-y-2">
        <h3 className={`font-semibold text-lg truncate transition-colors ${
          isPlaying ? 'text-green-400' : 'text-white group-hover:text-green-400'
        }`}>
          {song.title}
        </h3>
        <p className="text-gray-400 text-sm truncate">
          {song.artist}
        </p>
        
        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={onPlay}
            className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              isPlaying
                ? 'bg-green-500 text-black'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {isPlaying ? <FaPause size={12} /> : <FaPlay size={12} />}
            {isPlaying ? 'Playing' : 'Play'}
          </button>
          
          <button
            onClick={onDownload}
            className="p-2 rounded-full bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white transition-colors"
            title="Download"
          >
            <Download size={16} />
          </button>
        </div>
      </div>

      {/* Playing indicator */}
      {isPlaying && (
        <div className="mt-2 flex items-center gap-1">
          <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse"></div>
          <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
          <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
          <span className="text-xs text-green-400 ml-2">Now Playing</span>
        </div>
      )}
    </div>
  );
}

export default SongGrid;