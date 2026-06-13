import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [volunteers, setVolunteers] = useState([]);
  const [reports, setReports] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('adminToken');

  const fetchData = async () => {
    setIsLoading(true);
    const config = { headers: { Authorization: `Bearer ${token}` } };
    try {
      const volRes = await axios.get('http://localhost:5000/api/volunteers', config);
      const repRes = await axios.get('http://localhost:5000/api/reports', config);
      setVolunteers(volRes.data);
      setReports(repRes.data);
    } catch (err) {
      localStorage.removeItem('adminToken');
      navigate('/login');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchData();
  }, [token, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/login');
  };

  // Filter volunteers based on search input
  const filteredVolunteers = volunteers.filter(vol => 
    vol.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    vol.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vol.interest.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl font-semibold text-gray-600 animate-pulse">Loading Dashboard Data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 pb-10">
      <nav className="bg-gray-800 text-white p-4 flex justify-between items-center shadow-md">
        <h1 className="text-xl font-bold tracking-wide">NayePankh Management Panel</h1>
        <div className="flex gap-4 items-center">
          <button onClick={fetchData} className="text-sm text-gray-300 hover:text-white transition">↻ Refresh</button>
          <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded transition font-medium text-sm shadow-sm">Logout</button>
        </div>
      </nav>

      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Reports Cards Row */}
        {reports && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-orange-500">
              <h3 className="text-gray-500 font-bold uppercase tracking-wider text-xs">Total Registered Volunteers</h3>
              <p className="text-4xl font-extrabold text-gray-800 mt-2">{reports.totalVolunteers}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-500">
              <h3 className="text-gray-500 font-bold uppercase tracking-wider text-xs mb-3">By Interest Areas</h3>
              <div className="text-sm text-gray-700 space-y-2 max-h-32 overflow-y-auto pr-2">
                {Object.keys(reports.byInterest).length === 0 ? <span className="text-gray-400">No data yet</span> : null}
                {Object.entries(reports.byInterest).map(([key, val]) => (
                  <div key={key} className="flex justify-between items-center border-b border-gray-50 pb-1">
                    <span className="truncate pr-2">{key}</span> 
                    <span className="font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full text-xs">{val}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-500">
              <h3 className="text-gray-500 font-bold uppercase tracking-wider text-xs mb-3">By Availability</h3>
              <div className="text-sm text-gray-700 space-y-2">
                {Object.keys(reports.byAvailability).length === 0 ? <span className="text-gray-400">No data yet</span> : null}
                {Object.entries(reports.byAvailability).map(([key, val]) => (
                  <div key={key} className="flex justify-between items-center border-b border-gray-50 pb-1">
                    <span>{key}</span> 
                    <span className="font-bold bg-green-50 text-green-700 px-2 py-0.5 rounded-full text-xs">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Volunteers Table Grid */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
          <div className="p-5 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-lg font-bold text-gray-800">Detailed Volunteer Registry</h2>
            <input 
              type="text" 
              placeholder="Search by name, email, or domain..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm w-full sm:w-72 focus:ring-2 focus:ring-orange-500 outline-none transition"
            />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 uppercase text-xs font-bold tracking-wider border-b border-gray-200">
                  <th className="p-4">Name</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Phone</th>
                  <th className="p-4">Core Interest</th>
                  <th className="p-4">Availability</th>
                  <th className="p-4">Date Applied</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                {filteredVolunteers.length === 0 ? (
                  <tr><td colSpan="6" className="p-8 text-center text-gray-400 font-medium">No volunteers match your search.</td></tr>
                ) : (
                  filteredVolunteers.map((vol, idx) => (
                    <tr key={idx} className="hover:bg-orange-50/50 transition">
                      <td className="p-4 font-semibold text-gray-900">{vol.fullName}</td>
                      <td className="p-4 text-gray-600">{vol.email}</td>
                      <td className="p-4 text-gray-600">{vol.phone}</td>
                      <td className="p-4">
                        <span className="px-3 py-1 text-xs font-semibold bg-orange-100 text-orange-800 rounded-full border border-orange-200 whitespace-nowrap">
                          {vol.interest}
                        </span>
                      </td>
                      <td className="p-4 text-gray-600">{vol.availability}</td>
                      <td className="p-4 text-gray-400 text-xs">{vol.registrationDate}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;