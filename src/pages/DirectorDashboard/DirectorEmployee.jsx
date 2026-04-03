
import React, { useState, useEffect } from 'react';
import { getEmployees } from '../../api/hrapi';
import { useNavigate } from 'react-router-dom';
import './DirectorEmployee.css';

const DirectorEmployee = () => {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [projectFilter, setProjectFilter] = useState('');
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();

  // Fetch employees
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await getEmployees();
        setEmployees(response);

        // Extract unique projects for filtering
        const uniqueProjects = Array.from(new Set(response.map(emp => emp.project).filter(Boolean)));
        setProjects(uniqueProjects);
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };
    fetchEmployees();
  }, []);

  // Filter employees
  const filteredEmployees = (employees || []).filter(emp => {
    const fullName = emp.full_name || `${emp.first_name} ${emp.last_name}`;
    const matchesSearch =
      fullName.toLowerCase().includes(search.toLowerCase()) ||
      emp.job_title.toLowerCase().includes(search.toLowerCase()) ||
      emp.employee_id.toLowerCase().includes(search.toLowerCase()) ||
      (emp.project && emp.project.toLowerCase().includes(search.toLowerCase()));

    const matchesStatus = statusFilter ? emp.status === statusFilter : true;
    const matchesProject = projectFilter ? emp.project === projectFilter : true;

    return matchesSearch && matchesStatus && matchesProject;
  });

  const handleView = (employee) => {
    navigate(`/director-employee/${employee.employee_id}`);
      navigate(`/director-employee/${employee.employee_id}`, { replace: false });

    // navigate(`/director-employee/${id}`);
  };
  // const handleEdit =  (employee) => {
  //   navigate(`/hr/employeeedit/${employee.employee_id}`);
  // };
  // const handleDelete = (employeeId) => console.log('Delete employee with ID:', employeeId);

  // Status options
  const statusOptions = [
    "Newly Hired",
    "Active",
    "Probation",
    "Contract Ended",
    "Resigned",
    "Retired"
  ];

  // Get status badge class
  const getStatusBadgeClass = (status) => {
    switch(status) {
      case 'Active': return 'status-active';
      case 'Newly Hired': return 'status-new';
      case 'Probation': return 'status-probation';
      case 'Contract Ended': return 'status-contract-ended';
      case 'Resigned': return 'status-resigned';
      case 'Retired': return 'status-retired';
      default: return 'status-default';
    }
  };

  return (
    <div className="hr-dashboard">
      <div className="dashboard-header">
        <div className="header-content">
          <h1 className="dashboard-title">HR Dashboard</h1>
          <p className="dashboard-subtitle">Manage and monitor employee records</p>
        </div>
        <div className="stats-cards">
          <div className="stat-card">
            <div className="stat-value">{employees.length}</div>
            <div className="stat-label">Total Employees</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{employees.filter(e => e.status === 'Active').length}</div>
            <div className="stat-label">Active Employees</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{employees.filter(e => e.status === 'Newly Hired').length}</div>
            <div className="stat-label">New Hires</div>
          </div>
        </div>
      </div>

      <div className="filters-section">
        <div className="search-wrapper">
          <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="10" cy="10" r="7" />
            <path d="M21 21L15 15" />
          </svg>
          <input
            type="text"
            className="search-input"
            placeholder="Search by name, job title, ID, or project..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <select
            className="filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            {statusOptions.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>

          <select
            className="filter-select"
            value={projectFilter}
            onChange={(e) => setProjectFilter(e.target.value)}
          >
            <option value="">All Projects</option>
            {projects.map(proj => (
              <option key={proj} value={proj}>{proj}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="table-container">
        <table className="employee-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Full Name</th>
              <th>Job Title</th>
              <th>Project</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.length > 0 ? filteredEmployees.map(emp => (
              <tr key={emp.employee_id}>
                <td className="employee-id">{emp.employee_id}</td>
                <td className="employee-name">{emp.full_name || `${emp.first_name} ${emp.last_name}`}</td>
                <td className="job-title">{emp.job_title}</td>
                <td className="project-name">{emp.project || '-'}</td>
                <td className="email">{emp.email}</td>
                <td className="phone">{emp.phone}</td>
                <td>
                  <span className={`status-badge ${getStatusBadgeClass(emp.status)}`}>
                    {emp.status}
                  </span>
                </td>
                <td className="actions">
                  <button onClick={() => handleView(emp)} className="action-btn view-btn">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                    View
                  </button>
                  {/* <button onClick={() => handleEdit(emp)} className="action-btn edit-btn">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17 3L21 7L7 21H3V17L17 3Z" />
                    </svg>
                    Edit
                  </button>
                  <button onClick={() => handleDelete(emp.employee_id)} className="action-btn delete-btn">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                    Delete
                  </button> */}
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="8" className="empty-state">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  <p>No employees found</p>
                  <span>Try adjusting your search or filters</span>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DirectorEmployee;