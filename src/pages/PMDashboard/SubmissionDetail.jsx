import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getSubmissionDetail } from "../../api/pm";

const SubmissionDetail = () => {
  const location = useLocation();
  const submissionName = location.state?.submissionName;

  const [submission, setSubmission] = useState(null);

  useEffect(() => {
    const loadSubmission = async () => {
      try {
        const data = await getSubmissionDetail(submissionName);

        // parse form answers
        if (data.data) {
          data.parsedData = JSON.parse(data.data);
        }

        setSubmission(data);
        console.log("Submission detail:", data);
      } catch (err) {
        console.error(err);
      }
    };

    if (submissionName) loadSubmission();
  }, [submissionName]);

  if (!submission) return <p>Loading...</p>;

  return (
    <div>
      <h2>Submission Detail</h2>

      <p><b>Project:</b> {submission.project}</p>
      <p><b>Form:</b> {submission.reporting_form}</p>
      <p><b>Submitted By:</b> {submission.submitted_by}</p>
      <p><b>Status:</b> {submission.status}</p>
      <p><b>Created:</b> {submission.creation}</p>

      <h3>Form Answers</h3>

      {submission.parsedData &&
        Object.entries(submission.parsedData).map(([key, value]) => (
          <div key={key}>
            <strong>{key}</strong>: {value}
          </div>
        ))}
    </div>
  );
};

export default SubmissionDetail;