// import { useState, useEffect } from "react";
// import { useFrappeAuth } from "../api/useFrappeAuth";
// import { useNavigate } from "react-router-dom"; // React Router DOM for redirection

// const LoginPage = () => {
//   const [usr, setUsr] = useState("");
//   const [pwd, setPwd] = useState("");
//   const { currentUser, isLoading, error, login, logout } = useFrappeAuth();
//   const navigate = useNavigate();

//   const handleLogin = (e) => {
//     e.preventDefault();
//     login(usr, pwd);
//   };

//   // Role-based redirection after successful login
//   useEffect(() => {
//     if (currentUser && currentUser.roles) {
//       const roles = currentUser.roles;

//       if (roles.includes("M&R Manager")) {
//         navigate("/mr-dashboard"); // Page for M&R Manager
//       } else if (roles.includes("Project Manager")) {
//         const pmDetails = {
//         name: currentUser.full_name,      // full name of the user
//         email: currentUser.email,         // email
//         roles: currentUser.roles
//         };
//         localStorage.setItem("projectManager", JSON.stringify(pmDetails));
//         navigate("/project-dashboard"); // Page for Project Manager
//       } else if (roles.includes("Director")) {
//         navigate("/director-dashboard"); // Page for Director
//       } else if (roles.includes("HR&Asset Manager")) {
//         navigate("/hr"); // Page for Asset&HR Manager
//       } else {
//         // fallback if role not recognized
//         navigate("/dashboard");
//       }
//     }
//   }, [currentUser, navigate]);

//   if (isLoading) {
//     return (
//       <div className="flex min-h-screen items-center justify-center text-gray-500">
//         Checking session…
//       </div>
//     );
//   }

//   if (currentUser) {
//     return (
//       <div className="flex min-h-screen items-center justify-center bg-gray-100">
//         <div className="rounded-xl bg-white p-8 shadow-md text-center space-y-4">
//           <div>
//             <p>Welcome, {currentUser.username}</p>
//             <p>Email: {currentUser.email}</p>
//             <p>Roles: {currentUser.roles.join(", ")}</p>
//           </div>
//           <button
//             onClick={logout}
//             className="rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600 transition"
//           >
//             Logout
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100 p-4">
//       <form
//         onSubmit={handleLogin}
//         className="w-full max-w-md space-y-6 rounded-2xl bg-white p-8 shadow-xl"
//       >
//         <div className="text-center space-y-1">
//           <h1 className="text-2xl font-bold text-gray-800">Welcome Back</h1>
//           <p className="text-sm text-gray-500">Sign in to continue</p>
//         </div>

//         <div className="space-y-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-600">Username</label>
//             <input
//               type="text"
//               value={usr}
//               onChange={(e) => setUsr(e.target.value)}
//               placeholder="Enter username"
//               className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
//               required
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-600">Password</label>
//             <input
//               type="password"
//               value={pwd}
//               onChange={(e) => setPwd(e.target.value)}
//               placeholder="••••••••"
//               className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
//               required
//             />
//           </div>
//         </div>

//         {error && (
//           <div className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">{error}</div>
//         )}

//         <button
//           type="submit"
//           className="w-full rounded-lg bg-indigo-600 py-2 font-semibold text-white hover:bg-indigo-700 transition"
//         >
//           Sign in
//         </button>
//       </form>
//     </div>
//   );
// };

// export default LoginPage;

// import { useState, useEffect } from "react";
// import { useFrappeAuth } from "../api/useFrappeAuth";
// import { useNavigate } from "react-router-dom"; // React Router DOM for redirection

// const LoginPage = () => {
//   const [usr, setUsr] = useState("");
//   const [pwd, setPwd] = useState("");
//   const { currentUser, isLoading, error, login, logout } = useFrappeAuth();
//   const navigate = useNavigate();

//   const handleLogin = (e) => {
//     e.preventDefault();
//     login(usr, pwd);
//   };

//   // Role-based redirection after successful login
//   useEffect(() => {
//   if (currentUser && currentUser.roles) {
//     const roles = currentUser.roles;

//     // Common user data
//     const userDetails = {
//       name: currentUser.full_name,
//       email: currentUser.email,
//       roles: currentUser.roles,
//     };

//     // M&R Manager
//     if (roles.includes("M&R Manager")) {
//       localStorage.setItem("mrManager", JSON.stringify(userDetails));
//       navigate("/mr-dashboard");
//     }

//     // Project Manager
//     else if (roles.includes("Project Manager")) {
//       localStorage.setItem("projectManager", JSON.stringify(userDetails));
//       navigate("/project-dashboard");
//     }

//     // Director
//     else if (roles.includes("Director")) {
//       localStorage.setItem("director", JSON.stringify(userDetails));
//       navigate("/director-dashboard");
//     }

//     // HR & Asset Manager
//     else if (roles.includes("HR&Asset Manager")) {
//       localStorage.setItem("hrManager", JSON.stringify(userDetails));
//       navigate("/hr");
//     }

//     // Default fallback
//     else {
//       localStorage.setItem("defaultUser", JSON.stringify(userDetails));
//       navigate("/dashboard");
//     }
//   }
// }, [currentUser, navigate]);

//   if (isLoading) {
//     return (
//       <div className="flex min-h-screen items-center justify-center text-gray-500">
//         Checking session…
//       </div>
//     );
//   }

//   if (currentUser) {
//     return (
//       <div className="flex min-h-screen items-center justify-center bg-gray-100">
//         <div className="rounded-xl bg-white p-8 shadow-md text-center space-y-4">
//           <div>
//             <p>Welcome, {currentUser.username}</p>
//             <p>Email: {currentUser.email}</p>
//             <p>Roles: {currentUser.roles.join(", ")}</p>
//           </div>
//           <button
//             onClick={logout}
//             className="rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600 transition"
//           >
//             Logout
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100 p-4">
//       <form
//         onSubmit={handleLogin}
//         className="w-full max-w-md space-y-6 rounded-2xl bg-white p-8 shadow-xl"
//       >
//         <div className="text-center space-y-1">
//           <h1 className="text-2xl font-bold text-gray-800">Welcome Back</h1>
//           <p className="text-sm text-gray-500">Sign in to continue</p>
//         </div>

//         <div className="space-y-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-600">Username</label>
//             <input
//               type="text"
//               value={usr}
//               onChange={(e) => setUsr(e.target.value)}
//               placeholder="Enter username"
//               className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
//               required
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-600">Password</label>
//             <input
//               type="password"
//               value={pwd}
//               onChange={(e) => setPwd(e.target.value)}
//               placeholder="••••••••"
//               className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
//               required
//             />
//           </div>
//         </div>

//         {error && (
//           <div className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">{error}</div>
//         )}

//         <button
//           type="submit"
//           className="w-full rounded-lg bg-indigo-600 py-2 font-semibold text-white hover:bg-indigo-700 transition"
//         >
//           Sign in
//         </button>
//       </form>
//     </div>
//   );
// };

// export default LoginPage;


import { useState, useEffect } from "react";
import { useFrappeAuth } from "../api/useFrappeAuth";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";

const LoginPage = () => {
  const [usr, setUsr] = useState("");
  const [pwd, setPwd] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const { currentUser, isLoading, error, login, logout } = useFrappeAuth();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setIsAnimating(true);
    login(usr, pwd);
    setTimeout(() => setIsAnimating(false), 1000);
  };

  // Role-based redirection after successful login
  useEffect(() => {
    if (currentUser && currentUser.roles) {
      const roles = currentUser.roles;

      const userDetails = {
        name: currentUser.full_name,
        email: currentUser.email,
        roles: currentUser.roles,
      };

      if (roles.includes("M&R Manager")) {
        localStorage.setItem("mrManager", JSON.stringify(userDetails));
        navigate("/mr-dashboard");
      } else if (roles.includes("Project Manager")) {
        localStorage.setItem("projectManager", JSON.stringify(userDetails));
        navigate("/project-dashboard");
      } else if (roles.includes("Director")) {
        localStorage.setItem("director", JSON.stringify(userDetails));
        navigate("/director-dashboard");
      } else if (roles.includes("HR&Asset Manager")) {
        localStorage.setItem("hrManager", JSON.stringify(userDetails));
        navigate("/hr");
      } else {
        localStorage.setItem("defaultUser", JSON.stringify(userDetails));
        navigate("/dashboard");
      }
    }
  }, [currentUser, navigate]);

  if (isLoading) {
    return (
      <div className="login-container">
        <div className="loading-screen">
          <div className="logo-animation">
            <svg className="logo-loader" viewBox="0 0 100 100" fill="none">
              <circle cx="50" cy="50" r="45" stroke="rgba(74, 158, 255, 0.2)" strokeWidth="2"/>
              <path d="M50 5 L50 95 M5 50 L95 50" stroke="rgba(74, 158, 255, 0.3)" strokeWidth="1"/>
              <circle cx="50" cy="50" r="8" fill="#4a9eff">
                <animate attributeName="r" values="8;12;8" dur="1.5s" repeatCount="indefinite"/>
              </circle>
            </svg>
          </div>
          <p className="loading-text">Authenticating...</p>
        </div>
      </div>
    );
  }

  if (currentUser) {
    return (
      <div className="login-container">
        <div className="logged-in-card">
          <div className="welcome-avatar">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </div>
          <div className="welcome-content">
            <h2>Welcome back,</h2>
            <p className="user-name">{currentUser.full_name || currentUser.username}</p>
            <p className="user-email">{currentUser.email}</p>
            <div className="user-roles">
              {currentUser.roles.map(role => (
                <span key={role} className="role-badge">{role}</span>
              ))}
            </div>
          </div>
          <button onClick={logout} className="logout-button">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="login-container">
      {/* Animated Background */}
      <div className="animated-bg">
        <div className="bg-gradient"></div>
        <div className="bg-particles">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="particle" style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}></div>
          ))}
        </div>
      </div>

      {/* Login Card */}
      <div className={`login-card ${isAnimating ? 'animate-submit' : ''}`}>
        {/* Company Logo & Brand */}
        <div className="brand-section">
          <div className="logo-container">
            <svg className="logo" viewBox="0 0 100 100" fill="none">
              <rect x="10" y="10" width="80" height="80" rx="12" stroke="url(#gradient)" strokeWidth="2" fill="none"/>
              <path d="M30 50 L40 40 L50 50 L60 40 L70 50" stroke="url(#gradient)" strokeWidth="2" fill="none"/>
              <circle cx="50" cy="55" r="8" fill="url(#gradient)" opacity="0.5"/>
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#4a9eff"/>
                  <stop offset="100%" stopColor="#a78bfa"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <h1 className="company-name">EAKBDC</h1>
          <p className="company-tagline">Ethiopian Addis Kidan Baptist Church Welfare and Development Association</p>
        </div>

        {/* Welcome Message */}
        <div className="welcome-section">
          <h2 className="welcome-title">Welcome Back</h2>
          <p className="welcome-subtitle">Sign in to access your dashboard</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="login-form">
          <div className="input-group">
            <label className="input-label">
              <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              Username
            </label>
            <input
              type="text"
              value={usr}
              onChange={(e) => setUsr(e.target.value)}
              placeholder="Enter your username"
              className="form-input"
              required
              autoFocus
            />
          </div>

          <div className="input-group">
            <label className="input-label">
              <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              Password
            </label>
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                value={pwd}
                onChange={(e) => setPwd(e.target.value)}
                placeholder="Enter your password"
                className="form-input password-input"
                required
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="error-message">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {error}
            </div>
          )}

          <button
            type="submit"
            className="login-button"
            disabled={isAnimating}
          >
            {isAnimating ? (
              <span className="button-loader"></span>
            ) : (
              <>
                <span>Sign In</span>
                <svg className="button-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="5" y1="12" x2="19" y2="12"/>
                  <polyline points="12 5 19 12 12 19"/>
                </svg>
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="login-footer">
          <p>&copy; {new Date().getFullYear()} EAKBDC. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;