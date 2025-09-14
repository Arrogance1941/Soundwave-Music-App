import React, { useState, useEffect } from 'react';
import { Search as SearchIcon, Music, X } from 'lucide-react';
import { musicAPI } from '../services/musicAPI';
import SongGrid from './SongGrid';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);

  useEffect(() => {
    // Load recent searches from localStorage
    const stored = localStorage.getItem('recentSearches');
    if (stored) {
      setRecentSearches(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    if (query.trim()) {
      searchSongs(query);
    } else {
      setResults([]);
    }
  }, [query]);

  const searchSongs = async (searchQuery) => {
    try {
      setLoading(true);
      // For now, we'll filter from all songs since we don't have search API yet
      const allSongs = await musicAPI.getSongs();
      const filtered = allSongs.filter(song => 
        song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        song.artist.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setResults(filtered);
      
      // Add to recent searches
      if (searchQuery.trim() && !recentSearches.includes(searchQuery)) {
        const newRecentSearches = [searchQuery, ...recentSearches.slice(0, 4)];
        setRecentSearches(newRecentSearches);
        localStorage.setItem('recentSearches', JSON.stringify(newRecentSearches));
      }
    } catch (error) {
      console.error('Error searching songs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlaySong = (song) => {
    // This will be connected to AudioContext later
    console.log('Playing song:', song.title);
  };

  const clearRecentSearch = (searchTerm) => {
    const updated = recentSearches.filter(term => term !== searchTerm);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

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
            <Link to="/browse" className="text-gray-300 hover:text-white">Browse</Link>
            <Link to="/upload" className="bg-white text-gray-900 px-4 py-2 rounded hover:bg-gray-100">Upload</Link>
          </div>
        </div>
      </div> */}

      <div className="container mx-auto px-6 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-6">Search</h1>
          
          {/* Search Input */}
          <div className="relative max-w-md">
            <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="What do you want to listen to?"
              className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-full text-white placeholder-gray-400 focus:outline-none focus:border-green-500"
            />
          </div>
        </div>

        {/* Recent Searches */}
        {!query && recentSearches.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Recent searches</h2>
            <div className="flex flex-wrap gap-2">
              {recentSearches.map((searchTerm, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 bg-gray-800 px-3 py-2 rounded-full hover:bg-gray-700 transition-colors"
                >
                  <SearchIcon size={16} className="text-gray-400" />
                  <button
                    onClick={() => setQuery(searchTerm)}
                    className="text-sm text-white hover:text-green-500"
                  >
                    {searchTerm}
                  </button>
                  <button
                    onClick={() => clearRecentSearch(searchTerm)}
                    className="text-gray-400 hover:text-white ml-1"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Search Results */}
        {query && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">
                {loading ? 'Searching...' : `Results for "${query}"`}
              </h2>
              {results.length > 0 && (
                <span className="text-gray-400 text-sm">{results.length} songs found</span>
              )}
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
              </div>
            ) : results.length > 0 ? (
              <SongGrid songs={results} onPlaySong={handlePlaySong} />
            ) : (
              <div className="text-center py-16">
                <Music size={64} className="mx-auto text-gray-600 mb-4" />
                <h3 className="text-xl text-gray-400 mb-2">No results found</h3>
                <p className="text-gray-500">Try searching for something else</p>
              </div>
            )}
          </div>
        )}

        {/* Browse Categories (when no search) */}
        {!query && (
          <div>
            <h2 className="text-xl font-semibold mb-6">Browse all</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[
                { name: 'Rock', color: 'bg-red-600' },
                { name: 'Pop', color: 'bg-pink-600' },
                { name: 'Hip Hop', color: 'bg-purple-600' },
                { name: 'Electronic', color: 'bg-blue-600' },
                { name: 'Jazz', color: 'bg-yellow-600' },
                { name: 'Classical', color: 'bg-green-600' },
                { name: 'R&B', color: 'bg-orange-600' },
                { name: 'Country', color: 'bg-teal-600' },
              ].map((genre) => (
                <div
                  key={genre.name}
                  className={`${genre.color} rounded-lg p-4 h-24 flex items-end cursor-pointer hover:opacity-80 transition-opacity`}
                  onClick={() => setQuery(genre.name.toLowerCase())}
                >
                  <span className="text-white font-semibold">{genre.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Search;