import React, { useEffect, useState } from "react";
import { getAssets, deleteAsset } from "../../api/hrapi";
import { useNavigate } from "react-router-dom";
import "./AssetList.css"; // Create this CSS file

const AssetList = () => {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCondition, setFilterCondition] = useState("all");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [assetToDelete, setAssetToDelete] = useState(null);
  
  const navigate = useNavigate();

  const fetchAssets = async () => {
    setLoading(true);
    try {
      const data = await getAssets();
      setAssets(data);
      console.log("Fetched assets:", data);
    } catch (error) {
      console.error("Failed to fetch assets", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  // Delete asset with confirmation modal
  const handleDeleteClick = (asset) => {
    setAssetToDelete(asset);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!assetToDelete) return;
    
    try {
      await deleteAsset(assetToDelete.name);
      setShowDeleteModal(false);
      setAssetToDelete(null);
      fetchAssets(); // refresh list
    } catch (error) {
      console.error(error);
      alert("Failed to delete asset");
    }
  };

  const handleEdit = (name) => {
    navigate(`/hr/assetlistedit/${name}`);
  };

  const handleView = (name) => {
    navigate(`/hr/assetlist/${encodeURIComponent(name)}`);
  };

  // Filter assets based on search and condition
 // Filter assets based on search and condition
const filteredAssets = assets.filter(asset => {
  const matchesSearch = 
    asset.asset_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asset.asset_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asset.asset_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asset.project?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asset.asset_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asset.condition?.toLowerCase().includes(searchTerm.toLowerCase());
  
  const matchesCondition = filterCondition === "all" || asset.condition === filterCondition;
  
  return matchesSearch && matchesCondition;
});

  // Get unique conditions for filter
  const conditions = ["all", ...new Set(assets.map(a => a.condition))];

  // Condition badge component
  const ConditionBadge = ({ condition }) => {
    const getConditionConfig = (cond) => {
      const configs = {
        working: { color: "#10b981", bg: "rgba(16, 185, 129, 0.15)", icon: "✅" },
        repair: { color: "#f59e0b", bg: "rgba(245, 158, 11, 0.15)", icon: "🔧" },
        damaged: { color: "#ef4444", bg: "rgba(239, 68, 68, 0.15)", icon: "⚠️" },
        lost: { color: "#6b7280", bg: "rgba(107, 114, 128, 0.15)", icon: "❓" },
        disposed: { color: "#4b5563", bg: "rgba(75, 85, 99, 0.15)", icon: "🗑️" },
      };
      return configs[cond?.toLowerCase()] || configs.working;
    };

    const config = getConditionConfig(condition);

    return (
      <span className="condition-badge" style={{ backgroundColor: config.bg, color: config.color }}>
        <span className="badge-icon">{config.icon}</span>
        <span className="badge-text">{condition?.charAt(0).toUpperCase() + condition?.slice(1) || 'Unknown'}</span>
      </span>
    );
  };

  return (
    <div className="asset-list-container">
      {/* Animated background elements */}
      <div className="bg-orb bg-orb-1"></div>
      <div className="bg-orb bg-orb-2"></div>
      <div className="bg-orb bg-orb-3"></div>

      <div className="content-wrapper">
        {/* Header */}
        <div className="list-header">
          <div className="header-content">
            <h1 className="page-title">Asset Management</h1>
            <p className="page-subtitle">Track and manage all your assets in one place</p>
          </div>
          <button 
            className="create-button"
            onClick={() => navigate('/hr/asset')}
          >
            <span className="create-icon">+</span>
            Create New Asset
          </button>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📦</div>
            <div className="stat-content">
              <span className="stat-label">Total Assets</span>
              <span className="stat-value">{assets.length}</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <span className="stat-label">Working</span>
              <span className="stat-value">{assets.filter(a => a.condition === 'working').length}</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🔧</div>
            <div className="stat-content">
              <span className="stat-label">Under Repair</span>
              <span className="stat-value">{assets.filter(a => a.condition === 'repair').length}</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⚠️</div>
            <div className="stat-content">
              <span className="stat-label">Damaged</span>
              <span className="stat-value">{assets.filter(a => a.condition === 'damaged').length}</span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="filters-section">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
                type="text"
                placeholder="Search by name, ID, code, project, type, or condition..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
                />
          </div>
          <select 
            className="filter-select"
            value={filterCondition}
            onChange={(e) => setFilterCondition(e.target.value)}
          >
            {conditions.map(cond => (
              <option key={cond} value={cond}>
                {cond === 'all' ? 'All Conditions' : cond.charAt(0).toUpperCase() + cond.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Assets Table */}
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading assets...</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="assets-table">
              <thead>
                <tr>
                  <th>Asset ID</th>
                  <th>Asset Code</th>
                  <th>Asset Name</th>
                  <th>Project</th>
                  <th>Type</th>
                  <th>Condition</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAssets.length > 0 ? (
                  filteredAssets.map((a, index) => (
                    <tr key={a.name} style={{ animationDelay: `${index * 0.05}s` }}>
                      <td className="asset-id">{a.asset_id || '—'}</td>
                      <td className="asset-code">{a.asset_code || '—'}</td>
                      <td className="asset-name">{a.asset_name || '—'}</td>
                      <td className="project-cell">{a.project || '—'}</td>
                      <td className="type-cell">{a.asset_type || '—'}</td>
                      <td className="condition-cell">
                        <ConditionBadge condition={a.condition} />
                      </td>
                      <td className="actions-cell">
                        <button 
                          className="action-btn view-btn" 
                          onClick={() => handleView(a.name)}
                          title="View Details"
                        >
                          👁️
                        </button>
                        <button 
                          className="action-btn edit-btn" 
                          onClick={() => handleEdit(a.name)}
                          title="Edit Asset"
                        >
                          ✎
                        </button>
                        <button 
                          className="action-btn delete-btn" 
                          onClick={() => handleDeleteClick(a)}
                          title="Delete Asset"
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="no-results">
                      <div className="no-results-content">
                        <span className="no-results-icon">🔍</span>
                        <p>No assets found matching your criteria</p>
                        <button className="clear-filters-btn" onClick={() => {
                          setSearchTerm("");
                          setFilterCondition("all");
                        }}>
                          Clear Filters
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-content delete-modal">
            <div className="modal-header">
              <h3>Delete Asset</h3>
              <button className="modal-close" onClick={() => setShowDeleteModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="delete-icon">⚠️</div>
              <p>Are you sure you want to delete this asset?</p>
              {assetToDelete && (
                <div className="asset-preview">
                  <div className="preview-item">
                    <span className="preview-label">Asset:</span>
                    <span className="preview-value">{assetToDelete.asset_name}</span>
                  </div>
                  <div className="preview-item">
                    <span className="preview-label">ID:</span>
                    <span className="preview-value">{assetToDelete.asset_id}</span>
                  </div>
                </div>
              )}
              <p className="warning-text">This action cannot be undone.</p>
            </div>
            <div className="modal-footer">
              <button 
                className="btn btn-secondary" 
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button 
                className="btn btn-danger" 
                onClick={confirmDelete}
              >
                Delete Asset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssetList;