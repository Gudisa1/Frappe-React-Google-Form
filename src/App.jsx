import { useState } from 'react';
import './App.css';

import "@radix-ui/themes/styles.css";
import { Theme } from "@radix-ui/themes";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import TestSDK from './components/TestSDK';

import MRDashboard from './pages/MRDashboard/MRDashboard';
import ProjectDashboard from './pages/ProjectDashboard';
import DirectorDashboard from './pages/DirectorDashboard ';
import HRAssetDashboard from './pages/HRAssetDashboard ';
import DefaultDashboard from './pages/DefaultDashboard ';
import FormBuilder from './pages/MRDashboard/FormBuilder';
import FormAssignment from './pages/MRDashboard/FormAssignment';
import SubmissionReview from './pages/MRDashboard/SubmissionReview';
import FormEditing from './pages/MRDashboard/FormEditing';
import ProjectManagement from './pages/MRDashboard/ProjectManagement';
import Notifications from './pages/MRDashboard/Notifications';
import Analytics from './pages/MRDashboard/Analytics';

function App() {
  const getSiteName = () => {
    if (window.frappe?.boot?.versions?.frappe === "14.0.0") {
      return window.frappe?.boot?.site_name ?? import.meta.env.VITE_SITE_NAME;
    }
    return import.meta.env.VITE_SITE_NAME;
  };

  return (
    <div className="App">
      <Theme appearance="dark" accentColor="iris" panelBackground="translucent">
      <BrowserRouter basename="/"> {/* <-- Set your app folder here */}
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/mr-dashboard" element={<MRDashboard />} />
          <Route path="/mr-dashboard/forms" element={<FormBuilder />} />
            <Route path="/mr-dashboard/assign" element={<FormAssignment />} />
            <Route path="/mr-dashboard/submissions" element={<SubmissionReview />} />
            <Route path="/mr-dashboard/edit-forms" element={<FormEditing />} />
            <Route path="/mr-dashboard/projects" element={<ProjectManagement />} />
            <Route path="/mr-dashboard/notifications" element={<Notifications />} />
            <Route path="/mr-dashboard/analytics" element={<Analytics />} />
            <Route path="/project-dashboard" element={<ProjectDashboard />} />
          <Route path="/project-dashboard" element={<ProjectDashboard />} />
          <Route path="/director-dashboard" element={<DirectorDashboard />} />
          <Route path="/hr-asset-dashboard" element={<HRAssetDashboard />} />
          <Route path="/dashboard" element={<DefaultDashboard />} />
        </Routes>
      </BrowserRouter>
    </Theme>
    </div>
  );
}

export default App;
