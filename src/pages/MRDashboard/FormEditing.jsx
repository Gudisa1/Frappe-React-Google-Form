// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import { getProjects, getSingleReportingForm, updateReportingForm } from '../../api/datacollection';

// export const ALLOWED_FIELD_TYPES = [
//   'Data','Small Text','Int','Float','Currency','Date','Datetime','Time','Select','Check','Rating'
// ];

// const REPORTING_PERIODS = ['Q1', 'Q2', 'Q3', 'Q4', 'Other'];
// const STATUS_OPTIONS = ['Draft', 'Published', 'Closed'];

// const FormEditing = () => {
//   const { formName } = useParams();
//   const [formTitle, setFormTitle] = useState('');
//   const [reportingPeriod, setReportingPeriod] = useState('Q1');
//   const [year, setYear] = useState(new Date().getFullYear());
//   const [status, setStatus] = useState('Draft');

//   const [fields, setFields] = useState([]);
//   const [projects, setProjects] = useState([]);
//   const [selectedProjects, setSelectedProjects] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [showPreview, setShowPreview] = useState(false);

//   // Load projects
//   useEffect(() => {
//     getProjects().then((res) => {
//       const projectsArray = res.data || [];
//       setProjects(projectsArray);

//       const initialSelected = {};
//       projectsArray.forEach((p) => (initialSelected[p.project_name] = false));
//       setSelectedProjects(initialSelected);
//     });
//   }, []);

//   // Load existing form data
//   useEffect(() => {
//     if (!formName) return;
//     const fetchForm = async () => {
//       try {
//         const data = await getSingleReportingForm(formName);
//         setFormTitle(data.form_title);
//         setReportingPeriod(data.reporting_period);
//         setYear(data.year);
//         setStatus(data.status);

//         // Map fields
//         setFields(
//           data.fields.map(f => ({
//             field_name: f.field_name,
//             label: f.label,
//             field_type: f.field_type,
//             required: !!f.required,
//             value: f.value || ''
//           }))
//         );

//         // Map selected projects
//         const initialSelected = {};
//         projects.forEach(p => {
//           const matched = data.target_projects.find(tp => tp.project_name === p.project_name);
//           initialSelected[p.project_name] = !!matched;
//         });
//         setSelectedProjects(prev => ({ ...prev, ...initialSelected }));
//       } catch (err) {
//         alert('Failed to fetch form: ' + err.message);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchForm();
//   }, [formName, projects]);

//   const addField = () => setFields([...fields, { field_name:'', label:'', field_type:'', required:false, value:'' }]);
//   const removeField = (index) => setFields(fields.filter((_, i) => i !== index));

//   const validateFields = () => {
//     if (!formTitle) { alert('Form title is required'); return false; }
//     for (let f of fields) {
//       if (!f.field_name || !f.label) { alert('All fields must have field_name and label'); return false; }
//       if (!ALLOWED_FIELD_TYPES.includes(f.field_type)) { alert(`Invalid field type "${f.field_type}"`); return false; }
//     }
//     if (!Object.values(selectedProjects).some(v => v)) { alert('Select at least one project'); return false; }
//     return true;
//   };

//   const handleSubmit = async () => {
//     if (!validateFields()) return;

//     const target_projects = projects
//       .filter(p => selectedProjects[p.project_name])
//       .map(p => ({ project: p.project_name, project_name: p.project_name, include: 'Yes' }));

//     const formData = { form_title: formTitle, reporting_period: reportingPeriod, year, status, fields, target_projects };

//     try {
//       await updateReportingForm(formName, formData);
//       alert('Reporting Form updated successfully!');
//       setShowPreview(false);
//     } catch (err) {
//       alert('Failed to update form: ' + err.message);
//     }
//   };

//   if (loading) return <div>Loading form...</div>;

//   return (
//     <div style={{ padding: 20 }}>
//       <h2>Update Reporting Form</h2>

//       <div style={{ marginBottom: 10 }}>
//         <input placeholder="Form Title" value={formTitle} onChange={e => setFormTitle(e.target.value)} />
//       </div>

