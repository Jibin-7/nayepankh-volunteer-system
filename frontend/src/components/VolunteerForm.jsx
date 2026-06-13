import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const VolunteerForm = () => {
  const [formData, setFormData] = useState({
    fullName: '', email: '', phone: '', interest: '', availability: 'Weekends'
  });
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Note: Change this to your Render URL if you are testing the live site
      const res = await axios.post('http://localhost:5000/api/register', formData);
      
      // 1. Display the success message from the backend
      setMessage(res.data.message);
      
      // 2. Reset the form back to its exact initial state
      setFormData({ 
        fullName: '', 
        email: '', 
        phone: '', 
        interest: '', 
        availability: 'Weekends' 
      });

      // 3. Pro UX Feature: Auto-hide the message after 5 seconds (5000 milliseconds)
      setTimeout(() => {
        setMessage('');
      }, 5000);

    } catch (err) {
      setMessage('Registration failed. Please try again.');
      
      // Also auto-hide the error message
      setTimeout(() => {
        setMessage('');
      }, 5000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
      <header className="bg-orange-600 text-white p-4 shadow-md flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-wide">NayePankh Foundation</h1>
        <Link to="/login" className="bg-white text-orange-600 px-4 py-2 rounded font-semibold hover:bg-orange-100 transition">Admin Portal</Link>
      </header>

      <main className="flex-grow flex items-center justify-center p-6">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full border border-gray-100">
          <h2 className="text-3xl font-extrabold text-gray-800 mb-2 text-center">Spread Your Wings</h2>
          <p className="text-gray-500 text-center mb-6">Register to become a change-maker today.</p>
          
          {message && (
            <div className={`p-3 rounded mb-4 text-center text-sm font-medium ${message.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700">Full Name</label>
              <input type="text" required value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} className="mt-1 w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700">Email Address</label>
              <input type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="mt-1 w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700">Phone Number</label>
              <input type="tel" required value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="mt-1 w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none" />
            </div>
            
            {/* UPDATED DROPDOWN */}
            <div>
              <label className="block text-sm font-semibold text-gray-700">Primary Core Interest</label>
              <select required value={formData.interest} onChange={(e) => setFormData({...formData, interest: e.target.value})} className="mt-1 w-full p-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none">
                <option value="" disabled>Select your area of interest</option>
                <option value="Social Media Marketing">Social Media Marketing</option>
                <option value="Content Writing">Content Writing</option>
                <option value="Graphic Designing">Graphic Designing</option>
                <option value="Web Development">Web Development & Tech</option>
                <option value="Fundraising & Events">Fundraising & Events</option>
                <option value="On-Ground Volunteering">On-Ground Volunteering</option>
                <option value="Human Resources">Human Resources (HR)</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700">Availability</label>
              <select required value={formData.availability} onChange={(e) => setFormData({...formData, availability: e.target.value})} className="mt-1 w-full p-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none">
                <option value="Weekends">Weekends Only</option>
                <option value="Weekdays">Weekdays Only</option>
                <option value="Flexible">Fully Flexible</option>
              </select>
            </div>
            <button type="submit" className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-4 rounded-lg shadow-md transition duration-200">Submit Application</button>
          </form>
        </div>
      </main>
      <footer className="bg-gray-800 text-white text-center p-3 text-sm">© 2026 NayePankh Foundation. All Rights Reserved.</footer>
    </div>
  );
};

export default VolunteerForm;