// src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    // Check localStorage for a token on initial load
    const initialToken = localStorage.getItem('token');
    console.log('AuthContext: Initial token from localStorage:', initialToken);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [user, setUser] = useState(null); // We'll add user data later

    // Effect to update localStorage when token changes
    useEffect(() => {
        if (token) {
            localStorage.setItem('token', token);
            setUser(jwtDecode(token)); // Decode and set user info
        } else {
            localStorage.removeItem('token');
            setUser(null); // Clear user state on logout
        }
    }, [token]);

    const register = async (username, email, password) => {
        // This function now returns the response to the component
        return fetch('/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password }),
        });
    };

    const login = async (email, password) => {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        if (response.ok) {
            const data = await response.json();
            setToken(data.token); // Set the token in our global state
        }
        return response; // Return the full response for the component to handle
    };

    const logout = () => {
        setToken(null);
        setUser(null);
    };

    const value = { token, user, login, register, logout };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};