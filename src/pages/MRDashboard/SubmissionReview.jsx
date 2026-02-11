// pages/MRDashboard/SubmissionReview.jsx
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
  Select,
  Box,
  Container,
  Separator,
  Tabs
} from '@radix-ui/themes';
import {
  MagnifyingGlassIcon,
  DownloadIcon,
  EyeOpenIcon,
  CheckCircledIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  ChevronRightIcon,
  CalendarIcon,
  BarChartIcon,
  MixerHorizontalIcon,
  FileTextIcon
} from '@radix-ui/react-icons';
import Navigation from '../../components/Navigation';
import './SubmissionReview.css';

const SubmissionReview = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterProject, setFilterProject] = useState('all');
  const [filterForm, setFilterForm] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  // Mock data - submissions
  const [submissions, setSubmissions] = useState([
    {
      id: '1',
      projectId: '1',
      projectName: 'Ethio Telecom Network Upgrade',
      formId: '1',
      formTitle: 'Site Inspection Form',
      submittedBy: 'Alemayehu T.',
      submissionDate: '2024-01-15T10:30:00',
      dueDate: '2024-01-15T23:59:59',
      status: 'submitted',
      responses: 15,
      pending: 0,
      attachments: 3
    },
    {
      id: '2',
      projectId: '1',
      projectName: 'Ethio Telecom Network Upgrade',
      formId: '2',
      formTitle: 'Weekly Progress Report',
      submittedBy: 'Alemayehu T.',
      submissionDate: '2024-01-14T14:20:00',
      dueDate: '2024-01-14T23:59:59',
      status: 'submitted',
      responses: 20,
      pending: 0,
      attachments: 2
    },
    {
      id: '3',
      projectId: '2',
      projectName: 'Addis Ababa Smart City',
      formId: '1',
      formTitle: 'Site Inspection Form',
      submittedBy: 'Mekdes W.',
      submissionDate: '2024-01-15T09:15:00',
      dueDate: '2024-01-16T23:59:59',
      status: 'submitted',
      responses: 15,
      pending: 0,
      attachments: 4
    },
    {
      id: '4',
      projectId: '3',
      projectName: 'OMO II Hydroelectric',
      formId: '3',
      formTitle: 'Material Delivery Checklist',
      submittedBy: 'Samuel K.',
      submissionDate: '2024-01-13T16:45:00',
      dueDate: '2024-01-13T23:59:59',
      status: 'submitted',
      responses: 12,
      pending: 0,
      attachments: 5
    },
    {
      id: '5',
      projectId: '4',
      projectName: 'Dire Dawa Industrial Park',
      formId: '4',
      formTitle: 'Quality Assurance Form',
      submittedBy: 'Hana M.',
      submissionDate: '2024-01-12T11:20:00',
      dueDate: '2024-01-15T23:59:59',
      status: 'overdue',
      responses: 8,
      pending: 4,
      attachments: 1
    },
    {
      id: '6',
      projectId: '5',
      projectName: 'Hawassa Textile Factory',
      formId: '1',
      formTitle: 'Site Inspection Form',
      submittedBy: 'Tewodros A.',
      submissionDate: '2024-01-15T08:45:00',
      dueDate: '2024-01-17T23:59:59',
      status: 'submitted',
      responses: 15,
      pending: 0,
      attachments: 2
    },
    {
      id: '7',
      projectId: '6',
      projectName: 'Bahir Dar University Expansion',
      formId: '2',
      formTitle: 'Weekly Progress Report',
      submittedBy: 'Yordanos G.',
      submissionDate: '2024-01-14T13:30:00',
      dueDate: '2024-01-16T23:59:59',
      status: 'pending',
      responses: 5,
      pending: 15,
      attachments: 0
    },
    {
      id: '8',
      projectId: '7',
      projectName: 'Mekelle Airport Renovation',
      formId: '5',
      formTitle: 'Safety Compliance Report',
      submittedBy: 'Abebe Z.',
      submissionDate: null,
      dueDate: '2024-01-20T23:59:59',
      status: 'pending',
      responses: 0,
      pending: 20,
      attachments: 0
    },
  ]);

  // Mock data - projects for filter
  const projects = [
    { id: 'all', name: 'All Projects' },
    { id: '1', name: 'Ethio Telecom Network Upgrade' },
    { id: '2', name: 'Addis Ababa Smart City' },
    { id: '3', name: 'OMO II Hydroelectric' },
    { id: '4', name: 'Dire Dawa Industrial Park' },
    { id: '5', name: 'Hawassa Textile Factory' },
    { id: '6', name: 'Bahir Dar University Expansion' },
    { id: '7', name: 'Mekelle Airport Renovation' },
  ];

  // Mock data - forms for filter
  const forms = [
    { id: 'all', title: 'All Forms' },
    { id: '1', title: 'Site Inspection Form' },
    { id: '2', title: 'Weekly Progress Report' },
    { id: '3', title: 'Material Delivery Checklist' },
    { id: '4', title: 'Quality Assurance Form' },
    { id: '5', title: 'Safety Compliance Report' },
    { id: '6', title: 'Equipment Maintenance Log' },
  ];

  // Status options
  const statusOptions = [
    { id: 'all', label: 'All Status' },
    { id: 'submitted', label: 'Submitted' },
    { id: 'pending', label: 'Pending' },
    { id: 'overdue', label: 'Overdue' },
  ];

  // Filter submissions
  const filteredSubmissions = submissions.filter(submission => {
    const matchesSearch = submission.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         submission.formTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         submission.submittedBy.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesProject = filterProject === 'all' || submission.projectId === filterProject;
    const matchesForm = filterForm === 'all' || submission.formId === filterForm;
    const matchesStatus = filterStatus === 'all' || submission.status === filterStatus;
    
    // Tab filtering
    if (activeTab === 'submitted' && submission.status !== 'submitted') return false;
    if (activeTab === 'pending' && submission.status !== 'pending') return false;
    if (activeTab === 'overdue' && submission.status !== 'overdue') return false;
    
    return matchesSearch && matchesProject && matchesForm && matchesStatus;
  });

  // Statistics
  const stats = {
    total: submissions.length,
    submitted: submissions.filter(s => s.status === 'submitted').length,
    pending: submissions.filter(s => s.status === 'pending').length,
    overdue: submissions.filter(s => s.status === 'overdue').length,
    totalResponses: submissions.reduce((sum, s) => sum + s.responses, 0),
    totalAttachments: submissions.reduce((sum, s) => sum + s.attachments, 0),
  };

  // View submission details
  const viewSubmissionDetails = (submission) => {
    setSelectedSubmission(submission);
    setShowDetails(true);
  };

  // Export data
  const exportToCSV = () => {
    const csvContent = [
      ['Project Name', 'Form Title', 'Submitted By', 'Submission Date', 'Due Date', 'Status', 'Responses', 'Attachments'],
      ...filteredSubmissions.map(s => [
        s.projectName,
        s.formTitle,
        s.submittedBy,
        new Date(s.submissionDate).toLocaleDateString(),
        new Date(s.dueDate).toLocaleDateString(),
        s.status,
        s.responses,
        s.attachments
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `submissions_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    
    alert('CSV export started!');
  };

  // Export to Excel (simulated)
  const exportToExcel = () => {
    alert('Excel export would be implemented with a library like SheetJS');
  };

  // Status badge
  const getStatusBadge = (status) => {
    switch (status) {
      case 'submitted':
        return <Badge color="green" variant="soft">Submitted</Badge>;
      case 'pending':
        return <Badge color="amber" variant="soft">Pending</Badge>;
      case 'overdue':
        return <Badge color="red" variant="soft">Overdue</Badge>;
      default:
        return <Badge color="gray" variant="soft">Unknown</Badge>;
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Not submitted';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Navigation>
      <Container size="3" className="submission-container">
        {/* Header */}
        <div className="submission-header">
          <div>
            <Heading size="7">Submission Review</Heading>
            <Text size="2" color="gray">View and analyze form responses from projects</Text>
          </div>
          
          <Flex gap="3">
            <Button 
              variant="soft"
              onClick={exportToCSV}
            >
              <DownloadIcon /> Export CSV
            </Button>
            <Button 
              variant="outline"
              onClick={exportToExcel}
            >
              <DownloadIcon /> Export Excel
            </Button>
          </Flex>
        </div>

        {/* Statistics Cards */}
        <div className="stats-grid">
          <Card className="stat-card">
            <Flex direction="column" gap="2">
              <Text size="2" color="gray">Total Submissions</Text>
              <Heading size="6">{stats.total}</Heading>
            </Flex>
          </Card>
          
          <Card className="stat-card">
            <Flex direction="column" gap="2">
              <Flex align="center" gap="2">
                <CheckCircledIcon color="green" />
                <Text size="2" color="gray">Submitted</Text>
              </Flex>
              <Heading size="6" color="green">{stats.submitted}</Heading>
            </Flex>
          </Card>
          
          <Card className="stat-card">
            <Flex direction="column" gap="2">
              <Flex align="center" gap="2">
                <ClockIcon color="amber" />
                <Text size="2" color="gray">Pending</Text>
              </Flex>
              <Heading size="6" color="amber">{stats.pending}</Heading>
            </Flex>
          </Card>
          
          <Card className="stat-card">
            <Flex direction="column" gap="2">
              <Flex align="center" gap="2">
                <ExclamationTriangleIcon color="red" />
                <Text size="2" color="gray">Overdue</Text>
              </Flex>
              <Heading size="6" color="red">{stats.overdue}</Heading>
            </Flex>
          </Card>
        </div>

        <Separator size="4" />

        {/* Tabs */}
        <Tabs.Root value={activeTab} onValueChange={setActiveTab} className="submission-tabs">
          <Tabs.List>
            <Tabs.Trigger value="all">All ({stats.total})</Tabs.Trigger>
            <Tabs.Trigger value="submitted">Submitted ({stats.submitted})</Tabs.Trigger>
            <Tabs.Trigger value="pending">Pending ({stats.pending})</Tabs.Trigger>
            <Tabs.Trigger value="overdue">Overdue ({stats.overdue})</Tabs.Trigger>
          </Tabs.List>
        </Tabs.Root>

        {/* Filters */}
        <Card className="filters-card">
          <Flex direction="column" gap="4">
            <TextField.Root
              placeholder="Search submissions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              size="2"
              className="search-input"
            >
              <TextField.Slot>
                <MagnifyingGlassIcon />
              </TextField.Slot>
            </TextField.Root>
            
            <div className="filter-grid">
              <div className="filter-section">
                <Text as="label" size="2" weight="medium">Project</Text>
                <Select.Root value={filterProject} onValueChange={setFilterProject}>
                  <Select.Trigger />
                  <Select.Content>
                    {projects.map(project => (
                      <Select.Item key={project.id} value={project.id}>
                        {project.name}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Root>
              </div>
              
              <div className="filter-section">
                <Text as="label" size="2" weight="medium">Form</Text>
                <Select.Root value={filterForm} onValueChange={setFilterForm}>
                  <Select.Trigger />
                  <Select.Content>
                    {forms.map(form => (
                      <Select.Item key={form.id} value={form.id}>
                        {form.title}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Root>
              </div>
              
              <div className="filter-section">
                <Text as="label" size="2" weight="medium">Status</Text>
                <Select.Root value={filterStatus} onValueChange={setFilterStatus}>
                  <Select.Trigger />
                  <Select.Content>
                    {statusOptions.map(status => (
                      <Select.Item key={status.id} value={status.id}>
                        {status.label}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Root>
              </div>
              
              <div className="filter-section">
                <Text as="label" size="2" weight="medium">Actions</Text>
                <Flex gap="2">
                  <Button 
                    size="2" 
                    variant="soft"
                    onClick={() => {
                      setFilterProject('all');
                      setFilterForm('all');
                      setFilterStatus('all');
                      setSearchQuery('');
                    }}
                  >
                    Clear Filters
                  </Button>
                </Flex>
              </div>
            </div>
          </Flex>
        </Card>

        {/* Submissions Table */}
        <Card className="submissions-card">
          <Table.Root>
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeaderCell>Project Name</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Form Title</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Submitted By</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Submission Date</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Due Date</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Details</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Actions</Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {filteredSubmissions.map((submission) => (
                <Table.Row key={submission.id} className="submission-row">
                  <Table.Cell>
                    <Text weight="medium">{submission.projectName}</Text>
                  </Table.Cell>
                  
                  <Table.Cell>
                    <Text>{submission.formTitle}</Text>
                  </Table.Cell>
                  
                  <Table.Cell>
                    <Text size="2">{submission.submittedBy}</Text>
                  </Table.Cell>
                  
                  <Table.Cell>
                    <Text size="2">{formatDate(submission.submissionDate)}</Text>
                  </Table.Cell>
                  
                  <Table.Cell>
                    <Text size="2">
                      <Flex align="center" gap="2">
                        <CalendarIcon />
                        {new Date(submission.dueDate).toLocaleDateString()}
                      </Flex>
                    </Text>
                  </Table.Cell>
                  
                  <Table.Cell>
                    {getStatusBadge(submission.status)}
                    {submission.status === 'submitted' && (
                      <Text size="1" color="gray" mt="1">
                        {submission.responses} responses • {submission.attachments} files
                      </Text>
                    )}
                  </Table.Cell>
                  
                  <Table.Cell>
                    {submission.status === 'submitted' ? (
                      <Flex gap="2" align="center">
                        <Badge variant="soft" color="blue">
                          {submission.responses} responses
                        </Badge>
                        {submission.attachments > 0 && (
                          <Badge variant="soft" color="gray">
                            {submission.attachments} files
                          </Badge>
                        )}
                      </Flex>
                    ) : (
                      <Text size="2" color="gray">
                        {submission.pending} pending
                      </Text>
                    )}
                  </Table.Cell>
                  
                  <Table.Cell>
                    {submission.status === 'submitted' ? (
                      <Button
                        size="1"
                        variant="ghost"
                        onClick={() => viewSubmissionDetails(submission)}
                      >
                        <EyeOpenIcon /> View
                      </Button>
                    ) : (
                      <Button
                        size="1"
                        variant="outline"
                        disabled
                      >
                        Not Available
                      </Button>
                    )}
                  </Table.Cell>
                </Table.Row>
              ))}
              
              {filteredSubmissions.length === 0 && (
                <Table.Row>
                  <Table.Cell colSpan={8}>
                    <div className="empty-table">
                      <FileTextIcon size="24" />
                      <Text size="2" color="gray" mt="2">No submissions found matching your filters.</Text>
                    </div>
                  </Table.Cell>
                </Table.Row>
              )}
            </Table.Body>
          </Table.Root>
          
          <Flex justify="between" align="center" mt="4" pt="4" className="table-footer">
            <Text size="2" color="gray">
              Showing {filteredSubmissions.length} of {submissions.length} submissions
            </Text>
            <Text size="2" color="gray">
              Total responses: {stats.totalResponses} • Total files: {stats.totalAttachments}
            </Text>
          </Flex>
        </Card>

        {/* Form Statistics */}
        <Card className="stats-summary-card">
          <Heading size="4" mb="4">Form Statistics</Heading>
          <div className="form-stats-grid">
            {forms.slice(1).map(form => {
              const formSubmissions = submissions.filter(s => s.formId === form.id);
              const submitted = formSubmissions.filter(s => s.status === 'submitted').length;
              const total = formSubmissions.length;
              const completionRate = total > 0 ? Math.round((submitted / total) * 100) : 0;
              
              return (
                <div key={form.id} className="form-stat-card">
                  <Text weight="medium">{form.title}</Text>
                  <Flex justify="between" align="center" mt="2">
                    <Text size="2" color="gray">
                      {submitted}/{total} submitted
                    </Text>
                    <Badge color={completionRate >= 80 ? "green" : completionRate >= 50 ? "amber" : "red"}>
                      {completionRate}%
                    </Badge>
                  </Flex>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ width: `${completionRate}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </Container>

      {/* Submission Details Dialog */}
      <Dialog.Root open={showDetails} onOpenChange={setShowDetails}>
        <Dialog.Content className="details-dialog">
          {selectedSubmission && (
            <>
              <Dialog.Title>
                <Flex align="center" gap="2">
                  <FileTextIcon />
                  Submission Details
                </Flex>
              </Dialog.Title>
              
              <Dialog.Description>
                <div className="details-content">
                  <div className="detail-section">
                    <Text size="2" color="gray">Project</Text>
                    <Text weight="medium">{selectedSubmission.projectName}</Text>
                  </div>
                  
                  <div className="detail-section">
                    <Text size="2" color="gray">Form</Text>
                    <Text weight="medium">{selectedSubmission.formTitle}</Text>
                  </div>
                  
                  <div className="detail-section">
                    <Text size="2" color="gray">Submitted By</Text>
                    <Text>{selectedSubmission.submittedBy}</Text>
                  </div>
                  
                  <div className="detail-section">
                    <Text size="2" color="gray">Submission Date</Text>
                    <Text>{formatDate(selectedSubmission.submissionDate)}</Text>
                  </div>
                  
                  <div className="detail-section">
                    <Text size="2" color="gray">Due Date</Text>
                    <Text>{new Date(selectedSubmission.dueDate).toLocaleDateString()}</Text>
                  </div>
                  
                  <Separator />
                  
                  <div className="detail-section">
                    <Text size="2" color="gray">Responses</Text>
                    <Badge variant="soft" color="blue">
                      {selectedSubmission.responses} questions answered
                    </Badge>
                  </div>
                  
                  <div className="detail-section">
                    <Text size="2" color="gray">Attachments</Text>
                    <Badge variant="soft" color="gray">
                      {selectedSubmission.attachments} files attached
                    </Badge>
                  </div>
                  
                  <Separator />
                  
                  <Flex direction="column" gap="3" mt="4">
                    <Button>
                      <EyeOpenIcon /> View Full Responses
                    </Button>
                    <Button variant="soft">
                      <DownloadIcon /> Download Attachments
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

export default SubmissionReview;