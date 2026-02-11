// pages/MRDashboard/ProjectManagement.jsx
import React, { useState } from 'react';
import {
  Card,
  Flex,
  Text,
  Heading,
  Button,
  TextField,
  Table,
  Badge,
  Dialog,
  Container,
  Separator,
  Tabs,
  Checkbox,
  Select
} from '@radix-ui/themes';
import {
  MagnifyingGlassIcon,
  EyeOpenIcon,
  PaperPlaneIcon,
  CalendarIcon,
  AvatarIcon,
  GlobeIcon ,
  HomeIcon ,
  ChevronRightIcon,
  ClockIcon,
  CheckCircledIcon,
  ExclamationTriangleIcon,
  PlusIcon,
  MixerHorizontalIcon 
} from '@radix-ui/react-icons';
import Navigation from '../../components/Navigation';
import './ProjectManagement.css';

const ProjectManagement = () => {
  const [activeTab, setActiveTab] = useState('projects');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterRegion, setFilterRegion] = useState('all');
  const [selectedProjects, setSelectedProjects] = useState([]);
  const [selectedForm, setSelectedForm] = useState('');
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showProjectDetails, setShowProjectDetails] = useState(false);

  // Mock data - projects
  const [projects, setProjects] = useState([
    {
      id: '1',
      name: 'Ethio Telecom Network Upgrade',
      code: 'ET-2024-001',
      region: 'Addis Ababa',
      location: 'Bole, Addis Ababa',
      manager: 'Alemayehu T.',
      managerEmail: 'alex@eakbc.com',
      status: 'active',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      budget: '$2.5M',
      assignedForms: 3,
      completedForms: 12,
      pendingForms: 2,
      submissionRate: '85%'
    },
    {
      id: '2',
      name: 'Addis Ababa Smart City',
      code: 'AA-2024-002',
      region: 'Addis Ababa',
      location: 'Addis Ababa City',
      manager: 'Mekdes W.',
      managerEmail: 'mekdes@eakbc.com',
      status: 'active',
      startDate: '2024-01-15',
      endDate: '2025-06-30',
      budget: '$5.0M',
      assignedForms: 4,
      completedForms: 20,
      pendingForms: 3,
      submissionRate: '87%'
    },
    {
      id: '3',
      name: 'OMO II Hydroelectric',
      code: 'OM-2024-003',
      region: 'SNNPR',
      location: 'Omo River, SNNPR',
      manager: 'Samuel K.',
      managerEmail: 'samuel@eakbc.com',
      status: 'active',
      startDate: '2023-11-01',
      endDate: '2025-03-31',
      budget: '$15.0M',
      assignedForms: 5,
      completedForms: 45,
      pendingForms: 0,
      submissionRate: '100%'
    },
    {
      id: '4',
      name: 'Dire Dawa Industrial Park',
      code: 'DD-2024-004',
      region: 'Dire Dawa',
      location: 'Dire Dawa Industrial Zone',
      manager: 'Hana M.',
      managerEmail: 'hana@eakbc.com',
      status: 'on-hold',
      startDate: '2023-12-01',
      endDate: '2024-06-30',
      budget: '$3.2M',
      assignedForms: 2,
      completedForms: 8,
      pendingForms: 1,
      submissionRate: '89%'
    },
    {
      id: '5',
      name: 'Hawassa Textile Factory',
      code: 'HT-2024-005',
      region: 'SNNPR',
      location: 'Hawassa Industrial Park',
      manager: 'Tewodros A.',
      managerEmail: 'tewodros@eakbc.com',
      status: 'active',
      startDate: '2024-02-01',
      endDate: '2024-11-30',
      budget: '$1.8M',
      assignedForms: 3,
      completedForms: 15,
      pendingForms: 1,
      submissionRate: '94%'
    },
    {
      id: '6',
      name: 'Bahir Dar University Expansion',
      code: 'BD-2024-006',
      region: 'Amhara',
      location: 'Bahir Dar University',
      manager: 'Yordanos G.',
      managerEmail: 'yordanos@eakbc.com',
      status: 'active',
      startDate: '2024-01-10',
      endDate: '2024-10-31',
      budget: '$4.5M',
      assignedForms: 4,
      completedForms: 18,
      pendingForms: 2,
      submissionRate: '90%'
    },
    {
      id: '7',
      name: 'Mekelle Airport Renovation',
      code: 'MK-2024-007',
      region: 'Tigray',
      location: 'Mekelle Airport',
      manager: 'Abebe Z.',
      managerEmail: 'abebe@eakbc.com',
      status: 'planning',
      startDate: '2024-03-01',
      endDate: '2024-12-31',
      budget: '$8.0M',
      assignedForms: 1,
      completedForms: 0,
      pendingForms: 1,
      submissionRate: '0%'
    },
    {
      id: '8',
      name: 'Gondar Hospital Construction',
      code: 'GH-2024-008',
      region: 'Amhara',
      location: 'Gondar City',
      manager: 'Sara D.',
      managerEmail: 'sara@eakbc.com',
      status: 'active',
      startDate: '2023-10-01',
      endDate: '2024-09-30',
      budget: '$6.5M',
      assignedForms: 3,
      completedForms: 30,
      pendingForms: 0,
      submissionRate: '100%'
    },
  ]);

  // Mock data - forms
  const forms = [
    { id: '1', title: 'Site Inspection Form', category: 'Safety' },
    { id: '2', title: 'Weekly Progress Report', category: 'Progress' },
    { id: '3', title: 'Material Delivery Checklist', category: 'Logistics' },
    { id: '4', title: 'Quality Assurance Form', category: 'Quality' },
    { id: '5', title: 'Safety Compliance Report', category: 'Safety' },
  ];

  // Regions for filter
  const regions = [
    { id: 'all', name: 'All Regions' },
    { id: 'Addis Ababa', name: 'Addis Ababa' },
    { id: 'Amhara', name: 'Amhara' },
    { id: 'Oromia', name: 'Oromia' },
    { id: 'SNNPR', name: 'SNNPR' },
    { id: 'Tigray', name: 'Tigray' },
    { id: 'Dire Dawa', name: 'Dire Dawa' },
  ];

  // Status options
  const statusOptions = [
    { id: 'all', label: 'All Status' },
    { id: 'active', label: 'Active' },
    { id: 'on-hold', label: 'On Hold' },
    { id: 'planning', label: 'Planning' },
    { id: 'completed', label: 'Completed' },
  ];

  // Filter projects
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.manager.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || project.status === filterStatus;
    const matchesRegion = filterRegion === 'all' || project.region === filterRegion;
    
    return matchesSearch && matchesStatus && matchesRegion;
  });

  // Select/Deselect all
  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedProjects(filteredProjects.map(p => p.id));
    } else {
      setSelectedProjects([]);
    }
  };

  const handleSelectProject = (projectId) => {
    if (selectedProjects.includes(projectId)) {
      setSelectedProjects(selectedProjects.filter(id => id !== projectId));
    } else {
      setSelectedProjects([...selectedProjects, projectId]);
    }
  };

  // Assign forms
  const handleAssignForms = () => {
    if (selectedProjects.length === 0 || !selectedForm) {
      alert('Please select at least one project and a form.');
      return;
    }
    setShowAssignDialog(true);
  };

  const confirmAssignment = () => {
    // In real app, this would update projects with assigned forms
    const updatedProjects = projects.map(project => {
      if (selectedProjects.includes(project.id)) {
        return {
          ...project,
          assignedForms: project.assignedForms + 1,
          pendingForms: project.pendingForms + 1
        };
      }
      return project;
    });

    setProjects(updatedProjects);
    setShowAssignDialog(false);
    setSelectedProjects([]);
    setSelectedForm('');
    
    alert(`Form assigned to ${selectedProjects.length} project(s) successfully!`);
  };

  // View project details
  const viewProjectDetails = (project) => {
    setSelectedProject(project);
    setShowProjectDetails(true);
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'green';
      case 'on-hold': return 'amber';
      case 'planning': return 'blue';
      case 'completed': return 'gray';
      default: return 'gray';
    }
  };

  // Get submission rate color
  const getRateColor = (rate) => {
    const percentage = parseInt(rate);
    if (percentage >= 90) return 'green';
    if (percentage >= 70) return 'amber';
    return 'red';
  };

  return (
    <Navigation>
      <Container size="3" className="project-container">
        {/* Header */}
        <div className="project-header">
          <div>
            <Heading size="7">Project Management</Heading>
            <Text size="2" color="gray">Manage projects and assign forms</Text>
          </div>
          
          <Button 
            variant="soft"
            onClick={() => {
              // Add new project
              console.log('Add new project');
            }}
          >
            <PlusIcon /> New Project
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <Card className="stat-card">
            <Flex direction="column" gap="2">
              <Text size="2" color="gray">Total Projects</Text>
              <Heading size="6">{projects.length}</Heading>
            </Flex>
          </Card>
          
          <Card className="stat-card">
            <Flex direction="column" gap="2">
              <Text size="2" color="gray">Active Projects</Text>
              <Heading size="6" color="green">
                {projects.filter(p => p.status === 'active').length}
              </Heading>
            </Flex>
          </Card>
          
          <Card className="stat-card">
            <Flex direction="column" gap="2">
              <Text size="2" color="gray">Total Forms Assigned</Text>
              <Heading size="6">
                {projects.reduce((sum, p) => sum + p.assignedForms, 0)}
              </Heading>
            </Flex>
          </Card>
          
          <Card className="stat-card">
            <Flex direction="column" gap="2">
              <Text size="2" color="gray">Pending Submissions</Text>
              <Heading size="6" color="amber">
                {projects.reduce((sum, p) => sum + p.pendingForms, 0)}
              </Heading>
            </Flex>
          </Card>
        </div>

        <Separator size="4" />

        {/* Quick Assign Section */}
        <Card className="quick-assign-card">
          <Flex direction="column" gap="4">
            <Heading size="4">Quick Form Assignment</Heading>
            
            <div className="assign-form">
              <div className="assign-section">
                <Text as="label" size="2" weight="medium">Select Form</Text>
                <Select.Root value={selectedForm} onValueChange={setSelectedForm}>
                  <Select.Trigger placeholder="Choose a form..." />
                  <Select.Content>
                    {forms.map(form => (
                      <Select.Item key={form.id} value={form.id}>
                        {form.title}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Root>
              </div>
              
              <div className="assign-section">
                <Text as="label" size="2" weight="medium">Selected Projects</Text>
                <div className="selection-count">
                  <Badge color={selectedProjects.length > 0 ? "blue" : "gray"}>
                    {selectedProjects.length} projects selected
                  </Badge>
                </div>
              </div>
              
              <div className="assign-section">
                <Text as="label" size="2" weight="medium">&nbsp;</Text>
                <Button 
                  onClick={handleAssignForms}
                  disabled={selectedProjects.length === 0 || !selectedForm}
                >
                  <PaperPlaneIcon /> Assign Form
                </Button>
              </div>
            </div>
          </Flex>
        </Card>

        {/* Filters */}
        <Card className="filters-card">
          <Flex direction="column" gap="4">
            <TextField.Root
              placeholder="Search projects, codes, or managers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              size="2"
              className="search-input"
            >
              <TextField.Slot>
                <MagnifyingGlassIcon />
              </TextField.Slot>
            </TextField.Root>
            
            <div className="filter-row">
              <div className="filter-group">
                <Text as="label" size="2" weight="medium">Region</Text>
                <Select.Root value={filterRegion} onValueChange={setFilterRegion}>
                  <Select.Trigger>
                    <MixerHorizontalIcon  /> Region
                  </Select.Trigger>
                  <Select.Content>
                    {regions.map(region => (
                      <Select.Item key={region.id} value={region.id}>
                        {region.name}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Root>
              </div>
              
              <div className="filter-group">
                <Text as="label" size="2" weight="medium">Status</Text>
                <Select.Root value={filterStatus} onValueChange={setFilterStatus}>
                  <Select.Trigger>
                    <MixerHorizontalIcon  /> Status
                  </Select.Trigger>
                  <Select.Content>
                    {statusOptions.map(status => (
                      <Select.Item key={status.id} value={status.id}>
                        {status.label}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Root>
              </div>
              
              <div className="filter-group">
                <Text as="label" size="2" weight="medium">&nbsp;</Text>
                <Button 
                  variant="soft"
                  onClick={() => {
                    setFilterStatus('all');
                    setFilterRegion('all');
                    setSearchQuery('');
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          </Flex>
        </Card>

        {/* Projects Table */}
        <Card className="projects-table-card">
          <Table.Root>
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeaderCell width="50px">
                  <Checkbox
                    checked={filteredProjects.length > 0 && selectedProjects.length === filteredProjects.length}
                    onCheckedChange={handleSelectAll}
                  />
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Project</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Location</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Manager</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Forms</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Submission Rate</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Actions</Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {filteredProjects.map((project) => (
                <Table.Row key={project.id} className="project-row">
                  <Table.Cell>
                    <Checkbox
                      checked={selectedProjects.includes(project.id)}
                      onCheckedChange={() => handleSelectProject(project.id)}
                    />
                  </Table.Cell>
                  
                  <Table.Cell>
                    <Flex direction="column" gap="1">
                      <Text weight="medium">{project.name}</Text>
                      <Text size="2" color="gray">{project.code}</Text>
                      <Flex align="center" gap="1" mt="1">
                        <CalendarIcon size="12" />
                        <Text size="1">
                          {new Date(project.startDate).toLocaleDateString()} - {new Date(project.endDate).toLocaleDateString()}
                        </Text>
                      </Flex>
                    </Flex>
                  </Table.Cell>
                  
                  <Table.Cell>
                    <Flex direction="column" gap="1">
                      <Flex align="center" gap="1">
                        <GlobeIcon  size="12" />
                        <Text size="2">{project.region}</Text>
                      </Flex>
                      <Text size="1" color="gray">{project.location}</Text>
                    </Flex>
                  </Table.Cell>
                  
                  <Table.Cell>
                    <Flex direction="column" gap="1">
                      <Flex align="center" gap="1">
                        <AvatarIcon size="12" />
                        <Text size="2">{project.manager}</Text>
                      </Flex>
                      <Text size="1" color="gray">{project.managerEmail}</Text>
                    </Flex>
                  </Table.Cell>
                  
                  <Table.Cell>
                    <Badge color={getStatusColor(project.status)} variant="soft">
                      {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                    </Badge>
                  </Table.Cell>
                  
                  <Table.Cell>
                    <Flex direction="column" gap="1">
                      <Flex gap="2">
                        <Badge variant="soft" color="blue">
                          {project.assignedForms} assigned
                        </Badge>
                        {project.pendingForms > 0 && (
                          <Badge variant="soft" color="amber">
                            {project.pendingForms} pending
                          </Badge>
                        )}
                      </Flex>
                      <Text size="1" color="gray">
                        {project.completedForms} completed
                      </Text>
                    </Flex>
                  </Table.Cell>
                  
                  <Table.Cell>
                    <Badge color={getRateColor(project.submissionRate)} variant="soft">
                      {project.submissionRate}
                    </Badge>
                    <div className="progress-bar">
                      <div 
                        className="progress-fill"
                        style={{ width: project.submissionRate }}
                      />
                    </div>
                  </Table.Cell>
                  
                  <Table.Cell>
                    <Button
                      size="1"
                      variant="ghost"
                      onClick={() => viewProjectDetails(project)}
                    >
                      <EyeOpenIcon /> Details
                    </Button>
                  </Table.Cell>
                </Table.Row>
              ))}
              
              {filteredProjects.length === 0 && (
                <Table.Row>
                  <Table.Cell colSpan={8}>
                    <div className="empty-table">
                      <HomeIcon size="24" />
                      <Text size="2" color="gray" mt="2">No projects found matching your filters.</Text>
                    </div>
                  </Table.Cell>
                </Table.Row>
              )}
            </Table.Body>
          </Table.Root>
          
          <Flex justify="between" align="center" mt="4" pt="4" className="table-footer">
            <Text size="2" color="gray">
              Showing {filteredProjects.length} of {projects.length} projects
            </Text>
            <Text size="2" color="gray">
              {selectedProjects.length} projects selected
            </Text>
          </Flex>
        </Card>

        {/* Project Activity */}
        <Card className="activity-card">
          <Heading size="4" mb="4">Recent Project Activity</Heading>
          <div className="activity-list">
            <div className="activity-item">
              <Flex gap="3">
                <div className="activity-icon">
                  <PaperPlaneIcon />
                </div>
                <div>
                  <Text weight="medium">Site Inspection Form assigned</Text>
                  <Text size="2" color="gray">To Ethio Telecom Network Upgrade • 2 hours ago</Text>
                </div>
              </Flex>
            </div>
            
            <div className="activity-item">
              <Flex gap="3">
                <div className="activity-icon">
                  <CheckCircledIcon />
                </div>
                <div>
                  <Text weight="medium">Weekly Progress Report submitted</Text>
                  <Text size="2" color="gray">By Alemayehu T. • 4 hours ago</Text>
                </div>
              </Flex>
            </div>
            
            <div className="activity-item">
              <Flex gap="3">
                <div className="activity-icon">
                  <ClockIcon />
                </div>
                <div>
                  <Text weight="medium">Quality Assurance Form pending</Text>
                  <Text size="2" color="gray">Dire Dawa Industrial Park • 1 day ago</Text>
                </div>
              </Flex>
            </div>
          </div>
        </Card>
      </Container>

      {/* Assign Confirmation Dialog */}
      <Dialog.Root open={showAssignDialog} onOpenChange={setShowAssignDialog}>
        <Dialog.Content>
          <Dialog.Title>Confirm Form Assignment</Dialog.Title>
          
          <Dialog.Description>
            <Flex direction="column" gap="4">
              <Text>
                Assign <strong>{forms.find(f => f.id === selectedForm)?.title}</strong> to {selectedProjects.length} project(s):
              </Text>
              
              <div className="selected-projects-list">
                {projects
                  .filter(p => selectedProjects.includes(p.id))
                  .map(project => (
                    <div key={project.id} className="project-item">
                      <Text size="2">{project.name}</Text>
                      <Text size="1" color="gray">{project.code}</Text>
                    </div>
                  ))
                }
              </div>
              
              <Text size="2" color="gray">
                Project managers will receive notifications about the new form assignment.
              </Text>
            </Flex>
          </Dialog.Description>
          
          <Flex gap="3" mt="4" justify="end">
            <Dialog.Close>
              <Button variant="soft">Cancel</Button>
            </Dialog.Close>
            <Button onClick={confirmAssignment}>
              <PaperPlaneIcon /> Assign Form
            </Button>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>

      {/* Project Details Dialog */}
      <Dialog.Root open={showProjectDetails} onOpenChange={setShowProjectDetails}>
        <Dialog.Content className="project-details-dialog">
          {selectedProject && (
            <>
              <Dialog.Title>
                <Flex align="center" gap="2">
                  <BuildingIcon />
                  {selectedProject.name}
                </Flex>
              </Dialog.Title>
              
              <Dialog.Description>
                <div className="project-details-content">
                  <div className="details-grid">
                    <div className="detail-item">
                      <Text size="2" color="gray">Project Code</Text>
                      <Text weight="medium">{selectedProject.code}</Text>
                    </div>
                    
                    <div className="detail-item">
                      <Text size="2" color="gray">Status</Text>
                      <Badge color={getStatusColor(selectedProject.status)} variant="soft">
                        {selectedProject.status}
                      </Badge>
                    </div>
                    
                    <div className="detail-item">
                      <Text size="2" color="gray">Region</Text>
                      <Text>{selectedProject.region}</Text>
                    </div>
                    
                    <div className="detail-item">
                      <Text size="2" color="gray">Location</Text>
                      <Text>{selectedProject.location}</Text>
                    </div>
                    
                    <div className="detail-item">
                      <Text size="2" color="gray">Project Manager</Text>
                      <Text>{selectedProject.manager}</Text>
                      <Text size="1" color="gray">{selectedProject.managerEmail}</Text>
                    </div>
                    
                    <div className="detail-item">
                      <Text size="2" color="gray">Budget</Text>
                      <Text weight="medium">{selectedProject.budget}</Text>
                    </div>
                    
                    <div className="detail-item">
                      <Text size="2" color="gray">Timeline</Text>
                      <Text>
                        {new Date(selectedProject.startDate).toLocaleDateString()} - {new Date(selectedProject.endDate).toLocaleDateString()}
                      </Text>
                    </div>
                    
                    <div className="detail-item">
                      <Text size="2" color="gray">Submission Rate</Text>
                      <Badge color={getRateColor(selectedProject.submissionRate)} variant="soft">
                        {selectedProject.submissionRate}
                      </Badge>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  {/* Form Statistics */}
                  <Heading size="4" mt="4" mb="3">Form Statistics</Heading>
                  <div className="form-stats">
                    <div className="form-stat-item">
                      <Text size="2" color="gray">Total Forms Assigned</Text>
                      <Heading size="5">{selectedProject.assignedForms}</Heading>
                    </div>
                    
                    <div className="form-stat-item">
                      <Text size="2" color="gray">Completed Submissions</Text>
                      <Heading size="5" color="green">{selectedProject.completedForms}</Heading>
                    </div>
                    
                    <div className="form-stat-item">
                      <Text size="2" color="gray">Pending Submissions</Text>
                      <Heading size="5" color="amber">{selectedProject.pendingForms}</Heading>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <Flex gap="3" mt="4">
                    <Button variant="soft">
                      <EyeOpenIcon /> View All Submissions
                    </Button>
                    <Button>
                      <PaperPlaneIcon /> Assign New Form
                    </Button>
                  </Flex>
                </div>
              </Dialog.Description>
            </>
          )}
        </Dialog.Content>
      </Dialog.Root>
    </Navigation>
  );
};

export default ProjectManagement;