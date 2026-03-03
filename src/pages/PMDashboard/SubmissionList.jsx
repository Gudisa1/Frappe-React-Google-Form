import React, { useEffect, useState } from "react";
import { getProjectSubmissions } from "../../api/pm"; // import the fetch function

const SubmissionList = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get project name from localStorage
  const projectName = JSON.parse(localStorage.getItem("projectName")) || "";

  useEffect(() => {
    if (!projectName) {
      setError("No project selected");
      setLoading(false);
      return;
    }

    const fetchSubmissions = async () => {
      try {
        setLoading(true);
        const data = await getProjectSubmissions(projectName);
        setSubmissions(data);
        console.log(data)
      } catch (err) {
        console.error("Error fetching submissions:", err);
        setError(err.message || "Failed to fetch submissions");
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, [projectName]);

  if (loading) return <p>Loading submissions...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!submissions.length) return <p>No submissions found for project "{projectName}"</p>;

  return (
    <div>
      <h1>Submissions for Project: {projectName}</h1>
      <table border="1" cellPadding="10" style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            <th>Submitted By</th>
            <th>Status</th>
            <th>Data</th>
            <th>Review Comment</th>
          </tr>
        </thead>
        <tbody>
          {submissions.map((sub) => (
            <tr key={sub.name}>
              <td>{sub.submitted_by}</td>
              <td>{sub.status}</td>
              <td>
                <pre style={{ whiteSpace: "pre-wrap" }}>{JSON.stringify(sub.data, null, 2)}</pre>
              </td>
              <td>{sub.review_comment || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SubmissionList;