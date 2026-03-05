// import React, { useEffect, useState } from "react";
// import { useLocation } from "react-router-dom";
// import { getSubmissionDetail } from "../../api/pm";
// import "./SubmissionDetail.css";


// const SubmissionDetail = () => {
//   const location = useLocation();
//   const submissionName = location.state?.submissionName;

//   const [submission, setSubmission] = useState(null);

//   useEffect(() => {
//     const loadSubmission = async () => {
//       try {
//         const data = await getSubmissionDetail(submissionName);

//         // parse form answers
//         if (data.data) {
//           data.parsedData = JSON.parse(data.data);
//         }

//         setSubmission(data);
//         console.log("Submission detail:", data);
//       } catch (err) {
//         console.error(err);
//       }
//     };

//     if (submissionName) loadSubmission();
//   }, [submissionName]);

//   if (!submission) return <p>Loading...</p>;

//   return (
//     <div>
//       <h2>Submission Detail</h2>

//       <p><b>Project:</b> {submission.project}</p>
//       <p><b>Form:</b> {submission.reporting_form}</p>
//       <p><b>Submitted By:</b> {submission.submitted_by}</p>
//       <p><b>Status:</b> {submission.status}</p>
//       <p><b>Created:</b> {submission.creation}</p>

//       <h3>Form Answers</h3>

//       {submission.parsedData &&
//         Object.entries(submission.parsedData).map(([key, value]) => (
//           <div key={key}>
//             <strong>{key}</strong>: {value}
//           </div>
//         ))}
//     </div>
//   );
// };

// export default SubmissionDetail;

import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getSubmissionDetail } from "../../api/pm";
import { 
  Briefcase, 
  FileText, 
  User, 
  Calendar,
  Clock,
  ArrowLeft,
  CheckCircle,
  XCircle,
  HelpCircle,
  Hash,
  Type,
  Mail,
  Phone,
  MapPin,
  Link as LinkIcon
} from 'lucide-react';
import "./SubmissionDetail.css";

const SubmissionDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const submissionName = location.state?.submissionName;

  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSubmission = async () => {
      setLoading(true);
      try {
        const data = await getSubmissionDetail(submissionName);

        // parse form answers
        if (data.data) {
          data.parsedData = JSON.parse(data.data);
        }

        setSubmission(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (submissionName) loadSubmission();
  }, [submissionName]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getFieldIcon = (key, value) => {
    if (typeof value === 'number') return <Hash size={16} />;
    if (key.toLowerCase().includes('email')) return <Mail size={16} />;
    if (key.toLowerCase().includes('phone')) return <Phone size={16} />;
    if (key.toLowerCase().includes('address')) return <MapPin size={16} />;
    if (key.toLowerCase().includes('link') || key.toLowerCase().includes('url')) return <LinkIcon size={16} />;
    if (typeof value === 'boolean') return value ? <CheckCircle size={16} /> : <XCircle size={16} />;
    return <Type size={16} />;
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
        return '';
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (!submission) {
    return (
      <div className="submission-detail">
        <div className="empty-state">
          <div className="empty-icon">
            <FileText size={30} />
          </div>
          <h3>Submission not found</h3>
          <p>The submission you're looking for doesn't exist</p>
          <button className="back-button" onClick={() => navigate(-1)}>
            <ArrowLeft size={16} />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="submission-detail">
      {/* Header */}
      <div className="detail-header">
        <div className="header-left">
          <button className="back-button" onClick={() => navigate(-1)}>
            <ArrowLeft size={16} />
            Back
          </button>
          <h1>Submission Details</h1>
        </div>
        <div className="header-right">
          <span className={`status-badge-large ${getStatusColor(submission.status)}`}>
            <span className="status-dot-large"></span>
            {submission.status || 'Pending'}
          </span>
          <span className="id-badge">
            ID: {submission.name?.slice(-8)}
          </span>
        </div>
      </div>

      {/* Meta Information Grid */}
      <div className="meta-grid">
        <div className="meta-card">
          <div className="meta-icon">
            <Briefcase size={20} />
          </div>
          <div className="meta-content">
            <div className="meta-label">Project</div>
            <div className="meta-value">{submission.project}</div>
          </div>
        </div>

        <div className="meta-card">
          <div className="meta-icon">
            <FileText size={20} />
          </div>
          <div className="meta-content">
            <div className="meta-label">Form</div>
            <div className="meta-value">{submission.reporting_form}</div>
          </div>
        </div>

        <div className="meta-card">
          <div className="meta-icon">
            <User size={20} />
          </div>
          <div className="meta-content">
            <div className="meta-label">Submitted By</div>
            <div className="meta-value">{submission.submitted_by || submission.owner}</div>
          </div>
        </div>

        <div className="meta-card">
          <div className="meta-icon">
            <Calendar size={20} />
          </div>
          <div className="meta-content">
            <div className="meta-label">Created</div>
            <div className="meta-value small">{formatDate(submission.creation)}</div>
          </div>
        </div>
      </div>

      {/* Form Answers Section */}
      <div className="answers-section">
        <div className="section-title">
          <FileText size={20} />
          <h2>Form Responses</h2>
          <span className="answers-count">
            {submission.parsedData ? Object.keys(submission.parsedData).length : 0} fields
          </span>
        </div>

        {!submission.parsedData || Object.keys(submission.parsedData).length === 0 ? (
          <div className="empty-answers">
            <div className="empty-icon">
              <HelpCircle size={30} />
            </div>
            <p>No form data available</p>
          </div>
        ) : (
          <div className="answers-grid">
            {Object.entries(submission.parsedData).map(([key, value]) => {
              const displayValue = value === null || value === undefined ? '-' : 
                                  typeof value === 'boolean' ? (value ? 'Yes' : 'No') : 
                                  String(value);
              
              return (
                <div key={key} className="answer-card">
                  <div className="answer-header">
                    <div className="answer-icon">
                      {getFieldIcon(key, value)}
                    </div>
                    <h3>{key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</h3>
                  </div>
                  <div className={`answer-value ${typeof value === 'number' ? 'number' : 'text'}`}>
                    {displayValue || '—'}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Additional Metadata (if needed) */}
      {submission.modified && (
        <div style={{ marginTop: '1rem', textAlign: 'right', color: 'rgba(255,255,255,0.2)', fontSize: '0.7rem' }}>
          Last modified: {formatDate(submission.modified)}
        </div>
      )}
    </div>
  );
};

export default SubmissionDetail;