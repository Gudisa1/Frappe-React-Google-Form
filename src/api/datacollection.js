// ==================== CONSTANTS & HELPERS ====================

const FIELD_TYPE_MAP = {
  'Data': 'Data',
  'Int': 'Int',
  'Float': 'Float',
  'Text': 'Text',
  'Date': 'Date',
  'Select': 'Select',
  'Check': 'Check',
  'Attach': 'Attach',
  'Small Text': 'Small Text',
  'JSON': 'JSON'
};

function mapFieldType(uiType) {
  return FIELD_TYPE_MAP[uiType] || 'Data';
}

// ==================== REPORTING FORM FUNCTIONS ====================

// Create complete reporting form with fields and targets
export async function createCompleteReportingForm(formData, fieldsData, projectsData) {
  console.log("📌 [createCompleteReportingForm] Starting form creation...");
  
  try {
    // Validation
    if (!projectsData || projectsData.length === 0) {
      throw new Error("No projects selected. At least one project is required.");
    }
    
    // STEP 1: Create the main Reporting Form WITH targets (since it's mandatory)
    console.log("📌 Step 1: Creating Reporting Form with targets...");
    
    // Prepare targets data with valid project references
    const targetsData = projectsData.map((project, index) => {
      // Ensure we have a valid project reference
      if (!project.name) {
        throw new Error(`Project at index ${index} has no name/ID`);
      }
      
      return {
        project: project.name, // This is the docname/ID - MANDATORY
        project_name: project.project_name || project.project_code || project.name,
        include: 1,
        idx: index + 1
      };
    });
    
    const formPayload = {
      form_title: formData.title,
      description: formData.description || '',
      reporting_period: formData.reportingPeriod,
      year: parseInt(formData.year) || new Date().getFullYear(),
      status: 'Draft', // Always start as Draft
      target_projects: targetsData // MUST include since field is mandatory
    };
    
    console.log("📌 Form payload:", JSON.stringify(formPayload, null, 2));
    
    const formRes = await fetch(`/api/resource/Reporting Form`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(formPayload),
    });
    
    const formResult = await formRes.json();
    
    if (!formRes.ok) {
      console.error("Form creation failed:", formResult);
      
      // Try to parse server message
      let errorMessage = formResult.message || "Failed to create form";
      if (formResult._server_messages) {
        try {
          const messages = JSON.parse(formResult._server_messages);
          if (messages.length > 0) {
            const msg = JSON.parse(messages[0]);
            errorMessage = msg.message || errorMessage;
          }
        } catch (e) {
          // Ignore parsing error
        }
      }
      
      throw new Error(errorMessage);
    }
    
    const formName = formResult.data.name;
    console.log("✅ Step 1: Form created with name:", formName);
    
    // STEP 2: Add fields to the form
    if (fieldsData && fieldsData.length > 0) {
      console.log("📌 Step 2: Adding fields to form...");
      
      for (let i = 0; i < fieldsData.length; i++) {
        const field = fieldsData[i];
        
        const fieldType = mapFieldType(field.type);
        
        let options = "";
        if (field.options && Array.isArray(field.options) && field.options.length > 0) {
          options = field.options.join("\n");
        }
        
        const fieldPayload = {
          label: field.label,
          field_type: fieldType,
          options: options,
          required: field.required ? 1 : 0,
          idx: i + 1,
          parent: formName,
          parentfield: "fields",
          parenttype: "Reporting Form"
        };
        
        console.log(`📌 Adding field ${i + 1}:`, fieldPayload);
        
        const fieldRes = await fetch(`/api/resource/Reporting Form Field`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(fieldPayload),
        });
        
        if (!fieldRes.ok) {
          const fieldResult = await fieldRes.json();
          console.warn(`⚠️ Failed to add field ${i + 1}:`, fieldResult);
        }
      }
      console.log("✅ Step 2: All fields added");
    }
    
    // STEP 3: Update status if published
    if (formData.status === 'Published') {
      console.log("📌 Step 3: Publishing form...");
      
      const publishRes = await fetch(`/api/resource/Reporting Form/${formName}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status: 'Published' }),
      });
      
      if (!publishRes.ok) {
        console.warn("⚠️ Failed to publish form, but form was created");
      } else {
        console.log("✅ Step 3: Form published");
      }
    }
    
    return {
      success: true,
      message: `Form "${formData.title}" created successfully!`,
      data: {
        formName,
        fieldsCount: fieldsData?.length || 0,
        projectsCount: projectsData?.length || 0
      }
    };
    
  } catch (error) {
    console.error("❌ [createCompleteReportingForm] Error:", error);
    throw error;
  }
}

// Add this after createCompleteReportingForm function
export async function publishForm(formName) {
  console.log("📌 [publishForm] Publishing form:", formName);
  
  try {
    const res = await fetch(`/api/resource/Reporting Form/${formName}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ status: 'Published' }),
    });
    
    const data = await res.json();
    
    if (!res.ok) {
      throw new Error(data.message || "Failed to publish form");
    }
    
    console.log("✅ Form published successfully:", data.data);
    return data.data;
    
  } catch (error) {
    console.error("❌ [publishForm] Error:", error);
    throw error;
  }
}

// Get existing reporting forms
export async function getReportingForms(status = null) {
  console.log("📌 [getReportingForms] Fetching forms...");
  
  let url = `/api/resource/Reporting Form?fields=["name","form_title","description","status","reporting_period","year","creation","modified"]&limit_page_length=100`;
  
  if (status) {
    url += `&filters=${encodeURIComponent(
      JSON.stringify([["status", "=", status]])
    )}`;
  }
  
  try {
    const res = await fetch(url, {
      credentials: "include",
    });
    
    const data = await res.json();
    
    if (!res.ok) {
      throw new Error(data.message || "Failed to fetch reporting forms");
    }
    
    const forms = data.data || [];
    
    // Get counts for each form
    for (let form of forms) {
      try {
        const fieldsRes = await fetch(`/api/resource/Reporting Form Field?filters=[["parent","=","${form.name}"]]&limit_page_length=0`, {
          credentials: "include",
        });
        const fieldsData = await fieldsRes.json();
        form.fields_count = fieldsData.data?.length || 0;
      } catch (e) {
        form.fields_count = 0;
      }
      
      try {
        const targetsRes = await fetch(`/api/resource/Reporting Form Target?filters=[["parent","=","${form.name}"]]&limit_page_length=0`, {
          credentials: "include",
        });
        const targetsData = await targetsRes.json();
        form.targets_count = targetsData.data?.length || 0;
      } catch (e) {
        form.targets_count = 0;
      }
    }
    
    return forms;
    
  } catch (error) {
    console.error("❌ [getReportingForms] Error:", error);
    throw error;
  }
}

// Get form details with child tables
export async function getFormDetails(formName) {
  try {
    const res = await fetch(`/api/resource/Reporting Form/${formName}`, {
      credentials: "include",
    });
    
    const data = await res.json();
    
    if (!res.ok) {
      throw new Error(data.message || "Failed to fetch form details");
    }
    
    return data.data;
    
  } catch (error) {
    console.error("❌ [getFormDetails] Error:", error);
    throw error;
  }
}

// Get form fields
export async function getFormFields(formName) {
  try {
    const res = await fetch(`/api/resource/Reporting Form Field?filters=[["parent","=","${formName}"]]&fields=["name","label","field_type","required","options","idx"]&order_by=idx`, {
      credentials: "include",
    });
    
    const data = await res.json();
    return data.data || [];
    
  } catch (error) {
    console.error("❌ [getFormFields] Error:", error);
    return [];
  }
}

// Get form targets
export async function getFormTargets(formName) {
  try {
    const res = await fetch(`/api/resource/Reporting Form Target?filters=[["parent","=","${formName}"]]&fields=["name","project","project_name","include","idx"]&order_by=idx`, {
      credentials: "include",
    });
    
    const data = await res.json();
    return data.data || [];
    
  } catch (error) {
    console.error("❌ [getFormTargets] Error:", error);
    return [];
  }
}

// Update form
export async function updateForm(formName, formData) {
  try {
    const res = await fetch(`/api/resource/Reporting Form/${formName}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(formData),
    });
    
    const data = await res.json();
    
    if (!res.ok) {
      throw new Error(data.message || "Failed to update form");
    }
    
    return data.data;
    
  } catch (error) {
    console.error("❌ [updateForm] Error:", error);
    throw error;
  }
}

// Delete form
export async function deleteForm(formName) {
  try {
    const res = await fetch(`/api/resource/Reporting Form/${formName}`, {
      method: "DELETE",
      credentials: "include",
    });
    
    const data = await res.json();
    
    if (!res.ok) {
      throw new Error(data.message || "Failed to delete form");
    }
    
    return data;
    
  } catch (error) {
    console.error("❌ [deleteForm] Error:", error);
    throw error;
  }
}

// ==================== PROJECT FUNCTIONS ====================

// Get projects with error handling
export async function getProjects() {
  console.log("📌 [getProjects] Fetching projects...");
  
  try {
    const res = await fetch(`/api/resource/Project?fields=["name","project_name","project_code","status","region","district","project_manager","start_date","end_date","description"]&filters=[["status","=","Active"]]&limit=1000`, {
      credentials: "include",
    });
    
    const data = await res.json();
    
    if (!res.ok) {
      throw new Error(data.message || "Failed to fetch projects");
    }
    
    // Transform the data to ensure project_name exists
    const projects = (data.data || []).map(project => ({
      ...project,
      project_name: project.project_name || project.project_code || project.name
    }));
    
    console.log(`✅ Loaded ${projects.length} projects`);
    return projects;
    
  } catch (error) {
    console.error("❌ [getProjects] Error:", error);
    return [];
  }
}

// ==================== SUBMISSIONS FUNCTIONS ====================

// Submit a report for a specific project and form
export async function submitProjectReport(formName, projectName, formData, userId) {
  console.log("📌 [submitProjectReport] Submitting report...");
  
  try {
    const submissionPayload = {
      reporting_form: formName,
      project: projectName,
      submitted_by: userId,
      data: JSON.stringify(formData),
      status: "Submitted"
    };
    
    const res = await fetch(`/api/resource/Project Report Submission`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(submissionPayload),
    });
    
    const data = await res.json();
    
    if (!res.ok) {
      throw new Error(data.message || "Failed to submit report");
    }
    
    console.log("✅ Report submitted successfully:", data.data);
    return data.data;
    
  } catch (error) {
    console.error("❌ [submitProjectReport] Error:", error);
    throw error;
  }
}

// Get all submissions
export async function getSubmissions(filters = null) {
  let url = `/api/resource/Project Report Submission?fields=["name","project","submitted_by","status","reporting_form","review_comment","creation","modified","data"]&order_by=creation desc&limit_page_length=100`;

  if (filters) {
    const filterArray = [];
    
    if (typeof filters === 'object' && !Array.isArray(filters)) {
      for (const [key, value] of Object.entries(filters)) {
        if (value !== null && value !== undefined && value !== '') {
          filterArray.push([key, "=", value]);
        }
      }
    } else if (Array.isArray(filters) && filters.length > 0) {
      filterArray.push(...filters);
    }
    
    if (filterArray.length > 0) {
      url += `&filters=${encodeURIComponent(JSON.stringify(filterArray))}`;
    }
  }

  try {
    const res = await fetch(url, {
      credentials: "include",
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Failed to fetch submissions");
    }

    return data.data || [];

  } catch (error) {
    console.error("❌ [getSubmissions] Error:", error);
    return [];
  }
}

// Get submissions for a specific form
export async function getFormSubmissions(formName) {
  try {
    const res = await fetch(`/api/resource/Project Report Submission?filters=[["reporting_form","=","${formName}"]]&fields=["name","project","submitted_by","status","creation","data","review_comment"]&order_by=creation desc`, {
      credentials: "include",
    });
    
    const data = await res.json();
    return data.data || [];
    
  } catch (error) {
    console.error("❌ [getFormSubmissions] Error:", error);
    return [];
  }
}

// Update submission status
export async function updateSubmissionStatus(submissionId, status, reviewComment = '') {
  try {
    const updateData = { status };
    
    if (reviewComment) {
      updateData.review_comment = reviewComment;
    }
    
    const res = await fetch(`/api/resource/Project Report Submission/${submissionId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(updateData),
    });
    
    const data = await res.json();
    
    if (!res.ok) {
      throw new Error(data.message || "Failed to update submission");
    }
    
    return data.data;
    
  } catch (error) {
    console.error("❌ [updateSubmissionStatus] Error:", error);
    throw error;
  }
}

// Parse submission data
export function parseSubmissionData(submission) {
  try {
    if (submission.data) {
      return typeof submission.data === 'string' 
        ? JSON.parse(submission.data) 
        : submission.data;
    }
    return {};
  } catch (error) {
    console.error("❌ [parseSubmissionData] Error:", error);
    return {};
  }
}

// ==================== DASHBOARD STATS ====================

export async function getDashboardStats() {
  try {
    const [projectsRes, formsRes, submissionsRes] = await Promise.all([
      fetch(`/api/resource/Project?fields=["name"]&limit_page_length=0`, { credentials: "include" }),
      fetch(`/api/resource/Reporting Form?fields=["name","status"]&limit_page_length=0`, { credentials: "include" }),
      fetch(`/api/resource/Project Report Submission?fields=["name","status"]&limit_page_length=0`, { credentials: "include" })
    ]);

    const projectsData = await projectsRes.json();
    const formsData = await formsRes.json();
    const submissionsData = await submissionsRes.json();
    
    const totalProjects = projectsData.data?.length || 0;
    const totalForms = formsData.data?.length || 0;
    const publishedForms = formsData.data?.filter(f => f.status === 'Published')?.length || 0;
    const totalSubmissions = submissionsData.data?.length || 0;
    const pendingSubmissions = submissionsData.data?.filter(sub => sub.status === 'Submitted')?.length || 0;
    const approvedSubmissions = submissionsData.data?.filter(sub => sub.status === 'Approved')?.length || 0;
    
    return {
      totalProjects,
      totalForms,
      publishedForms,
      totalSubmissions,
      pendingSubmissions,
      approvedSubmissions,
      completedSubmissions: totalSubmissions - pendingSubmissions
    };
    
  } catch (error) {
    console.error("❌ [getDashboardStats] Error:", error);
    return {
      totalProjects: 0,
      totalForms: 0,
      publishedForms: 0,
      totalSubmissions: 0,
      pendingSubmissions: 0,
      approvedSubmissions: 0,
      completedSubmissions: 0
    };
  }
}

// ==================== UTILITY FUNCTIONS ====================

export async function exportToCSV(data, filename = 'export.csv') {
  if (!data || data.length === 0) {
    console.warn("No data to export");
    return;
  }

  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header] || '';
        return typeof value === 'string' && value.includes(',') 
          ? `"${value}"` 
          : value;
      }).join(',')
    )
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}