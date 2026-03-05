// import React, { useEffect, useState } from "react";
// import { useLocation ,useNavigate} from "react-router-dom";
// import { getSingleReportingForm } from "../../api/datacollection";
// import { submitForm } from "../../api/pm";

// const Submit = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const formName = localStorage.getItem("selectedFormName");
// const formTitle = localStorage.getItem("selectedFormTitle");
// const project = localStorage.getItem("selectedProject");
// const pm = JSON.parse(localStorage.getItem("projectManager"));
// const email = pm?.email;
// const [submitting, setSubmitting] = useState(false); // ✅ Track submit state
//   const [error, setError] = useState(null); // ✅ Track error state


//   // const { formName, formTitle, project } = location.state || {};
//   console.log(formName,formTitle,project)

//   const [form, setForm] = useState(null);
//   const [formData, setFormData] = useState({});
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const loadForm = async () => {
//       try {
//         const data = await getSingleReportingForm(formName);
//         setForm(data);

//         // initialize form data
//         const initialData = {};
//         data.fields.forEach((f) => {
//           initialData[f.field_name] = "";
//         });

//         setFormData(initialData);
//       } catch (err) {
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (formName) loadForm();
//       console.log(formName,project)

//   }, [formName]);

//   const handleChange = (field, value) => {
//     setFormData({
//       ...formData,
//       [field]: value,
//     });
//   };

//  const handleSubmit = async () => {
//     setSubmitting(true);
//     setError(null);

//     const payload = {
//       doctype: "Project Report Submission",
//       reporting_form: formName,
//       project,
//       submitted_by: email,
//       status: "Submitted",
//       data: JSON.stringify(formData),
//     };

//     try {
//       const result = await submitForm(payload);
//       // Backend can include "error" field if submission fails
//       if (result.error || result.exc) {
//         throw new Error(result.message || result.exc || "Submission failed");
//       }

//       alert("Form submitted successfully");
//       navigate("/submission-list", { state: { projectName: project } });
//     } catch (err) {
//       console.error("Submit error:", err);
//       setError(err.message || "Submission failed");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   if (loading) return <p>Loading form...</p>;
//   if (!form) return <p>No form found</p>;

//   return (
//     <div>
//       <h1>{formTitle}</h1>
//             {error && <p style={{ color: "red" }}>{error}</p>}

//       {form.fields.map((field) => (
//         <div key={field.field_name} style={{ marginBottom: "15px" }}>
//           <label>
//             {field.label} {field.required ? "*" : ""}
//           </label>

//           {field.field_type === "Small Text" ? (
//             <textarea
//               value={formData[field.field_name]}
//               onChange={(e) =>
//                 handleChange(field.field_name, e.target.value)
//               }
//             />
//           ) : (
//             <input
//               type={
//                 field.field_type === "Float" || field.field_type === "Int"
//                   ? "number"
//                   : "text"
//               }
//               value={formData[field.field_name]}
//               onChange={(e) =>
//                 handleChange(field.field_name, e.target.value)
//               }
//             />
//           )}
//         </div>
//       ))}

// <button onClick={handleSubmit} disabled={submitting}>
//         {submitting ? "Submitting..." : "Submit Report"}
//       </button>    </div>
//   );
// };

// export default Submit;

// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { getSingleReportingForm } from "../../api/datacollection";
// import { submitForm } from "../../api/pm";

// const Submit = () => {
//   const navigate = useNavigate();
//   const formName = localStorage.getItem("selectedFormName");
//   const formTitle = localStorage.getItem("selectedFormTitle");
//   const project = localStorage.getItem("selectedProject");
//   const pm = JSON.parse(localStorage.getItem("projectManager"));
//   const email = pm?.email;

//   const [form, setForm] = useState(null);
//   const [formData, setFormData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [submitting, setSubmitting] = useState(false);
//   const [error, setError] = useState(null);

//   // Load the reporting form
//   useEffect(() => {
//     const loadForm = async () => {
//       try {
//         const data = await getSingleReportingForm(formName);
//         setForm(data);

//         // Initialize formData as array of objects for each field
//         const initialData = data.fields.map((field) => ({
//           field_name: field.field_name,
//           value: field.field_type === "Check" ? false :
//                  field.field_type === "MultiSelect" ? [] : "",
//         }));

//         setFormData(initialData);
//       } catch (err) {
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (formName) loadForm();
//   }, [formName]);

//   // Handle field value changes
//   const handleChange = (index, value) => {
//     setFormData((prev) => {
//       const newData = [...prev];
//       newData[index] = { ...newData[index], value };
//       return newData;
//     });
//   };

//   // Submit the form
//   const handleSubmit = async () => {
//     setSubmitting(true);
//     setError(null);

//     // Prepare payload using real field_name
//     const payload = {
//       doctype: "Project Report Submission",
//       reporting_form: formName,
//       project,
//       submitted_by: email,
//       status: "Submitted",
//       data: JSON.stringify(
//         formData.reduce((acc, f) => {
//           acc[f.field_name] = f.value;
//           return acc;
//         }, {})
//       ),
//     };

//     try {
//       const result = await submitForm(payload);
//       if (result.error || result.exc) {
//         throw new Error(result.message || result.exc || "Submission failed");
//       }

//       alert("Form submitted successfully");
//       navigate("/submission-list", { state: { projectName: project } });
//     } catch (err) {
//       console.error("Submit error:", err);
//       setError(err.message || "Submission failed");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   if (loading) return <p>Loading form...</p>;
//   if (!form) return <p>No form found</p>;

//   return (
//     <div>
//       <h1>{formTitle}</h1>
//       {error && <p style={{ color: "red" }}>{error}</p>}

//       {form.fields.map((field, index) => {
//         const fieldValue = formData[index]?.value || "";

//         let inputElement;
//         switch (field.field_type) {
//           case "Small Text":
//             inputElement = (
//               <textarea
//                 value={fieldValue}
//                 onChange={(e) => handleChange(index, e.target.value)}
//               />
//             );
//             break;
//           case "Int":
//           case "Float":
//           case "Currency":
//             inputElement = (
//               <input
//                 type="number"
//                 value={fieldValue}
//                 onChange={(e) => handleChange(index, e.target.value)}
//               />
//             );
//             break;
//           case "Date":
//           case "Datetime":
//           case "Time":
//             inputElement = (
//               <input
//                 type={field.field_type.toLowerCase()}
//                 value={fieldValue}
//                 onChange={(e) => handleChange(index, e.target.value)}
//               />
//             );
//             break;
//           case "Check":
//             inputElement = (
//               <input
//                 type="checkbox"
//                 checked={!!fieldValue}
//                 onChange={(e) => handleChange(index, e.target.checked)}
//               />
//             );
//             break;
//           case "Select":
//           case "MultiSelect":
//             inputElement = (
//               <select
//                 multiple={field.field_type === "MultiSelect"}
//                 value={fieldValue}
//                 onChange={(e) => {
//                   const value =
//                     field.field_type === "MultiSelect"
//                       ? Array.from(e.target.selectedOptions, (o) => o.value)
//                       : e.target.value;
//                   handleChange(index, value);
//                 }}
//               >
//                 {field.options?.split("\n").map((opt) => (
//                   <option key={opt} value={opt}>
//                     {opt}
//                   </option>
//                 ))}
//               </select>
//             );
//             break;
//           case "Attach":
//           case "Attach Image":
//             inputElement = (
//               <input
//                 type="file"
//                 onChange={(e) => handleChange(index, e.target.files[0])}
//               />
//             );
//             break;
//           case "Link":
//           case "Rating":
//           default:
//             inputElement = (
//               <input
//                 type="text"
//                 value={fieldValue}
//                 onChange={(e) => handleChange(index, e.target.value)}
//               />
//             );
//         }

//         return (
//           <div key={`${field.field_name}_${index}`} style={{ marginBottom: "15px" }}>
//             <label>
//               {field.label} {field.required ? "*" : ""}
//             </label>
//             {inputElement}
//           </div>
//         );
//       })}

//       <button onClick={handleSubmit} disabled={submitting}>
//         {submitting ? "Submitting..." : "Submit Report"}
//       </button>
//     </div>
//   );
// };

// export default Submit;
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getSingleReportingForm } from "../../api/datacollection";
import { submitForm } from "../../api/pm";
import "./Submit.css";

const Submit = () => {
  const navigate = useNavigate();
  const formName = localStorage.getItem("selectedFormName");
  const formTitle = localStorage.getItem("selectedFormTitle");
  const project = localStorage.getItem("selectedProject");
  const pm = JSON.parse(localStorage.getItem("projectManager"));
  const email = pm?.email;

  const [form, setForm] = useState(null);
  const [formData, setFormData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  
  // Modal states
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [previewData, setPreviewData] = useState(null);

  // Load the reporting form
  useEffect(() => {
    const loadForm = async () => {
      try {
        const data = await getSingleReportingForm(formName);
        setForm(data);

        // Initialize formData as array of objects for each field
        const initialData = data.fields.map((field) => ({
          field_name: field.field_name,
          field_label: field.label,
          field_type: field.field_type,
          value: getDefaultValueForFieldType(field.field_type),
        }));

        setFormData(initialData);
      } catch (err) {
        console.error(err);
        setError("Failed to load form");
      } finally {
        setLoading(false);
      }
    };

    if (formName) loadForm();
  }, [formName]);

  // Get default value based on field type
  const getDefaultValueForFieldType = (fieldType) => {
    switch (fieldType) {
      case "Check":
        return false;
      case "MultiSelect":
        return [];
      case "Table":
        return []; // Table will need special handling
      case "Int":
      case "Float":
      case "Currency":
        return "";
      case "Date":
      case "Datetime":
      case "Time":
        return "";
      case "Attach":
      case "Attach Image":
        return null;
      case "Select":
      case "Link":
      case "Rating":
      case "Data":
      case "Small Text":
      case "Text":
      default:
        return "";
    }
  };

  // Handle field value changes
  const handleChange = (index, value) => {
    setFormData((prev) => {
      const newData = [...prev];
      newData[index] = { ...newData[index], value };
      return newData;
    });
  };

  // Handle table field changes (if needed)
  const handleTableChange = (index, rowIndex, fieldName, value) => {
    setFormData((prev) => {
      const newData = [...prev];
      const tableData = [...(newData[index].value || [])];
      if (!tableData[rowIndex]) tableData[rowIndex] = {};
      tableData[rowIndex][fieldName] = value;
      newData[index] = { ...newData[index], value: tableData };
      return newData;
    });
  };

  // Handle preview button click
  const handlePreview = () => {
    // Check if all required fields are filled
    const missingRequired = form.fields.some((field, index) => {
      if (field.required) {
        const value = formData[index]?.value;
        if (value === undefined || value === null || value === "") return true;
        if (Array.isArray(value) && value.length === 0) return true;
        if (typeof value === 'boolean' && value === false) return false; // Checkbox false is valid
      }
      return false;
    });

    if (missingRequired) {
      setError("Please fill in all required fields");
      return;
    }

    // Prepare preview data
    const preview = formData.map(item => ({
      label: item.field_label,
      value: formatValueForPreview(item.value, item.field_type),
      field_type: item.field_type
    }));
    
    setPreviewData(preview);
    setShowPreviewModal(true);
    setError(null);
  };

  // Format value for preview display
  const formatValueForPreview = (value, fieldType) => {
    if (value === null || value === undefined || value === "") {
      return <span className="preview-empty">—</span>;
    }

    switch (fieldType) {
      case "Check":
        return value ? "✓ Yes" : "✗ No";
      case "MultiSelect":
        return Array.isArray(value) && value.length > 0 
          ? value.join(", ") 
          : <span className="preview-empty">None selected</span>;
      case "Table":
        return Array.isArray(value) && value.length > 0 
          ? `${value.length} row(s)` 
          : <span className="preview-empty">No rows</span>;
      case "Attach":
      case "Attach Image":
        return value?.name || <span className="preview-empty">File selected</span>;
      case "Date":
        return value ? new Date(value).toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        }) : "—";
      case "Datetime":
        return value ? new Date(value).toLocaleString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }) : "—";
      case "Time":
        return value;
      case "Int":
      case "Float":
      case "Currency":
        return value;
      default:
        return value;
    }
  };

  // Handle first confirmation (from preview modal)
  const handleConfirmFromPreview = () => {
    setShowPreviewModal(false);
    setShowConfirmModal(true);
  };

  // Handle final submission
  const handleFinalSubmit = async () => {
    setShowConfirmModal(false);
    setSubmitting(true);
    setError(null);

    // Prepare payload using real field_name
    const payload = {
      doctype: "Project Report Submission",
      reporting_form: formName,
      project,
      submitted_by: email,
      status: "Submitted",
      data: JSON.stringify(
        formData.reduce((acc, f) => {
          acc[f.field_name] = f.value;
          return acc;
        }, {})
      ),
    };

    try {
      const result = await submitForm(payload);
      if (result.error || result.exc) {
        throw new Error(result.message || result.exc || "Submission failed");
      }

      alert("✅ Form submitted successfully");
      navigate("/submission-list", { state: { projectName: project } });
    } catch (err) {
      console.error("Submit error:", err);
      setError(err.message || "Submission failed");
      setSubmitting(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    setShowPreviewModal(false);
    setShowConfirmModal(false);
    setPreviewData(null);
  };

  // Get current field value safely
  const getFieldValue = (index) => {
    if (!formData[index]) return "";
    return formData[index].value;
  };

  if (loading) {
    return (
      <div className="submit-loading">
        <div className="loading-spinner"></div>
        <p>Loading form...</p>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="submit-error">
        <h2>Form not found</h2>
        <p>The requested form could not be loaded.</p>
        <button onClick={() => navigate(-1)}>Go Back</button>
      </div>
    );
  }

  return (
    <div className="submit-container">
      <div className="submit-header">
        <h1>{formTitle}</h1>
        <div className="form-meta">
          <span className="project-badge">📁 {project}</span>
          <span className="form-id">📋 {formName}</span>
        </div>
      </div>

      {error && (
        <div className="error-message">
          <span>⚠️</span>
          <p>{error}</p>
        </div>
      )}

      <div className="form-progress">
        <div className="progress-step active">
          <span className="step-number">1</span>
          <span className="step-label">Fill Form</span>
        </div>
        <div className="progress-line"></div>
        <div className="progress-step">
          <span className="step-number">2</span>
          <span className="step-label">Preview</span>
        </div>
        <div className="progress-line"></div>
        <div className="progress-step">
          <span className="step-number">3</span>
          <span className="step-label">Confirm</span>
        </div>
      </div>

      <form className="submit-form" onSubmit={(e) => e.preventDefault()}>
        {form.fields.map((field, index) => {
          const fieldValue = getFieldValue(index);
          const isRequired = field.required;

          return (
            <div 
              key={`${field.field_name}_${index}`} 
              className={`form-group ${field.field_type?.toLowerCase()}`}
            >
              <label>
                {field.label}
                {isRequired && <span className="required">*</span>}
                {field.description && (
                  <span className="field-description">{field.description}</span>
                )}
              </label>

              {/* Data / Small Text / Text */}
              {["Data", "Small Text", "Text"].includes(field.field_type) && (
                <input
                  type="text"
                  value={fieldValue}
                  onChange={(e) => handleChange(index, e.target.value)}
                  placeholder={`Enter ${field.label}`}
                />
              )}

              {/* Int / Float / Currency */}
              {["Int", "Float", "Currency"].includes(field.field_type) && (
                <input
                  type="number"
                  step={field.field_type === "Int" ? "1" : "0.01"}
                  value={fieldValue}
                  onChange={(e) => handleChange(index, e.target.value)}
                  placeholder={`Enter ${field.label}`}
                />
              )}

              {/* Date / Datetime / Time */}
              {field.field_type === "Date" && (
                <input
                  type="date"
                  value={fieldValue}
                  onChange={(e) => handleChange(index, e.target.value)}
                />
              )}

              {field.field_type === "Datetime" && (
                <input
                  type="datetime-local"
                  value={fieldValue}
                  onChange={(e) => handleChange(index, e.target.value)}
                />
              )}

              {field.field_type === "Time" && (
                <input
                  type="time"
                  value={fieldValue}
                  onChange={(e) => handleChange(index, e.target.value)}
                />
              )}

              {/* Select */}
              {field.field_type === "Select" && (
                <select
                  value={fieldValue}
                  onChange={(e) => handleChange(index, e.target.value)}
                >
                  <option value="">Select an option</option>
                  {field.options?.split("\n").map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              )}

              {/* Check */}
              {field.field_type === "Check" && (
                <div className="checkbox-wrapper">
                  <input
                    type="checkbox"
                    checked={fieldValue === true}
                    onChange={(e) => handleChange(index, e.target.checked)}
                    id={`check-${index}`}
                  />
                  <label htmlFor={`check-${index}`}>Yes</label>
                </div>
              )}

              {/* MultiSelect */}
              {field.field_type === "MultiSelect" && (
                <select
                  multiple
                  value={fieldValue}
                  onChange={(e) => {
                    const selected = Array.from(e.target.selectedOptions, (o) => o.value);
                    handleChange(index, selected);
                  }}
                  className="multiselect"
                  size={4}
                >
                  {field.options?.split("\n").map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              )}

              {/* Attach / Attach Image */}
              {["Attach", "Attach Image"].includes(field.field_type) && (
                <div className="file-input-wrapper">
                  <input
                    type="file"
                    onChange={(e) => handleChange(index, e.target.files[0])}
                    accept={field.field_type === "Attach Image" ? "image/*" : "*/*"}
                  />
                  {fieldValue && (
                    <span className="file-name">{fieldValue.name}</span>
                  )}
                </div>
              )}

              {/* Link */}
              {field.field_type === "Link" && (
                <input
                  type="text"
                  value={fieldValue}
                  onChange={(e) => handleChange(index, e.target.value)}
                  placeholder={`Search or enter ${field.label}`}
                />
              )}

              {/* Rating */}
              {field.field_type === "Rating" && (
                <select
                  value={fieldValue}
                  onChange={(e) => handleChange(index, parseInt(e.target.value))}
                >
                  <option value="">Select rating</option>
                  {[1, 2, 3, 4, 5].map((num) => (
                    <option key={num} value={num}>
                      {"★".repeat(num)}{"☆".repeat(5-num)} ({num}/5)
                    </option>
                  ))}
                </select>
              )}

              {/* Table - Complex, needs special handling */}
              {field.field_type === "Table" && (
                <div className="table-field">
                  <p className="table-placeholder">Table field: {field.label}</p>
                  <button 
                    type="button" 
                    className="add-row-btn"
                    onClick={() => {
                      const currentRows = fieldValue || [];
                      handleChange(index, [...currentRows, {}]);
                    }}
                  >
                    + Add Row
                  </button>
                  {Array.isArray(fieldValue) && fieldValue.map((row, rowIdx) => (
                    <div key={rowIdx} className="table-row">
                      <span>Row {rowIdx + 1}</span>
                      <button 
                        type="button"
                        onClick={() => {
                          const newRows = fieldValue.filter((_, i) => i !== rowIdx);
                          handleChange(index, newRows);
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        <div className="form-actions">
          <button
            type="button"
            className="cancel-btn"
            onClick={() => navigate(-1)}
          >
            Cancel
          </button>
          <button
            type="button"
            className="preview-btn"
            onClick={handlePreview}
          >
            Preview Submission
          </button>
        </div>
      </form>

      {/* Preview Modal */}
      {showPreviewModal && previewData && (
        <div className="modal-overlay" onClick={handleCancel}>
          <div className="modal-content preview-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Preview Submission</h2>
              <button className="close-btn" onClick={handleCancel}>×</button>
            </div>
            
            <div className="modal-body">
              <div className="preview-summary">
                <div className="summary-item">
                  <span className="summary-label">Form:</span>
                  <span className="summary-value">{formTitle}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Project:</span>
                  <span className="summary-value">{project}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Submitted by:</span>
                  <span className="summary-value">{pm?.full_name || email}</span>
                </div>
              </div>

              <div className="preview-grid">
                {previewData.map((item, index) => (
                  <div key={index} className="preview-item">
                    <div className="preview-label">{item.label}</div>
                    <div className={`preview-value ${item.field_type?.toLowerCase()}`}>
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>

              <div className="preview-warning">
                <span>⚠️</span>
                <p>Once submitted, you cannot edit this form. Please review carefully.</p>
              </div>
            </div>

            <div className="modal-footer">
              <button className="secondary-btn" onClick={handleCancel}>
                Edit Form
              </button>
              <button className="primary-btn" onClick={handleConfirmFromPreview}>
                Continue to Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Final Confirmation Modal */}
      {showConfirmModal && (
        <div className="modal-overlay" onClick={handleCancel}>
          <div className="modal-content confirm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header warning">
              <h2>Confirm Submission</h2>
            </div>
            
            <div className="modal-body">
              <div className="confirm-icon">❗</div>
              <h3>Are you absolutely sure?</h3>
              <p>This action cannot be undone. Once submitted, you will not be able to edit this form.</p>
            </div>

            <div className="modal-footer">
              <button className="secondary-btn" onClick={handleCancel}>
                Go Back
              </button>
              <button 
                className="danger-btn" 
                onClick={handleFinalSubmit}
                disabled={submitting}
              >
                {submitting ? "Submitting..." : "Yes, Submit Form"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Submit;