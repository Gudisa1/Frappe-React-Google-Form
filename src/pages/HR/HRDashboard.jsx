// pages/HR/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FiUsers,
  FiUserCheck,
  FiUserX,
  FiClock,
  FiCalendar,
  FiActivity,
  FiShield,
  FiAlertTriangle,
  FiTrendingUp,
  FiDollarSign,
  FiHeart,
  FiBriefcase,
  FiAward,
  FiMoreVertical,
  FiDownload,
  FiRefreshCw
} from 'react-icons/fi';
import './HRDashboard.css';

const HRDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('month');
  const [refreshing, setRefreshing] = useState(false);

  // Mock data - replace with actual API calls
  useEffect(() => {
    // Simulate API loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    // Simulate refresh
    setTimeout(() => setRefreshing(false), 1000);
  };

  // Employee Statistics
  const employeeStats = {
    total: 156,
    active: 98,
    probation: 12,
    newHires: 5,
    noticePeriod: 3,
    contractEnded: 8,
    resigned: 6,
    retired: 24
  };

  // Status Cards Data
  const statusCards = [
    {
      id: 1,
      title: 'Total Employees',
      value: employeeStats.total,
      icon: FiUsers,
      color: 'primary',
      trend: '+12%',
      trendUp: true,
      description: 'All active records'
    },
    {
      id: 2,
      title: 'Active',
      value: employeeStats.active,
      icon: FiUserCheck,
      color: 'success',
      trend: '+5%',
      trendUp: true,
      description: 'Currently working'
    },
    {
      id: 3,
      title: 'On Probation',
      value: employeeStats.probation,
      icon: FiClock,
      color: 'warning',
      trend: '-2%',
      trendUp: false,
      description: 'Review pending'
    },
    {
      id: 4,
      title: 'New Hires',
      value: employeeStats.newHires,
      icon: FiAward,
      color: 'info',
      trend: '+3',
      trendUp: true,
      description: 'This month'
    },
    {
      id: 5,
      title: 'Notice Period',
      value: employeeStats.noticePeriod,
      icon: FiCalendar,
      color: 'orange',
      trend: '0',
      trendUp: null,
      description: 'Leaving soon'
    },
    {
      id: 6,
      title: 'Contract Ended',
      value: employeeStats.contractEnded,
      icon: FiUserX,
      color: 'danger',
      trend: '+2',
      trendUp: false,
      description: 'Not renewed'
    },
    {
      id: 7,
      title: 'Resigned',
      value: employeeStats.resigned,
      icon: FiTrendingUp,
      color: 'purple',
      trend: '+1',
      trendUp: false,
      description: 'Voluntary exit'
    },
    {
      id: 8,
      title: 'Retired',
      value: employeeStats.retired,
      icon: FiBriefcase,
      color: 'gray',
      trend: '+4',
      trendUp: true,
      description: 'Retired this year'
    }
  ];

  // Recent Activities
  const recentActivities = [
    {
      id: 1,
      user: 'John Doe',
      action: 'joined as Software Engineer',
      time: '5 minutes ago',
      type: 'hire',
      avatar: 'JD'
    },
    {
      id: 2,
      user: 'Jane Smith',
      action: 'requested annual leave',
      time: '1 hour ago',
      type: 'leave',
      avatar: 'JS'
    },
    {
      id: 3,
      user: 'Mike Johnson',
      action: 'submitted medical claim (2,500 ETB)',
      time: '3 hours ago',
      type: 'medical',
      avatar: 'MJ'
    },
    {
      id: 4,
      user: 'Sarah Williams',
      action: 'received written warning',
      time: '5 hours ago',
      type: 'disciplinary',
      avatar: 'SW'
    },
    {
      id: 5,
      user: 'David Lee',
      action: 'completed probation period',
      time: '1 day ago',
      type: 'promotion',
      avatar: 'DL'
    }
  ];

  // Upcoming Events
  const upcomingEvents = [
    {
      id: 1,
      title: 'Probation Review',
      employee: 'Emma Watson',
      date: '2024-03-15',
      type: 'review'
    },
    {
      id: 2,
      title: 'Contract Renewal',
      employee: 'Robert Brown',
      date: '2024-03-20',
      type: 'contract'
    },
    {
      id: 3,
      title: 'Birthday',
      employee: 'Alice Johnson',
      date: '2024-03-10',
      type: 'birthday'
    },
    {
      id: 4,
      title: 'Work Anniversary',
      employee: 'Tom Wilson',
      date: '2024-03-12',
      type: 'anniversary'
    }
  ];

  // Quick Actions
  const quickActions = [
    { id: 1, label: 'Add Employee', icon: FiUsers, path: '/hr/employees/new', color: 'primary' },
    { id: 2, label: 'Process Leave', icon: FiCalendar, path: '/hr/leave', color: 'success' },
    { id: 3, label: 'Medical Claim', icon: FiHeart, path: '/hr/medical', color: 'warning' },
    { id: 4, label: 'Generate Report', icon: FiDownload, path: '/hr/reports', color: 'info' }
  ];

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {/* Header Section */}
      <div className="dashboard-header">
        <div className="header-left">
          <h1 className="dashboard-title">HR Dashboard</h1>
          <p className="dashboard-subtitle">
            Welcome back! Here's what's happening with your employees today.
          </p>
        </div>
        <div className="header-right">
          <div className="timeframe-selector">
            <button 
              className={`timeframe-btn ${timeframe === 'week' ? 'active' : ''}`}
              onClick={() => setTimeframe('week')}
            >
              Week
            </button>
            <button 
              className={`timeframe-btn ${timeframe === 'month' ? 'active' : ''}`}
              onClick={() => setTimeframe('month')}
            >
              Month
            </button>
            <button 
              className={`timeframe-btn ${timeframe === 'year' ? 'active' : ''}`}
              onClick={() => setTimeframe('year')}
            >
              Year
            </button>
          </div>
          <button 
            className={`refresh-btn ${refreshing ? 'refreshing' : ''}`}
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <FiRefreshCw size={18} />
          </button>
        </div>
      </div>

      {/* Employee Summary Cards */}
      <div className="stats-grid">
        {statusCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.id} className={`stat-card ${card.color}`}>
              <div className="stat-card-header">
                <div className="stat-icon-wrapper">
                  <Icon size={20} />
                </div>
                {card.trend && (
                  <span className={`trend-badge ${card.trendUp ? 'up' : 'down'} ${card.trendUp === null ? 'neutral' : ''}`}>
                    {card.trend}
                  </span>
                )}
              </div>
              <div className="stat-card-body">
                <h3 className="stat-value">{card.value.toLocaleString()}</h3>
                <p className="stat-title">{card.title}</p>
                <p className="stat-description">{card.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts and Activities Grid */}
      <div className="dashboard-grid">
        {/* Employee Distribution */}
        <div className="grid-card distribution-card">
          <div className="card-header">
            <h3 className="card-title">Employee Distribution</h3>
            <button className="card-menu">
              <FiMoreVertical size={18} />
            </button>
          </div>
          <div className="card-body">
            <div className="distribution-chart">
              <div className="chart-legend">
                <div className="legend-item">
                  <span className="legend-color active"></span>
                  <span className="legend-label">Active (63%)</span>
                </div>
                <div className="legend-item">
                  <span className="legend-color probation"></span>
                  <span className="legend-label">Probation (8%)</span>
                </div>
                <div className="legend-item">
                  <span className="legend-color new"></span>
                  <span className="legend-label">New Hires (3%)</span>
                </div>
                <div className="legend-item">
                  <span className="legend-color notice"></span>
                  <span className="legend-label">Notice (2%)</span>
                </div>
                <div className="legend-item">
                  <span className="legend-color ended"></span>
                  <span className="legend-label">Contract Ended (5%)</span>
                </div>
                <div className="legend-item">
                  <span className="legend-color resigned"></span>
                  <span className="legend-label">Resigned (4%)</span>
                </div>
                <div className="legend-item">
                  <span className="legend-color retired"></span>
                  <span className="legend-label">Retired (15%)</span>
                </div>
              </div>
              <div className="distribution-bars">
                <div className="bar-container">
                  <div className="bar active" style={{ width: '63%' }}></div>
                </div>
                <div className="bar-container">
                  <div className="bar probation" style={{ width: '8%' }}></div>
                </div>
                <div className="bar-container">
                  <div className="bar new" style={{ width: '3%' }}></div>
                </div>
                <div className="bar-container">
                  <div className="bar notice" style={{ width: '2%' }}></div>
                </div>
                <div className="bar-container">
                  <div className="bar ended" style={{ width: '5%' }}></div>
                </div>
                <div className="bar-container">
                  <div className="bar resigned" style={{ width: '4%' }}></div>
                </div>
                <div className="bar-container">
                  <div className="bar retired" style={{ width: '15%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid-card quick-actions-card">
          <div className="card-header">
            <h3 className="card-title">Quick Actions</h3>
            <Link to="/hr/employees" className="view-all-link">View All</Link>
          </div>
          <div className="card-body">
            <div className="actions-grid">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <Link 
                    key={action.id} 
                    to={action.path}
                    className={`action-item ${action.color}`}
                  >
                    <div className="action-icon-wrapper">
                      <Icon size={24} />
                    </div>
                    <span className="action-label">{action.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid-card activity-card">
          <div className="card-header">
            <h3 className="card-title">Recent Activity</h3>
            <Link to="/hr/activity" className="view-all-link">View All</Link>
          </div>
          <div className="card-body">
            <div className="activity-feed">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="activity-item">
                  <div className={`activity-avatar ${activity.type}`}>
                    {activity.avatar}
                  </div>
                  <div className="activity-content">
                    <p className="activity-text">
                      <span className="activity-user">{activity.user}</span>{' '}
                      {activity.action}
                    </p>
                    <span className="activity-time">{activity.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="grid-card events-card">
          <div className="card-header">
            <h3 className="card-title">Upcoming Events</h3>
            <Link to="/hr/calendar" className="view-all-link">View Calendar</Link>
          </div>
          <div className="card-body">
            <div className="events-list">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="event-item">
                  <div className={`event-icon ${event.type}`}>
                    {event.type === 'review' && <FiClock />}
                    {event.type === 'contract' && <FiBriefcase />}
                    {event.type === 'birthday' && <FiAward />}
                    {event.type === 'anniversary' && <FiTrendingUp />}
                  </div>
                  <div className="event-details">
                    <p className="event-title">{event.title}</p>
                    <p className="event-employee">{event.employee}</p>
                    <span className="event-date">
                      {new Date(event.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics Footer */}
      <div className="metrics-footer">
        <div className="metric-item">
          <span className="metric-label">Attendance Rate</span>
          <span className="metric-value">96%</span>
        </div>
        <div className="metric-item">
          <span className="metric-label">Leave Utilization</span>
          <span className="metric-value">42%</span>
        </div>
        <div className="metric-item">
          <span className="metric-label">Medical Claims</span>
          <span className="metric-value">34</span>
        </div>
        <div className="metric-item">
          <span className="metric-label">Open Disciplinary</span>
          <span className="metric-value">5</span>
        </div>
        <div className="metric-item">
          <span className="metric-label">Active Guarantees</span>
          <span className="metric-value">23</span>
        </div>
      </div>
    </div>
  );
};

export default HRDashboard;