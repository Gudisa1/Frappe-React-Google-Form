// import React, { useEffect, useState } from 'react';
// import './ProjectStat.css';
// import { getProject } from '../../api/datacollection';

// const ProjectStat = () => {
//   const [project, setProject] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const storedProjects = localStorage.getItem('pmProjects');
//     const projects = storedProjects ? JSON.parse(storedProjects) : [];
//     const projectName = projects.length > 0 ? projects[0].project_name : null;

//     if (!projectName) {
//       setError("No project selected");
//       setLoading(false);
//       return;
//     }

//     const fetchProject = async () => {
//       try {
//         const response = await getProject(projectName); // fetch full data
//         setProject(response.data);
//       } catch (err) {
//         console.error(err);
//         setError("Failed to load project");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProject();
//   }, []);

//   if (loading) return <div>Loading project details...</div>;
//   if (error) return <div>{error}</div>;
//   if (!project) return <div>No project data available</div>;

//   return (
//     <div className="project-stat-container">
//       <h2>Project Details: {project.project_name}</h2>
//       <div className="project-details">
//         <table>
//           <tbody>
//             <tr><td>Project Code:</td><td>{project.project_code}</td></tr>
//             <tr><td>Project Manager:</td><td>{project.project_manager}</td></tr>
//             <tr><td>Status:</td><td>{project.status}</td></tr>
//             <tr><td>Start Date:</td><td>{project.start_date}</td></tr>
//             <tr><td>End Date:</td><td>{project.end_date}</td></tr>
//             <tr><td>Region:</td><td>{project.region}</td></tr>
//             <tr><td>District:</td><td>{project.district}</td></tr>
//             <tr><td>Description:</td><td>{project.description}</td></tr>
//             <tr><td>Total Direct Beneficiaries:</td><td>{project.total_direct_beneficiaries}</td></tr>
//             <tr><td>Male Beneficiaries:</td><td>{project.male_beneficiaries}</td></tr>
//             <tr><td>Female Beneficiaries:</td><td>{project.female_beneficiaries}</td></tr>
//             <tr><td>Indirect Beneficiaries:</td><td>{project.indirect_beneficiaries}</td></tr>
//             <tr><td>Created By:</td><td>{project.owner}</td></tr>
//             <tr><td>Last Modified By:</td><td>{project.modified_by} at {project.modified}</td></tr>
//             {/* <tr><td>DocStatus:</td><td>{project.docstatus}</td></tr> */}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default ProjectStat;

import React, { useEffect, useState } from 'react';
import './ProjectStat.css';
import { getProject } from '../../api/datacollection';

const ProjectStat = () => {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const storedProjects = localStorage.getItem('pmProjects');
    const projects = storedProjects ? JSON.parse(storedProjects) : [];
    const projectName = projects.length > 0 ? projects[0].project_name : null;

    if (!projectName) {
      setError("No project selected");
      setLoading(false);
      return;
    }

    const fetchProject = async () => {
      try {
        const response = await getProject(projectName);
        setProject(response.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load project");
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, []);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="loading">{error}</div>;
  if (!project) return <div className="loading">No project found</div>;

  const male = Number(project.male_beneficiaries) || 0;
  const female = Number(project.female_beneficiaries) || 0;
  const total = male + female;
  const femalePercent = total === 0 ? 0 : Math.round((female / total) * 100);
  const indirect = Number(project.indirect_beneficiaries) || 0;

  return (
    <div className="stats-page">
      {/* Hero Section */}
      <div className="hero">
        <div className="hero-content">
          <div className="project-code">{project.project_code}</div>
          <h1>{project.project_name}</h1>
          <div className="project-meta">
            <span>{project.project_manager}</span>
            <span>{project.region}, {project.district}</span>
          </div>
        </div>
        <div className={`status ${project.status?.toLowerCase()}`}>
          {project.status}
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="stats-container">
        {/* Timeline */}
        <div className="stat-block">
          <div className="stat-title">TIMELINE</div>
          <div className="dates">
            <div>
              <div className="label">Start</div>
              <div className="value">{project.start_date || '—'}</div>
            </div>
            <div className="arrow">→</div>
            <div>
              <div className="label">End</div>
              <div className="value">{project.end_date || '—'}</div>
            </div>
          </div>
        </div>

        {/* Direct Beneficiaries */}
        <div className="stat-block highlight">
          <div className="stat-title">DIRECT BENEFICIARIES</div>
          <div className="big-number">{total.toLocaleString()}</div>
          <div className="gender-breakdown">
            <div className="gender-row">
              <span>Male</span>
              <div className="bar">
                <div className="bar-fill male" style={{ width: `${100 - femalePercent}%` }}></div>
              </div>
              <span>{male.toLocaleString()}</span>
            </div>
            <div className="gender-row">
              <span>Female</span>
              <div className="bar">
                <div className="bar-fill female" style={{ width: `${femalePercent}%` }}></div>
              </div>
              <span>{female.toLocaleString()}</span>
            </div>
          </div>
          <div className="percentage">{femalePercent}% Female</div>
        </div>

        {/* Indirect Beneficiaries */}
        <div className="stat-block">
          <div className="stat-title">INDIRECT BENEFICIARIES</div>
          <div className="big-number">{indirect.toLocaleString()}</div>
          <div className="ratio">
            {total > 0 ? Math.round((indirect / total) * 100) : 0}% of direct
          </div>
        </div>

        {/* Description */}
        {project.description && (
          <div className="stat-block full-width">
            <div className="stat-title">DESCRIPTION</div>
            <p>{project.description}</p>
          </div>
        )}

        {/* Metadata */}
        <div className="stat-block full-width meta">
          <div className="meta-item">
            <span>Created by</span>
            <strong>{project.owner || '—'}</strong>
          </div>
          <div className="meta-item">
            <span>Last modified</span>
            <strong>
              {project.modified_by || '—'} 
              {project.modified && ` · ${project.modified}`}
            </strong>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectStat;