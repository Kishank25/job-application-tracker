import { useState, useEffect } from 'react';
import axios from "axios";
import ApplicationForm from './ApplicationForm';
import ApplicationsTable from './ApplicationsTable';

function Dashboard({ token, userId, onLogout }) {
  // State to store all applications
  const [applications, setApplications] = useState([]);
  
  // State to show loading while fetching
  const [loading, setLoading] = useState(true);
  
  // State to show errors
  const [error, setError] = useState('');
  
  // State for stats
  const [stats, setStats] = useState({
    total: 0,
    applied: 0,
    interview: 0,
    offers: 0,
    rejected: 0
  });

  // When component loads, fetch all applications
  useEffect(() => {
    fetchApplications();
  }, []);  // Run once when component loads

  // Function to fetch applications from backend
  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        'http://localhost:5000/api/applications',
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      // Backend returns: { applications: [...] }
      const apps = response.data.applications;
      setApplications(apps);
      
      // Calculate statistics
      calculateStats(apps);
      
    } catch (err) {
      setError('Failed to load applications');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Function to calculate stats
  const calculateStats = (apps) => {
    // apps = array of applications
    const newStats = {
      total: apps.length,  // Count total
      applied: 0,
      interview: 0,
      offers: 0,
      rejected: 0
    };

    // Count each status
    apps.forEach(app => {
      if (app.status === 'Applied') newStats.applied++;
      else if (app.status === 'Interview') newStats.interview++;
      else if (app.status === 'Offer') newStats.offers++;
      else if (app.status === 'Rejected') newStats.rejected++;
    });

    setStats(newStats);
  };

  // When user adds new application
  const handleApplicationAdded = (newApp) => {
    // Add to list
    setApplications([newApp, ...applications]);
    
    // Recalculate stats
    calculateStats([newApp, ...applications]);
  };

  // When user deletes application
  const handleApplicationDeleted = (appId) => {
    // Remove from list
    const updated = applications.filter(app => app._id !== appId);
    setApplications(updated);
    
    // Recalculate stats
    calculateStats(updated);
  };

  // When user updates status
  const handleApplicationUpdated = (updatedApp) => {
    // Find and replace in list
    const updated = applications.map(app =>
      app._id === updatedApp._id ? updatedApp : app
    );
    setApplications(updated);
    
    // Recalculate stats
    calculateStats(updated);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">JobSync</h1>
            <p className="text-sm text-gray-600">Track your job applications</p>
          </div>
          
          <button
            onClick={onLogout}
            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-all duration-200 font-semibold shadow-md"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        
        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          
          {/* Total Applications Card */}
          <div className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow">
            <div className="text-4xl font-bold text-blue-600">{stats.total}</div>
            <p className="text-gray-600 mt-2">Total Applications</p>
          </div>

          {/* Applied Card */}
          <div className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow">
            <div className="text-4xl font-bold text-yellow-600">{stats.applied}</div>
            <p className="text-gray-600 mt-2">Applied</p>
          </div>

          {/* Interview Card */}
          <div className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow">
            <div className="text-4xl font-bold text-orange-600">{stats.interview}</div>
            <p className="text-gray-600 mt-2">Interviews</p>
          </div>

          {/* Offers Card */}
          <div className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow">
            <div className="text-4xl font-bold text-green-600">{stats.offers}</div>
            <p className="text-gray-600 mt-2">Offers</p>
          </div>

          {/* Rejected Card */}
          <div className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow">
            <div className="text-4xl font-bold text-red-600">{stats.rejected}</div>
            <p className="text-gray-600 mt-2">Rejected</p>
          </div>

        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Add Application Form */}
        <ApplicationForm 
          token={token} 
          onApplicationAdded={handleApplicationAdded}
        />

        {/* Applications List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">Loading applications...</div>
          </div>
        ) : applications.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">📋</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Applications Yet</h2>
            <p className="text-gray-600">Add your first job application using the form above!</p>
          </div>
        ) : (
          <ApplicationsTable 
            applications={applications}
            token={token}
            onApplicationDeleted={handleApplicationDeleted}
            onApplicationUpdated={handleApplicationUpdated}
          />
        )}

      </main>

    </div>
  );
}

export default Dashboard;