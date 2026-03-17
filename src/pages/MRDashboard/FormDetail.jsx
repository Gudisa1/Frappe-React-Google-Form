// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import { getSingleReportingForm } from '../../api/datacollection';

// const FormDetail = () => {
//   const { formName } = useParams();
//   const [formData, setFormData] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (!formName) return;

//     const fetchForm = async () => {
//       try {
//         const data = await getSingleReportingForm(formName);
//         setFormData(data);
//       } catch (err) {
//         alert('Failed to fetch form: ' + err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchForm();
//   }, [formName]);

//   if (loading) return <div>Loading...</div>;
//   if (!formData) return <div>No data found for this form.</div>;

//   return (
//     <div style={{ maxWidth: 900, margin: '20px auto', padding: 20, fontFamily: 'Arial, sans-serif' }}>
//       {/* Header */}
//       <h1 style={{ marginBottom: 5 }}>{formData.form_title}</h1>
//       <div style={{ display: 'flex', gap: 20, marginBottom: 20 }}>
//         <div><strong>Reporting Period:</strong> {formData.reporting_period}</div>
//         <div><strong>Year:</strong> {formData.year}</div>
//         <div><strong>Status:</strong> {formData.status}</div>
//       </div>

//       {/* Fields */}
//       <h2 style={{ marginTop: 30, marginBottom: 10 }}>Fields</h2>
//       <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 30 }}>
//         <thead>
//           <tr style={{ backgroundColor: '#f0f0f0' }}>
//             <th style={{ textAlign: 'left', padding: 10 }}>Label</th>
//             <th style={{ textAlign: 'left', padding: 10 }}>Field Name</th>
//             <th style={{ textAlign: 'left', padding: 10 }}>Type</th>
//             <th style={{ textAlign: 'center', padding: 10 }}>Required</th>
//           </tr>
//         </thead>
//         <tbody>
//           {formData.fields.map((field) => (
//             <tr key={field.name} style={{ borderBottom: '1px solid #ddd' }}>
//               <td style={{ padding: 10 }}>{field.label}</td>
//               <td style={{ padding: 10 }}>{field.field_name}</td>
//               <td style={{ padding: 10 }}>{field.field_type}</td>
//               <td style={{ padding: 10, textAlign: 'center' }}>{field.required ? '✅' : '❌'}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       {/* Target Projects */}
//       <h2 style={{ marginBottom: 10 }}>Target Projects</h2>
//       <div style={{ display: 'flex', flexWrap: 'wrap', gap: 15 }}>
//         {formData.target_projects.map((proj) => (
//           <div
//             key={proj.name}
//             style={{
//               border: '1px solid #ccc',
//               borderRadius: 8,
//               padding: 15,
//               minWidth: 180,
//               boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
//               backgroundColor: '#fafafa'
//             }}
//           >
//             <strong>{proj.project_name}</strong>
//             <p style={{ margin: 5 }}>Include: {proj.include}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default FormDetail;


// FormDetail.jsx - Elegant Dark Theme
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSingleReportingForm, deleteReportingForm,fetchSubmissionsByForm  } from '../../api/datacollection';
import './FormDetail.css';
import * as XLSX from "xlsx";
import {handleExportExcel} from '../../hooks/xl';
import GoToDashboardButton  from '../../components/GoToDashboardButton';


