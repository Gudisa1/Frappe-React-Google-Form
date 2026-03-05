// Fetch projects for a given Project Manager
export async function fetchProjectsByManager(pmEmail) {
  try {
    // Encode the email in the URL to be safe
    const encodedEmail = encodeURIComponent(pmEmail);

    // Build the URL
    const url = `/api/resource/Project?fields=["name","project_name"]&filters=[["project_manager","=","${encodedEmail}"]]`;

    // Make the API request
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // Include auth headers if needed (e.g., token or cookies)
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching projects: ${response.statusText}`);
    }

    // Parse JSON response
    const data = await response.json();
    return data.data; // Array of projects
  } catch (error) {
    console.error("Failed to fetch projects:", error);
    return [];
  }
}



// api/forms.js
export async function fetchFormsByProject(projectName) {
  try {
    if (!projectName) throw new Error("Project name is required");

    // Encode project name for URL safety
    const encodedProject = encodeURIComponent(projectName);

    // Frappe API call: filter forms by target project
    const url = `/api/resource/Reporting Form?filters=[["Reporting Form Target","project","=","${encodedProject}"]]&fields=["*"]`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // Add auth headers here if required
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch forms: ${response.statusText}`);
    }

    const data = await response.json();
    return data.data; // Array of forms
  } catch (error) {
    console.error("Error fetching forms by project:", error);
    return [];
  }
}

// export async function submitForm(reportingFormName, projectName, submittedBy, data) {
//   const payload = {
//     doctype: "Project Report Submission",
//     reporting_form: reportingFormName, // exact DocName
//     project: projectName,              // exact Project name
//     submitted_by: submittedBy,         // PM email
//     status: "Submitted",
//     data: data                         // JSON with field_name: value
//   };

//   const response = await fetch("/api/resource/Project Report Submission", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(payload),
//   });

//   if (!response.ok) throw new Error("Form submission failed");

//   return response.json();
// }

// export async function submitForm(reportingFormName, projectName, submittedBy, data) {
//   const payload = {
//     doctype: "Project Report Submission",
//     reporting_form: reportingFormName,
//     project: projectName,
//     submitted_by: submittedBy,
//     status: "Submitted",
//     data: data
//   };

//   console.log("🚀 Sending payload:", payload);

//   const response = await fetch("/api/resource/Project Report Submission", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(payload),
//   });

//   const responseData = await response.json();
//   console.log("📩 Server response:", responseData);

//   if (!response.ok) {
//     throw new Error(responseData?.message || "Form submission failed");
//   }

//   return responseData;
// }


// In your api/pm.js file
// export async function submitForm(reportingFormName, projectName, submittedBy, data) {
//   if (!projectName || !reportingFormName || !submittedBy) {
//     throw new Error("Project, reporting form, and submittedBy are required.");
//   }

//   // ✅ FIX: Don't stringify the data - let Frappe handle JSON serialization
//   const payload = {
//     doctype: "Project Report Submission",
//     reporting_form: reportingFormName,
//     project: projectName,
//     submitted_by: submittedBy,
//     status: "Submitted",
//     data: data  // Send as object, NOT stringified
//   };

//   console.log("📦 Submitting payload:", payload);

//   const response = await fetch("/api/resource/Project Report Submission", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     credentials: "include",
//     body: JSON.stringify(payload) // Stringify the ENTIRE payload, not just data
//   });

//   const responseData = await response.json();
//   console.log("📩 Server response:", responseData);

//   if (!response.ok) {
//     throw new Error(responseData?.message || responseData?.exc || "Form submission failed");
//   }

//   return responseData;
// }
// export const submitForm = async (payload) => {
//   const res = await fetch("/api/resource/Project Report Submission", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       data: payload
//     }),
//   });

//    // Check if HTTP status indicates error
 

//   return await res.json();
// };

export const submitForm = async (payload) => {
  try {
    const res = await fetch("/api/resource/Project Report Submission", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data: payload }),
    });

    // Check if HTTP status indicates error
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      // Combine status and backend message if available
      const errorMessage =
        errorData.message || errorData.error || `HTTP ${res.status} ${res.statusText}`;
      throw new Error(errorMessage);
    }

    // parse the JSON on success
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Submit Form Error:", err);
    // re-throw so frontend can handle
    throw err;
  }
};

// Fetch Project Report Submissions by project name dynamically
// export async function getProjectSubmissions(projectName) {
//   if (!projectName) {
//     throw new Error("Project name is required to fetch submissions.");
//   }

//   // Encode filters and fields as URL params
//   const filters = encodeURIComponent(
//     JSON.stringify([["project", "=", projectName]])
//   );
//   const fields = encodeURIComponent(JSON.stringify(["*"]));

//   const url = `/api/resource/Project Report Submission?filters=${filters}&fields=${fields}`;

//   const response = await fetch(url, {
//     method: "GET",
//     headers: { "Content-Type": "application/json" },
//     credentials: "include",
//   });

//   const responseData = await response.json();
//   console.log("📩 Fetched submissions:", responseData);

//   if (!response.ok) {
//     throw new Error(
//       responseData?.message || responseData?.exc || "Failed to fetch submissions"
//     );
//   }

//   return responseData.data; // Typically Frappe returns {data: [...]}
// }


export const getProjectSubmissions = async (project) => {
  const res = await fetch(
    `/api/resource/Project Report Submission?filters=[["project","=","${project}"]]&fields=["name","reporting_form","project","submitted_by","owner","creation","modified","status"]`
  );

  const data = await res.json();
  return data.data;
};

export const getSubmissionDetail = async (submissionName) => {
  const res = await fetch(
    `/api/resource/Project Report Submission/${submissionName}`
  );

  const data = await res.json();
  return data.data;
};

export const deleteSubmission = async (submissionName) => {
  const res = await fetch(
    `/api/resource/Project Report Submission/${submissionName}`,
    {
      method: "DELETE",
    }
  );

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error?.message || "Failed to delete submission");
  }

  return await res.json();
};