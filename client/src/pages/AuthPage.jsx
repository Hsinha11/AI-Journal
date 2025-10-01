// src/pages/AuthPage.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AuthPage = () => {
  const [isLoginMode,setIsLoginMode] = useState(true);
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState();
  const { login, register } = useAuth();
  const navigate = useNavigate();
    
    // --- UI SKELETON (Provided) ---
    async function handleSubmit(event) {
      event.preventDefault();
      if (isLoginMode){
        const response = await login(email,password)
        if (response.ok){
          navigate('/');
        }
        else{
          const errorData = await response.json()
          setError(errorData.error)
        }
      }
      else{
        const response = await register(username,email,password)
        if (response.ok){
          navigate('/');
        }
        else{
          const errorData = await response.json()
          setError(errorData.error)
        }
      }
    }
    return (
        <div className="flex items-center justify-center min-h-screen py-6 bg-gradient-to-br from-purple-50 to-blue-50">
            <div className="p-5 sm:p-6 bg-white rounded-2xl shadow-xl w-full max-w-md border border-gray-100 my-auto">
                <div className="flex flex-col items-center mb-4">
                    <div className="relative mb-2">
                        <div className="h-14 w-14 sm:h-16 sm:w-16 bg-gradient-to-r from-purple-600 to-blue-500 rounded-xl rotate-12 flex items-center justify-center mb-3 shadow-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-8 sm:w-8 text-white -rotate-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                        </div>
                        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-20 sm:w-24 h-1.5 bg-gradient-to-r from-purple-600/20 to-blue-500/20 rounded-full blur-sm"></div>
                    </div>
                    <div className="text-center space-y-3 mb-4">
                        <h1 className="text-4xl font-extrabold">
                            <span className="bg-gradient-to-r from-purple-600 to-blue-500 text-transparent bg-clip-text">JournalAI</span>
                        </h1>
                        <div className="flex items-center gap-2 justify-center text-gray-400">
                            <span className="h-[1px] w-12 bg-gradient-to-r from-purple-200 to-transparent"></span>
                            <span className="text-sm font-medium">Your Thoughts, Enhanced</span>
                            <span className="h-[1px] w-12 bg-gradient-to-l from-blue-200 to-transparent"></span>
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">
                        {isLoginMode ? "Welcome Back!" : "Join Us Today"}
                    </h2>
                    <p className="text-gray-500 mt-2">
                        {isLoginMode ? "Log in to continue your journey" : "Start your journaling journey"}
                    </p>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-lg">
                        <p className="text-red-600 text-sm flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            {error}
                        </p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-3">
                    {!isLoginMode && (
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-1.5">Username</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                    placeholder="Your username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </div>
                        </div>
                    )}

                    <div>
                        <label className="block text-gray-700 text-sm font-medium mb-2">Email</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <input
                                type="email"
                                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm font-medium mb-2">Password</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                            <input
                                type="password"
                                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 font-semibold flex items-center justify-center gap-2"
                    >
                        {isLoginMode ? (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                </svg>
                                Login
                            </>
                        ) : (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                </svg>
                                Register
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-4 text-center">
                    <p className="text-gray-600">
                        {isLoginMode ? "Don't have an account?" : "Already have an account?"}
                        <button 
                            onClick={() => setIsLoginMode(prev => !prev)}
                            className="ml-2 text-purple-600 hover:text-purple-700 font-medium transition-colors"
                        >
                            {isLoginMode ? "Register" : "Login"}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;