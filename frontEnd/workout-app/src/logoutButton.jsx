// LogoutButton.jsx
import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LogoutButton = () => {
  const navigate = useNavigate();

  const logoutUser = async () => {
    try {
      const response = await axios.get('/api/logout', { withCredentials: true });
      alert(response.data.message);
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      alert('Logout failed.');
    }
  };

  return (
    <button onClick={logoutUser}>Log Out</button>
  );
};

export default LogoutButton;
