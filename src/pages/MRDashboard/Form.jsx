// import React, { useState, useEffect } from 'react';
// import { getProjects, createReportingForm } from '../../api/datacollection';

// export const ALLOWED_FIELD_TYPES = [
//   'Data',
//   'Small Text',
//   'Int',
//   'Float',
//   'Currency',
//   'Date',
//   'Datetime',
//   'Time',
//   'Select',
//   'Check',
//   'Rating'
// ];

// const REPORTING_PERIODS = ['Q1', 'Q2', 'Q3', 'Q4', 'Other'];
// const STATUS_OPTIONS = ['Draft', 'Published', 'Closed'];

// const Form = () => {
//   const [formTitle, setFormTitle] = useState('');
//   const [reportingPeriod, setReportingPeriod] = useState('Q1');
//   const [year, setYear] = useState(2026);
//   const [status, setStatus] = useState('Draft');

//   const [fields, setFields] = useState([
//     { field_name: '', label: '', field_type: '', required: false }
//   ]);

//   const [projects, setProjects] = useState([]);
//   const [selectedProjects, setSelectedProjects] = useState({});

//   const [showPreview, setShowPreview] = useState(false);

//   // Load projects from API
//   useEffect(() => {
//     getProjects().then((res) => {
//       const projectsArray = res.data || [];
//       setProjects(projectsArray);

//       const initial = {};
//       projectsArray.forEach((p) => (initial[p.project_name] = false));
//       setSelectedProjects(initial);
//     });
//   }, []);

//   const addField = () => {
//     setFields([...fields, { field_name: '', label: '', field_type: '', required: false }]);
//   };

//   const removeField = (index) => {
//     setFields(fields.filter((_, i) => i !== index));
//   };

//   const validateFields = () => {
//     if (!formTitle) {
//       alert('Form title is required');
//       return false;
//     }

//     for (let field of fields) {
//       if (!field.field_name || !field.label) {
//         alert('All fields must have a field_name and label');
//         return false;
//       }
//       if (!ALLOWED_FIELD_TYPES.includes(field.field_type)) {
//         alert(`Invalid field type "${field.field_type}" for "${field.label}"`);
//         return false;
//       }
//     }

//     if (!Object.values(selectedProjects).some((v) => v)) {
//       alert('Select at least one project');
//       return false;
//     }

//     return true;
//   };

//   const handleSubmit = async () => {
//     if (!validateFields()) return;

//     const target_projects = projects
//       .filter((p) => selectedProjects[p.project_name])
//       .map((p) => ({
//         project: p.project_name,
//         project_name: p.project_name,
//         include: 'Yes'
//       }));

//     const formData = {
//       doctype: 'Reporting Form',
//       form_title: formTitle,
//       reporting_period: reportingPeriod,
//       year,
//       status,
//       fields,
//       target_projects
//     };

//     try {
//       const result = await createReportingForm(formData);
//       console.log('Reporting Form created:', result);
//       alert('Reporting Form created successfully!');
//     } catch (err) {
//       alert('Error creating form: ' + err.message);
//     }
//   };

//   return (
//     <div style={{ padding: 20 }}>
//       <h2>Create Reporting Form</h2>

//       <div style={{ marginBottom: 10 }}>
//         <input
//           placeholder="Form Title"
//           value={formTitle}
//           onChange={(e) => setFormTitle(e.target.value)}
//         />
//       </div>

//       <div style={{ marginBottom: 10 }}>
//         <select value={reportingPeriod} onChange={(e) => setReportingPeriod(e.target.value)}>
//           {REPORTING_PERIODS.map((p) => (
//             <option key={p} value={p}>{p}</option>
//           ))}
//         </select>
//       </div>

//       <div style={{ marginBottom: 10 }}>
//         <input
//           type="number"
//           placeholder="Year"
//           value={year}
//           onChange={(e) => setYear(Number(e.target.value))}
//         />
//       </div>

//       <div style={{ marginBottom: 10 }}>
//         <select value={status} onChange={(e) => setStatus(e.target.value)}>
//           {STATUS_OPTIONS.map((s) => (
//             <option key={s} value={s}>{s}</option>
//           ))}
//         </select>
//       </div>

