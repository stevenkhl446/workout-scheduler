import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';


function Login() {
  const { login } = useAuth();
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();


  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isSuccess = await login(credentials);
    console.log(`success value: ${isSuccess}`)
    try{
      if (isSuccess) {
        const today = new Date().toISOString().split('T')[0];
        console.log(today);
        console.log(`Navigating to /schedule/${today}`);
        navigate(`/schedule/${today}`); // Redirect to Daily Schedule of today's date on successful login
      }else {
        setError("Invalid username or password."); // Set an error message for invalid login
      }
    } catch (error) {
      console.error('Login failed:', error);
      setError("An error occurred during login.");
    }
  };
  
  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          value={credentials.username}
          onChange={handleChange}
          placeholder="Username"
          required
        />
        <input
          type="password"
          name="password"
          value={credentials.password}
          onChange={handleChange}
          placeholder="Password"
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;

