import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getSingleReportingForm } from '../../api/datacollection';

const FormDetail = () => {
  const { formName } = useParams();
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!formName) return;

    const fetchForm = async () => {
      try {
        const data = await getSingleReportingForm(formName);
        setFormData(data);
      } catch (err) {
        alert('Failed to fetch form: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchForm();
  }, [formName]);

  if (loading) return <div>Loading...</div>;
  if (!formData) return <div>No data found for this form.</div>;

  return (
    <div style={{ maxWidth: 900, margin: '20px auto', padding: 20, fontFamily: 'Arial, sans-serif' }}>
      {/* Header */}
      <h1 style={{ marginBottom: 5 }}>{formData.form_title}</h1>
      <div style={{ display: 'flex', gap: 20, marginBottom: 20 }}>
        <div><strong>Reporting Period:</strong> {formData.reporting_period}</div>
        <div><strong>Year:</strong> {formData.year}</div>
        <div><strong>Status:</strong> {formData.status}</div>
      </div>

      {/* Fields */}
      <h2 style={{ marginTop: 30, marginBottom: 10 }}>Fields</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 30 }}>
        <thead>
          <tr style={{ backgroundColor: '#f0f0f0' }}>
            <th style={{ textAlign: 'left', padding: 10 }}>Label</th>
            <th style={{ textAlign: 'left', padding: 10 }}>Field Name</th>
            <th style={{ textAlign: 'left', padding: 10 }}>Type</th>
            <th style={{ textAlign: 'center', padding: 10 }}>Required</th>
          </tr>
        </thead>
        <tbody>
          {formData.fields.map((field) => (
            <tr key={field.name} style={{ borderBottom: '1px solid #ddd' }}>
              <td style={{ padding: 10 }}>{field.label}</td>
              <td style={{ padding: 10 }}>{field.field_name}</td>
              <td style={{ padding: 10 }}>{field.field_type}</td>
              <td style={{ padding: 10, textAlign: 'center' }}>{field.required ? '✅' : '❌'}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Target Projects */}
      <h2 style={{ marginBottom: 10 }}>Target Projects</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 15 }}>
        {formData.target_projects.map((proj) => (
          <div
            key={proj.name}
            style={{
              border: '1px solid #ccc',
              borderRadius: 8,
              padding: 15,
              minWidth: 180,
              boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
              backgroundColor: '#fafafa'
            }}
          >
            <strong>{proj.project_name}</strong>
            <p style={{ margin: 5 }}>Include: {proj.include}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FormDetail;