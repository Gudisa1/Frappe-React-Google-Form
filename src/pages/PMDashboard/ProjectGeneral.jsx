// import React, { useState, useEffect } from 'react';
// import './ProjectGeneral.css';
// import { updateProject } from '../../api/datacollection';

// const ProjectGeneral = () => {
//   // Get projects array from localStorage
//   const storedProjects = localStorage.getItem('pmProjects');
//   const projects = storedProjects ? JSON.parse(storedProjects) : [];
//   const projectData = projects.length > 0 ? projects[0] : null;
//   const projectName = projectData?.project_name;

//   // Form state
//   const [formData, setFormData] = useState({
//     total_direct_beneficiaries: '',
//     male_beneficiaries: '',
//     female_beneficiaries: '',
//     indirect_beneficiaries: ''
//   });

//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState(null);

//   // Only load initial data once when component mounts
//   useEffect(() => {
//     if (projectData) {
//       setFormData({
//         total_direct_beneficiaries: projectData.total_direct_beneficiaries || '',
//         male_beneficiaries: projectData.male_beneficiaries || '',
//         female_beneficiaries: projectData.female_beneficiaries || '',
//         indirect_beneficiaries: projectData.indirect_beneficiaries || ''
//       });
//     }
//   }, []); // Empty dependency array - only runs once on mount

//   // Handle input change - simplified
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value
//     });
//   };

