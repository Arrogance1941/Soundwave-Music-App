import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { musicAPI } from '../services/musicAPI';
import { Upload as UploadIcon, Music, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';

function Upload() {
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const handleFileSelect = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile && selectedFile.type.startsWith('audio/')) {
      setFile(selectedFile);
      if (!title) {
        // Auto-fill title from filename
        setTitle(selectedFile.name.replace(/\.[^/.]+$/, ''));
      }
      setMessage('');
      setMessageType('');
    } else {
      setMessage('Please select a valid audio file');
      setMessageType('error');
    }
  };

  const handleUpload = async (event) => {
    event.preventDefault();
    
    if (!file || !title || !artist) {
      setMessage('Please fill in all fields and select a file');
      setMessageType('error');
      return;
    }

    setUploading(true);
    setMessage('');

    try {
      // Upload file to S3
      const fileKey = `songs/${Date.now()}_${file.name}`;
      console.log('Uploading file:', fileKey);
      
      await musicAPI.uploadSongFile(fileKey, file);
      console.log('File uploaded successfully');

      // Save metadata to database
      const songData = {
        title: title.trim(),
        artist: artist.trim(),
        fileKey,
        uploadedAt: new Date().toISOString(),
      };

      console.log('Creating song record:', songData);
      await musicAPI.createSong(songData);

      setMessage('Song uploaded successfully! 🎵');
      setMessageType('success');
      
      // Reset form
      setTitle('');
      setArtist('');
      setFile(null);
      document.getElementById('file-input').value = '';
      
    } catch (error) {
      console.error('Error uploading song:', error);
      setMessage('Error uploading song. Please try again.');
      setMessageType('error');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
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
            <Link to="/search" className="text-gray-300 hover:text-white">Search</Link>
          </div>
        </div>
      </div> */}

      <div className="container mx-auto px-6 py-8 max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-orange-500 rounded-full p-4">
              <Music size={32} className="text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-2">Upload Your Music</h1>
          <p className="text-gray-400">Share your sound with the world</p>
        </div>

        {/* Upload Form */}
        <div className="bg-gray-800 rounded-lg p-8 border border-gray-700">
          <form onSubmit={handleUpload} className="space-y-6">
            
            {/* Song Title */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Song Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:border-orange-500"
                placeholder="Enter song title"
                required
              />
            </div>

            {/* Artist Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Artist Name *
              </label>
              <input
                type="text"
                value={artist}
                onChange={(e) => setArtist(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:border-orange-500"
                placeholder="Enter artist name"
                required
              />
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Audio File *
              </label>
              <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-orange-500 transition-colors">
                <input
                  id="file-input"
                  type="file"
                  accept="audio/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <label htmlFor="file-input" className="cursor-pointer">
                  <UploadIcon size={48} className="mx-auto mb-4 text-gray-500" />
                  <p className="text-lg font-semibold text-white mb-2">
                    {file ? file.name : 'Click to select audio file'}
                  </p>
                  <p className="text-sm text-gray-400">
                    Supported formats: MP3, WAV, FLAC, M4A
                  </p>
                  {file && (
                    <p className="text-sm text-orange-500 mt-2 bg-orange-500 bg-opacity-10 inline-block px-3 py-1 rounded">
                      Size: {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  )}
                </label>
              </div>
            </div>

            {/* Upload Button */}
            <button
              type="submit"
              disabled={uploading}
              className="w-full py-4 bg-orange-600 text-white rounded font-semibold hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <UploadIcon size={20} />
              {uploading ? 'Uploading...' : 'Upload Song'}
            </button>
          </form>

          {/* Message Display */}
          {message && (
            <div
              className={`mt-6 p-4 rounded flex items-center gap-3 ${
                messageType === 'error' 
                  ? 'bg-red-900 border border-red-700 text-red-100' 
                  : 'bg-green-900 border border-green-700 text-green-100'
              }`}
            >
              {messageType === 'error' ? (
                <AlertCircle size={20} />
              ) : (
                <CheckCircle size={20} />
              )}
              <span>{message}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Upload;