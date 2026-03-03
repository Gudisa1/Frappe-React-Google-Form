// pages/HR/EmployeeMedicalTab.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  FiHeart, 
  FiPlus, 
  FiEdit2, 
  FiTrash2, 
  FiAlertCircle, 
  FiX,
  FiLoader,
  FiCalendar,
  FiDollarSign,
  FiFileText,
  FiUser,
  FiChevronLeft,
  FiChevronRight,
  FiCheckCircle,
  FiClock,
  FiTrendingUp,
  FiPieChart
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

// YearSelector Component
const YearSelector = ({ selectedYear, onYearChange, availableYears }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 bg-white border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
      >
        <FiCalendar className="text-gray-500" />
        <span className="font-medium">{selectedYear}</span>
        <FiChevronRight className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
          {availableYears.map(year => (
            <button
              key={year}
              onClick={() => {
                onYearChange(year);
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                year === selectedYear ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700'
              }`}
            >
              {year} {year === new Date().getFullYear() && '(Current)'}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// Stats Card Component
const StatsCard = ({ icon: Icon, label, value, color, bgColor, trend }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all">
    <div className="flex items-center justify-between mb-4">
      <div className={`w-12 h-12 ${bgColor} rounded-lg flex items-center justify-center`}>
        <Icon className={`w-6 h-6 ${color}`} />
      </div>
      {trend && (
        <span className="flex items-center text-sm text-green-600">
          <FiTrendingUp className="mr-1" />
          {trend}
        </span>
      )}
    </div>
    <p className="text-sm text-gray-600 mb-1">{label}</p>
    <p className="text-2xl font-bold text-gray-900">{value}</p>
  </div>
);

const EmployeeMedicalTab = () => {
  // Get employee ID from URL params
  const { id } = useParams();
  
  // State
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedYear, setSelectedYear] = useState(2026); // Start from 2026
  const [editingClaim, setEditingClaim] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [claimToDelete, setClaimToDelete] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  
  // Generate available years (2026 to current year + 1)
  const currentYear = new Date().getFullYear();
  const startYear = 2026;
  const availableYears = Array.from(
    { length: currentYear + 1 - startYear + 1 }, 
    (_, i) => startYear + i
  );

  // Fetch claims
  useEffect(() => {
    if (id) {
      fetchClaims();
    }
  }, [id, selectedYear]);

  const fetchClaims = async () => {
    setLoading(true);
    setError('');

    try {
      const filters = [
        ["employee", "=", id],
        ["allowance_year", "=", selectedYear]
      ];
      
      const url = `/api/resource/Medical%20Claim?filters=${JSON.stringify(filters)}&fields=["name","claim_date","amount","description"]`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch claims');
      }

      setClaims(result.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load medical claims');
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics
  const totalAmount = claims.reduce((sum, claim) => sum + claim.amount, 0);
  const averageAmount = claims.length ? Math.round(totalAmount / claims.length) : 0;
  const maxAmount = claims.length ? Math.max(...claims.map(c => c.amount)) : 0;
  const minAmount = claims.length ? Math.min(...claims.map(c => c.amount)) : 0;

  // Handlers
  const handleDeleteClick = (claim) => {
    setClaimToDelete(claim);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    if (!claimToDelete) return;
    
    setShowDeleteConfirm(false);
    setLoading(true);

    try {
      const url = `/api/resource/Medical%20Claim/${claimToDelete.name}`;
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete claim');
      }

      setSuccessMessage(`Claim ${claimToDelete.name} has been deleted successfully.`);
      await fetchClaims();
      setClaimToDelete(null);
    } catch (err) {
      setError(err.message || 'Failed to delete claim');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
    setClaimToDelete(null);
  };

  const handleEdit = (claim) => {
    setEditingClaim(claim);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEditCancel = () => {
    setEditingClaim(null);
  };

  const handleEditSuccess = (updatedClaim) => {
    setSuccessMessage(`Claim ${updatedClaim.name} has been updated successfully.`);
    setEditingClaim(null);
    fetchClaims();
  };

  const handleCreateSuccess = (newClaim) => {
    setSuccessMessage(`Claim ${newClaim.name} has been created successfully.`);
    fetchClaims();
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
        title="Delete Medical Claim"
        message={`Are you sure you want to delete claim ${claimToDelete?.name}? This action cannot be undone.`}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <FiHeart className="mr-3 text-red-500" />
                Medical Claims
              </h1>
              <div className="mt-2 flex items-center text-sm text-gray-600">
                <FiUser className="mr-2" />
                Employee ID: <span className="ml-1 font-mono font-medium text-blue-600">{id}</span>
              </div>
            </div>
            
            <YearSelector 
              selectedYear={selectedYear}
              onYearChange={setSelectedYear}
              availableYears={availableYears}
            />
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
            icon={FiDollarSign}
            label="Total Amount"
            value={`${totalAmount.toLocaleString()} ETB`}
            color="text-green-600"
            bgColor="bg-green-100"
          />
          <StatsCard
            icon={FiFileText}
            label="Number of Claims"
            value={claims.length}
            color="text-blue-600"
            bgColor="bg-blue-100"
          />
          <StatsCard
            icon={FiTrendingUp}
            label="Average per Claim"
            value={`${averageAmount.toLocaleString()} ETB`}
            color="text-purple-600"
            bgColor="bg-purple-100"
          />
          <StatsCard
            icon={FiPieChart}
            label="Range (Min - Max)"
            value={`${minAmount.toLocaleString()} - ${maxAmount.toLocaleString()} ETB`}
            color="text-orange-600"
            bgColor="bg-orange-100"
          />
        </div>

        {/* Create/Edit Form */}
        {editingClaim ? (
          <div className="mb-8">
            <MedicalEdit 
              claim={editingClaim}
              onSuccess={handleEditSuccess}
              onCancel={handleEditCancel}
            />
          </div>
        ) : selectedYear === currentYear ? (
          <div className="mb-8">
            <MedicalCreate 
              employeeId={id} 
              currentYear={currentYear}
              onSuccess={handleCreateSuccess}
            />
          </div>
        ) : (
          <div className="mb-8 bg-yellow-50 border border-yellow-200 rounded-xl p-4">
            <div className="flex items-center">
              <FiClock className="text-yellow-600 mr-3" />
              <p className="text-sm text-yellow-800">
                Viewing historical data from {selectedYear}. New claims can only be created for the current year ({currentYear}).
              </p>
            </div>
          </div>
        )}

        {/* Claims Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <FiFileText className="mr-2 text-gray-500" />
                Claim History - {selectedYear}
                {selectedYear === currentYear && (
                  <span className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Current Year
                  </span>
                )}
              </h3>
              <span className="text-sm text-gray-600">
                {claims.length} {claims.length === 1 ? 'claim' : 'claims'} found
              </span>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-16">
              <FiLoader className="animate-spin h-10 w-10 text-blue-600 mx-auto mb-3" />
              <p className="text-sm text-gray-600">Loading claims...</p>
            </div>
          ) : claims.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiFileText className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">No claims found</h3>
              <p className="text-sm text-gray-600 mb-4">
                No medical claims found for {selectedYear}.
              </p>
              {selectedYear === currentYear && (
                <button
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <FiPlus className="mr-2" />
                  Create First Claim
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Claim ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {claims.map((claim) => (
                    <tr key={claim.name} className="hover:bg-gray-50 transition-colors group">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                          {claim.name}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-600">
                          <FiCalendar className="mr-2 text-gray-400" />
                          {new Date(claim.claim_date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-green-600">
                          {claim.amount.toLocaleString()} ETB
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-600 max-w-md truncate" title={claim.description}>
                          {claim.description}
                        </p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        {selectedYear === currentYear && (
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => handleEdit(claim)}
                              className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Edit claim"
                            >
                              <FiEdit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteClick(claim)}
                              className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete claim"
                            >
                              <FiTrash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                        {selectedYear !== currentYear && (
                          <span className="text-xs text-gray-400 italic">View only</span>
                        )}
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

// Medical Create Component
export const MedicalCreate = ({ employeeId, currentYear, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    claim_date: new Date().toISOString().split('T')[0],
    amount: '',
    description: '',
    allowance_year: currentYear
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
    
    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    const payload = {
      employee: employeeId,
      claim_date: formData.claim_date,
      amount: amount,
      description: formData.description,
      allowance_year: parseInt(formData.allowance_year)
    };

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/resource/Medical%20Claim', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.exception || 'Failed to create medical claim');
      }
      
      setFormData({
        claim_date: new Date().toISOString().split('T')[0],
        amount: '',
        description: '',
        allowance_year: currentYear
      });
      
      if (onSuccess) {
        onSuccess(data.data);
      }
      
    } catch (err) {
      setError(err.message || 'Failed to create medical claim');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <FiPlus className="mr-2 text-blue-600" />
        Create New Medical Claim
      </h3>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Claim Date *
            </label>
            <input
              type="date"
              name="claim_date"
              value={formData.claim_date}
              onChange={handleInputChange}
              required
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount (ETB) *
            </label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleInputChange}
              required
              min="0.01"
              step="0.01"
              placeholder="Enter amount"
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Allowance Year *
            </label>
            <input
              type="number"
              name="allowance_year"
              value={formData.allowance_year}
              onChange={handleInputChange}
              required
              min="2026"
              max="2100"
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 bg-gray-50"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
            rows="3"
            placeholder="Enter claim description"
            disabled={loading}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 resize-none"
          />
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:bg-gray-100 transition-all"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 border border-transparent rounded-lg text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 transition-all inline-flex items-center"
          >
            {loading ? (
              <>
                <FiLoader className="animate-spin -ml-1 mr-2 h-4 w-4" />
                Creating...
              </>
            ) : (
              <>
                <FiPlus className="mr-2" />
                Create Claim
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

// Medical Edit Component
export const MedicalEdit = ({ claim, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    claim_date: claim.claim_date,
    amount: claim.amount,
    description: claim.description,
    allowance_year: claim.allowance_year
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
    
    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    const payload = {
      ...formData,
      amount: amount,
      allowance_year: parseInt(formData.allowance_year)
    };

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/resource/Medical%20Claim/${claim.name}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.exception || 'Failed to update medical claim');
      }
      
      if (onSuccess) {
        onSuccess(data.data);
      }
      
    } catch (err) {
      setError(err.message || 'Failed to update medical claim');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <FiEdit2 className="mr-2 text-yellow-600" />
        Edit Medical Claim - {claim.name}
      </h3>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Claim Date *
            </label>
            <input
              type="date"
              name="claim_date"
              value={formData.claim_date}
              onChange={handleInputChange}
              required
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 disabled:bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount (ETB) *
            </label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleInputChange}
              required
              min="0.01"
              step="0.01"
              placeholder="Enter amount"
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 disabled:bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Allowance Year *
            </label>
            <input
              type="number"
              name="allowance_year"
              value={formData.allowance_year}
              onChange={handleInputChange}
              required
              min="2026"
              max="2100"
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 disabled:bg-gray-100 bg-gray-50"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
            rows="3"
            placeholder="Enter claim description"
            disabled={loading}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 disabled:bg-gray-100 resize-none"
          />
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
            className="px-4 py-2 bg-yellow-600 border border-transparent rounded-lg text-sm font-medium text-white hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:bg-yellow-300 transition-all inline-flex items-center"
          >
            {loading ? (
              <>
                <FiLoader className="animate-spin -ml-1 mr-2 h-4 w-4" />
                Updating...
              </>
            ) : (
              <>
                <FiEdit2 className="mr-2" />
                Update Claim
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmployeeMedicalTab;