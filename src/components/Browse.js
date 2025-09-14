import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { musicAPI } from '../services/musicAPI';
import SongGrid from './SongGrid';
import { Music, Headphones, TrendingUp, Clock, ArrowLeft } from 'lucide-react';

function Browse() {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    fetchSongs();
  }, []);

  const fetchSongs = async () => {
    try {
      setLoading(true);
      const response = await musicAPI.getSongs();
      
      // Get signed URLs for each song
      const songsWithUrls = await Promise.all(
        response.map(async (song) => {
          try {
            const url = await musicAPI.getSongUrl(song.fileKey);
            // console.log('Generated URL for', song.title, ':', url);
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

  const categories = [
    { id: 'all', name: 'All Music', icon: <Music size={20} /> },
    { id: 'trending', name: 'Trending', icon: <TrendingUp size={20} /> },
    { id: 'recent', name: 'Recently Added', icon: <Clock size={20} /> },
    { id: 'popular', name: 'Most Popular', icon: <Headphones size={20} /> },
  ];

  const handlePlaySong = (song) => {
    // console.log('Playing song via Browse component:', song.title, 'URL:', song.url);
    // Remove the local audio creation - let the global player handle it
    // The SongGrid component will handle this through the global context
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white pb-24">
      {/* Navigation Header */}
      {/* <div className="bg-gray-800 px-6 py-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <Link 
            to="/" 
            className="flex items-center gap-3 text-white hover:text-gray-300 transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="font-semibold">Back to SoundWave</span>
          </Link>
          
          <div className="flex gap-4">
            <Link to="/search" className="text-gray-300 hover:text-white">Search</Link>
            <Link to="/upload" className="bg-white text-gray-900 px-4 py-2 rounded hover:bg-gray-100">Upload</Link>
          </div>
        </div>
      </div> */}

      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Browse Music</h1>
          <p className="text-gray-400">Discover new sounds and artists</p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-3 mb-8">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
                selectedCategory === category.id
                  ? 'bg-green-500 text-black'
                  : 'bg-gray-800 text-white hover:bg-gray-700'
              }`}
            >
              {category.icon}
              {category.name}
            </button>
          ))}
        </div>

        {/* Songs Grid */}
        {songs.length > 0 ? (
          <SongGrid songs={songs} onPlaySong={handlePlaySong} />
        ) : (
          <div className="text-center py-16">
            <Music size={64} className="mx-auto text-gray-600 mb-4" />
            <h3 className="text-xl text-gray-400 mb-2">No music found</h3>
            <p className="text-gray-500">Be the first to upload some tracks!</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Browse;