// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { fetchSubmissionDetail } from "../../api/datacollection";
// import {exportSubmissionToExcel} from "../../hooks/xl"
// const MRSubmissionDetail = () => {

//   const { name } = useParams();
//   const [submission, setSubmission] = useState(null);

//   useEffect(() => {
//     const loadSubmission = async () => {
//       const result = await fetchSubmissionDetail(name);
//       setSubmission(result);
//     };

//     loadSubmission();
//   }, [name]);

//   if (!submission) {
//     return <p>Loading...</p>;
//   }

//   return (
//     <div>

//       <h2>Submission Detail</h2>

//       <p><strong>Project:</strong> {submission.project}</p>
//       <p><strong>Form:</strong> {submission.reporting_form}</p>
//       <p><strong>Status:</strong> {submission.status}</p>

//       <hr />

//       <h3>Submitted Data</h3>

//       <table border="1">
//         <thead>
//           <tr>
//             <th>Field</th>
//             <th>Value</th>
//           </tr>
//         </thead>

//         <tbody>

//           {Object.entries(submission.parsedData).map(([key, value]) => (

//             <tr key={key}>
//               <td>{key}</td>
//               <td>{value}</td>
//             </tr>

//           ))}

//         </tbody>

//       </table>
//       <button onClick={() => exportSubmissionToExcel(submission)}>
//   Export to Excel
// </button>
//     </div>
//   );
// };

// export default MRSubmissionDetail;

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchSubmissionDetail } from "../../api/datacollection";
import { 
  exportSubmissionToExcel, 
} from "../../hooks/xl";
import "./MRSubmissionDetail.css";
import Navigation from '../../components/Navigation';

const MRSubmissionDetail = () => {
  const { name } = useParams();
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadSubmission = async () => {
      try {
        setLoading(true);
        const result = await fetchSubmissionDetail(name);
        setSubmission(result);
        setError(null);
      } catch (err) {
        setError("Failed to load submission details");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadSubmission();
  }, [name]);

  if (loading) {
    return (
      <div className="detail-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading submission details...</p>
        </div>
      </div>
    );
  }

  if (error || !submission) {
    return (
      <div className="detail-container">
        <div className="error-state">
          <h2>Error</h2>
          <p>{error || "Submission not found"}</p>
        </div>
      </div>
    );
  }

  return (
    <Navigation>
    <div className="detail-container">
      {/* Header Section */}
      <div className="detail-header">
        <div className="header-content">
          <h1 className="header-title">Submission Details</h1>
          <div className="header-actions">
            <button 
              className="export-btn"
              onClick={() => exportSubmissionToExcel(submission)}
            >
              <svg className="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export to Excel
            </button>
          
          </div>
        </div>

        {/* Metadata Cards */}
        <div className="metadata-grid">
          <div className="metadata-card">
            <span className="metadata-label">Project</span>
            <span className="metadata-value">{submission.project || 'N/A'}</span>
          </div>
          <div className="metadata-card">
            <span className="metadata-label">Form</span>
            <span className="metadata-value">{submission.reporting_form || 'N/A'}</span>
          </div>
          <div className="metadata-card">
            <span className="metadata-label">Status</span>
            <span className={`status-badge ${submission.status?.toLowerCase()}`}>
              {submission.status || 'Unknown'}
            </span>
          </div>
          <div className="metadata-card">
            <span className="metadata-label">Submitted By</span>
            <span className="metadata-value">{submission.submitted_by || submission.owner || 'N/A'}</span>
          </div>
        </div>
      </div>

      {/* Data Table Section */}
      <div className="data-section">
        <div className="section-header">
          <h2 className="section-title">Submitted Data</h2>
          <span className="section-count">{Object.keys(submission.parsedData || {}).length} fields</span>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Field</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(submission.parsedData || {}).map(([key, value]) => (
                <tr key={key}>
                  <td className="field-cell">
                    <span className="field-name">{formatFieldName(key)}</span>
                    <span className="field-key">{key}</span>
                  </td>
                  <td className="value-cell">{value !== null && value !== undefined ? value : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    </Navigation>
  );
};

// Helper function to format field names
const formatFieldName = (field) => {
  return field
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

export default MRSubmissionDetail;