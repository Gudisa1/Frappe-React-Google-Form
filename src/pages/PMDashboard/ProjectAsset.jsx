import React, { useState, useEffect } from "react";
import { createAsset } from "../../api/hrapi";
import { getProjects } from "../../api/datacollection";
import "./ProjectAsset.css";

const ASSET_TYPES = [
  "IT Equipment",
  "Vehicle",
  "Furniture",
  "Machinery",
  "Medical Equipment",
  "Office Equipment",
  "Security Equipment",
  "Software",
  "Tool",
  "Other",
];

const CONDITIONS = ["working", "repair", "damaged", "lost", "disposed"];

const ProjectAsset = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // Modal states
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showClearModal, setShowClearModal] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  
  // Track if form has been modified
  const [isFormDirty, setIsFormDirty] = useState(false);
  
  // Track original form data for cancel/exit
  const [initialFormData, setInitialFormData] = useState(null);

  const [formData, setFormData] = useState({
    asset_id: "",
    asset_code: "",
    asset_name: "",
    project: "",
    asset_type: "",
    model: "",
    condition: "working",
    serial_number: "",
    notes: "",
  });

  // REMOVE SIDEBAR AND NAVIGATION WHEN THIS COMPONENT MOUNTS
  useEffect(() => {
    // Function to hide sidebar and navigation elements
    const hideSidebarAndNav = () => {
      // Target all possible sidebar/navigation containers
      const elementsToHide = [
        // Sidebar elements
        '.sidebar',
        '.side-nav', 
        '.side-menu',
        '.navigation-sidebar',
        '[class*="sidebar"]',
        '[class*="side-nav"]',
        '.app-sidebar',
        '.main-sidebar',
        '.nav-sidebar',
        // Navigation elements
        '.navbar',
        '.main-nav',
        '.top-nav',
        '.navigation-menu',
        '.header-nav',
        '[class*="navbar"]',
        '[class*="navigation"]',
        '[class*="nav-menu"]',
        // Dashboard menu items
        '.dashboard-menu',
        '.nav-menu-items',
        '.menu-items',
        // Specific elements from your screenshot
        'nav:has(a)',
        '.menu-container',
        '.nav-container'
      ];
      
      // Hide all matching elements
      elementsToHide.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
          if (el && !el.classList?.contains('asset-container')) {
            el.style.display = 'none';
          }
        });
      });
      
      // Hide menu items by their text content (Dashboard, Submissions, etc.)
      const menuTexts = ['Dashboard', 'Submissions', 'Project General Stat', 'Togi', 'Compassion', 'PM', 'Logout'];
      const allElements = document.querySelectorAll('*');
      allElements.forEach(el => {
        if (el.textContent && menuTexts.some(text => el.textContent.trim() === text)) {
          // Check if this is likely a menu item
          if (el.tagName === 'A' || el.tagName === 'LI' || el.tagName === 'DIV' || 
              el.closest('nav') || el.closest('.sidebar') || el.closest('.menu')) {
            el.style.display = 'none';
          }
        }
      });
      
      // Adjust main content to take full width
      const mainContentSelectors = [
        '.main-content',
        '.content-wrapper',
        '[class*="main-content"]',
        '.page-content',
        '.app-content',
        'main'
      ];
      
      for (const selector of mainContentSelectors) {
        const content = document.querySelector(selector);
        if (content) {
          content.style.marginLeft = '0';
          content.style.paddingLeft = '0';
          content.style.width = '100%';
          content.style.maxWidth = '100%';
          break;
        }
      }
      
      // Also adjust body and html
      document.body.style.marginLeft = '0';
      document.body.style.paddingLeft = '0';
      document.body.style.overflowX = 'hidden';
      document.documentElement.style.marginLeft = '0';
      document.documentElement.style.paddingLeft = '0';
      
      // Remove any padding/margin that might be causing layout shift
      const layoutContainers = document.querySelectorAll('.app, .app-wrapper, .layout, .container');
      layoutContainers.forEach(container => {
        container.style.marginLeft = '0';
        container.style.paddingLeft = '0';
      });
    };
    
    // Run immediately
    hideSidebarAndNav();
    
    // Also run after a small delay to ensure DOM is fully loaded
    const timer = setTimeout(hideSidebarAndNav, 100);
    
    // Add a mutation observer to handle dynamically loaded content
    const observer = new MutationObserver(() => {
      hideSidebarAndNav();
    });
    
    observer.observe(document.body, { childList: true, subtree: true });
    
    // Cleanup - restore sidebar when component unmounts
    return () => {
      clearTimeout(timer);
      observer.disconnect();
      
      // Restore all hidden elements
      const elementsToRestore = [
        '.sidebar', '.side-nav', '.side-menu', '.navigation-sidebar',
        '.app-sidebar', '.main-sidebar', '.nav-sidebar', '.navbar',
        '.main-nav', '.top-nav', '.navigation-menu', '.header-nav'
      ];
      
      elementsToRestore.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
          el.style.display = '';
        });
      });
      
      // Restore main content styles
      const mainContentSelectors = [
        '.main-content', '.content-wrapper', '.page-content', '.app-content', 'main'
      ];
      
      for (const selector of mainContentSelectors) {
        const content = document.querySelector(selector);
        if (content) {
          content.style.marginLeft = '';
          content.style.paddingLeft = '';
          content.style.width = '';
          content.style.maxWidth = '';
        }
      }
      
      // Restore body styles
      document.body.style.marginLeft = '';
      document.body.style.paddingLeft = '';
      document.body.style.overflowX = '';
      document.documentElement.style.marginLeft = '';
      document.documentElement.style.paddingLeft = '';
    };
  }, []);

  useEffect(() => {
    async function loadProjects() {
      try {
        const projectList = await getProjects();
        console.log("📁 Projects loaded:", projectList);
        setProjects(projectList.data);
      } catch (error) {
        console.error("Failed to load projects", error);
      }
    }
    loadProjects();
    
    // Store initial form data for dirty checking
    setInitialFormData({...formData});
    
    // Add beforeunload event listener to warn user about unsaved changes
    const handleBeforeUnload = (e) => {
      if (isFormDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  // Check if form has been modified
  useEffect(() => {
    if (initialFormData) {
      const isDirty = JSON.stringify(formData) !== JSON.stringify(initialFormData);
      setIsFormDirty(isDirty);
    }
  }, [formData, initialFormData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (success) setSuccess(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields before showing confirmation
    if (!formData.asset_id || !formData.asset_name || !formData.project || !formData.asset_type) {
      alert("Please fill in all required fields (*)");
      return;
    }
    
    // Show confirmation modal
    setShowConfirmModal(true);
  };

  const confirmSubmit = async () => {
    setShowConfirmModal(false);
    setLoading(true);
    setSuccess(false);

    try {
      const newAsset = await createAsset(formData);
      console.log("✅ Created:", newAsset);
      setSuccess(true);
      
      // Store the new initial state after successful submission
      const resetFormData = {
        asset_id: "",
        asset_code: "",
        asset_name: "",
        project: "",
        asset_type: "",
        model: "",
        condition: "working",
        serial_number: "",
        notes: "",
      };
      
      setFormData(resetFormData);
      setInitialFormData(resetFormData);
      setIsFormDirty(false);
      
      // Auto-hide success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error(error);
      alert(error.message || "Failed to create asset");
    } finally {
      setLoading(false);
    }
  };

  const handleClearClick = () => {
    if (isFormDirty) {
      setShowClearModal(true);
    } else {
      // If form is clean, just clear without confirmation
      clearForm();
    }
  };

  const clearForm = () => {
    const resetFormData = {
      asset_id: "",
      asset_code: "",
      asset_name: "",
      project: "",
      asset_type: "",
      model: "",
      condition: "working",
      serial_number: "",
      notes: "",
    };
    
    setFormData(resetFormData);
    setInitialFormData(resetFormData);
    setIsFormDirty(false);
    setShowClearModal(false);
  };

  const handleExit = () => {
    if (isFormDirty) {
      setShowExitModal(true);
    } else {
      // Navigate away or close form
      window.history.back(); // Or your navigation logic
    }
  };

  const confirmExit = () => {
    setShowExitModal(false);
    window.history.back(); // Or your navigation logic
  };

  // Preview form data for confirmation modal
  const getFormPreview = () => {
    const projectName = projects.find(p => p.name === formData.project)?.project_name || formData.project;
    
    return (
      <div className="preview-content">
        <div className="preview-row">
          <span className="preview-label">Asset ID:</span>
          <span className="preview-value">{formData.asset_id || 'Not specified'}</span>
        </div>
        <div className="preview-row">
          <span className="preview-label">Asset Name:</span>
          <span className="preview-value">{formData.asset_name || 'Not specified'}</span>
        </div>
        <div className="preview-row">
          <span className="preview-label">Project:</span>
          <span className="preview-value">{projectName || 'Not specified'}</span>
        </div>
        <div className="preview-row">
          <span className="preview-label">Asset Type:</span>
          <span className="preview-value">{formData.asset_type || 'Not specified'}</span>
        </div>
        {formData.model && (
          <div className="preview-row">
            <span className="preview-label">Model:</span>
            <span className="preview-value">{formData.model}</span>
          </div>
        )}
        <div className="preview-row">
          <span className="preview-label">Condition:</span>
          <span className="preview-value">
            <span className={`condition-badge condition-${formData.condition}`}>
              {formData.condition.charAt(0).toUpperCase() + formData.condition.slice(1)}
            </span>
          </span>
        </div>
        {formData.serial_number && (
          <div className="preview-row">
            <span className="preview-label">Serial Number:</span>
            <span className="preview-value">{formData.serial_number}</span>
          </div>
        )}
        {formData.notes && (
          <div className="preview-row">
            <span className="preview-label">Notes:</span>
            <span className="preview-value preview-notes">{formData.notes}</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="asset-container">
      {/* Exit button */}
      {/* <button className="exit-button" onClick={handleExit} title="Go back">
        <span className="exit-icon">←</span> Back
      </button> */}

      <div className="asset-card">
        <div className="asset-header">
          <h2 className="asset-title">Create New Asset</h2>
          <p className="asset-subtitle">Add a new asset to the inventory system</p>
          {isFormDirty && (
            <span className="unsaved-badge">Unsaved changes</span>
          )}
        </div>

        {success && (
          <div className="success-message">
            <span className="success-icon">✅</span>
            <div>
              <strong>Success!</strong> Asset created successfully.
            </div>
            <button className="close-success" onClick={() => setSuccess(false)}>×</button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="asset-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="asset_id">Asset ID *</label>
              <input
                type="text"
                id="asset_id"
                name="asset_id"
                placeholder="e.g., AST-001"
                value={formData.asset_id}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="asset_code">Asset Code</label>
              <input
                type="text"
                id="asset_code"
                name="asset_code"
                placeholder="e.g., LAP-2024-001"
                value={formData.asset_code}
                onChange={handleChange}
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="asset_name">Asset Name *</label>
            <input
              type="text"
              id="asset_name"
              name="asset_name"
              placeholder="e.g., Dell XPS 15 Laptop"
              value={formData.asset_name}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="project">Project *</label>
              <select
                id="project"
                name="project"
                value={formData.project}
                onChange={handleChange}
                required
                className="form-select"
              >
                <option value="">Select Project</option>
                {projects.map((proj) => (
                  <option key={proj.name} value={proj.name}>
                    {proj.project_name || proj.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="asset_type">Asset Type *</label>
              <select
                id="asset_type"
                name="asset_type"
                value={formData.asset_type}
                onChange={handleChange}
                required
                className="form-select"
              >
                <option value="">Select Type</option>
                {ASSET_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="model">Model</label>
              <input
                type="text"
                id="model"
                name="model"
                placeholder="e.g., XPS 15 9520"
                value={formData.model}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="condition">Condition *</label>
              <select
                id="condition"
                name="condition"
                value={formData.condition}
                onChange={handleChange}
                required
                className="form-select"
              >
                {CONDITIONS.map((cond) => (
                  <option key={cond} value={cond}>
                    {cond.charAt(0).toUpperCase() + cond.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="serial_number">Serial Number</label>
            <input
              type="text"
              id="serial_number"
              name="serial_number"
              placeholder="e.g., XYZ12345678"
              value={formData.serial_number}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="notes">Notes</label>
            <textarea
              id="notes"
              name="notes"
              placeholder="Additional information about the asset..."
              value={formData.notes}
              onChange={handleChange}
              rows="4"
              className="form-textarea"
            />
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={handleClearClick}
            >
              Clear Form
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading || !isFormDirty}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Creating...
                </>
              ) : (
                "Create Asset"
              )}
            </button>
          </div>
        </form>

        <div className="form-footer">
          <p>* Required fields {isFormDirty && '• You have unsaved changes'}</p>
        </div>
      </div>

      {/* Confirmation Modal for Submit */}
      {showConfirmModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Confirm Asset Creation</h3>
              <button className="modal-close" onClick={() => setShowConfirmModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <p>Please review the asset details before creating:</p>
              {getFormPreview()}
            </div>
            <div className="modal-footer">
              <button 
                className="btn btn-secondary" 
                onClick={() => setShowConfirmModal(false)}
              >
                Cancel
              </button>
              <button 
                className="btn btn-primary" 
                onClick={confirmSubmit}
              >
                Confirm Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Clear Form */}
      {showClearModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Clear Form?</h3>
              <button className="modal-close" onClick={() => setShowClearModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <p>You have unsaved changes. Are you sure you want to clear the form?</p>
              <p className="warning-text">This action cannot be undone.</p>
            </div>
            <div className="modal-footer">
              <button 
                className="btn btn-secondary" 
                onClick={() => setShowClearModal(false)}
              >
                Keep Editing
              </button>
              <button 
                className="btn btn-danger" 
                onClick={clearForm}
              >
                Yes, Clear Form
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Exit */}
      {showExitModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Unsaved Changes</h3>
              <button className="modal-close" onClick={() => setShowExitModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <p>You have unsaved changes. Are you sure you want to leave?</p>
              <p className="warning-text">Any unsaved data will be lost.</p>
            </div>
            <div className="modal-footer">
              <button 
                className="btn btn-secondary" 
                onClick={() => setShowExitModal(false)}
              >
                Stay on Page
              </button>
              <button 
                className="btn btn-danger" 
                onClick={confirmExit}
              >
                Leave Anyway
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectAsset;