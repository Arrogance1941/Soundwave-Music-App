import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Upload, Camera, User, Mail, Music } from 'lucide-react';

function ProfilePage({ user }) {
  const [profilePicture, setProfilePicture] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleProfilePictureUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfilePicture(e.target.result);
        // Here you would upload to S3 and save the URL
        // For now, just storing locally
        localStorage.setItem(`profile_picture_${user.username}`, e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Load profile picture from localStorage on component mount
  React.useEffect(() => {
    const savedPicture = localStorage.getItem(`profile_picture_${user.username}`);
    if (savedPicture) {
      setProfilePicture(savedPicture);
    }
  }, [user.username]);

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
            <Link to="/upload" className="bg-white text-gray-900 px-4 py-2 rounded hover:bg-gray-100">Upload</Link>
          </div>
        </div>
      </div> */}

      <div className="container mx-auto px-6 py-8 max-w-4xl">
        {/* Profile Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">My Profile</h1>
          <p className="text-gray-400">Manage your account and preferences</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Profile Picture Section */}
          <div className="md:col-span-1">
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 text-center">
              <div className="mb-6">
                <div className="relative mx-auto w-32 h-32 mb-4">
                  {profilePicture ? (
                    <img 
                      src={profilePicture} 
                      alt="Profile" 
                      className="w-full h-full rounded-full object-cover border-4 border-orange-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-r from-orange-500 to-pink-500 rounded-full flex items-center justify-center border-4 border-gray-600">
                      <User size={48} className="text-white" />
                    </div>
                  )}
                  
                  {/* Upload button overlay */}
                  <label className="absolute bottom-0 right-0 bg-orange-500 hover:bg-orange-600 rounded-full p-2 cursor-pointer transition-colors">
                    <Camera size={16} className="text-white" />
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleProfilePictureUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                
                <h3 className="text-xl font-semibold text-white mb-1">{user.username}</h3>
                <p className="text-gray-400 text-sm">SoundWave Member</p>
              </div>

              <button className="w-full bg-orange-600 text-white py-2 rounded hover:bg-orange-700 transition-colors">
                Update Profile Picture
              </button>
            </div>
          </div>

          {/* Profile Information */}
          <div className="md:col-span-2 space-y-6">
            {/* Account Info */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <User size={20} />
                Account Information
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Username</label>
                  <input 
                    type="text" 
                    value={user.username} 
                    readOnly
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                  <input 
                    type="email" 
                    value={user.attributes?.email || 'Not provided'} 
                    readOnly
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Member Since</label>
                  <input 
                    type="text" 
                    value={new Date().toLocaleDateString()} 
                    readOnly
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                  />
                </div>
              </div>
            </div>

            {/* Music Stats */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Music size={20} />
                Music Statistics
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gray-700 rounded">
                  <div className="text-2xl font-bold text-orange-500">0</div>
                  <div className="text-sm text-gray-400">Uploads</div>
                </div>
                <div className="text-center p-4 bg-gray-700 rounded">
                  <div className="text-2xl font-bold text-green-500">0</div>
                  <div className="text-sm text-gray-400">Plays</div>
                </div>
                <div className="text-center p-4 bg-gray-700 rounded">
                  <div className="text-2xl font-bold text-blue-500">0</div>
                  <div className="text-sm text-gray-400">Downloads</div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link 
                  to="/upload"
                  className="flex items-center gap-3 p-4 bg-orange-600 hover:bg-orange-700 rounded transition-colors"
                >
                  <Upload size={20} />
                  <span>Upload New Music</span>
                </Link>
                
                <Link 
                  to="/browse"
                  className="flex items-center gap-3 p-4 bg-gray-700 hover:bg-gray-600 rounded transition-colors"
                >
                  <Music size={20} />
                  <span>Browse Music</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;