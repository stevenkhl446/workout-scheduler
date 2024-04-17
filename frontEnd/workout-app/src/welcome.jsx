// Welcome.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

function Welcome() {
  const navigate = useNavigate();

  return (
    <div>
      <h1>Welcome to Fitness Scheduler</h1>
      <p>Get ready to transform your fitness journey.</p>
      <button onClick={() => navigate('/select')}>Begin</button>
    </div>
  );
}

export default Welcome;

