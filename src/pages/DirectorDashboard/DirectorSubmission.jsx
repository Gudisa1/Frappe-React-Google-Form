
import React, { useEffect, useState, useMemo } from 'react';
import { fetchSubmissions } from '../../api/datacollection';
import { useNavigate } from 'react-router-dom';
import SubmissionAnalytics from '../MRDashboard/SubmissionAnalytics';
import "./DirectorSubmission.css";
import GoToDashboardButton  from '../../components/GoToDashboardButton';


const DirectorSubmission = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'analytics'
  const [filters, setFilters] = useState({
    search: '',
    reportingForm: '',
    projectName: '',
    submittedBy: '',
    status: ''
  });
  
  const navigate = useNavigate();

  useEffect(() => {
    const getSubmissions = async () => {
      try {
        setLoading(true);
        const result = await fetchSubmissions();
        setSubmissions(result);
        console.log("Fetched Submissions:", result);
      } catch (error) {
        console.error("Error fetching submissions:", error);
      } finally {
        setLoading(false);
      }
    };

    getSubmissions();
  }, []);

  // Get unique values for filter dropdowns
  const filterOptions = useMemo(() => {
    const options = {
      reportingForms: [...new Set(submissions.map(s => s.reporting_form).filter(Boolean))],
      projectNames: [...new Set(submissions.map(s => s.project).filter(Boolean))],
      submitters: [...new Set(submissions.map(s => s.submitted_by || s.owner).filter(Boolean))],
      statuses: [...new Set(submissions.map(s => s.status).filter(Boolean))]
    };
    return options;
  }, [submissions]);

  // Filter submissions based on criteria
  const filteredSubmissions = useMemo(() => {
    return submissions.filter(sub => {
      const searchTerm = filters.search.toLowerCase();
      const matchesSearch = !filters.search || 
        sub.name?.toLowerCase().includes(searchTerm) ||
        sub.reporting_form?.toLowerCase().includes(searchTerm) ||
        sub.project?.toLowerCase().includes(searchTerm) ||
        (sub.submitted_by || sub.owner)?.toLowerCase().includes(searchTerm);

      const matchesReportingForm = !filters.reportingForm || 
        sub.reporting_form === filters.reportingForm;
      const matchesProject = !filters.projectName || 
        sub.project === filters.projectName;
      const matchesSubmitter = !filters.submittedBy || 
        (sub.submitted_by || sub.owner) === filters.submittedBy;
      const matchesStatus = !filters.status || 
        sub.status === filters.status;

      return matchesSearch && matchesReportingForm && matchesProject && 
             matchesSubmitter && matchesStatus;
    });
  }, [submissions, filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      reportingForm: '',
      projectName: '',
      submittedBy: '',
      status: ''
    });
  };

  const viewDetails = (name) => {
    navigate(`${name}`);
  };

  const getStatusBadgeClass = (status) => {
    const statusMap = {
      'approved': 'status-badge approved',
      'submitted': 'status-badge submitted',
      'pending': 'status-badge pending',
      'rejected': 'status-badge rejected',
      'draft': 'status-badge draft'
    };
    return statusMap[status?.toLowerCase()] || 'status-badge';
  };

  if (loading) {
    return (
      <div className="submissions-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading submissions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="submissions-container">
      {/* Header Section with View Toggle */}
            {/* <GoToDashboardButton /> */}

      <div className="submissions-header">
        <div className="header-content">
          <h1 className="header-title">Submissions</h1>
          <p className="header-subtitle">Manage, review, and analyze all your submissions</p>
        </div>
        
        <div className="header-actions">
          {/* Stats Summary */}
          <div className="header-stats">
            <div className="stat-item">
              <span className="stat-value">{submissions.length}</span>
              <span className="stat-label">Total</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{filteredSubmissions.length}</span>
              <span className="stat-label">Filtered</span>
            </div>
          </div>

          {/* View Toggle */}
          <div className="view-toggle">
            <button 
              className={`view-toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
            >
              <svg className="toggle-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
              List View
            </button>
            <button 
              className={`view-toggle-btn ${viewMode === 'analytics' ? 'active' : ''}`}
              onClick={() => setViewMode('analytics')}
            >
              <svg className="toggle-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Analytics
            </button>
          </div>
        </div>
      </div>

      {viewMode === 'list' ? (
        <>
          {/* Filters Section */}
          <div className="filters-section">
            <div className="filters-grid">
              {/* Global Search */}
              <div className="filter-group search-group">
                <label className="filter-label">
                  <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    name="search"
                    placeholder="Search by name, form, project, submitter..."
                    value={filters.search}
                    onChange={handleFilterChange}
                    className="filter-input search-input"
                  />
                </label>
              </div>

              {/* Reporting Form Filter */}
              <div className="filter-group">
                <label className="filter-label">Reporting Form</label>
                <select
                  name="reportingForm"
                  value={filters.reportingForm}
                  onChange={handleFilterChange}
                  className="filter-select"
                >
                  <option value="">All Forms</option>
                  {filterOptions.reportingForms.map(form => (
                    <option key={form} value={form}>{form}</option>
                  ))}
                </select>
              </div>

              {/* Project Name Filter */}
              <div className="filter-group">
                <label className="filter-label">Project</label>
                <select
                  name="projectName"
                  value={filters.projectName}
                  onChange={handleFilterChange}
                  className="filter-select"
                >
                  <option value="">All Projects</option>
                  {filterOptions.projectNames.map(project => (
                    <option key={project} value={project}>{project}</option>
                  ))}
                </select>
              </div>

              {/* Submitted By Filter */}
              <div className="filter-group">
                <label className="filter-label">Submitted By</label>
                <select
                  name="submittedBy"
                  value={filters.submittedBy}
                  onChange={handleFilterChange}
                  className="filter-select"
                >
                  <option value="">All Submitters</option>
                  {filterOptions.submitters.map(submitter => (
                    <option key={submitter} value={submitter}>{submitter}</option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div className="filter-group">
                <label className="filter-label">Status</label>
                <select
                  name="status"
                  value={filters.status}
                  onChange={handleFilterChange}
                  className="filter-select"
                >
                  <option value="">All Statuses</option>
                  {filterOptions.statuses.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>

              {/* Clear Filters Button */}
              <div className="filter-group filter-actions">
                <button 
                  onClick={clearFilters}
                  className="clear-filters-btn"
                  disabled={!Object.values(filters).some(v => v)}
                >
                  Clear Filters
                </button>
              </div>
            </div>

            {/* Active Filters Summary */}
            {Object.values(filters).some(v => v) && (
              <div className="active-filters">
                <span className="active-filters-label">Active Filters:</span>
                {filters.search && <span className="filter-tag">Search: "{filters.search}"</span>}
                {filters.reportingForm && <span className="filter-tag">Form: {filters.reportingForm}</span>}
                {filters.projectName && <span className="filter-tag">Project: {filters.projectName}</span>}
                {filters.submittedBy && <span className="filter-tag">Submitter: {filters.submittedBy}</span>}
                {filters.status && <span className="filter-tag">Status: {filters.status}</span>}
              </div>
            )}
          </div>

          {/* Submissions List */}
          <div className="submissions-list-container">
            {filteredSubmissions.length === 0 ? (
              <div className="empty-state">
                <svg className="empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="empty-state-title">No submissions found</h3>
                <p className="empty-state-message">
                  {Object.values(filters).some(v => v) 
                    ? 'Try adjusting your filters to see more results.'
                    : 'Get started by creating your first submission.'}
                </p>
                {Object.values(filters).some(v => v) && (
                  <button onClick={clearFilters} className="clear-filters-link">
                    Clear all filters
                  </button>
                )}
              </div>
            ) : (
              <div className="submissions-list">
                {filteredSubmissions.map((sub) => (
                  <div 
                    key={sub.name} 
                    className="submission-card"
                    onClick={() => viewDetails(sub.name)}
                  >
                    <div className="card-content">
                      {/* Left Section - Main Info */}
                      <div className="card-main">
                        <div className="card-header">
                          <h3 className="submission-name">{sub.name || 'Untitled'}</h3>
                          <span className={getStatusBadgeClass(sub.status)}>
                            {sub.status || 'Unknown'}
                          </span>
                        </div>
                        
                        <div className="submission-details">
                          <div className="detail-item">
                            <svg className="detail-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <span className="detail-text">{sub.reporting_form || 'No form'}</span>
                          </div>
                          
                          <div className="detail-item">
                            <svg className="detail-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                            </svg>
                            <span className="detail-text">{sub.project || 'No project'}</span>
                          </div>
                        </div>
                      </div>

                      {/* Right Section - Meta Info */}
                      <div className="card-meta">
                        <div className="meta-item">
                          <span className="meta-label">Submitted by</span>
                          <div className="meta-value">
                            <svg className="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <span>{sub.submitted_by || sub.owner || 'Unknown'}</span>
                          </div>
                        </div>
                        
                        {sub.creation && (
                          <div className="meta-item">
                            <span className="meta-label">Created</span>
                            <div className="meta-value">
                              <svg className="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              <span>{new Date(sub.creation).toLocaleDateString()}</span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* View Details Button */}
                      <div className="card-action">
                        <button 
                          className="view-details-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            viewDetails(sub.name);
                          }}
                        >
                          <span>View Details</span>
                          <svg className="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      ) : (
        /* Analytics View */
        <SubmissionAnalytics submissions={submissions} />
      )}
    </div>
  );
};

export default DirectorSubmission;