// pages/HR/EmployeeDisciplinaryTab.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  FiAlertTriangle, 
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
  FiFileText,
  FiMessageSquare,
  FiFileText as FiGavel,
  FiClipboard
} from 'react-icons/fi';

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
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusStyles()}`}>
      {status || 'Unknown'}
    </span>
  );
};

// Action Type Badge Component
const ActionTypeBadge = ({ type }) => {
  const getTypeStyles = () => {
    switch(type?.toLowerCase()) {
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'suspension':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'termination':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'demotion':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'written warning':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'verbal warning':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getTypeStyles()}`}>
      {type || 'Unknown'}
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

const EmployeeDisciplinaryTab = () => {
  // Get employee ID from URL params
  const { id } = useParams();
  
  // State
  const [actions, setActions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingAction, setEditingAction] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [actionToDelete, setActionToDelete] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch disciplinary actions
  useEffect(() => {
    if (id) {
      fetchActions();
    }
  }, [id]);

  const fetchActions = async () => {
    console.log('📥 Fetching disciplinary actions for employee:', id);
    setLoading(true);
    setError('');

    try {
      // Build filters
      const filters = [
        ["employee", "=", id]
      ];
      
      const url = `/api/resource/Disciplinary%20Action?filters=${JSON.stringify(filters)}&fields=["*"]`;
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
        throw new Error(result.message || 'Failed to fetch disciplinary actions');
      }

      setActions(result.data || []);
    } catch (err) {
      console.error('❌ Error:', err);
      setError(err.message || 'Failed to load disciplinary actions');
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics
  const totalActions = actions.length;
  const pendingActions = actions.filter(a => a.status?.toLowerCase() === 'pending').length;
  const warningsCount = actions.filter(a => 
    a.action_type?.toLowerCase().includes('warning')
  ).length;
  const suspensionsCount = actions.filter(a => 
    a.action_type?.toLowerCase() === 'suspension'
  ).length;

  // Handlers
  const handleDeleteClick = (action) => {
    setActionToDelete(action);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    if (!actionToDelete) return;
    
    setShowDeleteConfirm(false);
    setLoading(true);

    try {
      const url = `/api/resource/Disciplinary%20Action/${actionToDelete.name}`;
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete disciplinary action');
      }

      setSuccessMessage(`Disciplinary action has been deleted successfully.`);
      await fetchActions();
      setActionToDelete(null);
    } catch (err) {
      setError(err.message || 'Failed to delete disciplinary action');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
    setActionToDelete(null);
  };

  const handleEdit = (action) => {
    setEditingAction(action);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEditCancel = () => {
    setEditingAction(null);
    setShowForm(false);
  };

  const handleEditSuccess = (updatedAction) => {
    setSuccessMessage(`Disciplinary action has been updated successfully.`);
    setEditingAction(null);
    setShowForm(false);
    fetchActions();
  };

  const handleCreateSuccess = (newAction) => {
    setSuccessMessage(`Disciplinary action has been created successfully.`);
    setShowForm(false);
    fetchActions();
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
        title="Delete Disciplinary Action"
        message={`Are you sure you want to delete this disciplinary action? This action cannot be undone.`}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <FiAlertTriangle className="mr-3 text-red-500" />
                Disciplinary Actions
              </h1>
              <div className="mt-2 flex items-center text-sm text-gray-600">
                <FiUser className="mr-2" />
                Employee ID: <span className="ml-1 font-mono font-medium text-blue-600">{id}</span>
              </div>
            </div>
            
            <button
              onClick={() => {
                setEditingAction(null);
                setShowForm(true);
              }}
              className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all shadow-sm"
            >
              <FiPlus className="mr-2" />
              New Action
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
            icon={FiAlertTriangle}
            label="Total Actions"
            value={totalActions}
            color="text-red-600"
            bgColor="bg-red-100"
          />
          <StatsCard
            icon={FiClock}
            label="Pending"
            value={pendingActions}
            color="text-yellow-600"
            bgColor="bg-yellow-100"
          />
          <StatsCard
            icon={FiMessageSquare}
            label="Warnings"
            value={warningsCount}
            color="text-orange-600"
            bgColor="bg-orange-100"
          />
          <StatsCard
            icon={FiGavel}
            label="Suspensions"
            value={suspensionsCount}
            color="text-purple-600"
            bgColor="bg-purple-100"
          />
        </div>

        {/* Create/Edit Form */}
        {showForm && (
          <div className="mb-8">
            {editingAction ? (
              <DisciplinaryEdit 
                action={editingAction}
                employeeId={id}
                onSuccess={handleEditSuccess}
                onCancel={handleEditCancel}
              />
            ) : (
              <DisciplinaryCreate 
                employeeId={id}
                onSuccess={handleCreateSuccess}
                onCancel={handleEditCancel}
              />
            )}
          </div>
        )}

        {/* Actions Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <FiClipboard className="mr-2 text-gray-500" />
                Disciplinary History
              </h3>
              <span className="text-sm text-gray-600">
                {actions.length} {actions.length === 1 ? 'record' : 'records'} found
              </span>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-16">
              <FiLoader className="animate-spin h-10 w-10 text-red-600 mx-auto mb-3" />
              <p className="text-sm text-gray-600">Loading disciplinary actions...</p>
            </div>
          ) : actions.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiAlertTriangle className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">No actions found</h3>
              <p className="text-sm text-gray-600 mb-4">
                No disciplinary actions found for this employee.
              </p>
              <button
                onClick={() => {
                  setEditingAction(null);
                  setShowForm(true);
                }}
                className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <FiPlus className="mr-2" />
                Create First Action
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Reason
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action Taken
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
                  {actions.map((action) => (
                    <tr key={action.name} className="hover:bg-gray-50 transition-colors group">
                      <td className="px-6 py-4">
                        <ActionTypeBadge type={action.action_type} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-600">
                          <FiCalendar className="mr-2 text-gray-400" />
                          {new Date(action.action_date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-600 max-w-xs truncate" title={action.reason}>
                          {action.reason}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-600 max-w-xs truncate" title={action.action_taken}>
                          {action.action_taken}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={action.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleEdit(action)}
                            className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit action"
                          >
                            <FiEdit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(action)}
                            className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete action"
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

        {/* Notes Section */}
        {actions.some(a => a.notes) && (
          <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <FiFileText className="mr-2 text-gray-500" />
              Additional Notes
            </h3>
            <div className="space-y-4">
              {actions.filter(a => a.notes).map(action => (
                <div key={`notes-${action.name}`} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center mb-2">
                    <ActionTypeBadge type={action.action_type} />
                    <span className="mx-2 text-gray-400">•</span>
                    <span className="text-sm text-gray-600">
                      {new Date(action.action_date).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{action.notes}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Disciplinary Create Component
export const DisciplinaryCreate = ({ employeeId, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    employee: employeeId,
    employee_name: '',
    action_type: 'Warning',
    action_date: new Date().toISOString().split('T')[0],
    reason: '',
    action_taken: '',
    notes: '',
    status: 'Pending'
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const actionTypes = [
    'Verbal Warning',
    'Written Warning',
    'Warning',
    'Suspension',
    'Demotion',
    'Termination',
    'Other'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/resource/Disciplinary%20Action', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.exception || 'Failed to create disciplinary action');
      }
      
      if (onSuccess) {
        onSuccess(data.data);
      }
      
    } catch (err) {
      setError(err.message || 'Failed to create disciplinary action');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl border border-red-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <FiPlus className="mr-2 text-red-600" />
        Create New Disciplinary Action
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
              Action Type *
            </label>
            <select
              name="action_type"
              value={formData.action_type}
              onChange={handleInputChange}
              required
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 disabled:bg-gray-100"
            >
              {actionTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Action Date *
            </label>
            <input
              type="date"
              name="action_date"
              value={formData.action_date}
              onChange={handleInputChange}
              required
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 disabled:bg-gray-100"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Reason *
          </label>
          <textarea
            name="reason"
            value={formData.reason}
            onChange={handleInputChange}
            required
            rows="3"
            placeholder="Enter reason for disciplinary action"
            disabled={loading}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 disabled:bg-gray-100 resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Action Taken *
          </label>
          <textarea
            name="action_taken"
            value={formData.action_taken}
            onChange={handleInputChange}
            required
            rows="3"
            placeholder="Describe the action taken"
            disabled={loading}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 disabled:bg-gray-100 resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Additional Notes
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
            rows="2"
            placeholder="Any additional notes or comments"
            disabled={loading}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 disabled:bg-gray-100 resize-none"
          />
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
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 disabled:bg-gray-100"
          >
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
            <option value="Completed">Completed</option>
          </select>
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
            className="px-4 py-2 bg-red-600 border border-transparent rounded-lg text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all inline-flex items-center"
          >
            {loading ? (
              <>
                <FiLoader className="animate-spin -ml-1 mr-2 h-4 w-4" />
                Creating...
              </>
            ) : (
              <>
                <FiPlus className="mr-2" />
                Create Action
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

// Disciplinary Edit Component
export const DisciplinaryEdit = ({ action, employeeId, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    employee: employeeId,
    employee_name: action.employee_name || '',
    action_type: action.action_type || 'Warning',
    action_date: action.action_date || new Date().toISOString().split('T')[0],
    reason: action.reason || '',
    action_taken: action.action_taken || '',
    notes: action.notes || '',
    status: action.status || 'Pending'
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const actionTypes = [
    'Verbal Warning',
    'Written Warning',
    'Warning',
    'Suspension',
    'Demotion',
    'Termination',
    'Other'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/resource/Disciplinary%20Action/${action.name}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.exception || 'Failed to update disciplinary action');
      }
      
      if (onSuccess) {
        onSuccess(data.data);
      }
      
    } catch (err) {
      setError(err.message || 'Failed to update disciplinary action');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <FiEdit2 className="mr-2 text-yellow-600" />
        Edit Disciplinary Action
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
              Action Type *
            </label>
            <select
              name="action_type"
              value={formData.action_type}
              onChange={handleInputChange}
              required
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 disabled:bg-gray-100"
            >
              {actionTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Action Date *
            </label>
            <input
              type="date"
              name="action_date"
              value={formData.action_date}
              onChange={handleInputChange}
              required
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 disabled:bg-gray-100"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Reason *
          </label>
          <textarea
            name="reason"
            value={formData.reason}
            onChange={handleInputChange}
            required
            rows="3"
            placeholder="Enter reason for disciplinary action"
            disabled={loading}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 disabled:bg-gray-100 resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Action Taken *
          </label>
          <textarea
            name="action_taken"
            value={formData.action_taken}
            onChange={handleInputChange}
            required
            rows="3"
            placeholder="Describe the action taken"
            disabled={loading}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 disabled:bg-gray-100 resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Additional Notes
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
            rows="2"
            placeholder="Any additional notes or comments"
            disabled={loading}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 disabled:bg-gray-100 resize-none"
          />
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
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
            <option value="Completed">Completed</option>
          </select>
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
                Update Action
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmployeeDisciplinaryTab;