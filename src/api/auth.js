
const getLoggedUser = async () => {
  console.log("Step 1: Starting getLoggedUser function");
  
  try {
    // Step 1: get username from session
    console.log("Step 2: Fetching logged user from session...");
    const res = await fetch("/api/method/frappe.auth.get_logged_user", {
      credentials: "include",
    });
    console.log("Step 3: Session fetch response status:", res.status);
    const data = await res.json();
    console.log("Step 4: Session data:", data);
    
    const username = data.message !== "Guest" ? data.message : null;
    console.log("Step 5: Extracted username:", username);
    
    if (!username) {
      console.log("Step 6: No username found (Guest user)");
      return null;
    }

    // Step 2: fetch user document with roles
    console.log("Step 7: Fetching user document for:", username);
    const userRes = await fetch(
      `/api/resource/User/${encodeURIComponent(username)}?fields=["name","email","full_name","user_image","roles"]`,
      { credentials: "include" }
    );
    console.log("Step 8: User API response status:", userRes.status);
    
    const userData = await userRes.json();
    console.log("Step 9: Complete user data response:", userData);
    console.log("Step 10: User data.data:", userData.data);
    
    if (!userData.data) {
      console.log("Step 11: No user data found in response");
      return null;
    }

    console.log("Step 12: User roles field type:", typeof userData.data.roles);
    console.log("Step 13: User roles value:", userData.data.roles);
    
    const rolesData = userData.data.roles || [];
    console.log("Step 14: Roles data to process:", rolesData);
    
    // Extract role names
    const roles = rolesData.map(role => {
      console.log("Step 15: Processing role item:", role);
      console.log("Step 16: Role item type:", typeof role);
      
      if (typeof role === 'object' && role !== null) {
        console.log("Step 17: Role is an object, keys:", Object.keys(role));
        if ('role' in role) {
          console.log("Step 18: Found 'role' key:", role.role);
          return role.role;
        }
      }
      console.log("Step 19: Returning role as string:", String(role));
      return String(role);
    }).filter(role => {
      console.log("Step 20: Filtering role:", role);
      return role && role !== "undefined" && role !== "null";
    });

    console.log("Step 21: Final extracted roles:", roles);
    
    const userResult = {
      username: userData.data.name,
      email: userData.data.email,
      full_name: userData.data.full_name,
      user_image: userData.data.user_image,
      roles,
    };
    
    console.log("Step 22: Final user object:", userResult);
    return userResult;
    
  } catch (err) {
    console.error("Step 23: ERROR in getLoggedUser:", err);
    console.error("Error details:", err.message);
    return null;
  }
};
const loginUser = async (usr, pwd) => {
  try {
    const res = await fetch("/api/method/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ usr, pwd }),
      credentials: "include",
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Login failed");

    // Fetch user details after login
    const user = await getLoggedUser();
    return user;
  } catch (err) {
    throw err;
  }
};

const logoutUser = async () => {
  try {
    await fetch("/api/method/logout", { credentials: "include" });
  } catch (err) {
    console.error("Logout failed:", err);
  }
};

export { getLoggedUser, loginUser, logoutUser };