import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { getCurrentUser, signOut } from 'aws-amplify/auth';
import { Lock, Upload, Music, Play } from 'lucide-react';
import AuthModal from './components/AuthModal';
import GlobalNavbar from './components/GlobalNavbar';
import Browse from './components/Browse';
import SearchPage from './components/Search';
import UploadPage from './components/Upload';
import ProfilePage from './components/Profile';
import { AudioProvider } from './context/AudioContext';

function App() {
  const [user, setUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('signin');

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      setUser(null);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <AudioProvider>
      <Router>
        <div className="min-h-screen bg-gray-900 text-white">
          <GlobalNavbar 
            user={user}
            onAuthClick={(mode) => {
              setAuthMode(mode);
              setShowAuthModal(true);
            }}
            onSignOut={handleSignOut}
          />

          <Routes>
            <Route path="/" element={<HomePage user={user} />} />
            <Route path="/browse" element={<Browse />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/profile" element={
              user ? <ProfilePage user={user} /> : <AuthRequired onAuth={() => setShowAuthModal(true)} />
            } />
            <Route
              path="/upload"
              element={
                user ? <UploadPage /> : <AuthRequired onAuth={() => setShowAuthModal(true)} />
              }
            />
          </Routes>

          {showAuthModal && (
            <AuthModal
              mode={authMode}
              onClose={() => setShowAuthModal(false)}
              onSuccess={() => {
                setShowAuthModal(false);
                checkAuthState();
              }}
              onSwitchMode={(mode) => setAuthMode(mode)}
            />
          )}
        </div>
      </Router>
    </AudioProvider>
  );
}

function HomePage({ user }) {
  return (
    <>
      <div className="bg-gray-800 px-6 py-3 flex items-center justify-between text-sm border-b border-gray-700">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-gradient-to-r from-gray-400 to-gray-300 rounded-full"></div>
          <span>
            <strong>Now available:</strong> Upload and stream your music with SoundWave.{' '}
            <button className="text-gray-300 underline hover:text-white">Learn More</button>
          </span>
        </div>
        <button className="text-gray-400 hover:text-white">
          ×
        </button>
      </div>

      <main className="bg-gradient-to-b from-gray-800 via-gray-700 to-gray-900 py-24 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          {user ? (
            <>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                Welcome back, {user.username}!<br />
                <span className="text-3xl md:text-4xl text-gray-300">Ready to explore music?</span>
              </h1>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Discover new tracks, upload your music, or continue listening to your favorites.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/browse" className="bg-white text-gray-900 px-8 py-3 rounded font-semibold text-lg hover:bg-gray-100 transition-colors">
                  Explore Music
                </Link>
                <Link to="/upload" className="bg-orange-600 text-white px-8 py-3 rounded font-semibold text-lg hover:bg-orange-700 transition-colors">
                  Upload Your Music
                </Link>
              </div>
            </>
          ) : (
            <>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                Discover amazing music.<br />
                Share your sound.
              </h1>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Upload, stream, and discover music from artists around the world.<br />
                Join the SoundWave community and let your music be heard.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/browse" className="bg-white text-gray-900 px-8 py-3 rounded font-semibold text-lg hover:bg-gray-100 transition-colors">
                  Start Listening
                </Link>
                <Link to="/upload" className="border-2 border-white text-white px-8 py-3 rounded font-semibold text-lg hover:bg-white hover:text-gray-900 transition-colors">
                  Join SoundWave
                </Link>
              </div>
            </>
          )}
        </div>
      </main>

      <section className="py-16 px-6 bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Everything you need to share your music</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Upload className="w-8 h-8" />}
              title="Upload & Share"
              description="Upload your tracks and share them with the world instantly."
            />
            <FeatureCard
              icon={<Play className="w-8 h-8" />}
              title="Stream Everywhere"
              description="High-quality streaming on any device, anywhere."
            />
            <FeatureCard
              icon={<Music className="w-8 h-8" />}
              title="Discover Music"
              description="Find new artists and genres tailored to your taste."
            />
          </div>
        </div>
      </section>
    </>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="text-center p-6">
      <div className="text-orange-500 flex justify-center mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-gray-400 leading-relaxed">{description}</p>
    </div>
  );
}

function AuthRequired({ onAuth }) {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
          <Lock className="w-8 h-8 text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold mb-4">Sign in required</h2>
        <p className="text-gray-400 mb-6">You need to sign in to upload music and create playlists.</p>
        <button onClick={onAuth} className="bg-white text-gray-900 px-6 py-3 rounded font-semibold hover:bg-gray-100">
          Sign In
        </button>
      </div>
    </div>
  );
}

export default App;