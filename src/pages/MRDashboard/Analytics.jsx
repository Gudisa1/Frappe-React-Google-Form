// pages/MRDashboard/Analytics.jsx
import React, { useState } from 'react';
import {
  Card,
  Flex,
  Text,
  Heading,
  Button,
  Container,
  Separator,
  Tabs,
  Select,
  Badge,
  Table
} from '@radix-ui/themes';
import {
  BarChartIcon,
  ActivityLogIcon,
  PieChartIcon,
  CalendarIcon,
  DownloadIcon,
  MixerHorizontalIcon ,
  ArrowDownIcon ,
  ClockIcon,
  CheckCircledIcon,
  ExclamationTriangleIcon
} from '@radix-ui/react-icons';
import Navigation from '../../components/Navigation';
import './Analytics.css';

const Analytics = () => {
  const [dateRange, setDateRange] = useState('month');
  const [selectedProject, setSelectedProject] = useState('all');
  const [selectedRegion, setSelectedRegion] = useState('all');

  // Mock data - completion rates by project
  const completionData = [
    { project: 'Ethio Telecom Network Upgrade', region: 'Addis Ababa', completion: 92, submissions: 45, onTime: 41, late: 4 },
    { project: 'Addis Ababa Smart City', region: 'Addis Ababa', completion: 88, submissions: 38, onTime: 33, late: 5 },
    { project: 'OMO II Hydroelectric', region: 'SNNPR', completion: 96, submissions: 52, onTime: 50, late: 2 },
    { project: 'Dire Dawa Industrial Park', region: 'Dire Dawa', completion: 75, submissions: 24, onTime: 18, late: 6 },
    { project: 'Hawassa Textile Factory', region: 'SNNPR', completion: 94, submissions: 32, onTime: 30, late: 2 },
    { project: 'Bahir Dar University Expansion', region: 'Amhara', completion: 89, submissions: 28, onTime: 25, late: 3 },
    { project: 'Mekelle Airport Renovation', region: 'Tigray', completion: 45, submissions: 12, onTime: 5, late: 7 },
    { project: 'Gondar Hospital Construction', region: 'Amhara', completion: 98, submissions: 40, onTime: 39, late: 1 },
  ];

  // Mock data - monthly trends
  const trendData = [
    { month: 'Jan', submissions: 120, completion: 85, overdue: 18 },
    { month: 'Feb', submissions: 135, completion: 88, overdue: 16 },
    { month: 'Mar', submissions: 142, completion: 90, overdue: 14 },
    { month: 'Apr', submissions: 155, completion: 92, overdue: 12 },
    { month: 'May', submissions: 148, completion: 89, overdue: 16 },
    { month: 'Jun', submissions: 162, completion: 94, overdue: 10 },
  ];

  // Mock data - regional performance
  const regionalData = [
    { region: 'Addis Ababa', projects: 4, completion: 86, avgDelay: 1.2 },
    { region: 'SNNPR', projects: 3, completion: 92, avgDelay: 0.8 },
    { region: 'Amhara', projects: 2, completion: 94, avgDelay: 0.5 },
    { region: 'Dire Dawa', projects: 1, completion: 75, avgDelay: 2.8 },
    { region: 'Tigray', projects: 1, completion: 45, avgDelay: 4.5 },
  ];

  // Projects with consistent delays
  const delayedProjects = [
    { project: 'Dire Dawa Industrial Park', overdueForms: 6, avgDelay: '2.8 days', lastOnTime: '2023-12-15' },
    { project: 'Mekelle Airport Renovation', overdueForms: 7, avgDelay: '4.5 days', lastOnTime: 'Never' },
    { project: 'Addis Ababa Smart City', overdueForms: 5, avgDelay: '1.5 days', lastOnTime: '2024-01-08' },
  ];

  // Date range options
  const dateRanges = [
    { value: 'week', label: 'Last 7 days' },
    { value: 'month', label: 'Last 30 days' },
    { value: 'quarter', label: 'Last 90 days' },
    { value: 'year', label: 'Last year' },
  ];

  // Filter data
  const filteredData = selectedProject === 'all' 
    ? completionData
    : completionData.filter(item => item.project === selectedProject);

  const filteredRegionalData = selectedRegion === 'all'
    ? regionalData
    : regionalData.filter(item => item.region === selectedRegion);

  // Statistics
  const stats = {
    totalSubmissions: completionData.reduce((sum, item) => sum + item.submissions, 0),
    avgCompletion: Math.round(completionData.reduce((sum, item) => sum + item.completion, 0) / completionData.length),
    onTimeRate: Math.round((completionData.reduce((sum, item) => sum + item.onTime, 0) / completionData.reduce((sum, item) => sum + item.submissions, 0)) * 100),
    lateSubmissions: completionData.reduce((sum, item) => sum + item.late, 0),
  };

  // Get completion color
  const getCompletionColor = (percentage) => {
    if (percentage >= 90) return 'green';
    if (percentage >= 75) return 'amber';
    return 'red';
  };

  // Export data
  const exportData = (format) => {
    alert(`${format} export would be implemented with a library like Chart.js or SheetJS`);
  };

  // Render completion bar
  const renderCompletionBar = (percentage) => (
    <div className="completion-bar">
      <div 
        className="completion-fill"
        style={{ width: `${percentage}%` }}
        data-color={getCompletionColor(percentage)}
      />
    </div>
  );

  // Render trend indicator
  const renderTrendIndicator = (current, previous) => {
    const diff = current - previous;
    const isPositive = diff > 0;
    
    return (
      <Flex align="center" gap="1">
        {isPositive ? <ArrowDownIcon  color="#10b981" /> : <ArrowDownIcon  color="#ef4444" />}
        <Text size="1" color={isPositive ? "green" : "red"}>
          {isPositive ? '+' : ''}{Math.abs(diff)}%
        </Text>
      </Flex>
    );
  };

  return (
    <Navigation>
      <Container size="3" className="analytics-container">
        {/* Header */}
        <div className="analytics-header">
          <div>
            <Heading size="7">Analytics & Insights</Heading>
            <Text size="2" color="gray">High-level insights for decision-making</Text>
          </div>
          
          <Flex gap="3">
            <Button 
              variant="soft"
              onClick={() => exportData('PDF')}
            >
              <DownloadIcon /> Export Report
            </Button>
          </Flex>
        </div>

        {/* Statistics Cards */}
        <div className="stats-grid">
          <Card className="stat-card">
            <Flex direction="column" gap="2">
              <Flex align="center" gap="2">
                <CheckCircledIcon color="#10b981" />
                <Text size="2" color="gray">Average Completion</Text>
              </Flex>
              <Heading size="6" color="green">{stats.avgCompletion}%</Heading>
              {renderTrendIndicator(stats.avgCompletion, 85)}
            </Flex>
          </Card>
          
          <Card className="stat-card">
            <Flex direction="column" gap="2">
              <Flex align="center" gap="2">
                <BarChartIcon color="#3b82f6" />
                <Text size="2" color="gray">Total Submissions</Text>
              </Flex>
              <Heading size="6">{stats.totalSubmissions}</Heading>
              {renderTrendIndicator(stats.totalSubmissions, 120)}
            </Flex>
          </Card>
          
          <Card className="stat-card">
            <Flex direction="column" gap="2">
              <Flex align="center" gap="2">
                <ClockIcon color="#10b981" />
                <Text size="2" color="gray">On-Time Rate</Text>
              </Flex>
              <Heading size="6" color="green">{stats.onTimeRate}%</Heading>
              {renderTrendIndicator(stats.onTimeRate, 82)}
            </Flex>
          </Card>
          
          <Card className="stat-card">
            <Flex direction="column" gap="2">
              <Flex align="center" gap="2">
                <ExclamationTriangleIcon color="amber" />
                <Text size="2" color="gray">Late Submissions</Text>
              </Flex>
              <Heading size="6" color="amber">{stats.lateSubmissions}</Heading>
              <Text size="1" color="gray">Across all projects</Text>
            </Flex>
          </Card>
        </div>

        <Separator size="4" />

        {/* Filters */}
        <Card className="filters-card">
          <Flex justify="between" align="center" gap="4">
            <Flex gap="3">
              <div className="filter-group">
                <Text as="label" size="2" weight="medium">Date Range</Text>
                <Select.Root value={dateRange} onValueChange={setDateRange}>
                  <Select.Trigger>
                    <CalendarIcon /> {dateRanges.find(d => d.value === dateRange)?.label}
                  </Select.Trigger>
                  <Select.Content>
                    {dateRanges.map(range => (
                      <Select.Item key={range.value} value={range.value}>
                        {range.label}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Root>
              </div>
              
              <div className="filter-group">
                <Text as="label" size="2" weight="medium">Project</Text>
                <Select.Root value={selectedProject} onValueChange={setSelectedProject}>
                  <Select.Trigger>
                    <MixerHorizontalIcon  /> {selectedProject === 'all' ? 'All Projects' : selectedProject}
                  </Select.Trigger>
                  <Select.Content>
                    <Select.Item value="all">All Projects</Select.Item>
                    {completionData.map(item => (
                      <Select.Item key={item.project} value={item.project}>
                        {item.project}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Root>
              </div>
              
              <div className="filter-group">
                <Text as="label" size="2" weight="medium">Region</Text>
                <Select.Root value={selectedRegion} onValueChange={setSelectedRegion}>
                  <Select.Trigger>
                    <MixerHorizontalIcon  /> {selectedRegion === 'all' ? 'All Regions' : selectedRegion}
                  </Select.Trigger>
                  <Select.Content>
                    <Select.Item value="all">All Regions</Select.Item>
                    {regionalData.map(item => (
                      <Select.Item key={item.region} value={item.region}>
                        {item.region}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Root>
              </div>
            </Flex>
            
            <Button 
              variant="soft"
              onClick={() => {
                setDateRange('month');
                setSelectedProject('all');
                setSelectedRegion('all');
              }}
            >
              Clear Filters
            </Button>
          </Flex>
        </Card>

        {/* Charts Section */}
        <div className="charts-grid">
          {/* Completion Rates by Project */}
          <Card className="chart-card">
            <Flex direction="column" gap="4">
              <Heading size="4">
                <BarChartIcon /> Completion Rates by Project
              </Heading>
              
              <div className="chart-table">
                <div className="chart-header">
                  <Text weight="medium">Project</Text>
                  <Text weight="medium">Completion Rate</Text>
                </div>
                
                {filteredData.map((item) => (
                  <div key={item.project} className="chart-row">
                    <div className="chart-row-content">
                      <Text>{item.project}</Text>
                      <Text size="2" color="gray">{item.region}</Text>
                    </div>
                    
                    <div className="chart-row-stats">
                      <Flex align="center" gap="3">
                        {renderCompletionBar(item.completion)}
                        <Badge color={getCompletionColor(item.completion)}>
                          {item.completion}%
                        </Badge>
                      </Flex>
                      <Text size="1" color="gray" mt="1">
                        {item.submissions} total • {item.onTime} on time • {item.late} late
                      </Text>
                    </div>
                  </div>
                ))}
              </div>
            </Flex>
          </Card>

          {/* Monthly Trends */}
          <Card className="chart-card">
            <Flex direction="column" gap="4">
              <Heading size="4">
                <ActivityLogIcon /> Submission Trends
              </Heading>
              
              <div className="trend-chart">
                {trendData.map((month) => (
                  <div key={month.month} className="trend-month">
                    <div className="trend-bar">
                      <div 
                        className="trend-fill submissions"
                        style={{ height: `${(month.submissions / 200) * 100}%` }}
                      />
                      <div 
                        className="trend-fill completion"
                        style={{ height: `${month.completion}%` }}
                      />
                    </div>
                    <Text size="1" mt="2">{month.month}</Text>
                    <Text size="1" color="gray">
                      {month.submissions} subs
                    </Text>
                  </div>
                ))}
              </div>
              
              <div className="trend-legend">
                <div className="legend-item">
                  <div className="legend-color submissions" />
                  <Text size="1">Submissions</Text>
                </div>
                <div className="legend-item">
                  <div className="legend-color completion" />
                  <Text size="1">Completion %</Text>
                </div>
              </div>
            </Flex>
          </Card>

          {/* Regional Performance */}
          <Card className="chart-card">
            <Flex direction="column" gap="4">
              <Heading size="4">
                <PieChartIcon /> Regional Performance
              </Heading>
              
              <div className="regional-stats">
                {filteredRegionalData.map((region) => (
                  <div key={region.region} className="regional-item">
                    <Flex justify="between" align="center" mb="2">
                      <Text weight="medium">{region.region}</Text>
                      <Badge color={getCompletionColor(region.completion)}>
                        {region.completion}%
                      </Badge>
                    </Flex>
                    
                    <div className="regional-details">
                      <Text size="1" color="gray">
                        {region.projects} projects
                      </Text>
                      <Text size="1" color="gray">
                        Avg delay: {region.avgDelay} days
                      </Text>
                    </div>
                    
                    {renderCompletionBar(region.completion)}
                  </div>
                ))}
              </div>
            </Flex>
          </Card>

          {/* Projects with Delays */}
          <Card className="chart-card">
            <Flex direction="column" gap="4">
              <Heading size="4">
                <ExclamationTriangleIcon /> Projects with Consistent Delays
              </Heading>
              
              <div className="delayed-projects">
                {delayedProjects.map((project) => (
                  <div key={project.project} className="delayed-project">
                    <Flex justify="between" align="center" mb="2">
                      <Text weight="medium">{project.project}</Text>
                      <Badge color="red">{project.overdueForms} overdue</Badge>
                    </Flex>
                    
                    <Flex justify="between" align="center">
                      <Text size="1" color="gray">
                        Avg delay: {project.avgDelay}
                      </Text>
                      <Text size="1" color="gray">
                        Last on time: {project.lastOnTime}
                      </Text>
                    </Flex>
                    
                    <div className="delay-meter">
                      <div 
                        className="delay-fill"
                        style={{ 
                          width: `${(project.overdueForms / 10) * 100}%`,
                          opacity: project.overdueForms / 10
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Flex>
          </Card>
        </div>

        {/* Detailed Table */}
        <Card className="detailed-table-card">
          <Heading size="4" mb="4">Detailed Performance Metrics</Heading>
          
          <Table.Root>
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeaderCell>Project</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Region</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Completion Rate</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Total Submissions</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>On Time</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Late</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Performance</Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {completionData.map((item) => (
                <Table.Row key={item.project}>
                  <Table.Cell>
                    <Text weight="medium">{item.project}</Text>
                  </Table.Cell>
                  
                  <Table.Cell>
                    <Badge variant="soft">{item.region}</Badge>
                  </Table.Cell>
                  
                  <Table.Cell>
                    <Flex align="center" gap="2">
                      {renderCompletionBar(item.completion)}
                      <Text weight="medium">{item.completion}%</Text>
                    </Flex>
                  </Table.Cell>
                  
                  <Table.Cell>
                    <Text>{item.submissions}</Text>
                  </Table.Cell>
                  
                  <Table.Cell>
                    <Text color="green">{item.onTime}</Text>
                  </Table.Cell>
                  
                  <Table.Cell>
                    <Text color="red">{item.late}</Text>
                  </Table.Cell>
                  
                  <Table.Cell>
                    <Badge 
                      color={getCompletionColor(item.completion)}
                      variant="soft"
                    >
                      {item.completion >= 90 ? 'Excellent' : 
                       item.completion >= 75 ? 'Good' : 'Needs Attention'}
                    </Badge>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Card>

        {/* Insights */}
        <Card className="insights-card">
          <Heading size="4" mb="4">Key Insights</Heading>
          
          <div className="insights-list">
            <div className="insight-item positive">
              <CheckCircledIcon />
              <div>
                <Text weight="medium">Overall performance is improving</Text>
                <Text size="2" color="gray">
                  Completion rates have increased by 5% compared to last month
                </Text>
              </div>
            </div>
            
            <div className="insight-item warning">
              <ExclamationTriangleIcon />
              <div>
                <Text weight="medium">Two projects need attention</Text>
                <Text size="2" color="gray">
                  Dire Dawa Industrial Park and Mekelle Airport Renovation have consistent delays
                </Text>
              </div>
            </div>
            
            <div className="insight-item info">
              <ArrowDownIcon  />
              <div>
                <Text weight="medium">SNNPR region performing best</Text>
                <Text size="2" color="gray">
                  92% average completion rate with minimal delays
                </Text>
              </div>
            </div>
          </div>
        </Card>
      </Container>
    </Navigation>
  );
};

export default Analytics;