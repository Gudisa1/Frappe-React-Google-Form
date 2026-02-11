// pages/MRDashboard/FormAssignment.jsx
import React, { useState, useEffect } from 'react';
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
  Box,
  Container,
  Separator,
  ScrollArea,
  Grid,
  IconButton,
  Tooltip,
  AlertDialog
} from '@radix-ui/themes';
import {
  MagnifyingGlassIcon,
  EyeOpenIcon,
  Pencil1Icon,
  CopyIcon,
  TrashIcon,
  CheckCircledIcon,
  CrossCircledIcon,
  ClockIcon,
  FileTextIcon,
  CalendarIcon,
  ChevronDownIcon,
  UploadIcon,
  SymbolIcon,
  CheckIcon,
  PlusIcon
} from '@radix-ui/react-icons';
import Navigation from '../../components/Navigation';
import * as DataCollectionAPI from '../../api/datacollection';
import './FormAssignment.css';

const FormAssignment = () => {
  // ==================== STATE ====================
  const [forms, setForms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Form Preview State
  const [selectedForm, setSelectedForm] = useState(null);
  const [formDetails, setFormDetails] = useState(null);
  const [formFields, setFormFields] = useState([]);
  const [formTargets, setFormTargets] = useState([]);
  const [showPreviewDialog, setShowPreviewDialog] = useState(false);
  
  // Delete Confirmation
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [formToDelete, setFormToDelete] = useState(null);
  
  // Success/Error Messages
  const [message, setMessage] = useState({ type: null, text: '' });
  
  // Stats
  const [stats, setStats] = useState({
    total: 0,
    draft: 0,
    published: 0,
    closed: 0
  });

  // ==================== FETCH FORMS ====================
  useEffect(() => {
    fetchAllForms();
  }, []);

  const fetchAllForms = async () => {
    setIsLoading(true);
    try {
      // Fetch all forms - getReportingForms now returns empty array on error
      const formsData = await DataCollectionAPI.getReportingForms();
      console.log("📊 Forms received:", formsData);
      
      if (!formsData || !Array.isArray(formsData)) {
        console.error("Invalid forms data received:", formsData);
        setForms([]);
        setStats({ total: 0, draft: 0, published: 0, closed: 0 });
        return;
      }
      
      setForms(formsData);
      
      // Calculate stats - FIXED: Changed 'Archived' to 'Closed'
      const draftCount = formsData.filter(f => f.status === 'Draft').length;
      const publishedCount = formsData.filter(f => f.status === 'Published').length;
      const closedCount = formsData.filter(f => f.status === 'Closed').length;
      
      setStats({
        total: formsData.length,
        draft: draftCount,
        published: publishedCount,
        closed: closedCount
      });
      
      console.log("✅ Loaded forms:", formsData.length);
    } catch (error) {
      console.error("❌ Failed to fetch forms:", error);
      setForms([]);
      setStats({ total: 0, draft: 0, published: 0, closed: 0 });
      showTemporaryMessage('error', 'Failed to load forms. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // ==================== SHOW TEMPORARY MESSAGE ====================
  const showTemporaryMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: null, text: '' }), 3000);
  };

  // ==================== FORM PREVIEW ====================
  const handleViewForm = async (form) => {
    setSelectedForm(form);
    setIsLoading(true);
    
    try {
      // Fetch complete form details
      const details = await DataCollectionAPI.getFormDetails(form.name);
      const fields = await DataCollectionAPI.getFormFields(form.name);
      const targets = await DataCollectionAPI.getFormTargets(form.name);
      
      setFormDetails(details);
      setFormFields(fields.sort((a, b) => a.idx - b.idx));
      setFormTargets(targets);
      setShowPreviewDialog(true);
      
    } catch (error) {
      console.error("❌ Failed to fetch form details:", error);
      showTemporaryMessage('error', 'Failed to load form details. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // ==================== EDIT FORM ====================
  const handleEditForm = (form) => {
    // Store form data in localStorage for the form builder
    const editData = {
      name: form.name,
      title: form.form_title,
      description: form.description || '',
      reportingPeriod: form.reporting_period,
      year: form.year,
      status: form.status,
      isEditing: true
    };
    
    localStorage.setItem('editForm', JSON.stringify(editData));
    
    // Navigate to form builder with edit mode
    window.location.href = '/forms/builder?edit=true';
  };

  // ==================== DELETE FORM ====================
  const handleDeleteClick = (form) => {
    setFormToDelete(form);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (!formToDelete) return;
    
    try {
      await DataCollectionAPI.deleteForm(formToDelete.name);
      
      // Refresh forms list
      await fetchAllForms();
      
      setShowDeleteDialog(false);
      setFormToDelete(null);
      
      showTemporaryMessage('success', `Form "${formToDelete.form_title}" deleted successfully`);
    } catch (error) {
      console.error("❌ Failed to delete form:", error);
      showTemporaryMessage('error', `Failed to delete form: ${error.message}`);
      setShowDeleteDialog(false);
    }
  };

  // ==================== DUPLICATE FORM ====================
  const handleDuplicateForm = async (form) => {
    try {
      setIsLoading(true);
      
      // Fetch complete form details
      const details = await DataCollectionAPI.getFormDetails(form.name);
      const fields = await DataCollectionAPI.getFormFields(form.name);
      const targets = await DataCollectionAPI.getFormTargets(form.name);
      
      // Create new form data
      const newFormData = {
        title: `${form.form_title} (Copy)`,
        description: form.description || '',
        reportingPeriod: form.reporting_period,
        year: form.year,
        status: 'Draft' // Always start as draft
      };
      
      // Transform fields data
      const fieldsData = fields.map(field => ({
        label: field.label,
        type: field.field_type,
        required: field.required === 1,
        options: field.options ? field.options.split('\n').filter(opt => opt.trim()) : []
      }));
      
      // Transform targets data
      const targetsData = targets.map(target => ({
        name: target.project,
        project_name: target.project_name
      }));
      
      // Create the duplicated form
      await DataCollectionAPI.createCompleteReportingForm(
        newFormData,
        fieldsData,
        targetsData
      );
      
      // Refresh forms list
      await fetchAllForms();
      
      showTemporaryMessage('success', `Form "${form.form_title}" duplicated successfully!`);
      
    } catch (error) {
      console.error("❌ Failed to duplicate form:", error);
      showTemporaryMessage('error', `Failed to duplicate form: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // ==================== PUBLISH FORM ====================
  const handlePublishForm = async (formName) => {
    try {
      setIsLoading(true);
      await DataCollectionAPI.publishForm(formName);
      
      // Refresh forms list
      await fetchAllForms();
      
      setShowPreviewDialog(false);
      showTemporaryMessage('success', 'Form published successfully!');
      
    } catch (error) {
      console.error("❌ Failed to publish form:", error);
      showTemporaryMessage('error', `Failed to publish form: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // ==================== FILTER FORMS ====================
  const filteredForms = forms.filter(form => {
    // Search filter
    const matchesSearch = searchQuery === '' || 
      form.form_title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      form.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (form.description && form.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Status filter
    const matchesStatus = statusFilter === 'all' || form.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // ==================== STATUS BADGE ====================
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Draft':
        return { color: 'orange', icon: <ClockIcon />, label: 'Draft' };
      case 'Published':
        return { color: 'green', icon: <CheckCircledIcon />, label: 'Active' };
      case 'Closed':
        return { color: 'gray', icon: <CrossCircledIcon />, label: 'Closed' };
      default:
        return { color: 'blue', icon: <FileTextIcon />, label: status };
    }
  };

  // ==================== RENDER FIELD PREVIEW ====================
  const renderFieldPreview = (field) => {
    switch (field.field_type) {
      case 'Data':
        return <div className="field-preview short-text">Short text field</div>;
      case 'Text':
        return <div className="field-preview long-text">Long text field</div>;
      case 'Int':
      case 'Float':
        return <div className="field-preview number">Number field</div>;
      case 'Date':
        return <div className="field-preview date"><CalendarIcon /> Date field</div>;
      case 'Select':
        return <div className="field-preview select">Dropdown <ChevronDownIcon /></div>;
      case 'Check':
        return <div className="field-preview checkbox">✓ Checkbox field</div>;
      case 'Attach':
        return <div className="field-preview attach"><UploadIcon /> File upload</div>;
      default:
        return <div className="field-preview">{field.field_type}</div>;
    }
  };

  // ==================== RENDER ====================
  return (
    <Navigation>
      <Container size="4" className="forms-management-container">
        {/* Header */}
        <Flex justify="between" align="center" mb="6">
          <div>
            <Heading size="7">Forms Management</Heading>
            <Text size="2" color="gray" mt="1">
              View, preview, and manage all your reporting forms
            </Text>
          </div>
          
          <Button 
            size="3" 
            onClick={() => window.location.href = '/forms/builder'}
          >
            <PlusIcon /> Create New Form
          </Button>
        </Flex>

        {/* Message Alert */}
        {message.type && (
          <Card className={`message-alert ${message.type}`} mb="4">
            <Flex align="center" gap="2">
              {message.type === 'success' ? (
                <CheckCircledIcon color="green" />
              ) : (
                <CrossCircledIcon color="red" />
              )}
              <Text size="2">{message.text}</Text>
            </Flex>
          </Card>
        )}

        {/* Stats Cards */}
        <Grid columns="4" gap="4" mb="6">
          <Card className="stat-card total">
            <Flex direction="column">
              <Text size="2" color="gray">Total Forms</Text>
              <Heading size="7">{stats.total}</Heading>
            </Flex>
          </Card>
          
          <Card className="stat-card draft">
            <Flex direction="column">
              <Text size="2" color="gray">Draft</Text>
              <Heading size="7" style={{ color: 'var(--orange-11)' }}>{stats.draft}</Heading>
            </Flex>
          </Card>
          
          <Card className="stat-card published">
            <Flex direction="column">
              <Text size="2" color="gray">Active</Text>
              <Heading size="7" style={{ color: 'var(--green-11)' }}>{stats.published}</Heading>
            </Flex>
          </Card>
          
          <Card className="stat-card closed">
            <Flex direction="column">
              <Text size="2" color="gray">Closed</Text>
              <Heading size="7" style={{ color: 'var(--gray-11)' }}>{stats.closed}</Heading>
            </Flex>
          </Card>
        </Grid>

        {/* Filters */}
        <Card className="filters-card" mb="4">
          <Flex gap="4" align="center">
            <TextField.Root
              placeholder="Search forms by title or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              size="2"
              style={{ flex: 1 }}
            >
              <TextField.Slot>
                <MagnifyingGlassIcon />
              </TextField.Slot>
            </TextField.Root>
            
            <select 
              className="status-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="Draft">Draft</option>
              <option value="Published">Active</option>
              <option value="Closed">Closed</option>
            </select>
          </Flex>
        </Card>

        {/* Forms Table */}
        <Card className="forms-table-card">
          <ScrollArea style={{ height: 'calc(100vh - 450px)' }}>
            <Table.Root>
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeaderCell>Form Title</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>ID</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Period</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Questions</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Projects</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Created</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Actions</Table.ColumnHeaderCell>
                </Table.Row>
              </Table.Header>

              <Table.Body>
                {isLoading ? (
                  <Table.Row>
                    <Table.Cell colSpan={8}>
                      <Flex justify="center" p="6">
                        <Text color="gray">Loading forms...</Text>
                      </Flex>
                    </Table.Cell>
                  </Table.Row>
                ) : filteredForms.length === 0 ? (
                  <Table.Row>
                    <Table.Cell colSpan={8}>
                      <Flex direction="column" align="center" p="6">
                        <FileTextIcon style={{ width: 48, height: 48, color: 'var(--gray-6)' }} />
                        <Heading size="4" mt="4" weight="medium">No forms found</Heading>
                        <Text color="gray" mt="2" align="center">
                          {searchQuery || statusFilter !== 'all' 
                            ? 'Try adjusting your filters'
                            : 'Create your first form to get started'}
                        </Text>
                        {!searchQuery && statusFilter === 'all' && (
                          <Button 
                            mt="4" 
                            onClick={() => window.location.href = '/forms/builder'}
                          >
                            <PlusIcon /> Create Form
                          </Button>
                        )}
                      </Flex>
                    </Table.Cell>
                  </Table.Row>
                ) : (
                  filteredForms.map((form) => {
                    const status = getStatusBadge(form.status);
                    
                    return (
                      <Table.Row key={form.name} className="form-row">
                        <Table.Cell>
                          <Text weight="medium">{form.form_title}</Text>
                          {form.description && (
                            <Text size="1" color="gray" style={{ maxWidth: 250 }}>
                              {form.description.length > 60 
                                ? `${form.description.substring(0, 60)}...` 
                                : form.description}
                            </Text>
                          )}
                        </Table.Cell>
                        
                        <Table.Cell>
                          <Text size="1" className="form-id">{form.name}</Text>
                        </Table.Cell>
                        
                        <Table.Cell>
                          <Badge variant="soft">
                            {form.reporting_period} {form.year}
                          </Badge>
                        </Table.Cell>
                        
                        <Table.Cell>
                          <Badge color={status.color} variant="soft">
                            <Flex align="center" gap="1">
                              {status.icon}
                              {status.label}
                            </Flex>
                          </Badge>
                        </Table.Cell>
                        
                        <Table.Cell>
                          <Badge variant="soft" color="blue">
                            {form.fields_count || 0}
                          </Badge>
                        </Table.Cell>
                        
                        <Table.Cell>
                          <Badge variant="soft" color="amber">
                            {form.targets_count || 0}
                          </Badge>
                        </Table.Cell>
                        
                        <Table.Cell>
                          <Text size="2">
                            {form.creation ? new Date(form.creation).toLocaleDateString() : '-'}
                          </Text>
                        </Table.Cell>
                        
                        <Table.Cell>
                          <Flex gap="2">
                            <Tooltip content="View Form">
                              <IconButton 
                                size="2" 
                                variant="ghost" 
                                onClick={() => handleViewForm(form)}
                              >
                                <EyeOpenIcon />
                              </IconButton>
                            </Tooltip>
                            
                            <Tooltip content="Edit Form">
                              <IconButton 
                                size="2" 
                                variant="ghost" 
                                color="blue"
                                onClick={() => handleEditForm(form)}
                              >
                                <Pencil1Icon />
                              </IconButton>
                            </Tooltip>
                            
                            <Tooltip content="Duplicate">
                              <IconButton 
                                size="2" 
                                variant="ghost" 
                                color="green"
                                onClick={() => handleDuplicateForm(form)}
                              >
                                <CopyIcon />
                              </IconButton>
                            </Tooltip>
                            
                            {form.status === 'Draft' && (
                              <Tooltip content="Delete">
                                <IconButton 
                                  size="2" 
                                  variant="ghost" 
                                  color="red"
                                  onClick={() => handleDeleteClick(form)}
                                >
                                  <TrashIcon />
                                </IconButton>
                              </Tooltip>
                            )}
                          </Flex>
                        </Table.Cell>
                      </Table.Row>
                    );
                  })
                )}
              </Table.Body>
            </Table.Root>
          </ScrollArea>
        </Card>

        {/* ==================== FORM PREVIEW DIALOG ==================== */}
        <Dialog.Root open={showPreviewDialog} onOpenChange={setShowPreviewDialog}>
          <Dialog.Content style={{ maxWidth: 800, maxHeight: '90vh' }}>
            <Dialog.Title>
              <Flex justify="between" align="center">
                <Text>{formDetails?.form_title || 'Form Preview'}</Text>
                {formDetails?.status && (
                  <Badge color={getStatusBadge(formDetails.status).color} variant="soft">
                    {getStatusBadge(formDetails.status).label}
                  </Badge>
                )}
              </Flex>
            </Dialog.Title>
            
            <Dialog.Description size="2" mb="4">
              {formDetails?.description || 'No description provided'}
            </Dialog.Description>

            <ScrollArea style={{ maxHeight: 'calc(90vh - 200px)' }}>
              <Flex direction="column" gap="4">
                {/* Form Metadata */}
                <Card size="1" className="preview-metadata">
                  <Grid columns="3" gap="3">
                    <Box>
                      <Text size="1" color="gray">Reporting Period</Text>
                      <Text weight="medium">{formDetails?.reporting_period} {formDetails?.year}</Text>
                    </Box>
                    <Box>
                      <Text size="1" color="gray">Created</Text>
                      <Text size="2">{formDetails?.creation ? new Date(formDetails.creation).toLocaleDateString() : '-'}</Text>
                    </Box>
                    <Box>
                      <Text size="1" color="gray">Last Modified</Text>
                      <Text size="2">{formDetails?.modified ? new Date(formDetails.modified).toLocaleDateString() : '-'}</Text>
                    </Box>
                  </Grid>
                </Card>

                {/* Form Fields */}
                <div>
                  <Heading size="4" mb="3">Form Questions ({formFields.length})</Heading>
                  <Flex direction="column" gap="3">
                    {formFields.map((field, index) => (
                      <Card key={field.name} size="2" className="preview-field">
                        <Flex gap="3">
                          <Badge size="1" color="gray" variant="soft">
                            Q{index + 1}
                          </Badge>
                          <Box style={{ flex: 1 }}>
                            <Flex align="center" gap="2" mb="2">
                              <Text weight="medium">{field.label}</Text>
                              <Badge size="1">{field.field_type}</Badge>
                              {field.required === 1 && (
                                <Badge size="1" color="red">Required</Badge>
                              )}
                            </Flex>
                            {field.options && (
                              <Text size="1" color="gray" mb="2">
                                Options: {field.options.split('\n').join(', ')}
                              </Text>
                            )}
                            <div className="field-preview-container">
                              {renderFieldPreview(field)}
                            </div>
                          </Box>
                        </Flex>
                      </Card>
                    ))}
                  </Flex>
                </div>

                {/* Target Projects */}
                <div>
                  <Heading size="4" mb="3">Target Projects ({formTargets.length})</Heading>
                  <Flex direction="column" gap="2">
                    {formTargets.map((target) => (
                      <Card key={target.name} size="1">
                        <Flex align="center" gap="2">
                          <CheckCircledIcon color="green" />
                          <Text>{target.project_name}</Text>
                          <Text size="1" color="gray">({target.project})</Text>
                        </Flex>
                      </Card>
                    ))}
                    {formTargets.length === 0 && (
                      <Text color="gray" size="2">No projects assigned to this form</Text>
                    )}
                  </Flex>
                </div>
              </Flex>
            </ScrollArea>

            <Flex justify="end" gap="3" mt="4">
              <Dialog.Close>
                <Button variant="soft">Close</Button>
              </Dialog.Close>
              
              <Button 
                color="blue"
                onClick={() => {
                  setShowPreviewDialog(false);
                  handleEditForm(selectedForm);
                }}
              >
                <Pencil1Icon /> Edit Form
              </Button>
              
              {formDetails?.status === 'Draft' && (
                <Button 
                  color="green"
                  onClick={() => handlePublishForm(formDetails.name)}
                  disabled={isLoading}
                >
                  <CheckCircledIcon /> Publish Form
                </Button>
              )}
            </Flex>
          </Dialog.Content>
        </Dialog.Root>

        {/* ==================== DELETE CONFIRMATION DIALOG ==================== */}
        <AlertDialog.Root open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialog.Content>
            <AlertDialog.Title>Delete Form</AlertDialog.Title>
            <AlertDialog.Description>
              Are you sure you want to delete "{formToDelete?.form_title}"? 
              This action cannot be undone.
            </AlertDialog.Description>
            
            <Flex gap="3" mt="4" justify="end">
              <AlertDialog.Cancel>
                <Button variant="soft">Cancel</Button>
              </AlertDialog.Cancel>
              <AlertDialog.Action>
                <Button 
                  color="red" 
                  onClick={confirmDelete}
                  disabled={isLoading}
                >
                  <TrashIcon /> Delete Form
                </Button>
              </AlertDialog.Action>
            </Flex>
          </AlertDialog.Content>
        </AlertDialog.Root>
      </Container>
    </Navigation>
  );
};

export default FormAssignment;