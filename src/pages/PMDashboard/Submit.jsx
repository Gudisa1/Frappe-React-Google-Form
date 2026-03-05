import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getSingleReportingForm } from "../../api/datacollection";
import { submitForm } from "../../api/pm";

const Submit = () => {
  const location = useLocation();
  const formName = localStorage.getItem("selectedFormName");
const formTitle = localStorage.getItem("selectedFormTitle");
const project = localStorage.getItem("selectedProject");
const pm = JSON.parse(localStorage.getItem("projectManager"));
const email = pm?.email;

  // const { formName, formTitle, project } = location.state || {};
  console.log(formName,formTitle,project)

  const [form, setForm] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadForm = async () => {
      try {
        const data = await getSingleReportingForm(formName);
        setForm(data);

        // initialize form data
        const initialData = {};
        data.fields.forEach((f) => {
          initialData[f.field_name] = "";
        });

        setFormData(initialData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (formName) loadForm();
      console.log(formName,project)

  }, [formName]);

  const handleChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

const handleSubmit = async () => {
  try {
    const payload = {
      doctype: "Project Report Submission",
      reporting_form: formName,
      project: project,
      submitted_by: email,
      status: "Submitted",
      data: JSON.stringify(formData),
    };

    console.log("Submitting:", payload);

    await submitForm(payload);

    alert("Form submitted successfully");
  } catch (err) {
    console.error(err);
    alert("Submission failed");
  }
};

  if (loading) return <p>Loading form...</p>;
  if (!form) return <p>No form found</p>;

  return (
    <div>
      <h1>{formTitle}</h1>

      {form.fields.map((field) => (
        <div key={field.field_name} style={{ marginBottom: "15px" }}>
          <label>
            {field.label} {field.required ? "*" : ""}
          </label>

          {field.field_type === "Small Text" ? (
            <textarea
              value={formData[field.field_name]}
              onChange={(e) =>
                handleChange(field.field_name, e.target.value)
              }
            />
          ) : (
            <input
              type={
                field.field_type === "Float" || field.field_type === "Int"
                  ? "number"
                  : "text"
              }
              value={formData[field.field_name]}
              onChange={(e) =>
                handleChange(field.field_name, e.target.value)
              }
            />
          )}
        </div>
      ))}

      <button onClick={handleSubmit}>Submit Report</button>
    </div>
  );
};

export default Submit;