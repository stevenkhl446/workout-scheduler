// ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext'; 

const ProtectedRoute = ({ children }) => {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return <div>Loading...</div>; // Or any loading indicator you prefer
    }

    if (!user) {
        return <Navigate to="/login" />;
    }

    return children;
};


export default ProtectedRoute;