//   // Handle form submit
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!projectName) {
//       setMessage({ type: 'error', text: 'Project name is missing!' });
//       return;
//     }

//     setLoading(true);
//     setMessage(null);

//     try {
//       // Update backend
//       await updateProject(projectName, {
//         total_direct_beneficiaries: Number(formData.total_direct_beneficiaries),
//         male_beneficiaries: Number(formData.male_beneficiaries),
//         female_beneficiaries: Number(formData.female_beneficiaries),
//         indirect_beneficiaries: Number(formData.indirect_beneficiaries)
//       });

//       setMessage({ type: 'success', text: 'Project updated successfully!' });

//       // Update localStorage
//       const updatedProjects = projects.map(p =>
//         p.project_name === projectName 
//           ? { 
//               ...p, 
//               total_direct_beneficiaries: formData.total_direct_beneficiaries,
//               male_beneficiaries: formData.male_beneficiaries,
//               female_beneficiaries: formData.female_beneficiaries,
//               indirect_beneficiaries: formData.indirect_beneficiaries
//             } 
//           : p
//       );
//       localStorage.setItem('pmProjects', JSON.stringify(updatedProjects));
      
//       // Optional: Clear success message after 3 seconds
//       setTimeout(() => setMessage(null), 3000);
      
//     } catch (error) {
//       console.error("Update error:", error);
//       setMessage({ type: 'error', text: 'Failed to update project.' });
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle missing project
//   if (!projectData) {
//     return <div>No project found in localStorage under key 'pmProjects'.</div>;
//   }

//   return (
//     <div className="project-general-container">
//       <h2>Project: {projectName}</h2>

//       {message && (
//         <div className={`message ${message.type}`}>
//           {message.text}
//         </div>
//       )}

//       <form onSubmit={handleSubmit}>
//         <label>
//           Total Direct Beneficiaries
//           <input
//             type="number"
//             name="total_direct_beneficiaries"
//             value={formData.total_direct_beneficiaries}
//             onChange={handleChange}
//           />
//         </label>

//         <label>
//           Male Beneficiaries
//           <input
//             type="number"
//             name="male_beneficiaries"
//             value={formData.male_beneficiaries}
//             onChange={handleChange}
//           />
//         </label>

//         <label>
//           Female Beneficiaries
//           <input
//             type="number"
//             name="female_beneficiaries"
//             value={formData.female_beneficiaries}
//             onChange={handleChange}
//           />
//         </label>

//         <label>
//           Indirect Beneficiaries
//           <input
//             type="number"
//             name="indirect_beneficiaries"
//             value={formData.indirect_beneficiaries}
//             onChange={handleChange}
//           />
//         </label>

//         <button type="submit" disabled={loading}>
//           {loading ? 'Updating...' : 'Update Project'}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default ProjectGeneral;

import React, { useState, useEffect } from 'react';
import './ProjectGeneral.css';
import { updateProject } from '../../api/datacollection';

const ProjectGeneral = () => {
  // Get projects array from localStorage
  const storedProjects = localStorage.getItem('pmProjects');
  const projects = storedProjects ? JSON.parse(storedProjects) : [];
  const projectData = projects.length > 0 ? projects[0] : null;
  const projectName = projectData?.project_name;

  // Form state
  const [formData, setFormData] = useState({
    total_direct_beneficiaries: '',
    male_beneficiaries: '',
    female_beneficiaries: '',
    indirect_beneficiaries: ''
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  // Only load initial data once when component mounts
  useEffect(() => {
    if (projectData) {
      setFormData({
        total_direct_beneficiaries: projectData.total_direct_beneficiaries || '',
        male_beneficiaries: projectData.male_beneficiaries || '',
        female_beneficiaries: projectData.female_beneficiaries || '',
        indirect_beneficiaries: projectData.indirect_beneficiaries || ''
      });
    }
  }, []);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!projectName) {
      setMessage({ type: 'error', text: 'Project name is missing!' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      await updateProject(projectName, {
        total_direct_beneficiaries: Number(formData.total_direct_beneficiaries),
        male_beneficiaries: Number(formData.male_beneficiaries),
        female_beneficiaries: Number(formData.female_beneficiaries),
        indirect_beneficiaries: Number(formData.indirect_beneficiaries)
      });

      setMessage({ type: 'success', text: '✨ Project updated successfully!' });

      const updatedProjects = projects.map(p =>
        p.project_name === projectName 
          ? { 
              ...p, 
              total_direct_beneficiaries: formData.total_direct_beneficiaries,
              male_beneficiaries: formData.male_beneficiaries,
              female_beneficiaries: formData.female_beneficiaries,
              indirect_beneficiaries: formData.indirect_beneficiaries
            } 
          : p
      );
      localStorage.setItem('pmProjects', JSON.stringify(updatedProjects));
      
      setTimeout(() => setMessage(null), 3000);
      
    } catch (error) {
      console.error("Update error:", error);
      setMessage({ type: 'error', text: '❌ Failed to update project.' });
    } finally {
      setLoading(false);
    }
  };

  // Handle missing project
  if (!projectData) {
    return (
      <div className="project-general-container">
        <div className="error-state">
          <div className="error-icon">📁</div>
          <h3>No Project Found</h3>
          <p>No project found in localStorage under key 'pmProjects'.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="project-general-container">
      <div className="background-gradient"></div>
      
      <div className="content-wrapper">
        {/* Header Section */}
        <div className="header-section">
          <div className="project-badge">
            <span className="badge-icon">📊</span>
            <span className="badge-text">Project Overview</span>
          </div>
          <h1 className="project-title">{projectName}</h1>
          <p className="project-subtitle">Manage beneficiary information and project metrics</p>
        </div>

        {/* Message Toast */}
        {message && (
          <div className={`message-toast ${message.type}`}>
            <div className="toast-content">
              <span className="toast-icon">{message.type === 'success' ? '✓' : '⚠'}</span>
              <span className="toast-text">{message.text}</span>
            </div>
            <button className="toast-close" onClick={() => setMessage(null)}>×</button>
          </div>
        )}

        {/* Main Form Card */}
        <div className="form-card">
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              {/* Total Direct Beneficiaries */}
              <div className="input-group">
                <label className="input-label">
                  <span className="label-icon">👥</span>
                  Total Direct Beneficiaries
                </label>
                <div className="input-wrapper">
                  <input
                    type="number"
                    name="total_direct_beneficiaries"
                    value={formData.total_direct_beneficiaries}
                    onChange={handleChange}
                    placeholder="Enter total number"
                    className="modern-input"
                  />
                  <span className="input-decoration"></span>
                </div>
                <span className="input-hint">Direct recipients of project benefits</span>
              </div>

              {/* Male Beneficiaries */}
              <div className="input-group">
                <label className="input-label">
                  <span className="label-icon">👨</span>
                  Male Beneficiaries
                </label>
                <div className="input-wrapper">
                  <input
                    type="number"
                    name="male_beneficiaries"
                    value={formData.male_beneficiaries}
                    onChange={handleChange}
                    placeholder="Enter number of males"
                    className="modern-input"
                  />
                  <span className="input-decoration"></span>
                </div>
                <span className="input-hint">Male recipients under direct benefit</span>
              </div>

              {/* Female Beneficiaries */}
              <div className="input-group">
                <label className="input-label">
                  <span className="label-icon">👩</span>
                  Female Beneficiaries
                </label>
                <div className="input-wrapper">
                  <input
                    type="number"
                    name="female_beneficiaries"
                    value={formData.female_beneficiaries}
                    onChange={handleChange}
                    placeholder="Enter number of females"
                    className="modern-input"
                  />
                  <span className="input-decoration"></span>
                </div>
                <span className="input-hint">Female recipients under direct benefit</span>
              </div>

              {/* Indirect Beneficiaries */}
              <div className="input-group">
                <label className="input-label">
                  <span className="label-icon">🔄</span>
                  Indirect Beneficiaries
                </label>
                <div className="input-wrapper">
                  <input
                    type="number"
                    name="indirect_beneficiaries"
                    value={formData.indirect_beneficiaries}
                    onChange={handleChange}
                    placeholder="Enter indirect beneficiaries"
                    className="modern-input"
                  />
                  <span className="input-decoration"></span>
                </div>
                <span className="input-hint">Secondary recipients benefiting indirectly</span>
              </div>
            </div>

            {/* Submit Button */}
            <div className="button-container">
              <button 
                type="submit" 
                disabled={loading}
                className="submit-button"
              >
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Updating Project...
                  </>
                ) : (
                  <>
                    <span className="button-icon">💾</span>
                    Update Project
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Statistics Summary */}
          <div className="stats-summary">
            <div className="stat-card">
              <div className="stat-value">
                {Object.values(formData).some(v => v && !isNaN(v) && v > 0) 
                  ? Object.values(formData).reduce((sum, val) => {
                      const num = Number(val);
                      return sum + (isNaN(num) ? 0 : num);
                    }, 0)
                  : '—'}
              </div>
              <div className="stat-label">Total Impact</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">
                {formData.male_beneficiaries && formData.female_beneficiaries &&
                 !isNaN(formData.male_beneficiaries) && !isNaN(formData.female_beneficiaries) &&
                 (Number(formData.male_beneficiaries) + Number(formData.female_beneficiaries) > 0)
                  ? Math.round((Number(formData.female_beneficiaries) / 
                      (Number(formData.male_beneficiaries) + Number(formData.female_beneficiaries))) * 100)
                  : '—'}%
              </div>
              <div className="stat-label">Female Participation</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectGeneral;