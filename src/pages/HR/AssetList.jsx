// import React, { useEffect, useState, useMemo } from "react";
// import { getAssets, deleteAsset, getProjects } from "../../api/hrapi"; // Make sure getProjects is exported
// import { useNavigate } from "react-router-dom";
// import "./AssetList.css";

// const AssetList = () => {
//   const [assets, setAssets] = useState([]);
//   const [projects, setProjects] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");
  
//   // Advanced filters
//   const [filters, setFilters] = useState({
//     condition: "all",
//     project: "all",
//     assetType: "all",
//     dateRange: "all",
//     status: "all"
//   });
  
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [assetToDelete, setAssetToDelete] = useState(null);
//   const [showFilters, setShowFilters] = useState(false);
//   const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  
//   const navigate = useNavigate();

//   // Fetch assets and projects
//   const fetchData = async () => {
//     setLoading(true);
//     try {
//       const [assetsData, projectsData] = await Promise.all([
//         getAssets(),
//         getProjects()
//       ]);
//       setAssets(assetsData);
//       setProjects(projectsData || []);
//       console.log("Fetched assets:", assetsData);
//     } catch (error) {
//       console.error("Failed to fetch data", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   // Get unique values for filters
//   const assetTypes = useMemo(() => 
//     ["all", ...new Set(assets.map(a => a.asset_type).filter(Boolean))],
//     [assets]
//   );

//   const conditions = useMemo(() => 
//     ["all", ...new Set(assets.map(a => a.condition).filter(Boolean))],
//     [assets]
//   );

//   // Advanced filtering
//   const filteredAssets = useMemo(() => {
//     return assets.filter(asset => {
//       // Search filter - now searching through ALL fields
//       const searchLower = searchTerm.toLowerCase();
//       const matchesSearch = searchTerm === "" || 
//         // Search through all relevant fields
//         Object.values({
//           asset_name: asset.asset_name,
//           asset_id: asset.asset_id,
//           asset_code: asset.asset_code,
//           project: asset.project,
//           asset_type: asset.asset_type,
//           condition: asset.condition,
//           model: asset.model,
//           serial_number: asset.serial_number,
//           notes: asset.notes,
//           owner: asset.owner
//         }).some(value => 
//           value && value.toString().toLowerCase().includes(searchLower)
//         );

//       // Condition filter
//       const matchesCondition = filters.condition === "all" || 
//         asset.condition === filters.condition;

//       // Project filter
//       const matchesProject = filters.project === "all" || 
//         asset.project === filters.project;

//       // Asset type filter
//       const matchesType = filters.assetType === "all" || 
//         asset.asset_type === filters.assetType;

//       return matchesSearch && matchesCondition && matchesProject && matchesType;
//     });
//   }, [assets, searchTerm, filters]);

//   // Sorting function
//   const sortedAssets = useMemo(() => {
//     let sortableAssets = [...filteredAssets];
//     if (sortConfig.key) {
//       sortableAssets.sort((a, b) => {
//         const aVal = a[sortConfig.key] || '';
//         const bVal = b[sortConfig.key] || '';
        
//         if (aVal < bVal) {
//           return sortConfig.direction === 'asc' ? -1 : 1;
//         }
//         if (aVal > bVal) {
//           return sortConfig.direction === 'asc' ? 1 : -1;
//         }
//         return 0;
//       });
//     }
//     return sortableAssets;
//   }, [filteredAssets, sortConfig]);

//   const requestSort = (key) => {
//     setSortConfig({
//       key,
//       direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc'
//     });
//   };

//   // Delete handlers
//   const handleDeleteClick = (asset) => {
//     setAssetToDelete(asset);
//     setShowDeleteModal(true);
//   };

//   const confirmDelete = async () => {
//     if (!assetToDelete) return;
    
//     try {
//       await deleteAsset(assetToDelete.name);
//       setShowDeleteModal(false);
//       setAssetToDelete(null);
//       fetchData();
//     } catch (error) {
//       console.error(error);
//       alert("Failed to delete asset");
//     }
//   };

//   // Navigation handlers
//   const handleEdit = (name) => {
//     navigate(`/hr/assetlistedit/${name}`);
//   };

//   const handleView = (name) => {
//     navigate(`/hr/assetlist/${encodeURIComponent(name)}`);
//   };

//   // Statistics with all fields considered
//   const stats = useMemo(() => ({
//     total: assets.length,
//     working: assets.filter(a => a.condition === 'working').length,
//     repair: assets.filter(a => a.condition === 'repair').length,
//     damaged: assets.filter(a => a.condition === 'damaged').length,
//     lost: assets.filter(a => a.condition === 'lost').length,
//     disposed: assets.filter(a => a.condition === 'disposed').length,
//     byProject: projects.reduce((acc, project) => {
//       acc[project] = assets.filter(a => a.project === project).length;
//       return acc;
//     }, {}),
//     byType: assetTypes.slice(1).reduce((acc, type) => {
//       acc[type] = assets.filter(a => a.asset_type === type).length;
//       return acc;
//     }, {}),
//     totalQuantity: assets.reduce((sum, a) => sum + (a.quantity || 0), 0)
//   }), [assets, projects, assetTypes]);

//   // Condition badge component
//   const ConditionBadge = ({ condition }) => {
//     const getConditionConfig = (cond) => {
//       const configs = {
//         working: { color: "#10b981", bg: "rgba(16, 185, 129, 0.15)", icon: "✅", label: "Working" },
//         repair: { color: "#f59e0b", bg: "rgba(245, 158, 11, 0.15)", icon: "🔧", label: "Under Repair" },
//         damaged: { color: "#ef4444", bg: "rgba(239, 68, 68, 0.15)", icon: "⚠️", label: "Damaged" },
//         lost: { color: "#6b7280", bg: "rgba(107, 114, 128, 0.15)", icon: "❓", label: "Lost" },
//         disposed: { color: "#4b5563", bg: "rgba(75, 85, 99, 0.15)", icon: "🗑️", label: "Disposed" },
//       };
//       return configs[cond?.toLowerCase()] || { color: "#64748b", bg: "rgba(100, 116, 139, 0.15)", icon: "📦", label: cond || "Unknown" };
//     };

//     const config = getConditionConfig(condition);

//     return (
//       <span className="condition-badge" style={{ backgroundColor: config.bg, color: config.color }}>
//         <span className="badge-icon">{config.icon}</span>
//         <span className="badge-text">{config.label}</span>
//       </span>
//     );
//   };

//   return (
//     <div className="asset-list-container">
//       {/* Animated background elements */}
//       <div className="bg-orb bg-orb-1"></div>
//       <div className="bg-orb bg-orb-2"></div>
//       <div className="bg-orb bg-orb-3"></div>

//       <div className="content-wrapper">
//         {/* Header */}
//         <div className="list-header">
//           <div className="header-content">
//             <h1 className="page-title">Asset Management Dashboard</h1>
//             <p className="page-subtitle">Comprehensive view of all assets across projects</p>
//           </div>
//           <button 
//             className="create-button"
//             onClick={() => navigate('/hr/asset')}
//           >
//             <span className="create-icon">+</span>
//             Add New Asset
//           </button>
//         </div>

//         {/* Enhanced Stats Grid */}
//         <div className="stats-enhanced">
//           <div className="stats-row">
//             <div className="stat-card total">
//               <div className="stat-icon">📊</div>
//               <div className="stat-content">
//                 <span className="stat-label">Total Assets</span>
//                 <span className="stat-value">{stats.total}</span>
//               </div>
//             </div>
//             <div className="stat-card working">
//               <div className="stat-icon">✅</div>
//               <div className="stat-content">
//                 <span className="stat-label">Working</span>
//                 <span className="stat-value">{stats.working}</span>
//               </div>
//             </div>
//             <div className="stat-card repair">
//               <div className="stat-icon">🔧</div>
//               <div className="stat-content">
//                 <span className="stat-label">Under Repair</span>
//                 <span className="stat-value">{stats.repair}</span>
//               </div>
//             </div>
//             <div className="stat-card damaged">
//               <div className="stat-icon">⚠️</div>
//               <div className="stat-content">
//                 <span className="stat-label">Damaged</span>
//                 <span className="stat-value">{stats.damaged}</span>
//               </div>
//             </div>
//           </div>

//           {/* Additional Stats Row */}
//           <div className="stats-row secondary">
//             <div className="stat-card info">
//               <div className="stat-icon">📦</div>
//               <div className="stat-content">
//                 <span className="stat-label">Total Quantity</span>
//                 <span className="stat-value">{stats.totalQuantity}</span>
//               </div>
//             </div>
//             <div className="stat-card info">
//               <div className="stat-icon">🏢</div>
//               <div className="stat-content">
//                 <span className="stat-label">Active Projects</span>
//                 <span className="stat-value">{projects.length}</span>
//               </div>
//             </div>
//             <div className="stat-card info">
//               <div className="stat-icon">🔖</div>
//               <div className="stat-content">
//                 <span className="stat-label">Asset Types</span>
//                 <span className="stat-value">{assetTypes.length - 1}</span>
//               </div>
//             </div>
//             <div className="stat-card info">
//               <div className="stat-icon">⚠️</div>
//               <div className="stat-content">
//                 <span className="stat-label">Needs Attention</span>
//                 <span className="stat-value">{stats.damaged + stats.repair}</span>
//               </div>
//             </div>
//           </div>

//           {/* Project Distribution */}
//           <div className="project-distribution">
//             <h3>Assets by Project</h3>
//             <div className="project-tags">
//               {projects.map(project => (
//                 <button
//                   key={project}
//                   className={`project-tag ${filters.project === project ? 'active' : ''}`}
//                   onClick={() => setFilters(prev => ({ ...prev, project: project === filters.project ? 'all' : project }))}
//                 >
//                   {project}
//                   <span className="project-count">{stats.byProject[project] || 0}</span>
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Asset Type Distribution */}
//           <div className="type-distribution">
//             <h3>Assets by Type</h3>
//             <div className="type-chips">
//               {assetTypes.slice(1).map(type => (
//                 <button
//                   key={type}
//                   className={`type-chip ${filters.assetType === type ? 'active' : ''}`}
//                   onClick={() => setFilters(prev => ({ ...prev, assetType: type === filters.assetType ? 'all' : type }))}
//                 >
//                   {type}
//                   <span className="type-count">{stats.byType[type] || 0}</span>
//                 </button>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Advanced Filters Section */}
//         <div className="filters-advanced">
//           <div className="search-box">
//             <span className="search-icon">🔍</span>
//             <input
//               type="text"
//               placeholder="Search by name, ID, code, project, type, model, serial number, notes, owner..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="search-input"
//             />
//           </div>

//           <button 
//             className="toggle-filters-btn"
//             onClick={() => setShowFilters(!showFilters)}
//           >
//             <span className="filter-icon">⚙️</span>
//             {showFilters ? 'Hide Filters' : 'Show Filters'}
//           </button>

//           {showFilters && (
//             <div className="filter-panel">
//               <div className="filter-row">
//                 <div className="filter-group">
//                   <label>Condition</label>
//                   <select 
//                     className="filter-select"
//                     value={filters.condition}
//                     onChange={(e) => setFilters(prev => ({ ...prev, condition: e.target.value }))}
//                   >
//                     {conditions.map(cond => (
//                       <option key={cond} value={cond}>
//                         {cond === 'all' ? 'All Conditions' : cond.charAt(0).toUpperCase() + cond.slice(1)}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 <div className="filter-group">
//                   <label>Project</label>
//                   <select 
//                     className="filter-select"
//                     value={filters.project}
//                     onChange={(e) => setFilters(prev => ({ ...prev, project: e.target.value }))}
//                   >
//                     <option value="all">All Projects</option>
//                     {projects.map(project => (
//                       <option key={project} value={project}>{project}</option>
//                     ))}
//                   </select>
//                 </div>

//                 <div className="filter-group">
//                   <label>Asset Type</label>
//                   <select 
//                     className="filter-select"
//                     value={filters.assetType}
//                     onChange={(e) => setFilters(prev => ({ ...prev, assetType: e.target.value }))}
//                   >
//                     {assetTypes.map(type => (
//                       <option key={type} value={type}>
//                         {type === 'all' ? 'All Types' : type}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//               </div>

//               {(searchTerm || filters.condition !== 'all' || filters.project !== 'all' || filters.assetType !== 'all') && (
//                 <button 
//                   className="clear-all-filters"
//                   onClick={() => {
//                     setSearchTerm("");
//                     setFilters({
//                       condition: "all",
//                       project: "all",
//                       assetType: "all",
//                       dateRange: "all",
//                       status: "all"
//                     });
//                   }}
//                 >
//                   Clear All Filters
//                 </button>
//               )}
//             </div>
//           )}
//         </div>

//         {/* Results Summary */}
//         <div className="results-summary">
//           <span className="results-count">
//             Showing {sortedAssets.length} of {assets.length} assets
//           </span>
//           {sortedAssets.length > 0 && (
//             <span className="results-sort">
//               Sort by: 
//               <button 
//                 className={`sort-btn ${sortConfig.key === 'asset_name' ? 'active' : ''}`}
//                 onClick={() => requestSort('asset_name')}
//               >
//                 Name {sortConfig.key === 'asset_name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
//               </button>
//               <button 
//                 className={`sort-btn ${sortConfig.key === 'project' ? 'active' : ''}`}
//                 onClick={() => requestSort('project')}
//               >
//                 Project {sortConfig.key === 'project' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
//               </button>
//               <button 
//                 className={`sort-btn ${sortConfig.key === 'condition' ? 'active' : ''}`}
//                 onClick={() => requestSort('condition')}
//               >
//                 Condition {sortConfig.key === 'condition' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
//               </button>
//             </span>
//           )}
//         </div>

//         {/* Assets Table */}
//         {loading ? (
//           <div className="loading-state">
//             <div className="spinner"></div>
//             <p>Loading assets...</p>
//           </div>
//         ) : (
//           <div className="table-container">
//             <table className="assets-table">
//               <thead>
//                 <tr>
//                   <th onClick={() => requestSort('asset_id')} className="sortable">
//                     Asset ID {sortConfig.key === 'asset_id' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
//                   </th>
//                   <th onClick={() => requestSort('asset_code')} className="sortable">
//                     Code {sortConfig.key === 'asset_code' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
//                   </th>
//                   <th onClick={() => requestSort('asset_name')} className="sortable">
//                     Name {sortConfig.key === 'asset_name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
//                   </th>
//                   <th onClick={() => requestSort('project')} className="sortable">
//                     Project {sortConfig.key === 'project' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
//                   </th>
//                   <th onClick={() => requestSort('asset_type')} className="sortable">
//                     Type {sortConfig.key === 'asset_type' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
//                   </th>
//                   <th onClick={() => requestSort('model')} className="sortable">
//                     Model {sortConfig.key === 'model' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
//                   </th>
//                   <th onClick={() => requestSort('serial_number')} className="sortable">
//                     Serial # {sortConfig.key === 'serial_number' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
//                   </th>
//                   <th>Quantity</th>
//                   <th onClick={() => requestSort('condition')} className="sortable">
//                     Condition {sortConfig.key === 'condition' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
//                   </th>
//                   <th>Notes</th>
//                   <th>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {sortedAssets.length > 0 ? (
//                   sortedAssets.map((a, index) => (
//                     <tr key={a.name} className="asset-row" style={{ animationDelay: `${index * 0.03}s` }}>
//                       <td className="asset-id">
//                         <span className="id-badge">{a.asset_id || '—'}</span>
//                       </td>
//                       <td className="asset-code">
//                         <code>{a.asset_code || '—'}</code>
//                       </td>
//                       <td className="asset-name">
//                         <strong>{a.asset_name || '—'}</strong>
//                       </td>
//                       <td className="project-cell">
//                         <span className="project-badge">{a.project || '—'}</span>
//                       </td>
//                       <td className="type-cell">
//                         <span className="type-badge">{a.asset_type || '—'}</span>
//                       </td>
//                       <td className="model-cell">{a.model || '—'}</td>
//                       <td className="serial-cell">
//                         <code className="serial-number">{a.serial_number || '—'}</code>
//                       </td>
//                       <td className="quantity-cell">
//                         <span className="quantity-badge">{a.quantity || 0}</span>
//                       </td>
//                       <td className="condition-cell">
//                         <ConditionBadge condition={a.condition} />
//                       </td>
//                       <td className="notes-cell" title={a.notes}>
//                         {a.notes ? (
//                           <span className="notes-indicator">
//                             📝 {a.notes.length > 20 ? a.notes.substring(0, 20) + '...' : a.notes}
//                           </span>
//                         ) : '—'}
//                       </td>
//                       <td className="actions-cell">
//                         <button 
//                           className="action-btn view-btn" 
//                           onClick={() => handleView(a.name)}
//                           title="View Details"
//                         >
//                           👁️
//                         </button>
//                         <button 
//                           className="action-btn edit-btn" 
//                           onClick={() => handleEdit(a.name)}
//                           title="Edit Asset"
//                         >
//                           ✎
//                         </button>
//                         <button 
//                           className="action-btn delete-btn" 
//                           onClick={() => handleDeleteClick(a)}
//                           title="Delete Asset"
//                         >
//                           🗑️
//                         </button>
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan="11" className="no-results">
//                       <div className="no-results-content">
//                         <span className="no-results-icon">🔍</span>
//                         <p>No assets found matching your criteria</p>
//                         <button className="clear-filters-btn" onClick={() => {
//                           setSearchTerm("");
//                           setFilters({
//                             condition: "all",
//                             project: "all",
//                             assetType: "all",
//                             dateRange: "all",
//                             status: "all"
//                           });
//                         }}>
//                           Clear All Filters
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         )}

