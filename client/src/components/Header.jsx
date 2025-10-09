// src/components/Header.jsx
import GradientText from './GradientText';
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
function Header() {
  const { user, logout } = useAuth();
  return (
    <header className="bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-purple-600 to-blue-500 flex items-center justify-center transform transition-transform group-hover:scale-110">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 text-transparent bg-clip-text">
                {/* JournalAI */}
                <GradientText
                                        colors={[
                                            "#7c3aed",
                                            "#3b82f6",
                                            "#7c3aed",
                                            "#3b82f6",
                                            "#7c3aed",
                                            "#3b82f6",
                                        ]}
                                        animationSpeed={6}
                                        showBorder={false}
                                    >
                                        JournalAI
                                    </GradientText>
              </h2>
            </Link>
          </div>
          
          <nav className="flex gap-6 items-center">
            {user ? (
              <>
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-r from-purple-600 to-blue-500 flex items-center justify-center text-white font-semibold">
                    {user.name[0].toUpperCase()}
                  </div>
                  <span className="text-gray-700 font-medium">Hi, {user.name}</span>
                </div>
                <button
                  onClick={logout}
                  className="px-4 py-2 text-gray-500 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-all duration-200 flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <Link 
                to="/auth" 
                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                Login / Register
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;