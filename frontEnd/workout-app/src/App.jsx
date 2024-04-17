import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import LogoutButton from './logoutButton.jsx';
import AutoRedirect from './AutoRedirect';
import { useAuth } from './AuthContext'; // Assuming AuthContext is in the same directory



function App() {
  const { theme } = useAuth();

  return (
    <div className={`app ${theme}`}>
      <AutoRedirect />
      <LogoutButton />
      <Outlet />
    </div>
  );
}

export default App;
