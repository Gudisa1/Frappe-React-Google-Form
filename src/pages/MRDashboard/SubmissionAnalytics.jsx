import React, { useMemo, useState } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ScatterChart,
  Scatter,
  ZAxis
} from 'recharts';
import "./SubmissionAnalytics.css";

const COLORS = {
  approved: '#4ade80',
  pending: '#fbbf24',
  rejected: '#f87171',
  draft: '#9ca3af',
  primary: '#4a9eff',
  secondary: '#a78bfa',
  success: '#34d399',
  warning: '#fbbf24',
  danger: '#f87171',
  info: '#60a5fa',
  chart: ['#4a9eff', '#a78bfa', '#fbbf24', '#f87171', '#34d399', '#f472b6', '#94a3b8']
};

const SubmissionAnalytics = ({ submissions, selectedSubmission = null }) => {
  const [chartType, setChartType] = useState('overview');
  const [timeRange, setTimeRange] = useState('all');

  // Calculate analytics based on submissions
  const analytics = useMemo(() => {
    if (!submissions || submissions.length === 0) return null;

    // Status distribution
    const statusCount = submissions.reduce((acc, sub) => {
      const status = sub.status?.toLowerCase() || 'unknown';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    const statusData = Object.entries(statusCount).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value
    }));

    // Form type distribution
    const formCount = submissions.reduce((acc, sub) => {
      const form = sub.reporting_form || 'Unknown';
      acc[form] = (acc[form] || 0) + 1;
      return acc;
    }, {});

    const formData = Object.entries(formCount)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10); // Top 10 forms

    // Project distribution
    const projectCount = submissions.reduce((acc, sub) => {
      const project = sub.project || 'Unknown';
      acc[project] = (acc[project] || 0) + 1;
      return acc;
    }, {});

    const projectData = Object.entries(projectCount)
      .map(([name, submissions]) => ({ name, submissions }))
      .sort((a, b) => b.submissions - a.submissions)
      .slice(0, 10);

    // Submissions over time
    const submissionsByDate = submissions.reduce((acc, sub) => {
      if (sub.creation) {
        const date = new Date(sub.creation).toLocaleDateString();
        acc[date] = (acc[date] || 0) + 1;
      }
      return acc;
    }, {});

    const timelineData = Object.entries(submissionsByDate)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    // Submitter activity
    const submitterCount = submissions.reduce((acc, sub) => {
      const submitter = sub.submitted_by || sub.owner || 'Unknown';
      acc[submitter] = (acc[submitter] || 0) + 1;
      return acc;
    }, {});

    const submitterData = Object.entries(submitterCount)
      .map(([name, submissions]) => ({ name, submissions }))
      .sort((a, b) => b.submissions - a.submissions)
      .slice(0, 10);

    // Data field analysis (if we have parsed data)
    const fieldStats = {};
    let totalFields = 0;
    let totalValues = 0;

    submissions.forEach(sub => {
      if (sub.parsedData) {
        Object.entries(sub.parsedData).forEach(([key, value]) => {
          if (!fieldStats[key]) {
            fieldStats[key] = { count: 0, total: 0, values: [] };
          }
          fieldStats[key].count++;
          if (typeof value === 'number') {
            fieldStats[key].total += value;
            fieldStats[key].values.push(value);
          }
        });
      }
    });

    // Calculate averages for numeric fields
    const fieldAverages = Object.entries(fieldStats)
      .filter(([_, stats]) => stats.count > 0)
      .map(([name, stats]) => ({
        name,
        average: stats.total / stats.count,
        count: stats.count,
        total: stats.total
      }))
      .sort((a, b) => b.average - a.average)
      .slice(0, 15);

    return {
      statusData,
      formData,
      projectData,
      timelineData,
      submitterData,
      fieldAverages,
      totalSubmissions: submissions.length,
      uniqueForms: Object.keys(formCount).length,
      uniqueProjects: Object.keys(projectCount).length,
      uniqueSubmitters: Object.keys(submitterCount).length,
      completionRate: (statusCount.approved || 0) / submissions.length * 100 || 0
    };
  }, [submissions]);

  // If analyzing a single submission
  const singleSubmissionAnalysis = useMemo(() => {
    if (!selectedSubmission || !selectedSubmission.parsedData) return null;

    const data = selectedSubmission.parsedData;
    
    // Categorize fields
    const categories = {
      enrollment: {},
      promotion: {},
      supplies: {},
      special: {},
      other: {}
    };

    Object.entries(data).forEach(([key, value]) => {
      if (typeof value === 'number') {
        if (key.includes('kg') || key.includes('grade') || key.includes('college') || key.includes('university')) {
          if (key.includes('promoted')) {
            categories.promotion[key] = value;
          } else {
            categories.enrollment[key] = value;
          }
        } else if (key.includes('support') || key.includes('notebook') || key.includes('pen')) {
          categories.supplies[key] = value;
        } else if (key.includes('special') || key.includes('tutorial') || key.includes('sunday')) {
          categories.special[key] = value;
        } else {
          categories.other[key] = value;
        }
      }
    });

    // Create comparison data
    const enrollmentComparison = [
      { name: 'KG', boys: data.kg_boys || 0, girls: data.kg_girls || 0 },
      { name: 'Grade 1-8', boys: data.grade1_8_boys || 0, girls: data.grade1_8_girls || 0 },
      { name: 'Grade 9-12', boys: data.grade9_12_boys || 0, girls: data.grade9_12_girls || 0 },
      { name: 'Higher Ed', value: (data.college_students || 0) + (data.university_students || 0) }
    ];

    const promotionRates = [
      { name: 'KG', rate: data.kg_promoted ? (data.kg_promoted / data.kg_total * 100).toFixed(1) : 0 },
      { name: 'Grade 1-8', rate: data.grade1_8_promoted ? (data.grade1_8_promoted / data.grade1_8_total * 100).toFixed(1) : 0 },
      { name: 'Grade 9-12', rate: data.grade9_12_promoted ? (data.grade9_12_promoted / data.grade9_12_total * 100).toFixed(1) : 0 }
    ];

    const suppliesData = [
      { name: 'Notebooks', value: data.notebook_support || 0 },
      { name: 'Pens', value: data.pen_support || 0 },
      { name: 'Pencils', value: data.pencil_support || 0 },
      { name: 'Rulers', value: data.ruler_support || 0 },
      { name: 'Books', value: data.books_support || 0 },
      { name: 'Bags', value: data.bag_support || 0 },
      { name: 'Uniforms', value: data.uniform_support || 0 }
    ].filter(item => item.value > 0);

    return {
      enrollmentComparison,
      promotionRates,
      suppliesData,
      categories
    };
  }, [selectedSubmission]);

  if (!analytics) {
    return (
      <div className="analytics-container">
        <div className="no-data-message">
          <svg className="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <h3>No Data Available</h3>
          <p>Submit some data to see insightful analytics and charts</p>
        </div>
      </div>
    );
  }

  return (
    <div className="analytics-container">
      {/* Header with KPIs */}
      <div className="analytics-header">
        <h2 className="analytics-title">Analytics Dashboard</h2>
        <div className="kpi-grid">
          <div className="kpi-card">
            <span className="kpi-label">Total Submissions</span>
            <span className="kpi-value">{analytics.totalSubmissions}</span>
          </div>
          <div className="kpi-card">
            <span className="kpi-label">Active Forms</span>
            <span className="kpi-value">{analytics.uniqueForms}</span>
          </div>
          <div className="kpi-card">
            <span className="kpi-label">Active Projects</span>
            <span className="kpi-value">{analytics.uniqueProjects}</span>
          </div>
          <div className="kpi-card">
            <span className="kpi-label">Submitters</span>
            <span className="kpi-value">{analytics.uniqueSubmitters}</span>
          </div>
          <div className="kpi-card">
            <span className="kpi-label">Completion Rate</span>
            <span className="kpi-value">{analytics.completionRate.toFixed(1)}%</span>
          </div>
        </div>
      </div>

      {/* Chart Type Selector */}
      <div className="chart-type-selector">
        <button 
          className={`chart-type-btn ${chartType === 'overview' ? 'active' : ''}`}
          onClick={() => setChartType('overview')}
        >
          Overview
        </button>
        <button 
          className={`chart-type-btn ${chartType === 'distribution' ? 'active' : ''}`}
          onClick={() => setChartType('distribution')}
        >
          Distributions
        </button>
        <button 
          className={`chart-type-btn ${chartType === 'trends' ? 'active' : ''}`}
          onClick={() => setChartType('trends')}
        >
          Trends
        </button>
        <button 
          className={`chart-type-btn ${chartType === 'fields' ? 'active' : ''}`}
          onClick={() => setChartType('fields')}
        >
          Field Analysis
        </button>
      </div>

      {/* Charts Grid */}
      <div className="charts-grid">
        {chartType === 'overview' && (
          <>
            {/* Status Distribution Pie Chart */}
            <div className="chart-card">
              <h3 className="chart-title">Status Distribution</h3>
              <div className="chart-container">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={analytics.statusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {analytics.statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS.chart[index % COLORS.chart.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        background: '#1a1a1a', 
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '8px',
                        color: '#fff'
                      }} 
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Top Forms Bar Chart */}
            <div className="chart-card">
              <h3 className="chart-title">Top Forms by Submissions</h3>
              <div className="chart-container">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analytics.formData} layout="vertical" margin={{ left: 100 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis type="number" stroke="#888" />
                    <YAxis type="category" dataKey="name" stroke="#888" width={90} />
                    <Tooltip 
                      contentStyle={{ background: '#1a1a1a', border: 'none', borderRadius: '8px' }}
                      itemStyle={{ color: '#fff' }}
                    />
                    <Bar dataKey="count" fill={COLORS.primary} radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Submissions Timeline */}
            <div className="chart-card wide">
              <h3 className="chart-title">Submissions Over Time</h3>
              <div className="chart-container">
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={analytics.timelineData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="date" stroke="#888" />
                    <YAxis stroke="#888" />
                    <Tooltip 
                      contentStyle={{ background: '#1a1a1a', border: 'none', borderRadius: '8px' }}
                      itemStyle={{ color: '#fff' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="count" 
                      stroke={COLORS.primary} 
                      fill={COLORS.primary} 
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}

        {chartType === 'distribution' && (
          <>
            {/* Project Distribution */}
            <div className="chart-card">
              <h3 className="chart-title">Submissions by Project</h3>
              <div className="chart-container">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={analytics.projectData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="submissions"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {analytics.projectData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS.chart[index % COLORS.chart.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ background: '#1a1a1a', border: 'none', borderRadius: '8px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Submitter Activity */}
            <div className="chart-card">
              <h3 className="chart-title">Top Submitters</h3>
              <div className="chart-container">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analytics.submitterData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="name" stroke="#888" angle={-45} textAnchor="end" height={80} />
                    <YAxis stroke="#888" />
                    <Tooltip 
                      contentStyle={{ background: '#1a1a1a', border: 'none', borderRadius: '8px' }}
                    />
                    <Bar dataKey="submissions" fill={COLORS.secondary} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}

        {chartType === 'fields' && (
          <>
            {/* Average Field Values */}
            <div className="chart-card wide">
              <h3 className="chart-title">Top 15 Average Field Values</h3>
              <div className="chart-container">
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={analytics.fieldAverages} margin={{ bottom: 100 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis 
                      dataKey="name" 
                      stroke="#888" 
                      angle={-45} 
                      textAnchor="end" 
                      height={100}
                      interval={0}
                    />
                    <YAxis stroke="#888" />
                    <Tooltip 
                      contentStyle={{ background: '#1a1a1a', border: 'none', borderRadius: '8px' }}
                      formatter={(value) => [value.toFixed(2), 'Average']}
                    />
                    <Bar dataKey="average" fill={COLORS.success} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Field Occurrence Heat Map (simplified as bar chart) */}
            <div className="chart-card wide">
              <h3 className="chart-title">Field Occurrence Frequency</h3>
              <div className="chart-container">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analytics.fieldAverages.slice(0, 10)}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="name" stroke="#888" angle={-45} textAnchor="end" height={80} />
                    <YAxis stroke="#888" />
                    <Tooltip 
                      contentStyle={{ background: '#1a1a1a', border: 'none', borderRadius: '8px' }}
                      formatter={(value, name, props) => {
                        if (name === 'count') return [value, 'Occurrences'];
                        return [value, name];
                      }}
                    />
                    <Bar dataKey="count" fill={COLORS.info} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}

        {chartType === 'trends' && (
          <>
            {/* Cumulative Submissions */}
            <div className="chart-card wide">
              <h3 className="chart-title">Cumulative Growth</h3>
              <div className="chart-container">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={analytics.timelineData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="date" stroke="#888" />
                    <YAxis stroke="#888" />
                    <Tooltip 
                      contentStyle={{ background: '#1a1a1a', border: 'none', borderRadius: '8px' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="count" 
                      stroke={COLORS.warning} 
                      strokeWidth={2}
                      dot={{ fill: COLORS.warning, strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Single Submission Analysis */}
      {singleSubmissionAnalysis && (
        <div className="single-submission-analytics">
          <h3 className="analytics-subtitle">Current Submission Analysis</h3>
          <div className="charts-grid">
            {/* Gender Distribution */}
            <div className="chart-card">
              <h3 className="chart-title">Enrollment by Gender</h3>
              <div className="chart-container">
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={singleSubmissionAnalysis.enrollmentComparison.slice(0, 3)}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="name" stroke="#888" />
                    <YAxis stroke="#888" />
                    <Tooltip 
                      contentStyle={{ background: '#1a1a1a', border: 'none', borderRadius: '8px' }}
                    />
                    <Legend />
                    <Bar dataKey="boys" fill={COLORS.primary} />
                    <Bar dataKey="girls" fill={COLORS.secondary} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Promotion Rates */}
            <div className="chart-card">
              <h3 className="chart-title">Promotion Rates (%)</h3>
              <div className="chart-container">
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={singleSubmissionAnalysis.promotionRates}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="name" stroke="#888" />
                    <YAxis stroke="#888" domain={[0, 100]} />
                    <Tooltip 
                      contentStyle={{ background: '#1a1a1a', border: 'none', borderRadius: '8px' }}
                      formatter={(value) => [`${value}%`, 'Promotion Rate']}
                    />
                    <Bar dataKey="rate" fill={COLORS.success} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Supplies Distribution */}
            {singleSubmissionAnalysis.suppliesData.length > 0 && (
              <div className="chart-card">
                <h3 className="chart-title">School Supplies</h3>
                <div className="chart-container">
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={singleSubmissionAnalysis.suppliesData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {singleSubmissionAnalysis.suppliesData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS.chart[index % COLORS.chart.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ background: '#1a1a1a', border: 'none', borderRadius: '8px' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SubmissionAnalytics;