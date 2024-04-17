// Select.jsx
import React from 'react';
import { Link } from 'react-router-dom';

function Select() {
  return (
    <div>
      <h2>Select Your Path</h2>
      <p>Choose an option to proceed:</p>
      <div>
        <Link to="/login">Log In</Link> | <Link to="/register">Register</Link>
      </div>
    </div>
  );
}

export default Select;

