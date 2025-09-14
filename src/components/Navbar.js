import React from 'react';
import { Link } from 'react-router-dom';
import { Radio, Upload, Library, LogOut, Headphones } from 'lucide-react';

function Navbar({ signOut, user }) {
  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1rem 2rem',
      background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 50%, #1a1a1a 100%)',
      borderBottom: '1px solid #333',
      boxShadow: '0 2px 20px rgba(0,0,0,0.5)'
    }}>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '0.75rem',
        fontSize: '1.5rem',
        fontWeight: '300',
        letterSpacing: '2px'
      }}>
        <div style={{
          background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
          borderRadius: '50%',
          padding: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Radio size={24} color="white" />
        </div>
        <span style={{ 
          background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          SOUNDWAVE
        </span>
      </div>
      
      <div style={{ display: 'flex', gap: '2.5rem', alignItems: 'center' }}>
        <NavLink to="/" icon={<Headphones size={18} />} text="Discover" />
        <NavLink to="/upload" icon={<Upload size={18} />} text="Upload" />
        <NavLink to="/library" icon={<Library size={18} />} text="Library" />
        
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '1rem',
          marginLeft: '2rem',
          paddingLeft: '2rem',
          borderLeft: '1px solid #333'
        }}>
          <span style={{ color: '#ccc', fontSize: '0.9rem' }}>
            {user.username}
          </span>
          <button 
            onClick={signOut}
            style={{
              background: 'rgba(220, 38, 38, 0.8)',
              color: 'white',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '20px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.85rem',
              fontWeight: '500',
              transition: 'all 0.3s ease',
              backdropFilter: 'blur(10px)'
            }}
            onMouseOver={(e) => e.target.style.background = 'rgba(220, 38, 38, 1)'}
            onMouseOut={(e) => e.target.style.background = 'rgba(220, 38, 38, 0.8)'}
          >
            <LogOut size={14} />
            Sign Out
          </button>
        </div>
      </div>
    </nav>
  );
}

function NavLink({ to, icon, text }) {
  return (
    <Link 
      to={to} 
      style={{ 
        color: '#ccc', 
        textDecoration: 'none', 
        display: 'flex', 
        alignItems: 'center', 
        gap: '0.5rem',
        fontSize: '0.95rem',
        fontWeight: '400',
        transition: 'all 0.3s ease',
        padding: '0.5rem 1rem',
        borderRadius: '20px',
        background: 'rgba(255,255,255,0.05)'
      }}
      onMouseOver={(e) => {
        e.target.style.color = '#4ecdc4';
        e.target.style.background = 'rgba(78, 205, 196, 0.1)';
      }}
      onMouseOut={(e) => {
        e.target.style.color = '#ccc';
        e.target.style.background = 'rgba(255,255,255,0.05)';
      }}
    >
      {icon}
      {text}
    </Link>
  );
}

export default Navbar;