// import React, { useEffect, useState } from 'react';
// import { logoutUser } from "../../api/auth";
// import { fetchProjectsByManager,fetchFormsByProject  } from "../../api/pm";
// import {useNavigate} from 'react-router-dom'
// import './ProjectDashboard.css';
// const ProjectDashboard = () => {
//   const [projects, setProjects] = useState([]);
//   const [forms, setForms] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const navigate=useNavigate();


//  useEffect(() => {
//     const pm = JSON.parse(localStorage.getItem("projectManager"));
//     if (!pm) {
//       setLoading(false);
//       return;
//     }

//     const getProjectsAndForms = async () => {
//       try {
//         // 1️⃣ Fetch projects assigned to PM
//         const pmProjects = await fetchProjectsByManager(pm.email);
//         setProjects(pmProjects);
//         localStorage.setItem("pmProjects", JSON.stringify(pmProjects));

//         // 2️⃣ Fetch forms for all PM projects
//         let allForms = [];
//         for (const proj of pmProjects) {
//           const projForms = await fetchFormsByProject(proj.project_name);
//           allForms = [...allForms, ...projForms];
//         }

//         setForms(allForms);
//       } catch (err) {
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     getProjectsAndForms();
//   }, []);


//   return (
//      <div>
//       <h1>Project Dashboard</h1>

//       <button
//         variant="outline"
//         color="red"
//         onClick={async () => {
//           await logoutUser();
//           window.location.href = "/";
//         }}
//       >
//         Logout
//       </button>

//       {loading ? (
//         <p>Loading projects and forms...</p>
//       ) : (
//         <>
//           <h2>Projects</h2>
//           <ul>
//             {projects.map((p) => (
//               <li key={p.name}>{p.project_name}</li>
//             ))}
//           </ul>

//           <h2>Assigned Forms</h2>
//           {forms.length === 0 ? (
//             <p>No forms assigned.</p>
//           ) : (
//             <ul>
//               {forms.map((f) => (
//                 <li key={f.name}>
//                   {f.form_title} (Period: {f.reporting_period}, Year: {f.year})
//                    <button
//         onClick={() => {
//           // Navigate to Submit page with state
//             localStorage.setItem("selectedFormName", f.name);
//             localStorage.setItem("selectedFormTitle", f.form_title);
//             localStorage.setItem("selectedProject", projects[0]?.project_name);
//           navigate("/submit", {
//             state: {
//               formName: f.name,
//               formTitle: f.form_title,
//               project: projects[0]?.project_name, // pick the project if needed
//             },
//           });
//         }}
//       >
//         Submit Form
//       </button>
//                 </li>
//               ))}
//             </ul>
//           )}
//         </>
//       )}
//     </div>
//   );
// };

// export default ProjectDashboard;


import React, { useEffect, useState } from 'react';
import { fetchProjectsByManager, fetchFormsByProject } from "../../api/pm";
import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Calendar,
  ChevronRight,
  Clock,
  Briefcase
} from 'lucide-react';
import './ProjectDashboard.css';

const ProjectDashboard = () => {
  const [projects, setProjects] = useState([]);
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const pm = JSON.parse(localStorage.getItem("projectManager"));
    if (!pm) {
      setLoading(false);
      return;
    }

    const getProjectsAndForms = async () => {
      try {
        const pmProjects = await fetchProjectsByManager(pm.email);
        setProjects(pmProjects);
        localStorage.setItem("pmProjects", JSON.stringify(pmProjects));

        let allForms = [];
        for (const proj of pmProjects) {
          const projForms = await fetchFormsByProject(proj.project_name);
          allForms = [...allForms, ...projForms];
        }

        setForms(allForms);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getProjectsAndForms();
  }, []);

  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', { 
    weekday: 'long',
    month: 'long', 
    day: 'numeric',
    year: 'numeric'
  });

  // Calculate progress for projects (mock data for demo)
  const getProjectProgress = (projectName) => {
    const projectForms = forms.filter(f => f.project === projectName);
    if (projectForms.length === 0) return 0;
    const completed = projectForms.filter(f => f.status === 'completed').length;
    return Math.round((completed / projectForms.length) * 100);
  };

  // Dot colors for projects
  const dotColors = ['blue', 'purple', 'green'];

  return (
    <div className="project-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <div className="date">
          <Calendar size={16} />
          {formattedDate}
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Total Projects</div>
          <div className="stat-value">{projects.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Active Forms</div>
          <div className="stat-value">{forms.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Pending</div>
          <div className="stat-value">{forms.filter(f => f.status !== 'completed').length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Completed</div>
          <div className="stat-value">{forms.filter(f => f.status === 'completed').length}</div>
        </div>
      </div>

      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
        </div>
      ) : (
        <>
          {/* Projects Section */}
          <div className="section-title">
            <h2>Projects</h2>
            <span className="count">{projects.length} total</span>
          </div>

          {projects.length === 0 ? (
            <div className="empty-state">
              <p>No projects assigned</p>
            </div>
          ) : (
            <div className="projects-grid">
              {projects.slice(0, 3).map((project, index) => {
                const progress = getProjectProgress(project.project_name);
                const formCount = forms.filter(f => f.project === project.project_name).length;
                
                return (
                  <div 
                    key={project.name} 
                    className="project-card"
                    onClick={() => localStorage.setItem("selectedProject", project.project_name)}
                  >
                    <div className="project-header">
                      <div className={`project-dot ${dotColors[index % 3]}`}></div>
                      <h3>{project.project_name}</h3>
                      <div className="project-stats">
                        <span>
                          <FileText size={14} />
                          {formCount}
                        </span>
                      </div>
                    </div>
                    
                    <div className="project-progress">
                      <div className="progress-track">
                        <div className="progress-bar" style={{ width: `${progress}%` }}></div>
                      </div>
                      <div className="progress-value">{progress}% complete</div>
                    </div>

                    <div className="project-footer">
                      <Clock size={14} />
                      <span>Active</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Forms Section */}
          <div className="section-title" style={{ marginTop: '2rem' }}>
            <h2>Forms</h2>
            <span className="count">{forms.length} pending</span>
          </div>

          {forms.length === 0 ? (
            <div className="empty-state">
              <p>No forms to display</p>
            </div>
          ) : (
            <div className="forms-list">
              {forms.map((form) => {
                const project = projects.find(p => p.project_name === form.project);
                
                return (
                  <div key={form.name} className="form-item">
                    <div className="form-info">
                      <div className="form-icon">
                        <FileText size={20} />
                      </div>
                      <div className="form-details">
                        <h4>{form.form_title}</h4>
                        <span>ID: {form.name.slice(-6)}</span>
                      </div>
                    </div>
                    
                    <div className="form-project">
                      {project?.project_name || 'General'}
                    </div>
                    
                    <div className="form-period">
                      {form.reporting_period} {form.year}
                    </div>
                    
                    <div className="form-due">
                      Due {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>

                    <button
                      className="submit-button"
                      onClick={() => {
                        localStorage.setItem("selectedFormName", form.name);
                        localStorage.setItem("selectedFormTitle", form.form_title);
                        localStorage.setItem("selectedProject", form.project || projects[0]?.project_name);
                        navigate("/submit");
                      }}
                    >
                      Submit
                      <ChevronRight size={16} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProjectDashboard;