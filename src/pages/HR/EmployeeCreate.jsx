// pages/HR/EmployeeCreate.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiUser,
  FiPhone,
  FiMail,
  FiMapPin,
  FiBriefcase,
  FiCalendar,
  FiBookOpen,
  FiAward,
  FiHeart,
  FiPlus,
  FiTrash2,
  FiChevronDown,
  FiChevronUp,
  FiSave,
  FiX,
  FiAlertCircle,
  FiCheckCircle,
  FiInfo,
  FiUpload,
  FiHelpCircle
} from 'react-icons/fi';
import './EmployeeCreate.css';
import {createEmployee} from "../../api/hrapi"

const EmployeeCreate = () => {
  const navigate = useNavigate();
  const [activeSections, setActiveSections] = useState({
    personal: true,
    emergency: false,
    employment: false,
    education: false,
    certificates: false,
    medical: false
  });
  
  const [formStatus, setFormStatus] = useState({
    isSubmitting: false,
    isDirty: false,
    isValid: true,
    showSuccess: false,
    showError: false,
    errorMessage: ''
  });

  const [formData, setFormData] = useState({
    personal: {
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      gender: '',
      phone: '',
      email: '',
      address: '',
      profilePhoto: null
    },
    emergency: {
      name: '',
      relationship: '',
      phone: '',
      alternativePhone: ''
    },
    employment: {
      employeeId: '',
      jobTitle: '',
      department: '',
      location: '',
      startDate: '',
      status: 'newly-hired',
      reportTo: '',
      employmentType: 'full-time'
    },
    education: [
      {
        id: Date.now(),
        institution: '',
        degree: '',
        field: '',
        startYear: '',
        endYear: '',
        grade: ''
      }
    ],
    certificates: [
      {
        id: Date.now() + 1,
        name: '',
        issuedBy: '',
        issueDate: '',
        expiryDate: '',
        credentialId: '',
        certificateFile: null
      }
    ],
    medical: {
      year: new Date().getFullYear().toString(),
      maxLimit: 30000,
      usedAmount: 0,
      claims: []
    }
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Validation rules
  const validations = {
    personal: {
      firstName: { required: true, min: 2, max: 50 },
      lastName: { required: true, min: 2, max: 50 },
      dateOfBirth: { required: true, pattern: /^\d{4}-\d{2}-\d{2}$/ },
      gender: { required: true },
      phone: { required: true, pattern: /^\+?[\d\s-]{10,}$/ },
      email: { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
      address: { required: true, min: 5 }
    },
    emergency: {
      name: { required: true },
      relationship: { required: true },
      phone: { required: true, pattern: /^\+?[\d\s-]{10,}$/ }
    },
    employment: {
      employeeId: { required: true, pattern: /^[A-Z0-9]{3,10}$/ },
      jobTitle: { required: true },
      department: { required: true },
      location: { required: true },
      startDate: { required: true }
    }
  };

  // Validate field
  const validateField = (section, field, value) => {
    const rules = validations[section]?.[field];
    if (!rules) return '';

    if (rules.required && !value) return `${field} is required`;
    if (rules.min && value.length < rules.min) return `Minimum ${rules.min} characters required`;
    if (rules.max && value.length > rules.max) return `Maximum ${rules.max} characters allowed`;
    if (rules.pattern && !rules.pattern.test(value)) return `Invalid ${field} format`;
    
    return '';
  };

  // Handle input change
  const handleInputChange = (section, field, value, index = null) => {
    setFormStatus(prev => ({ ...prev, isDirty: true }));

    if (section === 'education' && index !== null) {
      const updatedEducation = [...formData.education];
      updatedEducation[index] = { ...updatedEducation[index], [field]: value };
      setFormData({ ...formData, education: updatedEducation });
    } else if (section === 'certificates' && index !== null) {
      const updatedCertificates = [...formData.certificates];
      updatedCertificates[index] = { ...updatedCertificates[index], [field]: value };
      setFormData({ ...formData, certificates: updatedCertificates });
    } else if (section === 'personal' || section === 'emergency' || section === 'employment' || section === 'medical') {
      setFormData({
        ...formData,
        [section]: { ...formData[section], [field]: value }
      });
    }

    // Validate field
    const error = validateField(section, field, value);
    setErrors(prev => ({ ...prev, [`${section}.${field}`]: error }));
  };

  // Handle blur
  const handleBlur = (section, field) => {
    setTouched(prev => ({ ...prev, [`${section}.${field}`]: true }));
  };

  // Add education entry
  const addEducation = () => {
    setFormData({
      ...formData,
      education: [
        ...formData.education,
        {
          id: Date.now(),
          institution: '',
          degree: '',
          field: '',
          startYear: '',
          endYear: '',
          grade: ''
        }
      ]
    });
  };

  // Remove education entry
  const removeEducation = (index) => {
    if (formData.education.length > 1) {
      setFormData({
        ...formData,
        education: formData.education.filter((_, i) => i !== index)
      });
    }
  };

  // Add certificate entry
  const addCertificate = () => {
    setFormData({
      ...formData,
      certificates: [
        ...formData.certificates,
        {
          id: Date.now(),
          name: '',
          issuedBy: '',
          issueDate: '',
          expiryDate: '',
          credentialId: '',
          certificateFile: null
        }
      ]
    });
  };

  // Remove certificate entry
  const removeCertificate = (index) => {
    if (formData.certificates.length > 1) {
      setFormData({
        ...formData,
        certificates: formData.certificates.filter((_, i) => i !== index)
      });
    }
  };

  // Handle file upload
  const handleFileUpload = (section, index, file) => {
    if (section === 'certificates') {
      const updatedCertificates = [...formData.certificates];
      updatedCertificates[index] = { ...updatedCertificates[index], certificateFile: file };
      setFormData({ ...formData, certificates: updatedCertificates });
    }
  };

  // Validate entire form
  const validateForm = () => {
    const newErrors = {};
    
    // Validate personal info
    Object.keys(validations.personal).forEach(field => {
      const error = validateField('personal', field, formData.personal[field]);
      if (error) newErrors[`personal.${field}`] = error;
    });

    // Validate emergency contact
    Object.keys(validations.emergency).forEach(field => {
      const error = validateField('emergency', field, formData.emergency[field]);
      if (error) newErrors[`emergency.${field}`] = error;
    });

    // Validate employment info
    Object.keys(validations.employment).forEach(field => {
      const error = validateField('employment', field, formData.employment[field]);
      if (error) newErrors[`employment.${field}`] = error;
    });

    setErrors(newErrors);
      return { isValid: Object.keys(newErrors).length === 0, newErrors };
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
      const { isValid, newErrors } = validateForm();
    
    if (!isValid) {
      setFormStatus(prev => ({ 
        ...prev, 
        showError: true, 
        errorMessage: 'Please fix the errors before submitting' 
      }));
      
      // Expand sections with errors
      const sectionsWithErrors = new Set();
      Object.keys(newErrors).forEach(key => {
        const [section] = key.split('.');
        sectionsWithErrors.add(section);
      });
      
      const newActiveSections = {};
      Object.keys(activeSections).forEach(key => {
        newActiveSections[key] = sectionsWithErrors.has(key);
      });
      setActiveSections(newActiveSections);
      console.log("Validation errors:", newErrors);
      return;
    }

    setFormStatus(prev => ({ ...prev, isSubmitting: true }));
 const employeeData = {
  employee_id: formData.employment.employeeId,
  first_name: formData.personal.firstName,
  last_name: formData.personal.lastName,
  full_name: `${formData.personal.firstName} ${formData.personal.lastName}`,

  date_of_birth: formData.personal.dateOfBirth,
  gender: formData.personal.gender,
  phone: formData.personal.phone,
  email: formData.personal.email,
  address: formData.personal.address,

  emergency_contact_name: formData.emergency.name,
  emergency_contact_relationship: formData.emergency.relationship,
  emergency_contact_phone: formData.emergency.phone,

  job_title: formData.employment.jobTitle,
  department: formData.employment.department,
  location: formData.employment.location,

  employment_start_date: formData.employment.startDate,
  employment_status: formData.employment.status,

  medical_max_limit: formData.medical.maxLimit,
  medical_used: formData.medical.usedAmount
};
try {
  console.log("STEP 1: Form validated successfully");
  console.log("STEP 2: Preparing employee payload");
  console.log("Payload:", employeeData);

  console.log("STEP 3: Calling createEmployee API...");

  const response = await createEmployee(employeeData);
console.log("STEP 4: Server responded:", response);

  console.log("STEP 5: Employee created successfully");

  setFormStatus(prev => ({
    ...prev,
    showSuccess: true,
    isSubmitting: false
  }));

  console.log("STEP 6: Redirecting to employee list...");

  setTimeout(() => {
    navigate('/hr/employees');
  }, 2000);

} catch (error) {
  console.error("STEP ERROR:", error);

  setFormStatus(prev => ({
    ...prev,
    showError: true,
    errorMessage: error.message || 'Failed to create employee',
    isSubmitting: false
  }));
}
  };

  // Handle cancel
  const handleCancel = () => {
    if (formStatus.isDirty) {
      if (window.confirm('You have unsaved changes. Are you sure you want to leave?')) {
        navigate('/hr/employees');
      }
    } else {
      navigate('/hr/employees');
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
  const getFieldError = (section, field) => {
    return touched[`${section}.${field}`] ? errors[`${section}.${field}`] : '';
  };

  // Status options
  const statusOptions = [
    { value: 'newly-hired', label: 'Newly Hired', color: '#3b82f6' },
    { value: 'active', label: 'Active', color: '#10b981' },
    { value: 'probation', label: 'Probation', color: '#f59e0b' },
    { value: 'contract-ended', label: 'Contract Ended', color: '#6b7280' },
    { value: 'resigned', label: 'Resigned', color: '#8b5cf6' },
    { value: 'retired', label: 'Retired', color: '#6b7280' }
  ];

  // Employment types
  const employmentTypes = [
    { value: 'full-time', label: 'Full Time' },
    { value: 'part-time', label: 'Part Time' },
    { value: 'contract', label: 'Contract' },
    { value: 'intern', label: 'Intern' },
    { value: 'consultant', label: 'Consultant' }
  ];

  // Gender options
  const genderOptions = ['Male', 'Female', 'Other'];

  return (
    <div className="employee-create">
      {/* Header */}
      <div className="create-header">
        <div className="header-left">
          <h1 className="create-title">Create New Employee</h1>
          <div className="header-breadcrumb">
            <span>HR</span>
            <span>/</span>
            <span>Employees</span>
            <span>/</span>
            <span className="current">New Employee</span>
          </div>
        </div>
        <div className="header-right">
          <button 
            className="btn btn-outline" 
            onClick={handleCancel}
            disabled={formStatus.isSubmitting}
          >
            <FiX size={18} />
            <span>Cancel</span>
          </button>
          <button 
            className="btn btn-primary" 
            onClick={handleSubmit}
            disabled={formStatus.isSubmitting}
          >
            {formStatus.isSubmitting ? (
              <>
                <div className="spinner"></div>
                <span>Creating...</span>
              </>
            ) : (
              <>
                <FiSave size={18} />
                <span>Create Employee</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Status Messages */}
      {formStatus.showSuccess && (
        <div className="status-message success">
          <FiCheckCircle size={20} />
          <div className="message-content">
            <h4>Employee Created Successfully</h4>
            <p>The employee has been added to the system. Redirecting...</p>
          </div>
          <button className="close-btn" onClick={() => setFormStatus(prev => ({ ...prev, showSuccess: false }))}>
            <FiX size={18} />
          </button>
        </div>
      )}

      {formStatus.showError && (
        <div className="status-message error">
          <FiAlertCircle size={20} />
          <div className="message-content">
            <h4>Error Creating Employee</h4>
            <p>{formStatus.errorMessage}</p>
          </div>
          <button className="close-btn" onClick={() => setFormStatus(prev => ({ ...prev, showError: false }))}>
            <FiX size={18} />
          </button>
        </div>
      )}

      {/* Progress Bar */}
      <div className="form-progress">
        <div className="progress-steps">
          <div className={`step ${formData.personal.firstName ? 'completed' : ''} ${activeSections.personal ? 'active' : ''}`}>
            <span className="step-number">1</span>
            <span className="step-label">Personal</span>
          </div>
          <div className={`step ${formData.emergency.name ? 'completed' : ''} ${activeSections.emergency ? 'active' : ''}`}>
            <span className="step-number">2</span>
            <span className="step-label">Emergency</span>
          </div>
          <div className={`step ${formData.employment.jobTitle ? 'completed' : ''} ${activeSections.employment ? 'active' : ''}`}>
            <span className="step-number">3</span>
            <span className="step-label">Employment</span>
          </div>
          <div className={`step ${formData.education[0]?.institution ? 'completed' : ''} ${activeSections.education ? 'active' : ''}`}>
            <span className="step-number">4</span>
            <span className="step-label">Education</span>
          </div>
          <div className={`step ${formData.certificates[0]?.name ? 'completed' : ''} ${activeSections.certificates ? 'active' : ''}`}>
            <span className="step-number">5</span>
            <span className="step-label">Certificates</span>
          </div>
          <div className={`step ${formData.medical.year ? 'completed' : ''} ${activeSections.medical ? 'active' : ''}`}>
            <span className="step-number">6</span>
            <span className="step-label">Medical</span>
          </div>
        </div>
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ 
              width: `${
                (Object.values(formData).reduce((acc, curr) => {
                  if (typeof curr === 'object' && !Array.isArray(curr)) {
                    return acc + Object.values(curr).filter(Boolean).length;
                  }
                  if (Array.isArray(curr)) {
                    return acc + (curr[0]?.institution || curr[0]?.name ? 1 : 0);
                  }
                  return acc;
                }, 0) / 30) * 100
              }%` 
            }}
          />
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="create-form">
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
            <div className="section-actions">
              {errors['personal.firstName'] && <FiAlertCircle className="error-icon" />}
              <button type="button" className="section-toggle">
                {activeSections.personal ? <FiChevronUp /> : <FiChevronDown />}
              </button>
            </div>
          </div>
          
          {activeSections.personal && (
            <div className="section-content">
              <div className="form-layout">
                {/* Profile Photo Upload */}
                <div className="photo-upload">
                  <div className="photo-preview">
                    {formData.personal.profilePhoto ? (
                      <img src={URL.createObjectURL(formData.personal.profilePhoto)} alt="Profile" />
                    ) : (
                      <FiUser size={40} />
                    )}
                  </div>
                  <button type="button" className="upload-btn">
                    <FiUpload size={16} />
                    <span>Upload Photo</span>
                  </button>
                  <p className="upload-hint">JPG, PNG or GIF (Max 2MB)</p>
                </div>

                <div className="form-fields">
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">
                        First Name <span className="required">*</span>
                        <div className="tooltip">
                          <FiInfo size={14} />
                          <span className="tooltip-text">Enter employee's legal first name</span>
                        </div>
                      </label>
                      <input
                        type="text"
                        className={`form-input ${getFieldError('personal', 'firstName') ? 'error' : ''}`}
                        value={formData.personal.firstName}
                        onChange={(e) => handleInputChange('personal', 'firstName', e.target.value)}
                        onBlur={() => handleBlur('personal', 'firstName')}
                        placeholder="e.g., John"
                      />
                      {getFieldError('personal', 'firstName') && (
                        <span className="error-message">{getFieldError('personal', 'firstName')}</span>
                      )}
                    </div>

                    <div className="form-group">
                      <label className="form-label">
                        Last Name <span className="required">*</span>
                      </label>
                      <input
                        type="text"
                        className={`form-input ${getFieldError('personal', 'lastName') ? 'error' : ''}`}
                        value={formData.personal.lastName}
                        onChange={(e) => handleInputChange('personal', 'lastName', e.target.value)}
                        onBlur={() => handleBlur('personal', 'lastName')}
                        placeholder="e.g., Doe"
                      />
                      {getFieldError('personal', 'lastName') && (
                        <span className="error-message">{getFieldError('personal', 'lastName')}</span>
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
                        className={`form-input ${getFieldError('personal', 'dateOfBirth') ? 'error' : ''}`}
                        value={formData.personal.dateOfBirth}
                        onChange={(e) => handleInputChange('personal', 'dateOfBirth', e.target.value)}
                        onBlur={() => handleBlur('personal', 'dateOfBirth')}
                      />
                      {getFieldError('personal', 'dateOfBirth') && (
                        <span className="error-message">{getFieldError('personal', 'dateOfBirth')}</span>
                      )}
                    </div>

                    <div className="form-group">
                      <label className="form-label">
                        Gender <span className="required">*</span>
                      </label>
                      <select
                        className={`form-select ${getFieldError('personal', 'gender') ? 'error' : ''}`}
                        value={formData.personal.gender}
                        onChange={(e) => handleInputChange('personal', 'gender', e.target.value)}
                        onBlur={() => handleBlur('personal', 'gender')}
                      >
                        <option value="">Select gender</option>
                        {genderOptions.map(option => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                      {getFieldError('personal', 'gender') && (
                        <span className="error-message">{getFieldError('personal', 'gender')}</span>
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
                        className={`form-input ${getFieldError('personal', 'phone') ? 'error' : ''}`}
                        value={formData.personal.phone}
                        onChange={(e) => handleInputChange('personal', 'phone', e.target.value)}
                        onBlur={() => handleBlur('personal', 'phone')}
                        placeholder="+251 911 123 456"
                      />
                      {getFieldError('personal', 'phone') && (
                        <span className="error-message">{getFieldError('personal', 'phone')}</span>
                      )}
                    </div>

                    <div className="form-group">
                      <label className="form-label">
                        Email <span className="required">*</span>
                      </label>
                      <input
                        type="email"
                        className={`form-input ${getFieldError('personal', 'email') ? 'error' : ''}`}
                        value={formData.personal.email}
                        onChange={(e) => handleInputChange('personal', 'email', e.target.value)}
                        onBlur={() => handleBlur('personal', 'email')}
                        placeholder="john.doe@company.com"
                      />
                      {getFieldError('personal', 'email') && (
                        <span className="error-message">{getFieldError('personal', 'email')}</span>
                      )}
                    </div>
                  </div>

                  <div className="form-group full-width">
                    <label className="form-label">
                      Address <span className="required">*</span>
                    </label>
                    <textarea
                      className={`form-textarea ${getFieldError('personal', 'address') ? 'error' : ''}`}
                      value={formData.personal.address}
                      onChange={(e) => handleInputChange('personal', 'address', e.target.value)}
                      onBlur={() => handleBlur('personal', 'address')}
                      placeholder="Enter full address"
                      rows="3"
                    />
                    {getFieldError('personal', 'address') && (
                      <span className="error-message">{getFieldError('personal', 'address')}</span>
                    )}
                  </div>
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
            <div className="section-actions">
              {errors['emergency.name'] && <FiAlertCircle className="error-icon" />}
              <button type="button" className="section-toggle">
                {activeSections.emergency ? <FiChevronUp /> : <FiChevronDown />}
              </button>
            </div>
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
                      className={`form-input ${getFieldError('emergency', 'name') ? 'error' : ''}`}
                      value={formData.emergency.name}
                      onChange={(e) => handleInputChange('emergency', 'name', e.target.value)}
                      onBlur={() => handleBlur('emergency', 'name')}
                      placeholder="Full name of emergency contact"
                    />
                    {getFieldError('emergency', 'name') && (
                      <span className="error-message">{getFieldError('emergency', 'name')}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      Relationship <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-input ${getFieldError('emergency', 'relationship') ? 'error' : ''}`}
                      value={formData.emergency.relationship}
                      onChange={(e) => handleInputChange('emergency', 'relationship', e.target.value)}
                      onBlur={() => handleBlur('emergency', 'relationship')}
                      placeholder="e.g., Spouse, Parent, Sibling"
                    />
                    {getFieldError('emergency', 'relationship') && (
                      <span className="error-message">{getFieldError('emergency', 'relationship')}</span>
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
                      className={`form-input ${getFieldError('emergency', 'phone') ? 'error' : ''}`}
                      value={formData.emergency.phone}
                      onChange={(e) => handleInputChange('emergency', 'phone', e.target.value)}
                      onBlur={() => handleBlur('emergency', 'phone')}
                      placeholder="Primary contact number"
                    />
                    {getFieldError('emergency', 'phone') && (
                      <span className="error-message">{getFieldError('emergency', 'phone')}</span>
                    )}
                  </div>

                  {/* <div className="form-group">
                    <label className="form-label">Alternative Phone</label>
                    <input
                      type="tel"
                      className="form-input"
                      value={formData.emergency.alternativePhone}
                      onChange={(e) => handleInputChange('emergency', 'alternativePhone', e.target.value)}
                      placeholder="Alternative contact number"
                    />
                  </div> */}
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
            <div className="section-actions">
              {errors['employment.employeeId'] && <FiAlertCircle className="error-icon" />}
              <button type="button" className="section-toggle">
                {activeSections.employment ? <FiChevronUp /> : <FiChevronDown />}
              </button>
            </div>
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
                      className={`form-input ${getFieldError('employment', 'employeeId') ? 'error' : ''}`}
                      value={formData.employment.employeeId}
                      onChange={(e) => handleInputChange('employment', 'employeeId', e.target.value.toUpperCase())}
                      onBlur={() => handleBlur('employment', 'employeeId')}
                      placeholder="e.g., EMP001"
                    />
                    {getFieldError('employment', 'employeeId') && (
                      <span className="error-message">{getFieldError('employment', 'employeeId')}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      Job Title <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-input ${getFieldError('employment', 'jobTitle') ? 'error' : ''}`}
                      value={formData.employment.jobTitle}
                      onChange={(e) => handleInputChange('employment', 'jobTitle', e.target.value)}
                      onBlur={() => handleBlur('employment', 'jobTitle')}
                      placeholder="e.g., Software Engineer"
                    />
                    {getFieldError('employment', 'jobTitle') && (
                      <span className="error-message">{getFieldError('employment', 'jobTitle')}</span>
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
                      className={`form-input ${getFieldError('employment', 'department') ? 'error' : ''}`}
                      value={formData.employment.department}
                      onChange={(e) => handleInputChange('employment', 'department', e.target.value)}
                      onBlur={() => handleBlur('employment', 'department')}
                      placeholder="e.g., Engineering"
                    />
                    {getFieldError('employment', 'department') && (
                      <span className="error-message">{getFieldError('employment', 'department')}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      Location <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-input ${getFieldError('employment', 'location') ? 'error' : ''}`}
                      value={formData.employment.location}
                      onChange={(e) => handleInputChange('employment', 'location', e.target.value)}
                      onBlur={() => handleBlur('employment', 'location')}
                      placeholder="e.g., Addis Ababa"
                    />
                    {getFieldError('employment', 'location') && (
                      <span className="error-message">{getFieldError('employment', 'location')}</span>
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
                      className={`form-input ${getFieldError('employment', 'startDate') ? 'error' : ''}`}
                      value={formData.employment.startDate}
                      onChange={(e) => handleInputChange('employment', 'startDate', e.target.value)}
                      onBlur={() => handleBlur('employment', 'startDate')}
                    />
                    {getFieldError('employment', 'startDate') && (
                      <span className="error-message">{getFieldError('employment', 'startDate')}</span>
                    )}
                  </div>

                  {/* <div className="form-group">
                    <label className="form-label">Employment Type</label>
                    <select
                      className="form-select"
                      value={formData.employment.employmentType}
                      onChange={(e) => handleInputChange('employment', 'employmentType', e.target.value)}
                    >
                      {employmentTypes.map(type => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                      ))}
                    </select>
                  </div> */}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Status</label>
                    <select
                      className="form-select"
                      value={formData.employment.status}
                      onChange={(e) => handleInputChange('employment', 'status', e.target.value)}
                    >
                      {statusOptions.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* <div className="form-group">
                    <label className="form-label">Reports To</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.employment.reportTo}
                      onChange={(e) => handleInputChange('employment', 'reportTo', e.target.value)}
                      placeholder="Manager's name"
                    />
                  </div> */}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Section 4: Education
        <div className={`form-section ${activeSections.education ? 'active' : ''}`}>
          <div className="section-header" onClick={() => toggleSection('education')}>
            <div className="section-title">
              <div className="section-icon">
                <FiBookOpen />
              </div>
              <div>
                <h2>Education</h2>
                <p className="section-subtitle">Academic qualifications and degrees</p>
              </div>
            </div>
            <button type="button" className="section-toggle">
              {activeSections.education ? <FiChevronUp /> : <FiChevronDown />}
            </button>
          </div>
          
          {activeSections.education && (
            <div className="section-content">
              {formData.education.map((edu, index) => (
                <div key={edu.id} className="repeatable-group">
                  <div className="repeatable-header">
                    <h3>Education #{index + 1}</h3>
                    {formData.education.length > 1 && (
                      <button
                        type="button"
                        className="remove-btn"
                        onClick={() => removeEducation(index)}
                      >
                        <FiTrash2 size={16} />
                      </button>
                    )}
                  </div>
                  <div className="form-fields">
                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">Institution</label>
                        <input
                          type="text"
                          className="form-input"
                          value={edu.institution}
                          onChange={(e) => handleInputChange('education', 'institution', e.target.value, index)}
                          placeholder="University/College name"
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Degree</label>
                        <input
                          type="text"
                          className="form-input"
                          value={edu.degree}
                          onChange={(e) => handleInputChange('education', 'degree', e.target.value, index)}
                          placeholder="e.g., Bachelor's, Master's"
                        />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">Field of Study</label>
                        <input
                          type="text"
                          className="form-input"
                          value={edu.field}
                          onChange={(e) => handleInputChange('education', 'field', e.target.value, index)}
                          placeholder="e.g., Computer Science"
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Grade/GPA</label>
                        <input
                          type="text"
                          className="form-input"
                          value={edu.grade}
                          onChange={(e) => handleInputChange('education', 'grade', e.target.value, index)}
                          placeholder="e.g., 3.8 GPA"
                        />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">Start Year</label>
                        <input
                          type="text"
                          className="form-input"
                          value={edu.startYear}
                          onChange={(e) => handleInputChange('education', 'startYear', e.target.value, index)}
                          placeholder="e.g., 2016"
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">End Year</label>
                        <input
                          type="text"
                          className="form-input"
                          value={edu.endYear}
                          onChange={(e) => handleInputChange('education', 'endYear', e.target.value, index)}
                          placeholder="e.g., 2020"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              <button type="button" className="add-btn" onClick={addEducation}>
                <FiPlus size={16} />
                <span>Add Another Education</span>
              </button>
            </div>
          )}
        </div> */}

        {/* Section 5: Certificates
        <div className={`form-section ${activeSections.certificates ? 'active' : ''}`}>
          <div className="section-header" onClick={() => toggleSection('certificates')}>
            <div className="section-title">
              <div className="section-icon">
                <FiAward />
              </div>
              <div>
                <h2>Certificates</h2>
                <p className="section-subtitle">Professional certifications and licenses</p>
              </div>
            </div>
            <button type="button" className="section-toggle">
              {activeSections.certificates ? <FiChevronUp /> : <FiChevronDown />}
            </button>
          </div>
          
          {activeSections.certificates && (
            <div className="section-content">
              {formData.certificates.map((cert, index) => (
                <div key={cert.id} className="repeatable-group">
                  <div className="repeatable-header">
                    <h3>Certificate #{index + 1}</h3>
                    {formData.certificates.length > 1 && (
                      <button
                        type="button"
                        className="remove-btn"
                        onClick={() => removeCertificate(index)}
                      >
                        <FiTrash2 size={16} />
                      </button>
                    )}
                  </div>
                  <div className="form-fields">
                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">Certificate Name</label>
                        <input
                          type="text"
                          className="form-input"
                          value={cert.name}
                          onChange={(e) => handleInputChange('certificates', 'name', e.target.value, index)}
                          placeholder="e.g., AWS Certified Developer"
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Issued By</label>
                        <input
                          type="text"
                          className="form-input"
                          value={cert.issuedBy}
                          onChange={(e) => handleInputChange('certificates', 'issuedBy', e.target.value, index)}
                          placeholder="Issuing organization"
                        />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">Issue Date</label>
                        <input
                          type="date"
                          className="form-input"
                          value={cert.issueDate}
                          onChange={(e) => handleInputChange('certificates', 'issueDate', e.target.value, index)}
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Expiry Date</label>
                        <input
                          type="date"
                          className="form-input"
                          value={cert.expiryDate}
                          onChange={(e) => handleInputChange('certificates', 'expiryDate', e.target.value, index)}
                        />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">Credential ID</label>
                        <input
                          type="text"
                          className="form-input"
                          value={cert.credentialId}
                          onChange={(e) => handleInputChange('certificates', 'credentialId', e.target.value, index)}
                          placeholder="Certificate ID/Number"
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Certificate File</label>
                        <div className="file-upload">
                          <input
                            type="file"
                            id={`cert-file-${index}`}
                            className="file-input"
                            onChange={(e) => handleFileUpload('certificates', index, e.target.files[0])}
                            accept=".pdf,.jpg,.jpeg,.png"
                          />
                          <label htmlFor={`cert-file-${index}`} className="file-label">
                            <FiUpload size={16} />
                            <span>{cert.certificateFile ? cert.certificateFile.name : 'Choose file'}</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              <button type="button" className="add-btn" onClick={addCertificate}>
                <FiPlus size={16} />
                <span>Add Another Certificate</span>
              </button>
            </div>
          )}
        </div> */}

        {/* Section 6: Medical Allowance */}
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
                    <label className="form-label">Year</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.medical.year}
                      onChange={(e) => handleInputChange('medical', 'year', e.target.value)}
                      placeholder="e.g., 2024"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Max Limit (ETB)</label>
                    <input
                      type="number"
                      className="form-input"
                      value={formData.medical.maxLimit}
                      onChange={(e) => handleInputChange('medical', 'maxLimit', parseInt(e.target.value))}
                      min="0"
                      step="1000"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Used Amount (ETB)</label>
                    <input
                      type="number"
                      className="form-input"
                      value={formData.medical.usedAmount}
                      onChange={(e) => handleInputChange('medical', 'usedAmount', parseInt(e.target.value))}
                      min="0"
                      step="100"
                    />
                  </div>
                </div>

                {formData.medical.usedAmount > 0 && (
                  <div className="allowance-visualization">
                    <div className="allowance-header">
                      <span className="allowance-label">Annual Allowance Usage</span>
                      <span className="allowance-percentage">
                        {((formData.medical.usedAmount / formData.medical.maxLimit) * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="allowance-bar">
                      <div 
                        className={`allowance-progress ${
                          (formData.medical.usedAmount / formData.medical.maxLimit) > 0.9 
                            ? 'danger' 
                            : (formData.medical.usedAmount / formData.medical.maxLimit) > 0.7 
                            ? 'warning' 
                            : 'success'
                        }`}
                        style={{ 
                          width: `${Math.min((formData.medical.usedAmount / formData.medical.maxLimit) * 100, 100)}%` 
                        }}
                      />
                    </div>
                    <div className="allowance-stats">
                      <div className="stat">
                        <span className="stat-label">Used</span>
                        <span className="stat-value">{formData.medical.usedAmount.toLocaleString()} ETB</span>
                      </div>
                      <div className="stat">
                        <span className="stat-label">Remaining</span>
                        <span className="stat-value">{(formData.medical.maxLimit - formData.medical.usedAmount).toLocaleString()} ETB</span>
                      </div>
                      <div className="stat">
                        <span className="stat-label">Total</span>
                        <span className="stat-value">{formData.medical.maxLimit.toLocaleString()} ETB</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="info-box">
                  <FiInfo size={18} />
                  <div className="info-content">
                    <h4>About Medical Allowance</h4>
                    <p>Each employee receives an annual medical allowance of 30,000 ETB. This covers medical expenses, checkups, and treatments. Unused amounts do not roll over to the next year.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default EmployeeCreate;