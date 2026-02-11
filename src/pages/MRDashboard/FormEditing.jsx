// pages/MRDashboard/FormEditing.jsx
import React, { useState, useEffect } from 'react';
import {
  Card,
  Flex,
  Text,
  Heading,
  Button,
  Table,
  Badge,
  Dialog,
  AlertDialog,
  Container,
  Separator,
  Tabs,
  Box,
  TextField,
  TextArea,
  Select,
  Switch
} from '@radix-ui/themes';
import {
  ClockIcon,
    CopyIcon,
  TrashIcon,
  EyeOpenIcon,
  DownloadIcon,
  ChevronRightIcon,
  FileTextIcon,
  ExclamationTriangleIcon,
  CheckCircledIcon,
  Pencil1Icon,
  PlusIcon,
  ArrowLeftIcon
} from '@radix-ui/react-icons';
import Navigation from '../../components/Navigation';
import './FormEditing.css';

const FormEditing = () => {
  const [activeTab, setActiveTab] = useState('forms');
  const [selectedForm, setSelectedForm] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showVersionDialog, setShowVersionDialog] = useState(false);
  const [showUpdateWarning, setShowUpdateWarning] = useState(false);
  const [editingForm, setEditingForm] = useState(null);
  const [newQuestion, setNewQuestion] = useState('');
  const [versionNote, setVersionNote] = useState('');

  // Mock data - forms
  const [forms, setForms] = useState([
    {
      id: '1',
      title: 'Site Inspection Form',
      description: 'Daily site inspection checklist',
      category: 'Safety',
      createdDate: '2024-01-01',
      lastModified: '2024-01-15',
      status: 'active',
      submissions: 24,
      versions: 3,
      questions: [
        { id: 'q1', text: 'Project Name', type: 'text', required: true },
        { id: 'q2', text: 'Site Safety Status', type: 'multiple-choice', required: true },
        { id: 'q3', text: 'Inspection Date', type: 'date', required: true },
      ]
    },
    {
      id: '2',
      title: 'Weekly Progress Report',
      description: 'Weekly project progress updates',
      category: 'Progress',
      createdDate: '2024-01-05',
      lastModified: '2024-01-12',
      status: 'active',
      submissions: 18,
      versions: 2,
      questions: [
        { id: 'q1', text: 'Progress Percentage', type: 'number', required: true },
        { id: 'q2', text: 'Challenges Faced', type: 'paragraph', required: false },
      ]
    },
    {
      id: '3',
      title: 'Material Delivery Checklist',
      description: 'Track material deliveries to site',
      category: 'Logistics',
      createdDate: '2024-01-03',
      lastModified: '2024-01-10',
      status: 'draft',
      submissions: 0,
      versions: 1,
      questions: [
        { id: 'q1', text: 'Material Type', type: 'text', required: true },
        { id: 'q2', text: 'Delivery Date', type: 'date', required: true },
      ]
    },
    {
      id: '4',
      title: 'Quality Assurance Form',
      description: 'Quality control checkpoints',
      category: 'Quality',
      createdDate: '2023-12-20',
      lastModified: '2024-01-08',
      status: 'archived',
      submissions: 12,
      versions: 4,
      questions: [
        { id: 'q1', text: 'Quality Rating', type: 'rating', required: true },
        { id: 'q2', text: 'Issues Found', type: 'checkbox', required: false },
      ]
    },
  ]);

  // Mock data - versions
  const [versions, setVersions] = useState({
    '1': [
      {
        id: 'v1.3',
        version: '1.3',
        date: '2024-01-15',
        author: 'Admin User',
        changes: 'Added safety compliance questions',
        note: 'Enhanced safety section',
        submissions: 10
      },
      {
        id: 'v1.2',
        version: '1.2',
        date: '2024-01-10',
        author: 'Admin User',
        changes: 'Fixed date format validation',
        note: 'Bug fixes',
        submissions: 8
      },
      {
        id: 'v1.1',
        version: '1.1',
        date: '2024-01-05',
        author: 'Admin User',
        changes: 'Added project details section',
        note: 'Initial revisions',
        submissions: 6
      },
      {
        id: 'v1.0',
        version: '1.0',
        date: '2024-01-01',
        author: 'Admin User',
        changes: 'Initial form creation',
        note: 'First version',
        submissions: 0
      },
    ],
    '2': [
      {
        id: 'v2.1',
        version: '2.1',
        date: '2024-01-12',
        author: 'Admin User',
        changes: 'Added progress percentage field',
        note: 'Enhanced metrics',
        submissions: 5
      },
      {
        id: 'v2.0',
        version: '2.0',
        date: '2024-01-05',
        author: 'Admin User',
        changes: 'Initial form creation',
        note: 'First version',
        submissions: 0
      },
    ]
  });

  // Select form for editing
  const selectForm = (form) => {
    setSelectedForm(form);
    setEditingForm({ ...form });
    setActiveTab('edit');
  };

  // Create new version
  const createNewVersion = () => {
    if (!versionNote.trim()) {
      alert('Please add a version note');
      return;
    }

    const newVersion = {
      id: `v${selectedForm.versions + 1}.0`,
      version: `${selectedForm.versions + 1}.0`,
      date: new Date().toISOString().split('T')[0],
      author: 'Current User',
      changes: 'Form updated',
      note: versionNote,
      submissions: 0
    };

    // Update form
    const updatedForms = forms.map(f => 
      f.id === selectedForm.id 
        ? { 
            ...f, 
            versions: f.versions + 1,
            lastModified: new Date().toISOString().split('T')[0]
          }
        : f
    );

    // Update versions
    const updatedVersions = {
      ...versions,
      [selectedForm.id]: [newVersion, ...(versions[selectedForm.id] || [])]
    };

    setForms(updatedForms);
    setVersions(updatedVersions);
    setVersionNote('');
    setShowVersionDialog(false);
    
    alert(`New version ${selectedForm.versions + 1}.0 created successfully!`);
  };

  // Duplicate form
  const duplicateForm = (formId) => {
    const formToDuplicate = forms.find(f => f.id === formId);
    if (formToDuplicate) {
      const newForm = {
        ...formToDuplicate,
        id: Date.now().toString(),
        title: `${formToDuplicate.title} (Copy)`,
        status: 'draft',
        submissions: 0,
        versions: 1,
        createdDate: new Date().toISOString().split('T')[0],
        lastModified: new Date().toISOString().split('T')[0]
      };
      setForms([...forms, newForm]);
      alert('Form duplicated successfully!');
    }
  };

  // Delete form
  const deleteForm = (formId) => {
    if (forms.find(f => f.id === formId).submissions > 0) {
      alert('Cannot delete form with existing submissions');
      return;
    }
    setForms(forms.filter(f => f.id !== formId));
    setShowDeleteDialog(false);
    alert('Form deleted successfully!');
  };

  // Update question
  const updateQuestion = (questionId, updates) => {
    if (!editingForm) return;
    
    const updatedQuestions = editingForm.questions.map(q =>
      q.id === questionId ? { ...q, ...updates } : q
    );
    
    setEditingForm({
      ...editingForm,
      questions: updatedQuestions
    });
  };

  // Add new question
  const addNewQuestion = () => {
    if (!newQuestion.trim()) {
      alert('Please enter question text');
      return;
    }

    const newQuestionObj = {
      id: `q${Date.now()}`,
      text: newQuestion,
      type: 'text',
      required: false
    };

    setEditingForm({
      ...editingForm,
      questions: [...editingForm.questions, newQuestionObj]
    });
    setNewQuestion('');
  };

  // Remove question
  const removeQuestion = (questionId) => {
    setEditingForm({
      ...editingForm,
      questions: editingForm.questions.filter(q => q.id !== questionId)
    });
  };

  // Save form edits
  const saveFormEdits = () => {
    const updatedForms = forms.map(f =>
      f.id === editingForm.id ? { ...f, ...editingForm } : f
    );
    setForms(updatedForms);
    
    if (editingForm.submissions > 0) {
      setShowUpdateWarning(true);
    } else {
      alert('Form updated successfully!');
      setActiveTab('forms');
      setSelectedForm(null);
      setEditingForm(null);
    }
  };

  // Send updated form to projects
  const sendUpdatedForm = () => {
    // In real app, this would send notifications to assigned projects
    alert('Updated form sent to all assigned projects!');
    setShowUpdateWarning(false);
    setActiveTab('forms');
    setSelectedForm(null);
    setEditingForm(null);
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'green';
      case 'draft': return 'blue';
      case 'archived': return 'gray';
      default: return 'gray';
    }
  };

  // Get type badge
  const getTypeBadge = (type) => {
    const typeMap = {
      'text': { label: 'Text', color: 'blue' },
      'paragraph': { label: 'Paragraph', color: 'green' },
      'multiple-choice': { label: 'Multiple Choice', color: 'purple' },
      'checkbox': { label: 'Checkbox', color: 'amber' },
      'date': { label: 'Date', color: 'cyan' },
      'number': { label: 'Number', color: 'indigo' },
      'rating': { label: 'Rating', color: 'pink' }
    };
    
    const info = typeMap[type] || { label: 'Unknown', color: 'gray' };
    return <Badge color={info.color} variant="soft">{info.label}</Badge>;
  };

  return (
    <Navigation>
      <Container size="3" className="form-editing-container">
        {/* Header with Tabs */}
        <div className="editing-header">
          {activeTab === 'forms' ? (
            <>
              <div>
                <Heading size="7">Form Editing</Heading>
                <Text size="2" color="gray">Update forms and track version history</Text>
              </div>
              
              <Button 
                variant="soft"
                onClick={() => {
                  // Create new form
                  console.log('Create new form');
                }}
              >
                <PlusIcon /> New Form
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                onClick={() => {
                  setActiveTab('forms');
                  setSelectedForm(null);
                  setEditingForm(null);
                }}
              >
                <ArrowLeftIcon /> Back to Forms
              </Button>
              
              <Heading size="5">
                {selectedForm?.title}
                <Badge 
                  color={getStatusColor(selectedForm?.status)} 
                  variant="soft" 
                  ml="2"
                >
                  {selectedForm?.status}
                </Badge>
              </Heading>
            </>
          )}
        </div>

        {/* Forms List View */}
        {activeTab === 'forms' && (
          <>
            <div className="stats-grid">
              <Card className="stat-card">
                <Flex direction="column" gap="2">
                  <Text size="2" color="gray">Total Forms</Text>
                  <Heading size="6">{forms.length}</Heading>
                </Flex>
              </Card>
              
              <Card className="stat-card">
                <Flex direction="column" gap="2">
                  <Text size="2" color="gray">Active Forms</Text>
                  <Heading size="6" color="green">
                    {forms.filter(f => f.status === 'active').length}
                  </Heading>
                </Flex>
              </Card>
              
              <Card className="stat-card">
                <Flex direction="column" gap="2">
                  <Text size="2" color="gray">Total Submissions</Text>
                  <Heading size="6">
                    {forms.reduce((sum, f) => sum + f.submissions, 0)}
                  </Heading>
                </Flex>
              </Card>
              
              <Card className="stat-card">
                <Flex direction="column" gap="2">
                  <Text size="2" color="gray">Total Versions</Text>
                  <Heading size="6">
                    {forms.reduce((sum, f) => sum + f.versions, 0)}
                  </Heading>
                </Flex>
              </Card>
            </div>

            <Separator size="4" />

            {/* Forms Table */}
            <Card className="forms-table-card">
              <Table.Root>
                <Table.Header>
                  <Table.Row>
                    <Table.ColumnHeaderCell>Form Title</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Category</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Questions</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Submissions</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Versions</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Last Modified</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Actions</Table.ColumnHeaderCell>
                  </Table.Row>
                </Table.Header>

                <Table.Body>
                  {forms.map((form) => (
                    <Table.Row key={form.id} className="form-row">
                      <Table.Cell>
                        <Text weight="medium">{form.title}</Text>
                        <Text size="2" color="gray">{form.description}</Text>
                      </Table.Cell>
                      
                      <Table.Cell>
                        <Badge variant="soft">{form.category}</Badge>
                      </Table.Cell>
                      
                      <Table.Cell>
                        <Badge color={getStatusColor(form.status)} variant="soft">
                          {form.status.charAt(0).toUpperCase() + form.status.slice(1)}
                        </Badge>
                      </Table.Cell>
                      
                      <Table.Cell>
                        <Text>{form.questions.length}</Text>
                      </Table.Cell>
                      
                      <Table.Cell>
                        <Text weight="medium">{form.submissions}</Text>
                      </Table.Cell>
                      
                      <Table.Cell>
                        <Flex align="center" gap="2">
                          <ClockIcon />
                          <Text>{form.versions}</Text>
                        </Flex>
                      </Table.Cell>
                      
                      <Table.Cell>
                        <Text size="2">
                          {new Date(form.lastModified).toLocaleDateString()}
                        </Text>
                      </Table.Cell>
                      
                      <Table.Cell>
                        <Flex gap="2">
                          <Button
                            size="1"
                            variant="ghost"
                            onClick={() => selectForm(form)}
                          >
                            <Pencil1Icon /> Edit
                          </Button>
                          
                          <Button
                            size="1"
                            variant="ghost"
                            onClick={() => duplicateForm(form.id)}
                          >
                            <CopyIcon /> Duplicate
                          </Button>
                          
                          {form.submissions === 0 && (
                            <Button
                              size="1"
                              variant="ghost"
                              color="red"
                              onClick={() => {
                                setSelectedForm(form);
                                setShowDeleteDialog(true);
                              }}
                            >
                              <TrashIcon />
                            </Button>
                          )}
                        </Flex>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Root>
            </Card>
          </>
        )}

        {/* Form Editing View */}
        {activeTab === 'edit' && editingForm && (
          <>
            <Tabs.Root defaultValue="edit" className="editing-tabs">
              <Tabs.List>
                <Tabs.Trigger value="edit">
                  <Pencil1Icon /> Edit Form
                </Tabs.Trigger>
                <Tabs.Trigger value="versions">
                  <ClockIcon /> Version History
                </Tabs.Trigger>
                <Tabs.Trigger value="preview">
                  <EyeOpenIcon /> Preview
                </Tabs.Trigger>
              </Tabs.List>

              {/* Edit Tab */}
              <Tabs.Content value="edit">
                <Card className="edit-form-card">
                  <Flex direction="column" gap="4">
                    <div className="form-header-section">
                      <TextField.Root
                        value={editingForm.title}
                        onChange={(e) => setEditingForm({
                          ...editingForm,
                          title: e.target.value
                        })}
                        placeholder="Form Title"
                        size="3"
                      />
                      
                      <TextArea
                        value={editingForm.description}
                        onChange={(e) => setEditingForm({
                          ...editingForm,
                          description: e.target.value
                        })}
                        placeholder="Form Description"
                        rows={2}
                      />
                      
                      <Flex gap="4">
                        <div className="form-field">
                          <Text as="label" size="2" weight="medium">Category</Text>
                          <Select.Root
                            value={editingForm.category}
                            onValueChange={(value) => setEditingForm({
                              ...editingForm,
                              category: value
                            })}
                          >
                            <Select.Trigger />
                            <Select.Content>
                              <Select.Item value="Safety">Safety</Select.Item>
                              <Select.Item value="Progress">Progress</Select.Item>
                              <Select.Item value="Logistics">Logistics</Select.Item>
                              <Select.Item value="Quality">Quality</Select.Item>
                              <Select.Item value="Maintenance">Maintenance</Select.Item>
                            </Select.Content>
                          </Select.Root>
                        </div>
                        
                        <div className="form-field">
                          <Text as="label" size="2" weight="medium">Status</Text>
                          <Select.Root
                            value={editingForm.status}
                            onValueChange={(value) => setEditingForm({
                              ...editingForm,
                              status: value
                            })}
                          >
                            <Select.Trigger />
                            <Select.Content>
                              <Select.Item value="active">Active</Select.Item>
                              <Select.Item value="draft">Draft</Select.Item>
                              <Select.Item value="archived">Archived</Select.Item>
                            </Select.Content>
                          </Select.Root>
                        </div>
                      </Flex>
                    </div>

                    <Separator />

                    {/* Questions Section */}
                    <div className="questions-section">
                      <Heading size="4">Questions</Heading>
                      
                      <div className="questions-list">
                        {editingForm.questions.map((question) => (
                          <Card key={question.id} className="question-card">
                            <Flex direction="column" gap="3">
                              <Flex justify="between" align="center">
                                <Flex align="center" gap="2">
                                  {getTypeBadge(question.type)}
                                  {question.required && (
                                    <Badge color="red" variant="soft">Required</Badge>
                                  )}
                                </Flex>
                                
                                <Button
                                  size="1"
                                  variant="ghost"
                                  color="red"
                                  onClick={() => removeQuestion(question.id)}
                                >
                                  <TrashIcon />
                                </Button>
                              </Flex>
                              
                              <TextField.Root
                                value={question.text}
                                onChange={(e) => updateQuestion(question.id, {
                                  text: e.target.value
                                })}
                                placeholder="Question text"
                              />
                              
                              <Flex gap="4">
                                <div className="question-field">
                                  <Text as="label" size="2">Type</Text>
                                  <Select.Root
                                    value={question.type}
                                    onValueChange={(value) => updateQuestion(question.id, {
                                      type: value
                                    })}
                                  >
                                    <Select.Trigger size="1" />
                                    <Select.Content>
                                      <Select.Item value="text">Text</Select.Item>
                                      <Select.Item value="paragraph">Paragraph</Select.Item>
                                      <Select.Item value="multiple-choice">Multiple Choice</Select.Item>
                                      <Select.Item value="checkbox">Checkbox</Select.Item>
                                      <Select.Item value="date">Date</Select.Item>
                                      <Select.Item value="number">Number</Select.Item>
                                      <Select.Item value="rating">Rating</Select.Item>
                                    </Select.Content>
                                  </Select.Root>
                                </div>
                                
                                <div className="question-field">
                                  <Text as="label" size="2">Required</Text>
                                  <Switch
                                    checked={question.required}
                                    onCheckedChange={(checked) => updateQuestion(question.id, {
                                      required: checked
                                    })}
                                  />
                                </div>
                              </Flex>
                            </Flex>
                          </Card>
                        ))}
                      </div>

                      {/* Add New Question */}
                      <Card className="add-question-card">
                        <Flex gap="3">
                          <TextField.Root
                            value={newQuestion}
                            onChange={(e) => setNewQuestion(e.target.value)}
                            placeholder="Enter new question text"
                            style={{ flex: 1 }}
                          />
                          <Button onClick={addNewQuestion}>
                            <PlusIcon /> Add Question
                          </Button>
                        </Flex>
                      </Card>
                    </div>

                    <Separator />

                    {/* Action Buttons */}
                    <Flex justify="between" align="center">
                      <Text size="2" color="gray">
                        {editingForm.questions.length} questions • {editingForm.submissions} submissions
                      </Text>
                      
                      <Flex gap="3">
                        <Button
                          variant="soft"
                          onClick={() => setShowVersionDialog(true)}
                        >
                          <ClockIcon  /> Create New Version
                        </Button>
                        
                        <Button onClick={saveFormEdits}>
                          <CheckCircledIcon /> Save Changes
                        </Button>
                      </Flex>
                    </Flex>
                  </Flex>
                </Card>
              </Tabs.Content>

              {/* Version History Tab */}
              <Tabs.Content value="versions">
                <Card className="versions-card">
                  <Flex direction="column" gap="4">
                    <Heading size="4">Version History</Heading>
                    
                    {versions[selectedForm.id] ? (
                      <div className="versions-list">
                        {versions[selectedForm.id].map((version) => (
                          <Card key={version.id} className="version-card">
                            <Flex direction="column" gap="2">
                              <Flex justify="between" align="center">
                                <Flex align="center" gap="2">
                                  <Badge variant="soft">{version.version}</Badge>
                                  <Text weight="medium">{version.note}</Text>
                                </Flex>
                                
                                <Text size="2" color="gray">
                                  {version.date}
                                </Text>
                              </Flex>
                              
                              <Text size="2" color="gray">
                                Changes: {version.changes}
                              </Text>
                              
                              <Flex justify="between" align="center">
                                <Text size="2">
                                  By {version.author}
                                </Text>
                                
                                <Badge variant="soft">
                                  {version.submissions} submissions
                                </Badge>
                              </Flex>
                            </Flex>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="empty-versions">
                        <ClockIcon size="24" />
                        <Text color="gray">No version history available</Text>
                      </div>
                    )}
                  </Flex>
                </Card>
              </Tabs.Content>

              {/* Preview Tab */}
              <Tabs.Content value="preview">
                <Card className="preview-card">
                  <Flex direction="column" gap="4">
                    <Heading size="4">Form Preview</Heading>
                    
                    <div className="preview-content">
                      <Heading size="5">{editingForm.title}</Heading>
                      <Text color="gray">{editingForm.description}</Text>
                      
                      <div className="preview-questions">
                        {editingForm.questions.map((question, index) => (
                          <div key={question.id} className="preview-question">
                            <Text weight="medium">
                              {index + 1}. {question.text}
                              {question.required && <Text color="red"> *</Text>}
                            </Text>
                            <Text size="2" color="gray" mt="1">
                              Type: {question.type} • {question.required ? 'Required' : 'Optional'}
                            </Text>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Flex>
                </Card>
              </Tabs.Content>
            </Tabs.Root>
          </>
        )}
      </Container>

      {/* Delete Confirmation Dialog */}
      <AlertDialog.Root open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialog.Content>
          <AlertDialog.Title>Delete Form</AlertDialog.Title>
          <AlertDialog.Description>
            Are you sure you want to delete "{selectedForm?.title}"?
            This action cannot be undone.
          </AlertDialog.Description>
          
          <Flex gap="3" mt="4" justify="end">
            <AlertDialog.Cancel>
              <Button variant="soft">Cancel</Button>
            </AlertDialog.Cancel>
            <AlertDialog.Action>
              <Button 
                color="red"
                onClick={() => deleteForm(selectedForm?.id)}
              >
                Delete Form
              </Button>
            </AlertDialog.Action>
          </Flex>
        </AlertDialog.Content>
      </AlertDialog.Root>

      {/* Create Version Dialog */}
      <Dialog.Root open={showVersionDialog} onOpenChange={setShowVersionDialog}>
        <Dialog.Content>
          <Dialog.Title>Create New Version</Dialog.Title>
          
          <Dialog.Description>
            <Flex direction="column" gap="4" mt="4">
              <Text size="2" color="gray">
                Creating version {selectedForm?.versions + 1}.0 of "{selectedForm?.title}"
              </Text>
              
              <div>
                <Text as="label" size="2" weight="medium">Version Note</Text>
                <TextArea
                  value={versionNote}
                  onChange={(e) => setVersionNote(e.target.value)}
                  placeholder="Describe what changed in this version..."
                  rows={3}
                  mt="2"
                />
              </div>
              
              {selectedForm?.submissions > 0 && (
                <Card className="warning-card">
                  <Flex gap="2">
                    <ExclamationTriangleIcon color="amber" />
                    <Text size="2" color="amber">
                      This form has {selectedForm.submissions} existing submissions.
                      Projects will need to submit the new version.
                    </Text>
                  </Flex>
                </Card>
              )}
            </Flex>
          </Dialog.Description>
          
          <Flex gap="3" mt="4" justify="end">
            <Dialog.Close>
              <Button variant="soft">Cancel</Button>
            </Dialog.Close>
            <Button onClick={createNewVersion}>
              Create Version {selectedForm?.versions + 1}.0
            </Button>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>

      {/* Update Warning Dialog */}
      <AlertDialog.Root open={showUpdateWarning} onOpenChange={setShowUpdateWarning}>
        <AlertDialog.Content>
          <AlertDialog.Title>Form Has Existing Submissions</AlertDialog.Title>
          <AlertDialog.Description>
            <Flex direction="column" gap="3">
              <Text>
                This form has {editingForm?.submissions} existing submissions.
                Updating it will create a new version.
              </Text>
              
              <Card className="warning-card">
                <Flex gap="2">
                  <ExclamationTriangleIcon color="amber" />
                  <Text size="2">
                    Projects with pending submissions will need to submit the updated version.
                  </Text>
                </Flex>
              </Card>
              
              <Text weight="medium">
                Do you want to send the updated form to all assigned projects?
              </Text>
            </Flex>
          </AlertDialog.Description>
          
          <Flex gap="3" mt="4" justify="end">
            <AlertDialog.Cancel>
              <Button variant="soft">Save Only</Button>
            </AlertDialog.Cancel>
            <AlertDialog.Action>
              <Button onClick={sendUpdatedForm}>
                Save & Send to Projects
              </Button>
            </AlertDialog.Action>
          </Flex>
        </AlertDialog.Content>
      </AlertDialog.Root>
    </Navigation>
  );
};

export default FormEditing;