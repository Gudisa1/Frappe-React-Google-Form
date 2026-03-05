// import React, { useEffect, useState } from "react";
// import { useLocation ,useNavigate} from "react-router-dom";
// import { getProjectSubmissions,deleteSubmission  } from "../../api/pm";
// import "./SubmissionList.css";
// const SubmissionList = () => {
//   const location = useLocation();
//   // const projectName = location.state?.projectName;
//   const projectName =
//     location.state?.projectName || localStorage.getItem("selectedProject");
//   const navigate = useNavigate();

//   const [submissions, setSubmissions] = useState([]);

//   useEffect(() => {
//     const loadSubmissions = async () => {
//       try {
//         const data = await getProjectSubmissions(projectName);
//         setSubmissions(data);
//         console.log("Fetched submissions:", data);
//       } catch (err) {
//         console.error(err);
//       }
//     };

//     if (projectName) loadSubmissions();
//   }, [projectName]);
// const handleDelete = async (submissionName) => {
//     if (!window.confirm("Are you sure you want to delete this submission?")) return;

//     try {
//       await deleteSubmission(submissionName);
//       // remove from local state so UI updates immediately
//       setSubmissions(submissions.filter((sub) => sub.name !== submissionName));
//       alert("Submission deleted successfully");
//     } catch (err) {
//       console.error(err);
//       alert("Failed to delete submission");
//     }
//   };
//   return (
//     <div>
//     <h2>Submissions for {projectName}</h2>

//    {submissions.map((sub) => (
//   <div key={sub.name}

//     style={{
//       border: "1px solid gray",
//       padding: "10px",
//       marginBottom: "10px",
//       cursor: "default"
//     }}
//   >
//     <h4>{sub.reporting_form}</h4>
//     <p>Project: {sub.project}</p>
//     <p>Submitted By: {sub.submitted_by || sub.owner}</p>
//     <p>Status: {sub.status}</p>
//     <p>Submitted At: {sub.creation}</p>
    
//          <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
//       <button
//         onClick={() =>
//           navigate("/submission-detail", {
//             state: { submissionName: sub.name },
//           })
//         }
//       >
//         View Details
//       </button>

//       <button
//         onClick={(e) => {
//           e.stopPropagation(); // prevent navigating when deleting
//           handleDelete(sub.name);
//         }}
//       >
//         Delete
//       </button>
//     </div>


//   </div>
// ))}
//   </div>
//   );
// };

// export default SubmissionList;

import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getProjectSubmissions, deleteSubmission } from "../../api/pm";
import { 
  FileText, 
  Calendar, 
  User, 
  Clock, 
  Briefcase,
  Eye,
  Trash2,
  AlertTriangle,
  CheckCircle,
  XCircle,
  AlertOctagon,
  Shield,
  Lock
} from 'lucide-react';
import './SubmissionList.css';

