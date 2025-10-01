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
        <div className="flex items-center justify-center min-h-screen bg-slate-100">
            <div className="p-8 bg-white rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold text-center mb-6">
                    {/* This should dynamically change based on isLoginMode */}
                    {isLoginMode? "Login": "Register"}
                    
                </h2>
                {/* This is where you would display any error messages */}
                {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                <form onSubmit={handleSubmit}> {/* Add your onSubmit handler here */}
                    {/* This input should only show when in register mode */}
                    {!isLoginMode && (
                      <div className="mb-4">
                        <label className="block text-slate-700 mb-2">Username</label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 border rounded-lg"
                            placeholder="Your Username"
                            value ={username}
                            onChange={(e)=>{
                              setUsername(e.target.value)
                            }}
                            
                            
                            // Add value and onChange handlers
                        />
                    </div>
                    )}
                    
                    
                    <div className="mb-4">
                        <label className="block text-slate-700 mb-2">Email</label>
                        <input
                            type="email"
                            className="w-full px-3 py-2 border rounded-lg"
                            placeholder="you@example.com"
                            value ={email}
                            onChange={(e)=>{
                              setEmail(e.target.value)
                            }}
                            // Add value and onChange handlers
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-slate-700 mb-2">Password</label>
                        <input
                            type="password"
                            className="w-full px-3 py-2 border rounded-lg"
                            placeholder="********"
                            value ={password}
                            onChange={(e)=>{
                              setPassword(e.target.value)
                            }}
                            // Add value and onChange handlers
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                    >
                        {/* This should dynamically change based on isLoginMode */}
                        Login
                    </button>
                </form>

                <p className="text-center text-slate-600 mt-4">
                    {/* This should dynamically change text */}
                    {isLoginMode?"Don't have an account?":"Already have an account?"}
                    
                    <button className="text-blue-600 hover:underline ml-1" onClick={()=>{
                      setIsLoginMode((prev)=>!prev)
                    }}>
                        {/* This button should toggle the mode */}
                        {isLoginMode? "Register":"Login"}
                        
                    </button>
                </p>
            </div>
        </div>
    );
};

export default AuthPage;