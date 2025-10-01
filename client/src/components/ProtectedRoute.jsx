// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { token } = useAuth();
    console.log('ProtectedRoute: Checking for token. Value is:', token);
    if (!token) {
        console.log('ProtectedRoute: No token found. Redirecting to /auth...');
        // return <Navigate to="/auth" replace />;
        // If no token is found in the context, redirect the user to the login page.
        // The `replace` prop prevents the user from going "back" to the protected page.
        return <Navigate to="/auth" replace />;
    }
    console.log('ProtectedRoute: Token found. Rendering protected page.');
    // If a token exists, render the child components as normal.
    return children;
};

export default ProtectedRoute;