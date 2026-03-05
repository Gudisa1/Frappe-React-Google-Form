import { useState } from 'react';
import './App.css';

import "@radix-ui/themes/styles.css";
import { Theme } from "@radix-ui/themes";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import TestSDK from './components/TestSDK';

import MRDashboard from './pages/MRDashboard/MRDashboard';
// import ProjectDashboard from './pages/ProjectDashboard';
import DirectorDashboard from './pages/DirectorDashboard ';
import HRAssetDashboard from './pages/HRAssetDashboard ';
import DefaultDashboard from './pages/DefaultDashboard ';
import FormBuilder from './pages/MRDashboard/FormBuilder';
import FormList from './pages/MRDashboard/FormList';
import SubmissionReview from './pages/MRDashboard/SubmissionReview';
import FormEditing from './pages/MRDashboard/FormEditing';
import Notifications from './pages/MRDashboard/Notifications';
import Analytics from './pages/MRDashboard/Analytics';
import ProjectDashboard from './pages/PMDashboard/ProjectDashboard';
import Submit from './pages/PMDashboard/Submit'
import SubmissionList from './pages/PMDashboard/SubmissionList'

import HRDashboard from './pages/HR/HRDashboard';
import Employees from './pages/HR/EmployeesList';
import EmployeeDetail from './pages/HR/EmployeeDetail';

import HRLayout from './pages/HR/HRLayout';
import EmployeeCreate from './pages/HR/EmployeeCreate';
import EmployeeEdit from './pages/HR/EmployeeEdit';
import GuaranteeTracker from './pages/HR/GuaranteeTracker';
import MedicalTracker from './pages/HR/MedicalTracker';
import Asset from './pages/HR/Asset';
import AssetList from './pages/HR/AssetList';
import AssetDetail from './pages/HR/AssetDetail';
import AssetEdit from './pages/HR/AssetEdit';
import Project from './pages/MRDashboard/Project';
import ProjectEdit from './pages/MRDashboard/ProjectEdit';
import ProjectList from './pages/MRDashboard/ProjectList';
import Form from './pages/MRDashboard/Form';
import FormDetail from './pages/MRDashboard/FormDetail';
import SubmissionDetail from './pages/PMDashboard/SubmissionDetail';
import ProjectLayout from './pages/PMDashboard/ProjectLayout';
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
      <BrowserRouter basename="/"> {/* <-- Set your app folder here we will make it addis  */}
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/mr-dashboard" element={<MRDashboard />} />
          <Route path="/mr-dashboard/forms" element={<FormBuilder />} />
          <Route path="/mr-dashboard/form" element={<Form/>} />
            <Route path="/mr-dashboard/formlist" element={<FormList />} />
            <Route path="/mr-dashboard/forms/:formName" element={<FormDetail />} />
              <Route path="/mr-dashboard/forms/:formName/edit" element={<FormEditing />} />

            <Route path="/mr-dashboard/submissions" element={<SubmissionReview />} />
            <Route path="/mr-dashboard/projects" element={<Project />} />
            <Route path="/mr-dashboard/projectslist" element={<ProjectList/>} />
            <Route path="/mr-dashboard/projects/:projectName/edit" element={<ProjectEdit />} />
            <Route path="/mr-dashboard/notifications" element={<Notifications />} />
            <Route path="/mr-dashboard/analytics" element={<Analytics />} />
            {/* <Route path="/project-dashboard" element={<ProjectDashboard />} /> */}
          <Route path="/" element={<ProjectLayout />}>
              <Route path="project-dashboard" element={<ProjectDashboard />} />
              <Route path="submit" element={<Submit />} />
              <Route path="submission-list" element={<SubmissionList />} />
              <Route path="submission-detail" element={<SubmissionDetail />} />
            </Route>
          <Route path="/director-dashboard" element={<DirectorDashboard />} />
          <Route path="/hr" element={<HRLayout />}>

            <Route index element={<HRDashboard/>} />
            
            <Route path="employees" element={<Employees />} />
            <Route path="employees/new" element={<EmployeeCreate />} />
            <Route path="employees/:id" element={<EmployeeDetail />} />
            <Route path="employees/:id/edit" element={<EmployeeEdit />} />
            <Route path="asset" element={<Asset />} />
            <Route path="assetlist" element={<AssetList />} />
            <Route path="assetlist/:name" element={<AssetDetail />} />
            <Route path="assetlistedit/:name" element={<AssetEdit />} />
               <Route path="trackers">
              <Route path="medical" element={<MedicalTracker />} />
              <Route path="guarantee" element={<GuaranteeTracker />} />
            </Route>


          </Route>
          <Route path="/dashboard" element={<DefaultDashboard />} />
          
        </Routes>
      </BrowserRouter>
    </Theme>
    </div>
  );
}

export default App;
