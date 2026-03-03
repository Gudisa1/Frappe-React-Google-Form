// pages/HR/EmployeeDetail.jsx
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
  FiShield,
  FiAlertTriangle,
  FiEdit2,
  FiTrash2,
  FiArrowLeft,
  FiDownload,
  FiPrinter,
  FiMoreVertical,
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiAward,
  FiBookOpen,
  FiChevronRight,
  FiFileText,
  FiGlobe,
  FiStar,
  FiTrendingUp,
  FiDollarSign,
  FiPieChart
} from 'react-icons/fi';
import EmployeeLeaveTab from './EmployeeLeaveTab';
import EmployeeMedicalTab from './EmployeeMedicalTab';
import EmployeeGuaranteeTab from './EmployeeGuaranteeTab';
import EmployeeDisciplinaryTab from './EmployeeDisciplinaryTab';
import './EmployeeDetail.css';
import { getEmployee } from '../../api/hrapi';

const EmployeeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [employee, setEmployee] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
useEffect(() => {
  const fetchEmployee = async () => {
    try {
      const data = await getEmployee(id); // API returns the flat object

      if (!data) {
        console.error('No data from getEmployee');
        return;
      }

      // Map API fields to component expected keys
      const mappedEmployee = {
        id: data.name, // API 'name' as id
        firstName: data.first_name,
        lastName: data.last_name,
        fullName: data.full_name,
        dateOfBirth: data.date_of_birth,
        gender: data.gender,
        phone: data.phone,
        email: data.email,
        address: data.address,
        emergencyContactName: data.emergency_contact_name,
        emergencyContactRelationship: data.emergency_contact_relationship,
        emergencyContactPhone: data.emergency_contact_phone,
        jobTitle: data.job_title,
        department: data.department,
        location: data.location,
        startDate: data.employment_start_date,
        status: data.status,
        medicalMaxLimit: data.medical_max_limit,
        medicalUsed: data.medical_used,
        medicalRemaining: data.medical_remaining,
        totalLeavesTaken: data.total_leaves_taken,
        activeGuarantees: data.active_guarantees_count,
        disciplinaryCount: data.disciplinary_records_count,
      
      };

      setEmployee(mappedEmployee);

    } catch (err) {
      console.error('Failed to fetch employee:', err);
    } finally {
      setLoading(false);
    }
  };

  fetchEmployee();
}, [id]);

  const getStatusBadge = (status) => {
    const badges = {
      'Active': { class: 'badge-active', icon: FiCheckCircle },
      'Probation': { class: 'badge-probation', icon: FiClock },
      'Newly Hired': { class: 'badge-new', icon: FiStar },
      'Notice Period': { class: 'badge-notice', icon: FiAlertTriangle },
      'Contract Ended': { class: 'badge-ended', icon: FiXCircle },
      'Resigned': { class: 'badge-resigned', icon: FiTrendingUp },
      'Retired': { class: 'badge-retired', icon: FiAward }
    };
    return badges[status] || { class: 'badge-default', icon: FiUser };
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FiUser, color: '#4f46e5' },
    { id: 'medical', label: 'Medical Allowance', icon: FiHeart, color: '#f59e0b' },
    { id: 'guarantee', label: 'Guarantee Tracker', icon: FiShield, color: '#8b5cf6' },
    { id: 'disciplinary', label: 'Disciplinary', icon: FiAlertTriangle, color: '#ef4444' }
  ];

  if (loading) {
    return (
      <div className="detail-loading">
        <div className="loading-spinner"></div>
        <p>Loading employee profile...</p>
      </div>
    );
  }

  const StatusIcon = getStatusBadge(employee.status).icon;

  return (
    <div className="employee-detail">
      {/* Header with Gradient Background */}
      <div className="detail-header">
        <div className="header-content">
          <div className="header-left">
            <button className="back-button" onClick={() => navigate('/hr/employees')}>
              <FiArrowLeft size={20} />
            </button>
            <div className="employee-avatar">
              {employee.profileImage ? (
                <img src={employee.profileImage} alt={employee.fullName} />
              ) : (
                <div className="avatar-placeholder">
                  <span>{employee.firstName[0]}{employee.lastName[0]}</span>
                </div>
              )}
            </div>
            <div className="employee-title">
              <h1>{employee.fullName}</h1>
              <div className="title-meta">
                <span className="employee-id">{employee.employeeId}</span>
                <span className="dot">•</span>
                <span className="employee-position">{employee.jobTitle}</span>
              </div>
            </div>
          </div>
          <div className="header-right">
            <div className={`status-badge-large ${getStatusBadge(employee.status).class}`}>
              <StatusIcon size={16} />
              <span>{employee.status}</span>
            </div>
            <div className="action-group">
              <button className="icon-button" onClick={() => window.print()}>
                <FiPrinter size={18} />
              </button>
              <button className="icon-button" onClick={() => {}}>
                <FiDownload size={18} />
              </button>
              <Link to={`/hr/employees/edit/${employee.id}`} className="icon-button edit">
                <FiEdit2 size={18} />
              </Link>
              <button className="icon-button delete" onClick={() => setShowDeleteConfirm(true)}>
                <FiTrash2 size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #4f46e5, #818cf8)' }}>
            <FiCalendar />
          </div>
          <div className="stat-info">
            <span className="stat-label">Leave Days Used</span>
            <span className="stat-value">{employee.totalLeavesTaken}</span>
          </div>
          {/* <div className="stat-trend positive">
            <FiTrendingUp size={14} />
            <span>12% vs avg</span>
          </div> */}
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #10b981, #34d399)' }}>
            <FiShield />
          </div>
          <div className="stat-info">
            <span className="stat-label">Active Guarantees</span>
            <span className="stat-value">{employee.activeGuarantees}</span>
          </div>
          {/* <div className="stat-trend neutral">
            <span>All active</span>
          </div> */}
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #f59e0b, #fbbf24)' }}>
            <FiAlertTriangle />
          </div>
          <div className="stat-info">
            <span className="stat-label">Disciplinary Records</span>
            <span className="stat-value">{employee.disciplinaryCount}</span>
          </div>
          {/* <div className="stat-trend negative">
            <FiTrendingUp size={14} />
            <span>+1 this year</span>
          </div> */}
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="tabs-container">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              className={`tab-button ${isActive ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
              style={isActive ? { '--tab-color': tab.color } : {}}
            >
              <Icon size={18} />
              <span>{tab.label}</span>
              {isActive && <div className="tab-indicator" style={{ background: tab.color }} />}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'overview' && (
          <div className="overview-tab">
            {/* Profile Information Cards */}
            <div className="profile-grid">
              {/* Personal Info Card */}
              <div className="profile-card">
                <div className="card-header">
                  <FiUser className="header-icon" />
                  <h3>Personal Information</h3>
                </div>
                <div className="card-content">
                  <div className="info-row">
                    <span className="info-label">Full Name</span>
                    <span className="info-value">{employee.fullName}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Date of Birth</span>
                    <span className="info-value">
                      {new Date(employee.dateOfBirth).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Gender</span>
                    <span className="info-value">{employee.gender}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Phone</span>
                    <span className="info-value">
                      <FiPhone size={14} />
                      {employee.phone}
                    </span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Email</span>
                    <span className="info-value">
                      <FiMail size={14} />
                      {employee.email}
                    </span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Address</span>
                    <span className="info-value">
                      <FiMapPin size={14} />
                      {employee.address}
                    </span>
                  </div>
                </div>
              </div>

              {/* Emergency Contact Card */}
              <div className="profile-card">
                <div className="card-header">
                  <FiPhone className="header-icon" />
                  <h3>Emergency Contact</h3>
                </div>
                <div className="card-content">
                  <div className="info-row">
                    <span className="info-label">Name</span>
                    <span className="info-value">{employee.id}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Relationship</span>
                    <span className="info-value">{employee.emergencyContactRelationship}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Phone</span>
                    <span className="info-value">
                      <FiPhone size={14} />
                      {employee.phone}
                    </span>
                  </div>
                </div>
              </div>

              {/* Employment Info Card */}
              <div className="profile-card">
                <div className="card-header">
                  <FiBriefcase className="header-icon" />
                  <h3>Employment Details</h3>
                </div>
                <div className="card-content">
                  <div className="info-row">
                    <span className="info-label">Job Title</span>
                    <span className="info-value">{employee.jobTitle}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Department</span>
                    <span className="info-value">{employee.department}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Location</span>
                    <span className="info-value">{employee.location}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Start Date</span>
                    <span className="info-value">
                        {employee?.startDate &&
                            new Date(employee.startDate).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })
                    }
                    </span>
                  </div>
                  {/* <div className="info-row">
                    <span className="info-label">Employment Type</span>
                    <span className="info-value">
                      <span className="badge-light">{employee.employmentType}</span>
                    </span>
                  </div> */}
                </div>
              </div>

              {/* Medical Allowance Card */}
              <div className="profile-card">
                <div className="card-header">
                  <FiHeart className="header-icon" />
                  <h3>Medical Allowance {employee.year}</h3>
                  {employee.used >= 20000 && (
                    <div className="warning-chip">
                      <FiAlertTriangle size={14} />
                      <span>Near Limit</span>
                    </div>
                  )}
                </div>
                <div className="card-content">
                  <div className="allowance-grid">
                    <div className="allowance-item">
                      <span className="item-label">Max Limit</span>
                      <span className="item-value">{employee.medicalMaxLimit.toLocaleString()} ETB</span>
                    </div>
                    <div className="allowance-item">
                      <span className="item-label">Used</span>
                      <span className="item-value used">{employee.medicalUsed.toLocaleString()} ETB</span>
                    </div>
                    <div className="allowance-item">
                      <span className="item-label">Remaining</span>
                      <span className="item-value remaining">{employee.medicalRemaining.toLocaleString()} ETB</span>
                    </div>
                  </div>
                  <div className="progress-wrapper">
                    <div className="progress-header">
                      <span>Usage Progress</span>
                      <span className="progress-percentage">
                        {((employee.medicalUsed / employee.medicalMaxLimit) * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="progress-track">
                      <div 
                        className={`progress-fill ${
                          (employee.medicalUsed / employee.medicalMaxLimit) > 0.9 
                            ? 'danger' 
                            : (employee.medicalUsed / employee.medicalMaxLimit) > 0.7 
                            ? 'warning' 
                            : 'success'
                        }`}
                        style={{ 
                          width: `${(employee.medicalUsed / employee.medicalMaxLimit) * 100}%` 
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Education Card
              <div className="profile-card full-width">
                <div className="card-header">
                  <FiBookOpen className="header-icon" />
                  <h3>Education</h3>
                </div>
                <div className="card-content">
                  {employee.education.map((edu, index) => (
                    <div key={index} className="education-item">
                      <div className="edu-header">
                        <span className="edu-degree">{edu.degree}</span>
                        <span className="edu-year">{edu.year}</span>
                      </div>
                      <div className="edu-field">{edu.field}</div>
                      <div className="edu-institution">{edu.institution}</div>
                    </div>
                  ))}
                </div>
              </div> */}

              {/* Certificates Card
              {employee.certificates.length > 0 && (
                <div className="profile-card full-width">
                  <div className="card-header">
                    <FiAward className="header-icon" />
                    <h3>Certificates</h3>
                  </div>
                  <div className="card-content">
                    {employee.certificates.map((cert, index) => (
                      <div key={index} className="certificate-item">
                        <div className="cert-header">
                          <FiAward className="cert-icon" />
                          <div className="cert-info">
                            <span className="cert-name">{cert.name}</span>
                            <span className="cert-issuer">{cert.issuedBy}</span>
                          </div>
                        </div>
                        <div className="cert-dates">
                          <div className="date-badge">
                            <FiCalendar size={12} />
                            <span>Issued: {new Date(cert.issueDate).toLocaleDateString()}</span>
                          </div>
                          <div className="date-badge">
                            <FiClock size={12} />
                            <span>Expires: {new Date(cert.expiryDate).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )} */}

              {/* Leave Summary Card
              <div className="profile-card">
                <div className="card-header">
                  <FiCalendar className="header-icon" />
                  <h3>Leave Summary</h3>
                </div>
                <div className="card-content">
                  <div className="leave-summary">
                    <div className="leave-stat">
                      <span className="stat-name">Annual</span>
                      <span className="stat-numbers">{employee.annual.used}/{employee.leaveStats.annual.total}</span>
                    </div>
                    <div className="leave-stat">
                      <span className="stat-name">Sick</span>
                      <span className="stat-numbers">{employee.sick.used}/{employee.leaveStats.sick.total}</span>
                    </div>
                    <div className="leave-stat">
                      <span className="stat-name">Maternity/Paternity</span>
                      <span className="stat-numbers">{employee.maternity.used}/{employee.leaveStats.maternity.total}</span>
                    </div>
                    <div className="leave-stat">
                      <span className="stat-name">Compassionate</span>
                      <span className="stat-numbers">{employee.compassionate.used}/{employee.leaveStats.compassionate.total}</span>
                    </div>
                    <div className="leave-stat">
                      <span className="stat-name">Unpaid</span>
                      <span className="stat-numbers">{employee.unpaid.used}</span>
                    </div>
                  </div>
                </div>
              </div> */}
            </div>
          </div>
        )}

        {activeTab === 'leave' && (
          <EmployeeLeaveTab employeeId={employee.id} leaveStats={employee.leaveStats} />
        )}

        {activeTab === 'medical' && (
          <EmployeeMedicalTab 
            employeeId={employee.id} 
            medicalData={employee.medicalAllowance}
          />
        )}

        {activeTab === 'guarantee' && (
          <EmployeeGuaranteeTab 
            employeeId={employee.id}
            guarantees={employee.guarantees}
          />
        )}

        {activeTab === 'disciplinary' && (
          <EmployeeDisciplinaryTab 
            employeeId={employee.id}
            disciplinary={employee.disciplinary}
          />
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-icon warning">
              <FiAlertTriangle size={32} />
            </div>
            <h3>Delete Employee</h3>
            <p>Are you sure you want to delete {employee.fullName}? This action cannot be undone.</p>
            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setShowDeleteConfirm(false)}>
                Cancel
              </button>
              <button className="btn-danger" onClick={() => {
                console.log('Deleting employee:', id);
                setShowDeleteConfirm(false);
                navigate('/hr/employees');
              }}>
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeDetail;