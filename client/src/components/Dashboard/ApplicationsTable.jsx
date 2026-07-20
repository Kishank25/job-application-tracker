import { useState } from 'react';
import axios from 'axios';


function ApplicationsTable({ applications, token, onApplicationDeleted, onApplicationUpdated }) {
  const [updatingId, setUpdatingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  // Handle delete
  const handleDelete = async (appId) => {
    if (!window.confirm('Are you sure you want to delete this application?')) {
      return;
    }

    setDeletingId(appId);

    try {
      await axios.delete(
        `http://localhost:5000/api/applications/${appId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      // Tell parent: application deleted
      onApplicationDeleted(appId);

    } catch (err) {
      alert('Failed to delete application');
    } finally {
      setDeletingId(null);
    }
  };

  // Handle status update
  const handleStatusUpdate = async (appId, newStatus) => {
    setUpdatingId(appId);

    try {
      const response = await axios.put(
        `http://localhost:5000/api/applications/${appId}`,
        { status: newStatus },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      // Tell parent: application updated
      onApplicationUpdated(response.data.application);

    } catch (err) {
      alert('Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'Applied':
        return 'bg-yellow-100 text-yellow-800';
      case 'Interview':
        return 'bg-orange-100 text-orange-800';
      case 'Offer':
        return 'bg-green-100 text-green-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Format date
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900">📋 Your Applications</h2>
      </div>

      {/* Table for Desktop */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800">Company</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800">Position</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800">Salary</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800">Date</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800">Actions</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr key={app._id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                
                {/* Company */}
                <td className="px-6 py-4 text-sm text-gray-900 font-semibold">{app.companyName}</td>
                
                {/* Position */}
                <td className="px-6 py-4 text-sm text-gray-700">{app.position}</td>
                
                {/* Status Dropdown */}
                <td className="px-6 py-4">
                  <select
                    value={app.status}
                    onChange={(e) => handleStatusUpdate(app._id, e.target.value)}
                    disabled={updatingId === app._id}
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(app.status)} cursor-pointer`}
                  >
                    <option value="Applied">Applied</option>
                    <option value="Interview">Interview</option>
                    <option value="Offer">Offer</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </td>
                
                {/* Salary */}
                <td className="px-6 py-4 text-sm text-gray-700">
                  {app.salary ? `₹${app.salary}` : '-'}
                </td>
                
                {/* Date */}
                <td className="px-6 py-4 text-sm text-gray-700">
                  {formatDate(app.applicationDate)}
                </td>
                
                {/* Delete Button */}
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleDelete(app._id)}
                    disabled={deletingId === app._id}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition-colors disabled:opacity-50 text-sm"
                  >
                    {deletingId === app._id ? 'Deleting...' : 'Delete'}
                  </button>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Cards for Mobile */}
      <div className="md:hidden p-6 space-y-4">
        {applications.map((app) => (
          <div key={app._id} className="border border-gray-200 rounded-lg p-4">
            
            <div className="mb-3">
              <div className="text-lg font-bold text-gray-900">{app.companyName}</div>
              <div className="text-sm text-gray-600">{app.position}</div>
            </div>

            <div className="flex items-center justify-between mb-3">
              <select
                value={app.status}
                onChange={(e) => handleStatusUpdate(app._id, e.target.value)}
                disabled={updatingId === app._id}
                className={`px-2 py-1 rounded text-sm font-semibold ${getStatusColor(app.status)}`}
              >
                <option value="Applied">Applied</option>
                <option value="Interview">Interview</option>
                <option value="Offer">Offer</option>
                <option value="Rejected">Rejected</option>
              </select>
              
              <button
                onClick={() => handleDelete(app._id)}
                disabled={deletingId === app._id}
                className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
              >
                Delete
              </button>
            </div>

            <div className="text-xs text-gray-500">
              {formatDate(app.applicationDate)}
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}

export default ApplicationsTable;