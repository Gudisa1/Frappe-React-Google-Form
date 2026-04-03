import { useState } from 'react';
import './App.css';

import "@radix-ui/themes/styles.css";
import { Theme } from "@radix-ui/themes";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import TestSDK from './components/TestSDK';

import MRDashboard from './pages/MRDashboard/MRDashboard';
// import ProjectDashboard from './pages/ProjectDashboard';
// import DirectorDashboard from './pages/DirectorDashboard ';
// import HRAssetDashboard from './pages/HRAssetDashboard ';
import DefaultDashboard from './pages/DefaultDashboard ';
// import FormBuilder from './pages/MRDashboard/FormBuilder';
import FormList from './pages/MRDashboard/FormList';
import SubmissionReview from './pages/MRDashboard/SubmissionReview';
import FormEditing from './pages/MRDashboard/FormEditing';

import ProjectDashboard from './pages/PMDashboard/ProjectDashboard';
import Submit from './pages/PMDashboard/Submit'
import SubmissionList from './pages/PMDashboard/SubmissionList'

import HRDashboard from './pages/HR/HRDashboard';
// import Employees from './pages/HR/EmployeesList';
// import EmployeeDetail from './pages/HR/EmployeeDetail';

import HRLayout from './pages/HR/HRLayout';
// import EmployeeCreate from './pages/HR/EmployeeCreate';
// import EmployeeEdit from './pages/HR/EmployeeEdit';
// import GuaranteeTracker from './pages/HR/GuaranteeTracker';
// import MedicalTracker from './pages/HR/MedicalTracker';
import Asset from './pages/HR/Asset';
import AssetList from './pages/HR/AssetList';
import AssetDetail from './pages/HR/AssetDetail';
import AssetEdit from './pages/HR/AssetEdit';
import Project from './pages/MRDashboard/Project';
import ProjectEdit from './pages/MRDashboard/ProjectEdit';
import ProjectList from './pages/MRDashboard/ProjectList';
import ProjectGeneral from './pages/PMDashboard/ProjectGeneral';
import ProjectStat from './pages/PMDashboard/ProjectStat';
import Form from './pages/MRDashboard/Form';
import FormDetail from './pages/MRDashboard/FormDetail';
import SubmissionDetail from './pages/PMDashboard/SubmissionDetail';
import ProjectLayout from './pages/PMDashboard/ProjectLayout';
import Submissions from './pages/MRDashboard/Submissions';
import MRSubmissionDetail from './pages/MRDashboard/MRSubmissionDetails';

import EmployeeDetail from './pages/HR/EmployeeDetail';
import EmployeeCreate from './pages/HR/EmployeeCreate';
import EmployeeEdit from './pages/HR/EmployeeEdit';
import DirectorDashboard from './pages/DirectorDashboard/DirectorDashboard';
import DirectorSubmission from './pages/DirectorDashboard/DirectorSubmission';
import DirectorSubmissionDetail from './pages/DirectorDashboard/DirectorSubmissionDetail';
import DirectorEmployee from './pages/DirectorDashboard/DirectorEmployee';
import DirectorEmployeeDetail from './pages/DirectorDashboard/DirectorEmployeeDetail';
import DirectorAsset from './pages/DirectorDashboard/DirectorAsset';

import ProjectAsset from './pages/PMDashboard/ProjectAsset';
import ProjectListAsset from './pages/PMDashboard/ProjectListAsset';


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
          <Route path="/mr-dashboard/form" element={<Form/>} />
            <Route path="/mr-dashboard/formlist" element={<FormList />} />
            <Route path="/mr-dashboard/forms/:formName" element={<FormDetail />} />
              <Route path="/mr-dashboard/forms/:formName/edit" element={<FormEditing />} />
               <Route path="/mr-dashboard/submissions" element={<Submissions/>} />
               <Route path="/director-submissions" element={<DirectorSubmission/>} />
               <Route path="/director-submissions/:name" element={<DirectorSubmissionDetail/>} />
               <Route path="/director-employee" element={<DirectorEmployee/>} />
              <Route path="/director-employee/:id" element={<DirectorEmployeeDetail />} />
              <Route path="/director-asset" element={<DirectorAsset />} />
              
               <Route path="/mr-dashboard/submissions/:name" element={<MRSubmissionDetail/>} />

            {/* Director Routes */}
            <Route path="/director-dashboard" element={<DirectorDashboard/>} />
            <Route path="/mr-dashboard/submissions" element={<SubmissionReview />} />
            <Route path="/mr-dashboard/projects" element={<Project />} />
            <Route path="/mr-dashboard/projectslist" element={<ProjectList/>} />
            <Route path="/mr-dashboard/projects/:projectName/edit" element={<ProjectEdit />} />
            {/* <Route path="/project-dashboard" element={<ProjectDashboard />} /> */}
          <Route path="/" element={<ProjectLayout />}>
              <Route path="project-dashboard" element={<ProjectDashboard />} />
              <Route path="project-general" element={<ProjectGeneral />} />
              <Route path="project-stat" element={<ProjectStat />} />
              <Route path="project-asset" element={<ProjectAsset />} />
              <Route path="project-asset-list" element={<ProjectListAsset />} />
              <Route path="submit" element={<Submit />} />
              <Route path="submission-list" element={<SubmissionList />} />
              <Route path="submission-detail" element={<SubmissionDetail />} />
            </Route>
          {/* <Route path="/director-dashboard" element={<DirectorDashboard />} /> */}
          <Route path="/hr" element={<HRLayout />}>

            <Route index element={<HRDashboard/>} />
            
            
            <Route path="asset" element={<Asset />} />
            <Route path="assetlist" element={<AssetList />} />
            <Route path="assetlist/:name" element={<AssetDetail />} />
            <Route path="assetlistedit/:name" element={<AssetEdit />} />
               <Route path="trackers">

            </Route>
            <Route path="employee/:id" element={<EmployeeDetail />} />
            <Route path="employee/create" element={<EmployeeCreate />} />
            <Route path="employeeedit/:id" element={<EmployeeEdit />} />



          </Route>
          <Route path="/dashboard" element={<DefaultDashboard />} />
          
        </Routes>
      </BrowserRouter>
    </Theme>
    </div>
  );
}

export default App;
