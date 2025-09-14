import React from 'react';
import { Link } from 'react-router-dom';

function GlobalNavbar({ user, onAuthClick, onSignOut }) {
  return (
    <header className="bg-gray-800 px-6 py-4 flex items-center justify-between border-b border-gray-700 sticky top-0 z-40">
      <Link to="/" className="flex items-center gap-3">
        <div className="flex gap-1">
          <div className="w-1 bg-white rounded-full" style={{ height: '16px' }}></div>
          <div className="w-1 bg-white rounded-full" style={{ height: '24px' }}></div>
          <div className="w-1 bg-white rounded-full" style={{ height: '20px' }}></div>
          <div className="w-1 bg-white rounded-full" style={{ height: '28px' }}></div>
        </div>
        <span className="text-xl font-bold">SOUNDWAVE</span>
      </Link>

      <nav className="flex items-center gap-6">
        <Link to="/browse" className="text-gray-300 hover:text-white">Browse</Link>
        <Link to="/search" className="text-gray-300 hover:text-white">Search</Link>

        {user ? (
          <div className="flex items-center gap-4">
            <Link to="/upload" className="bg-white text-gray-900 px-4 py-2 rounded font-semibold hover:bg-gray-100">
              Upload
            </Link>
            <div className="flex items-center gap-3">
              <Link to="/profile" className="flex items-center gap-3 hover:bg-gray-700 px-3 py-2 rounded transition-colors">
                <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">
                    {user.username.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <div className="text-white text-sm font-medium">
                    {user.username}
                  </div>
                  <div className="text-gray-400 text-xs">
                    My Profile
                  </div>
                </div>
              </Link>
              <button 
                onClick={onSignOut} 
                className="text-gray-300 hover:text-white px-3 py-2 rounded hover:bg-gray-700 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <button onClick={() => onAuthClick('signin')} className="text-gray-300 hover:text-white px-4 py-2">
              Sign in
            </button>
            <button onClick={() => onAuthClick('signup')} className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600">
              Create account
            </button>
          </div>
        )}
      </nav>
    </header>
  );
}

export default GlobalNavbar;