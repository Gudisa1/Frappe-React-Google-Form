import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { getEmployee, updateEmployee } from '../../api/hrapi';
import './EmployeeDetail.css';

const EmployeeEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    date_of_birth: '',
    gender: '',
    phone: '',
    email: '',
    address: '',
    emergency_contact_name: '',
    emergency_contact_relationship: '',
    emergency_contact_phone: '',
    employee_id: '',
    job_title: '',
    department: '',
    location: '',
    employment_start_date: '',
    employment_end_date: '',
    status: 'Active',
    project: ''
  });

  // Status options for employee
  const statusOptions = [
    "Newly Hired",
    "Active",
    "Probation",
    "Contract Ended",
    "Resigned",
    "Retired"
  ];

  // Gender options
  const genderOptions = ["Male", "Female", "Other"];

  useEffect(() => {
    if (!id) return;
    fetchEmployeeData();
  }, [id]);

  const fetchEmployeeData = async () => {
    try {
      setLoading(true);
      const response = await getEmployee(id);
      
      // Populate form with employee data
      setFormData({
        first_name: response.first_name || '',
        last_name: response.last_name || '',
        date_of_birth: response.date_of_birth || '',
        gender: response.gender || '',
        phone: response.phone || '',
        email: response.email || '',
        address: response.address || '',
        emergency_contact_name: response.emergency_contact_name || '',
        emergency_contact_relationship: response.emergency_contact_relationship || '',
        emergency_contact_phone: response.emergency_contact_phone || '',
        employee_id: response.employee_id || '',
        job_title: response.job_title || '',
        department: response.department || '',
        location: response.location || '',
        employment_start_date: response.employment_start_date || '',
        employment_end_date: response.employment_end_date || '',
        status: response.status || 'Active',
        project: response.project || ''
      });
      
      setError(null);
    } catch (error) {
      console.error('Error fetching employee:', error);
      const errorMessage = extractErrorMessage(error);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Extract detailed error message from backend response
  const extractErrorMessage = (error) => {
    if (error.response) {
      const { data, status } = error.response;
      
      if (data) {
        if (data.exception) {
          return data.exception;
        }
        if (data.message) {
          return data.message;
        }
        if (data._server_messages) {
          try {
            const messages = JSON.parse(data._server_messages);
            if (messages && messages.length > 0) {
              return messages[0];
            }
          } catch (e) {
            return data._server_messages;
          }
        }
        if (data.error) {
          return data.error;
        }
        if (typeof data === 'string') {
          return data;
        }
      }
      
      if (status === 404) return 'Resource not found';
      if (status === 403) return 'You do not have permission to perform this action';
      if (status === 401) return 'Authentication required. Please log in again.';
      if (status === 500) return 'Server error. Please try again later.';
    }
    
    if (error.message) {
      return error.message;
    }
    
    return 'An unexpected error occurred. Please try again.';
  };

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    // Required fields validation
    if (!formData.first_name) return 'First Name is required';
    if (!formData.last_name) return 'Last Name is required';
    if (!formData.date_of_birth) return 'Date of Birth is required';
    if (!formData.phone) return 'Phone is required';
    if (!formData.email) return 'Email is required';
    if (!formData.address) return 'Address is required';
    if (!formData.emergency_contact_name) return 'Emergency Contact Name is required';
    if (!formData.emergency_contact_relationship) return 'Emergency Contact Relationship is required';
    if (!formData.emergency_contact_phone) return 'Emergency Contact Phone is required';
    if (!formData.employee_id) return 'Employee ID is required';
    if (!formData.job_title) return 'Job Title is required';
    if (!formData.department) return 'Department is required';
    if (!formData.location) return 'Location is required';
    if (!formData.employment_start_date) return 'Employment Start Date is required';
    if (!formData.status) return 'Status is required';

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return 'Please enter a valid email address';
    }

    // Phone validation (basic)
    const phoneRegex = /^[0-9+\-\s()]{10,}$/;
    if (!phoneRegex.test(formData.phone)) {
      return 'Please enter a valid phone number';
    }

    // Date validation
    if (formData.date_of_birth) {
      const dob = new Date(formData.date_of_birth);
      const today = new Date();
      const age = today.getFullYear() - dob.getFullYear();
      if (age < 18) {
        return 'Employee must be at least 18 years old';
      }
      if (age > 100) {
        return 'Please enter a valid date of birth';
      }
    }

    // Employment date validation
    if (formData.employment_start_date && formData.employment_end_date) {
      const startDate = new Date(formData.employment_start_date);
      const endDate = new Date(formData.employment_end_date);
      if (endDate < startDate) {
        return 'Employment End Date cannot be before Start Date';
      }
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      showToast(validationError, "error");
      return;
    }

    setSaving(true);
    
    // Prepare payload - only main fields, no child tables
    const payload = {
      first_name: formData.first_name,
      last_name: formData.last_name,
      full_name: `${formData.first_name} ${formData.last_name}`,
      date_of_birth: formData.date_of_birth,
      gender: formData.gender,
      phone: formData.phone,
      email: formData.email,
      address: formData.address,
      emergency_contact_name: formData.emergency_contact_name,
      emergency_contact_relationship: formData.emergency_contact_relationship,
      emergency_contact_phone: formData.emergency_contact_phone,
      employee_id: formData.employee_id,
      job_title: formData.job_title,
      department: formData.department,
      location: formData.location,
      employment_start_date: formData.employment_start_date,
      employment_end_date: formData.employment_end_date || null,
      status: formData.status,
      project: formData.project
    };

    try {
      const updated = await updateEmployee(id, payload);
      showToast('Employee updated successfully! ✅', "success");
      setTimeout(() => {
        navigate(`/hr/employee/${id}`);
      }, 1500);
    } catch (error) {
      console.error('Error updating employee:', error);
      const errorMessage = extractErrorMessage(error);
      showToast(`Failed to update employee: ${errorMessage}`, "error");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate(`/hr/employee/${id}`);
  };

  if (loading) return (
    <div className="loading-container">
      <div className="loader"></div>
      <p>Loading employee data...</p>
    </div>
  );
  
  if (error) return (
    <div className="error-container">
      <span className="error-icon">⚠️</span>
      <div className="error-details">
        <h3>Error Loading Employee</h3>
        <p>{error}</p>
        <button onClick={fetchEmployeeData} className="btn-retry">Try Again</button>
        <button onClick={() => navigate('/hr')} className="btn-cancel" style={{ marginLeft: '1rem' }}>Back to Dashboard</button>
      </div>
    </div>
  );

  return (
    <div className="employee-edit-container">
      {/* Toast Notification */}
      {toast && (
        <div className={`toast toast-${toast.type}`}>
          <div className="toast-content">
            <span className="toast-icon">
              {toast.type === 'success' ? '✅' : '❌'}
            </span>
            <span className="toast-message">{toast.message}</span>
          </div>
        </div>
      )}

      <div className="edit-wrapper">
        {/* Header */}
        <div className="edit-header">
          <div className="header-left">
            <h1>Edit Employee</h1>
            <p>Update employee information for {formData.first_name} {formData.last_name}</p>
          </div>
          <div className="employee-id-badge-large">
            ID: {formData.employee_id}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="edit-form">
          {/* Personal Information Section */}
          <div className="form-section">
            <div className="section-header">
              <span className="section-icon">👤</span>
              <h2>Personal Information</h2>
            </div>
            <div className="form-grid">
              <div className="form-group">
                <label>First Name *</label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  placeholder="Enter first name"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Last Name *</label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  placeholder="Enter last name"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Employee ID *</label>
                <input
                  type="text"
                  name="employee_id"
                  value={formData.employee_id}
                  onChange={handleChange}
                  placeholder="Enter employee ID"
                  className="form-input"
                  readOnly
                  disabled
                />
                <small className="field-hint">Employee ID cannot be changed</small>
              </div>

              <div className="form-group">
                <label>Date of Birth *</label>
                <input
                  type="date"
                  name="date_of_birth"
                  value={formData.date_of_birth}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="">Select Gender</option>
                  {genderOptions.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Phone *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email address"
                  className="form-input"
                />
              </div>

              <div className="form-group full-width">
                <label>Address *</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter address"
                  rows="3"
                  className="form-input"
                />
              </div>
            </div>
          </div>

          {/* Employment Information Section */}
          <div className="form-section">
            <div className="section-header">
              <span className="section-icon">💼</span>
              <h2>Employment Information</h2>
            </div>
            <div className="form-grid">
              <div className="form-group">
                <label>Job Title *</label>
                <input
                  type="text"
                  name="job_title"
                  value={formData.job_title}
                  onChange={handleChange}
                  placeholder="Enter job title"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Department *</label>
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  placeholder="Enter department"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Location *</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Enter location"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Project</label>
                <input
                  type="text"
                  name="project"
                  value={formData.project}
                  onChange={handleChange}
                  placeholder="Enter project name"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Employment Start Date *</label>
                <input
                  type="date"
                  name="employment_start_date"
                  value={formData.employment_start_date}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Employment End Date</label>
                <input
                  type="date"
                  name="employment_end_date"
                  value={formData.employment_end_date || ''}
                  onChange={handleChange}
                  className="form-input"
                />
                <small className="field-hint">Leave blank if currently employed</small>
              </div>

              <div className="form-group">
                <label>Status *</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="form-select"
                >
                  {statusOptions.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Emergency Contact Section */}
          <div className="form-section">
            <div className="section-header">
              <span className="section-icon">🚨</span>
              <h2>Emergency Contact</h2>
            </div>
            <div className="form-grid">
              <div className="form-group">
                <label>Contact Name *</label>
                <input
                  type="text"
                  name="emergency_contact_name"
                  value={formData.emergency_contact_name}
                  onChange={handleChange}
                  placeholder="Enter emergency contact name"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Relationship *</label>
                <input
                  type="text"
                  name="emergency_contact_relationship"
                  value={formData.emergency_contact_relationship}
                  onChange={handleChange}
                  placeholder="Enter relationship"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Emergency Phone *</label>
                <input
                  type="tel"
                  name="emergency_contact_phone"
                  value={formData.emergency_contact_phone}
                  onChange={handleChange}
                  placeholder="Enter emergency phone number"
                  className="form-input"
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <button 
              type="button" 
              onClick={handleCancel} 
              className="btn btn-secondary"
              disabled={saving}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={saving}
            >
              {saving ? (
                <>
                  <span className="spinner"></span>
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeEdit;