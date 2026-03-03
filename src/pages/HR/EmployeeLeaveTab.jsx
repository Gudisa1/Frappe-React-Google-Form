// pages/HR/EmployeeLeaveTab.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  FiCalendar,
  FiPlus,
  FiX,
  FiAlertCircle,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiUser,
  FiType,
  FiFileText,
  FiHeart,
  FiChevronDown,
  FiChevronUp,
  FiLoader
} from 'react-icons/fi';
import { getEmployeeLeaves, createLeave } from '../../api/hrapi';

const EmployeeLeaveTab = () => {
  // Get employee ID from URL params
  const { id } = useParams();
  console.log('🔍 Employee ID from URL:', id);

  const [showRequestForm, setShowRequestForm] = useState(false);
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  const [formData, setFormData] = useState({
    leave_type: 'Annual Leave',
    start_date: '',
    end_date: '',
    reason: '',
    employee: id
  });

  const leaveTypes = [
    'Annual Leave',
    'Sick Leave',
    'Maternity Leave',
    'Paternity Leave',
    'Compassionate Leave',
    'Unpaid Leave'
  ];

  // Fetch leaves when component mounts or employeeId changes
  useEffect(() => {
    if (id) {
      fetchLeaves();
    }
  }, [id]);

  const fetchLeaves = async () => {
    console.log('📥 Fetching leaves for employee:', id);
    setLoading(true);
    setError('');
    
    try {
      const data = await getEmployeeLeaves(id);
      console.log('✅ Leaves data received:', data);
      
      if (!Array.isArray(data)) {
        console.log('⚠️ API returned non-array data:', data);
        setLeaves([]);
        return;
      }
      
      // Transform data for UI
      const transformedLeaves = data.map(leave => ({
        id: leave.name,
        type: leave.leave_type || 'Unknown',
        startDate: leave.start_date,
        endDate: leave.end_date,
        days: leave.total_days || calculateDays(leave.start_date, leave.end_date),
        reason: leave.reason || '',
        status: leave.status || 'Pending'
      }));
      
      console.log(`✅ Transformed ${transformedLeaves.length} leave records`);
      setLeaves(transformedLeaves);
    } catch (err) {
      console.error('❌ Error fetching leaves:', err);
      setError('Failed to load leave records');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const calculateDays = (start, end) => {
    if (!start || !end) return 0;
    try {
      const startDate = new Date(start);
      const endDate = new Date(end);
      
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) return 0;
      
      const diffTime = Math.abs(endDate - startDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      return diffDays;
    } catch (error) {
      return 0;
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.start_date) errors.start_date = 'Start date is required';
    if (!formData.end_date) errors.end_date = 'End date is required';
    if (!formData.reason) errors.reason = 'Reason is required';
    if (formData.reason && formData.reason.length < 5) {
      errors.reason = 'Reason must be at least 5 characters';
    }
    
    if (formData.start_date && formData.end_date) {
      const start = new Date(formData.start_date);
      const end = new Date(formData.end_date);
      if (end < start) {
        errors.end_date = 'End date cannot be before start date';
      }
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setSubmitting(true);
    setError('');
    setSuccessMessage('');

    try {
      const totalDays = calculateDays(formData.start_date, formData.end_date);
      
      const payload = {
        employee: id,
        leave_type: formData.leave_type,
        start_date: formData.start_date,
        end_date: formData.end_date,
        reason: formData.reason,
        total_days: totalDays.toString(),
        status: 'Pending'
      };

      console.log('📦 Creating leave with payload:', payload);

      const response = await createLeave(payload);
      console.log('✅ Leave created:', response);
      
      setSuccessMessage('Leave request submitted successfully');
      
      // Refresh leaves list
      await fetchLeaves();
      
      // Reset form
      setFormData({
        leave_type: 'Annual Leave',
        start_date: '',
        end_date: '',
        reason: '',
        employee: id
      });
      setValidationErrors({});
      
      // Auto-hide success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);

    } catch (err) {
      console.error('❌ Error submitting leave:', err);
      setError(err.message || 'Failed to submit leave request');
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      leave_type: 'Annual Leave',
      start_date: '',
      end_date: '',
      reason: '',
      employee: id
    });
    setValidationErrors({});
    setError('');
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'Invalid Date';
    }
  };

  const getStatusBadge = (status) => {
    const config = {
      'Approved': { className: 'bg-green-100 text-green-800 border-green-200', icon: <FiCheckCircle className="mr-1" /> },
      'Pending': { className: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: <FiClock className="mr-1" /> },
      'Rejected': { className: 'bg-red-100 text-red-800 border-red-200', icon: <FiXCircle className="mr-1" /> }
    };
    
    const statusKey = status || 'Pending';
    return config[statusKey] || config['Pending'];
  };

  // Calculate leave statistics
  const getLeaveStats = () => {
    const stats = {
      'Annual Leave': { used: 0, total: 20, icon: <FiCalendar />, color: 'blue' },
      'Sick Leave': { used: 0, total: 12, icon: <FiAlertCircle />, color: 'yellow' },
      'Maternity Leave': { used: 0, total: 90, icon: <FiHeart />, color: 'pink' },
      'Paternity Leave': { used: 0, total: 14, icon: <FiUser />, color: 'purple' },
      'Compassionate Leave': { used: 0, total: 5, icon: <FiHeart />, color: 'orange' },
      'Unpaid Leave': { used: 0, total: '∞', icon: <FiClock />, color: 'gray' }
    };

    leaves.forEach(leave => {
      if (leave.status === 'Approved' && stats[leave.type]) {
        stats[leave.type].used += leave.days;
      }
    });

    return stats;
  };

  const leaveStats = getLeaveStats();

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Success Toast */}
      {successMessage && (
        <div className="fixed top-4 right-4 bg-green-50 border border-green-200 rounded-xl shadow-lg p-4 max-w-md animate-slideIn z-50">
          <div className="flex items-start">
            <FiCheckCircle className="text-green-500 mr-3 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-green-800 flex-1">{successMessage}</p>
            <button onClick={() => setSuccessMessage('')} className="ml-3">
              <FiX className="text-green-600 hover:text-green-800" />
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <FiCalendar className="mr-3 text-blue-600" />
          Leave Management
        </h1>
        <p className="text-sm text-gray-600 mt-2">
          Employee ID: <span className="font-mono bg-gray-100 px-2 py-1 rounded text-blue-600">{id}</span>
        </p>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center">
            <FiAlertCircle className="text-red-500 mr-3" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        {Object.entries(leaveStats).map(([type, stats]) => (
          <div key={type} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-2">
              <div className={`w-8 h-8 bg-${stats.color}-100 rounded-lg flex items-center justify-center`}>
                <span className={`text-${stats.color}-600`}>{stats.icon}</span>
              </div>
              <span className="text-xs font-medium text-gray-500">{type.split(' ')[0]}</span>
            </div>
            <div className="mt-2">
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-bold text-gray-900">{stats.used}</span>
                <span className="text-sm text-gray-500">/ {stats.total}</span>
              </div>
              <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full bg-${stats.color}-500 rounded-full`}
                  style={{ 
                    width: `${stats.total === '∞' ? 0 : Math.min((stats.used / stats.total) * 100, 100)}%` 
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Request Leave Section */}
      <div className="mb-8 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div 
          className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between cursor-pointer hover:bg-gray-100 transition-colors"
          onClick={() => setShowRequestForm(!showRequestForm)}
        >
          <div className="flex items-center">
            <FiPlus className={`mr-2 text-blue-600 transition-transform ${showRequestForm ? 'rotate-45' : ''}`} />
            <h3 className="text-lg font-semibold text-gray-900">Request New Leave</h3>
          </div>
          <button className="p-1 rounded-full hover:bg-gray-200 transition-colors">
            {showRequestForm ? <FiChevronUp size={20} /> : <FiChevronDown size={20} />}
          </button>
        </div>

        {showRequestForm && (
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Leave Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Leave Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="leave_type"
                  value={formData.leave_type}
                  onChange={handleInputChange}
                  required
                  disabled={submitting}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                >
                  {leaveTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              {/* Date Range */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="start_date"
                    value={formData.start_date}
                    onChange={handleInputChange}
                    required
                    disabled={submitting}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 ${
                      validationErrors.start_date ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {validationErrors.start_date && (
                    <p className="mt-1 text-xs text-red-600">{validationErrors.start_date}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="end_date"
                    value={formData.end_date}
                    onChange={handleInputChange}
                    required
                    disabled={submitting}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 ${
                      validationErrors.end_date ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {validationErrors.end_date && (
                    <p className="mt-1 text-xs text-red-600">{validationErrors.end_date}</p>
                  )}
                </div>
              </div>

              {/* Days Preview */}
              {formData.start_date && formData.end_date && !validationErrors.end_date && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center">
                  <FiCalendar className="text-blue-600 mr-3" />
                  <div>
                    <p className="text-xs text-blue-600">Total Leave Days</p>
                    <p className="text-lg font-semibold text-blue-700">
                      {calculateDays(formData.start_date, formData.end_date)} days
                    </p>
                  </div>
                </div>
              )}

              {/* Reason */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reason <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="reason"
                  value={formData.reason}
                  onChange={handleInputChange}
                  rows="4"
                  required
                  placeholder="Please provide a detailed reason for your leave request..."
                  disabled={submitting}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 resize-none ${
                    validationErrors.reason ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {validationErrors.reason && (
                  <p className="mt-1 text-xs text-red-600">{validationErrors.reason}</p>
                )}
                <p className="mt-1 text-xs text-gray-500 text-right">
                  {formData.reason.length} / 500 characters
                </p>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  disabled={submitting}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:bg-gray-100 transition-colors"
                >
                  Clear
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-blue-600 border border-transparent rounded-lg text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 transition-colors inline-flex items-center"
                >
                  {submitting ? (
                    <>
                      <FiLoader className="animate-spin -ml-1 mr-2 h-4 w-4" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <FiCheckCircle className="mr-2" />
                      Submit Request
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Leave History Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <FiFileText className="mr-2 text-gray-500" />
              Leave History
            </h3>
            <span className="text-sm text-gray-600">
              {leaves.length} {leaves.length === 1 ? 'record' : 'records'} found
            </span>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-16">
            <FiLoader className="animate-spin h-10 w-10 text-blue-600 mx-auto mb-3" />
            <p className="text-sm text-gray-600">Loading leave records...</p>
          </div>
        ) : leaves.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiCalendar className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No leave records found</h3>
            <p className="text-sm text-gray-600 mb-4">
              Get started by requesting your first leave above.
            </p>
            <button
              onClick={() => setShowRequestForm(true)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FiPlus className="mr-2" />
              Request Leave
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Leave Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Start Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    End Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Days
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reason
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {leaves.map((leave) => {
                  const status = getStatusBadge(leave.status);
                  return (
                    <tr key={leave.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900">
                          <FiCalendar className="mr-2 text-gray-400" />
                          {leave.type}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {formatDate(leave.startDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {formatDate(leave.endDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {leave.days} days
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-600 max-w-xs truncate" title={leave.reason}>
                          {leave.reason || '-'}
                        </p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${status.className}`}>
                          {status.icon}
                          {leave.status || 'Pending'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeLeaveTab;