// src/components/ProtectedRoute.js
import React, { useState, useEffect } from 'react';
import { getCurrentUser } from 'aws-amplify/auth';
import AuthModal from './AuthModal';

function ProtectedRoute({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      setShowAuth(true);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!user) return <AuthModal onSuccess={() => window.location.reload()} />;
  
  return children;
}

export default ProtectedRoute;