//         {/* Export Options */}
//         <div className="export-section">
//           <button className="export-btn">
//             <span>📥</span> Export Report
//           </button>
//           <button className="export-btn">
//             <span>📊</span> Generate Summary
//           </button>
//         </div>
//       </div>

//       {/* Delete Confirmation Modal */}
//       {showDeleteModal && (
//         <div className="modal-overlay">
//           <div className="modal-content delete-modal">
//             <div className="modal-header">
//               <h3>Delete Asset</h3>
//               <button className="modal-close" onClick={() => setShowDeleteModal(false)}>×</button>
//             </div>
//             <div className="modal-body">
//               <div className="delete-icon">⚠️</div>
//               <p>Are you sure you want to delete this asset?</p>
//               {assetToDelete && (
//                 <div className="asset-preview">
//                   <div className="preview-item">
//                     <span className="preview-label">Asset:</span>
//                     <span className="preview-value">{assetToDelete.asset_name}</span>
//                   </div>
//                   <div className="preview-item">
//                     <span className="preview-label">ID:</span>
//                     <span className="preview-value">{assetToDelete.asset_id}</span>
//                   </div>
//                   <div className="preview-item">
//                     <span className="preview-label">Project:</span>
//                     <span className="preview-value">{assetToDelete.project}</span>
//                   </div>
//                   <div className="preview-item">
//                     <span className="preview-label">Type:</span>
//                     <span className="preview-value">{assetToDelete.asset_type}</span>
//                   </div>
//                 </div>
//               )}
//               <p className="warning-text">This action cannot be undone.</p>
//             </div>
//             <div className="modal-footer">
//               <button 
//                 className="btn btn-secondary" 
//                 onClick={() => setShowDeleteModal(false)}
//               >
//                 Cancel
//               </button>
//               <button 
//                 className="btn btn-danger" 
//                 onClick={confirmDelete}
//               >
//                 Delete Asset
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

import React, { useEffect, useState, useMemo, useRef } from "react";
import { getAssets, deleteAsset, getProjects } from "../../api/hrapi";
import { useNavigate } from "react-router-dom";
import { exportAssetsToExcel, exportSummaryToExcel } from "../../hooks/xl";
import "./AssetList.css";

const AssetList = () => {
  const [assets, setAssets] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchHistory, setSearchHistory] = useState([]);
  
  // Advanced filters
  const [filters, setFilters] = useState({
    condition: "all",
    project: "all",
    assetType: "all",
  });
  
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [assetToDelete, setAssetToDelete] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [exportLoading, setExportLoading] = useState(false);
  const [selectedAssets, setSelectedAssets] = useState([]);
  const [quickViewAsset, setQuickViewAsset] = useState(null);
  const [showQuickView, setShowQuickView] = useState(false);
  
  // Toast notification state
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  
  // Project selector state
  const [showProjectSelector, setShowProjectSelector] = useState(false);
  const [selectedProjects, setSelectedProjects] = useState([]);
  
  const searchInputRef = useRef(null);
  const navigate = useNavigate();

  // Show toast notification
  const showNotification = (message, type = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 2000);
  };

  // Fetch assets and projects
  const fetchData = async () => {
    setLoading(true);
    try {
      const [assetsData, projectsData] = await Promise.all([
        getAssets(),
        getProjects()
      ]);
      setAssets(assetsData);
      setProjects(projectsData || []);
      showNotification(`✅ Loaded ${assetsData.length} assets`, 'success');
    } catch (error) {
      console.error("Failed to fetch data", error);
      showNotification('❌ Failed to load assets', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    
    // Load search history from localStorage
    const savedHistory = localStorage.getItem('assetSearchHistory');
    if (savedHistory) {
      setSearchHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Save search to history
  const saveSearchToHistory = (term) => {
    if (!term.trim()) return;
    
    const updatedHistory = [term, ...searchHistory.filter(t => t !== term)].slice(0, 5);
    setSearchHistory(updatedHistory);
    localStorage.setItem('assetSearchHistory', JSON.stringify(updatedHistory));
  };

  // Get unique values for filters
  const assetTypes = useMemo(() => 
    ["all", ...new Set(assets.map(a => a.asset_type).filter(Boolean))],
    [assets]
  );

  const conditions = useMemo(() => 
    ["all", ...new Set(assets.map(a => a.condition).filter(Boolean))],
    [assets]
  );

  // Advanced filtering
  const filteredAssets = useMemo(() => {
    return assets.filter(asset => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = searchTerm === "" || 
        Object.values({
          asset_name: asset.asset_name,
          asset_id: asset.asset_id,
          asset_code: asset.asset_code,
          project: asset.project,
          asset_type: asset.asset_type,
          condition: asset.condition,
          model: asset.model,
          serial_number: asset.serial_number,
          notes: asset.notes,
        }).some(value => 
          value && value.toString().toLowerCase().includes(searchLower)
        );

      const matchesCondition = filters.condition === "all" || 
        asset.condition === filters.condition;
      const matchesProject = filters.project === "all" || 
        asset.project === filters.project;
      const matchesType = filters.assetType === "all" || 
        asset.asset_type === filters.assetType;

      return matchesSearch && matchesCondition && matchesProject && matchesType;
    });
  }, [assets, searchTerm, filters]);

  // Sorting function
  const sortedAssets = useMemo(() => {
    let sortableAssets = [...filteredAssets];
    if (sortConfig.key) {
      sortableAssets.sort((a, b) => {
        const aVal = a[sortConfig.key] || '';
        const bVal = b[sortConfig.key] || '';
        
        if (aVal < bVal) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aVal > bVal) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableAssets;
  }, [filteredAssets, sortConfig]);

  const requestSort = (key) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc'
    });
  };

  // Selection handlers
  const handleSelectAll = () => {
    if (selectedAssets.length === sortedAssets.length) {
      setSelectedAssets([]);
    } else {
      setSelectedAssets(sortedAssets.map(a => a.name));
    }
  };

  const handleSelectAsset = (name) => {
    setSelectedAssets(prev => 
      prev.includes(name) 
        ? prev.filter(id => id !== name)
        : [...prev, name]
    );
  };

  // Delete handlers
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
      await fetchData();
      showNotification(`✅ Deleted ${assetToDelete.asset_name}`, 'success');
    } catch (error) {
      console.error(error);
      showNotification('❌ Failed to delete asset', 'error');
    }
  };

  // Bulk delete handler
  const handleBulkDelete = async () => {
    if (selectedAssets.length === 0) {
      showNotification('No assets selected', 'error');
      return;
    }

    try {
      for (const name of selectedAssets) {
        await deleteAsset(name);
      }
      setSelectedAssets([]);
      await fetchData();
      showNotification(`✅ Deleted ${selectedAssets.length} assets`, 'success');
    } catch (error) {
      console.error(error);
      showNotification('❌ Failed to delete assets', 'error');
    }
  };

  // Navigation handlers
  const handleEdit = (name) => {
    navigate(`/hr/assetlistedit/${name}`);
  };

  const handleView = (name) => {
    navigate(`/hr/assetlist/${encodeURIComponent(name)}`);
  };

  const handleQuickView = (asset) => {
    setQuickViewAsset(asset);
    setShowQuickView(true);
  };

  // Project selection handlers
  const handleProjectSelection = (project) => {
    setSelectedProjects(prev => {
      if (project === 'all') {
        return prev.length === projects.length ? [] : [...projects];
      }
      if (prev.includes(project)) {
        return prev.filter(p => p !== project);
      } else {
        return [...prev, project];
      }
    });
  };

  // Export selected projects
  const handleExportSelectedProjects = () => {
    if (selectedProjects.length === 0) {
      showNotification('Please select at least one project', 'error');
      return;
    }

    const projectAssets = assets.filter(asset => 
      selectedProjects.includes(asset.project)
    );

    if (projectAssets.length === 0) {
      showNotification('No assets found in selected projects', 'error');
      return;
    }

    setExportLoading(true);
    try {
      exportAssetsToExcel(projectAssets, filters, searchTerm);
      showNotification(`✅ Exported ${projectAssets.length} assets from ${selectedProjects.length} projects`, 'success');
      setShowProjectSelector(false);
    } catch (error) {
      console.error("Export error:", error);
      showNotification('❌ Export failed', 'error');
    } finally {
      setExportLoading(false);
    }
  };

  // EXPORT HANDLERS
  const handleExportReport = () => {
    if (sortedAssets.length === 0) {
      showNotification('No assets to export', 'error');
      return;
    }
    
    setExportLoading(true);
    try {
      exportAssetsToExcel(sortedAssets, filters, searchTerm);
      saveSearchToHistory(searchTerm);
      showNotification(`✅ Exported ${sortedAssets.length} assets`, 'success');
    } catch (error) {
      console.error("Export error:", error);
      showNotification('❌ Export failed', 'error');
    } finally {
      setExportLoading(false);
    }
  };

  const handleGenerateSummary = () => {
    if (sortedAssets.length === 0) {
      showNotification('No assets to summarize', 'error');
      return;
    }
    
    setExportLoading(true);
    try {
      exportSummaryToExcel(sortedAssets, filters, searchTerm);
      showNotification(`✅ Summary report generated`, 'success');
    } catch (error) {
      console.error("Summary export error:", error);
      showNotification('❌ Summary generation failed', 'error');
    } finally {
      setExportLoading(false);
    }
  };

  // Statistics
  const stats = useMemo(() => ({
    total: assets.length,
    working: assets.filter(a => a.condition === 'working').length,
    repair: assets.filter(a => a.condition === 'repair').length,
    damaged: assets.filter(a => a.condition === 'damaged').length,
    lost: assets.filter(a => a.condition === 'lost').length,
    disposed: assets.filter(a => a.condition === 'disposed').length,
    totalQuantity: assets.reduce((sum, a) => sum + (a.quantity || 0), 0)
  }), [assets]);

  // Condition badge component
  const ConditionBadge = ({ condition }) => {
    const configs = {
      working: { color: "#10b981", bg: "rgba(16, 185, 129, 0.15)", icon: "✅", label: "Working" },
      repair: { color: "#f59e0b", bg: "rgba(245, 158, 11, 0.15)", icon: "🔧", label: "Under Repair" },
      damaged: { color: "#ef4444", bg: "rgba(239, 68, 68, 0.15)", icon: "⚠️", label: "Damaged" },
      lost: { color: "#6b7280", bg: "rgba(107, 114, 128, 0.15)", icon: "❓", label: "Lost" },
      disposed: { color: "#4b5563", bg: "rgba(75, 85, 99, 0.15)", icon: "🗑️", label: "Disposed" },
    };
    const config = configs[condition?.toLowerCase()] || { color: "#64748b", bg: "rgba(100, 116, 139, 0.15)", icon: "📦", label: condition || "Unknown" };

    return (
      <span className="condition-badge" style={{ backgroundColor: config.bg, color: config.color }}>
        <span className="badge-icon">{config.icon}</span>
        <span className="badge-text">{config.label}</span>
      </span>
    );
  };

  return (
    <div className="asset-list-container">
      {/* Animated background elements */}
      <div className="bg-orb bg-orb-1"></div>
      <div className="bg-orb bg-orb-2"></div>
      <div className="bg-orb bg-orb-3"></div>

      {/* Toast Notification - Replaces all alerts */}
      {showToast && (
        <div className={`toast-notification ${toastType}`}>
          {toastMessage}
        </div>
      )}

      <div className="content-wrapper">
        {/* Header */}
        <div className="list-header">
          <div className="header-content">
            <h1 className="page-title">Asset Management Dashboard</h1>
            <p className="page-subtitle">Comprehensive view of all assets across projects</p>
          </div>
          <div className="header-actions">
            <button 
              className="icon-button refresh-btn" 
              onClick={fetchData}
              title="Refresh data"
            >
              🔄
            </button>
            <button 
              className="create-button"
              onClick={() => navigate('/hr/asset')}
            >
              <span className="create-icon">+</span>
              Add New Asset
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="stats-enhanced">
          <div className="stats-row">
            <div className="stat-card total" onClick={() => setFilters({ condition: "all", project: "all", assetType: "all" })}>
              <div className="stat-icon">📊</div>
              <div className="stat-content">
                <span className="stat-label">Total Assets</span>
                <span className="stat-value">{stats.total}</span>
              </div>
              <div className="stat-trend">100%</div>
            </div>
            <div className="stat-card working" onClick={() => setFilters(prev => ({ ...prev, condition: "working" }))}>
              <div className="stat-icon">✅</div>
              <div className="stat-content">
                <span className="stat-label">Working</span>
                <span className="stat-value">{stats.working}</span>
              </div>
              <div className="stat-trend">{stats.total ? ((stats.working/stats.total)*100).toFixed(1) : 0}%</div>
            </div>
            <div className="stat-card repair" onClick={() => setFilters(prev => ({ ...prev, condition: "repair" }))}>
              <div className="stat-icon">🔧</div>
              <div className="stat-content">
                <span className="stat-label">Under Repair</span>
                <span className="stat-value">{stats.repair}</span>
              </div>
              <div className="stat-trend">{stats.total ? ((stats.repair/stats.total)*100).toFixed(1) : 0}%</div>
            </div>
            <div className="stat-card damaged" onClick={() => setFilters(prev => ({ ...prev, condition: "damaged" }))}>
              <div className="stat-icon">⚠️</div>
              <div className="stat-content">
                <span className="stat-label">Damaged</span>
                <span className="stat-value">{stats.damaged}</span>
              </div>
              <div className="stat-trend">{stats.total ? ((stats.damaged/stats.total)*100).toFixed(1) : 0}%</div>
            </div>
          </div>

          {/* Quick Filter Chips */}
          <div className="quick-filters">
            <span className="quick-filters-label">Quick filters:</span>
            <button 
              className={`quick-filter-chip ${filters.project === 'all' && filters.condition === 'all' && filters.assetType === 'all' ? 'active' : ''}`}
              onClick={() => setFilters({ condition: "all", project: "all", assetType: "all" })}
            >
              All Assets
            </button>
            <button 
              className="quick-filter-chip"
              onClick={() => setFilters(prev => ({ ...prev, condition: "working" }))}
            >
              Working Only
            </button>
            <button 
              className="quick-filter-chip"
              onClick={() => setFilters(prev => ({ ...prev, condition: "repair" }))}
            >
              Needs Repair
            </button>
          </div>
        </div>

        {/* Filters Section */}
        <div className="filters-advanced">
          <div className="search-wrapper">
            <div className="search-box">
              <span className="search-icon">🔍</span>
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search by name, ID, code, project, type, model, serial number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && saveSearchToHistory(searchTerm)}
                className="search-input"
              />
              {searchTerm && (
                <button className="clear-search" onClick={() => setSearchTerm("")}>
                  ✕
                </button>
              )}
            </div>
            
            {/* Search History Dropdown */}
            {searchHistory.length > 0 && searchInputRef.current === document.activeElement && (
              <div className="search-history">
                {searchHistory.map((term, index) => (
                  <div 
                    key={index} 
                    className="search-history-item"
                    onClick={() => {
                      setSearchTerm(term);
                      saveSearchToHistory(term);
                    }}
                  >
                    🔍 {term}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="filter-actions">
            <button 
              className={`filter-toggle-btn ${showFilters ? 'active' : ''}`}
              onClick={() => setShowFilters(!showFilters)}
            >
              <span>⚙️</span>
              Filters
              {(filters.condition !== 'all' || filters.project !== 'all' || filters.assetType !== 'all') && (
                <span className="filter-badge">
                  {Object.values(filters).filter(v => v !== 'all').length}
                </span>
              )}
            </button>

            {/* Active Filters Display */}
            <div className="active-filters">
              {filters.project !== 'all' && (
                <span className="active-filter">
                  Project: {filters.project}
                  <button onClick={() => setFilters(prev => ({ ...prev, project: 'all' }))}>✕</button>
                </span>
              )}
              {filters.assetType !== 'all' && (
                <span className="active-filter">
                  Type: {filters.assetType}
                  <button onClick={() => setFilters(prev => ({ ...prev, assetType: 'all' }))}>✕</button>
                </span>
              )}
              {filters.condition !== 'all' && (
                <span className="active-filter">
                  Condition: {filters.condition}
                  <button onClick={() => setFilters(prev => ({ ...prev, condition: 'all' }))}>✕</button>
                </span>
              )}
            </div>
          </div>

          {showFilters && (
            <div className="filter-panel">
              <div className="filter-row">
                <div className="filter-group">
                  <label>Condition</label>
                  <select 
                    className="filter-select"
                    value={filters.condition}
                    onChange={(e) => setFilters(prev => ({ ...prev, condition: e.target.value }))}
                  >
                    {conditions.map(cond => (
                      <option key={cond} value={cond}>
                        {cond === 'all' ? 'All Conditions' : cond.charAt(0).toUpperCase() + cond.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="filter-group">
                  <label>Project</label>
                  <select 
                    className="filter-select"
                    value={filters.project}
                    onChange={(e) => setFilters(prev => ({ ...prev, project: e.target.value }))}
                  >
                    <option value="all">All Projects</option>
                    {projects.map(project => (
                      <option key={project} value={project}>{project}</option>
                    ))}
                  </select>
                </div>

                <div className="filter-group">
                  <label>Asset Type</label>
                  <select 
                    className="filter-select"
                    value={filters.assetType}
                    onChange={(e) => setFilters(prev => ({ ...prev, assetType: e.target.value }))}
                  >
                    {assetTypes.map(type => (
                      <option key={type} value={type}>
                        {type === 'all' ? 'All Types' : type}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="filter-actions-bottom">
                <button 
                  className="apply-filters-btn"
                  onClick={() => setShowFilters(false)}
                >
                  Apply Filters
                </button>
                {(searchTerm || filters.condition !== 'all' || filters.project !== 'all' || filters.assetType !== 'all') && (
                  <button 
                    className="clear-all-filters"
                    onClick={() => {
                      setSearchTerm("");
                      setFilters({
                        condition: "all",
                        project: "all",
                        assetType: "all"
                      });
                    }}
                  >
                    Clear All
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Bulk Actions Bar */}
        {selectedAssets.length > 0 && (
          <div className="bulk-actions-bar">
            <div className="bulk-info">
              <span className="selected-count">{selectedAssets.length}</span> assets selected
            </div>
            <div className="bulk-buttons">
              <button className="bulk-btn delete" onClick={handleBulkDelete}>
                🗑 Delete Selected
              </button>
              <button className="bulk-btn clear" onClick={() => setSelectedAssets([])}>
                ✕ Clear
              </button>
            </div>
          </div>
        )}

        {/* Results Summary */}
        <div className="results-summary">
          <div className="results-left">
            <span className="results-count">
              Showing <strong>{sortedAssets.length}</strong> of <strong>{assets.length}</strong> assets
            </span>
            {sortedAssets.length > 0 && (
              <span className="results-percentage">
                ({((sortedAssets.length/assets.length)*100).toFixed(1)}%)
              </span>
            )}
          </div>
          
          <div className="results-right">
            {/* Selection Controls */}
            {sortedAssets.length > 0 && (
              <div className="selection-controls">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={selectedAssets.length === sortedAssets.length && sortedAssets.length > 0}
                    onChange={handleSelectAll}
                  />
                  Select All
                </label>
              </div>
            )}

            {/* Sort Controls */}
            {sortedAssets.length > 0 && (
              <div className="results-sort">
                <span>Sort by:</span>
                <button 
                  className={`sort-btn ${sortConfig.key === 'asset_name' ? 'active' : ''}`}
                  onClick={() => requestSort('asset_name')}
                >
                  Name {sortConfig.key === 'asset_name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </button>
                <button 
                  className={`sort-btn ${sortConfig.key === 'project' ? 'active' : ''}`}
                  onClick={() => requestSort('project')}
                >
                  Project {sortConfig.key === 'project' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </button>
                <button 
                  className={`sort-btn ${sortConfig.key === 'condition' ? 'active' : ''}`}
                  onClick={() => requestSort('condition')}
                >
                  Condition {sortConfig.key === 'condition' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </button>
              </div>
            )}
          </div>
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
                  <th className="checkbox-cell">
                    <input
                      type="checkbox"
                      checked={selectedAssets.length === sortedAssets.length && sortedAssets.length > 0}
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th onClick={() => requestSort('asset_id')} className="sortable">
                    Asset ID {sortConfig.key === 'asset_id' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => requestSort('asset_code')} className="sortable">
                    Code {sortConfig.key === 'asset_code' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => requestSort('asset_name')} className="sortable">
                    Name {sortConfig.key === 'asset_name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => requestSort('project')} className="sortable">
                    Project {sortConfig.key === 'project' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => requestSort('asset_type')} className="sortable">
                    Type {sortConfig.key === 'asset_type' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th>Model</th>
                  <th>Serial #</th>
                  <th>Qty</th>
                  <th onClick={() => requestSort('condition')} className="sortable">
                    Condition {sortConfig.key === 'condition' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedAssets.length > 0 ? (
                  sortedAssets.map((a, index) => (
                    <tr 
                      key={a.name} 
                      className={`asset-row ${selectedAssets.includes(a.name) ? 'selected' : ''}`}
                      onDoubleClick={() => handleQuickView(a)}
                    >
                      <td className="checkbox-cell">
                        <input
                          type="checkbox"
                          checked={selectedAssets.includes(a.name)}
                          onChange={() => handleSelectAsset(a.name)}
                        />
                      </td>
                      <td><span className="id-badge">{a.asset_id || '—'}</span></td>
                      <td><code className="code-badge">{a.asset_code || '—'}</code></td>
                      <td className="asset-name-cell">
                        <strong>{a.asset_name || '—'}</strong>
                        {a.notes && <span className="note-indicator" title={a.notes}>📝</span>}
                      </td>
                      <td><span className="project-badge">{a.project || '—'}</span></td>
                      <td><span className="type-badge">{a.asset_type || '—'}</span></td>
                      <td>{a.model || '—'}</td>
                      <td><code className="serial-number">{a.serial_number || '—'}</code></td>
                      <td><span className="quantity-badge">{a.quantity || 0}</span></td>
                      <td><ConditionBadge condition={a.condition} /></td>
                      <td className="actions-cell">
                        <button 
                          className="action-btn quick-view" 
                          onClick={() => handleQuickView(a)} 
                          title="Quick View"
                        >
                          👁️
                        </button>
                        <button 
                          className="action-btn edit" 
                          onClick={() => handleEdit(a.name)} 
                          title="Edit"
                        >
                          ✎
                        </button>
                        <button 
                          className="action-btn delete" 
                          onClick={() => handleDeleteClick(a)} 
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="11" className="no-results">
                      <div className="no-results-content">
                        <span className="no-results-icon">🔍</span>
                        <h3>No assets found</h3>
                        <p>Try adjusting your search or filters</p>
                        <button 
                          className="clear-filters-btn"
                          onClick={() => {
                            setSearchTerm("");
                            setFilters({ condition: "all", project: "all", assetType: "all" });
                            searchInputRef.current?.focus();
                          }}
                        >
                          Clear All Filters
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* EXPORT SECTION with Project Selector */}
        <div className="export-section">
          <div className="export-left">
            <div className="export-info">
              <span>📋 {sortedAssets.length} asset{sortedAssets.length !== 1 ? 's' : ''}</span>
            </div>
            
            {/* Project Selector */}
            <div className="project-selector-container">
              <button 
                className={`project-selector-btn ${showProjectSelector ? 'active' : ''}`}
                onClick={() => setShowProjectSelector(!showProjectSelector)}
              >
                <span>📁</span>
                Select Projects
                {selectedProjects.length > 0 && (
                  <span className="project-count-badge">{selectedProjects.length}</span>
                )}
              </button>

              {/* Project Selector Panel */}
              {showProjectSelector && (
                <div className="project-selector-panel">
                  <div className="project-selector-header">
                    <h4>Select Projects</h4>
                    <button className="close-btn" onClick={() => setShowProjectSelector(false)}>✕</button>
                  </div>
                  
                  <div className="project-selector-body">
                    <div className="project-selector-all">
                      <label className="project-checkbox">
                        <input
                          type="checkbox"
                          checked={selectedProjects.length === projects.length}
                          onChange={() => handleProjectSelection('all')}
                        />
                        <span className="project-name">Select All</span>
                        <span className="project-count">{projects.length}</span>
                      </label>
                    </div>
                    
                    <div className="project-selector-list">
                      {projects.map(project => (
                        <label key={project} className="project-checkbox">
                          <input
                            type="checkbox"
                            checked={selectedProjects.includes(project)}
                            onChange={() => handleProjectSelection(project)}
                          />
                          <span className="project-name">{project}</span>
                          <span className="project-count">
                            {assets.filter(a => a.project === project).length}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  <div className="project-selector-footer">
                    <button 
                      className="project-selector-cancel"
                      onClick={() => {
                        setSelectedProjects([]);
                        setShowProjectSelector(false);
                      }}
                    >
                      Cancel
                    </button>
                    <button 
                      className="project-selector-export"
                      onClick={handleExportSelectedProjects}
                      disabled={selectedProjects.length === 0}
                    >
                      Export Selected ({selectedProjects.length})
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="export-buttons">
            <button 
              className="export-btn primary" 
              onClick={handleExportReport}
              disabled={exportLoading || sortedAssets.length === 0}
            >
              <span>{exportLoading ? '⏳' : '📥'}</span>
              {exportLoading ? 'Exporting...' : 'Export Current View'}
            </button>
            
            <button 
              className="export-btn secondary" 
              onClick={handleGenerateSummary}
              disabled={exportLoading || sortedAssets.length === 0}
            >
              <span>{exportLoading ? '⏳' : '📊'}</span>
              {exportLoading ? 'Generating...' : 'Summary Report'}
            </button>
          </div>
        </div>
      </div>

      {/* Quick View Modal */}
      {showQuickView && quickViewAsset && (
        <div className="modal-overlay" onClick={() => setShowQuickView(false)}>
          <div className="quick-view-modal" onClick={e => e.stopPropagation()}>
            <div className="quick-view-header">
              <h3>Asset Details</h3>
              <button className="modal-close" onClick={() => setShowQuickView(false)}>✕</button>
            </div>
            <div className="quick-view-body">
              <div className="quick-view-grid">
                <div className="quick-view-item">
                  <span className="quick-view-label">Asset ID:</span>
                  <span className="quick-view-value">{quickViewAsset.asset_id || 'N/A'}</span>
                </div>
                <div className="quick-view-item">
                  <span className="quick-view-label">Asset Code:</span>
                  <span className="quick-view-value">{quickViewAsset.asset_code || 'N/A'}</span>
                </div>
                <div className="quick-view-item">
                  <span className="quick-view-label">Asset Name:</span>
                  <span className="quick-view-value">{quickViewAsset.asset_name || 'N/A'}</span>
                </div>
                <div className="quick-view-item">
                  <span className="quick-view-label">Project:</span>
                  <span className="quick-view-value">{quickViewAsset.project || 'N/A'}</span>
                </div>
                <div className="quick-view-item">
                  <span className="quick-view-label">Type:</span>
                  <span className="quick-view-value">{quickViewAsset.asset_type || 'N/A'}</span>
                </div>
                <div className="quick-view-item">
                  <span className="quick-view-label">Model:</span>
                  <span className="quick-view-value">{quickViewAsset.model || 'N/A'}</span>
                </div>
                <div className="quick-view-item">
                  <span className="quick-view-label">Serial Number:</span>
                  <span className="quick-view-value">{quickViewAsset.serial_number || 'N/A'}</span>
                </div>
                <div className="quick-view-item">
                  <span className="quick-view-label">Quantity:</span>
                  <span className="quick-view-value">{quickViewAsset.quantity || 0}</span>
                </div>
                <div className="quick-view-item">
                  <span className="quick-view-label">Condition:</span>
                  <span className="quick-view-value">
                    <ConditionBadge condition={quickViewAsset.condition} />
                  </span>
                </div>
                <div className="quick-view-item full-width">
                  <span className="quick-view-label">Notes:</span>
                  <span className="quick-view-value">{quickViewAsset.notes || 'No notes'}</span>
                </div>
              </div>
            </div>
            <div className="quick-view-footer">
              <button className="btn btn-secondary" onClick={() => setShowQuickView(false)}>
                Close
              </button>
              <button className="btn btn-primary" onClick={() => {
                setShowQuickView(false);
                handleEdit(quickViewAsset.name);
              }}>
                Edit Asset
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="modal-content delete-modal" onClick={e => e.stopPropagation()}>
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
                  <div className="preview-item">
                    <span className="preview-label">Project:</span>
                    <span className="preview-value">{assetToDelete.project}</span>
                  </div>
                </div>
              )}
              <p className="warning-text">This action cannot be undone.</p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowDeleteModal(false)}>Cancel</button>
              <button className="btn btn-danger" onClick={confirmDelete}>Delete Asset</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssetList;