// contexts/DashboardContext.jsx
import React, { createContext, useContext, useState, useCallback } from 'react';

// Create the context
const DashboardContext = createContext();

// Custom hook to use the dashboard context
export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};

// Dashboard Provider Component
export const DashboardProvider = ({ children }) => {
  console.log('🚀 [DashboardContext] Component mounted');
  
  const [dashboardStats, setDashboardStats] = useState({
    activeForms: 0,
    formsSent: 0,
    pendingSubmissions: 0,
    completedSubmissions: 0,
    completionRate: 0
  });
  
  const [submissionProgress, setSubmissionProgress] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  console.log('📊 [DashboardContext] Initial state:', {
    dashboardStats,
    submissionProgress: submissionProgress.length,
    recentActivities: recentActivities.length,
    isLoading,
    error,
    lastUpdated
  });

  // Frappe API fetch function
  const frappeFetch = useCallback(async (endpoint, options = {}) => {
    console.log('🌐 [frappeFetch] Making request to:', endpoint);
    console.log('⚙️ [frappeFetch] Options:', options);
    
    const defaultOptions = {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      ...options
    };

    try {
      console.log('📤 [frappeFetch] Sending request...');
      const response = await fetch(endpoint, defaultOptions);
      console.log('📥 [frappeFetch] Response status:', response.status);
      console.log('📥 [frappeFetch] Response ok:', response.ok);
      
      if (!response.ok) {
        console.error('❌ [frappeFetch] Response not OK');
        const errorData = await response.json().catch(() => {
          console.warn('⚠️ [frappeFetch] Could not parse error JSON');
          return {};
        });
        console.error('❌ [frappeFetch] Error data:', errorData);
        throw new Error(errorData.message || `API Error: ${response.status}`);
      }
      
      console.log('✅ [frappeFetch] Request successful, parsing JSON...');
      const data = await response.json();
      console.log('✅ [frappeFetch] Parsed data keys:', Object.keys(data));
      return data;
    } catch (fetchError) {
      console.error('💥 [frappeFetch] Fetch error:', fetchError.message);
      throw fetchError;
    }
  }, []);

  // Fetch Reporting Forms
  const fetchReportingForms = useCallback(async (filters = {}) => {
    console.log('📋 [fetchReportingForms] Starting...');
    console.log('🔍 [fetchReportingForms] Filters:', filters);
    
    const filterArray = Object.entries(filters).map(([key, value]) => [key, '=', value]);
    const params = new URLSearchParams({
      fields: JSON.stringify(['name', 'status', 'reporting_period', 'year', 'modified', 'title', 'creation']),
      filters: JSON.stringify(filterArray),
      limit: '0',
      order_by: 'modified desc'
    });
    
    const endpoint = `/api/resource/Reporting Form?${params.toString()}`;
    console.log('🎯 [fetchReportingForms] Endpoint:', endpoint);
    
    const result = await frappeFetch(endpoint);
    console.log('✅ [fetchReportingForms] Success! Data count:', result.data?.length || 0);
    console.log('📝 [fetchReportingForms] First 3 items:', result.data?.slice(0, 3));
    
    return result;
  }, [frappeFetch]);

  // Fetch Projects
  const fetchProjects = useCallback(async () => {
    console.log('🏗️ [fetchProjects] Starting...');
    
    const params = new URLSearchParams({
      fields: JSON.stringify(['name', 'project_name', 'status', 'modified', 'project_manager', 'creation']),
      limit: '0'
    });
    
    const endpoint = `/api/resource/Project?${params.toString()}`;
    console.log('🎯 [fetchProjects] Endpoint:', endpoint);
    
    const result = await frappeFetch(endpoint);
    console.log('✅ [fetchProjects] Success! Data count:', result.data?.length || 0);
    console.log('📝 [fetchProjects] First 3 items:', result.data?.slice(0, 3));
    
    return result;
  }, [frappeFetch]);

  // Fetch Project Report Submissions
  const fetchProjectReportSubmissions = useCallback(async () => {
    console.log('📄 [fetchProjectReportSubmissions] Starting...');
    
    const params = new URLSearchParams({
      fields: JSON.stringify([
        'name', 
        'project', 
        'reporting_form', 
        'status', 
        'submission_date', 
        'modified',
        'creation',
        'owner'
      ]),
      limit: '0',
      order_by: 'modified desc'
    });
    
    const endpoint = `/api/resource/Project Report Submission?${params.toString()}`;
    console.log('🎯 [fetchProjectReportSubmissions] Endpoint:', endpoint);
    
    const result = await frappeFetch(endpoint);
    console.log('✅ [fetchProjectReportSubmissions] Success! Data count:', result.data?.length || 0);
    console.log('📝 [fetchProjectReportSubmissions] First 3 items:', result.data?.slice(0, 3));
    
    return result;
  }, [frappeFetch]);

  // Calculate dashboard statistics
  const calculateStats = useCallback((forms, submissions) => {
    console.log('🧮 [calculateStats] Calculating...');
    console.log('📊 [calculateStats] Forms count:', forms.length);
    console.log('📊 [calculateStats] Submissions count:', submissions.length);
    
    const activeForms = forms.filter(form => form.status === 'Active').length;
    const totalForms = forms.length;
    
    const completedSubmissions = submissions.filter(sub => sub.status === 'Completed').length;
    const pendingSubmissions = submissions.filter(sub => sub.status === 'Pending').length;
    const totalSubmissions = completedSubmissions + pendingSubmissions;
    
    const completionRate = totalSubmissions > 0 
      ? Math.round((completedSubmissions / totalSubmissions) * 100) 
      : 0;

    console.log('📈 [calculateStats] Results:', {
      activeForms,
      totalForms,
      completedSubmissions,
      pendingSubmissions,
      completionRate
    });

    return {
      activeForms,
      formsSent: totalForms,
      pendingSubmissions,
      completedSubmissions,
      completionRate
    };
  }, []);

  // Process submission progress data
  const processSubmissionProgress = useCallback((projects, submissions) => {
    console.log('📈 [processSubmissionProgress] Processing...');
    console.log('🏗️ [processSubmissionProgress] Projects count:', projects.length);
    console.log('📄 [processSubmissionProgress] Submissions count:', submissions.length);
    
    // Get project submission counts
    const projectSubmissionCounts = projects.map(project => {
      const projectSubmissions = submissions.filter(sub => sub.project === project.name);
      const completed = projectSubmissions.filter(sub => sub.status === 'Completed').length;
      const total = projectSubmissions.length;
      const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
      
      return {
        name: project.project_name || project.name,
        completionRate,
        totalSubmissions: total,
        completed,
        projectId: project.name
      };
    });

    console.log('🔢 [processSubmissionProgress] Project completion rates:', 
      projectSubmissionCounts.map(p => ({ name: p.name, rate: p.completionRate }))
    );

    // Sort by completion rate (descending) and take top 5
    const sorted = projectSubmissionCounts
      .sort((a, b) => b.completionRate - a.completionRate)
      .slice(0, 5);

    console.log('🏆 [processSubmissionProgress] Top 5 projects:', sorted);
    return sorted;
  }, []);

  // Process recent activities
  const processRecentActivities = useCallback((forms, submissions, projects) => {
    console.log('📋 [processRecentActivities] Processing...');
    console.log('📝 [processRecentActivities] Forms count:', forms.length);
    console.log('📄 [processRecentActivities] Submissions count:', submissions.length);
    console.log('🏗️ [processRecentActivities] Projects count:', projects.length);
    
    const activities = [];

    // Add recent form activities
    const recentForms = forms.slice(0, 3);
    console.log('📋 [processRecentActivities] Recent forms:', recentForms.length);
    
    recentForms.forEach((form, index) => {
      console.log(`📋 [processRecentActivities] Processing form ${index + 1}:`, form.name);
      activities.push({
        id: `form-${form.name}`,
        project: 'System',
        action: `Form "${form.title || form.name}" was ${form.status === 'Draft' ? 'created' : 'updated'}`,
        time: formatTimeAgo(form.modified || form.creation),
        type: 'form',
        rawDate: form.modified || form.creation
      });
    });

    // Add recent submission activities
    const recentSubmissions = submissions.slice(0, 4);
    console.log('📄 [processRecentActivities] Recent submissions:', recentSubmissions.length);
    
    recentSubmissions.forEach((submission, index) => {
      console.log(`📄 [processRecentActivities] Processing submission ${index + 1}:`, submission.name);
      const project = projects.find(p => p.name === submission.project);
      const projectName = project?.project_name || submission.project || 'Unknown Project';
      
      activities.push({
        id: `submission-${submission.name}`,
        project: projectName,
        action: `Submitted ${submission.status === 'Completed' ? 'completed' : 'started'} report`,
        time: formatTimeAgo(submission.modified || submission.creation),
        type: submission.status === 'Completed' ? 'submission' : 'pending',
        rawDate: submission.modified || submission.creation
      });
    });

    console.log('📋 [processRecentActivities] All activities before sorting:', activities.length);
    
    // Sort by time (most recent first) and take 5
    const sortedActivities = activities
      .sort((a, b) => {
        const dateA = new Date(a.rawDate);
        const dateB = new Date(b.rawDate);
        return dateB - dateA;
      })
      .slice(0, 5);

    console.log('📋 [processRecentActivities] Final sorted activities:', sortedActivities);
    return sortedActivities.map(({ rawDate, ...activity }) => activity); // Remove rawDate
  }, []);

  // Helper: Format time ago
  const formatTimeAgo = (dateString) => {
    if (!dateString) {
      console.warn('⚠️ [formatTimeAgo] No date string provided');
      return 'Recently';
    }
    
    console.log('⏰ [formatTimeAgo] Formatting:', dateString);
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    let result;
    if (diffMins < 1) result = 'Just now';
    else if (diffMins < 60) result = `${diffMins} ${diffMins === 1 ? 'minute' : 'minutes'} ago`;
    else if (diffHours < 24) result = `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
    else if (diffDays < 7) result = `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
    else result = date.toLocaleDateString();

    console.log('⏰ [formatTimeAgo] Result:', result);
    return result;
  };

  // Main function to fetch all dashboard data
  const fetchDashboardData = useCallback(async () => {
    console.log('🚀 [fetchDashboardData] Starting dashboard data fetch...');
    console.log('⏳ [fetchDashboardData] Setting loading state...');
    setIsLoading(true);
    setError(null);

    try {
      console.log('🔄 [fetchDashboardData] Fetching all data in parallel...');
      
      // Fetch data in parallel
      const [formsResponse, projectsResponse, submissionsResponse] = await Promise.all([
        fetchReportingForms(),
        fetchProjects(),
        fetchProjectReportSubmissions()
      ]);

      console.log('✅ [fetchDashboardData] All data fetched successfully');
      
      const forms = formsResponse.data || [];
      const projects = projectsResponse.data || [];
      const submissions = submissionsResponse.data || [];

      console.log('📊 [fetchDashboardData] Data counts:', {
        forms: forms.length,
        projects: projects.length,
        submissions: submissions.length
      });

      // Calculate and set statistics
      console.log('🧮 [fetchDashboardData] Calculating stats...');
      const stats = calculateStats(forms, submissions);
      console.log('✅ [fetchDashboardData] Stats calculated:', stats);
      setDashboardStats(stats);

      // Process and set submission progress
      console.log('📈 [fetchDashboardData] Processing submission progress...');
      const progress = processSubmissionProgress(projects, submissions);
      console.log('✅ [fetchDashboardData] Progress calculated:', progress);
      setSubmissionProgress(progress);

      // Process and set recent activities
      console.log('📋 [fetchDashboardData] Processing recent activities...');
      const activities = processRecentActivities(forms, submissions, projects);
      console.log('✅ [fetchDashboardData] Activities calculated:', activities);
      setRecentActivities(activities);

      // Update last updated timestamp
      const now = new Date().toISOString();
      console.log('🕒 [fetchDashboardData] Setting last updated:', now);
      setLastUpdated(now);

      console.log('🎉 [fetchDashboardData] Dashboard data updated successfully!');

    } catch (error) {
      console.error('💥 [fetchDashboardData] Error:', error);
      console.error('💥 [fetchDashboardData] Error stack:', error.stack);
      setError(error.message);
      
      // Fallback to mock data in development
      if (process.env.NODE_ENV === 'development') {
        console.warn('⚠️ [fetchDashboardData] Falling back to mock data');
        
        const mockStats = {
          activeForms: 12,
          formsSent: 45,
          pendingSubmissions: 18,
          completedSubmissions: 27,
          completionRate: 60
        };
        console.log('🔄 [fetchDashboardData] Setting mock stats:', mockStats);
        setDashboardStats(mockStats);

        const mockProgress = [
          { name: 'Project A', completionRate: 75, totalSubmissions: 8 },
          { name: 'Project B', completionRate: 90, totalSubmissions: 10 },
          { name: 'Project C', completionRate: 45, totalSubmissions: 5 },
          { name: 'Project D', completionRate: 60, totalSubmissions: 6 },
        ];
        console.log('🔄 [fetchDashboardData] Setting mock progress:', mockProgress);
        setSubmissionProgress(mockProgress);

        const mockActivities = [
          { id: 1, project: 'Ethio Telecom Network Upgrade', action: 'submitted Monthly Report', time: '2 hours ago', type: 'submission' },
          { id: 2, project: 'Addis Ababa Smart City', action: 'received Site Inspection form', time: '4 hours ago', type: 'pending' },
          { id: 3, project: 'OMO II Hydroelectric', action: 'submitted Safety Checklist', time: '1 day ago', type: 'submission' },
          { id: 4, project: 'Dire Dawa Industrial Park', action: 'reminder sent for Weekly Report', time: '2 days ago', type: 'form' },
        ];
        console.log('🔄 [fetchDashboardData] Setting mock activities:', mockActivities);
        setRecentActivities(mockActivities);
      }
    } finally {
      console.log('🏁 [fetchDashboardData] Clearing loading state');
      setIsLoading(false);
      console.log('✅ [fetchDashboardData] Completed');
    }
  }, [
    fetchReportingForms, 
    fetchProjects, 
    fetchProjectReportSubmissions, 
    calculateStats, 
    processSubmissionProgress, 
    processRecentActivities
  ]);

  // Refresh dashboard data
  const refreshDashboard = useCallback(async () => {
    console.log('🔄 [refreshDashboard] Manual refresh triggered');
    console.log('⏳ [refreshDashboard] Current loading state:', isLoading);
    
    if (isLoading) {
      console.warn('⚠️ [refreshDashboard] Already loading, skipping');
      return;
    }
    
    await fetchDashboardData();
    console.log('✅ [refreshDashboard] Refresh completed');
  }, [fetchDashboardData, isLoading]);

  // Value to be provided by context
  const value = {
    dashboardStats,
    submissionProgress,
    recentActivities,
    isLoading,
    error,
    lastUpdated,
    fetchDashboardData,
    refreshDashboard
  };

  console.log('🎯 [DashboardContext] Providing value:', {
    dashboardStats,
    submissionProgressCount: submissionProgress.length,
    recentActivitiesCount: recentActivities.length,
    isLoading,
    error,
    lastUpdated
  });

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};