// pages/HR/EmployeeMedicalTab.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

// Confirmation Dialog Component
const ConfirmDialog = ({ isOpen, title, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 animate-fadeIn">
        <div className="p-6">
          <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-center text-gray-900 mb-2">{title}</h3>
          <p className="text-sm text-center text-gray-500 mb-6">{message}</p>
          <div className="flex justify-center space-x-3">
            <button
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-red-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
            >
              Confirm
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
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-4 right-4 bg-green-50 border border-green-200 rounded-lg shadow-lg p-4 max-w-md animate-slideIn z-50">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <p className="text-sm font-medium text-green-800">{message}</p>
        </div>
        <button onClick={onClose} className="ml-auto">
          <svg className="h-4 w-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

const EmployeeMedicalTab = () => {
  // Get employee ID from URL params
  const { id } = useParams();
  console.log('🔍 Employee ID from URL:', id);

  // State for claims list and selected year
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [yearInput, setYearInput] = useState(new Date().getFullYear().toString());
  const [editingClaim, setEditingClaim] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [claimToDelete, setClaimToDelete] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  
  // Get current year dynamically
  const currentYear = new Date().getFullYear();
  const lastYear = currentYear - 1;

  console.log('📅 Current year:', currentYear);
  console.log('📅 Selected year:', selectedYear);

  // Fetch claims when component mounts, id changes, or selected year changes
  useEffect(() => {
    if (id) {
      fetchClaims();
    }
  }, [id, selectedYear]);

  const fetchClaims = async () => {
    console.log('📥 Starting to fetch claims for employee:', id, 'for year:', selectedYear);
    setLoading(true);
    setError('');

    try {
      const filters = [
        ["employee", "=", id],
        ["allowance_year", "=", selectedYear]
      ];
      
      const url = `/api/resource/Medical%20Claim?filters=${JSON.stringify(filters)}&fields=["name","claim_date","amount","description"]`;
      console.log('📡 API URL:', url);

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

      const claimsData = result.data || [];
      setClaims(claimsData);

    } catch (err) {
      console.error('❌ Error fetching claims:', err);
      setError(err.message || 'Failed to load medical claims');
    } finally {
      setLoading(false);
    }
  };

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
      console.error('❌ Error deleting claim:', err);
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

  const handleYearChange = (e) => {
    const value = e.target.value;
    setYearInput(value);
    
    const year = parseInt(value);
    if (!isNaN(year) && year >= 2000 && year <= 2100) {
      setSelectedYear(year);
    }
  };

  const handleYearBlur = () => {
    let year = parseInt(yearInput);
    if (isNaN(year)) {
      year = currentYear;
    } else if (year < 2000) {
      year = 2000;
    } else if (year > 2100) {
      year = 2100;
    }
    
    setYearInput(year.toString());
    setSelectedYear(year);
  };

  const quickSelectYear = (year) => {
    setYearInput(year.toString());
    setSelectedYear(year);
  };

  const totalAmount = claims.reduce((sum, claim) => sum + claim.amount, 0);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Success Toast */}
      {successMessage && (
        <SuccessToast 
          message={successMessage} 
          onClose={() => setSuccessMessage('')} 
        />
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Delete Medical Claim"
        message={`Are you sure you want to delete claim ${claimToDelete?.name}? This action cannot be undone.`}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />

      {/* Header with Year Input */}
      <div className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-100">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Medical Claims</h1>
            <div className="flex items-center mt-2 space-x-2">
              <span className="text-sm text-gray-600">Employee ID:</span>
              <span className="font-mono bg-white px-3 py-1 rounded-md border border-gray-200 text-sm font-medium text-blue-600">
                {id}
              </span>
            </div>
          </div>

          {/* Flexible Year Input */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="flex items-center space-x-2 bg-white rounded-lg p-1 border border-gray-200">
              <label htmlFor="year-input" className="text-sm font-medium text-gray-700 pl-2">
                Year:
              </label>
              <input
                id="year-input"
                type="number"
                min="2000"
                max="2100"
                value={yearInput}
                onChange={handleYearChange}
                onBlur={handleYearBlur}
                className="w-20 px-2 py-1.5 border-0 focus:ring-2 focus:ring-blue-500 rounded-md text-center"
                placeholder="YYYY"
              />
            </div>
            
            {/* Quick year buttons */}
            <div className="flex space-x-2">
              {[lastYear, currentYear, currentYear + 1].map((year) => (
                <button
                  key={year}
                  onClick={() => quickSelectYear(year)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all transform hover:scale-105 ${
                    selectedYear === year 
                      ? 'bg-blue-600 text-white shadow-md' 
                      : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {year}
                  {year === currentYear && ' (Now)'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg animate-shake">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Claims</p>
              <p className="text-2xl font-bold text-gray-900">{claims.length}</p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Amount</p>
              <p className="text-2xl font-bold text-green-600">{totalAmount.toLocaleString()} ETB</p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Selected Year</p>
              <p className="text-2xl font-bold text-purple-600">{selectedYear}</p>
            </div>
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Average/Claim</p>
              <p className="text-2xl font-bold text-orange-600">
                {claims.length ? Math.round(totalAmount / claims.length).toLocaleString() : 0} ETB
              </p>
            </div>
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Form or Create Form */}
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
        <div className="mb-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-yellow-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <p className="text-sm text-yellow-800">
              ⚠️ You are viewing {selectedYear} data. New claims can only be created for the current year ({currentYear}).
            </p>
          </div>
        </div>
      )}

      {/* Claims Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800">
              Claim History - {selectedYear}
              {selectedYear === currentYear && (
                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Current Year
                </span>
              )}
              {selectedYear === lastYear && (
                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  Last Year
                </span>
              )}
            </h3>
            <span className="text-sm text-gray-500">
              {claims.length} {claims.length === 1 ? 'claim' : 'claims'} found
            </span>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-gray-200 border-t-blue-600"></div>
            <p className="mt-3 text-sm text-gray-500">Loading claims...</p>
          </div>
        ) : claims.length === 0 ? (
          <div className="text-center py-16">
            <div className="mx-auto w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No claims found</h3>
            <p className="text-sm text-gray-500">
              No medical claims found for employee {id} in {selectedYear}.
            </p>
            {selectedYear === currentYear && (
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create First Claim
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Claim ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {claims.map((claim, index) => (
                  <tr key={claim.name} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-mono text-gray-900 bg-gray-100 px-2 py-1 rounded">
                        {claim.name}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-sm text-gray-600">
                          {new Date(claim.claim_date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
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
                        <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleEdit(claim)}
                            className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
                            title="Edit claim"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDeleteClick(claim)}
                            className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                            title="Delete claim"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      )}
                      {selectedYear !== currentYear && (
                        <span className="text-xs text-gray-400">View only</span>
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
  );
};

// Medical Create Component
export const MedicalCreate = ({ employeeId, currentYear, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    claim_date: new Date().toISOString().split('T')[0],
    amount: '',
    description: '',
    allowance_year: currentYear || new Date().getFullYear()
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (currentYear) {
      setFormData(prev => ({
        ...prev,
        allowance_year: currentYear
      }));
    }
  }, [currentYear]);

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
        allowance_year: currentYear || new Date().getFullYear()
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
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
        <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
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
              min="2000"
              max="2100"
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 bg-gray-50"
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 resize-none"
          />
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors inline-flex items-center"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Creating...
              </>
            ) : 'Create Claim'}
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
    <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200 p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
        <svg className="w-5 h-5 text-yellow-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 disabled:bg-gray-100"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 disabled:bg-gray-100"
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
              min="2000"
              max="2100"
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 disabled:bg-gray-100 bg-gray-50"
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 disabled:bg-gray-100 resize-none"
          />
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-yellow-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:bg-yellow-300 disabled:cursor-not-allowed transition-colors inline-flex items-center"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Updating...
              </>
            ) : 'Update Claim'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmployeeMedicalTab;