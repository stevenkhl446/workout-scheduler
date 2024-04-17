import React from 'react'
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider, } from 'react-router-dom';
import { AuthProvider } from './AuthContext.jsx';

import App from './App.jsx';
import './index.css'
import Login from './login.jsx'; 
import Register from './register.jsx';
import Welcome from './welcome.jsx'; 
import Select from './select.jsx';
import NotFoundPage from './pageNotFound.jsx'; 
import Dashboard from './dashBoard2.jsx';
import ProtectedRoute from './ProtectedRoute';
import DailySchedule from './DailySchedule';
import { WorkoutsProvider } from './WorkoutsContext.jsx'; 

// Then in your router configuration
<Route path="*" element={<NotFoundPage />} />


    const router = createBrowserRouter(
      createRoutesFromElements(
        <Route path="/" element={<App />}>
          <Route index element={<Welcome />} />
          <Route path="select" element={<Select />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
          <Route path="/schedule/:day" element={<DailySchedule />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      )
);


ReactDOM.createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <WorkoutsProvider>
  <RouterProvider router={router} />
  </WorkoutsProvider>
  </AuthProvider>
)
