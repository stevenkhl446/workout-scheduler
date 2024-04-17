import React, { useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';

const AutoRedirect = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      const today = new Date().toISOString().split('T')[0];
      navigate(`/schedule/${today}`);
    }
  }, [user, navigate]);

  return null; // or a loader, or null if you don't want to render anything
};
export default AutoRedirect