const SubmissionList = () => {
  const location = useLocation();
  const projectName = location.state?.projectName || localStorage.getItem("selectedProject");
  const navigate = useNavigate();

  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState({ 
    show: false, 
    step: 1, // 1: initial warning, 2: final confirmation
    submissionName: null,
    submissionTitle: null 
  });
  const [deleteInProgress, setDeleteInProgress] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  useEffect(() => {
    const loadSubmissions = async () => {
      setLoading(true);
      try {
        const data = await getProjectSubmissions(projectName);
        setSubmissions(data);
      } catch (err) {
        console.error(err);
        // Show error toast
        showNotification("Failed to load submissions", "error");
      } finally {
        setLoading(false);
      }
    };

    if (projectName) loadSubmissions();
  }, [projectName]);

  // Show notification function
  const showNotification = (message, type = "success") => {
    const notification = document.createElement('div');
    notification.className = `notification-toast ${type}`;
    notification.innerHTML = `
      <div class="notification-icon">${type === "success" ? "✓" : "⚠️"}</div>
      <div class="notification-content">
        <div class="notification-message">${message}</div>
      </div>
    `;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
  };

  // Handle delete initiation (step 1)
  const initiateDelete = (sub) => {
    setSelectedSubmission(sub);
    setDeleteModal({ 
      show: true, 
      step: 1, 
      submissionName: sub.name,
      submissionTitle: sub.reporting_form 
    });
  };

  // Proceed to step 2
  const proceedToStep2 = () => {
    setDeleteModal(prev => ({ ...prev, step: 2 }));
  };

  // Go back to step 1
  const backToStep1 = () => {
    setDeleteModal(prev => ({ ...prev, step: 1 }));
  };

  // Close modal
  const closeModal = () => {
    setDeleteModal({ show: false, step: 1, submissionName: null, submissionTitle: null });
    setSelectedSubmission(null);
    setDeleteInProgress(false);
  };

  // Handle actual deletion
  const handleDelete = async () => {
    setDeleteInProgress(true);
    try {
      await deleteSubmission(deleteModal.submissionName);
      
      // Update local state
      setSubmissions(submissions.filter((sub) => sub.name !== deleteModal.submissionName));
      
      // Show success notification
      showNotification("Submission deleted successfully", "success");
      
      // Close modal
      closeModal();
    } catch (err) {
      console.error(err);
      showNotification(err.message || "Failed to delete submission", "error");
      setDeleteInProgress(false);
    }
  };

  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'submitted':
        return 'submitted';
      case 'pending':
        return 'pending';
      case 'draft':
        return 'draft';
      default:
        return 'pending';
    }
  };

  const getStatusIcon = (status) => {
    switch(status?.toLowerCase()) {
      case 'submitted':
        return <CheckCircle size={14} />;
      case 'pending':
        return <Clock size={14} />;
      case 'draft':
        return <FileText size={14} />;
      default:
        return <AlertCircle size={14} />;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const stats = {
    total: submissions.length,
    submitted: submissions.filter(s => s.status === 'submitted').length,
    pending: submissions.filter(s => s.status === 'pending').length,
    draft: submissions.filter(s => s.status === 'draft').length
  };

  return (
    <div className="submission-list">
      {/* Header */}
      <div className="list-header">
        <div className="header-left">
          <h1>Submissions</h1>
          <div className="project-badge">
            <Briefcase size={16} />
            {projectName}
          </div>
        </div>
        <div className="header-right">
          <div className="date-badge">
            <Calendar size={14} />
            {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </div>
        </div>
      </div>

      {/* Stats Bar - Enhanced */}
      <div className="stats-bar">
        <div className="stat-block">
          <div className="stat-label">Total Submissions</div>
          <div className="stat-number">{stats.total}</div>
        </div>
        <div className="stat-block">
          <div className="stat-label">Submitted</div>
          <div className="stat-number">{stats.submitted}</div>
        </div>
        <div className="stat-block">
          <div className="stat-label">Pending</div>
          <div className="stat-number">{stats.pending}</div>
        </div>
        <div className="stat-block">
          <div className="stat-label">Draft</div>
          <div className="stat-number">{stats.draft}</div>
        </div>
      </div>

      {/* Submissions Grid */}
      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading submissions...</p>
        </div>
      ) : submissions.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            <FileText size={40} />
          </div>
          <h3>No submissions yet</h3>
          <p>Submissions for {projectName} will appear here</p>
        </div>
      ) : (
        <div className="submissions-grid">
          {submissions.map((sub) => (
            <div key={sub.name} className="submission-card">
              {/* Status Indicator with Icon */}
              <div className={`status-indicator ${getStatusColor(sub.status)}`}>
                {getStatusIcon(sub.status)}
              </div>

              {/* Main Content */}
              <div className="submission-content">
                <div className="submission-header">
                  <h3>{sub.reporting_form}</h3>
                  <span className="form-id">ID: {sub.name.slice(-8)}</span>
                </div>

                <div className="submission-meta">
                  <div className="meta-item">
                    <User size={14} />
                    <span>{sub.submitted_by || sub.owner}</span>
                  </div>
                  <div className="meta-item">
                    <Briefcase size={14} />
                    <span>{sub.project}</span>
                  </div>
                </div>

                <div className="submission-time">
                  <Calendar size={12} />
                  <span>{formatDate(sub.creation)}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="submission-actions">
                <button
                  className="action-button view"
                  onClick={() => navigate("/submission-detail", {
                    state: { submissionName: sub.name }
                  })}
                  title="View Details"
                >
                  <Eye size={16} />
                  <span>View</span>
                </button>
                <button
                  className="action-button delete"
                  onClick={() => initiateDelete(sub)}
                  title="Delete Submission"
                >
                  <Trash2 size={16} />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Serious Delete Confirmation Modal - Step 1 */}
      {deleteModal.show && deleteModal.step === 1 && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content warning-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-icon warning">
              <AlertOctagon size={48} />
            </div>
            
            <h2>Delete Submission</h2>
            
            <div className="warning-box">
              <AlertTriangle size={20} />
              <p>This action is <strong>irreversible</strong> and will permanently remove this submission.</p>
            </div>

            <div className="submission-preview">
              <div className="preview-item">
                <span className="preview-label">Form:</span>
                <span className="preview-value">{deleteModal.submissionTitle}</span>
              </div>
              <div className="preview-item">
                <span className="preview-label">ID:</span>
                <span className="preview-value">{deleteModal.submissionName?.slice(-8)}</span>
              </div>
            </div>

            <div className="security-notice">
              <Shield size={16} />
              <span>This action requires additional confirmation</span>
            </div>

            <div className="modal-actions">
              <button 
                className="modal-button secondary"
                onClick={closeModal}
                disabled={deleteInProgress}
              >
                Cancel
              </button>
              <button 
                className="modal-button warning"
                onClick={proceedToStep2}
                disabled={deleteInProgress}
              >
                Continue to Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Serious Delete Confirmation Modal - Step 2 (Final) */}
      {deleteModal.show && deleteModal.step === 2 && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content danger-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-icon danger">
              <AlertTriangle size={48} />
            </div>
            
            <h2>Final Confirmation Required</h2>
            
            <div className="danger-box">
              <Lock size={20} />
              <p>You are about to permanently delete this submission. This cannot be undone.</p>
            </div>

            <div className="confirmation-input">
              <p>Please type <strong>DELETE</strong> to confirm:</p>
              <input 
                type="text" 
                id="confirmDelete"
                placeholder="Type DELETE here"
                onChange={(e) => {
                  const confirmBtn = document.querySelector('.modal-button.danger');
                  if (confirmBtn) {
                    confirmBtn.disabled = e.target.value !== 'DELETE';
                  }
                }}
                autoFocus
              />
            </div>

            <div className="modal-actions">
              <button 
                className="modal-button secondary"
                onClick={backToStep1}
                disabled={deleteInProgress}
              >
                Back
              </button>
              <button 
                className="modal-button danger"
                onClick={handleDelete}
                disabled={deleteInProgress}
                id="finalDeleteBtn"
              >
                {deleteInProgress ? (
                  <>
                    <span className="spinner-small"></span>
                    Deleting...
                  </>
                ) : (
                  "Permanently Delete"
                )}
              </button>
            </div>

            <p className="legal-note">
              This action is logged and cannot be reversed. Please ensure you have the necessary permissions.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubmissionList;