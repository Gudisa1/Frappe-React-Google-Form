// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { createEmployee } from '../../api/hrapi';
// import { getProjects } from '../../api/datacollection';
// import "./EmployeeCreate.css";

// const EmployeeCreate = () => {
//   const navigate = useNavigate();

//   // Toast state
//   const [toast, setToast] = useState(null);

//   // Projects state
//   const [projects, setProjects] = useState([]);

//   // Employee form state
//   const [formData, setFormData] = useState({
//     first_name: '',
//     last_name: '',
//     date_of_birth: '',
//     phone: '',
//     email: '',
//     address: '',
//     emergency_contact_name: '',
//     emergency_contact_relationship: '',
//     emergency_contact_phone: '',
//     employee_id: '',
//     job_title: '',
//     project: '',
//     location: '',
//     employment_start_date: '',
//     status: 'Newly Hired',
//   });

//   // Static status options
//   const statusOptions = [
//     "Newly Hired",
//     "Active",
//     "Probation",
//     "Contract Ended",
//     "Resigned",
//     "Retired"
//   ];

//   // Fetch projects on mount
//   useEffect(() => {
//     const fetchProjects = async () => {
//       try {
//         const res = await getProjects();
//         setProjects(res.data || []);
//       } catch (error) {
//         console.error('Error fetching projects:', error);
//         showToast("Failed to load projects", "error");
//       }
//     };
//     fetchProjects();
//   }, []);

//   // Show toast helper
//   const showToast = (message, type = "success") => {
//     setToast({ message, type });
//     setTimeout(() => setToast(null), 3000);
//   };

//   // Handle input change
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await createEmployee(formData);
//       showToast("Employee created successfully ✅", "success");

//       // Redirect to /hr after a short delay
//       setTimeout(() => navigate('/hr'), 1500);
//     } catch (error) {
//       console.error(error);
//       showToast(error.message || "Failed to create employee", "error");
//     }
//   };

//   return (
//     <div style={{ padding: '20px' }}>
//       {/* Custom Toast */}
//       {toast && (
//         <div
//           style={{
//             position: 'fixed',
//             top: '20px',
//             right: '20px',
//             padding: '12px 20px',
//             backgroundColor:
//               toast.type === 'success' ? '#4CAF50' :
//               toast.type === 'error' ? '#f44336' : '#333',
//             color: 'white',
//             borderRadius: '5px',
//             zIndex: 1000,
//             transition: 'opacity 0.3s ease',
//           }}
//         >
//           {toast.message}
//         </div>
//       )}

//       <form onSubmit={handleSubmit}>
//         {/* Basic Info */}
//         <input name="first_name" placeholder="First Name" value={formData.first_name} onChange={handleChange} /><br />
//         <input name="last_name" placeholder="Last Name" value={formData.last_name} onChange={handleChange} /><br />
//         <input name="date_of_birth" type="date" value={formData.date_of_birth} onChange={handleChange} /><br />
//         <input name="employee_id" placeholder="Employee ID" value={formData.employee_id} onChange={handleChange} /><br />

//         {/* Contact */}
//         <input name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} /><br />
//         <input name="email" placeholder="Email" value={formData.email} onChange={handleChange} /><br />
//         <input name="address" placeholder="Address" value={formData.address} onChange={handleChange} /><br />

//         {/* Emergency Contact */}
//         <input name="emergency_contact_name" placeholder="Emergency Name" value={formData.emergency_contact_name} onChange={handleChange} /><br />
//         <input name="emergency_contact_relationship" placeholder="Relationship" value={formData.emergency_contact_relationship} onChange={handleChange} /><br />
//         <input name="emergency_contact_phone" placeholder="Emergency Phone" value={formData.emergency_contact_phone} onChange={handleChange} /><br />

//         {/* Job Info */}
//         <input name="job_title" placeholder="Job Title" value={formData.job_title} onChange={handleChange} /><br />
//         <input name="location" placeholder="Location" value={formData.location} onChange={handleChange} /><br />
//         <input name="employment_start_date" type="date" value={formData.employment_start_date} onChange={handleChange} /><br />

//         {/* Project Dropdown */}
//         <select name="project" value={formData.project} onChange={handleChange}>
//           <option value="">Select Project</option>
//           {projects.map(proj => (
//             <option key={proj.name} value={proj.name}>
//               {proj.project_name || proj.name}
//             </option>
//           ))}
//         </select><br />

//         {/* Status Dropdown */}
//         <select name="status" value={formData.status} onChange={handleChange}>
//           {statusOptions.map(status => (
//             <option key={status} value={status}>{status}</option>
//           ))}
//         </select><br />

//         <button type="submit">Create Employee</button>
//       </form>
//     </div>
//   );
// };

// export default EmployeeCreate;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createEmployee } from '../../api/hrapi';
import { getProjects } from '../../api/datacollection';
import "./EmployeeCreate.css";

const EmployeeCreate = () => {
  const navigate = useNavigate();

  // Toast state
  const [toast, setToast] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Projects state
  const [projects, setProjects] = useState([]);

  // Employee form state
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    date_of_birth: '',
    phone: '',
    email: '',
    address: '',
    emergency_contact_name: '',
    emergency_contact_relationship: '',
    emergency_contact_phone: '',
    employee_id: '',
    job_title: '',
    project: '',
    location: '',
    employment_start_date: '',
    status: 'Newly Hired',
  });

  // Static status options
  const statusOptions = [
    "Newly Hired",
    "Active",
    "Probation",
    "Contract Ended",
    "Resigned",
    "Retired"
  ];

  // Fetch projects on mount
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await getProjects();
        setProjects(res.data || []);
      } catch (error) {
        console.error('Error fetching projects:', error);
        showToast("Failed to load projects", "error");
      }
    };
    fetchProjects();
  }, []);

  // Show toast helper with better UX
  const showToast = (message, type = "success") => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast(prev => prev?.id === Date.now() ? null : prev);
    }, 4000);
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.first_name || !formData.last_name || !formData.email) {
      showToast("Please fill in all required fields (First Name, Last Name, Email)", "error");
      return;
    }

    setIsSubmitting(true);
    
    try {
      await createEmployee(formData);
      showToast("Employee created successfully! 🎉 Redirecting...", "success");
      
      // Clear form after successful submission
      setFormData({
        first_name: '',
        last_name: '',
        date_of_birth: '',
        phone: '',
        email: '',
        address: '',
        emergency_contact_name: '',
        emergency_contact_relationship: '',
        emergency_contact_phone: '',
        employee_id: '',
        job_title: '',
        project: '',
        location: '',
        employment_start_date: '',
        status: 'Newly Hired',
      });
      
      // Redirect to /hr after a short delay
      setTimeout(() => {
        navigate('/hr');
      }, 2000);
    } catch (error) {
      console.error(error);
      const errorMessage = error.response?.data?.message || error.message || "Failed to create employee";
      showToast(errorMessage, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="employee-create-container">
      {/* Enhanced Toast Notification */}
      {toast && (
        <div className={`toast-notification toast-${toast.type}`}>
          <div className="toast-icon">
            {toast.type === "success" ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                <path d="M12 8V12M12 16H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            )}
          </div>
          <div className="toast-content">
            <div className="toast-title">
              {toast.type === "success" ? "Success!" : "Error!"}
            </div>
            <div className="toast-message">{toast.message}</div>
          </div>
          <button 
            className="toast-close" 
            onClick={() => setToast(null)}
            aria-label="Close notification"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
          <div className="toast-progress-bar"></div>
        </div>
      )}

      <div className="form-wrapper">
        <div className="form-header">
          <h1>Create New Employee</h1>
          <p>Fill in the details to add a new team member</p>
        </div>

        <form onSubmit={handleSubmit} className="employee-form">
          {/* Basic Info Section */}
          <div className="form-section">
            <div className="section-title">
              <span className="section-icon">👤</span>
              <h2>Basic Information</h2>
            </div>
            <div className="form-grid">
              <div className="form-group">
                <label>First Name <span className="required-star">*</span></label>
                <input 
                  name="first_name" 
                  placeholder="Enter first name" 
                  value={formData.first_name} 
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <label>Last Name <span className="required-star">*</span></label>
                <input 
                  name="last_name" 
                  placeholder="Enter last name" 
                  value={formData.last_name} 
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <label>Date of Birth</label>
                <input 
                  name="date_of_birth" 
                  type="date" 
                  value={formData.date_of_birth} 
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>Employee ID</label>
                <input 
                  name="employee_id" 
                  placeholder="Enter employee ID" 
                  value={formData.employee_id} 
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
            </div>
          </div>

          {/* Contact Info Section */}
          <div className="form-section">
            <div className="section-title">
              <span className="section-icon">📞</span>
              <h2>Contact Information</h2>
            </div>
            <div className="form-grid">
              <div className="form-group">
                <label>Phone Number</label>
                <input 
                  name="phone" 
                  placeholder="Enter phone number" 
                  value={formData.phone} 
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>Email Address <span className="required-star">*</span></label>
                <input 
                  name="email" 
                  type="email"
                  placeholder="Enter email address" 
                  value={formData.email} 
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group full-width">
                <label>Address</label>
                <input 
                  name="address" 
                  placeholder="Enter address" 
                  value={formData.address} 
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
            </div>
          </div>

          {/* Emergency Contact Section */}
          <div className="form-section">
            <div className="section-title">
              <span className="section-icon">🚨</span>
              <h2>Emergency Contact</h2>
            </div>
            <div className="form-grid">
              <div className="form-group">
                <label>Contact Name</label>
                <input 
                  name="emergency_contact_name" 
                  placeholder="Enter emergency contact name" 
                  value={formData.emergency_contact_name} 
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>Relationship</label>
                <input 
                  name="emergency_contact_relationship" 
                  placeholder="Enter relationship" 
                  value={formData.emergency_contact_relationship} 
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>Emergency Phone</label>
                <input 
                  name="emergency_contact_phone" 
                  placeholder="Enter emergency phone number" 
                  value={formData.emergency_contact_phone} 
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
            </div>
          </div>

          {/* Employment Info Section */}
          <div className="form-section">
            <div className="section-title">
              <span className="section-icon">💼</span>
              <h2>Employment Information</h2>
            </div>
            <div className="form-grid">
              <div className="form-group">
                <label>Job Title</label>
                <input 
                  name="job_title" 
                  placeholder="Enter job title" 
                  value={formData.job_title} 
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>Location</label>
                <input 
                  name="location" 
                  placeholder="Enter location" 
                  value={formData.location} 
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>Employment Start Date</label>
                <input 
                  name="employment_start_date" 
                  type="date" 
                  value={formData.employment_start_date} 
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>Project</label>
                <select 
                  name="project" 
                  value={formData.project} 
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="">Select Project</option>
                  {projects.map(proj => (
                    <option key={proj.name} value={proj.name}>
                      {proj.project_name || proj.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Status</label>
                <select 
                  name="status" 
                  value={formData.status} 
                  onChange={handleChange}
                  className="form-select"
                >
                  {statusOptions.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <button 
              type="button" 
              onClick={() => navigate('/hr')} 
              className="btn btn-secondary"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner"></span>
                  Creating...
                </>
              ) : (
                'Create Employee'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeCreate;