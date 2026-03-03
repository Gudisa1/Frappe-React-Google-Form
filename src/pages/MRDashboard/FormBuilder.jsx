// pages/FormBuilder.jsx
import React, { useEffect, useState } from 'react';
import {
  Card,
  Flex,
  Text,
  Heading,
  Button,
  TextField,
  TextArea,
  Switch,
  Separator,
  IconButton,
  Badge,
  Container,
  Dialog,
  Select,
  ScrollArea,
  Checkbox,
  Grid,
  Box
} from '@radix-ui/themes';
import {
  PlusIcon,
  TrashIcon,
  DragHandleDots2Icon,
  TextIcon,
  FileTextIcon,
  CheckboxIcon,
  ChevronDownIcon,
  CalendarIcon,
  UploadIcon,
  SymbolIcon,
  EyeOpenIcon,
  PaperPlaneIcon,
  CheckIcon,
  ExclamationTriangleIcon,
  MagnifyingGlassIcon,
  InfoCircledIcon
} from '@radix-ui/react-icons';
import Navigation from '../../components/Navigation';
import './FormBuilder.css';

import { getProjects,createReportingForm,updateReportingForm } from '../../api/datacollection';

const FormBuilder = () => {
  // Form metadata
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [reportingPeriod, setReportingPeriod] = useState('');
  const [year, setYear] = useState(new Date().getFullYear().toString());
  
  // Edit state
  const [isEditing, setIsEditing] = useState(false);
  const [currentFormName, setCurrentFormName] = useState(null);
  
  // Questions
  const [questions, setQuestions] = useState([]);
  const [draggedQuestion, setDraggedQuestion] = useState(null);
  
  // Projects - Using mock data instead of API
const [allProjects, setAllProjects] = useState([]);
  
  const [selectedProjects, setSelectedProjects] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // UI State
  const [isLoading, setIsLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);
  const [showProjectsDialog, setShowProjectsDialog] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [lastSavedForm, setLastSavedForm] = useState(null);
  

  // Question types mapping
  const questionTypes = [
    { id: 'Data', label: 'Short Text', icon: <TextIcon />, color: '#3B82F6' },
    { id: 'Int', label: 'Integer', icon: <SymbolIcon />, color: '#6366F1' },
    { id: 'Float', label: 'Decimal', icon: <SymbolIcon />, color: '#8B5CF6' },
    { id: 'Text', label: 'Long Text', icon: <FileTextIcon />, color: '#10B981' },
    { id: 'Date', label: 'Date', icon: <CalendarIcon />, color: '#06B6D4' },
    { id: 'Select', label: 'Dropdown', icon: <ChevronDownIcon />, color: '#EC4899' },
    { id: 'Check', label: 'Checkbox', icon: <CheckboxIcon />, color: '#F59E0B' },
    { id: 'Attach', label: 'File Upload', icon: <UploadIcon />, color: '#84CC16' },
  ];

  const reportingPeriodOptions = [
    { value: 'Q1', label: 'Quarter 1' },
    { value: 'Q2', label: 'Quarter 2' },
    { value: 'Q3', label: 'Quarter 3' },
    { value: 'Q4', label: 'Quarter 4' },
    { value: 'Other', label: 'Other' }
  ];

  // Gudisa

 useEffect(() => {
    async function fetchAllProjects() {
    try {
      setIsLoading(true);
      const projects = await getProjects(); // your API function
      console.log("📦 Projects loaded:", projects);
      setAllProjects(projects); // update state
      console.log("✅ Projects state updated", projects);
    } catch (error) {
      console.error("❌ Failed to load projects:", error);
    } finally {
      setIsLoading(false);
    }
  }

  fetchAllProjects();
}, []);



  
  // Reporting period options
 
  
  // No useEffect for fetching projects - using mock data instead
  
  // Add new question
  const addQuestion = (typeId) => {
    const type = questionTypes.find(t => t.id === typeId);
    const newQuestion = {
      id: Date.now(),
      type: typeId,
      label: `New ${type?.label || 'Question'}`,
      description: '',
      required: false,
      options: typeId === 'Select' || typeId === 'Check'
        ? ['Option 1', 'Option 2'] 
        : [],
    };
    setQuestions([...questions, newQuestion]);
  };
  
  // Update question
  const updateQuestion = (id, updates) => {
    setQuestions(questions.map(q => 
      q.id === id ? { ...q, ...updates } : q
    ));
  };
  
  // Delete question
  const deleteQuestion = (id) => {
    setQuestions(questions.filter(q => q.id !== id));
  };
  
  // Add option to question
  const addOption = (questionId) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId) {
        const newOptions = [...(q.options || []), `Option ${(q.options?.length || 0) + 1}`];
        return { ...q, options: newOptions };
      }
      return q;
    }));
  };
  
  // Update option
  const updateOption = (questionId, optionIndex, value) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId) {
        const newOptions = [...(q.options || [])];
        newOptions[optionIndex] = value;
        return { ...q, options: newOptions };
      }
      return q;
    }));
  };
  
  // Delete option
  const deleteOption = (questionId, optionIndex) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId) {
        const newOptions = [...(q.options || [])];
        newOptions.splice(optionIndex, 1);
        return { ...q, options: newOptions };
      }
      return q;
    }));
  };
  
  // Drag and drop functionality
  const handleDragStart = (index) => setDraggedQuestion(index);
  const handleDragOver = (e) => e.preventDefault();
  const handleDrop = (dropIndex) => {
    if (draggedQuestion === null) return;
    const newQuestions = [...questions];
    const [draggedItem] = newQuestions.splice(draggedQuestion, 1);
    newQuestions.splice(dropIndex, 0, draggedItem);
    setQuestions(newQuestions);
    setDraggedQuestion(null);
  };
  
  // Render question input preview
  const renderQuestionInput = (question) => {
    const type = questionTypes.find(t => t.id === question.type);
    
    switch (question.type) {
      case 'Data':
        return (
          <div className="input-preview">
            <div className="input-placeholder">
              <div className="placeholder-line" />
            </div>
            <div className="type-badge" style={{ backgroundColor: type?.color }}>
              {type?.label}
            </div>
          </div>
        );
      
      case 'Text':
        return (
          <div className="input-preview">
            <div className="input-placeholder paragraph">
              <div className="placeholder-line" />
              <div className="placeholder-line" />
            </div>
            <div className="type-badge" style={{ backgroundColor: type?.color }}>
              {type?.label}
            </div>
          </div>
        );
      
      case 'Select':
        return (
          <div className="dropdown-preview">
            <div className="dropdown-selector">
              <span>Select an option</span>
              <ChevronDownIcon />
            </div>
            <div className="options-list">
              {question.options?.map((option, idx) => (
                <div key={idx} className="dropdown-option">
                  {option}
                </div>
              ))}
            </div>
          </div>
        );
      
      case 'Check':
        return (
          <div className="options-preview">
            {question.options?.map((option, idx) => (
              <div key={idx} className="option-item">
                <div className="option-selector">
                  <div className="checkbox" />
                </div>
                <div className="option-text">{option}</div>
              </div>
            ))}
          </div>
        );
      
      case 'Date':
        return (
          <div className="input-preview">
            <div className="date-preview">
              <CalendarIcon />
              <span>Select date</span>
            </div>
          </div>
        );
      
      case 'Attach':
        return (
          <div className="file-upload-preview">
            <div className="upload-area">
              <UploadIcon />
              <span>Click to upload</span>
              <Text size="1">Max 5MB • PDF, JPG, PNG</Text>
            </div>
          </div>
        );
      
      case 'Int':
      case 'Float':
        return (
          <div className="input-preview">
            <div className="number-preview">
              <div className="number-placeholder">0</div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };
  
  // // Save form - Mock implementation without API
  // const saveForm = async (action = 'Draft') => {
  //   console.log(`💾 Saving form as ${action}...`);
  //   console.log('📋 Form data:', {
  //     title: formTitle,
  //     description: formDescription,
  //     reportingPeriod,
  //     year,
  //     questions,
  //     selectedProjects
  //   });
    
  //   // Validation
  //   if (!formTitle.trim()) {
  //     setSaveStatus({ type: 'error', message: 'Please enter a form title' });
  //     return;
  //   }
    
  //   if (!reportingPeriod) {
  //     setSaveStatus({ type: 'error', message: 'Please select a reporting period' });
  //     return;
  //   }
    
  //   if (questions.length === 0) {
  //     setSaveStatus({ type: 'error', message: 'Please add at least one question' });
  //     return;
  //   }
    
  //   if (selectedProjects.length === 0) {
  //     setSaveStatus({ type: 'error', message: 'Please select at least one project' });
  //     return;
  //   }
    
  //   setIsLoading(true);
  //   setSaveStatus(null);
  //   try {
  //     // ============ BUILD EXACT PAYLOAD AS PER YOUR EXAMPLE ============
      
  //     // 1. Main form data
  //     const payload = {
  //       doctype: "Reporting Form",
  //       form_title: formTitle,
  //       reporting_period: reportingPeriod,
  //       year: parseInt(year),
  //       status: action === 'Published' ? 'Published' : 'Draft'
  //     };
      
  //     // Add description only if provided (optional field)
  //     if (formDescription.trim()) {
  //       payload.description = formDescription;
  //     }
      
  //     // 2. Fields child table (questions)
  //     payload.fields = questions.map((question) => {
  //       // Handle options for Select/Check fields (join with newlines)
  //       let options = '';
  //       if ((question.type === 'Select' || question.type === 'Check') && question.options?.length > 0) {
  //         options = question.options.join('\n');
  //       }
        
  //       const field = {
  //         doctype: "Reporting Form Field",
  //         parentfield: "fields",
  //         label: question.label,
  //         field_type: question.type,
  //         required: question.required ? 1 : 0,
  //         options: options
  //       };
        
  //       // Add description if exists
  //       if (question.description?.trim()) {
  //         field.description = question.description;
  //       }
        
  //       return field;
  //     });
      
  //     // 3. Target projects child table
  //     payload.target_projects = selectedProjects.map((project) => ({
  //       doctype: "Reporting Form Target",
  //       parentfield: "target_projects",
  //       project: project.name,
  //       project_name: project.project_name,
  //       include: 1
  //     }));
      
  //     console.log('📦 Final Payload:', JSON.stringify(payload, null, 2));
      
  //     // ============ MAKE THE FETCH REQUEST ============
      
  //     // Determine URL and method
  //     let url = '/api/resource/Reporting Form';
  //     let method = 'POST';
      
  //     if (isEditing && currentFormName) {
  //       // Update existing form
  //       url = `/api/resource/Reporting Form/${currentFormName}`;
  //       method = 'PUT';
  //     }
      
  //     console.log(`🌐 Fetch ${method} ${url}`);
      
  //     // Make the fetch request
  //     const response = await fetch(url, {
  //       method: method,
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'Accept': 'application/json'
  //       },
  //       body: JSON.stringify(payload),
  //       credentials: 'include' // Important for session/cookie auth
  //     });
      
  //     // Parse response
  //     const result = await response.json();
  //     console.log('📥 API Response:', result);
      
  //     // Check if request was successful
  //     if (!response.ok) {
  //       throw new Error(result.message || result.exception || `HTTP error ${response.status}`);
  //     }
      
  //     // Get the form name from response (matches your exact response structure)
  //     const formName = result.data?.name || result.name;
      
  //     // Success!
  //     setSaveStatus({ 
  //       type: 'success', 
  //       message: `Form "${formTitle}" ${action === 'Published' ? 'published' : 'saved as draft'} successfully!` 
  //     });
      
  //     // Store last saved form info
  //     setLastSavedForm({
  //       name: formName,
  //       title: formTitle,
  //       fieldsCount: questions.length,
  //       projectsCount: selectedProjects.length,
  //       status: action === 'Published' ? 'Published' : 'Draft'
  //     });
      
  //     // Set editing state
  //     setCurrentFormName(formName);
  //     setIsEditing(true);
      
  //     // Show success dialog for published forms
  //     if (action === 'Published') {
  //       setShowSuccessDialog(true);
  //     }
      
  //     // Scroll to top
  //     window.scrollTo({ top: 0, behavior: 'smooth' });
      
  //   } catch (error) {
  //    console.error('❌ Failed to save form:', error);
  //     setSaveStatus({ 
  //       type: 'error', 
  //       message: `Failed to save form: ${error.message}` 
  //     });
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };
  
  
const saveForm = async (action = 'Draft') => {
  console.log(`💾 Saving form as ${action}...`);
  
  // Validation
  if (!formTitle.trim()) {
    setSaveStatus({ type: 'error', message: 'Please enter a form title' });
    return;
  }
  
  if (!reportingPeriod) {
    setSaveStatus({ type: 'error', message: 'Please select a reporting period' });
    return;
  }
  
  if (questions.length === 0) {
    setSaveStatus({ type: 'error', message: 'Please add at least one question' });
    return;
  }
  
  if (selectedProjects.length === 0) {
    setSaveStatus({ type: 'error', message: 'Please select at least one project' });
    return;
  }
  
  setIsLoading(true);
  setSaveStatus(null);
  
  try {
    // ============ BUILD EXACT PAYLOAD AS PER YOUR EXAMPLE ============
    
    // 1. Main form data
    const payload = {
      doctype: "Reporting Form",
      form_title: formTitle,
      reporting_period: reportingPeriod,
      year: parseInt(year),
      status: action === 'Published' ? 'Published' : 'Draft'
    };
    
    // Add description only if provided (optional field)
    if (formDescription.trim()) {
      payload.description = formDescription;
    }
    
    // 2. Fields child table (questions)
    payload.fields = questions.map((question) => {
      // Handle options for Select/Check fields (join with newlines)
      let options = '';
      if ((question.type === 'Select' || question.type === 'Check') && question.options?.length > 0) {
        options = question.options.join('\n');
      }
      
      const field = {
        doctype: "Reporting Form Field",
        parentfield: "fields",
        label: question.label,
        field_type: question.type,
        required: question.required ? 1 : 0,
        options: options
      };
      
      // Add description if exists
      if (question.description?.trim()) {
        field.description = question.description;
      }
      
      return field;
    });
    
    // 3. Target projects child table
    payload.target_projects = selectedProjects.map((project) => ({
      doctype: "Reporting Form Target",
      parentfield: "target_projects",
      project: project.name,
      project_name: project.project_name,
      include: 1
    }));
    
    console.log('📦 Final Payload:', JSON.stringify(payload, null, 2));
    
    // ============ CALL THE APPROPRIATE API FUNCTION ============
    
    let result;
    if (isEditing && currentFormName) {
      // Update existing form
      result = await updateReportingForm(currentFormName, payload);
    } else {
      // Create new form
      result = await createReportingForm(payload);
    }
    
    console.log('📥 API Response:', result);
    
    // Get the form name from response
    const formName = result.data?.name || result.name;
    
    // Success!
    setSaveStatus({ 
      type: 'success', 
      message: `Form "${formTitle}" ${action === 'Published' ? 'published' : 'saved as draft'} successfully!` 
    });
    
    // Store last saved form info
    setLastSavedForm({
      name: formName,
      title: formTitle,
      fieldsCount: questions.length,
      projectsCount: selectedProjects.length,
      status: action === 'Published' ? 'Published' : 'Draft'
    });
    
    // Set editing state
    setCurrentFormName(formName);
    setIsEditing(true);
    
    // Show success dialog for published forms
    if (action === 'Published') {
      setShowSuccessDialog(true);
    }
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
  } catch (error) {
    console.error('❌ Failed to save form:', error);
    setSaveStatus({ 
      type: 'error', 
      message: `Failed to save form: ${error.message}` 
    });
  } finally {
    setIsLoading(false);
  }
};
  // Clear form
  const clearForm = () => {
    setFormTitle('');
    setFormDescription('');
    setReportingPeriod('');
    setYear(new Date().getFullYear().toString());
    setQuestions([]);
    setSelectedProjects([]);
    setSaveStatus(null);
    setIsEditing(false);
    setCurrentFormName(null);
    setLastSavedForm(null);
  };
  
  // Filter projects based on search
  const filteredProjects = allProjects.filter(project => 
    project.project_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.project_code?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.region?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.district?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <Navigation>
      <Container size="3" className="form-builder-container">
        {/* Error/Success Alert */}
        {saveStatus && (
          <Card 
            className={`save-status-alert ${saveStatus.type}`}
            style={{ marginBottom: '1rem' }}
          >
            <Flex align="center" gap="2">
              {saveStatus.type === 'success' ? (
                <CheckIcon color="green" />
              ) : (
                <ExclamationTriangleIcon color="red" />
              )}
              <Text size="2">{saveStatus.message}</Text>
            </Flex>
          </Card>
        )}
        
        {/* Header */}
        <div className="form-header">
          <div className="form-header-content">
            <div className="form-title-area">
              <Heading size="5" mb="2">Create New Reporting Form</Heading>
              
              <Grid columns="3" gap="3" mb="3">
                <div>
                  <Text as="div" size="1" weight="medium" mb="1">
                    Form Title *
                  </Text>
                  <TextField.Root
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="Enter form title"
                    size="2"
                    required
                  />
                </div>
                
                <div>
                  <Text as="div" size="1" weight="medium" mb="1">
                    Reporting Period *
                  </Text>
                  <Select.Root 
                    value={reportingPeriod} 
                    onValueChange={setReportingPeriod}
                    size="2"
                  >
                    <Select.Trigger placeholder="Select period" />
                    <Select.Content>
                      {reportingPeriodOptions.map(option => (
                        <Select.Item key={option.value} value={option.value}>
                          {option.label}
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Root>
                </div>
                
                <div>
                  <Text as="div" size="1" weight="medium" mb="1">
                    Year
                  </Text>
                  <TextField.Root
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    placeholder="Year"
                    size="2"
                    type="number"
                  />
                </div>
              </Grid>
              
              <Text as="div" size="1" weight="medium" mb="1">
                Description (Optional)
              </Text>
              <TextArea
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder="Describe the purpose of this form"
                rows={2}
                mb="3"
              />
            </div>
            
            <div className="form-stats">
              <Badge color="blue" variant="soft">
                {questions.length} {questions.length === 1 ? 'question' : 'questions'}
              </Badge>
              <Badge color="orange" variant="soft">
                {selectedProjects.length} {selectedProjects.length === 1 ? 'project' : 'projects'}
              </Badge>
            </div>
          </div>
          
          <Flex gap="3" className="header-actions">
            <Button 
              variant="soft" 
              onClick={() => saveForm('Draft')}
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save Draft'}
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setShowPreview(true)}
              disabled={isLoading}
            >
              <EyeOpenIcon /> Preview
            </Button>
            <Button 
              onClick={() => {
                if (isEditing && currentFormName) {
                  // If form already exists, just publish it
                  saveForm('Published');
                } else {
                  // If new form, create and publish
                  saveForm('Published');
                }
              }}
              disabled={isLoading}
              color="green"
              variant="solid"
            >
              {isLoading ? 'Publishing...' : <><PaperPlaneIcon /> Publish Form</>}
            </Button>
          </Flex>
        </div>

        <Separator size="4" className="header-separator" />

        {/* Main Content */}
        <div className="builder-content">
          {/* Questions Panel */}
          <div className="questions-panel">
            <div className="panel-header">
              <Flex justify="between" align="center">
                <Heading size="4">Form Questions</Heading>
                <Flex gap="2">
                  <Badge color="amber" variant="soft">
                    {questions.filter(q => q.required).length} required
                  </Badge>
                  <Button 
                    variant="soft" 
                    size="1"
                    onClick={() => setShowProjectsDialog(true)}
                  >
                    <PlusIcon /> Assign Projects ({selectedProjects.length})
                  </Button>
                </Flex>
              </Flex>
              <Text size="2" color="gray" mt="2">
                Drag to reorder • Click question types on the right to add
              </Text>
            </div>
            
            <div className="questions-list">
              {questions.map((question, index) => {
                const type = questionTypes.find(t => t.id === question.type);
                
                return (
                  <Card 
                    key={question.id}
                    className={`question-card ${draggedQuestion === index ? 'dragging' : ''}`}
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={handleDragOver}
                    onDrop={() => handleDrop(index)}
                  >
                    <div className="question-header">
                      <Flex align="center" gap="3">
                        <DragHandleDots2Icon className="drag-handle" />
                        <Badge 
                          style={{ 
                            backgroundColor: type?.color,
                            color: 'white'
                          }}
                          className="question-type-badge"
                        >
                          {type?.label}
                        </Badge>
                        {question.required && (
                          <Badge color="red" variant="soft">
                            Required
                          </Badge>
                        )}
                      </Flex>
                      
                      <IconButton 
                        size="2" 
                        variant="ghost" 
                        color="red"
                        onClick={() => deleteQuestion(question.id)}
                      >
                        <TrashIcon />
                      </IconButton>
                    </div>
                    
                    <div className="question-content">
                      <div className="question-inputs">
                        <TextField.Root
                          value={question.label}
                          onChange={(e) => updateQuestion(question.id, { label: e.target.value })}
                          placeholder="Question label"
                          size="2"
                          variant="soft"
                          mb="2"
                        />
                        <TextArea
                          value={question.description}
                          onChange={(e) => updateQuestion(question.id, { description: e.target.value })}
                          placeholder="Description (optional)"
                          rows={1}
                          size="1"
                          variant="soft"
                          mb="2"
                        />
                        
                        {/* Options for Select/Check fields */}
                        {(question.type === 'Select' || question.type === 'Check') && (
                          <div className="options-editor">
                            <Text size="1" weight="medium" mb="2">Options:</Text>
                            {question.options?.map((option, optIndex) => (
                              <Flex key={optIndex} gap="2" mb="2" align="center">
                                <TextField.Root
                                  value={option}
                                  onChange={(e) => updateOption(question.id, optIndex, e.target.value)}
                                  placeholder={`Option ${optIndex + 1}`}
                                  size="1"
                                  style={{ flex: 1 }}
                                />
                                <IconButton 
                                  size="1" 
                                  variant="ghost" 
                                  color="red"
                                  onClick={() => deleteOption(question.id, optIndex)}
                                >
                                  <TrashIcon />
                                </IconButton>
                              </Flex>
                            ))}
                            <Button 
                              size="1" 
                              variant="soft"
                              onClick={() => addOption(question.id)}
                            >
                              <PlusIcon /> Add Option
                            </Button>
                          </div>
                        )}
                      </div>
                      
                      <div className="question-preview">
                        {renderQuestionInput(question)}
                      </div>
                    </div>
                    
                    <div className="question-footer">
                      <Flex justify="between" align="center">
                        <Text size="1" color="gray">
                          Question {index + 1}
                        </Text>
                        <Flex align="center" gap="2">
                          <Text size="1">Required</Text>
                          <Switch
                            size="1"
                            checked={question.required}
                            onCheckedChange={(checked) => 
                              updateQuestion(question.id, { required: checked })
                            }
                          />
                        </Flex>
                      </Flex>
                    </div>
                  </Card>
                );
              })}
              
              {questions.length === 0 && (
                <div className="empty-state">
                  <div className="empty-icon">
                    <FileTextIcon />
                  </div>
                  <Heading size="3" mt="4">No questions yet</Heading>
                  <Text size="2" color="gray" mt="2">
                    Add questions from the panel on the right to get started
                  </Text>
                </div>
              )}
            </div>
          </div>

          {/* Tools Panel */}
          <div className="tools-panel">
            <Card className="tools-card">
              <div className="tools-header">
                <Heading size="4">Add Question</Heading>
                <Text size="2" color="gray">Click to add question type</Text>
              </div>
              
              <div className="question-types-grid">
                {questionTypes.map((type) => (
                  <button
                    key={type.id}
                    className="question-type-card"
                    onClick={() => addQuestion(type.id)}
                    style={{ '--type-color': type.color }}
                    title={`Add ${type.label} question`}
                  >
                    <div className="type-icon" style={{ backgroundColor: type.color }}>
                      {type.icon}
                    </div>
                    <Text size="2" weight="medium">{type.label}</Text>
                  </button>
                ))}
              </div>
              
              <Separator className="tools-separator" />
              
              <div className="quick-actions">
                <Heading size="4" mb="3">Quick Actions</Heading>
                <Flex direction="column" gap="2">
                  <Button 
                    variant="soft" 
                    className="quick-action-btn"
                    onClick={clearForm}
                  >
                    <TrashIcon /> Clear Form
                  </Button>
                </Flex>
              </div>
            </Card>
          </div>
        </div>

        {/* Projects Assignment Dialog */}
        <Dialog.Root open={showProjectsDialog} onOpenChange={setShowProjectsDialog}>
          <Dialog.Content style={{ maxWidth: 800 }}>
            <Dialog.Title>Assign Projects to Form</Dialog.Title>
            <Dialog.Description size="2" mb="4">
              Select projects that will receive this reporting form. {selectedProjects.length} projects selected.
            </Dialog.Description>
            
            <Flex direction="column" gap="4">
              {/* Search and Actions */}
              <Flex gap="3">
                <TextField.Root
                  placeholder="Search projects by name, code, region or district..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  size="2"
                  style={{ flex: 1 }}
                >
                  <TextField.Slot>
                    <MagnifyingGlassIcon />
                  </TextField.Slot>
                </TextField.Root>
                <Button 
                  variant="soft" 
                  size="2" 
                  onClick={() => setSelectedProjects([...allProjects])}
                >
                  Select All
                </Button>
                <Button 
                  variant="soft" 
                  size="2" 
                  onClick={() => setSelectedProjects([])}
                >
                  Clear All
                </Button>
              </Flex>
              
              {/* Projects List */}
              <ScrollArea style={{ height: 400 }}>
                <Flex direction="column" gap="2">
                  {filteredProjects.map((project) => {
                    const isSelected = selectedProjects.some(p => p.name === project.name);
                    
                    return (
                      <Card 
                        key={project.name}
                        className={`project-item ${isSelected ? 'selected' : ''}`}
                        onClick={() => {
                          setSelectedProjects(prev => 
                            isSelected 
                              ? prev.filter(p => p.name !== project.name)
                              : [...prev, project]
                          );
                        }}
                      >
                        <Flex align="center" gap="3">
                          <Checkbox 
                            checked={isSelected}
                            onCheckedChange={() => {}}
                          />
                          <Box style={{ flex: 1 }}>
                            <Flex justify="between" align="start">
                              <Box>
                                <Text weight="medium">{project.project_name}</Text>
                                <Flex gap="3" mt="1">
                                  <Text size="1" color="gray">Code: {project.project_code}</Text>
                                  <Text size="1" color="gray">Region: {project.region}</Text>
                                  <Text size="1" color="gray">District: {project.district}</Text>
                                </Flex>
                              </Box>
                              <Badge variant="soft" color={
                                project.status === 'Active' ? 'green' :
                                project.status === 'Completed' ? 'blue' :
                                project.status === 'On Hold' ? 'orange' :
                                'gray'
                              }>
                                {project.status}
                              </Badge>
                            </Flex>
                            {project.project_manager && (
                              <Text size="1" color="gray" mt="1">
                                Manager: {project.project_manager}
                              </Text>
                            )}
                          </Box>
                        </Flex>
                      </Card>
                    );
                  })}
                  
                  {filteredProjects.length === 0 && (
                    <div className="empty-state">
                      <InfoCircledIcon style={{ fontSize: 24, color: 'var(--gray-6)' }} />
                      <Text color="gray" mt="2">No projects found matching your search</Text>
                    </div>
                  )}
                </Flex>
              </ScrollArea>
              
              <Flex justify="end" gap="3" mt="4">
                <Dialog.Close>
                  <Button variant="soft">Cancel</Button>
                </Dialog.Close>
                <Dialog.Close>
                  <Button>Done</Button>
                </Dialog.Close>
              </Flex>
            </Flex>
          </Dialog.Content>
        </Dialog.Root>

        {/* Preview Dialog */}
        <Dialog.Root open={showPreview} onOpenChange={setShowPreview}>
          <Dialog.Content style={{ maxWidth: 600 }}>
            <Dialog.Title>Form Preview</Dialog.Title>
            <Dialog.Description size="2" mb="4">
              Preview how your form will appear to users
            </Dialog.Description>
            
            <Card>
              <Heading size="4" mb="2">{formTitle || 'Untitled Form'}</Heading>
              {formDescription && (
                <Text size="2" color="gray" mb="4">{formDescription}</Text>
              )}
              
              <Flex gap="2" mb="4">
                <Badge variant="soft">Period: {
                  reportingPeriodOptions.find(p => p.value === reportingPeriod)?.label || reportingPeriod
                }</Badge>
                <Badge variant="soft">Year: {year}</Badge>
                <Badge variant="soft">Projects: {selectedProjects.length}</Badge>
              </Flex>
              
              <Separator mb="4" />
              
              <div className="preview-questions">
                {questions.map((question, index) => (
                  <div key={question.id} className="preview-question" style={{ marginBottom: '1.5rem' }}>
                    <Flex align="center" gap="2" mb="2">
                      <Text weight="medium">
                        {index + 1}. {question.label}
                        {question.required && <span style={{ color: 'red' }}> *</span>}
                      </Text>
                    </Flex>
                    {question.description && (
                      <Text size="2" color="gray" mb="2">{question.description}</Text>
                    )}
                    <div style={{ marginTop: '0.5rem' }}>
                      {renderQuestionInput(question)}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
            
            <Flex justify="end" gap="3" mt="4">
              <Dialog.Close>
                <Button variant="soft">Close</Button>
              </Dialog.Close>
              <Button onClick={() => {
                setShowPreview(false);
                saveForm('Published');
              }}>
                <PaperPlaneIcon /> Publish Now
              </Button>
            </Flex>
          </Dialog.Content>
        </Dialog.Root>

        {/* Success Dialog */}
        <Dialog.Root open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
          <Dialog.Content style={{ maxWidth: 500 }}>
            <Dialog.Title>Success!</Dialog.Title>
            <Dialog.Description size="2" mb="4">
              Your form has been published successfully
            </Dialog.Description>
            
            <Flex direction="column" align="center" gap="4" py="4">
              <div style={{ 
                backgroundColor: 'var(--grass-3)', 
                padding: '1.5rem',
                borderRadius: '50%',
                color: 'var(--grass-11)'
              }}>
                <CheckIcon style={{ width: 32, height: 32 }} />
              </div>
              
              <Heading size="4">Form Published Successfully!</Heading>
              
              <Text align="center" color="gray">
                Your form "{lastSavedForm?.title}" has been published and assigned to {lastSavedForm?.projectsCount} projects.
              </Text>
              
              <Flex direction="column" gap="2" width="100%" mt="2">
                <Flex justify="between">
                  <Text color="gray">Form ID:</Text>
                  <Text weight="medium">{lastSavedForm?.name}</Text>
                </Flex>
                <Flex justify="between">
                  <Text color="gray">Questions:</Text>
                  <Text weight="medium">{lastSavedForm?.fieldsCount}</Text>
                </Flex>
                <Flex justify="between">
                  <Text color="gray">Assigned Projects:</Text>
                  <Text weight="medium">{lastSavedForm?.projectsCount}</Text>
                </Flex>
              </Flex>
              
              <Flex gap="3" mt="4">
                <Dialog.Close>
                  <Button variant="soft" onClick={clearForm}>
                    Create Another Form
                  </Button>
                </Dialog.Close>
                <Button onClick={() => {
                  setShowSuccessDialog(false);
                  window.location.href = '/dashboard';
                }}>
                  Go to Dashboard
                </Button>
              </Flex>
            </Flex>
          </Dialog.Content>
        </Dialog.Root>
      </Container>
    </Navigation>
  );
};

export default FormBuilder;