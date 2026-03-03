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



// Get existing reporting forms
// api/datacollection.js

// Fetch all Reporting Forms
export async function getReportingForms() {
  try {
    const response = await fetch(
      `/api/resource/Reporting Form?fields=["name","form_title","reporting_period","year","status","creation","modified"]&limit_page_length=100`,
      {
        method: "GET",
        credentials: "include", // important if using Frappe session auth
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    // console.log("📦 Reporting Forms API Response:", data);
    // console.log("📊 Total Forms:", data.data?.length || 0);

    return data.data; // return only the array of forms
  } catch (error) {
    // console.error("❌ Failed to fetch Reporting Forms:", error);
    throw error;
  }
}

export async function getReportingFormByName(name) {
  try {
    console.log(`📤 Fetching Reporting Form: ${name}`);
    
    const response = await fetch(
      `/api/resource/Reporting Form/${name}`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log("📦 Form details received:", data.data);
    return data.data; // Returns the complete form with fields and target_projects
  } catch (error) {
    console.error(`❌ Failed to fetch Reporting Form ${name}:`, error);
    throw error;
  }
}

export async function getProjects() {
  const response = await fetch(
    `/api/resource/Project?fields=["*"]&limit_page_length=10`,
    {
      credentials: "include"
    }
  );

  const data = await response.json();
  console.log("📦 Projects:", data);
  return data;
}


// Create a new Reporting Form
// export async function createReportingForm(formData) {
//   try {
//     console.log('📤 Creating Reporting Form:', formData.form_title);
    
//     const response = await fetch('/api/resource/Reporting Form', {
//       method: 'POST',
//       credentials: 'include',
//       headers: {
//         'Content-Type': 'application/json',
//         'Accept': 'application/json'
//       },
//       body: JSON.stringify(formData)
//     });

//     const result = await response.json();
    
//     if (!response.ok) {
//       throw new Error(result.message || result.exception || `HTTP error ${response.status}`);
//     }
    
//     console.log('✅ Form created successfully:', result.data?.name || result.name);
//     return result;
//   } catch (error) {
//     console.error('❌ Failed to create Reporting Form:', error);
//     throw error;
//   }
// }

// Update an existing Reporting Form
export async function updateReportingForm(name, formData) {
  try {
    console.log('📤 Updating Reporting Form:', name);
    
    const response = await fetch(`/api/resource/Reporting Form/${name}`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(formData)
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.message || result.exception || `HTTP error ${response.status}`);
    }
    
    console.log('✅ Form updated successfully:', result.data?.name || result.name);
    return result;
  } catch (error) {
    console.error('❌ Failed to update Reporting Form:', error);
    throw error;
  }
}

export async function deleteReportingForm(name) {
  try {
    console.log(`📤 Deleting Reporting Form: ${name}`);
    
    const response = await fetch(`/api/resource/Reporting Form/${name}`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `HTTP error ${response.status}`);
    }

    console.log(`✅ Form ${name} deleted successfully`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to delete Reporting Form ${name}:`, error);
    throw error;
  }
}


// Create Project API

// createProject.js
export async function createProject(projectData) {
  try {
    const response = await fetch("/api/resource/Project", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // If using API key/secret, uncomment below:
        // "Authorization": "token YOUR_API_KEY:YOUR_API_SECRET"
      },
      body: JSON.stringify(projectData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.exception || "Failed to create project");
    }

    const result = await response.json();
    return result.data; // This is the created project
  } catch (error) {
    console.error("Error creating project:", error);
    throw error;
  }
}
// Get users with their Role
export async function fetchUsersWithRoles(roleFilter = null) {
  try {
    console.log("Fetching users from API...");

    const response = await fetch('/api/resource/User?fields=["name","full_name","email","roles.role"]', {
      headers: {
        "Content-Type": "application/json",
        // "Authorization": "token YOUR_API_KEY:YOUR_API_SECRET" // if needed
      }
    });

    console.log("Raw response status:", response.status);

    if (!response.ok) {
      const error = await response.json();
      console.error("Error response from API:", error);
      throw new Error(error.exception || "Failed to fetch users");
    }

    const rawUsers = await response.json();
    console.log("Raw users data from API:", rawUsers.data);

    const nestedUsers = Object.values(
      rawUsers.data.reduce((acc, user, index) => {
        if (!acc[user.email]) {
          acc[user.email] = {
            name: user.name,
            full_name: user.full_name,
            email: user.email,
            roles: []
          };
        }
        if (user.role) {
          acc[user.email].roles.push(user.role);
        }
        console.log(`Processed row ${index}:`, user, "Current nested user:", acc[user.email]);
        return acc;
      }, {})
    );

    console.log("Nested users after processing:", nestedUsers);

    // If a role filter is provided, only return users with that role
    if (roleFilter) {
      const filtered = nestedUsers.filter(u => u.roles.includes(roleFilter));
      console.log(`Users filtered by role "${roleFilter}":`, filtered);
      return filtered;
    }

    return nestedUsers;

  } catch (error) {
    console.error("Error fetching users with roles:", error);
    return [];
  }
}

// Update project by name
export async function updateProject(projectName, projectData) {
  try {
    console.log(`Updating project: ${projectName}`, projectData);

    const response = await fetch(`/api/resource/Project/${encodeURIComponent(projectName)}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        // "Authorization": "token YOUR_API_KEY:YOUR_API_SECRET" // optional
      },
      body: JSON.stringify(projectData)
    });

    const result = await response.json();
    console.log("Update response:", result);

    if (!response.ok) {
      throw new Error(result.exception || "Failed to update project");
    }

    return result.data;
  } catch (error) {
    console.error("Error updating project:", error);
    throw error;
  }
}


// Delete a project by name
export async function deleteProject(projectName) {
  try {
    console.log(`Deleting project: ${projectName}`);
    const response = await fetch(`/api/resource/Project/${projectName}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        // "Authorization": "token YOUR_API_KEY:YOUR_API_SECRET" // optional
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error deleting project:", errorData);
      throw new Error(errorData.exception || "Failed to delete project");
    }

    console.log(`Project ${projectName} deleted successfully.`);
    return true;
  } catch (error) {
    console.error("Error in deleteProject:", error);
    throw error;
  }
}

// Get a single project by its name
export async function getProject(projectName) {
  try {
    console.log(`Fetching project: ${projectName}`);
    const response = await fetch(`/api/resource/Project/${projectName}`, {
      headers: {
        "Content-Type": "application/json",
      
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error fetching project:", errorData);
      throw new Error(errorData.exception || `Failed to fetch project: ${projectName}`);
    }

    const result = await response.json();
    console.log("Single project data:", result);
    return result; // Return the project object directly
  } catch (error) {
    console.error("Error in getProject:", error);
    throw error;
  }
}

// src/api/reportingFormApi.js
export const createReportingForm = async (formData) => {
  try {
    const response = await fetch('/api/resource/Reporting Form', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to create reporting form');
    }

    return data;
  } catch (error) {
    console.error('Error creating reporting form:', error);
    throw error;
  }
};
export async function getAllReportingForms() {
  try {
    console.log("Fetching all Reporting Forms...");
    const response = await fetch('/api/resource/Reporting Form?fields=["*"]', {
      headers: {
        "Content-Type": "application/json",
        // "Authorization": "token YOUR_API_KEY:YOUR_API_SECRET" // if needed
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error fetching Reporting Forms:", errorData);
      throw new Error(errorData.exception || "Failed to fetch Reporting Forms");
    }

    const data = await response.json();
    console.log("Fetched Reporting Forms:", data.data);
    return data.data; // array of forms
  } catch (error) {
    console.error("Error in getAllReportingForms:", error);
    return [];
  }
}

// src/api/datacollection.js
export const getSingleReportingForm = async (formName) => {
  try {
    const response = await fetch(
      `/api/resource/Reporting Form/${encodeURIComponent(formName)}?fields=["*"]`
    );
    if (!response.ok) {
      throw new Error('Failed to fetch reporting form');
    }
    const data = await response.json();
    return data.data; // The form data
  } catch (err) {
    console.error(err);
    throw err;
  }
};