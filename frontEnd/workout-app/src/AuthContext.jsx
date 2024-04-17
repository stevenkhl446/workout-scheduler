import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:3000';
axios.defaults.withCredentials = true; // Important for cookies to be sent

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); 
  const [theme, setTheme] = useState('day');
  useEffect(() => {
    const fetchCurrentUser = async () => {
      const response = await axios.get('/api/session', { withCredentials: true });
      console.log(response.data.isLoggedIn)
      if (response.data.isLoggedIn) {
          setUser(response.data.user);          
      }else {
        setUser(null);
      }
      
  };
  fetchCurrentUser();
  const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
      setTheme(storedTheme);
    }
  }, []);

  const login = async(userData) => {
    try {
      const response = await axios.post('/api/login', userData);
      if (response.data && response.data.user) {
        setUser(response.data.user);
        return true;
      } else {
        console.error("Login response did not include user data");
        return false;
      }
    } catch (error) {
      console.error("Login failed:", error.response.data);
      return false;
    }
  };
  

  const logout = async () => {
    try {
      await axios.get('http://localhost:3000/api/logout');
      setUser(null); // Clear the user state
    } catch (error) {
      console.error("Logout failed:", error.response ? error.response.data : error);
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === 'day' ? 'night' : 'day';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme); // Persist theme preference
  };

  const contextValue = {
    user,
    login,
    logout,
    theme, // Expose theme and toggleTheme through context
    toggleTheme,
  };

  

  return (
    <AuthContext.Provider value={{ user, login, logout,contextValue }}>
      {children}
    </AuthContext.Provider>
  );
};
