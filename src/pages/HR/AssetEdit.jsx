import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getAssetDetail, updateAsset } from "../../api/hrapi";
import { getProjects } from "../../api/datacollection";
import "./Asset.css";

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

const AssetEdit = () => {
  const { name } = useParams();
  const navigate = useNavigate();
  const decodedName = decodeURIComponent(name);

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [initialData, setInitialData] = useState(null);
  const [isDirty, setIsDirty] = useState(false);

  // Modal states
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  const [formData, setFormData] = useState({
    asset_code: "",
    asset_name: "",
    project: "",
    asset_type: "",
    model: "",
    condition: "working",
    serial_number: "",
    notes: "",
  });

  // Load asset + projects
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const assetData = await getAssetDetail(decodedName);
        const projectList = await getProjects();
        setProjects(projectList);

        // 🔥 Normalize backend values safely
        const normalizedData = {
          asset_code: assetData.asset_code || "",
          asset_name: assetData.asset_name || "",
          project: assetData.project || "",
          asset_type:
            ASSET_TYPES.find(
              (type) =>
                type.toLowerCase() ===
                assetData.asset_type?.trim().toLowerCase()
            ) || "",
          model: assetData.model || "",
          condition:
            CONDITIONS.find(
              (cond) =>
                cond.toLowerCase() ===
                assetData.condition?.trim().toLowerCase()
            ) || "working",
          serial_number: assetData.serial_number || "",
          notes: assetData.notes || "",
        };

        setFormData(normalizedData);
        setInitialData(normalizedData);
      } catch (error) {
        console.error("Failed to load asset:", error);
        alert("Failed to load asset details");
      } finally {
        setLoading(false);
      }
    };

    loadData();

    // Add beforeunload event listener
    const handleBeforeUnload = (e) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [decodedName]);

  // Dirty check
  useEffect(() => {
    if (initialData) {
      setIsDirty(
        JSON.stringify(formData) !== JSON.stringify(initialData)
      );
    }
  }, [formData, initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (success) setSuccess(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Show confirmation modal instead of submitting directly
    setShowConfirmModal(true);
  };

  const confirmUpdate = async () => {
    setShowConfirmModal(false);
    
    try {
      setLoading(true);
      await updateAsset(decodedName, formData);
      setSuccess(true);
      setInitialData(formData);
      setIsDirty(false);
      
      // Auto-hide success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error(error);
      alert("Failed to update asset");
    } finally {
      setLoading(false);
    }
  };

  const handleBackClick = () => {
    if (isDirty) {
      setShowExitModal(true);
    } else {
      navigate(`/assetlist/${encodeURIComponent(decodedName)}`);
    }
  };

  const handleCancelEdit = () => {
    if (isDirty) {
      setShowCancelModal(true);
    } else {
      navigate(`/assetlist/${encodeURIComponent(decodedName)}`);
    }
  };

  const confirmExit = () => {
    setShowExitModal(false);
    navigate(`/assetlist/${encodeURIComponent(decodedName)}`);
  };

  const confirmCancel = () => {
    setShowCancelModal(false);
    navigate(`/assetlist/${encodeURIComponent(decodedName)}`);
  };

  // Preview changes for confirmation modal
  const getChangesPreview = () => {
    if (!initialData) return null;

    const changes = [];
    
    Object.keys(formData).forEach(key => {
      if (formData[key] !== initialData[key]) {
        let oldValue = initialData[key] || "—";
        let newValue = formData[key] || "—";
        
        // Format condition values for display
        if (key === 'condition') {
          oldValue = oldValue.charAt(0).toUpperCase() + oldValue.slice(1);
          newValue = newValue.charAt(0).toUpperCase() + newValue.slice(1);
        }
        
        changes.push({
          field: key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
          old: oldValue,
          new: newValue
        });
      }
    });

    return changes;
  };

  if (loading && !initialData) {
    return (
      <div className="asset-container">
        <div className="loading-state">
          <div className="spinner-large"></div>
          <p>Loading asset details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="asset-container">
      <button className="exit-button" onClick={handleBackClick}>
        <span className="exit-icon">←</span> Back
      </button>

      <div className="asset-card">
        <div className="asset-header">
          <h2 className="asset-title">Edit Asset</h2>
          <p className="asset-subtitle">Update asset information</p>
          {isDirty && <span className="unsaved-badge">Unsaved changes</span>}
        </div>

        {success && (
          <div className="success-message">
            <span className="success-icon">✅</span>
            <div>
              <strong>Success!</strong> Asset updated successfully.
            </div>
            <button className="close-success" onClick={() => setSuccess(false)}>×</button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="asset-form">
          {/* Asset Code */}
          <div className="form-group">
            <label>Asset Code</label>
            <input
              type="text"
              name="asset_code"
              value={formData.asset_code}
              onChange={handleChange}
              className="form-input"
              placeholder="e.g., LAP-2024-001"
            />
          </div>

          {/* Asset Name */}
          <div className="form-group">
            <label>Asset Name *</label>
            <input
              type="text"
              name="asset_name"
              value={formData.asset_name}
              onChange={handleChange}
              required
              className="form-input"
              placeholder="e.g., Dell XPS 15 Laptop"
            />
          </div>

          {/* Project */}
          <div className="form-group">
            <label>Project *</label>
            <select
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

          {/* Asset Type */}
          <div className="form-group">
            <label>Asset Type *</label>
            <select
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

          {/* Model */}
          <div className="form-group">
            <label>Model</label>
            <input
              type="text"
              name="model"
              value={formData.model}
              onChange={handleChange}
              className="form-input"
              placeholder="e.g., XPS 15 9520"
            />
          </div>

          {/* Condition */}
          <div className="form-group">
            <label>Condition *</label>
            <select
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

          {/* Serial Number */}
          <div className="form-group">
            <label>Serial Number</label>
            <input
              type="text"
              name="serial_number"
              value={formData.serial_number}
              onChange={handleChange}
              className="form-input"
              placeholder="e.g., XYZ12345678"
            />
          </div>

          {/* Notes */}
          <div className="form-group">
            <label>Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="4"
              className="form-textarea"
              placeholder="Additional information about the asset..."
            />
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleCancelEdit}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={!isDirty || loading}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Updating...
                </>
              ) : (
                "Update Asset"
              )}
            </button>
          </div>
        </form>

        <div className="form-footer">
          <p>* Required fields {isDirty && '• You have unsaved changes'}</p>
        </div>
      </div>

      {/* Confirmation Modal for Update */}
      {showConfirmModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Confirm Update</h3>
              <button className="modal-close" onClick={() => setShowConfirmModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <p>Please review the changes before updating:</p>
              {getChangesPreview().length > 0 ? (
                <div className="changes-preview">
                  {getChangesPreview().map((change, index) => (
                    <div key={index} className="change-row">
                      <div className="change-field">{change.field}</div>
                      <div className="change-values">
                        <span className="old-value">{change.old}</span>
                        <span className="change-arrow">→</span>
                        <span className="new-value">{change.new}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="no-changes">No changes detected</p>
              )}
            </div>
            <div className="modal-footer">
              <button 
                className="btn btn-secondary" 
                onClick={() => setShowConfirmModal(false)}
              >
                Continue Editing
              </button>
              <button 
                className="btn btn-primary" 
                onClick={confirmUpdate}
              >
                Confirm Update
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
              <p className="warning-text">Any unsaved changes will be lost.</p>
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

      {/* Confirmation Modal for Cancel */}
      {showCancelModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Cancel Editing?</h3>
              <button className="modal-close" onClick={() => setShowCancelModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <p>You have unsaved changes. Are you sure you want to cancel?</p>
              <p className="warning-text">All unsaved changes will be lost.</p>
            </div>
            <div className="modal-footer">
              <button 
                className="btn btn-secondary" 
                onClick={() => setShowCancelModal(false)}
              >
                Continue Editing
              </button>
              <button 
                className="btn btn-danger" 
                onClick={confirmCancel}
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssetEdit;