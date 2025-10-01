// src/components/Header.jsx
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
function Header() {
  const { user, logout } = useAuth();
  return (
    <header className="flex justify-between items-center p-4 bg-white shadow-md">
      <h2 className="text-2xl font-bold text-blue-600">
        <Link to="/">AI Journal</Link>
      </h2>
      <nav className="flex gap-6 items-center">
        {user ? (
          // --- Logged-in View ---
          <>
            <span className="text-slate-600 font-bold">Hi, {user ? user.name : ''}</span>
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-500 text-white text-sm font-bold rounded hover:bg-red-600 transition-colors"
            >
              Logout
            </button>
          </>
        ) : (
          // --- Logged-out View ---
          <Link to="/auth" className="text-slate-600 hover:text-blue-600">
            Login / Register
          </Link>
        )}
      </nav>
    </header>
  );
}

export default Header;