// pages/HR/EmployeeGuaranteeTab.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  FiShield, 
  FiPlus, 
  FiEdit2, 
  FiTrash2, 
  FiAlertCircle, 
  FiX,
  FiLoader,
  FiCalendar,
  FiUser,
  FiCheckCircle,
  FiClock,
  FiBriefcase,
  FiFileText,
  FiUsers
} from 'react-icons/fi';
import "./EmployeeDetail.css";

// Confirmation Dialog Component
const ConfirmDialog = ({ isOpen, title, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-auto animate-fadeIn">
        <div className="p-6">
          <div className="flex items-center justify-center w-16 h-16 mx-auto bg-red-100 rounded-full mb-4">
            <FiAlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-xl font-semibold text-center text-gray-900 mb-2">{title}</h3>
          <p className="text-sm text-center text-gray-600 mb-6">{message}</p>
          <div className="flex justify-center space-x-3">
            <button
              onClick={onCancel}
              className="px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-6 py-2.5 bg-red-600 border border-transparent rounded-lg text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all"
            >
              Confirm Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Success Toast Component
const SuccessToast = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-4 right-4 bg-green-50 border border-green-200 rounded-xl shadow-lg p-4 max-w-md animate-slideIn z-50">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <FiCheckCircle className="h-5 w-5 text-green-500" />
        </div>
        <div className="ml-3 flex-1">
          <p className="text-sm font-medium text-green-800">{message}</p>
        </div>
        <button onClick={onClose} className="ml-4 flex-shrink-0">
          <FiX className="h-4 w-4 text-green-600 hover:text-green-800" />
        </button>
      </div>
    </div>
  );
};

