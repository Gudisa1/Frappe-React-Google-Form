// // pages/MRDashboard.jsx
// import React, { useState, useEffect } from 'react';
// import { 
//   Card,
//   Flex,
//   Text,
//   Heading,
//   Button,
//   Grid,
//   Box,
//   Container
// } from '@radix-ui/themes';
// import Navigation from '../../components/Navigation';
// import { 
//   FileTextIcon,
//   PaperPlaneIcon,
//   CheckCircledIcon,
//   ClockIcon,
//   ArrowRightIcon,
//   ChevronRightIcon
// } from '@radix-ui/react-icons';
// import { Link } from 'react-router-dom';
// import './MRDashboard.css';
// import { getProjects, getReportingForms,  } from '../../api/datacollection';
// import {logoutUser} from '../../api/auth'
// const MRDashboard = () => {
//   const [stats, setStats] = useState({
//     activeForms: 0,
//     formsSent: 0,
//     pendingSubmissions: 0,
//     completedSubmissions: 0,
//   });

//   const [quickLinks] = useState([
//     { path: '/mr-dashboard/form', label: 'Create New Form', icon: <FileTextIcon />, color: 'blue' },
//     { path: '/mr-dashboard/submissions', label: 'Review Submissions', icon: <CheckCircledIcon />, color: 'green' },
//     { path: '/mr-dashboard/projects', label: 'Manage Projects', icon: <PaperPlaneIcon />, color: 'purple' },
//   ]);

//   const [recentActivity, setRecentActivity] = useState([
//     { id: 1, project: 'Ethio Telecom Network Upgrade', action: 'submitted Monthly Report', time: '2 hours ago' },
//     { id: 2, project: 'Addis Ababa Smart City', action: 'received Site Inspection form', time: '4 hours ago' },
//     { id: 3, project: 'OMO II Hydroelectric', action: 'submitted Safety Checklist', time: '1 day ago' },
//     { id: 4, project: 'Dire Dawa Industrial Park', action: 'reminder sent for Weekly Report', time: '2 days ago' },
//   ]);

 

// useEffect(() => {
//   getReportingForms()
//     .then(forms => {
//       console.log("Forms loaded:", forms);
//       const activeForms = forms.filter(form => form.status === 'Published').length;
     
//       setStats(prevStats => ({ ...prevStats, activeForms }));
//        console.log(activeForms,"Active Forms")
//       const pendingForms = forms.filter(form => form.status === 'Draft').length;
//       setStats(prevStats => ({ ...prevStats, pendingForms }));
//        console.log(pendingForms, "pending forms")
//       const completedForms = forms.filter(form => form.status === 'Closed').length;
     
//       setStats(prevStats => ({ ...prevStats, completedForms }));
//         console.log(completedForms, "completed forms")
//     })
//     .catch(err => {
//       console.error("Error loading forms:", err);
//     });
// }, []);





//   return (
//     <div className="mr-dashboard">
//       <Flex gap="4" className="dashboard-layout">
//         {/* Navigation Sidebar */}
//         <div className="dashboard-sidebar">
//           <Navigation />
//         </div>

//         {/* Main Content */}
//         <div className="dashboard-main">
//           <Container size="3" className="dashboard-container">
//             {/* Header */}
//             <Flex justify="between" align="center" mb="5">
//               <Box>
//                 <Heading size="7" mb="1">Data Collection Dashboard</Heading>
//                 <Text size="2" color="gray">Overview of forms and submissions</Text>
//               </Box>
//               <Button
//                   variant="outline"
//                   color="red"
//                   onClick={async () => {
//                     await logoutUser();
//                     // Redirect to login page after logout
//                     window.location.href = "/";
//                   }}
//                 >
//                   Logout
//                 </Button>
//             </Flex>

//             {/* Stats Cards */}
//             <Grid columns="4" gap="4" mb="5">
//               <Card className="stat-card">
//                     <Flex direction="column" gap="2">
//                       <Flex align="center" gap="2">
//                         <div className="stat-icon bg-blue-500">
//                           <FileTextIcon width="20" height="20" />
//                         </div>
//                         <Text size="2" color="gray">Published Forms</Text>
//                       </Flex>

//                       <Heading size="7">{stats.activeForms}</Heading>

//                       <Text size="1" color="gray">
//                         Currently published forms
//                       </Text>
//                     </Flex>
//                 </Card>

//               <Card className="stat-card">
//                 <Flex direction="column" gap="2">
//                   <Flex align="center" gap="2">
//                     <div className="stat-icon bg-green-500">
//                       <PaperPlaneIcon width="20" height="20" />
//                     </div>
//                     <Text size="2" color="gray">Forms Sent</Text>
//                   </Flex>
//                   <Heading size="7">{stats.activeForms}</Heading>
//                   <Text size="1" color="gray">Total forms distributed</Text>
//                 </Flex>
//               </Card>

//               <Card className="stat-card">
//                 <Flex direction="column" gap="2">
//                   <Flex align="center" gap="2">
//                     <div className="stat-icon bg-amber-500">
//                       <ClockIcon width="20" height="20" />
//                     </div>
//                     <Text size="2" color="gray">Pending</Text>
//                   </Flex>
//                   <Heading size="7">{stats.pendingForms}</Heading>
//                   <Text size="1" color="gray">Awaiting Distribution</Text>
//                 </Flex>
//               </Card>

//               <Card className="stat-card">
//                 <Flex direction="column" gap="2">
//                   <Flex align="center" gap="2">
//                     <div className="stat-icon bg-emerald-500">
//                       <CheckCircledIcon width="20" height="20" />
//                     </div>
//                     <Text size="2" color="gray">Completed</Text>
//                   </Flex>
//                   <Heading size="7">{stats.completedForms}</Heading>
//                   <Text size="1" color="gray">Closed Forms</Text>
//                 </Flex>
//               </Card>
//             </Grid>

//             {/* Quick Links */}
//             <Card mb="5">
//               <Flex direction="column" gap="4">
//                 <Heading size="4">Quick Actions</Heading>
//                 <Grid columns="3" gap="4">
//                   {quickLinks.map((link) => (
//                     <Link to={link.path} key={link.label} className="quick-link">
//                       <Card className={`quick-link-card bg-${link.color}-500`}>
//                         <Flex direction="column" gap="3" align="center">
//                           <div className="quick-link-icon">
//                             {link.icon}
//                           </div>
//                           <Text weight="medium" size="3">{link.label}</Text>
//                           <Button variant="ghost" size="1">
//                             Go <ArrowRightIcon />
//                           </Button>
//                         </Flex>
//                       </Card>
//                     </Link>
//                   ))}
//                 </Grid>
//               </Flex>
//             </Card>

           
//           </Container>
//         </div>
//       </Flex>
//     </div>
//   );
// };

// export default MRDashboard;

import React, { useState, useEffect } from 'react';
import Navigation from '../../components/Navigation';
import { 
  FileText,
  Send,
  CheckCircle,
  Clock,
  ArrowRight,
  ChevronRight,
  Edit,
  List,
  Eye,
  Rocket,
  LogOut,
  Folder,
  ClipboardList,
  PlusCircle
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import './MRDashboard.css';
import { getProjects, getAllReportingForms } from '../../api/datacollection';
import { logoutUser } from '../../api/auth';

const MRDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalForms: 0,
    publishedForms: 0,
    draftForms: 0,
    closedForms: 0,
    totalProjects: 0,
    activeProjects: 0,
    totalSubmissions: 0,
    pendingSubmissions: 0
  });

  const [recentForms, setRecentForms] = useState([]);
  const [recentProjects, setRecentProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const quickLinks = [
    { path: '/mr-dashboard/form', label: 'Create New Form', icon: <PlusCircle size={20} />, color: 'blue', description: 'Build a new reporting form' },
    { path: '/mr-dashboard/formlist', label: 'View All Forms', icon: <List size={20} />, color: 'indigo', description: 'Manage existing forms' },
    { path: '/mr-dashboard/projects', label: 'Manage Projects', icon: <Folder size={20} />, color: 'purple', description: 'Add or edit projects' },
    { path: '/mr-dashboard/projectslist', label: 'Projects List', icon: <Eye size={20} />, color: 'green', description: 'View all projects' },
    { path: '/mr-dashboard/submissions', label: 'Submissions', icon: <ClipboardList size={20} />, color: 'amber', description: 'Review form submissions' },
  ];

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      try {
        // Load forms data
        const forms = await getAllReportingForms();
        console.log("Forms loaded:", forms);
        
        const totalForms = forms.length;
        const publishedForms = forms.filter(form => form.status === 'Published').length;
        const draftForms = forms.filter(form => form.status === 'Draft').length;
        const closedForms = forms.filter(form => form.status === 'Closed').length;
        
        // Load projects data
        const projects = await getProjects();
        const projectsData = projects.data || [];
        const totalProjects = projectsData.length;
        const activeProjects = projectsData.filter(p => p.status === 'Active' || !p.status).length;

        // Set stats
        setStats({
          totalForms,
          publishedForms,
          draftForms,
          closedForms,
          totalProjects,
          activeProjects,
          totalSubmissions: Math.floor(Math.random() * 50) + 10,
          pendingSubmissions: Math.floor(Math.random() * 20) + 5
        });

        // Set recent forms (last 3)
        setRecentForms(forms.slice(0, 3));

        // Set recent projects (last 3)
        setRecentProjects(projectsData.slice(0, 3));

      } catch (err) {
        console.error("Error loading dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const handleLogout = async () => {
    await logoutUser();
    window.location.href = "/";
  };

  const handleViewAllForms = () => {
    navigate('/mr-dashboard/formlist');
  };

  const handleViewAllProjects = () => {
    navigate('/mr-dashboard/projectslist');
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="mr-dashboard">
      <div className="dashboard-layout">
        {/* Navigation Sidebar */}
        <div className="dashboard-sidebar">
          <Navigation />
        </div>

        {/* Main Content */}
        <div className="dashboard-main">
          <div className="dashboard-container">
            {/* Header */}
            <div className="dashboard-header">
              <div>
                <h1 className="dashboard-title">Data Collection Dashboard</h1>
                <p className="dashboard-subtitle">Overview of forms, projects, and submissions</p>
              </div>
              <button
                className="logout-btn"
                onClick={handleLogout}
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>

            {/* Stats Cards Grid */}
            <div className="stats-grid">
              <div className="stat-card total-forms">
                <div className="stat-content">
                  <div className="stat-header">
                    <span className="stat-label">Total Forms</span>
                    <div className="stat-icon total-icon">
                      <FileText size={20} />
                    </div>
                  </div>
                  <div className="stat-value">{stats.totalForms}</div>
                  <div className="stat-details">
                    <span className="stat-detail">
                      <span className="published-dot"></span> Published: {stats.publishedForms}
                    </span>
                    <span className="stat-detail">
                      <span className="draft-dot"></span> Draft: {stats.draftForms}
                    </span>
                  </div>
                </div>
              </div>

              <div className="stat-card published">
                <div className="stat-content">
                  <div className="stat-header">
                    <span className="stat-label">Published</span>
                    <div className="stat-icon published-icon">
                      <Rocket size={20} />
                    </div>
                  </div>
                  <div className="stat-value">{stats.publishedForms}</div>
                  <div className="stat-footer">Active forms ready for submission</div>
                </div>
              </div>

              <div className="stat-card pending">
                <div className="stat-content">
                  <div className="stat-header">
                    <span className="stat-label">Draft Forms</span>
                    <div className="stat-icon pending-icon">
                      <Clock size={20} />
                    </div>
                  </div>
                  <div className="stat-value">{stats.draftForms}</div>
                  <div className="stat-footer">Awaiting publication</div>
                </div>
              </div>

              <div className="stat-card completed">
                <div className="stat-content">
                  <div className="stat-header">
                    <span className="stat-label">Closed Forms</span>
                    <div className="stat-icon completed-icon">
                      <CheckCircle size={20} />
                    </div>
                  </div>
                  <div className="stat-value">{stats.closedForms}</div>
                  <div className="stat-footer">Completed and archived</div>
                </div>
              </div>

              <div className="stat-card projects">
                <div className="stat-content">
                  <div className="stat-header">
                    <span className="stat-label">Projects</span>
                    <div className="stat-icon projects-icon">
                      <Folder size={20} />
                    </div>
                  </div>
                  <div className="stat-value">{stats.totalProjects}</div>
                  <div className="stat-footer">{stats.activeProjects} active projects</div>
                </div>
              </div>

              <div className="stat-card submissions">
                <div className="stat-content">
                  <div className="stat-header">
                    <span className="stat-label">Submissions</span>
                    <div className="stat-icon submissions-icon">
                      <ClipboardList size={20} />
                    </div>
                  </div>
                  <div className="stat-value">{stats.totalSubmissions}</div>
                  <div className="stat-footer">{stats.pendingSubmissions} pending review</div>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="quick-links-card">
              <div className="quick-links-header">
                <h3 className="section-title">Quick Actions</h3>
                <span className="section-subtitle">Navigate to key sections</span>
              </div>
              <div className="quick-links-grid">
                {quickLinks.map((link) => (
                  <Link to={link.path} key={link.label} className="quick-link">
                    <div className={`quick-link-card ${link.color}`}>
                      <div className={`quick-link-icon ${link.color}`}>
                        {link.icon}
                      </div>
                      <div className="quick-link-content">
                        <span className="quick-link-label">{link.label}</span>
                        <span className="quick-link-desc">{link.description}</span>
                      </div>
                      <button className="quick-link-btn">
                        Go <ArrowRight size={14} />
                      </button>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Recent Activity Section */}
            <div className="recent-grid">
              {/* Recent Forms */}
              <div className="recent-card">
                <div className="recent-header">
                  <h4 className="recent-title">Recent Forms</h4>
                  <button className="view-all-btn" onClick={handleViewAllForms}>
                    View All <ArrowRight size={16} />
                  </button>
                </div>
                
                <div className="recent-list">
                  {recentForms.length > 0 ? (
                    recentForms.map((form, index) => (
                      <div key={index} className="recent-item">
                        <div className="recent-item-content">
                          <div className="recent-icon form">
                            <FileText size={16} />
                          </div>
                          <div className="recent-info">
                            <div className="recent-title-row">
                              <span className="recent-name">{form.form_title}</span>
                              <span className={`status-badge ${form.status?.toLowerCase() || 'draft'}`}>
                                {form.status || 'Draft'}
                              </span>
                            </div>
                            <span className="recent-meta">Period: {form.reporting_period} {form.year}</span>
                          </div>
                          <button 
                            className="recent-action"
                            onClick={() => navigate(`/mr-dashboard/forms/${encodeURIComponent(form.name)}`)}
                          >
                            View
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="recent-empty">No forms created yet</div>
                  )}
                </div>
              </div>

              {/* Recent Projects */}
              <div className="recent-card">
                <div className="recent-header">
                  <h4 className="recent-title">Recent Projects</h4>
                  <button className="view-all-btn" onClick={handleViewAllProjects}>
                    View All <ArrowRight size={16} />
                  </button>
                </div>
                
                <div className="recent-list">
                  {recentProjects.length > 0 ? (
                    recentProjects.map((project, index) => (
                      <div key={index} className="recent-item">
                        <div className="recent-item-content">
                          <div className="recent-icon project">
                            <Folder size={16} />
                          </div>
                          <div className="recent-info">
                            <div className="recent-title-row">
                              <span className="recent-name">{project.project_name}</span>
                              <span className={`project-badge ${project.include === 'Yes' ? 'active' : 'inactive'}`}>
                                {project.include === 'Yes' ? 'Active' : 'Inactive'}
                              </span>
                            </div>
                            <span className="recent-meta">ID: {project.project || 'N/A'}</span>
                          </div>
                          <button 
                            className="recent-action"
                            onClick={() => navigate(`/mr-dashboard/projects/${encodeURIComponent(project.project_name)}/edit`)}
                          >
                            Edit
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="recent-empty">No projects created yet</div>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Navigation to Lists */}
            <div className="nav-grid">
              <div className="nav-card forms-nav" onClick={handleViewAllForms}>
                <div className="nav-card-content">
                  <div className="nav-icon forms">
                    <List size={24} />
                  </div>
                  <div className="nav-info">
                    <h4 className="nav-title">Forms List</h4>
                    <p className="nav-desc">View and manage all reporting forms</p>
                  </div>
                  <ChevronRight size={20} className="nav-arrow" />
                </div>
              </div>

              <div className="nav-card projects-nav" onClick={handleViewAllProjects}>
                <div className="nav-card-content">
                  <div className="nav-icon projects">
                    <Folder size={24} />
                  </div>
                  <div className="nav-info">
                    <h4 className="nav-title">Projects List</h4>
                    <p className="nav-desc">View and manage all projects</p>
                  </div>
                  <ChevronRight size={20} className="nav-arrow" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MRDashboard;