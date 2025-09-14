import React, { useState } from 'react';
import { Search, Upload, User, Lock, Eye, EyeOff, X } from 'lucide-react';

const SoundCloudStyleLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Top Banner */}
      <div className="bg-gray-800 px-6 py-3 flex items-center justify-between border-b border-gray-700">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-gradient-to-r from-gray-400 to-gray-300 rounded-full"></div>
          <span className="text-white text-sm">
            <strong>Now available:</strong> Get heard by up to 100 listeners on your next upload with Artist or Artist Pro. 
            <button className="text-gray-300 hover:text-white ml-1 underline">Learn More</button>
          </span>
        </div>
        <button className="text-gray-400 hover:text-white">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Header */}
      <header className="bg-gray-800 px-6 py-4 flex items-center justify-between border-b border-gray-700">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <div className="flex space-x-1">
              <div className="w-1 h-4 bg-white rounded-full"></div>
              <div className="w-1 h-6 bg-white rounded-full"></div>
              <div className="w-1 h-5 bg-white rounded-full"></div>
              <div className="w-1 h-7 bg-white rounded-full"></div>
            </div>
            <span className="text-white text-xl font-bold">SOUNDWAVE</span>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setIsSignUp(false)}
            className={`px-4 py-2 rounded text-sm font-medium transition-all ${
              !isSignUp 
                ? 'bg-white text-gray-900' 
                : 'text-white hover:text-gray-300'
            }`}
          >
            Sign in
          </button>
          <button 
            onClick={() => setIsSignUp(true)}
            className={`px-4 py-2 rounded text-sm font-medium transition-all ${
              isSignUp 
                ? 'bg-gray-600 text-white' 
                : 'bg-gray-600 text-white hover:bg-gray-500'
            }`}
          >
            Create account
          </button>
          <button className="text-white hover:text-gray-300 text-sm">For Artists</button>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative">
        {/* Background Image Area */}
        <div className="h-96 bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900 flex items-center justify-center relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-black/30"></div>
            <div className="absolute top-10 left-10 w-32 h-32 bg-white/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-10 right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-gray-600/20 to-gray-400/20 rounded-full blur-3xl"></div>
          </div>
          
          <div className="relative z-10 max-w-2xl mx-auto px-6 text-center">
            <h1 className="text-6xl font-bold text-white mb-6 leading-tight">
              It all starts with<br />
              an upload.
            </h1>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              From bedrooms and broom closets to studios and stadiums,<br />
              SoundWave is where you define what's next in music. Just hit<br />
              upload.
            </p>
            <div className="flex items-center space-x-4 justify-center">
              <button className="bg-white text-gray-900 px-6 py-3 rounded font-semibold hover:bg-gray-100 transition-colors">
                Upload
              </button>
              <button className="border border-white text-white px-6 py-3 rounded font-semibold hover:bg-white hover:text-gray-900 transition-colors">
                Explore Artist Pro
              </button>
            </div>
          </div>

          {/* Carousel Dots */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
            <div className="w-2 h-2 bg-white/60 rounded-full"></div>
            <div className="w-2 h-2 bg-white rounded-full"></div>
            <div className="w-2 h-2 bg-white/60 rounded-full"></div>
          </div>
        </div>

        {/* Login Form Overlay */}
        {isSignUp || !isSignUp ? (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
            <div className="bg-gray-800 rounded-lg p-8 w-full max-w-md mx-4 border border-gray-700">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">
                  {isSignUp ? 'Create your account' : 'Sign into your account'}
                </h2>
                <p className="text-gray-400">
                  {isSignUp ? 'Start sharing your music today' : 'Welcome back to SoundWave'}
                </p>
              </div>

              <div className="space-y-4">
                {/* Username Field */}
                <div>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Your username"
                      className="w-full pl-12 pr-4 py-3 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Your password"
                      className="w-full pl-12 pr-12 py-3 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Sign In Button */}
                <button
                  className="w-full bg-white text-gray-900 py-3 rounded font-semibold hover:bg-gray-100 transition-colors"
                  onClick={() => console.log('Sign in clicked')}
                >
                  {isSignUp ? 'Create account' : 'Sign in'}
                </button>

                {/* Divider */}
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-600"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-gray-800 text-gray-400">or</span>
                  </div>
                </div>

                {/* Social Login */}
                <div className="space-y-3">
                  <button className="w-full flex items-center justify-center px-4 py-3 border border-gray-600 rounded bg-gray-700 text-white hover:bg-gray-600 transition-all">
                    <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Continue with Google
                  </button>
                  
                  <button className="w-full flex items-center justify-center px-4 py-3 border border-gray-600 rounded bg-gray-700 text-white hover:bg-gray-600 transition-all">
                    <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                    Continue with Twitter
                  </button>
                </div>

                {/* Forgot Password */}
                {!isSignUp && (
                  <div className="text-center mt-4">
                    <button className="text-gray-400 hover:text-white text-sm transition-colors">
                      Forgot your password?
                    </button>
                  </div>
                )}

                {/* Toggle Sign Up/In */}
                <div className="text-center mt-6 pt-4 border-t border-gray-700">
                  <p className="text-gray-400 text-sm">
                    {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
                    <button 
                      onClick={() => setIsSignUp(!isSignUp)}
                      className="text-white hover:underline"
                    >
                      {isSignUp ? 'Sign in' : 'Create one'}
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {/* Search Section */}
      <div className="bg-gray-900 py-12">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center space-x-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search for artists, bands, tracks, podcasts"
                className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
              />
            </div>
            <span className="text-white text-lg">or</span>
            <button className="bg-white text-gray-900 px-6 py-3 rounded font-semibold hover:bg-gray-100 transition-colors flex items-center space-x-2">
              <Upload className="w-5 h-5" />
              <span>Upload your own</span>
            </button>
          </div>
        </div>
      </div>

      {/* Trending Section */}
      <div className="bg-gray-900 pb-12">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-white text-2xl font-bold mb-8 text-center">
            Hear what's trending for free in the SoundWave community
          </h2>
        </div>
      </div>
    </div>
  );
};

export default SoundCloudStyleLogin;