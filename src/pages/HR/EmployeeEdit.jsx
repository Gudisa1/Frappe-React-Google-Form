// pages/HR/EmployeeEdit.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  FiUser,
  FiPhone,
  FiMail,
  FiMapPin,
  FiBriefcase,
  FiCalendar,
  FiHeart,
  FiSave,
  FiX,
  FiArrowLeft,
  FiAlertCircle,
  FiCheckCircle,
  FiInfo,
  FiChevronDown,
  FiChevronUp
} from 'react-icons/fi';
import './EmployeeEdit.css';
import { updateEmployee, getEmployee } from '../../api/hrapi';

const EmployeeEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [activeSections, setActiveSections] = useState({
    personal: true,
    emergency: false,
    employment: false,
    medical: false
  });

  const [formData, setFormData] = useState({
    // Personal Information
    first_name: '',
    last_name: '',
    full_name: '',
    date_of_birth: '',
    gender: '',
    phone: '',
    email: '',
    address: '',
    
    // Emergency Contact
    emergency_contact_name: '',
    emergency_contact_relationship: '',
    emergency_contact_phone: '',
    
    // Employment Information
    employee_id: '',
    job_title: '',
    department: '',
    location: '',
    employment_start_date: '',
    status: '',
    
    // Medical Allowance
    medical_max_limit: 30000,
    medical_used: 0
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [originalData, setOriginalData] = useState(null);

  // Fetch employee data
  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        setLoading(true);
        console.log("Fetching employee with ID:", id);
        
        const data = await getEmployee(id);
        console.log("API Response:", data);

        if (!data) {
          throw new Error('No data received from server');
        }

        // Map API fields to form state - using the actual field names from the API
        const mappedData = {
          // Personal
          first_name: data.first_name || '',
          last_name: data.last_name || '',
          full_name: data.full_name || '',
          date_of_birth: data.date_of_birth || '',
          gender: data.gender || '',
          phone: data.phone || '',
          email: data.email || '',
          address: data.address || '',
          
          // Emergency
          emergency_contact_name: data.emergency_contact_name || '',
          emergency_contact_relationship: data.emergency_contact_relationship || '',
          emergency_contact_phone: data.emergency_contact_phone || '',
          
          // Employment
          employee_id: data.employee_id || '',
          job_title: data.job_title || '',
          department: data.department || '',
          location: data.location || '',
          employment_start_date: data.employment_start_date || '',
          status: data.status || '',
          
          // Medical
          medical_max_limit: data.medical_max_limit || 30000,
          medical_used: data.medical_used || 0
        };

        console.log("Mapped form data:", mappedData);
        setFormData(mappedData);
        setOriginalData(mappedData);
        
      } catch (err) {
        console.error('Failed to fetch employee:', err);
        setErrorMessage(err.message || 'Failed to load employee data');
        setShowError(true);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchEmployee();
    }
  }, [id]);

  // Validation rules
  const validations = {
    first_name: { required: true, min: 2, max: 50 },
    last_name: { required: true, min: 2, max: 50 },
    date_of_birth: { required: true },
    gender: { required: true },
    phone: { required: true, pattern: /^\+?[\d\s-]{10,}$/ },
    email: { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
    address: { required: true, min: 5 },
    emergency_contact_name: { required: true },
    emergency_contact_relationship: { required: true },
    emergency_contact_phone: { required: true, pattern: /^\+?[\d\s-]{10,}$/ },
    employee_id: { required: true, pattern: /^[A-Z0-9]{3,10}$/ },
    job_title: { required: true },
    department: { required: true },
    location: { required: true },
    employment_start_date: { required: true }
  };

  // Validate field
  const validateField = (field, value) => {
    const rules = validations[field];
    if (!rules) return '';

    if (rules.required && !value) return `${field.replace(/_/g, ' ')} is required`;
    if (rules.min && value?.length < rules.min) return `Minimum ${rules.min} characters required`;
    if (rules.max && value?.length > rules.max) return `Maximum ${rules.max} characters allowed`;
    if (rules.pattern && !rules.pattern.test(value)) return `Invalid ${field.replace(/_/g, ' ')} format`;
    
    return '';
  };

  // Handle input change
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Auto-generate full_name if first_name or last_name changes
    if (field === 'first_name' || field === 'last_name') {
      const firstName = field === 'first_name' ? value : formData.first_name;
      const lastName = field === 'last_name' ? value : formData.last_name;
      if (firstName && lastName) {
        setFormData(prev => ({
          ...prev,
          full_name: `${firstName} ${lastName}`.trim()
        }));
      }
    }

    // Validate field
    const error = validateField(field, value);
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  // Handle blur
  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  // Validate entire form
  const validateForm = () => {
    const newErrors = {};
    const fieldsToValidate = [
      'first_name', 'last_name', 'date_of_birth', 'gender', 'phone', 'email', 'address',
      'emergency_contact_name', 'emergency_contact_relationship', 'emergency_contact_phone',
      'employee_id', 'job_title', 'department', 'location', 'employment_start_date'
    ];

    fieldsToValidate.forEach(field => {
      const error = validateField(field, formData[field]);
      if (error) newErrors[field] = error;
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setErrorMessage('Please fix the errors before submitting');
      setShowError(true);
      return;
    }

    setSaving(true);
    setShowError(false);

    // Prepare payload - only send the fields that can be updated
    const payload = {
      first_name: formData.first_name,
      last_name: formData.last_name,
      full_name: formData.full_name || `${formData.first_name} ${formData.last_name}`.trim(),
      date_of_birth: formData.date_of_birth,
      gender: formData.gender,
      phone: formData.phone,
      email: formData.email,
      address: formData.address,
      emergency_contact_name: formData.emergency_contact_name,
      emergency_contact_relationship: formData.emergency_contact_relationship,
      emergency_contact_phone: formData.emergency_contact_phone,
      job_title: formData.job_title,
      department: formData.department,
      location: formData.location,
      employment_start_date: formData.employment_start_date,
      status: formData.status,
      medical_max_limit: formData.medical_max_limit,
      medical_used: formData.medical_used
    };

    console.log("STEP 1: Form validated successfully");
    console.log("STEP 2: Update payload:", payload);
    console.log("STEP 3: Calling updateEmployee API...");

    try {
      const response = await updateEmployee(id, payload);
      console.log("STEP 4: Server responded:", response);
      console.log("STEP 5: Employee updated successfully");

      setShowSuccess(true);
      
      // Navigate back after 2 seconds
      setTimeout(() => {
        navigate(`/hr/employees/${id}`);
      }, 2000);

    } catch (error) {
      console.error("STEP ERROR:", error);
      setErrorMessage(error.message || 'Failed to update employee');
      setShowError(true);
    } finally {
      setSaving(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    if (JSON.stringify(formData) !== JSON.stringify(originalData)) {
      if (window.confirm('You have unsaved changes. Are you sure you want to leave?')) {
        navigate(`/hr/employees/${id}`);
      }
    } else {
      navigate(`/hr/employees/${id}`);
    }
  };

  // Toggle section
  const toggleSection = (section) => {
    setActiveSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Get field error
  const getFieldError = (field) => {
    return touched[field] ? errors[field] : '';
  };

  // Status options
  const statusOptions = [
    { value: 'Active', label: 'Active' },
    { value: 'Newly Hired', label: 'Newly Hired' },
    { value: 'Probation', label: 'Probation' },
    { value: 'Notice Period', label: 'Notice Period' },
    { value: 'Contract Ended', label: 'Contract Ended' },
    { value: 'Resigned', label: 'Resigned' },
    { value: 'Retired', label: 'Retired' }
  ];

  // Gender options
  const genderOptions = ['Male', 'Female', 'Other'];

  if (loading) {
    return (
      <div className="edit-loading">
        <div className="loading-spinner"></div>
        <p>Loading employee data...</p>
      </div>
    );
  }

  return (
    <div className="employee-edit">
      {/* Header */}
      <div className="edit-header">
        <div className="header-left">
          <button className="back-button" onClick={handleCancel}>
            <FiArrowLeft size={20} />
          </button>
          <div className="header-info">
            <h1 className="edit-title">Edit Employee</h1>
            <div className="header-breadcrumb">
              <Link to="/hr/employees">Employees</Link>
              <span>/</span>
              <span className="current">{formData.first_name} {formData.last_name}</span>
            </div>
          </div>
        </div>
        <div className="header-right">
          <button className="btn-outline" onClick={handleCancel} disabled={saving}>
            <FiX size={18} />
            <span>Cancel</span>
          </button>
          <button 
            className="btn-primary" 
            onClick={handleSubmit}
            disabled={saving}
          >
            {saving ? (
              <>
                <div className="spinner"></div>
                <span>Saving...</span>
              </>
            ) : (
              <>
                <FiSave size={18} />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Success/Error Messages */}
      {showSuccess && (
        <div className="status-message success">
          <FiCheckCircle size={20} />
          <div className="message-content">
            <h4>Changes Saved Successfully</h4>
            <p>Employee information has been updated. Redirecting...</p>
          </div>
        </div>
      )}

      {showError && (
        <div className="status-message error">
          <FiAlertCircle size={20} />
          <div className="message-content">
            <h4>Error Saving Changes</h4>
            <p>{errorMessage}</p>
          </div>
          <button className="close-btn" onClick={() => setShowError(false)}>
            <FiX size={18} />
          </button>
        </div>
      )}

      {/* Edit Form */}
      <form onSubmit={handleSubmit} className="edit-form">
        {/* Section 1: Personal Information */}
        <div className={`form-section ${activeSections.personal ? 'active' : ''}`}>
          <div className="section-header" onClick={() => toggleSection('personal')}>
            <div className="section-title">
              <div className="section-icon">
                <FiUser />
              </div>
              <div>
                <h2>Personal Information</h2>
                <p className="section-subtitle">Basic details about the employee</p>
              </div>
            </div>
            <button type="button" className="section-toggle">
              {activeSections.personal ? <FiChevronUp /> : <FiChevronDown />}
            </button>
          </div>
          
          {activeSections.personal && (
            <div className="section-content">
              <div className="form-fields">
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">
                      First Name <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-input ${getFieldError('first_name') ? 'error' : ''}`}
                      value={formData.first_name}
                      onChange={(e) => handleInputChange('first_name', e.target.value)}
                      onBlur={() => handleBlur('first_name')}
                      placeholder="Enter first name"
                    />
                    {getFieldError('first_name') && (
                      <span className="error-message">{getFieldError('first_name')}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      Last Name <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-input ${getFieldError('last_name') ? 'error' : ''}`}
                      value={formData.last_name}
                      onChange={(e) => handleInputChange('last_name', e.target.value)}
                      onBlur={() => handleBlur('last_name')}
                      placeholder="Enter last name"
                    />
                    {getFieldError('last_name') && (
                      <span className="error-message">{getFieldError('last_name')}</span>
                    )}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">
                      Date of Birth <span className="required">*</span>
                    </label>
                    <input
                      type="date"
                      className={`form-input ${getFieldError('date_of_birth') ? 'error' : ''}`}
                      value={formData.date_of_birth}
                      onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
                      onBlur={() => handleBlur('date_of_birth')}
                    />
                    {getFieldError('date_of_birth') && (
                      <span className="error-message">{getFieldError('date_of_birth')}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      Gender <span className="required">*</span>
                    </label>
                    <select
                      className={`form-select ${getFieldError('gender') ? 'error' : ''}`}
                      value={formData.gender}
                      onChange={(e) => handleInputChange('gender', e.target.value)}
                      onBlur={() => handleBlur('gender')}
                    >
                      <option value="">Select gender</option>
                      {genderOptions.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                    {getFieldError('gender') && (
                      <span className="error-message">{getFieldError('gender')}</span>
                    )}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">
                      Phone <span className="required">*</span>
                    </label>
                    <input
                      type="tel"
                      className={`form-input ${getFieldError('phone') ? 'error' : ''}`}
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      onBlur={() => handleBlur('phone')}
                      placeholder="+251 911 123 456"
                    />
                    {getFieldError('phone') && (
                      <span className="error-message">{getFieldError('phone')}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      Email <span className="required">*</span>
                    </label>
                    <input
                      type="email"
                      className={`form-input ${getFieldError('email') ? 'error' : ''}`}
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      onBlur={() => handleBlur('email')}
                      placeholder="john.doe@company.com"
                    />
                    {getFieldError('email') && (
                      <span className="error-message">{getFieldError('email')}</span>
                    )}
                  </div>
                </div>

                <div className="form-group full-width">
                  <label className="form-label">
                    Address <span className="required">*</span>
                  </label>
                  <textarea
                    className={`form-textarea ${getFieldError('address') ? 'error' : ''}`}
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    onBlur={() => handleBlur('address')}
                    placeholder="Enter full address"
                    rows="3"
                  />
                  {getFieldError('address') && (
                    <span className="error-message">{getFieldError('address')}</span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Section 2: Emergency Contact */}
        <div className={`form-section ${activeSections.emergency ? 'active' : ''}`}>
          <div className="section-header" onClick={() => toggleSection('emergency')}>
            <div className="section-title">
              <div className="section-icon">
                <FiPhone />
              </div>
              <div>
                <h2>Emergency Contact</h2>
                <p className="section-subtitle">Who to contact in case of emergency</p>
              </div>
            </div>
            <button type="button" className="section-toggle">
              {activeSections.emergency ? <FiChevronUp /> : <FiChevronDown />}
            </button>
          </div>
          
          {activeSections.emergency && (
            <div className="section-content">
              <div className="form-fields">
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">
                      Contact Name <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-input ${getFieldError('emergency_contact_name') ? 'error' : ''}`}
                      value={formData.emergency_contact_name}
                      onChange={(e) => handleInputChange('emergency_contact_name', e.target.value)}
                      onBlur={() => handleBlur('emergency_contact_name')}
                      placeholder="Full name of emergency contact"
                    />
                    {getFieldError('emergency_contact_name') && (
                      <span className="error-message">{getFieldError('emergency_contact_name')}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      Relationship <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-input ${getFieldError('emergency_contact_relationship') ? 'error' : ''}`}
                      value={formData.emergency_contact_relationship}
                      onChange={(e) => handleInputChange('emergency_contact_relationship', e.target.value)}
                      onBlur={() => handleBlur('emergency_contact_relationship')}
                      placeholder="e.g., Spouse, Parent, Sibling"
                    />
                    {getFieldError('emergency_contact_relationship') && (
                      <span className="error-message">{getFieldError('emergency_contact_relationship')}</span>
                    )}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">
                      Phone Number <span className="required">*</span>
                    </label>
                    <input
                      type="tel"
                      className={`form-input ${getFieldError('emergency_contact_phone') ? 'error' : ''}`}
                      value={formData.emergency_contact_phone}
                      onChange={(e) => handleInputChange('emergency_contact_phone', e.target.value)}
                      onBlur={() => handleBlur('emergency_contact_phone')}
                      placeholder="Primary contact number"
                    />
                    {getFieldError('emergency_contact_phone') && (
                      <span className="error-message">{getFieldError('emergency_contact_phone')}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Section 3: Employment Information */}
        <div className={`form-section ${activeSections.employment ? 'active' : ''}`}>
          <div className="section-header" onClick={() => toggleSection('employment')}>
            <div className="section-title">
              <div className="section-icon">
                <FiBriefcase />
              </div>
              <div>
                <h2>Employment Information</h2>
                <p className="section-subtitle">Job details and employment status</p>
              </div>
            </div>
            <button type="button" className="section-toggle">
              {activeSections.employment ? <FiChevronUp /> : <FiChevronDown />}
            </button>
          </div>
          
          {activeSections.employment && (
            <div className="section-content">
              <div className="form-fields">
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">
                      Employee ID <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-input ${getFieldError('employee_id') ? 'error' : ''}`}
                      value={formData.employee_id}
                      onChange={(e) => handleInputChange('employee_id', e.target.value.toUpperCase())}
                      onBlur={() => handleBlur('employee_id')}
                      placeholder="e.g., EMP001"
                      disabled // Usually employee ID shouldn't be edited
                    />
                    {getFieldError('employee_id') && (
                      <span className="error-message">{getFieldError('employee_id')}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      Job Title <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-input ${getFieldError('job_title') ? 'error' : ''}`}
                      value={formData.job_title}
                      onChange={(e) => handleInputChange('job_title', e.target.value)}
                      onBlur={() => handleBlur('job_title')}
                      placeholder="e.g., Software Engineer"
                    />
                    {getFieldError('job_title') && (
                      <span className="error-message">{getFieldError('job_title')}</span>
                    )}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">
                      Department <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-input ${getFieldError('department') ? 'error' : ''}`}
                      value={formData.department}
                      onChange={(e) => handleInputChange('department', e.target.value)}
                      onBlur={() => handleBlur('department')}
                      placeholder="e.g., Engineering"
                    />
                    {getFieldError('department') && (
                      <span className="error-message">{getFieldError('department')}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      Location <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-input ${getFieldError('location') ? 'error' : ''}`}
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      onBlur={() => handleBlur('location')}
                      placeholder="e.g., Addis Ababa"
                    />
                    {getFieldError('location') && (
                      <span className="error-message">{getFieldError('location')}</span>
                    )}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">
                      Start Date <span className="required">*</span>
                    </label>
                    <input
                      type="date"
                      className={`form-input ${getFieldError('employment_start_date') ? 'error' : ''}`}
                      value={formData.employment_start_date}
                      onChange={(e) => handleInputChange('employment_start_date', e.target.value)}
                      onBlur={() => handleBlur('employment_start_date')}
                    />
                    {getFieldError('employment_start_date') && (
                      <span className="error-message">{getFieldError('employment_start_date')}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Status</label>
                    <select
                      className="form-select"
                      value={formData.status}
                      onChange={(e) => handleInputChange('status', e.target.value)}
                    >
                      {statusOptions.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Section 4: Medical Allowance */}
        <div className={`form-section ${activeSections.medical ? 'active' : ''}`}>
          <div className="section-header" onClick={() => toggleSection('medical')}>
            <div className="section-title">
              <div className="section-icon">
                <FiHeart />
              </div>
              <div>
                <h2>Medical Allowance</h2>
                <p className="section-subtitle">Annual medical benefits and usage</p>
              </div>
            </div>
            <button type="button" className="section-toggle">
              {activeSections.medical ? <FiChevronUp /> : <FiChevronDown />}
            </button>
          </div>
          
          {activeSections.medical && (
            <div className="section-content">
              <div className="form-fields">
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Max Limit (ETB)</label>
                    <input
                      type="number"
                      className="form-input"
                      value={formData.medical_max_limit}
                      onChange={(e) => handleInputChange('medical_max_limit', parseInt(e.target.value) || 0)}
                      min="0"
                      step="1000"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Used Amount (ETB)</label>
                    <input
                      type="number"
                      className="form-input"
                      value={formData.medical_used}
                      onChange={(e) => handleInputChange('medical_used', parseInt(e.target.value) || 0)}
                      min="0"
                      step="100"
                    />
                  </div>
                </div>

                {formData.medical_used > 0 && (
                  <div className="allowance-visualization">
                    <div className="allowance-header">
                      <span className="allowance-label">Current Usage</span>
                      <span className="allowance-percentage">
                        {((formData.medical_used / formData.medical_max_limit) * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="progress-track">
                      <div 
                        className={`progress-fill ${
                          (formData.medical_used / formData.medical_max_limit) > 0.9 
                            ? 'danger' 
                            : (formData.medical_used / formData.medical_max_limit) > 0.7 
                            ? 'warning' 
                            : 'success'
                        }`}
                        style={{ 
                          width: `${Math.min((formData.medical_used / formData.medical_max_limit) * 100, 100)}%` 
                        }}
                      />
                    </div>
                    <div className="allowance-stats">
                      <div className="stat">
                        <span className="stat-label">Used</span>
                        <span className="stat-value">{formData.medical_used.toLocaleString()} ETB</span>
                      </div>
                      <div className="stat">
                        <span className="stat-label">Remaining</span>
                        <span className="stat-value">{(formData.medical_max_limit - formData.medical_used).toLocaleString()} ETB</span>
                      </div>
                      <div className="stat">
                        <span className="stat-label">Total</span>
                        <span className="stat-value">{formData.medical_max_limit.toLocaleString()} ETB</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default EmployeeEdit;