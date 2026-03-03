// import React, { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import { fetchUsersWithRoles, updateProject ,getProject} from "../../api/datacollection";

// const ProjectEdit = () => {
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
//   const { projectName } = useParams(); // <-- This grabs "Addis" from URL



//   // Load project data
//   useEffect(() => {
//     async function loadProject() {
//       try {
//         console.log(`Fetching project: ${projectName}`);
        
//         const result = await getProject(projectName);

        
//         console.log("Fetched project data:", result);

//         if (result && result.data) {
//           setFormData({
//             project_name: result.data.project_name || "",
//             project_code: result.data.project_code || "",
//             project_manager: result.data.project_manager || "",
//             status: result.data.status || "Active",
//             start_date: result.data.start_date || "",
//             end_date: result.data.end_date || "",
//             region: result.data.region || "",
//             district: result.data.district || "",
//             description: result.data.description || ""
//           });
//         } else {
//           throw new Error(result.exception || "Failed to fetch project");
//         }
//       } catch (err) {
//         console.error("Error loading project:", err);
//         setErrors({ api: err.message });
//       }
//     }

//     loadProject();
//   }, [projectName]);

//   // Load Project Managers
//   useEffect(() => {
//     fetchUsersWithRoles("Project Manager")
//       .then((data) => {
//         console.log("Fetched Project Managers:", data);
//         setUsers(data);
//       })
//       .catch((err) => console.error("Error fetching users:", err));
//   }, []);

//   // Input change
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     console.log("Input changed:", name, value);
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   // Validation
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

//   // Submit
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setSuccessMessage("");
//     if (!validate()) return;

//     try {
//       const updated = await updateProject(projectName, formData);
//       console.log("Project updated:", updated);
//       setSuccessMessage(`Project updated successfully: ${updated.name}`);
//     } catch (err) {
//       console.error("Error updating project:", err);
//       setErrors({ api: err.message });
//     }
//   };

//   return (
//     <div style={{ maxWidth: "600px", margin: "20px auto" }}>
//       <h2>Edit Project: {projectName}</h2>
//       {errors.api && <p style={{ color: "red" }}>{errors.api}</p>}
//       {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}

//       <form onSubmit={handleSubmit}>
//         <div>
//           <label>Project Name *</label>
//           <input type="text" name="project_name" value={formData.project_name} onChange={handleChange} disabled  />
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

//         <button type="submit" style={{ marginTop: "10px" }}>Update Project</button>
//       </form>
//     </div>
//   );
// };

// export default ProjectEdit;


import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchUsersWithRoles, updateProject, getProject } from "../../api/datacollection";
import "./ProjectEdit.css";

const ProjectEdit = () => {
  const navigate = useNavigate();
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
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { projectName } = useParams();

  // Load project data
  useEffect(() => {
    async function loadProject() {
      try {
        setLoading(true);
        console.log(`Fetching project: ${projectName}`);
        
        const result = await getProject(projectName);
        
        console.log("Fetched project data:", result);

        if (result && result.data) {
          setFormData({
            project_name: result.data.project_name || "",
            project_code: result.data.project_code || "",
            project_manager: result.data.project_manager || "",
            status: result.data.status || "Active",
            start_date: result.data.start_date || "",
            end_date: result.data.end_date || "",
            region: result.data.region || "",
            district: result.data.district || "",
            description: result.data.description || ""
          });
        } else {
          throw new Error(result.exception || "Failed to fetch project");
        }
      } catch (err) {
        console.error("Error loading project:", err);
        setErrors({ api: err.message });
      } finally {
        setLoading(false);
      }
    }

    loadProject();
  }, [projectName]);

  // Load Project Managers
  useEffect(() => {
    fetchUsersWithRoles("Project Manager")
      .then((data) => {
        console.log("Fetched Project Managers:", data);
        setUsers(data);
      })
      .catch((err) => console.error("Error fetching users:", err));
  }, []);

  // Input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log("Input changed:", name, value);
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  // Validation
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

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const updated = await updateProject(projectName, formData);
      console.log("Project updated:", updated);
      setSuccessMessage(`✨ Project "${updated.name}" has been successfully updated`);
      
      // Auto-hide success message after 5 seconds
      setTimeout(() => setSuccessMessage(""), 5000);
    } catch (err) {
      console.error("Error updating project:", err);
      setErrors({ api: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Cancel handler
  const handleCancel = () => {
    navigate("/mr-dashboard/projectslist");
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

  if (loading) {
    return (
      <div className="project-edit-container">
        <div className="edit-card">
          <div className="loading-container">
            <div className="spinner"></div>
            <p style={{ marginTop: '20px', color: 'var(--text-secondary)' }}>
              Loading project details...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="project-edit-container">
      <div className="edit-card">
        <div className="edit-header">
          <div className="header-content">
            <div className="edit-title">
              Edit Project
              <span className="project-badge">{projectName}</span>
            </div>
            <p className="edit-subtitle">Modify project details and settings</p>
          </div>
          
          <div className="header-actions">
            <button className="header-btn" onClick={handleCancel}>
              <span>↩</span> Back to List
            </button>
          </div>
        </div>

        <div className="edit-form-container">
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

          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              {/* Project Name - Read Only */}
              <div className="form-group">
                <label className="form-label">
                  Project Name
                  <span className="required-star">✦</span>
                  <span className="readonly-indicator">Read Only</span>
                </label>
                <input
                  type="text"
                  name="project_name"
                  value={formData.project_name}
                  onChange={handleChange}
                  className={`form-input ${errors.project_name ? 'error' : ''}`}
                  disabled
                  placeholder="Project name cannot be changed"
                />
                {errors.project_name && (
                  <div className="error-message">{errors.project_name}</div>
                )}
                <div className="field-hint">Project name cannot be modified after creation</div>
              </div>

              {/* Project Code */}
              <div className="form-group">
                <label className="form-label">
                  Project Code
                  <span className="required-star">✦</span>
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
                  <span className="required-star">✦</span>
                </label>
                <select
                  name="project_manager"
                  value={formData.project_manager}
                  onChange={handleChange}
                  className={`form-select ${errors.project_manager ? 'error' : ''}`}
                >
                  <option value="">Select Project Manager</option>
                  {users.map((user) => (
                    <option key={user.email} value={user.name}>
                      <div className="user-option">
                        <span>{user.full_name || user.email}</span>
                        {user.roles && user.roles.length > 0 && (
                          <span className="user-badge">{user.roles[0]}</span>
                        )}
                      </div>
                    </option>
                  ))}
                </select>
                {errors.project_manager && (
                  <div className="error-message">{errors.project_manager}</div>
                )}
              </div>

              {/* Status with Badge */}
              <div className="form-group">
                <label className="form-label">Status</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="form-select"
                    style={{ flex: 1 }}
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
                  <span className="required-star">✦</span>
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
                  <span className="required-star">✦</span>
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
                <div className="char-counter">
                  <span>Project description</span>
                  <span>{formData.description.length}/500 characters</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="button-group">
              <button
                type="button"
                onClick={handleCancel}
                className="btn btn-secondary"
                disabled={isSubmitting}
              >
                <span>↩</span> Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner"></span>
                    Updating...
                  </>
                ) : (
                  <>
                    <span>💾</span>
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProjectEdit;