import React, { useState } from 'react';
import HRDashboard from './HR/HRDashboard';
import AssetList from './HR/AssetList';
import EmployeeDetail from './HR/EmployeeDetail';
import FormList from './MRDashboard/FormList';
import FormDetail from './MRDashboard/FormDetail';
import Submissions from './MRDashboard/Submissions';
import MRSubmissionDetail from './MRDashboard/MRSubmissionDetails';
import ProjectList from './MRDashboard/ProjectList';
import { logoutUser } from '../api/auth';
const componentsMap = {
  HRDashboard: <HRDashboard />,
  AssetList: <AssetList />,
  FormList: <FormList />,
  Submissions: <Submissions />,
  ProjectList: <ProjectList />,
};

const DirectorDashboard = () => {
  const [activeComponent, setActiveComponent] = useState('HRDashboard');
  const [detailComponent, setDetailComponent] = useState(null);

  const handleSidebarClick = (componentName) => {
    setDetailComponent(null); // reset detail view when switching sidebar
    setActiveComponent(componentName);
  };

  // Handler for opening detail components (like FormDetail or MRSubmissionDetail)
  const handleOpenDetail = (component) => {
    setDetailComponent(component);
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <button onClick={logoutUser}>Logout</button>
      {/* Sidebar */}
      <div style={{ width: '200px', borderRight: '1px solid #ccc', padding: '1rem' }}>
        {Object.keys(componentsMap).map((key) => (
          <button
            key={key}
            onClick={() => handleSidebarClick(key)}
            style={{ display: 'block', marginBottom: '0.5rem' }}
          >
            {key}
          </button>
        ))}
      </div>

      {/* Main content */}
      <div style={{ flex: 1, padding: '1rem' }}>
        {detailComponent
          ? detailComponent
          : React.cloneElement(componentsMap[activeComponent], { openDetail: handleOpenDetail })}
      </div>
    </div>
  );
};

export default DirectorDashboard;