//       <h3>Fields</h3>
//       {fields.map((field, index) => (
//         <div key={index} style={{ marginBottom: 10, border: '1px solid #ccc', padding: 10 }}>
//           <input
//             placeholder="Field Name"
//             value={field.field_name}
//             onChange={(e) =>
//               setFields(fields.map((f, i) => (i === index ? { ...f, field_name: e.target.value } : f)))
//             }
//           />
//           <input
//             placeholder="Label"
//             value={field.label}
//             onChange={(e) =>
//               setFields(fields.map((f, i) => (i === index ? { ...f, label: e.target.value } : f)))
//             }
//           />
//           <select
//             value={field.field_type}
//             onChange={(e) =>
//               setFields(fields.map((f, i) => (i === index ? { ...f, field_type: e.target.value } : f)))
//             }
//           >
//             <option value="">Select Field Type</option>
//             {ALLOWED_FIELD_TYPES.map((type) => (
//               <option key={type} value={type}>{type}</option>
//             ))}
//           </select>
//           <label>
//             <input
//               type="checkbox"
//               checked={field.required}
//               onChange={(e) =>
//                 setFields(fields.map((f, i) => (i === index ? { ...f, required: e.target.checked } : f)))
//               }
//             /> Required
//           </label>
//           <button onClick={() => removeField(index)}>Remove</button>
//         </div>
//       ))}
//       <button onClick={addField}>Add Field</button>

//       <h3>Select Projects</h3>
//       {projects.map((p) => (
//         <label key={p.project_name} style={{ display: 'block' }}>
//           <input
//             type="checkbox"
//             checked={selectedProjects[p.project_name] || false}
//             onChange={(e) =>
//               setSelectedProjects({ ...selectedProjects, [p.project_name]: e.target.checked })
//             }
//           />
//           {p.project_name}
//         </label>
//       ))}

//       <button onClick={() => setShowPreview(true)} style={{ marginTop: 20 }}>
//         Preview & Submit
//       </button>

//       {/* Preview Modal */}
//       {showPreview && (
//         <div
//           style={{
//             position: 'fixed',
//             top: 0, left: 0, right: 0, bottom: 0,
//             background: 'rgba(0,0,0,0.5)',
//             display: 'flex', justifyContent: 'center', alignItems: 'center'
//           }}
//         >
//           <div style={{ background: 'white', padding: 20, maxWidth: 600, width: '100%' }}>
//             <h3>Preview Reporting Form</h3>
//             <p><strong>Title:</strong> {formTitle}</p>
//             <p><strong>Reporting Period:</strong> {reportingPeriod}</p>
//             <p><strong>Year:</strong> {year}</p>
//             <p><strong>Status:</strong> {status}</p>

//             <h4>Fields:</h4>
//             <ul>
//               {fields.map((f, i) => (
//                 <li key={i}>{f.label} ({f.field_name}) - {f.field_type} {f.required ? '[Required]' : ''}</li>
//               ))}
//             </ul>

//             <h4>Projects:</h4>
//             <ul>
//               {projects
//                 .filter((p) => selectedProjects[p.project_name])
//                 .map((p) => (
//                   <li key={p.project_name}>{p.project_name}</li>
//                 ))}
//             </ul>

//             <button onClick={handleSubmit} style={{ marginRight: 10 }}>Confirm & Submit</button>
//             <button onClick={() => setShowPreview(false)}>Cancel</button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProjects, createReportingForm } from '../../api/datacollection';
import './Form.css'; // We'll create this CSS file

export const ALLOWED_FIELD_TYPES = [
  'Data',
  'Small Text',
  'Int',
  'Float',
  'Currency',
  'Date',
  'Datetime',
  'Time',
  'Select',
  'Check',
  'Rating'
];

const REPORTING_PERIODS = ['Q1', 'Q2', 'Q3', 'Q4', 'Other'];
const STATUS_OPTIONS = ['Draft', 'Published', 'Closed'];

const Form = () => {
  const navigate = useNavigate();
  const [formTitle, setFormTitle] = useState('');
  const [reportingPeriod, setReportingPeriod] = useState('Q1');
  const [year, setYear] = useState(2026);
  const [status, setStatus] = useState('Draft');
  const [fields, setFields] = useState([
    { field_name: '', label: '', field_type: '', required: false }
  ]);
  const [projects, setProjects] = useState([]);
  const [selectedProjects, setSelectedProjects] = useState({});
  const [showPreview, setShowPreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Load projects from API
  useEffect(() => {
    getProjects().then((res) => {
      const projectsArray = res.data || [];
      setProjects(projectsArray);
      const initial = {};
      projectsArray.forEach((p) => (initial[p.project_name] = false));
      setSelectedProjects(initial);
    });
  }, []);

  const addField = () => {
    setFields([...fields, { field_name: '', label: '', field_type: '', required: false }]);
  };

  const removeField = (index) => {
    if (fields.length > 1) {
      setFields(fields.filter((_, i) => i !== index));
    }
  };

  const validateFields = () => {
    if (!formTitle.trim()) {
      showNotification('Form title is required', 'error');
      return false;
    }

    for (let field of fields) {
      if (!field.field_name.trim() || !field.label.trim()) {
        showNotification('All fields must have a field name and label', 'error');
        return false;
      }
      if (!ALLOWED_FIELD_TYPES.includes(field.field_type)) {
        showNotification(`Invalid field type "${field.field_type}" for "${field.label}"`, 'error');
        return false;
      }
    }

    if (!Object.values(selectedProjects).some((v) => v)) {
      showNotification('Select at least one project', 'error');
      return false;
    }

    return true;
  };

  const showNotification = (message, type = 'error') => {
    // You can implement a toast notification system here
    alert(message);
  };

  const handleSubmit = async () => {
    if (!validateFields()) return;

    setIsSubmitting(true);

    const target_projects = projects
      .filter((p) => selectedProjects[p.project_name])
      .map((p) => ({
        project: p.project_name,
        project_name: p.project_name,
        include: 'Yes'
      }));

    const formData = {
      doctype: 'Reporting Form',
      form_title: formTitle,
      reporting_period: reportingPeriod,
      year,
      status,
      fields,
      target_projects
    };

    try {
      const result = await createReportingForm(formData);
      console.log('Reporting Form created:', result);
      
      // Show success state
      setShowSuccess(true);
      
      // Close preview and reset form after short delay
      setTimeout(() => {
        setShowPreview(false);
        setShowSuccess(false);
        
        // Navigate to form list page
        navigate('/mr-dashboard/formlist', { 
          state: { message: 'Reporting Form created successfully!' } 
        });
      }, 2000);
      
    } catch (err) {
      showNotification('Error creating form: ' + err.message, 'error');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="form-container">
      <div className="form-card">
        <div className="form-header">
          <h2 className="form-title">Create Reporting Form</h2>
          <p className="form-subtitle">Design your data collection form with custom fields</p>
        </div>

        <div className="form-grid">
          <div className="input-group">
            <label className="input-label">Form Title</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g., Q1 Sales Report"
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label className="input-label">Reporting Period</label>
            <select className="form-select" value={reportingPeriod} onChange={(e) => setReportingPeriod(e.target.value)}>
              {REPORTING_PERIODS.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          <div className="input-group">
            <label className="input-label">Year</label>
            <input
              type="number"
              className="form-input"
              placeholder="Year"
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
            />
          </div>

          <div className="input-group">
            <label className="input-label">Status</label>
            <select className="form-select" value={status} onChange={(e) => setStatus(e.target.value)}>
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="section-header">
          <h3 className="section-title">Form Fields</h3>
          <p className="section-subtitle">Add fields to collect specific data points</p>
        </div>

        {fields.map((field, index) => (
          <div key={index} className="field-card">
            <div className="field-header">
              <span className="field-number">Field {index + 1}</span>
              {fields.length > 1 && (
                <button className="remove-field-btn" onClick={() => removeField(index)}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
            
            <div className="field-grid">
              <div className="input-group">
                <label className="input-label">Field Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g., revenue_amount"
                  value={field.field_name}
                  onChange={(e) =>
                    setFields(fields.map((f, i) => (i === index ? { ...f, field_name: e.target.value } : f)))
                  }
                />
              </div>
              
              <div className="input-group">
                <label className="input-label">Label</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g., Revenue Amount"
                  value={field.label}
                  onChange={(e) =>
                    setFields(fields.map((f, i) => (i === index ? { ...f, label: e.target.value } : f)))
                  }
                />
              </div>
              
              <div className="input-group">
                <label className="input-label">Field Type</label>
                <select
                  className="form-select"
                  value={field.field_type}
                  onChange={(e) =>
                    setFields(fields.map((f, i) => (i === index ? { ...f, field_type: e.target.value } : f)))
                  }
                >
                  <option value="">Select Type</option>
                  {ALLOWED_FIELD_TYPES.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              
              <div className="checkbox-wrapper">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    className="form-checkbox"
                    checked={field.required}
                    onChange={(e) =>
                      setFields(fields.map((f, i) => (i === index ? { ...f, required: e.target.checked } : f)))
                    }
                  />
                  <span className="checkbox-text">Required field</span>
                </label>
              </div>
            </div>
          </div>
        ))}

        <button className="add-field-btn" onClick={addField}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Add New Field
        </button>

        <div className="section-header" style={{ marginTop: '32px' }}>
          <h3 className="section-title">Select Projects</h3>
          <p className="section-subtitle">Choose which projects will use this form</p>
        </div>

        <div className="projects-grid">
          {projects.map((p) => (
            <label key={p.project_name} className="project-checkbox">
              <input
                type="checkbox"
                className="project-input"
                checked={selectedProjects[p.project_name] || false}
                onChange={(e) =>
                  setSelectedProjects({ ...selectedProjects, [p.project_name]: e.target.checked })
                }
              />
              <span className="project-name">{p.project_name}</span>
            </label>
          ))}
        </div>

        <div className="form-actions">
          <button className="preview-btn" onClick={() => setShowPreview(true)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            Preview Form
          </button>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Preview Reporting Form</h3>
              <button className="modal-close" onClick={() => setShowPreview(false)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {showSuccess ? (
              <div className="success-state">
                <div className="success-icon">
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                </div>
                <h4 className="success-title">Form Created Successfully!</h4>
                <p className="success-message">Redirecting to form list...</p>
              </div>
            ) : (
              <>
                <div className="preview-content">
                  <div className="preview-section">
                    <h4 className="preview-section-title">Form Details</h4>
                    <div className="preview-grid">
                      <div className="preview-item">
                        <span className="preview-label">Title:</span>
                        <span className="preview-value">{formTitle || 'Untitled'}</span>
                      </div>
                      <div className="preview-item">
                        <span className="preview-label">Period:</span>
                        <span className="preview-value">{reportingPeriod} {year}</span>
                      </div>
                      <div className="preview-item">
                        <span className="preview-label">Status:</span>
                        <span className={`status-badge ${status.toLowerCase()}`}>{status}</span>
                      </div>
                    </div>
                  </div>

                  <div className="preview-section">
                    <h4 className="preview-section-title">Fields ({fields.length})</h4>
                    <div className="fields-preview">
                      {fields.map((f, i) => (
                        <div key={i} className="field-preview-item">
                          <div className="field-preview-header">
                            <span className="field-preview-name">{f.label}</span>
                            {f.required && <span className="required-badge">Required</span>}
                          </div>
                          <div className="field-preview-meta">
                            <span className="field-preview-type">{f.field_type}</span>
                            <span className="field-preview-code">{f.field_name}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="preview-section">
                    <h4 className="preview-section-title">Selected Projects</h4>
                    <div className="projects-preview">
                      {projects.filter((p) => selectedProjects[p.project_name]).length > 0 ? (
                        projects
                          .filter((p) => selectedProjects[p.project_name])
                          .map((p) => (
                            <span key={p.project_name} className="project-tag">
                              {p.project_name}
                            </span>
                          ))
                      ) : (
                        <p className="no-projects">No projects selected</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="modal-actions">
                  <button 
                    className="btn btn-primary" 
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="spinner"></span>
                        Creating...
                      </>
                    ) : (
                      <>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M20 6L9 17l-5-5" />
                        </svg>
                        Confirm & Submit
                      </>
                    )}
                  </button>
                  <button className="btn btn-secondary" onClick={() => setShowPreview(false)}>
                    Cancel
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Form;