// Status Badge Component
const StatusBadge = ({ status }) => {
  const getStatusStyles = () => {
    switch(status?.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'expired':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusStyles()}`}>
      {status || 'Unknown'}
    </span>
  );
};

// Stats Card Component
const StatsCard = ({ icon: Icon, label, value, color, bgColor }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-600 mb-1">{label}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
      <div className={`w-12 h-12 ${bgColor} rounded-lg flex items-center justify-center`}>
        <Icon className={`w-6 h-6 ${color}`} />
      </div>
    </div>
  </div>
);

const EmployeeGuaranteeTab = () => {
  // Get employee ID from URL params
  const { id } = useParams();
  
  // State
  const [guarantees, setGuarantees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingGuarantee, setEditingGuarantee] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [guaranteeToDelete, setGuaranteeToDelete] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch guarantees
  useEffect(() => {
    if (id) {
      fetchGuarantees();
    }
  }, [id]);

  const fetchGuarantees = async () => {
    console.log('📥 Fetching guarantees for employee:', id);
    setLoading(true);
    setError('');

    try {
      // Build filters
      const filters = [
        ["employee", "=", id]
      ];
      
      const url = `/api/resource/Guarantee?filters=${JSON.stringify(filters)}&fields=["*"]`;
      console.log('📡 API URL:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const result = await response.json();
      console.log('📡 Response:', result);
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch guarantees');
      }

      setGuarantees(result.data || []);
    } catch (err) {
      console.error('❌ Error:', err);
      setError(err.message || 'Failed to load guarantees');
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics
  const activeGuarantees = guarantees.filter(g => g.status?.toLowerCase() === 'active').length;
  const pendingGuarantees = guarantees.filter(g => g.status?.toLowerCase() === 'pending').length;
  const expiredGuarantees = guarantees.filter(g => g.status?.toLowerCase() === 'expired').length;
  const totalCompanies = new Set(guarantees.map(g => g.company_name)).size;

  // Handlers
  const handleDeleteClick = (guarantee) => {
    setGuaranteeToDelete(guarantee);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    if (!guaranteeToDelete) return;
    
    setShowDeleteConfirm(false);
    setLoading(true);

    try {
      const url = `/api/resource/Guarantee/${guaranteeToDelete.name}`;
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete guarantee');
      }

      setSuccessMessage(`Guarantee has been deleted successfully.`);
      await fetchGuarantees();
      setGuaranteeToDelete(null);
    } catch (err) {
      setError(err.message || 'Failed to delete guarantee');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
    setGuaranteeToDelete(null);
  };

  const handleEdit = (guarantee) => {
    setEditingGuarantee(guarantee);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEditCancel = () => {
    setEditingGuarantee(null);
    setShowForm(false);
  };

  const handleEditSuccess = (updatedGuarantee) => {
    setSuccessMessage(`Guarantee has been updated successfully.`);
    setEditingGuarantee(null);
    setShowForm(false);
    fetchGuarantees();
  };

  const handleCreateSuccess = (newGuarantee) => {
    setSuccessMessage(`Guarantee has been created successfully.`);
    setShowForm(false);
    fetchGuarantees();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Success Toast */}
      {successMessage && (
        <SuccessToast 
          message={successMessage} 
          onClose={() => setSuccessMessage('')} 
        />
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Delete Guarantee"
        message={`Are you sure you want to delete this guarantee? This action cannot be undone.`}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <FiShield className="mr-3 text-blue-600" />
                Employee Guarantees
              </h1>
              <div className="mt-2 flex items-center text-sm text-gray-600">
                <FiUser className="mr-2" />
                Employee ID: <span className="ml-1 font-mono font-medium text-blue-600">{id}</span>
              </div>
            </div>
            
            <button
              onClick={() => {
                setEditingGuarantee(null);
                setShowForm(true);
              }}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-sm"
            >
              <FiPlus className="mr-2" />
              New Guarantee
            </button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 rounded-lg p-4">
            <div className="flex items-center">
              <FiAlertCircle className="text-red-500 mr-3" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatsCard
            icon={FiShield}
            label="Total Guarantees"
            value={guarantees.length}
            color="text-blue-600"
            bgColor="bg-blue-100"
          />
          <StatsCard
            icon={FiCheckCircle}
            label="Active"
            value={activeGuarantees}
            color="text-green-600"
            bgColor="bg-green-100"
          />
          <StatsCard
            icon={FiClock}
            label="Pending"
            value={pendingGuarantees}
            color="text-yellow-600"
            bgColor="bg-yellow-100"
          />
          <StatsCard
            icon={FiBriefcase}
            label="Companies"
            value={totalCompanies}
            color="text-purple-600"
            bgColor="bg-purple-100"
          />
        </div>

        {/* Create/Edit Form */}
        {showForm && (
          <div className="mb-8">
            {editingGuarantee ? (
              <GuaranteeEdit 
                guarantee={editingGuarantee}
                employeeId={id}
                onSuccess={handleEditSuccess}
                onCancel={handleEditCancel}
              />
            ) : (
              <GuaranteeCreate 
                employeeId={id}
                onSuccess={handleCreateSuccess}
                onCancel={handleEditCancel}
              />
            )}
          </div>
        )}

        {/* Guarantees Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <FiFileText className="mr-2 text-gray-500" />
                Guarantee History
              </h3>
              <span className="text-sm text-gray-600">
                {guarantees.length} {guarantees.length === 1 ? 'record' : 'records'} found
              </span>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-16">
              <FiLoader className="animate-spin h-10 w-10 text-blue-600 mx-auto mb-3" />
              <p className="text-sm text-gray-600">Loading guarantees...</p>
            </div>
          ) : guarantees.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiShield className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">No guarantees found</h3>
              <p className="text-sm text-gray-600 mb-4">
                No guarantee records found for this employee.
              </p>
              <button
                onClick={() => {
                  setEditingGuarantee(null);
                  setShowForm(true);
                }}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FiPlus className="mr-2" />
                Create First Guarantee
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Company
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Person Guaranteed
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Duration
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {guarantees.map((guarantee) => (
                    <tr key={guarantee.name} className="hover:bg-gray-50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <FiBriefcase className="mr-2 text-gray-400" />
                          <span className="text-sm font-medium text-gray-900">
                            {guarantee.company_name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <FiUsers className="mr-2 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            {guarantee.person_guaranteed || 'N/A'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600">
                          <div className="flex items-center">
                            <FiCalendar className="mr-1 text-gray-400" size={12} />
                            {new Date(guarantee.start_date).toLocaleDateString()}
                          </div>
                          <div className="flex items-center mt-1">
                            <FiCalendar className="mr-1 text-gray-400" size={12} />
                            {new Date(guarantee.end_date).toLocaleDateString()}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={guarantee.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleEdit(guarantee)}
                            className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit guarantee"
                          >
                            <FiEdit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(guarantee)}
                            className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete guarantee"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Guarantee Create Component
export const GuaranteeCreate = ({ employeeId, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    employee: employeeId,
    employee_name: '',
    is_guarantee: true,
    company_name: '',
    person_guaranteed: '',
    start_date: new Date().toISOString().split('T')[0],
    end_date: '',
    status: 'Pending'
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate end date
    if (new Date(formData.end_date) <= new Date(formData.start_date)) {
      setError('End date must be after start date');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/resource/Guarantee', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.exception || 'Failed to create guarantee');
      }
      
      if (onSuccess) {
        onSuccess(data.data);
      }
      
    } catch (err) {
      setError(err.message || 'Failed to create guarantee');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <FiPlus className="mr-2 text-blue-600" />
        Create New Guarantee
      </h3>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Company Name *
            </label>
            <input
              type="text"
              name="company_name"
              value={formData.company_name}
              onChange={handleInputChange}
              required
              placeholder="Enter company name"
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Person Guaranteed
            </label>
            <input
              type="text"
              name="person_guaranteed"
              value={formData.person_guaranteed}
              onChange={handleInputChange}
              placeholder="Enter person name"
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date *
            </label>
            <input
              type="date"
              name="start_date"
              value={formData.start_date}
              onChange={handleInputChange}
              required
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date *
            </label>
            <input
              type="date"
              name="end_date"
              value={formData.end_date}
              onChange={handleInputChange}
              required
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status *
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            required
            disabled={loading}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          >
            <option value="Pending">Pending</option>
            <option value="Active">Active</option>
            <option value="Expired">Expired</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            name="is_guarantee"
            checked={formData.is_guarantee}
            onChange={handleInputChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label className="ml-2 block text-sm text-gray-700">
            This is a guarantee
          </label>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 border border-transparent rounded-lg text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all inline-flex items-center"
          >
            {loading ? (
              <>
                <FiLoader className="animate-spin -ml-1 mr-2 h-4 w-4" />
                Creating...
              </>
            ) : (
              <>
                <FiPlus className="mr-2" />
                Create Guarantee
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

// Guarantee Edit Component
export const GuaranteeEdit = ({ guarantee, employeeId, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    employee: employeeId,
    employee_name: guarantee.employee_name || '',
    is_guarantee: guarantee.is_guarantee || true,
    company_name: guarantee.company_name || '',
    person_guaranteed: guarantee.person_guaranteed || '',
    start_date: guarantee.start_date || new Date().toISOString().split('T')[0],
    end_date: guarantee.end_date || '',
    status: guarantee.status || 'Pending'
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate end date
    if (new Date(formData.end_date) <= new Date(formData.start_date)) {
      setError('End date must be after start date');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/resource/Guarantee/${guarantee.name}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.exception || 'Failed to update guarantee');
      }
      
      if (onSuccess) {
        onSuccess(data.data);
      }
      
    } catch (err) {
      setError(err.message || 'Failed to update guarantee');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <FiEdit2 className="mr-2 text-yellow-600" />
        Edit Guarantee
      </h3>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Company Name *
            </label>
            <input
              type="text"
              name="company_name"
              value={formData.company_name}
              onChange={handleInputChange}
              required
              placeholder="Enter company name"
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 disabled:bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Person Guaranteed
            </label>
            <input
              type="text"
              name="person_guaranteed"
              value={formData.person_guaranteed}
              onChange={handleInputChange}
              placeholder="Enter person name"
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 disabled:bg-gray-100"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date *
            </label>
            <input
              type="date"
              name="start_date"
              value={formData.start_date}
              onChange={handleInputChange}
              required
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 disabled:bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date *
            </label>
            <input
              type="date"
              name="end_date"
              value={formData.end_date}
              onChange={handleInputChange}
              required
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 disabled:bg-gray-100"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status *
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            required
            disabled={loading}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 disabled:bg-gray-100"
          >
            <option value="Pending">Pending</option>
            <option value="Active">Active</option>
            <option value="Expired">Expired</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            name="is_guarantee"
            checked={formData.is_guarantee}
            onChange={handleInputChange}
            className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
          />
          <label className="ml-2 block text-sm text-gray-700">
            This is a guarantee
          </label>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-yellow-600 border border-transparent rounded-lg text-sm font-medium text-white hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-all inline-flex items-center"
          >
            {loading ? (
              <>
                <FiLoader className="animate-spin -ml-1 mr-2 h-4 w-4" />
                Updating...
              </>
            ) : (
              <>
                <FiEdit2 className="mr-2" />
                Update Guarantee
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmployeeGuaranteeTab;