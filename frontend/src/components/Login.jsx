import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('https://nayepankh-volunteer-system-d9ro.onrender.com/api/login', { username, password });
      localStorage.setItem('adminToken', res.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 relative">
      <div className="bg-white p-8 rounded-xl shadow-md max-w-sm w-full relative pt-12">
        
        {/* ADDED BACK BUTTON */}
        <Link 
          to="/" 
          className="absolute top-5 left-5 text-sm text-gray-500 hover:text-orange-600 flex items-center gap-1 transition font-medium"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back
        </Link>

        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6 mt-2">Admin Sign In</h2>
        
        {error && <div className="bg-red-100 text-red-700 p-2.5 rounded mb-4 text-center text-sm">{error}</div>}
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Username</label>
            <input type="text" required onChange={(e) => setUsername(e.target.value)} className="mt-1 w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-orange-500 outline-none"/>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input type="password" required onChange={(e) => setPassword(e.target.value)} className="mt-1 w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-orange-500 outline-none"/>
          </div>
          <button type="submit" className="w-full bg-gray-800 hover:bg-gray-900 text-white py-2.5 rounded font-semibold transition mt-2">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;