// pages/HR/LeaveTracker.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FiCalendar,
  FiFilter,
  FiSearch,
  FiDownload,
  FiPrinter,
  FiChevronDown,
  FiChevronLeft,
  FiChevronRight,
  FiEye,
  FiEdit2,
  FiTrash2,
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiAlertCircle
} from 'react-icons/fi';
import './Trackers.css';

const LeaveTracker = () => {
  const [loading, setLoading] = useState(true);
  const [leaves, setLeaves] = useState([]);
  const [filteredLeaves, setFilteredLeaves] = useState([]);
  
  // Filter states
  const [filters, setFilters] = useState({
    leaveType: 'all',
    month: 'all',
    employee: '',
    status: 'all'
  });
  
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(15);

  // Mock data - replace with API call
  useEffect(() => {
    const mockLeaves = [
      {
        id: 1,
        employeeId: 'EMP001',
        employeeName: 'John Doe',
        employeeAvatar: 'JD',
        department: 'Engineering',
        leaveType: 'Annual Leave',
        startDate: '2024-03-01',
        endDate: '2024-03-10',
        days: 10,
        reason: 'Family vacation',
        status: 'approved',
        approvedBy: 'Sarah Manager',
        appliedOn: '2024-02-15'
      },
      {
        id: 2,
        employeeId: 'EMP002',
        employeeName: 'Jane Smith',
        employeeAvatar: 'JS',
        department: 'HR',
        leaveType: 'Sick Leave',
        startDate: '2024-03-05',
        endDate: '2024-03-07',
        days: 3,
        reason: 'Flu',
        status: 'pending',
        appliedOn: '2024-03-01'
      },
      {
        id: 3,
        employeeId: 'EMP003',
        employeeName: 'Mike Johnson',
        employeeAvatar: 'MJ',
        department: 'Sales',
        leaveType: 'Maternity Leave',
        startDate: '2024-03-15',
        endDate: '2024-06-15',
        days: 90,
        reason: 'Maternity',
        status: 'approved',
        approvedBy: 'Sarah Manager',
        appliedOn: '2024-02-01'
      },
      {
        id: 4,
        employeeId: 'EMP004',
        employeeName: 'Sarah Williams',
        employeeAvatar: 'SW',
        department: 'Finance',
        leaveType: 'Compassionate Leave',
        startDate: '2024-03-02',
        endDate: '2024-03-04',
        days: 2,
        reason: 'Family emergency',
        status: 'approved',
        approvedBy: 'Sarah Manager',
        appliedOn: '2024-02-28'
      },
      {
        id: 5,
        employeeId: 'EMP005',
        employeeName: 'David Lee',
        employeeAvatar: 'DL',
        department: 'Engineering',
        leaveType: 'Annual Leave',
        startDate: '2024-03-20',
        endDate: '2024-03-25',
        days: 5,
        reason: 'Personal time',
        status: 'rejected',
        rejectedBy: 'Sarah Manager',
        reason: 'Project deadline',
        appliedOn: '2024-03-01'
      },
      {
        id: 6,
        employeeId: 'EMP006',
        employeeName: 'Emma Wilson',
        employeeAvatar: 'EW',
        department: 'Marketing',
        leaveType: 'Unpaid Leave',
        startDate: '2024-04-01',
        endDate: '2024-04-10',
        days: 10,
        reason: 'Extended travel',
        status: 'pending',
        appliedOn: '2024-03-10'
      }
    ];

    setTimeout(() => {
      setLeaves(mockLeaves);
      setFilteredLeaves(mockLeaves);
      setLoading(false);
    }, 1000);
  }, []);

  // Get unique values for filters
  const leaveTypes = ['all', ...new Set(leaves.map(l => l.leaveType))];
  const months = [
    'all',
    'January 2024',
    'February 2024',
    'March 2024',
    'April 2024',
    'May 2024',
    'June 2024'
  ];
  const departments = ['all', ...new Set(leaves.map(l => l.department))];

  // Apply filters
  useEffect(() => {
    let filtered = [...leaves];

    // Filter by leave type
    if (filters.leaveType !== 'all') {
      filtered = filtered.filter(l => l.leaveType === filters.leaveType);
    }

    // Filter by month
    if (filters.month !== 'all') {
      const [monthName, year] = filters.month.split(' ');
      const monthIndex = new Date(`${monthName} 1, ${year}`).getMonth();
      filtered = filtered.filter(l => {
        const startMonth = new Date(l.startDate).getMonth();
        const startYear = new Date(l.startDate).getFullYear();
        return startMonth === monthIndex && startYear === parseInt(year);
      });
    }

    // Filter by employee name
    if (filters.employee) {
      filtered = filtered.filter(l => 
        l.employeeName.toLowerCase().includes(filters.employee.toLowerCase())
      );
    }

    // Filter by status
    if (filters.status !== 'all') {
      filtered = filtered.filter(l => l.status === filters.status);
    }

    // Filter by department
    if (filters.department !== 'all' && filters.department) {
      filtered = filtered.filter(l => l.department === filters.department);
    }

    setFilteredLeaves(filtered);
    setCurrentPage(1);
  }, [filters, leaves]);

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredLeaves.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredLeaves.length / itemsPerPage);

  // Stats
  const stats = {
    total: leaves.length,
    pending: leaves.filter(l => l.status === 'pending').length,
    approved: leaves.filter(l => l.status === 'approved').length,
    rejected: leaves.filter(l => l.status === 'rejected').length,
    totalDays: leaves.reduce((acc, curr) => acc + curr.days, 0)
  };

  const getStatusBadge = (status) => {
    const badges = {
      approved: { class: 'badge-success', icon: FiCheckCircle, label: 'Approved' },
      pending: { class: 'badge-warning', icon: FiClock, label: 'Pending' },
      rejected: { class: 'badge-danger', icon: FiXCircle, label: 'Rejected' }
    };
    return badges[status] || badges.pending;
  };

  const handleStatusChange = (id, newStatus) => {
    // API call to update status
    console.log(`Update leave ${id} to ${newStatus}`);
  };

  const exportToCSV = () => {
    const headers = ['Employee', 'Leave Type', 'Start Date', 'End Date', 'Days', 'Status', 'Reason'];
    const csvData = filteredLeaves.map(l => [
      l.employeeName,
      l.leaveType,
      l.startDate,
      l.endDate,
      l.days,
      l.status,
      l.reason
    ]);
    
    const csvContent = [headers, ...csvData]
      .map(row => row.join(','))
      .join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leave_tracker_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  if (loading) {
    return (
      <div className="tracker-loading">
        <div className="loading-spinner"></div>
        <p>Loading leave data...</p>
      </div>
    );
  }

  return (
    <div className="tracker-container">
      {/* Header */}
      <div className="tracker-header">
        <div className="header-left">
          <h1 className="tracker-title">Leave Tracker</h1>
          <p className="tracker-subtitle">Manage and monitor all leave requests</p>
        </div>
        <div className="header-right">
          <button className="btn-outline" onClick={exportToCSV}>
            <FiDownload size={18} />
            <span>Export</span>
          </button>
          <button className="btn-outline" onClick={() => window.print()}>
            <FiPrinter size={18} />
            <span>Print</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card primary">
          <div className="stat-icon">
            <FiCalendar />
          </div>
          <div className="stat-content">
            <span className="stat-value">{stats.total}</span>
            <span className="stat-label">Total Requests</span>
          </div>
        </div>
        <div className="stat-card warning">
          <div className="stat-icon">
            <FiClock />
          </div>
          <div className="stat-content">
            <span className="stat-value">{stats.pending}</span>
            <span className="stat-label">Pending</span>
          </div>
        </div>
        <div className="stat-card success">
          <div className="stat-icon">
            <FiCheckCircle />
          </div>
          <div className="stat-content">
            <span className="stat-value">{stats.approved}</span>
            <span className="stat-label">Approved</span>
          </div>
        </div>
        <div className="stat-card danger">
          <div className="stat-icon">
            <FiXCircle />
          </div>
          <div className="stat-content">
            <span className="stat-value">{stats.rejected}</span>
            <span className="stat-label">Rejected</span>
          </div>
        </div>
        <div className="stat-card info">
          <div className="stat-icon">
            <FiCalendar />
          </div>
          <div className="stat-content">
            <span className="stat-value">{stats.totalDays}</span>
            <span className="stat-label">Total Days</span>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="filters-bar">
        <div className="search-box">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search by employee name..."
            value={filters.employee}
            onChange={(e) => setFilters({ ...filters, employee: e.target.value })}
            className="search-input"
          />
        </div>

        <button 
          className={`filters-toggle ${showFilters ? 'active' : ''}`}
          onClick={() => setShowFilters(!showFilters)}
        >
          <FiFilter size={18} />
          <span>Filters</span>
          {Object.values(filters).filter(v => v !== 'all' && v !== '').length > 0 && (
            <span className="filter-badge">
              {Object.values(filters).filter(v => v !== 'all' && v !== '').length}
            </span>
          )}
          <FiChevronDown className={`chevron ${showFilters ? 'open' : ''}`} />
        </button>
      </div>

      {/* Expanded Filters */}
      {showFilters && (
        <div className="filters-panel">
          <div className="filters-grid">
            <div className="filter-group">
              <label>Leave Type</label>
              <select 
                value={filters.leaveType}
                onChange={(e) => setFilters({ ...filters, leaveType: e.target.value })}
              >
                {leaveTypes.map(type => (
                  <option key={type} value={type}>
                    {type === 'all' ? 'All Types' : type}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Month</label>
              <select 
                value={filters.month}
                onChange={(e) => setFilters({ ...filters, month: e.target.value })}
              >
                {months.map(month => (
                  <option key={month} value={month}>
                    {month === 'all' ? 'All Months' : month}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Department</label>
              <select 
                value={filters.department || 'all'}
                onChange={(e) => setFilters({ ...filters, department: e.target.value })}
              >
                {departments.map(dept => (
                  <option key={dept} value={dept}>
                    {dept === 'all' ? 'All Departments' : dept}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Status</label>
              <select 
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Results Summary */}
      <div className="results-summary">
        <p>Showing {currentItems.length} of {filteredLeaves.length} leave requests</p>
      </div>

      {/* Leave Table */}
      <div className="table-container">
        <table className="tracker-table">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Leave Type</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Days</th>
              <th>Reason</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map(leave => {
              const StatusIcon = getStatusBadge(leave.status).icon;
              return (
                <tr key={leave.id}>
                  <td>
                    <div className="employee-cell">
                      <div className="employee-avatar">{leave.employeeAvatar}</div>
                      <div className="employee-info">
                        <span className="employee-name">{leave.employeeName}</span>
                        <span className="employee-dept">{leave.department}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="leave-type">{leave.leaveType}</span>
                  </td>
                  <td>{new Date(leave.startDate).toLocaleDateString()}</td>
                  <td>{new Date(leave.endDate).toLocaleDateString()}</td>
                  <td className="days-cell">{leave.days}</td>
                  <td className="reason-cell" title={leave.reason}>
                    {leave.reason.length > 30 
                      ? `${leave.reason.substring(0, 30)}...` 
                      : leave.reason}
                  </td>
                  <td>
                    <span className={`status-badge ${getStatusBadge(leave.status).class}`}>
                      <StatusIcon size={14} />
                      <span>{getStatusBadge(leave.status).label}</span>
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <Link to={`/hr/employees/${leave.employeeId}`} className="action-btn view">
                        <FiEye size={16} />
                      </Link>
                      {leave.status === 'pending' && (
                        <>
                          <button 
                            className="action-btn approve"
                            onClick={() => handleStatusChange(leave.id, 'approved')}
                            title="Approve"
                          >
                            <FiCheckCircle size={16} />
                          </button>
                          <button 
                            className="action-btn reject"
                            onClick={() => handleStatusChange(leave.id, 'rejected')}
                            title="Reject"
                          >
                            <FiXCircle size={16} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button 
            className="pagination-btn"
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            <FiChevronLeft size={18} />
          </button>
          <span className="pagination-info">
            Page {currentPage} of {totalPages}
          </span>
          <button 
            className="pagination-btn"
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
          >
            <FiChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
};

export default LeaveTracker;