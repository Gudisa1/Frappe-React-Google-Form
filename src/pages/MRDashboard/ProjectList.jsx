// import React, { useEffect, useState } from "react";
// import { getProjects,deleteProject } from "../../api/datacollection";
// import { useNavigate } from "react-router-dom";
// import "./ProjectList.css"; // Import the independent stylesheet

// const ProjectList = () => {
//   const [projects, setProjects] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   useEffect(() => {
   

//     loadProjects();
//   }, []);

//    const loadProjects = async () => {
//       try {
//         setLoading(true);
//         const data = await getProjects();
//         console.log("Projects loaded into state:", data);
//         setProjects(data.data || []); // Ensure we set an array even if data is undefined
//       } catch (err) {
//         console.error("Error loading projects:", err);
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     }

//     const handleEdit=(projectName) => {
//         console.log("Navigating to edit project:", projectName);
//       navigate(`/mr-dashboard/projects/${projectName}/edit`);
//     }
//     const handleDelete = async (projectName) => {
//     if (!window.confirm(`Are you sure you want to delete project "${projectName}"?`)) return;

//     try {
//       await deleteProject(projectName);
//       console.log(`Project ${projectName} deleted, refreshing list...`);
//       // Remove deleted project from state
//       setProjects((prev) => prev.filter((p) => p.name !== projectName));
//     } catch (error) {
//       console.error("Failed to delete project:", error);
//       setError(`Failed to delete project: ${error.message}`);
//     }
//   };
//   if (loading) return <p>Loading projects...</p>;
//   if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