//       <div style={{ marginBottom: 10 }}>
//         <select value={reportingPeriod} onChange={e => setReportingPeriod(e.target.value)}>
//           {REPORTING_PERIODS.map(p => <option key={p} value={p}>{p}</option>)}
//         </select>
//       </div>

//       <div style={{ marginBottom: 10 }}>
//         <input type="number" placeholder="Year" value={year} onChange={e => setYear(Number(e.target.value))} />
//       </div>

//       <div style={{ marginBottom: 10 }}>
//         <select value={status} onChange={e => setStatus(e.target.value)}>
//           {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
//         </select>
//       </div>

//       <h3>Fields</h3>
//       {fields.map((f, i) => (
//         <div key={i} style={{ marginBottom:10, border:'1px solid #ccc', padding:10 }}>
//           <input placeholder="Field Name" value={f.field_name} onChange={e => setFields(fields.map((fld,j) => j===i ? {...fld, field_name:e.target.value}:fld))} />
//           <input placeholder="Label" value={f.label} onChange={e => setFields(fields.map((fld,j) => j===i ? {...fld, label:e.target.value}:fld))} />
//           <select value={f.field_type} onChange={e => setFields(fields.map((fld,j) => j===i ? {...fld, field_type:e.target.value}:fld))}>
//             <option value="">Select Field Type</option>
//             {ALLOWED_FIELD_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
//           </select>
//           <label>
//             <input type="checkbox" checked={f.required} onChange={e => setFields(fields.map((fld,j) => j===i ? {...fld, required:e.target.checked}:fld))} /> Required
//           </label>
//           <button onClick={() => removeField(i)}>Remove</button>
//         </div>
//       ))}
//       <button onClick={addField}>Add Field</button>

//       <h3>Select Projects</h3>
//       {projects.map(p => (
//         <label key={p.project_name} style={{ display:'block' }}>
//           <input type="checkbox" checked={selectedProjects[p.project_name]||false} onChange={e => setSelectedProjects({...selectedProjects, [p.project_name]:e.target.checked})} />
//           {p.project_name}
//         </label>
//       ))}

//       <button onClick={() => setShowPreview(true)} style={{ marginTop:20 }}>Preview & Update</button>

//       {showPreview && (
//         <div style={{ position:'fixed', top:0,left:0,right:0,bottom:0, background:'rgba(0,0,0,0.5)', display:'flex', justifyContent:'center', alignItems:'center' }}>
//           <div style={{ background:'white', padding:20, maxWidth:600, width:'100%' }}>
//             <h3>Preview Reporting Form</h3>
//             <p><strong>Title:</strong> {formTitle}</p>
//             <p><strong>Reporting Period:</strong> {reportingPeriod}</p>
//             <p><strong>Year:</strong> {year}</p>
//             <p><strong>Status:</strong> {status}</p>

//             <h4>Fields:</h4>
//             <ul>
//               {fields.map((f,i) => <li key={i}>{f.label} ({f.field_name}) - {f.field_type} {f.required ? '[Required]':''}</li>)}
//             </ul>

//             <h4>Projects:</h4>
//             <ul>
//               {projects.filter(p=>selectedProjects[p.project_name]).map(p => <li key={p.project_name}>{p.project_name}</li>)}
//             </ul>

//             <button onClick={handleSubmit} style={{ marginRight:10 }}>Confirm & Update</button>
//             <button onClick={()=>setShowPreview(false)}>Cancel</button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default FormEditing;

// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { getProjects, getSingleReportingForm, updateReportingForm } from '../../api/datacollection';
// import './FormEditing.css';


// export const ALLOWED_FIELD_TYPES = [
//   'Data', 'Small Text', 'Int', 'Float', 'Currency', 'Date', 
//   'Datetime', 'Time', 'Select', 'Check', 'Rating'
// ];

// const REPORTING_PERIODS = ['Q1', 'Q2', 'Q3', 'Q4', 'Other'];
// const STATUS_OPTIONS = ['Draft', 'Published', 'Closed'];

// const FormEditing = () => {
//   const { formName } = useParams();
//   const navigate = useNavigate();
//   const [formTitle, setFormTitle] = useState('');
//   const [reportingPeriod, setReportingPeriod] = useState('Q1');
//   const [year, setYear] = useState(new Date().getFullYear());
//   const [status, setStatus] = useState('Draft');
//   const [fields, setFields] = useState([]);
//   const [projects, setProjects] = useState([]);
//   const [selectedProjects, setSelectedProjects] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [showPreview, setShowPreview] = useState(false);

//   // Load projects
//   useEffect(() => {
//     getProjects().then((res) => {
//       const projectsArray = res.data || [];
//       setProjects(projectsArray);

//       const initialSelected = {};
//       projectsArray.forEach((p) => (initialSelected[p.project_name] = false));
//       setSelectedProjects(initialSelected);
//     });
//   }, []);

//   // Load existing form data
//   useEffect(() => {
//     if (!formName) return;
//     const fetchForm = async () => {
//       try {
//         const data = await getSingleReportingForm(formName);
//         setFormTitle(data.form_title);
//         setReportingPeriod(data.reporting_period);
//         setYear(data.year);
//         setStatus(data.status);

//         setFields(
//           data.fields.map(f => ({
//             field_name: f.field_name,
//             label: f.label,
//             field_type: f.field_type,
//             required: !!f.required,
//             value: f.value || ''
//           }))
//         );

//         if (projects.length > 0) {
//           const initialSelected = {};
//           projects.forEach(p => {
//             const matched = data.target_projects.find(tp => tp.project_name === p.project_name);
//             initialSelected[p.project_name] = !!matched;
//           });
//           setSelectedProjects(prev => ({ ...prev, ...initialSelected }));
//         }
//       } catch (err) {
//         alert('Failed to fetch form: ' + err.message);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchForm();
//   }, [formName, projects]);

//   const handleBack = () => {
//     navigate(`/mr-dashboard/forms/${encodeURIComponent(formName)}`);
//   };

//   const addField = () => setFields([...fields, { field_name: '', label: '', field_type: '', required: false, value: '' }]);
  
//   const removeField = (index) => setFields(fields.filter((_, i) => i !== index));

//   const validateFields = () => {
//     if (!formTitle) { alert('Form title is required'); return false; }
//     for (let f of fields) {
//       if (!f.field_name || !f.label) { alert('All fields must have field_name and label'); return false; }
//       if (!ALLOWED_FIELD_TYPES.includes(f.field_type)) { alert(`Invalid field type "${f.field_type}"`); return false; }
//     }
//     if (!Object.values(selectedProjects).some(v => v)) { alert('Select at least one project'); return false; }
//     return true;
//   };

//   const handleSubmit = async () => {
//     if (!validateFields()) return;

//     const target_projects = projects
//       .filter(p => selectedProjects[p.project_name])
//       .map(p => ({ project: p.project_name, project_name: p.project_name, include: 'Yes' }));

//     const formData = { 
//       form_title: formTitle, 
//       reporting_period: reportingPeriod, 
//       year, 
//       status, 
//       fields, 
//       target_projects 
//     };

//     try {
//       await updateReportingForm(formName, formData);
//       alert('Reporting Form updated successfully!');
//       setShowPreview(false);
//       handleBack();
//     } catch (err) {
//       alert('Failed to update form: ' + err.message);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="loading-container">
//         <div className="loading-spinner"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="form-editing-page">
//       <div className="form-editing-content">
//         {/* Navigation */}
//         <nav className="edit-nav">
//           <button onClick={handleBack} className="nav-back">
//             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
//               <path d="M19 12H5M12 19l-7-7 7-7"/>
//             </svg>
//             <span>Back to form details</span>
//           </button>
          
//           <div className="nav-actions">
//             <button onClick={() => setShowPreview(true)} className="nav-button preview">
//               <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
//                 <circle cx="12" cy="12" r="2"/>
//                 <path d="M22 12c-2.667 4.667-6 7-10 7s-7.333-2.333-10-7c2.667-4.667 6-7 10-7s7.333 2.333 10 7z"/>
//               </svg>
//               <span>Preview</span>
//             </button>
//           </div>
//         </nav>

//         {/* Main editing grid */}
//         <div className="edit-grid">
//           {/* Left column - Basic info & Fields */}
//           <div className="edit-section">
//             <div className="section-header">
//               <span className="section-icon">📋</span>
//               <h3>Form Details</h3>
//               <span>Editing: {formName}</span>
//             </div>

//             <div className="basic-info-grid">
//               <div className="input-group full-width">
//                 <label>Form Title</label>
//                 <input 
//                   type="text" 
//                   value={formTitle} 
//                   onChange={e => setFormTitle(e.target.value)}
//                   placeholder="Enter form title"
//                 />
//               </div>

//               <div className="input-group">
//                 <label>Reporting Period</label>
//                 <select value={reportingPeriod} onChange={e => setReportingPeriod(e.target.value)}>
//                   {REPORTING_PERIODS.map(p => <option key={p} value={p}>{p}</option>)}
//                 </select>
//               </div>

//               <div className="input-group">
//                 <label>Year</label>
//                 <input 
//                   type="number" 
//                   value={year} 
//                   onChange={e => setYear(Number(e.target.value))}
//                   min="2020"
//                   max="2030"
//                 />
//               </div>

//               <div className="input-group">
//                 <label>Status</label>
//                 <select value={status} onChange={e => setStatus(e.target.value)}>
//                   {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
//                 </select>
//               </div>
//             </div>
//           </div>

//           {/* Right column - Projects selection */}
//           <div className="edit-section">
//             <div className="section-header">
//               <span className="section-icon">🎯</span>
//               <h3>Target Projects</h3>
//               <span className="selected-count">
//                 {Object.values(selectedProjects).filter(Boolean).length} selected
//               </span>
//             </div>

//             <div className="projects-container">
//               {projects.map(p => (
//                 <label 
//                   key={p.project_name} 
//                   className={`project-checkbox-card ${selectedProjects[p.project_name] ? 'selected' : ''}`}
//                 >
//                   <input 
//                     type="checkbox" 
//                     checked={selectedProjects[p.project_name] || false} 
//                     onChange={e => setSelectedProjects({
//                       ...selectedProjects, 
//                       [p.project_name]: e.target.checked
//                     })}
//                   />
//                   <div className="project-info">
//                     <div className="project-name">{p.project_name}</div>
//                     <div className="project-id">ID: {p.project || 'N/A'}</div>
//                   </div>
//                 </label>
//               ))}
//             </div>
//           </div>

//           {/* Full width - Fields section */}
//           <div className="edit-section full-width">
//             <div className="section-header">
//               <span className="section-icon">🔧</span>
//               <h3>Form Fields</h3>
//               <span>{fields.length} fields</span>
//             </div>

//             <div className="fields-container">
//               {fields.map((f, index) => (
//                 <div key={index} className="field-card">
//                   <div className="field-card-header">
//                     <span className="field-number">Field #{index + 1}</span>
//                     <button className="field-remove" onClick={() => removeField(index)}>
//                       Remove
//                     </button>
//                   </div>
                  
//                   <div className="field-grid">
//                     <input
//                       className="field-input"
//                       placeholder="Field Name"
//                       value={f.field_name}
//                       onChange={e => setFields(fields.map((fld, j) => 
//                         j === index ? {...fld, field_name: e.target.value} : fld
//                       ))}
//                     />
//                     <input
//                       className="field-input"
//                       placeholder="Label"
//                       value={f.label}
//                       onChange={e => setFields(fields.map((fld, j) => 
//                         j === index ? {...fld, label: e.target.value} : fld
//                       ))}
//                     />
//                     <select 
//                       className="field-select"
//                       value={f.field_type} 
//                       onChange={e => setFields(fields.map((fld, j) => 
//                         j === index ? {...fld, field_type: e.target.value} : fld
//                       ))}
//                     >
//                       <option value="">Select Type</option>
//                       {ALLOWED_FIELD_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
//                     </select>
//                     <label className="field-checkbox">
//                       <input 
//                         type="checkbox" 
//                         checked={f.required} 
//                         onChange={e => setFields(fields.map((fld, j) => 
//                           j === index ? {...fld, required: e.target.checked} : fld
//                         ))}
//                       />
//                       Required
//                     </label>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             <button className="add-field-button" onClick={addField}>
//               <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
//                 <path d="M12 5v14M5 12h14"/>
//               </svg>
//               Add New Field
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Preview Modal */}
//       {showPreview && (
//         <div className="modal-overlay" onClick={() => setShowPreview(false)}>
//           <div className="modal-content" onClick={e => e.stopPropagation()}>
//             <div className="modal-header">
//               <h3>Preview Form</h3>
//               <button className="modal-close" onClick={() => setShowPreview(false)}>✕</button>
//             </div>
            
//             <div className="modal-body">
//               <div className="preview-section">
//                 <h4>Basic Information</h4>
//                 <div className="preview-grid">
//                   <div className="preview-item">
//                     <span className="preview-label">Form Title</span>
//                     <span className="preview-value">{formTitle || '—'}</span>
//                   </div>
//                   <div className="preview-item">
//                     <span className="preview-label">Form Name</span>
//                     <span className="preview-value">{formName}</span>
//                   </div>
//                   <div className="preview-item">
//                     <span className="preview-label">Period</span>
//                     <span className="preview-value">{reportingPeriod} {year}</span>
//                   </div>
//                   <div className="preview-item">
//                     <span className="preview-label">Status</span>
//                     <span className="preview-value">
//                       <span className={`status-badge ${status.toLowerCase()}`}>{status}</span>
//                     </span>
//                   </div>
//                 </div>
//               </div>

//               <div className="preview-section">
//                 <h4>Fields ({fields.length})</h4>
//                 <div className="fields-preview">
//                   {fields.map((f, i) => (
//                     <div key={i} className="field-preview-item">
//                       <span className="field-preview-badge">{f.field_type}</span>
//                       <span style={{flex: 1}}>{f.label}</span>
//                       <span style={{color: '#7f8aa3', fontSize: '0.8rem'}}>{f.field_name}</span>
//                       {f.required && <span style={{color: '#ff6b7c', fontSize: '0.7rem'}}>Required</span>}
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               <div className="preview-section">
//                 <h4>Projects ({Object.values(selectedProjects).filter(Boolean).length})</h4>
//                 <div className="projects-preview">
//                   {projects.filter(p => selectedProjects[p.project_name]).map(p => (
//                     <span key={p.project_name} className="project-preview-tag">
//                       {p.project_name}
//                     </span>
//                   ))}
//                 </div>
//               </div>
//             </div>

//             <div className="modal-footer">
//               <button className="modal-button cancel" onClick={() => setShowPreview(false)}>
//                 Cancel
//               </button>
//               <button className="modal-button confirm" onClick={handleSubmit}>
//                 Update Form
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default FormEditing;



import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getProjects, getSingleReportingForm, updateReportingForm } from '../../api/datacollection';
import './FormEditing.css';
import GoToDashboardButton  from '../../components/GoToDashboardButton';

export const ALLOWED_FIELD_TYPES = [
  'Data','Small Text','Int','Float','Currency','Date','Datetime','Time','Select','Check','Rating'
];

const REPORTING_PERIODS = ['Q1', 'Q2', 'Q3', 'Q4', 'Other'];
const STATUS_OPTIONS = ['Draft', 'Published', 'Closed'];

const FormEditing = () => {
  const { formName } = useParams();
  const [formTitle, setFormTitle] = useState('');
  const [reportingPeriod, setReportingPeriod] = useState('Q1');
  const [year, setYear] = useState(new Date().getFullYear());
  const [status, setStatus] = useState('Draft');

  const [fields, setFields] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedProjects, setSelectedProjects] = useState({});
  const [loading, setLoading] = useState(true);
  const [showPreview, setShowPreview] = useState(false);

  // Load projects
  useEffect(() => {
    getProjects().then((res) => {
      const projectsArray = res.data || [];
      setProjects(projectsArray);

      const initialSelected = {};
      projectsArray.forEach((p) => (initialSelected[p.project_name] = false));
      setSelectedProjects(initialSelected);
    });
  }, []);

  // Load existing form data
  useEffect(() => {
    if (!formName) return;
    const fetchForm = async () => {
      try {
        const data = await getSingleReportingForm(formName);
        setFormTitle(data.form_title);
        setReportingPeriod(data.reporting_period);
        setYear(data.year);
        setStatus(data.status);

        // Map fields
        setFields(
          data.fields.map(f => ({
            field_name: f.field_name,
            label: f.label,
            field_type: f.field_type,
            required: !!f.required,
            value: f.value || ''
          }))
        );

        // Map selected projects
        const initialSelected = {};
        projects.forEach(p => {
          const matched = data.target_projects.find(tp => tp.project_name === p.project_name);
          initialSelected[p.project_name] = !!matched;
        });
        setSelectedProjects(prev => ({ ...prev, ...initialSelected }));
      } catch (err) {
        alert('Failed to fetch form: ' + err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchForm();
  }, [formName, projects]);

  const addField = () => setFields([...fields, { field_name:'', label:'', field_type:'', required:false, value:'' }]);
  const removeField = (index) => setFields(fields.filter((_, i) => i !== index));

  const validateFields = () => {
    if (!formTitle) { alert('Form title is required'); return false; }
    for (let f of fields) {
      if (!f.field_name || !f.label) { alert('All fields must have field_name and label'); return false; }
      if (!ALLOWED_FIELD_TYPES.includes(f.field_type)) { alert(`Invalid field type "${f.field_type}"`); return false; }
    }
    if (!Object.values(selectedProjects).some(v => v)) { alert('Select at least one project'); return false; }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateFields()) return;

    const target_projects = projects
      .filter(p => selectedProjects[p.project_name])
      .map(p => ({ project: p.project_name, project_name: p.project_name, include: 'Yes' }));

    const formData = { form_title: formTitle, reporting_period: reportingPeriod, year, status, fields, target_projects };

    try {
      await updateReportingForm(formName, formData);
      alert('Reporting Form updated successfully!');
      setShowPreview(false);
    } catch (err) {
      alert('Failed to update form: ' + err.message);
    }
  };

  if (loading) return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p className="loading-text">Loading form...</p>
    </div>
  );

  return (
    <div className="form-editing-container">
      <GoToDashboardButton />

      <div className="header">
        <h1 className="title">Update Reporting Form</h1>
        <p className="subtitle">Configure your form fields and settings</p>
      </div>

      <div className="form-section">
        <div className="input-group">
          <label className="label">Form Title</label>
          <input 
            className="input" 
            placeholder="e.g., Q4 Financial Report" 
            value={formTitle} 
            onChange={e => setFormTitle(e.target.value)} 
          />
        </div>

        <div className="row">
          <div className="input-group">
            <label className="label">Reporting Period</label>
            <select className="select" value={reportingPeriod} onChange={e => setReportingPeriod(e.target.value)}>
              {REPORTING_PERIODS.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>

          <div className="input-group">
            <label className="label">Year</label>
            <input 
              className="input" 
              type="number" 
              placeholder="Year" 
              value={year} 
              onChange={e => setYear(Number(e.target.value))} 
            />
          </div>

          <div className="input-group">
            <label className="label">Status</label>
            <select className="select" value={status} onChange={e => setStatus(e.target.value)}>
              {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="form-section">
        <div className="section-header">
          <h2 className="section-title">Form Fields</h2>
          <button onClick={addField} className="add-button">
            <span className="add-icon">+</span> Add New Field
          </button>
        </div>
        
        {fields.map((f, i) => (
          <div key={i} className="field-card">
            <div className="field-header">
              <span className="field-number">Field #{i + 1}</span>
              <button onClick={() => removeField(i)} className="remove-button">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="field-row">
              <div className="field-input-group">
                <label className="field-label">Field Name</label>
                <input 
                  className="field-input" 
                  placeholder="field_name" 
                  value={f.field_name} 
                  onChange={e => setFields(fields.map((fld,j) => j===i ? {...fld, field_name:e.target.value}:fld))} 
                />
              </div>
              
              <div className="field-input-group">
                <label className="field-label">Label</label>
                <input 
                  className="field-input" 
                  placeholder="Display Label" 
                  value={f.label} 
                  onChange={e => setFields(fields.map((fld,j) => j===i ? {...fld, label:e.target.value}:fld))} 
                />
              </div>
            </div>
            
            <div className="field-row">
              <div className="field-input-group">
                <label className="field-label">Field Type</label>
                <select className="field-select" value={f.field_type} onChange={e => setFields(fields.map((fld,j) => j===i ? {...fld, field_type:e.target.value}:fld))}>
                  <option value="">Select Field Type</option>
                  {ALLOWED_FIELD_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              
              <div className="checkbox-group">
                <label className="checkbox-label">
                  <input 
                    type="checkbox" 
                    className="checkbox" 
                    checked={f.required} 
                    onChange={e => setFields(fields.map((fld,j) => j===i ? {...fld, required:e.target.checked}:fld))} 
                  />
                  <span className="checkbox-text">Required Field</span>
                </label>
              </div>
            </div>
          </div>
        ))}
        
        {fields.length === 0 && (
          <div className="empty-state">
            <p className="empty-state-text">No fields added yet. Click the button above to add your first field.</p>
          </div>
        )}
      </div>

      <div className="form-section">
        <h2 className="section-title">Select Projects</h2>
        <div className="projects-grid">
          {projects.map(p => (
            <label key={p.project_name} className="project-card">
              <input 
                type="checkbox" 
                className="project-checkbox" 
                checked={selectedProjects[p.project_name]||false} 
                onChange={e => setSelectedProjects({...selectedProjects, [p.project_name]:e.target.checked})} 
              />
              <span className="project-name">{p.project_name}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="action-bar">
        <button onClick={() => setShowPreview(true)} className="preview-button">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="preview-icon">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
          Preview & Update
        </button>
      </div>

      {showPreview && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3 className="modal-title">Preview Reporting Form</h3>
              <button onClick={() => setShowPreview(false)} className="modal-close">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="modal-content">
              <div className="preview-item">
                <strong className="preview-label">Title:</strong> {formTitle}
              </div>
              <div className="preview-item">
                <strong className="preview-label">Reporting Period:</strong> {reportingPeriod} {year}
              </div>
              <div className="preview-item">
                <strong className="preview-label">Status:</strong> 
                <span className={`status-badge ${status.toLowerCase()}`}>
                  {status}
                </span>
              </div>

              <h4 className="preview-subtitle">Fields:</h4>
              <div className="preview-list">
                {fields.map((f,i) => (
                  <div key={i} className="preview-list-item">
                    <span className="preview-field-label">{f.label}</span>
                    <span className="preview-field-details">
                      ({f.field_name}) - {f.field_type}
                      {f.required && <span className="required-badge">Required</span>}
                    </span>
                  </div>
                ))}
              </div>

              <h4 className="preview-subtitle">Target Projects:</h4>
              <div className="project-tags">
                {projects.filter(p=>selectedProjects[p.project_name]).map(p => (
                  <span key={p.project_name} className="project-tag">{p.project_name}</span>
                ))}
              </div>
            </div>

            <div className="modal-footer">
              <button onClick={handleSubmit} className="confirm-button">Confirm & Update</button>
              <button onClick={()=>setShowPreview(false)} className="cancel-button">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormEditing;