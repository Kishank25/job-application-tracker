import { useState } from 'react';
import axios from 'axios';

function ApplicationForm({ token, onApplicationAdded }) {
  // Form state
  const [companyName, setCompanyName] = useState('');
  const [position, setPosition] = useState('');
  const [status, setStatus] = useState('Applied');
  const [salary, setSalary] = useState('');
  const [notes, setNotes] = useState('');
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();  // Prevent page reload
    setError('');
    setSuccess('');

    // Validation
    if (!companyName || !position) {
      setError('Company and Position are required');
      return;
    }

    setLoading(true);

    try {
      // Send to backend
      const response = await axios.post(
        'http://localhost:5000/api/applications',
        {
          companyName,
          position,
          status,
          salary,
          notes
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      // Backend returns the created application
      const newApplication = response.data.application;

      // Show success message
      setSuccess(`✅ Application added for ${companyName}!`);

      // Tell parent component about new app
      onApplicationAdded(newApplication);

      // Clear form
      setCompanyName('');
      setPosition('');
      setStatus('Applied');
      setSalary('');
      setNotes('');

      // Hide success message after 2 seconds
      setTimeout(() => setSuccess(''), 2000);

    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add application');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
      
      <h2 className="text-2xl font-bold text-gray-900 mb-6">➕ Add New Application</h2>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="bg-green-50 border-l-4 border-green-500 text-green-700 px-4 py-3 rounded-lg mb-4">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Company Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            🏢 Company Name
          </label>
          <input
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="e.g., Google"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            disabled={loading}
          />
        </div>

        {/* Position */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            💼 Position
          </label>
          <input
            type="text"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            placeholder="e.g., Frontend Developer"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            disabled={loading}
          />
        </div>

        {/* Status Dropdown */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            📊 Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          >
            <option value="Applied">Applied</option>
            <option value="Interview">Interview Scheduled</option>
            <option value="Offer">Offer Received</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        {/* Salary */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            💰 Expected Salary (Optional)
          </label>
          <input
            type="text"
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
            placeholder="e.g., 50000"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          />
        </div>

        {/* Notes - Full Width */}
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            📝 Notes (Optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any additional notes..."
            rows="3"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          />
        </div>

        {/* Submit Button - Full Width */}
        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-blue-600 text-white font-semibold py-3 rounded-lg transition-all duration-200 ${
              loading 
                ? 'opacity-50 cursor-not-allowed' 
                : 'hover:bg-blue-700 shadow-md hover:shadow-lg'
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <span className="animate-spin mr-2">⏳</span>
                Adding Application...
              </span>
            ) : (
              '✨ Add Application'
            )}
          </button>
        </div>

      </form>

    </div>
  );
}

export default ApplicationForm;