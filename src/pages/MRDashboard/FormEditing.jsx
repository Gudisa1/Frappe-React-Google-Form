import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getProjects, getSingleReportingForm, updateReportingForm } from '../../api/datacollection';

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

  if (loading) return <div>Loading form...</div>;

  return (
    <div style={{ padding: 20 }}>
      <h2>Update Reporting Form</h2>

      <div style={{ marginBottom: 10 }}>
        <input placeholder="Form Title" value={formTitle} onChange={e => setFormTitle(e.target.value)} />
      </div>

      <div style={{ marginBottom: 10 }}>
        <select value={reportingPeriod} onChange={e => setReportingPeriod(e.target.value)}>
          {REPORTING_PERIODS.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
      </div>

      <div style={{ marginBottom: 10 }}>
        <input type="number" placeholder="Year" value={year} onChange={e => setYear(Number(e.target.value))} />
      </div>

      <div style={{ marginBottom: 10 }}>
        <select value={status} onChange={e => setStatus(e.target.value)}>
          {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <h3>Fields</h3>
      {fields.map((f, i) => (
        <div key={i} style={{ marginBottom:10, border:'1px solid #ccc', padding:10 }}>
          <input placeholder="Field Name" value={f.field_name} onChange={e => setFields(fields.map((fld,j) => j===i ? {...fld, field_name:e.target.value}:fld))} />
          <input placeholder="Label" value={f.label} onChange={e => setFields(fields.map((fld,j) => j===i ? {...fld, label:e.target.value}:fld))} />
          <select value={f.field_type} onChange={e => setFields(fields.map((fld,j) => j===i ? {...fld, field_type:e.target.value}:fld))}>
            <option value="">Select Field Type</option>
            {ALLOWED_FIELD_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <label>
            <input type="checkbox" checked={f.required} onChange={e => setFields(fields.map((fld,j) => j===i ? {...fld, required:e.target.checked}:fld))} /> Required
          </label>
          <button onClick={() => removeField(i)}>Remove</button>
        </div>
      ))}
      <button onClick={addField}>Add Field</button>

      <h3>Select Projects</h3>
      {projects.map(p => (
        <label key={p.project_name} style={{ display:'block' }}>
          <input type="checkbox" checked={selectedProjects[p.project_name]||false} onChange={e => setSelectedProjects({...selectedProjects, [p.project_name]:e.target.checked})} />
          {p.project_name}
        </label>
      ))}

      <button onClick={() => setShowPreview(true)} style={{ marginTop:20 }}>Preview & Update</button>

      {showPreview && (
        <div style={{ position:'fixed', top:0,left:0,right:0,bottom:0, background:'rgba(0,0,0,0.5)', display:'flex', justifyContent:'center', alignItems:'center' }}>
          <div style={{ background:'white', padding:20, maxWidth:600, width:'100%' }}>
            <h3>Preview Reporting Form</h3>
            <p><strong>Title:</strong> {formTitle}</p>
            <p><strong>Reporting Period:</strong> {reportingPeriod}</p>
            <p><strong>Year:</strong> {year}</p>
            <p><strong>Status:</strong> {status}</p>

            <h4>Fields:</h4>
            <ul>
              {fields.map((f,i) => <li key={i}>{f.label} ({f.field_name}) - {f.field_type} {f.required ? '[Required]':''}</li>)}
            </ul>

            <h4>Projects:</h4>
            <ul>
              {projects.filter(p=>selectedProjects[p.project_name]).map(p => <li key={p.project_name}>{p.project_name}</li>)}
            </ul>

            <button onClick={handleSubmit} style={{ marginRight:10 }}>Confirm & Update</button>
            <button onClick={()=>setShowPreview(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormEditing;