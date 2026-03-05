import React, { useEffect, useState } from 'react';
import { logoutUser } from "../../api/auth";
import { fetchProjectsByManager,fetchFormsByProject  } from "../../api/pm";
import {useNavigate} from 'react-router-dom'

const ProjectDashboard = () => {
  const [projects, setProjects] = useState([]);
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate=useNavigate();


 useEffect(() => {
    const pm = JSON.parse(localStorage.getItem("projectManager"));
    if (!pm) {
      setLoading(false);
      return;
    }

    const getProjectsAndForms = async () => {
      try {
        // 1️⃣ Fetch projects assigned to PM
        const pmProjects = await fetchProjectsByManager(pm.email);
        setProjects(pmProjects);
        localStorage.setItem("pmProjects", JSON.stringify(pmProjects));

        // 2️⃣ Fetch forms for all PM projects
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


  return (
     <div>
      <h1>Project Dashboard</h1>

      <button
        variant="outline"
        color="red"
        onClick={async () => {
          await logoutUser();
          window.location.href = "/";
        }}
      >
        Logout
      </button>

      {loading ? (
        <p>Loading projects and forms...</p>
      ) : (
        <>
          <h2>Projects</h2>
          <ul>
            {projects.map((p) => (
              <li key={p.name}>{p.project_name}</li>
            ))}
          </ul>

          <h2>Assigned Forms</h2>
          {forms.length === 0 ? (
            <p>No forms assigned.</p>
          ) : (
            <ul>
              {forms.map((f) => (
                <li key={f.name}>
                  {f.form_title} (Period: {f.reporting_period}, Year: {f.year})
                   <button
        onClick={() => {
          // Navigate to Submit page with state
            localStorage.setItem("selectedFormName", f.name);
            localStorage.setItem("selectedFormTitle", f.form_title);
            localStorage.setItem("selectedProject", projects[0]?.project_name);
          navigate("/submit", {
            state: {
              formName: f.name,
              formTitle: f.form_title,
              project: projects[0]?.project_name, // pick the project if needed
            },
          });
        }}
      >
        Submit Form
      </button>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
};

export default ProjectDashboard;