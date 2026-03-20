import { useState, useEffect } from "react";
import { useFrappeAuth } from "../api/useFrappeAuth";
import { useNavigate } from "react-router-dom"; // React Router DOM for redirection

const LoginPage = () => {
  const [usr, setUsr] = useState("");
  const [pwd, setPwd] = useState("");
  const { currentUser, isLoading, error, login, logout } = useFrappeAuth();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    login(usr, pwd);
  };

  // Role-based redirection after successful login
  useEffect(() => {
    if (currentUser && currentUser.roles) {
      const roles = currentUser.roles;

      if (roles.includes("M&R Manager")) {
        navigate("/mr-dashboard"); // Page for M&R Manager
      } else if (roles.includes("Project Manager")) {
        const pmDetails = {
        name: currentUser.full_name,      // full name of the user
        email: currentUser.email,         // email
        roles: currentUser.roles
        };
        localStorage.setItem("projectManager", JSON.stringify(pmDetails));
        navigate("/project-dashboard"); // Page for Project Manager
      } else if (roles.includes("Director")) {
        navigate("/director-dashboard"); // Page for Director
      } else if (roles.includes("HR&Asset Manager")) {
        navigate("/hr"); // Page for Asset&HR Manager
      } else {
        // fallback if role not recognized
        navigate("/dashboard");
      }
    }
  }, [currentUser, navigate]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-gray-500">
        Checking session…
      </div>
    );
  }

  if (currentUser) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="rounded-xl bg-white p-8 shadow-md text-center space-y-4">
          <div>
            <p>Welcome, {currentUser.username}</p>
            <p>Email: {currentUser.email}</p>
            <p>Roles: {currentUser.roles.join(", ")}</p>
          </div>
          <button
            onClick={logout}
            className="rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100 p-4">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md space-y-6 rounded-2xl bg-white p-8 shadow-xl"
      >
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-bold text-gray-800">Welcome Back</h1>
          <p className="text-sm text-gray-500">Sign in to continue</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600">Username</label>
            <input
              type="text"
              value={usr}
              onChange={(e) => setUsr(e.target.value)}
              placeholder="Enter username"
              className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">Password</label>
            <input
              type="password"
              value={pwd}
              onChange={(e) => setPwd(e.target.value)}
              placeholder="••••••••"
              className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              required
            />
          </div>
        </div>

        {error && (
          <div className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">{error}</div>
        )}

        <button
          type="submit"
          className="w-full rounded-lg bg-indigo-600 py-2 font-semibold text-white hover:bg-indigo-700 transition"
        >
          Sign in
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
