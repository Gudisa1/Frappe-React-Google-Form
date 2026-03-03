import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getSingleReportingForm } from "../../api/datacollection";
import { submitForm } from "../../api/pm";

const Submit = () => {
  const location = useLocation();
  const { formName, formTitle, project, currentUser } = location.state || {};
  const [form, setForm] = useState(null);
  const [formData, setFormData] = useState({});

  // Fallback: get PM from localStorage if not passed via state
  const pmFromStorage = JSON.parse(localStorage.getItem("projectManager"));
  const submittingUser = currentUser?.email || pmFromStorage?.email;

  console.log("Location state:", location.state);
  console.log("Project Manager from localStorage:", pmFromStorage);
  console.log("Submitting user email:", submittingUser);

  useEffect(() => {
    if (formName) {
      console.log("Fetching form for:", formName);
      getSingleReportingForm(formName)
        .then((data) => {
          console.log("Fetched form data:", data);
          setForm(data);

          // Initialize formData with empty values using a unique key for each field
          const initialData = {};
          data.fields.forEach((field, index) => {
            // Create a unique key for each field (combine field_name with index or use field.id if available)
            const uniqueKey = field.id || `${field.field_name}_${index}`;
            console.log("Initializing field:", field.field_name, "with unique key:", uniqueKey);
            initialData[uniqueKey] = {
              field_name: field.field_name,
              value: field.field_type === "Check" ? false : ""
            };
          });
          console.log("Initial formData state:", initialData);
          setFormData(initialData);
        })
        .catch((err) => console.error("Error fetching form:", err));
    }
  }, [formName]);

  const handleChange = (field, value, uniqueKey) => {
    setFormData((prev) => ({
      ...prev,
      [uniqueKey]: {
        ...prev[uniqueKey],
        value: value
      }
    }));
  };

  const renderField = (field, uniqueKey) => {
    const fieldValue = formData[uniqueKey]?.value;

    switch (field.field_type) {
      case "Data":
      case "Small Text":
      case "Text":
        return (
          <input
            type="text"
            value={fieldValue || ""}
            onChange={(e) => handleChange(field, e.target.value, uniqueKey)}
          />
        );
      case "Int":
      case "Float":
      case "Currency":
        return (
          <input
            type="number"
            value={fieldValue || ""}
            onChange={(e) => handleChange(field, e.target.value, uniqueKey)}
          />
        );
      case "Date":
        return (
          <input
            type="date"
            value={fieldValue || ""}
            onChange={(e) => handleChange(field, e.target.value, uniqueKey)}
          />
        );
      case "Select":
        return (
          <select
            value={fieldValue || ""}
            onChange={(e) => handleChange(field, e.target.value, uniqueKey)}
          >
            <option value="">Select...</option>
            {field.options?.split("\n").map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        );
      case "Check":
        return (
          <input
            type="checkbox"
            checked={fieldValue || false}
            onChange={(e) => handleChange(field, e.target.checked, uniqueKey)}
          />
        );
      default:
        return <input type="text" value={fieldValue || ""} readOnly />;
    }
  };

  const handleSubmit = async () => {
    console.log("Submitting form with data:", formData);
    console.log("Form name:", form?.name, "Project:", project, "Submitted by:", submittingUser);

    if (!submittingUser) {
      alert("Cannot determine who is submitting the form.");
      return;
    }
    if (!project) {
      alert("Project is required before submission.");
      return;
    }
    if (!form?.name) {
      alert("Form is not loaded properly.");
      return;
    }

    try {
      // Check for duplicate submission client-side
      const existingKey = `submitted_${form.name}_${project}`;
      if (localStorage.getItem(existingKey)) {
        alert("You have already submitted this form for this project.");
        return;
      }

      // Transform formData back to the format expected by the backend
      const submissionData = {};
      Object.values(formData).forEach(item => {
        submissionData[item.field_name] = item.value;
      });

      console.log("Transformed submission data:", submissionData);

      const response = await submitForm(form.name, project, submittingUser, submissionData);
      console.log("Form submission response:", response);

      // Save locally to prevent accidental double-submit
      localStorage.setItem(existingKey, "true");

      alert("Form submitted successfully!");
    } catch (err) {
      console.error("Form submission error:", err);
      alert("Failed to submit form: " + (err.message || "Unknown error"));
    }
  };

  if (!form) return <p>Loading form...</p>;

  return (
    <div>
      <h1>Submit Form</h1>
      <p>Form Title: {formTitle}</p>
      <p>Project: {project}</p>
      <p>Submitting as: {submittingUser}</p>

      {form.fields.map((field, index) => {
        // Create a unique key for each field
        const uniqueKey = field.id || `${field.field_name}_${index}`;
        
        return (
          <div key={uniqueKey} style={{ marginBottom: 15 }}>
            <label>
              {field.label} {field.required ? "*" : ""}
            </label>
            {renderField(field, uniqueKey)}
          </div>
        );
      })}

      <button onClick={handleSubmit}>Submit Form</button>
    </div>
  );
};

export default Submit;