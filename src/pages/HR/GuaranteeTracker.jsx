// pages/HR/GuaranteeTracker.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FiShield,
  FiFilter,
  FiSearch,
  FiDownload,
  FiEye,
  FiEdit2,
  FiTrash2,
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle,
  FiClock,
  FiChevronLeft,
  FiChevronRight
} from 'react-icons/fi';
import './Trackers.css';

const GuaranteeTracker = () => {
  const [loading, setLoading] = useState(true);
  const [guarantees, setGuarantees] = useState([]);
  const [filteredGuarantees, setFilteredGuarantees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(15);

  // Mock data - replace with API call
  useEffect(() => {
    const mockGuarantees = [
      {
        id: 1,
        employeeId: 'EMP001',
        employeeName: 'John Doe',
        employeeAvatar: 'JD',
        companyName: 'ABC Construction',
        personGuaranteed: 'Mike Johnson',
        startDate: '2023-01-01',
        endDate: '2023-12-31',
        status: 'active',
        type: 'Financial',
        amount: 500000,
        daysUntilExpiry: 45
      },
      {
        id: 2,
        employeeId: 'EMP002',
        employeeName: 'Jane Smith',
        employeeAvatar: 'JS',
        companyName: 'XYZ Industries',
        personGuaranteed: 'Sarah Williams',
        startDate: '2023-06-01',
        endDate: '2024-05-31',
        status: 'active',
        type: 'Performance',
        amount: 200000,
        daysUntilExpiry: 245
      },
      {
        id: 3,
        employeeId: 'EMP003',
        employeeName: 'Mike Johnson',
        employeeAvatar: 'MJ',
        companyName: 'Tech Solutions',
        personGuaranteed: 'David Lee',
        startDate: '2022-01-01',
        endDate: '2022-12-31',
        status: 'expired',
        type: 'Financial',
        amount: 300000,
        daysUntilExpiry: -90
      },
      {
        id: 4,
        employeeId: 'EMP004',
        employeeName: 'Sarah Williams',
        employeeAvatar: 'SW',
        companyName: 'Global Trading',
        personGuaranteed: 'Emma Wilson',
        startDate: '2023-09-01',
        endDate: '2024-08-31',
        status: 'active',
        type: 'Financial',
        amount: 450000,
        daysUntilExpiry: 150
      },
      {
        id: 5,
        employeeId: 'EMP005',
        employeeName: 'David Lee',
        employeeAvatar: 'DL',
        companyName: 'Construction Co',
        personGuaranteed: 'James Brown',
        startDate: '2023-03-01',
        endDate: '2024-02-28',
        status: 'expiring',
        type: 'Performance',
        amount: 150000,
        daysUntilExpiry: 15
      }
    ];

    setTimeout(() => {
      setGuarantees(mockGuarantees);
      setFilteredGuarantees(mockGuarantees);
      setLoading(false);
    }, 1000);
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = [...guarantees];

    if (searchTerm) {
      filtered = filtered.filter(g => 
        g.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        g.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        g.personGuaranteed.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(g => g.status === statusFilter);
    }

    setFilteredGuarantees(filtered);
    setCurrentPage(1);
  }, [guarantees, searchTerm, statusFilter]);

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredGuarantees.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredGuarantees.length / itemsPerPage);

  // Stats
  const stats = {
    total: guarantees.length,
    active: guarantees.filter(g => g.status === 'active').length,
    expiring: guarantees.filter(g => g.status === 'expiring').length,
    expired: guarantees.filter(g => g.status === 'expired').length,
    totalAmount: guarantees.reduce((acc, curr) => acc + (curr.amount || 0), 0)
  };

  const getStatusBadge = (status) => {
    const badges = {
      active: { class: 'badge-success', icon: FiCheckCircle, label: 'Active' },
      expiring: { class: 'badge-warning', icon: FiClock, label: 'Expiring Soon' },
      expired: { class: 'badge-danger', icon: FiXCircle, label: 'Expired' }
    };
    return badges[status] || badges.active;
  };

  const exportToCSV = () => {
    const headers = ['Employee', 'Company', 'Person Guaranteed', 'Start Date', 'End Date', 'Status', 'Type', 'Amount'];
    const csvData = filteredGuarantees.map(g => [
      g.employeeName,
      g.companyName,
      g.personGuaranteed,
      g.startDate,
      g.endDate,
      g.status,
      g.type,
      g.amount
    ]);
    
    const csvContent = [headers, ...csvData]
      .map(row => row.join(','))
      .join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `guarantee_tracker_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  if (loading) {
    return (
      <div className="tracker-loading">
        <div className="loading-spinner"></div>
        <p>Loading guarantee data...</p>
      </div>
    );
  }

  return (
    <div className="tracker-container">
      <div className="tracker-header">
        <div className="header-left">
          <h1 className="tracker-title">Guarantee Tracker</h1>
          <p className="tracker-subtitle">Monitor employee guarantees across the organization</p>
        </div>
        <div className="header-right">
          <button className="btn-outline" onClick={exportToCSV}>
            <FiDownload size={18} />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card primary">
          <div className="stat-icon">
            <FiShield />
          </div>
          <div className="stat-content">
            <span className="stat-value">{stats.total}</span>
            <span className="stat-label">Total Guarantees</span>
          </div>
        </div>
        <div className="stat-card success">
          <div className="stat-icon">
            <FiCheckCircle />
          </div>
          <div className="stat-content">
            <span className="stat-value">{stats.active}</span>
            <span className="stat-label">Active</span>
          </div>
        </div>
        <div className="stat-card warning">
          <div className="stat-icon">
            <FiClock />
          </div>
          <div className="stat-content">
            <span className="stat-value">{stats.expiring}</span>
            <span className="stat-label">Expiring Soon</span>
          </div>
        </div>
        <div className="stat-card danger">
          <div className="stat-icon">
            <FiXCircle />
          </div>
          <div className="stat-content">
            <span className="stat-value">{stats.expired}</span>
            <span className="stat-label">Expired</span>
          </div>
        </div>
        <div className="stat-card info">
          <div className="stat-icon">
            <FiShield />
          </div>
          <div className="stat-content">
            <span className="stat-value">{stats.totalAmount.toLocaleString()} ETB</span>
            <span className="stat-label">Total Value</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-bar">
        <div className="search-box">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search by employee, company, or person..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <select 
          className="status-filter"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="expiring">Expiring Soon</option>
          <option value="expired">Expired</option>
        </select>
      </div>

      {/* Results Summary */}
      <div className="results-summary">
        <p>Showing {currentItems.length} of {filteredGuarantees.length} guarantees</p>
      </div>

      {/* Guarantees Table */}
      <div className="table-container">
        <table className="tracker-table">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Company</th>
              <th>Person Guaranteed</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Status</th>
              <th>Amount (ETB)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map(guarantee => {
              const StatusIcon = getStatusBadge(guarantee.status).icon;
              return (
                <tr key={guarantee.id}>
                  <td>
                    <div className="employee-cell">
                      <div className="employee-avatar">{guarantee.employeeAvatar}</div>
                      <span className="employee-name">{guarantee.employeeName}</span>
                    </div>
                  </td>
                  <td>{guarantee.companyName}</td>
                  <td>{guarantee.personGuaranteed}</td>
                  <td>{new Date(guarantee.startDate).toLocaleDateString()}</td>
                  <td>{new Date(guarantee.endDate).toLocaleDateString()}</td>
                  <td>
                    <span className={`status-badge ${getStatusBadge(guarantee.status).class}`}>
                      <StatusIcon size={14} />
                      <span>{getStatusBadge(guarantee.status).label}</span>
                    </span>
                  </td>
                  <td className="amount-cell">{guarantee.amount?.toLocaleString()}</td>
                  <td>
                    <div className="action-buttons">
                      <Link to={`/hr/employees/${guarantee.employeeId}`} className="action-btn view">
                        <FiEye size={16} />
                      </Link>
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

export default GuaranteeTracker;