// hrapi.js



export const createEmployee = async (employeeData) => {
  try {
    const response = await fetch('/api/resource/Employee', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Uncomment if you need authentication
        // 'Authorization': 'token YOUR_API_KEY:YOUR_API_SECRET',
      },
      body: JSON.stringify(employeeData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create employee');
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error('Error creating employee:', error);
    throw error;
  }
};

export const getEmployees = async () => {
  // You can include filters, fields, pagination if needed
  const url = '/api/resource/Employee?fields=["*"]&limit_page_length=1000';

  const res = await fetch(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Failed to fetch employees');
  }

  const data = await res.json();
  return data.data; // Your API wraps employees in a `data` array
};

// hrapi.js

/**
 * Fetch a single employee by ID
 * @param {string} employeeId - The ID of the employee (e.g., 'EMP003')
 * @returns {Promise<Object>} - Returns the employee data object
 */
export const getEmployee = async (employeeId) => {
  try {
    const res = await fetch(`/api/resource/Employee/${employeeId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!res.ok) {
      // Try to parse the error from the server
      const error = await res.json().catch(() => ({}));
      throw new Error(error.message || `Failed to fetch employee ${employeeId}`);
    }

    const result = await res.json();
    return result.data; // "data" contains the employee object
  } catch (err) {
    console.error('getEmployee error:', err);
    throw err; // Let the caller handle it
  }
};

// api/hrapi.js
export async function updateEmployee(employeeId, payload) {
  try {
    const response = await fetch(`/api/resource/Employee/${employeeId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData?.message || 'Failed to update employee');
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    throw error;
  }
}

// api/hrapi.js - Add this function

// Add this at the bottom of your existing exports
export const deleteEmployee = async (employeeId) => {
  try {
    console.log(`Deleting employee ${employeeId}...`);
    
    const res = await fetch(`/api/resource/Employee/${employeeId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
        // Add authorization if needed
        // 'Authorization': 'token your_token'
      }
    });

    const responseData = await res.json().catch(() => ({}));
    console.log("Delete response:", responseData);

    if (!res.ok) {
      throw new Error(responseData.message || responseData.exception || `Failed to delete employee ${employeeId}`);
    }

    return true; // successful delete
  } catch (err) {
    console.error('deleteEmployee error:', err);
    throw err;
  }
};

export const createLeave = async (leaveData) => {
  console.log("API STEP 1: Sending →", leaveData);

  try {
    const response = await fetch(
`/api/resource/Leave` ,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(leaveData)
      }
    );

    console.log("API STEP 2: Raw response →", response);

    const data = await response.json();

    console.log("API STEP 3: Parsed response →", data);

    if (!response.ok) {
      throw new Error(data?.message || "Failed to create leave");
    }

    return data.data;

  } catch (error) {
    console.error("API ERROR ❌", error);
    throw error;
  }
};

export const getEmployeeLeaves = async (employeeId) => {
  try {
    // Using the exact endpoint format you provided
    const url = `/api/resource/Leave?filters=[["employee","=","${employeeId}"]]`;
    console.log("Fetching leaves from:", url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    console.log("Leaves fetch response:", data);

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch leaves');
    }

    return data.data || [];
  } catch (error) {
    console.error('Error fetching leaves:', error);
    throw error;
  }
};


// Medical Claim API functions
export const createMedicalClaim = async (claimData) => {
  try {
    const url = '/api/resource/Medical%20Claim';
    console.log("Creating medical claim at:", url, "with data:", claimData);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(claimData)
    });

    const data = await response.json();
    console.log("Medical claim create response:", data);

    if (!response.ok) {
      throw new Error(data.message || data.exception || 'Failed to create medical claim');
    }

    return data;
  } catch (error) {
    console.error('Error creating medical claim:', error);
    throw error;
  }
};


export async function createAsset(assetData) {
  const response = await fetch("/api/resource/Asset", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(assetData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.message || "Failed to create asset");
  }

  return data.data;
}

// export async function getAssets() {
//   const response = await fetch(
//     `/api/resource/Asset?fields=["name","asset_id","asset_code","project","asset_type","condition"]&limit_page_length=100`,
//     { credentials: "include" }
//   );
//   const data = await response.json();
//   return data.data;
// }

export async function getAssets() {
  const response = await fetch(
    `/api/resource/Asset?fields=["*"]&limit_page_length=1000`,
    { credentials: "include" }
  );
  const data = await response.json();
  return data.data;
}

// Also add a function to fetch projects if needed
export async function getProjects() {
  try {
    const response = await fetch(
      `/api/resource/Project?fields=["name"]&limit_page_length=1000`,
      { credentials: "include" }
    );
    const data = await response.json();
    // Extract just the project names from the response
    return data.data.map(project => project.name);
  } catch (error) {
    console.error("Failed to fetch projects", error);
    return [];
  }
}

// Delete asset by DocType name
export async function deleteAsset(name) {
  const res = await fetch(`/api/resource/Asset/${name}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to delete asset");
  return res.json();
}
export async function getAssetDetail(name) {
  const res = await fetch(`/api/resource/Asset/${name}`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch asset details");
  const data = await res.json();
  console.log("Asset details received:", data);
  return data.data; // returns all fields for this asset
}

export async function updateAsset(assetId, updatedData) {
  const res = await fetch(
    `/api/resource/Asset/${encodeURIComponent(assetId)}`,
    {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedData),
    }
  );

  if (!res.ok) throw new Error("Failed to update asset");

  const data = await res.json();
  return data.data;
}