import React from 'react';
import { Library as LibraryIcon, Heart, Clock, Music, Headphones } from 'lucide-react';

function Library() {
  return (
    <div style={{ 
      minHeight: 'calc(100vh - 80px)',
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%)',
      padding: '2rem'
    }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '1rem', 
        marginBottom: '3rem',
        textAlign: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
          borderRadius: '50%',
          padding: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <LibraryIcon size={32} color="white" />
        </div>
        <h1 style={{ 
          margin: 0,
          fontSize: '2.5rem',
          fontWeight: '300',
          background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          letterSpacing: '1px'
        }}>
          Your Library
        </h1>
      </div>

      {/* Coming Soon Content */}
      <div style={{
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 50%, #1a1a1a 100%)',
        borderRadius: '20px',
        padding: '3rem',
        border: '1px solid #333',
        boxShadow: '0 10px 40px rgba(0,0,0,0.6)',
        backdropFilter: 'blur(20px)',
        textAlign: 'center',
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        {/* Icon Display */}
        <div style={{
          width: '120px',
          height: '120px',
          background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 2rem',
          boxShadow: '0 10px 30px rgba(78, 205, 196, 0.3)'
        }}>
          <Headphones size={60} color="white" />
        </div>

        <h2 style={{ 
          color: '#fff',
          fontSize: '2rem',
          fontWeight: '300',
          margin: '0 0 1rem 0'
        }}>
          Personal Library Coming Soon!
        </h2>
        
        <p style={{ 
          color: '#ccc',
          fontSize: '1.2rem',
          lineHeight: '1.6',
          margin: '0 0 2.5rem 0',
          maxWidth: '600px',
          margin: '0 auto 2.5rem'
        }}>
          We're building amazing features to organize and personalize your music experience.
        </p>

        {/* Feature Preview Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1.5rem',
          marginTop: '2rem'
        }}>
          <FeatureCard 
            icon={<Heart size={32} />}
            title="Liked Songs"
            description="Save and organize your favorite tracks in one place"
          />
          <FeatureCard 
            icon={<Music size={32} />}
            title="Custom Playlists"
            description="Create personalized playlists for every mood and occasion"
          />
          <FeatureCard 
            icon={<Clock size={32} />}
            title="Recently Played"
            description="Quick access to your listening history and recent discoveries"
          />
        </div>

        {/* Status Message */}
        <div style={{
          marginTop: '2.5rem',
          padding: '1rem 2rem',
          background: 'rgba(78, 205, 196, 0.1)',
          border: '1px solid rgba(78, 205, 196, 0.3)',
          borderRadius: '12px',
          display: 'inline-block'
        }}>
          <p style={{ 
            margin: 0,
            color: '#4ecdc4',
            fontSize: '1rem',
            fontWeight: '500'
          }}>
            ✨ These features are in development and will be available soon!
          </p>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid #333',
      borderRadius: '15px',
      padding: '1.5rem',
      textAlign: 'center',
      transition: 'all 0.3s ease',
      backdropFilter: 'blur(10px)'
    }}
    onMouseOver={(e) => {
      e.currentTarget.style.background = 'rgba(78, 205, 196, 0.05)';
      e.currentTarget.style.border = '1px solid rgba(78, 205, 196, 0.2)';
      e.currentTarget.style.transform = 'translateY(-5px)';
    }}
    onMouseOut={(e) => {
      e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
      e.currentTarget.style.border = '1px solid #333';
      e.currentTarget.style.transform = 'translateY(0)';
    }}
    >
      <div style={{
        color: '#4ecdc4',
        marginBottom: '1rem'
      }}>
        {icon}
      </div>
      <h3 style={{
        color: '#fff',
        fontSize: '1.3rem',
        fontWeight: '500',
        margin: '0 0 0.5rem 0'
      }}>
        {title}
      </h3>
      <p style={{
        color: '#ccc',
        fontSize: '0.95rem',
        lineHeight: '1.4',
        margin: 0
      }}>
        {description}
      </p>
    </div>
  );
}

export default Library;