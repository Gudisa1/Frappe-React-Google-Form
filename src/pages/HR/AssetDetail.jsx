import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getAssetDetail } from "../../api/hrapi";
import "./AssetDetail.css";

// Icons as SVG components or you can use react-icons library
const Icons = {
  back: "←",
  edit: "✎",
  print: "🖨️",
  share: "↗️",
  download: "↓",
  asset: "📦",
  project: "📁",
  type: "🏷️",
  model: "🔧",
  condition: "❤️",
  serial: "🔢",
  vendor: "🏢",
  calendar: "📅",
  user: "👤",
  notes: "📝",
  code: "🔑",
  status: "⚡",
  verified: "✅",
  warning: "⚠️",
  info: "ℹ️"
};

const ConditionBadge = ({ condition }) => {
  const getConditionConfig = (cond) => {
    const configs = {
      working: { icon: "✅", color: "#10b981", bg: "#d1fae5", label: "Working" },
      repair: { icon: "🔧", color: "#f59e0b", bg: "#fef3c7", label: "Under Repair" },
      damaged: { icon: "⚠️", color: "#ef4444", bg: "#fee2e2", label: "Damaged" },
      lost: { icon: "❓", color: "#6b7280", bg: "#f3f4f6", label: "Lost" },
      disposed: { icon: "🗑️", color: "#4b5563", bg: "#e5e7eb", label: "Disposed" },
    };
    return configs[cond?.toLowerCase()] || configs.working;
  };

  const config = getConditionConfig(condition);

  return (
    <span className="condition-badge" style={{ backgroundColor: config.bg, color: config.color }}>
      <span className="condition-icon">{config.icon}</span>
      {config.label}
    </span>
  );
};

const InfoCard = ({ icon, label, value, className = "" }) => (
  <div className={`info-card ${className}`}>
    <div className="info-icon">{icon}</div>
    <div className="info-content">
      <div className="info-label">{label}</div>
      <div className="info-value">{value || "—"}</div>
    </div>
  </div>
);

const DetailRow = ({ icon, label, value, isFullWidth = false }) => (
  <div className={`detail-row ${isFullWidth ? "full-width" : ""}`}>
    <div className="detail-label">
      <span className="detail-icon">{icon}</span>
      <span>{label}</span>
    </div>
    <div className="detail-value">{value || "—"}</div>
  </div>
);

const AssetDetail = () => {
  const { name } = useParams();
  const decodedName = decodeURIComponent(name);
  const navigate = useNavigate();
  const [asset, setAsset] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => {
    const fetchAsset = async () => {
      setLoading(true);
      try {
        const data = await getAssetDetail(decodedName);
        console.log("Fetched asset details:", data);
        setAsset(data);
      } catch (error) {
        console.error("Failed to fetch asset details", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAsset();
  }, [decodedName]);

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    setShowShareModal(true);
    // In a real app, you'd implement sharing logic
    setTimeout(() => setShowShareModal(false), 2000);
  };

  const handleDownload = () => {
    // Create a JSON file with asset data
    const dataStr = JSON.stringify(asset, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `asset-${asset.asset_id || asset.name}.json`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  if (loading) {
    return (
      <div className="asset-detail-container">
        <div className="loading-state">
          <div className="spinner-large"></div>
          <p>Loading asset details...</p>
        </div>
      </div>
    );
  }

  if (!asset) {
    return (
      <div className="asset-detail-container">
        <div className="error-state">
          <div className="error-icon">🔍</div>
          <h3>Asset Not Found</h3>
          <p>The asset you're looking for doesn't exist or has been removed.</p>
          <button className="btn-primary" onClick={() => navigate(-1)}>
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="asset-detail-container">
      {/* Header with actions */}
      <div className="detail-header">
        <div className="header-left">
          <button className="back-button" onClick={() => navigate(-1)}>
            <span className="back-icon">{Icons.back}</span>
            Back to Assets
          </button>
        </div>
        <div className="header-right">
          <button className="action-button" onClick={handlePrint} title="Print">
            <span>{Icons.print}</span>
          </button>
          <button className="action-button" onClick={handleShare} title="Share">
            <span>{Icons.share}</span>
          </button>
          <button className="action-button" onClick={handleDownload} title="Download">
            <span>{Icons.download}</span>
          </button>
          <button className="action-button primary" onClick={() => navigate(`/assets/edit/${asset.name}`)}>
            <span>{Icons.edit}</span>
            Edit Asset
          </button>
        </div>
      </div>

      {/* Share notification modal */}
      {showShareModal && (
        <div className="share-notification">
          <span className="share-icon">{Icons.verified}</span>
          Link copied to clipboard!
        </div>
      )}

      {/* Main content */}
      <div className="detail-content">
        {/* Hero section */}
        <div className="hero-section">
          <div className="hero-icon">{Icons.asset}</div>
          <div className="hero-info">
            <h1 className="hero-title">{asset.asset_name || "Unnamed Asset"}</h1>
            <div className="hero-meta">
              <span className="hero-id">ID: {asset.name || asset.asset_id}</span>
              <span className="hero-separator">•</span>
              <ConditionBadge condition={asset.condition} />
              {asset.status && (
                <>
                  <span className="hero-separator">•</span>
                  <span className="hero-status">{asset.status}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Quick stats cards */}
        <div className="stats-grid">
          <InfoCard 
            icon={Icons.project}
            label="Project"
            value={asset.project}
            className="stat-card"
          />
          <InfoCard 
            icon={Icons.type}
            label="Asset Type"
            value={asset.asset_type}
            className="stat-card"
          />
          <InfoCard 
            icon={Icons.model}
            label="Model"
            value={asset.model}
            className="stat-card"
          />
          <InfoCard 
            icon={Icons.code}
            label="Asset Code"
            value={asset.asset_code}
            className="stat-card"
          />
        </div>

        {/* Tabs navigation */}
        <div className="tabs-nav">
          <button 
            className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button 
            className={`tab-button ${activeTab === 'details' ? 'active' : ''}`}
            onClick={() => setActiveTab('details')}
          >
            Details
          </button>
          <button 
            className={`tab-button ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            History
          </button>
          <button 
            className={`tab-button ${activeTab === 'documents' ? 'active' : ''}`}
            onClick={() => setActiveTab('documents')}
          >
            Documents
          </button>
        </div>

        {/* Tab content */}
        <div className="tab-content">
          {activeTab === 'overview' && (
            <div className="overview-grid">
              <div className="details-card">
                <h3 className="card-title">Asset Information</h3>
                <div className="details-grid">
                  <DetailRow 
                    icon={Icons.asset}
                    label="Asset ID"
                    value={asset.name}
                  />
                  <DetailRow 
                    icon={Icons.code}
                    label="Asset Code"
                    value={asset.asset_code}
                  />
                  <DetailRow 
                    icon={Icons.serial}
                    label="Serial Number"
                    value={asset.serial_number}
                  />
                  <DetailRow 
                    icon={Icons.model}
                    label="Model"
                    value={asset.model}
                  />
                  <DetailRow 
                    icon={Icons.vendor}
                    label="Vendor"
                    value={asset.vendor}
                  />
                  <DetailRow 
                    icon={Icons.condition}
                    label="Condition"
                    value={<ConditionBadge condition={asset.condition} />}
                  />
                  {asset.status && (
                    <DetailRow 
                      icon={Icons.status}
                      label="Status"
                      value={asset.status}
                    />
                  )}
                </div>
              </div>

              <div className="details-card">
                <h3 className="card-title">Assignment Details</h3>
                <div className="details-grid">
                  <DetailRow 
                    icon={Icons.project}
                    label="Project"
                    value={asset.project}
                  />
                  <DetailRow 
                    icon={Icons.user}
                    label="Assigned To"
                    value={asset.assigned_to || "Unassigned"}
                  />
                  <DetailRow 
                    icon={Icons.calendar}
                    label="Assigned On"
                    value={formatDate(asset.assigned_on)}
                  />
                  <DetailRow 
                    icon={Icons.calendar}
                    label="Expected Return"
                    value={formatDate(asset.expected_return)}
                  />
                </div>
              </div>

              <div className="details-card full-width">
                <h3 className="card-title">
                  <span className="card-icon">{Icons.notes}</span>
                  Notes
                </h3>
                <div className="notes-content">
                  {asset.notes || "No notes available for this asset."}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'details' && (
            <div className="details-card">
              <h3 className="card-title">Complete Asset Details</h3>
              <div className="details-grid two-columns">
                <DetailRow 
                  icon={Icons.calendar}
                  label="Created On"
                  value={formatDate(asset.creation)}
                />
                <DetailRow 
                  icon={Icons.user}
                  label="Created By"
                  value={asset.owner}
                />
                <DetailRow 
                  icon={Icons.calendar}
                  label="Last Updated"
                  value={formatDate(asset.modified)}
                />
                <DetailRow 
                  icon={Icons.user}
                  label="Last Updated By"
                  value={asset.modified_by}
                />
                <DetailRow 
                  icon={Icons.type}
                  label="Asset Type"
                  value={asset.asset_type}
                />
                <DetailRow 
                  icon={Icons.model}
                  label="Model"
                  value={asset.model}
                />
                <DetailRow 
                  icon={Icons.serial}
                  label="Serial Number"
                  value={asset.serial_number}
                />
                <DetailRow 
                  icon={Icons.vendor}
                  label="Vendor"
                  value={asset.vendor}
                />
                <DetailRow 
                  icon={Icons.code}
                  label="Asset Code"
                  value={asset.asset_code}
                />
                <DetailRow 
                  icon={Icons.condition}
                  label="Condition"
                  value={<ConditionBadge condition={asset.condition} />}
                />
                {asset.purchase_date && (
                  <DetailRow 
                    icon={Icons.calendar}
                    label="Purchase Date"
                    value={formatDate(asset.purchase_date)}
                  />
                )}
                {asset.purchase_cost && (
                  <DetailRow 
                    icon={Icons.asset}
                    label="Purchase Cost"
                    value={`$${asset.purchase_cost}`}
                  />
                )}
                {asset.warranty_expiry && (
                  <DetailRow 
                    icon={Icons.warning}
                    label="Warranty Expiry"
                    value={formatDate(asset.warranty_expiry)}
                  />
                )}
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="details-card">
              <h3 className="card-title">Asset History</h3>
              <div className="timeline">
                <div className="timeline-item">
                  <div className="timeline-dot"></div>
                  <div className="timeline-content">
                    <div className="timeline-date">{formatDate(asset.creation)}</div>
                    <div className="timeline-title">Asset Created</div>
                    <div className="timeline-description">by {asset.owner}</div>
                  </div>
                </div>
                <div className="timeline-item">
                  <div className="timeline-dot"></div>
                  <div className="timeline-content">
                    <div className="timeline-date">{formatDate(asset.modified)}</div>
                    <div className="timeline-title">Last Updated</div>
                    <div className="timeline-description">by {asset.modified_by}</div>
                  </div>
                </div>
                <div className="timeline-item">
                  <div className="timeline-dot"></div>
                  <div className="timeline-content">
                    <div className="timeline-date">{formatDate(asset.assigned_on)}</div>
                    <div className="timeline-title">Assigned to Project</div>
                    <div className="timeline-description">{asset.project}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="details-card">
              <h3 className="card-title">Documents & Attachments</h3>
              <div className="documents-grid">
                <div className="document-placeholder">
                  <span className="document-icon">📄</span>
                  <span>No documents available</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssetDetail;