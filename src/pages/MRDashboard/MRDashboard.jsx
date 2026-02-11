// pages/MRDashboard.jsx
import React, { useState, useEffect } from 'react';
import { 
  Card,
  Flex,
  Text,
  Heading,
  Button,
  Grid,
  Box,
  Container
} from '@radix-ui/themes';
import Navigation from '../../components/Navigation';
import { 
  FileTextIcon,
  PaperPlaneIcon,
  CheckCircledIcon,
  ClockIcon,
  ArrowRightIcon,
  ChevronRightIcon
} from '@radix-ui/react-icons';
import { Link } from 'react-router-dom';
import './MRDashboard.css';
import { getProjects, getReportingForms, getSubmissions } from '../../api/datacollection';
const MRDashboard = () => {
  const [stats, setStats] = useState({
    activeForms: 0,
    formsSent: 0,
    pendingSubmissions: 0,
    completedSubmissions: 0,
  });

  const [quickLinks] = useState([
    { path: '/mr-dashboard/forms', label: 'Create New Form', icon: <FileTextIcon />, color: 'blue' },
    { path: '/mr-dashboard/submissions', label: 'Review Submissions', icon: <CheckCircledIcon />, color: 'green' },
    { path: '/mr-dashboard/projects', label: 'Manage Projects', icon: <PaperPlaneIcon />, color: 'purple' },
  ]);

  const [recentActivity, setRecentActivity] = useState([
    { id: 1, project: 'Ethio Telecom Network Upgrade', action: 'submitted Monthly Report', time: '2 hours ago' },
    { id: 2, project: 'Addis Ababa Smart City', action: 'received Site Inspection form', time: '4 hours ago' },
    { id: 3, project: 'OMO II Hydroelectric', action: 'submitted Safety Checklist', time: '1 day ago' },
    { id: 4, project: 'Dire Dawa Industrial Park', action: 'reminder sent for Weekly Report', time: '2 days ago' },
  ]);

  // useEffect(() => {
  //   // Mock API call to fetch dashboard stats
  //   const fetchDashboardStats = async () => {
  //     // Simulating API delay
  //     await new Promise(resolve => setTimeout(resolve, 500));
      
  //     setStats({
  //       activeForms: 12,
  //       formsSent: 45,
  //       pendingSubmissions: 18,
  //       completedSubmissions: 27,
  //     });
  //   };

  //   fetchDashboardStats();
  // }, []);

useEffect(() => {
  console.log("🚀 Dashboard loaded → fetching PUBLISHED forms");

  async function loadPublishedForms() {
    try {
      const res = await getReportingForms("Published");

      const forms = res.data || [];
      console.log("✅ Published forms received:", forms.length);

      setStats(prev => ({
        ...prev,
        activeForms: forms.length,
      }));

    } catch (error) {
      console.error("❌ Failed to load published forms:", error);
    }
  }

  loadPublishedForms();
}, []);




  return (
    <div className="mr-dashboard">
      <Flex gap="4" className="dashboard-layout">
        {/* Navigation Sidebar */}
        <div className="dashboard-sidebar">
          <Navigation />
        </div>

        {/* Main Content */}
        <div className="dashboard-main">
          <Container size="3" className="dashboard-container">
            {/* Header */}
            <Flex justify="between" align="center" mb="5">
              <Box>
                <Heading size="7" mb="1">Data Collection Dashboard</Heading>
                <Text size="2" color="gray">Overview of forms and submissions</Text>
              </Box>
            </Flex>

            {/* Stats Cards */}
            <Grid columns="4" gap="4" mb="5">
              <Card className="stat-card">
                    <Flex direction="column" gap="2">
                      <Flex align="center" gap="2">
                        <div className="stat-icon bg-blue-500">
                          <FileTextIcon width="20" height="20" />
                        </div>
                        <Text size="2" color="gray">Published Forms</Text>
                      </Flex>

                      <Heading size="7">{stats.activeForms}</Heading>

                      <Text size="1" color="gray">
                        Currently published forms
                      </Text>
                    </Flex>
                </Card>

              <Card className="stat-card">
                <Flex direction="column" gap="2">
                  <Flex align="center" gap="2">
                    <div className="stat-icon bg-green-500">
                      <PaperPlaneIcon width="20" height="20" />
                    </div>
                    <Text size="2" color="gray">Forms Sent</Text>
                  </Flex>
                  <Heading size="7">{stats.formsSent}</Heading>
                  <Text size="1" color="gray">Total forms distributed</Text>
                </Flex>
              </Card>

              <Card className="stat-card">
                <Flex direction="column" gap="2">
                  <Flex align="center" gap="2">
                    <div className="stat-icon bg-amber-500">
                      <ClockIcon width="20" height="20" />
                    </div>
                    <Text size="2" color="gray">Pending</Text>
                  </Flex>
                  <Heading size="7">{stats.pendingSubmissions}</Heading>
                  <Text size="1" color="gray">Awaiting submission</Text>
                </Flex>
              </Card>

              <Card className="stat-card">
                <Flex direction="column" gap="2">
                  <Flex align="center" gap="2">
                    <div className="stat-icon bg-emerald-500">
                      <CheckCircledIcon width="20" height="20" />
                    </div>
                    <Text size="2" color="gray">Completed</Text>
                  </Flex>
                  <Heading size="7">{stats.completedSubmissions}</Heading>
                  <Text size="1" color="gray">Forms submitted</Text>
                </Flex>
              </Card>
            </Grid>

            {/* Quick Links */}
            <Card mb="5">
              <Flex direction="column" gap="4">
                <Heading size="4">Quick Actions</Heading>
                <Grid columns="3" gap="4">
                  {quickLinks.map((link) => (
                    <Link to={link.path} key={link.label} className="quick-link">
                      <Card className={`quick-link-card bg-${link.color}-500`}>
                        <Flex direction="column" gap="3" align="center">
                          <div className="quick-link-icon">
                            {link.icon}
                          </div>
                          <Text weight="medium" size="3">{link.label}</Text>
                          <Button variant="ghost" size="1">
                            Go <ArrowRightIcon />
                          </Button>
                        </Flex>
                      </Card>
                    </Link>
                  ))}
                </Grid>
              </Flex>
            </Card>

            {/* Charts and Recent Activity Section */}
            <Grid columns="2" gap="5">
              {/* Progress Chart */}
              <Card>
                <Flex direction="column" gap="4">
                  <Heading size="4">Submission Progress</Heading>
                  <div className="chart-placeholder">
                    <Flex direction="column" gap="2" className="chart-bars">
                      <Flex justify="between">
                        <Text>Project A</Text>
                        <Text>75%</Text>
                      </Flex>
                      <div className="chart-bar bg-blue-500" style={{ width: '75%' }}></div>
                      
                      <Flex justify="between">
                        <Text>Project B</Text>
                        <Text>90%</Text>
                      </Flex>
                      <div className="chart-bar bg-green-500" style={{ width: '90%' }}></div>
                      
                      <Flex justify="between">
                        <Text>Project C</Text>
                        <Text>45%</Text>
                      </Flex>
                      <div className="chart-bar bg-amber-500" style={{ width: '45%' }}></div>
                      
                      <Flex justify="between">
                        <Text>Project D</Text>
                        <Text>60%</Text>
                      </Flex>
                      <div className="chart-bar bg-purple-500" style={{ width: '60%' }}></div>
                    </Flex>
                  </div>
                </Flex>
              </Card>

              {/* Recent Activity */}
              <Card>
                <Flex direction="column" gap="4">
                  <Heading size="4">Recent Activity</Heading>
                  <div className="activity-list">
                    {recentActivity.map((activity) => (
                      <div key={activity.id} className="activity-item">
                        <Flex justify="between" align="center">
                          <Flex direction="column" gap="1">
                            <Text weight="medium">
                              <span className="text-blue-500">{activity.project}</span>
                              <span className="text-gray-500"> {activity.action}</span>
                            </Text>
                            <Text size="1" color="gray">{activity.time}</Text>
                          </Flex>
                          <ChevronRightIcon className="text-gray-400" />
                        </Flex>
                      </div>
                    ))}
                  </div>
                  <Button variant="soft" className="view-all-btn">
                    View All Activity
                  </Button>
                </Flex>
              </Card>
            </Grid>
          </Container>
        </div>
      </Flex>
    </div>
  );
};

export default MRDashboard;