const FormDetail = () => {
  const { formName } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!formName) return;

    const fetchForm = async () => {
      try {
        setLoading(true);
        const data = await getSingleReportingForm(formName);
        setFormData(data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchForm();
  }, [formName]);

  const handleBack = () => {
    navigate('/mr-dashboard/formlist');
  };

  const handleEdit = () => {
    navigate(`/mr-dashboard/forms/${encodeURIComponent(formName)}/edit`);
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this form?')) return;
    
    try {
      await deleteReportingForm(formName);
      navigate('/mr-dashboard/formlist', { 
        state: { message: 'Form deleted successfully!' } 
      });
    } catch (err) {
      alert('Failed to delete form: ' + err.message);
    }
  };
// const handleExportExcel = async () => {
//   console.log("Export button clicked"); // DEBUG
//   try {
//     const submissions = await fetchSubmissionsByForm(formName);
//     console.log("Fetched submissions:", submissions);
//     if (!submissions.length) {
//       alert("No submissions found for this form.");
//       return;
//     }

//     const rows = submissions.map(sub => ({
//       Submission_ID: sub.name,
//       Project: sub.project,
//       Submitted_By: sub.submitted_by,
//       Status: sub.status,
//       ...sub.parsedData
//     }));

//     const worksheet = XLSX.utils.json_to_sheet(rows);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Submissions");
//     XLSX.writeFile(workbook, `${formName}_submissions.xlsx`);
//   } catch (error) {
//     console.error("Excel export failed:", error);
//     alert("Failed to export Excel.");
//   }
// };
const handleViewSubmissions = () => {
  navigate(`/mr-dashboard/forms/${encodeURIComponent(formName)}/submissions`);
};

  if (loading) {
    return (
      <div className="form-detail-page">
        <div className="loading-skeleton">
          <div className="skeleton-header"></div>
          <div className="skeleton-content">
            <div className="skeleton-line"></div>
            <div className="skeleton-line"></div>
            <div className="skeleton-line"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !formData) {
    return (
      <div className="form-detail-page">
        <div className="error-container">
          <div className="error-icon">⊙</div>
          <h2>Unable to load form</h2>
          <p>{error || 'Form not found'}</p>
          <button onClick={handleBack} className="ghost-button">
            ← Return to forms
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="form-detail-page">
            <GoToDashboardButton />

      <div className="form-detail-content">
        {/* Navigation */}
        <nav className="detail-nav">
          <button onClick={handleBack} className="nav-back">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            <span>All forms</span>
          </button>
          
          <div className="nav-actions">
            <button onClick={handleViewSubmissions} className="nav-button">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                    <span>Submissions</span>
                  </button>

                  {/* <button onClick={handleExportExcel} className="nav-button">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M12 3v12"/>
                      <path d="M7 10l5 5 5-5"/>
                      <path d="M5 21h14"/>
                    </svg>
                    <span>Export Excel</span>
                    
          </button> */}
<button onClick={() => handleExportExcel(formData?.form_name || formName)} className="nav-button">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              <span>Export to Excel</span>
            </button>
            <button onClick={handleEdit} className="nav-button">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M20 14.66V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5.34"/>
                <polygon points="18 2 22 6 12 16 8 16 8 12 18 2"/>
              </svg>
              <span>Edit</span>
            </button>
            <button onClick={handleDelete} className="nav-button delete">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
              </svg>
              <span>Delete</span>
            </button>
          </div>
        </nav>

        {/* Header */}
        <header className="detail-header">
          <div className="header-content">
            <h1 className="detail-title">{formData.form_title}</h1>
            
            <div className="header-meta">
              <div className="meta-group">
                <span className="meta-label">Reporting period</span>
                <span className="meta-value">{formData.reporting_period || '—'}</span>
              </div>
              <div className="meta-divider"></div>
              <div className="meta-group">
                <span className="meta-label">Year</span>
                <span className="meta-value">{formData.year || '—'}</span>
              </div>
              <div className="meta-divider"></div>
              <div className="meta-group">
                <span className="meta-label">Status</span>
                <span className={`status-badge ${formData.status?.toLowerCase() || 'draft'}`}>
                  {formData.status || 'Draft'}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Fields Section */}
        <section className="detail-section">
          <div className="section-head">
            <h2 className="section-title">
              <span className="section-icon">📋</span>
              Form fields
            </h2>
            <span className="section-count">{formData.fields?.length || 0}</span>
          </div>

          <div className="fields-list">
            {formData.fields?.map((field, index) => (
              <div key={field.field_name || index} className="field-item">
                <div className="field-main">
                  <span className="field-label">{field.label}</span>
                  <span className={`field-badge ${field.required ? 'required' : 'optional'}`}>
                    {field.required ? 'Required' : 'Optional'}
                  </span>
                </div>
                <div className="field-details">
                  <code className="field-name">{field.field_name}</code>
                  <span className="field-type">{field.field_type}</span>
                </div>
              </div>
            ))}
            
            {(!formData.fields || formData.fields.length === 0) && (
              <div className="empty-state">
                <p>No fields defined for this form</p>
              </div>
            )}
          </div>
        </section>

        {/* Projects Section */}
        <section className="detail-section">
          <div className="section-head">
            <h2 className="section-title">
              <span className="section-icon">🎯</span>
              Target projects
            </h2>
            <span className="section-count">{formData.target_projects?.length || 0}</span>
          </div>

          <div className="projects-list">
            {formData.target_projects?.map((project, index) => (
              <div key={project.name || index} className="project-item">
                <div className="project-header">
                  <h3 className="project-name">{project.project_name}</h3>
                  <span className={`project-status ${project.include?.toLowerCase() === 'yes' ? 'included' : 'excluded'}`}>
                    {project.include === 'Yes' ? 'Included' : 'Excluded'}
                  </span>
                </div>
                <div className="project-meta">
                  <span className="project-id-label">Project ID</span>
                  <span className="project-id-value">{project.project || 'Not assigned'}</span>
                </div>
              </div>
            ))}
            
            {(!formData.target_projects || formData.target_projects.length === 0) && (
              <div className="empty-state">
                <p>No target projects assigned</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default FormDetail;