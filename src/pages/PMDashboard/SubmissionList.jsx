import React, { useEffect, useState } from "react";
import { useLocation ,useNavigate} from "react-router-dom";
import { getProjectSubmissions,deleteSubmission  } from "../../api/pm";

const SubmissionList = () => {
  const location = useLocation();
  const projectName = location.state?.projectName;
  const navigate = useNavigate();

  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    const loadSubmissions = async () => {
      try {
        const data = await getProjectSubmissions(projectName);
        setSubmissions(data);
        console.log("Fetched submissions:", data);
      } catch (err) {
        console.error(err);
      }
    };

    if (projectName) loadSubmissions();
  }, [projectName]);
const handleDelete = async (submissionName) => {
    if (!window.confirm("Are you sure you want to delete this submission?")) return;

    try {
      await deleteSubmission(submissionName);
      // remove from local state so UI updates immediately
      setSubmissions(submissions.filter((sub) => sub.name !== submissionName));
      alert("Submission deleted successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to delete submission");
    }
  };
  return (
    <div>
    <h2>Submissions for {projectName}</h2>

   {submissions.map((sub) => (
  <div key={sub.name}

    style={{
      border: "1px solid gray",
      padding: "10px",
      marginBottom: "10px",
      cursor: "default"
    }}
  >
    <h4>{sub.reporting_form}</h4>
    <p>Project: {sub.project}</p>
    <p>Submitted By: {sub.submitted_by || sub.owner}</p>
    <p>Status: {sub.status}</p>
    <p>Submitted At: {sub.creation}</p>
    
         <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
      <button
        onClick={() =>
          navigate("/submission-detail", {
            state: { submissionName: sub.name },
          })
        }
      >
        View Details
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation(); // prevent navigating when deleting
          handleDelete(sub.name);
        }}
      >
        Delete
      </button>
    </div>


  </div>
))}
  </div>
  );
};

export default SubmissionList;