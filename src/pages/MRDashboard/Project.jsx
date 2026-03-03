// import React, { useState, useEffect } from "react";
// import { createProject, fetchUsersWithRoles } from "../../api/datacollection";

// const Project = () => {
//   // Form state
//   const [formData, setFormData] = useState({
//     project_name: "",
//     project_code: "",
//     project_manager: "",
//     status: "Active",
//     start_date: "",
//     end_date: "",
//     region: "",
//     district: "",
//     description: ""
//   });

//   const [errors, setErrors] = useState({});
//   const [successMessage, setSuccessMessage] = useState("");
//   const [users, setUsers] = useState([]);

//   // Fetch Project Managers on mount
//   useEffect(() => {
//     console.log("Loading Project Managers...");
//     fetchUsersWithRoles("Project Manager")
//       .then((data) => {
//         console.log("Fetched Project Managers:", data);
//         setUsers(data);
//       })
//       .catch((err) => console.error("Error fetching users:", err));
//   }, []);

//   // Handle input change
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     console.log("Input changed:", name, value);
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   // Validate required fields
//   const validate = () => {
//     const newErrors = {};
//     if (!formData.project_name) newErrors.project_name = "Project Name is required";
//     if (!formData.project_code) newErrors.project_code = "Project Code is required";
//     if (!formData.project_manager) newErrors.project_manager = "Project Manager is required";
//     if (!formData.region) newErrors.region = "Region is required";
//     if (!formData.district) newErrors.district = "District is required";

//     setErrors(newErrors);
//     console.log("Validation errors:", newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   // Submit handler
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setSuccessMessage("");
//     console.log("Submitting project:", formData);

//     if (!validate()) return;

//     try {
//       const created = await createProject(formData);
//       console.log("Project created successfully:", created);
//       setSuccessMessage(`Project created successfully: ${created.name}`);
//       setFormData({
//         project_name: "",
//         project_code: "",
//         project_manager: "",
//         status: "Active",
//         start_date: "",
//         end_date: "",
//         region: "",
//         district: "",
//         description: ""
//       });
//       setErrors({});
//     } catch (error) {
//       console.error("Error creating project:", error);
//       setErrors({ api: error.message });
//     }
//   };

//   return (
//     <div style={{ maxWidth: "600px", margin: "20px auto" }}>
//       <h2>Create Project</h2>
//       {errors.api && <p style={{ color: "red" }}>{errors.api}</p>}
//       {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
//       <form onSubmit={handleSubmit}>
//         <div>
//           <label>Project Name *</label>
//           <input type="text" name="project_name" value={formData.project_name} onChange={handleChange} />
//           {errors.project_name && <span style={{ color: "red" }}>{errors.project_name}</span>}
//         </div>

//         <div>
//           <label>Project Code *</label>
//           <input type="text" name="project_code" value={formData.project_code} onChange={handleChange} />
//           {errors.project_code && <span style={{ color: "red" }}>{errors.project_code}</span>}
//         </div>

//         <div>
//           <label>Project Manager *</label>
//           <select name="project_manager" value={formData.project_manager} onChange={handleChange}>
//             <option value="">Select Project Manager</option>
//             {users.map((user) => (
//               <option key={user.email} value={user.name}>
//                 {user.full_name || user.email} ({user.roles.join(", ")})
//               </option>
//             ))}
//           </select>
//           {errors.project_manager && <span style={{ color: "red" }}>{errors.project_manager}</span>}
//         </div>

//         <div>
//           <label>Status</label>
//           <select name="status" value={formData.status} onChange={handleChange}>
//             <option>Active</option>
//             <option>Inactive</option>
//             <option>Completed</option>
//             <option>On Hold</option>
//             <option>Cancelled</option>
//           </select>
//         </div>

//         <div>
//           <label>Start Date</label>
//           <input type="date" name="start_date" value={formData.start_date} onChange={handleChange} />
//         </div>

//         <div>
//           <label>End Date</label>
//           <input type="date" name="end_date" value={formData.end_date} onChange={handleChange} />
//         </div>

//         <div>
//           <label>Region *</label>
//           <input type="text" name="region" value={formData.region} onChange={handleChange} />
//           {errors.region && <span style={{ color: "red" }}>{errors.region}</span>}
//         </div>

//         <div>
//           <label>District *</label>
//           <input type="text" name="district" value={formData.district} onChange={handleChange} />
//           {errors.district && <span style={{ color: "red" }}>{errors.district}</span>}
//         </div>

//         <div>
//           <label>Project Description</label>
//           <textarea name="description" value={formData.description} onChange={handleChange} />
//         </div>

//         <button type="submit" style={{ marginTop: "10px" }}>Create Project</button>
//       </form>
//     </div>
//   );
// };

// export default Project;



import React, { useState, useEffect } from "react";
import { createProject, fetchUsersWithRoles } from "../../api/datacollection";
import "./Project.css"; // Import the independent stylesheet
import { useNavigate } from "react-router-dom";

const Project = () => {
  // Form state (unchanged)
    const navigate = useNavigate(); // Add this hook

  const [formData, setFormData] = useState({
    project_name: "",
    project_code: "",
    project_manager: "",
    status: "Active",
    start_date: "",
    end_date: "",
    region: "",
    district: "",
    description: ""
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch Project Managers on mount (unchanged)
  useEffect(() => {
    console.log("Loading Project Managers...");
    setLoading(true);
    fetchUsersWithRoles("Project Manager")
      .then((data) => {
        console.log("Fetched Project Managers:", data);
        setUsers(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching users:", err);
        setLoading(false);
      });
  }, []);

  // Handle input change (unchanged)
  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log("Input changed:", name, value);
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  // Validate required fields (unchanged logic, enhanced UX)
  const validate = () => {
    const newErrors = {};
    if (!formData.project_name?.trim()) newErrors.project_name = "Project Name is required";
    if (!formData.project_code?.trim()) newErrors.project_code = "Project Code is required";
    if (!formData.project_manager) newErrors.project_manager = "Project Manager is required";
    if (!formData.region?.trim()) newErrors.region = "Region is required";
    if (!formData.district?.trim()) newErrors.district = "District is required";

    setErrors(newErrors);
    console.log("Validation errors:", newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Open confirmation modal
  const handleConfirmSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      setShowConfirmModal(true);
    }
  };

  // Submit handler (unchanged logic, just wrapped)
  const handleSubmit = async () => {
    setShowConfirmModal(false);
    setSuccessMessage("");
    setIsSubmitting(true);
    console.log("Submitting project:", formData);

    try {
      const created = await createProject(formData);
      console.log("Project created successfully:", created);
      setSuccessMessage(`✨ Project "${created.name}" created successfully!`);

      setFormData({
        project_name: "",
        project_code: "",
        project_manager: "",
        status: "Active",
        start_date: "",
        end_date: "",
        region: "",
        district: "",
        description: ""
      });
      navigate("/mr-dashboard/projectslist"); 
      setErrors({});
      
      // Auto-hide success message after 5 seconds
      setTimeout(() => setSuccessMessage(""), 5000);
    } catch (error) {
      console.error("Error creating project:", error);
      setErrors({ api: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Cancel submission
  const handleCancel = () => {
    setShowConfirmModal(false);
  };

  // Reset form
  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset the form?')) {
      setFormData({
        project_name: "",
        project_code: "",
        project_manager: "",
        status: "Active",
        start_date: "",
        end_date: "",
        region: "",
        district: "",
        description: ""
      });
      setErrors({});
    }
  };

  // Get status badge class
  const getStatusBadgeClass = (status) => {
    switch(status?.toLowerCase()) {
      case 'active': return 'status-badge active';
      case 'inactive': return 'status-badge inactive';
      case 'completed': return 'status-badge completed';
      case 'on hold': return 'status-badge onhold';
      case 'cancelled': return 'status-badge cancelled';
      default: return 'status-badge';
    }
  };

  return (
    <div className="project-container">
      <div className="project-card">
        <div className="project-header">
          <h1 className="project-title">Create New Project</h1>
          <p className="project-subtitle">Fill in the details below to create a new project</p>
        </div>

        <div className="project-form">
          {/* Success Message */}
          {successMessage && (
            <div className="success-message">
              {successMessage}
            </div>
          )}

          {/* API Error Message */}
          {errors.api && (
            <div className="api-error">
              {errors.api}
            </div>
          )}

          <form onSubmit={handleConfirmSubmit}>
            <div className="form-grid">
              {/* Project Name */}
              <div className="form-group">
                <label className="form-label">
                  Project Name
                  <span className="required-star">*</span>
                </label>
                <input
                  type="text"
                  name="project_name"
                  value={formData.project_name}
                  onChange={handleChange}
                  className={`form-input ${errors.project_name ? 'error' : ''}`}
                  placeholder="e.g., ERP Implementation"
                  maxLength="100"
                />
                {errors.project_name && (
                  <div className="error-message">{errors.project_name}</div>
                )}
              </div>

              {/* Project Code */}
              <div className="form-group">
                <label className="form-label">
                  Project Code
                  <span className="required-star">*</span>
                </label>
                <input
                  type="text"
                  name="project_code"
                  value={formData.project_code}
                  onChange={handleChange}
                  className={`form-input ${errors.project_code ? 'error' : ''}`}
                  placeholder="e.g., PRJ-2024-001"
                  maxLength="50"
                />
                {errors.project_code && (
                  <div className="error-message">{errors.project_code}</div>
                )}
              </div>

              {/* Project Manager */}
              <div className="form-group">
                <label className="form-label">
                  Project Manager
                  <span className="required-star">*</span>
                </label>
                {loading ? (
                  <div className="skeleton"></div>
                ) : (
                  <select
                    name="project_manager"
                    value={formData.project_manager}
                    onChange={handleChange}
                    className={`form-select ${errors.project_manager ? 'error' : ''}`}
                  >
                    <option value="">Select Project Manager</option>
                    {users.map((user) => (
                      <option key={user.email} value={user.name}>
                        {user.full_name || user.email} 
                        {user.roles && user.roles.length > 0 && (
                          <span className="user-badge">{user.roles[0]}</span>
                        )}
                      </option>
                    ))}
                  </select>
                )}
                {errors.project_manager && (
                  <div className="error-message">{errors.project_manager}</div>
                )}
              </div>

              {/* Status */}
              <div className="form-group">
                <label className="form-label">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Completed">Completed</option>
                  <option value="On Hold">On Hold</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
                <span className={getStatusBadgeClass(formData.status)}>
                  {formData.status}
                </span>
              </div>

              {/* Start Date */}
              <div className="form-group">
                <label className="form-label">Start Date</label>
                <input
                  type="date"
                  name="start_date"
                  value={formData.start_date}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>

              {/* End Date */}
              <div className="form-group">
                <label className="form-label">End Date</label>
                <input
                  type="date"
                  name="end_date"
                  value={formData.end_date}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>

              {/* Region */}
              <div className="form-group">
                <label className="form-label">
                  Region
                  <span className="required-star">*</span>
                </label>
                <input
                  type="text"
                  name="region"
                  value={formData.region}
                  onChange={handleChange}
                  className={`form-input ${errors.region ? 'error' : ''}`}
                  placeholder="e.g., North America"
                />
                {errors.region && (
                  <div className="error-message">{errors.region}</div>
                )}
              </div>

              {/* District */}
              <div className="form-group">
                <label className="form-label">
                  District
                  <span className="required-star">*</span>
                </label>
                <input
                  type="text"
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  className={`form-input ${errors.district ? 'error' : ''}`}
                  placeholder="e.g., California"
                />
                {errors.district && (
                  <div className="error-message">{errors.district}</div>
                )}
              </div>

              {/* Description - Full Width */}
              <div className="form-group-full">
                <label className="form-label">Project Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="form-textarea"
                  placeholder="Describe the project scope, objectives, and any additional details..."
                  maxLength="500"
                />
                <div style={{ fontSize: '12px', color: '#718096', textAlign: 'right' }}>
                  {formData.description.length}/500
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="button-group">
              <button
                type="button"
                onClick={handleReset}
                className="btn btn-secondary"
                disabled={isSubmitting}
              >
                <span>↺</span> Reset
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
                  <>
                    <span>✨</span>
                    Create Project
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="modal-overlay" onClick={handleCancel}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-icon">⚠️</div>
              <h2 className="modal-title">Confirm Project Creation</h2>
            </div>
            
            <div className="modal-body">
              <p style={{ marginBottom: '20px', color: '#4a5568' }}>
                Please review the project details before confirming:
              </p>
              
              <div className="modal-field">
                <div className="modal-field-label">Project Name</div>
                <div className="modal-field-value">{formData.project_name}</div>
              </div>
              
              <div className="modal-field">
                <div className="modal-field-label">Project Code</div>
                <div className="modal-field-value">{formData.project_code}</div>
              </div>
              
              <div className="modal-field">
                <div className="modal-field-label">Project Manager</div>
                <div className="modal-field-value">
                  {users.find(u => u.name === formData.project_manager)?.full_name || formData.project_manager}
                </div>
              </div>
              
              <div className="modal-field">
                <div className="modal-field-label">Status</div>
                <div className="modal-field-value">
                  <span className={getStatusBadgeClass(formData.status)}>
                    {formData.status}
                  </span>
                </div>
              </div>
              
              {(formData.start_date || formData.end_date) && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  {formData.start_date && (
                    <div className="modal-field">
                      <div className="modal-field-label">Start Date</div>
                      <div className="modal-field-value">{new Date(formData.start_date).toLocaleDateString()}</div>
                    </div>
                  )}
                  {formData.end_date && (
                    <div className="modal-field">
                      <div className="modal-field-label">End Date</div>
                      <div className="modal-field-value">{new Date(formData.end_date).toLocaleDateString()}</div>
                    </div>
                  )}
                </div>
              )}
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="modal-field">
                  <div className="modal-field-label">Region</div>
                  <div className="modal-field-value">{formData.region}</div>
                </div>
                <div className="modal-field">
                  <div className="modal-field-label">District</div>
                  <div className="modal-field-value">{formData.district}</div>
                </div>
              </div>
              
              {formData.description && (
                <div className="modal-field">
                  <div className="modal-field-label">Description</div>
                  <div className="modal-field-value">{formData.description}</div>
                </div>
              )}
            </div>
            
            <div className="modal-actions">
              <button
                onClick={handleCancel}
                className="btn btn-secondary"
                disabled={isSubmitting}
              >
                <span>↩</span> Go Back
              </button>
              <button
                onClick={handleSubmit}
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner"></span>
                    Creating...
                  </>
                ) : (
                  <>
                    <span>✅</span>
                    Confirm & Create
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Project;