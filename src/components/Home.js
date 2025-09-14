import React, { useState, useEffect, useRef } from 'react';
// import { API } from 'aws-amplify';
// import { Storage } from 'aws-amplify';
import { generateClient } from 'aws-amplify/api';
import { uploadData, getUrl, downloadData } from 'aws-amplify/storage';
import { 
  Play, 
  Pause, 
  Download, 
  SkipForward, 
  SkipBack, 
  Volume2,
  Heart,
  Shuffle,
  Repeat,
  Music
} from 'lucide-react';

const client = generateClient();

function Home() {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPlaying, setCurrentPlaying] = useState(null);
  const [audio, setAudio] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);

  useEffect(() => {
    fetchSongs();
  }, []);

  useEffect(() => {
    if (audio) {
      const updateTime = () => setCurrentTime(audio.currentTime);
      const updateDuration = () => setDuration(audio.duration);
      
      audio.addEventListener('timeupdate', updateTime);
      audio.addEventListener('loadedmetadata', updateDuration);
      
      return () => {
        audio.removeEventListener('timeupdate', updateTime);
        audio.removeEventListener('loadedmetadata', updateDuration);
      };
    }
  }, [audio]);

  const fetchSongs = async () => {
    try {
      const response = await client.get({ apiName: 'musicapi', path: '/songs' })//API.get('musicapi', '/songs');
      
      const songsWithUrls = await Promise.all(
        response.map(async (song) => {
          try {
            const url = await getUrl({ key: song.fileKey })//Storage.get(song.fileKey);
            return { ...song, url };
          } catch (error) {
            console.error('Error getting song URL:', error);
            return song;
          }
        })
      );
      
      setSongs(songsWithUrls);
    } catch (error) {
      console.error('Error fetching songs:', error);
    } finally {
      setLoading(false);
    }
  };

  const playPause = (song, index) => {
    if (currentPlaying === song.id) {
      if (audio && !audio.paused) {
        audio.pause();
        setCurrentPlaying(null);
      } else if (audio) {
        audio.play();
        setCurrentPlaying(song.id);
      }
    } else {
      if (audio) {
        audio.pause();
      }
      
      const newAudio = new Audio(song.url);
      newAudio.volume = volume;
      newAudio.play();
      setAudio(newAudio);
      setCurrentPlaying(song.id);
      setCurrentSongIndex(index);
      
      newAudio.onended = () => {
        setCurrentPlaying(null);
        nextSong();
      };
    }
  };

  const nextSong = () => {
    const nextIndex = (currentSongIndex + 1) % songs.length;
    if (songs[nextIndex]) {
      playPause(songs[nextIndex], nextIndex);
    }
  };

  const previousSong = () => {
    const prevIndex = currentSongIndex === 0 ? songs.length - 1 : currentSongIndex - 1;
    if (songs[prevIndex]) {
      playPause(songs[prevIndex], prevIndex);
    }
  };

  const formatTime = (time) => {
    if (isNaN(time)) return '00:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleProgressClick = (e) => {
    if (audio) {
      const progressBar = e.currentTarget;
      const clickX = e.nativeEvent.offsetX;
      const width = progressBar.offsetWidth;
      const newTime = (clickX / width) * duration;
      audio.currentTime = newTime;
    }
  };

  const currentSong = songs.find(song => song.id === currentPlaying);

  if (loading) {
    return (
      <div style={{ 
        padding: '4rem', 
        textAlign: 'center',
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
        minHeight: 'calc(100vh - 80px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        <div style={{
          width: '50px',
          height: '50px',
          border: '3px solid #333',
          borderTop: '3px solid #4ecdc4',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <p style={{ color: '#ccc' }}>Loading your music...</p>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: 'calc(100vh - 80px)',
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%)',
      position: 'relative'
    }}>
      {/* Main Content */}
      <div style={{ padding: '2rem' }}>
        {/* Current Playing Display - Sony Walkman Style */}
        {currentSong && (
          <div style={{
            background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 50%, #1a1a1a 100%)',
            borderRadius: '20px',
            padding: '2rem',
            marginBottom: '2rem',
            border: '1px solid #333',
            boxShadow: '0 10px 40px rgba(0,0,0,0.6)',
            backdropFilter: 'blur(20px)'
          }}>
            {/* Album Art Area */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.5rem'
            }}>
              <div style={{
                width: '200px',
                height: '200px',
                background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4)',
                borderRadius: '15px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 10px 30px rgba(78, 205, 196, 0.3)'
              }}>
                <Music size={80} color="white" />
              </div>
            </div>

            {/* Song Info */}
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <div style={{
                fontSize: '0.85rem',
                color: '#4ecdc4',
                marginBottom: '0.5rem',
                letterSpacing: '1px',
                fontWeight: '500'
              }}>
                NOW PLAYING
              </div>
              <h2 style={{ 
                margin: '0 0 0.5rem 0',
                fontSize: '1.8rem',
                fontWeight: '300',
                color: '#fff'
              }}>
                {currentSong.title}
              </h2>
              <p style={{ 
                margin: 0,
                color: '#ccc',
                fontSize: '1.1rem',
                fontWeight: '300'
              }}>
                {currentSong.artist}
              </p>
            </div>

            {/* Progress Bar */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '0.5rem',
                fontSize: '0.85rem',
                color: '#ccc'
              }}>
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
              <div 
                onClick={handleProgressClick}
                style={{
                  width: '100%',
                  height: '6px',
                  background: '#333',
                  borderRadius: '3px',
                  cursor: 'pointer',
                  position: 'relative'
                }}
              >
                <div style={{
                  width: `${duration ? (currentTime / duration) * 100 : 0}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #4ecdc4, #45b7d1)',
                  borderRadius: '3px',
                  position: 'relative'
                }}>
                  <div style={{
                    position: 'absolute',
                    right: '-8px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '16px',
                    height: '16px',
                    background: '#4ecdc4',
                    borderRadius: '50%',
                    boxShadow: '0 2px 10px rgba(78, 205, 196, 0.5)'
                  }} />
                </div>
              </div>
            </div>

            {/* Controls */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '1.5rem'
            }}>
              <ControlButton icon={<Shuffle size={20} />} />
              <ControlButton 
                icon={<SkipBack size={24} />} 
                onClick={previousSong}
                size="medium"
              />
              <ControlButton 
                icon={currentPlaying ? <Pause size={28} /> : <Play size={28} />}
                onClick={() => playPause(currentSong, currentSongIndex)}
                primary
                size="large"
              />
              <ControlButton 
                icon={<SkipForward size={24} />} 
                onClick={nextSong}
                size="medium"
              />
              <ControlButton icon={<Repeat size={20} />} />
            </div>
          </div>
        )}

        {/* Song List */}
        <div>
          <h2 style={{ 
            marginBottom: '1.5rem',
            color: '#fff',
            fontWeight: '300',
            fontSize: '1.5rem'
          }}>
            Your Library
          </h2>
          
          {songs.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '4rem',
              color: '#666',
              background: 'rgba(255,255,255,0.03)',
              borderRadius: '15px',
              border: '1px solid #333'
            }}>
              <Music size={64} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
              <h3>No songs available</h3>
              <p>Upload some music to get started!</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '0.5rem' }}>
              {songs.map((song, index) => (
                <SongItem
                  key={song.id}
                  song={song}
                  index={index}
                  isPlaying={currentPlaying === song.id}
                  onPlay={() => playPause(song, index)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ControlButton({ icon, onClick, primary = false, size = "small" }) {
  const sizes = {
    small: '44px',
    medium: '50px',
    large: '64px'
  };

  return (
    <button
      onClick={onClick}
      style={{
        width: sizes[size],
        height: sizes[size],
        borderRadius: '50%',
        border: 'none',
        background: primary 
          ? 'linear-gradient(45deg, #4ecdc4, #45b7d1)' 
          : 'rgba(255,255,255,0.1)',
        color: 'white',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.3s ease',
        backdropFilter: 'blur(10px)',
        boxShadow: primary 
          ? '0 8px 25px rgba(78, 205, 196, 0.3)' 
          : '0 4px 15px rgba(0,0,0,0.3)'
      }}
      onMouseOver={(e) => {
        e.target.style.transform = 'translateY(-2px)';
        e.target.style.boxShadow = primary 
          ? '0 12px 35px rgba(78, 205, 196, 0.4)' 
          : '0 8px 25px rgba(0,0,0,0.4)';
      }}
      onMouseOut={(e) => {
        e.target.style.transform = 'translateY(0)';
        e.target.style.boxShadow = primary 
          ? '0 8px 25px rgba(78, 205, 196, 0.3)' 
          : '0 4px 15px rgba(0,0,0,0.3)';
      }}
    >
      {icon}
    </button>
  );
}

function SongItem({ song, index, isPlaying, onPlay }) {
  const downloadSong = async (e) => {
    e.stopPropagation();
    try {
      const url = await downloadData({ key: song.fileKey })//Storage.get(song.fileKey, { download: true });
      const link = document.createElement('a');
      link.href = url;
      link.download = song.title;
      link.click();
    } catch (error) {
      console.error('Error downloading song:', error);
    }
  };

  return (
    <div
      onClick={onPlay}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1rem 1.5rem',
        background: isPlaying 
          ? 'rgba(78, 205, 196, 0.1)' 
          : 'rgba(255,255,255,0.03)',
        borderRadius: '12px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        border: isPlaying 
          ? '1px solid rgba(78, 205, 196, 0.3)' 
          : '1px solid transparent',
        backdropFilter: 'blur(10px)'
      }}
      onMouseOver={(e) => {
        if (!isPlaying) {
          e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
        }
      }}
      onMouseOut={(e) => {
        if (!isPlaying) {
          e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
        }
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{
          width: '50px',
          height: '50px',
          borderRadius: '8px',
          background: isPlaying 
            ? 'linear-gradient(45deg, #4ecdc4, #45b7d1)' 
            : 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative'
        }}>
          {isPlaying ? (
            <Pause size={20} color="white" />
          ) : (
            <Play size={20} color="white" />
          )}
        </div>
        
        <div>
          <h3 style={{ 
            margin: '0 0 0.25rem 0',
            fontSize: '1.1rem',
            fontWeight: '400',
            color: isPlaying ? '#4ecdc4' : '#fff'
          }}>
            {song.title}
          </h3>
          <p style={{ 
            margin: 0,
            color: '#ccc',
            fontSize: '0.9rem'
          }}>
            {song.artist}
          </p>
        </div>
      </div>
      
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button
          onClick={downloadSong}
          style={{
            background: 'rgba(255,255,255,0.1)',
            color: '#ccc',
            border: 'none',
            padding: '0.5rem',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            backdropFilter: 'blur(10px)'
          }}
          onMouseOver={(e) => {
            e.target.style.background = 'rgba(78, 205, 196, 0.2)';
            e.target.style.color = '#4ecdc4';
          }}
          onMouseOut={(e) => {
            e.target.style.background = 'rgba(255,255,255,0.1)';
            e.target.style.color = '#ccc';
          }}
        >
          <Download size={16} />
        </button>
      </div>
    </div>
  );
}

export default Home;