//   return (
//     <div style={{ maxWidth: "1000px", margin: "20px auto" }}>
//       <h2>Project List</h2>
//       <table border="1" cellPadding="8" style={{ borderCollapse: "collapse", width: "100%" }}>
//         <thead>
//           <tr>
//             <th>Name</th>
//             <th>Code</th>
//             <th>Project Manager</th>
//             <th>Status</th>
//             <th>Region</th>
//             <th>District</th>
//             <th>Start Date</th>
//             <th>End Date</th>
//             <th>Description</th>
//           </tr>
//         </thead>
//         <tbody>
//           {projects.map((p) => (
//             <tr key={p.name}>
//               <td>{p.project_name}</td>
//               <td>{p.project_code}</td>
//               <td>{p.project_manager}</td>
//               <td>{p.status}</td>
//               <td>{p.region}</td>
//               <td>{p.district}</td>
//               <td>{p.start_date || "-"}</td>
//               <td>{p.end_date || "-"}</td>
//               <td>{p.description || "-"}</td>
//                <td>
//                 <button onClick={() => handleEdit(p.project_name)}>Edit</button>{" "}
//                 <button onClick={() => handleDelete(p.name)} style={{ color: "red" }}>
//                   Delete
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default ProjectList;
import React, { useEffect, useState } from "react";
import { getProjects, deleteProject } from "../../api/datacollection";
import { useNavigate } from "react-router-dom";
import "./ProjectList.css";

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  
  // Delete confirmation states
  const [showFirstDeleteModal, setShowFirstDeleteModal] = useState(false);
  const [showSecondDeleteModal, setShowSecondDeleteModal] = useState(false);
  const [showLockErrorModal, setShowLockErrorModal] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [countdown, setCountdown] = useState(15);
  const [countdownInterval, setCountdownInterval] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [lockError, setLockError] = useState("");
  
  const itemsPerPage = 10;
  const navigate = useNavigate();

  useEffect(() => {
    loadProjects();
    
    // Cleanup countdown on unmount
    return () => {
      if (countdownInterval) {
        clearInterval(countdownInterval);
      }
    };
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const data = await getProjects();
      console.log("Projects loaded into state:", data);
      setProjects(data.data || []);
    } catch (err) {
      console.error("Error loading projects:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (projectName) => {
    console.log("Navigating to edit project:", projectName);
    navigate(`/mr-dashboard/projects/${projectName}/edit`);
  };

  const handleView = (project) => {
    console.log("Viewing project:", project);
  };

  // First delete confirmation click
  const handleDeleteClick = (projectName) => {
    setProjectToDelete(projectName);
    setShowFirstDeleteModal(true);
    setRetryCount(0);
    setLockError("");
  };

  // Proceed to second confirmation with countdown
  const handleFirstConfirm = () => {
    setShowFirstDeleteModal(false);
    setShowSecondDeleteModal(true);
    setCountdown(15);
    
    // Start countdown
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          // Auto-execute delete when countdown reaches 0
          handleConfirmDelete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    setCountdownInterval(interval);
  };

  // Final delete confirmation with retry logic
  const handleConfirmDelete = async (retry = false) => {
    // Clear countdown interval
    if (countdownInterval) {
      clearInterval(countdownInterval);
      setCountdownInterval(null);
    }
    
    if (!projectToDelete) return;

    // Close the second modal
    setShowSecondDeleteModal(false);
    
    // Show deleting state
    setIsDeleting(true);
    setLockError("");
    
    try {
      await deleteProject(projectToDelete);
      console.log(`Project ${projectToDelete} deleted successfully`);
      
      // Update the projects list
      setProjects((prev) => prev.filter((p) => p.name !== projectToDelete));
      setProjectToDelete(null);
      setRetryCount(0);
      
      // Show success message (you could add a toast here)
      
    } catch (error) {
      console.error("Failed to delete project:", error);
      
      // Check if it's a lock error
      if (error.message.includes("being modified by another user") || 
          error.message.includes("QueryTimeoutError") ||
          error.message.includes("locked")) {
        
        setLockError(error.message);
        
        // If we haven't retried too many times, offer retry
        if (retryCount < 3) {
          setShowLockErrorModal(true);
        } else {
          // Max retries exceeded, show error
          setError(`Failed to delete after ${retryCount} attempts. Please try again later.`);
        }
      } else {
        // Other type of error
        setError(`Failed to delete project: ${error.message}`);
      }
    } finally {
      setIsDeleting(false);
    }
  };

  // Retry deletion with exponential backoff
  const handleRetryDelete = async () => {
    setShowLockErrorModal(false);
    setIsDeleting(true);
    
    // Increment retry count
    const newRetryCount = retryCount + 1;
    setRetryCount(newRetryCount);
    
    // Exponential backoff: wait longer between each retry
    const backoffTime = Math.min(1000 * Math.pow(2, newRetryCount), 10000); // Max 10 seconds
    
    console.log(`Retry attempt ${newRetryCount} after ${backoffTime}ms`);
    
    // Wait before retrying
    await new Promise(resolve => setTimeout(resolve, backoffTime));
    
    // Try again
    try {
      await deleteProject(projectToDelete);
      console.log(`Project ${projectToDelete} deleted successfully on retry ${newRetryCount}`);
      
      setProjects((prev) => prev.filter((p) => p.name !== projectToDelete));
      setProjectToDelete(null);
      setRetryCount(0);
      
    } catch (error) {
      console.error(`Retry ${newRetryCount} failed:`, error);
      
      if (newRetryCount < 3) {
        // Show lock error modal again for another retry
        setLockError(error.message);
        setShowLockErrorModal(true);
      } else {
        // Max retries exceeded
        setError(`Unable to delete project after multiple attempts. Please try again later.`);
        setProjectToDelete(null);
        setRetryCount(0);
      }
    } finally {
      setIsDeleting(false);
    }
  };

  // Cancel delete at any stage
  const handleCancelDelete = () => {
    // Clear countdown interval
    if (countdownInterval) {
      clearInterval(countdownInterval);
      setCountdownInterval(null);
    }
    
    setShowFirstDeleteModal(false);
    setShowSecondDeleteModal(false);
    setShowLockErrorModal(false);
    setProjectToDelete(null);
    setCountdown(15);
    setRetryCount(0);
    setLockError("");
  };

  // Force delete option (for admins maybe)
  const handleForceDelete = async () => {
    setShowLockErrorModal(false);
    setIsDeleting(true);
    
    try {
      // You might need a special API endpoint for force delete
      // For now, we'll try one more time with a force flag if your API supports it
      await deleteProject(projectToDelete, { force: true });
      
      console.log(`Project ${projectToDelete} force deleted successfully`);
      setProjects((prev) => prev.filter((p) => p.name !== projectToDelete));
      setProjectToDelete(null);
      setRetryCount(0);
      
    } catch (error) {
      console.error("Force delete failed:", error);
      setError(`Force delete failed: ${error.message}. Please try again later.`);
    } finally {
      setIsDeleting(false);
    }
  };

  // Filter projects based on search and status
  const filteredProjects = projects.filter((project) => {
    const projectName = (project.name || "").toLowerCase();
    const projectCode = (project.project_code || "").toLowerCase();
    const projectManager = (project.project_manager || "").toLowerCase();
    const region = (project.region || "").toLowerCase();
    const district = (project.district || "").toLowerCase();
    const description = (project.description || "").toLowerCase();
    
    const searchLower = searchTerm.toLowerCase().trim();
    
    const matchesSearch = searchLower === "" || 
      projectName.includes(searchLower) ||
      projectCode.includes(searchLower) ||
      projectManager.includes(searchLower) ||
      region.includes(searchLower) ||
      district.includes(searchLower) ||
      description.includes(searchLower);
    
    const projectStatus = (project.status || "").toLowerCase();
    const matchesStatus = statusFilter === "all" || 
      projectStatus === statusFilter.toLowerCase();
    
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  const paginatedProjects = filteredProjects.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  // Stats
  const totalProjects = projects.length;
  const activeProjects = projects.filter(p => p.status?.toLowerCase() === "active").length;
  const completedProjects = projects.filter(p => p.status?.toLowerCase() === "completed").length;

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

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  if (loading) {
    return (
      <div className="project-list-container">
        <div className="projects-card">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading projects...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="project-list-container">
        <div className="projects-card">
          <div className="error-container">
            <div className="error-icon">⚠️</div>
            <div className="error-message">Error: {error}</div>
            <button 
              className="btn btn-secondary" 
              onClick={() => {
                setError("");
                loadProjects();
              }}
              style={{ marginTop: '20px' }}
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="project-list-container">
      <div className="projects-card">
        <div className="projects-header">
          <div className="header-content">
            <h1 className="projects-title">Project Portfolio</h1>
            <p className="projects-subtitle">Manage and monitor all your projects</p>
          </div>
          
          <div className="projects-stats">
            <div className="stat-card">
              <div className="stat-icon">📊</div>
              <div className="stat-info">
                <span className="stat-value">{totalProjects}</span>
                <span className="stat-label">Total</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">✅</div>
              <div className="stat-info">
                <span className="stat-value">{activeProjects}</span>
                <span className="stat-label">Active</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🎯</div>
              <div className="stat-info">
                <span className="stat-value">{completedProjects}</span>
                <span className="stat-label">Completed</span>
              </div>
            </div>
          </div>
        </div>

        <div className="projects-content">
          <div className="filter-bar">
            <div className="search-box">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                className="search-input"
                placeholder="Search projects by name, code, manager..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="filter-actions">
              <button
                className={`filter-btn ${statusFilter === "all" ? "active" : ""}`}
                onClick={() => setStatusFilter("all")}
              >
                All
              </button>
              <button
                className={`filter-btn ${statusFilter === "active" ? "active" : ""}`}
                onClick={() => setStatusFilter("active")}
              >
                Active
              </button>
              <button
                className={`filter-btn ${statusFilter === "completed" ? "active" : ""}`}
                onClick={() => setStatusFilter("completed")}
              >
                Completed
              </button>
            </div>
          </div>

          {filteredProjects.length === 0 ? (
            <div className="empty-container">
              <div className="empty-icon">📭</div>
              <h3 className="empty-title">No projects found</h3>
              <p className="empty-description">
                {searchTerm || statusFilter !== "all" 
                  ? "Try adjusting your search or filters" 
                  : "Get started by creating your first project"}
              </p>
              {!searchTerm && statusFilter === "all" && (
                <button 
                  className="empty-btn"
                  onClick={() => navigate("/mr-dashboard/projects/create")}
                >
                  <span>✨</span> Create New Project
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="table-container">
                <table className="projects-table">
                  <thead>
                    <tr>
                      <th>Project Name</th>
                      <th>Code</th>
                      <th>Project Manager</th>
                      <th>Status</th>
                      <th>Region</th>
                      <th>District</th>
                      <th>Start Date</th>
                      <th>End Date</th>
                      <th>Description</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedProjects.map((p) => (
                      <tr key={p.name}>
                        <td>
                          <div className="truncate-text" title={p.project_name}>
                            {p.project_name}
                          </div>
                        </td>
                        <td>
                          <code style={{ color: "var(--accent-secondary)" }}>
                            {p.project_code}
                          </code>
                        </td>
                        <td>{p.project_manager}</td>
                        <td>
                          <span className={getStatusBadgeClass(p.status)}>
                            {p.status || "Unknown"}
                          </span>
                        </td>
                        <td>{p.region}</td>
                        <td>{p.district}</td>
                        <td className="date-cell">{formatDate(p.start_date)}</td>
                        <td className="date-cell">{formatDate(p.end_date)}</td>
                        <td>
                          <div className="truncate-text" title={p.description}>
                            {p.description || "-"}
                          </div>
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button
                              className="action-btn view"
                              onClick={() => handleView(p)}
                              title="View Details"
                            >
                              👁️
                            </button>
                            <button
                              className="action-btn edit"
                              onClick={() => handleEdit(p.project_name)}
                              title="Edit Project"
                            >
                              ✏️
                            </button>
                            <button
                              className="action-btn delete"
                              onClick={() => handleDeleteClick(p.name)}
                              title="Delete Project"
                            >
                              🗑️
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {totalPages > 1 && (
                <div className="pagination">
                  <div className="pagination-info">
                    Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                    {Math.min(currentPage * itemsPerPage, filteredProjects.length)} of{" "}
                    {filteredProjects.length} projects
                  </div>
                  <div className="pagination-controls">
                    <button
                      className="pagination-btn"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      ←
                    </button>
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i + 1}
                        className={`pagination-btn ${currentPage === i + 1 ? "active" : ""}`}
                        onClick={() => setCurrentPage(i + 1)}
                      >
                        {i + 1}
                      </button>
                    ))}
                    <button
                      className="pagination-btn"
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                    >
                      →
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* First Delete Confirmation Modal */}
      {showFirstDeleteModal && (
        <div className="modal-overlay" onClick={handleCancelDelete}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-icon" style={{ background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(217, 119, 6, 0.2) 100%)', borderColor: 'var(--warning)' }}>
                ⚠️
              </div>
              <h2 className="modal-title">Confirm Delete</h2>
            </div>
            
            <div className="modal-body">
              <p className="modal-text">
                Are you sure you want to delete the project <strong>"{projectToDelete}"</strong>?
              </p>
              <p className="modal-text" style={{ color: 'var(--warning)', marginTop: '10px' }}>
                This action cannot be undone. Please confirm to proceed.
              </p>
            </div>
            
            <div className="modal-actions">
              <button
                onClick={handleCancelDelete}
                className="btn btn-secondary"
              >
                <span>↩</span> Cancel
              </button>
              <button
                onClick={handleFirstConfirm}
                className="btn btn-warning"
                style={{ 
                  background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                  color: 'white'
                }}
              >
                <span>⚠️</span>
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Second Delete Confirmation Modal with Countdown */}
      {showSecondDeleteModal && (
        <div className="modal-overlay" onClick={handleCancelDelete}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-icon" style={{ 
                background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(220, 38, 38, 0.2) 100%)',
                borderColor: 'var(--error)',
                animation: countdown <= 5 ? 'pulse 1s infinite' : 'none'
              }}>
                ⚠️
              </div>
              <h2 className="modal-title">Final Confirmation</h2>
            </div>
            
            <div className="modal-body">
              <p className="modal-text">
                This is your last chance! Deleting <strong>"{projectToDelete}"</strong> is permanent.
              </p>
              
              {/* Countdown Timer */}
              <div style={{
                background: 'var(--dark-surface-2)',
                borderRadius: '20px',
                padding: '25px',
                marginTop: '20px',
                textAlign: 'center',
                border: `2px solid ${countdown <= 5 ? 'var(--error)' : 'var(--warning)'}`,
                animation: countdown <= 5 ? 'pulse 1s infinite' : 'none'
              }}>
                <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '10px' }}>
                  Auto-deleting in
                </div>
                <div style={{
                  fontSize: '48px',
                  fontWeight: 'bold',
                  color: countdown <= 5 ? 'var(--error)' : 'var(--warning)',
                  lineHeight: 1
                }}>
                  {countdown}s
                </div>
                <div style={{
                  width: '100%',
                  height: '6px',
                  background: 'var(--dark-surface-3)',
                  borderRadius: '3px',
                  marginTop: '15px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${(countdown / 15) * 100}%`,
                    height: '100%',
                    background: countdown <= 5 ? 'var(--error)' : 'var(--warning)',
                    transition: 'width 1s linear',
                    borderRadius: '3px'
                  }} />
                </div>
              </div>
            </div>
            
            <div className="modal-actions">
              <button
                onClick={handleCancelDelete}
                className="btn btn-secondary"
                disabled={isDeleting}
              >
                <span>↩</span> Cancel & Stop Timer
              </button>
              <button
                onClick={() => handleConfirmDelete(false)}
                className="btn btn-danger"
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <span className="spinner"></span>
                    Deleting...
                  </>
                ) : (
                  <>
                    <span>🗑️</span>
                    Delete Permanently
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lock Error Modal with Retry Options */}
      {showLockErrorModal && (
        <div className="modal-overlay" onClick={handleCancelDelete}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-icon" style={{ 
                background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(220, 38, 38, 0.2) 100%)',
                borderColor: 'var(--error)'
              }}>
                🔒
              </div>
              <h2 className="modal-title">Document Locked</h2>
            </div>
            
            <div className="modal-body">
              <p className="modal-text">
                <strong>"{projectToDelete}"</strong> is currently being modified by another user.
              </p>
              
              <div style={{
                background: 'var(--dark-surface-2)',
                borderRadius: '16px',
                padding: '20px',
                marginTop: '20px',
                border: '1px solid var(--dark-border)'
              }}>
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '10px' }}>
                  Error details:
                </p>
                <p style={{ 
                  color: 'var(--error)', 
                  fontSize: '13px', 
                  fontFamily: 'monospace',
                  background: 'var(--dark-surface-3)',
                  padding: '10px',
                  borderRadius: '8px',
                  wordBreak: 'break-word'
                }}>
                  {lockError}
                </p>
              </div>
              
              <p style={{ color: 'var(--text-secondary)', marginTop: '20px', fontSize: '14px' }}>
                Retry attempt {retryCount}/3
              </p>
            </div>
            
            <div className="modal-actions" style={{ flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
                <button
                  onClick={handleCancelDelete}
                  className="btn btn-secondary"
                  style={{ flex: 1 }}
                  disabled={isDeleting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleRetryDelete}
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                  disabled={isDeleting || retryCount >= 3}
                >
                  {isDeleting ? (
                    <>
                      <span className="spinner"></span>
                      Retrying...
                    </>
                  ) : (
                    <>
                      <span>↻</span>
                      Retry ({retryCount}/3)
                    </>
                  )}
                </button>
              </div>
              
              {/* Optional: Force delete for admins */}
              <button
                onClick={handleForceDelete}
                className="btn btn-danger"
                style={{ width: '100%' }}
                disabled={isDeleting}
              >
                <span>⚠️</span>
                Force Delete (Admin)
              </button>
              
              <p style={{ 
                fontSize: '11px', 
                color: 'var(--text-tertiary)', 
                textAlign: 'center',
                marginTop: '5px'
              }}>
                Force delete may cause data inconsistency. Use with caution.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Add pulse animation style */}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { 
            opacity: 1;
            box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4);
          }
          50% { 
            opacity: 0.8;
            box-shadow: 0 0 20px 10px rgba(239, 68, 68, 0.2);
          }
        }
      `}</style>
    </div>
  );
};

export default ProjectList;