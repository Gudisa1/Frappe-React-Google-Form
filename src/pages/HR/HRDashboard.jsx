import React, { useState, useEffect } from 'react';
import { getEmployees } from '../../api/hrapi'; // Update the import path

const HRDashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const data = await getEmployees();
      setEmployees(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics based on current data structure
  const statistics = {
    totalEmployees: employees.length,
    activeEmployees: employees.filter(emp => emp.status === 'Active').length,
    departments: [...new Set(employees.map(emp => emp.department))].length,
    // Additional insights
    newHires: employees.filter(emp => emp.status === 'Newly Hired').length,
    employeesWithEndDate: employees.filter(emp => emp.employment_end_date).length,
    employeesWithFullName: employees.filter(emp => emp.full_name).length,
  };

  // Department distribution
  const departmentStats = employees.reduce((acc, emp) => {
    const dept = emp.department || 'Unassigned';
    acc[dept] = (acc[dept] || 0) + 1;
    return acc;
  }, {});

  // Filter employees
  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = 
      (emp.first_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (emp.last_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (emp.full_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (emp.employee_id?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (emp.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (emp.department?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    
    const matchesDepartment = filterDepartment === 'All' || emp.department === filterDepartment;
    const matchesStatus = filterStatus === 'All' || emp.status === filterStatus;
    
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  // Get unique departments for filter
  const departments = ['All', ...new Set(employees.map(emp => emp.department).filter(Boolean))];
  const statuses = ['All', ...new Set(employees.map(emp => emp.status).filter(Boolean))];

  // Handle employee actions
  const handleViewDetails = (employee) => {
    setSelectedEmployee(employee);
    setShowDetailsModal(true);
  };

  const handleEdit = (employee) => {
    setEditingEmployee({ ...employee });
    setShowEditModal(true);
  };

  const handleDelete = (employee) => {
    setSelectedEmployee(employee);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      // API call to delete employee
      // await deleteEmployee(selectedEmployee.name);
      setEmployees(employees.filter(emp => emp.name !== selectedEmployee.name));
      setShowDeleteConfirm(false);
      setSelectedEmployee(null);
    } catch (error) {
      console.error('Error deleting employee:', error);
    }
  };

  const handleUpdateEmployee = async () => {
    try {
      // API call to update employee
      // await updateEmployee(editingEmployee.name, editingEmployee);
      setEmployees(employees.map(emp => 
        emp.name === editingEmployee.name ? editingEmployee : emp
      ));
      setShowEditModal(false);
      setEditingEmployee(null);
    } catch (error) {
      console.error('Error updating employee:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading employees...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center text-red-600">
          <p className="text-xl font-semibold">Error loading dashboard</p>
          <p className="mt-2">{error}</p>
          <button 
            onClick={fetchEmployees}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">HR Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome to the employee management dashboard</p>
      </div>

      {/* Quick Insights Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <InsightCard 
          title="Total Employees" 
          value={statistics.totalEmployees}
          icon="👥"
          trend="+12% from last month"
          color="blue"
        />
        <InsightCard 
          title="Active Employees" 
          value={statistics.activeEmployees}
          icon="✅"
          trend={`${((statistics.activeEmployees / statistics.totalEmployees) * 100).toFixed(1)}% of total`}
          color="green"
        />
        <InsightCard 
          title="Departments" 
          value={statistics.departments}
          icon="🏢"
          trend="Active departments"
          color="purple"
        />
        <InsightCard 
          title="New Hires" 
          value={statistics.newHires}
          icon="🌟"
          trend="This month"
          color="orange"
        />
      </div>

      {/* Department Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Department Distribution</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Object.entries(departmentStats).map(([dept, count]) => (
              <div key={dept} className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 truncate">{dept}</p>
                <p className="text-2xl font-bold">{count}</p>
                <p className="text-xs text-gray-500">
                  {((count / employees.length) * 100).toFixed(1)}%
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Quick Stats</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Employees with end date</span>
              <span className="font-semibold">{statistics.employeesWithEndDate}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Employees with full name</span>
              <span className="font-semibold">{statistics.employeesWithFullName}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Average per department</span>
              <span className="font-semibold">
                {(employees.length / (statistics.departments || 1)).toFixed(1)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by name, ID, email, or department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="w-full md:w-48">
            <select
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
          <div className="w-full md:w-48">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Employees Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employment</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Emergency Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEmployees.map((employee) => (
                <tr key={employee.name} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium">
                          {employee.first_name?.[0]}{employee.last_name?.[0]}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {employee.full_name || `${employee.first_name} ${employee.last_name}`}
                        </div>
                        <div className="text-sm text-gray-500">ID: {employee.employee_id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{employee.email}</div>
                    <div className="text-sm text-gray-500">{employee.phone}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{employee.department || 'N/A'}</div>
                    <div className="text-sm text-gray-500">{employee.job_title}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      employee.status === 'Active' ? 'bg-green-100 text-green-800' :
                      employee.status === 'Newly Hired' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {employee.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">Start: {employee.employment_start_date}</div>
                    {employee.employment_end_date && (
                      <div className="text-sm text-gray-500">End: {employee.employment_end_date}</div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{employee.emergency_contact_name}</div>
                    <div className="text-sm text-gray-500">{employee.emergency_contact_phone}</div>
                    <div className="text-xs text-gray-400">{employee.emergency_contact_relationship}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleViewDetails(employee)}
                        className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50"
                        title="View Details"
                      >
                        👁️
                      </button>
                      <button
                        onClick={() => handleEdit(employee)}
                        className="text-green-600 hover:text-green-800 p-1 rounded hover:bg-green-50"
                        title="Edit"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDelete(employee)}
                        className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50"
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Table Footer */}
        <div className="bg-gray-50 px-6 py-4 flex justify-between items-center">
          <p className="text-sm text-gray-700">
            Showing <span className="font-medium">{filteredEmployees.length}</span> of{' '}
            <span className="font-medium">{employees.length}</span> employees
          </p>
        </div>
      </div>

      {/* View Details Modal */}
      {showDetailsModal && selectedEmployee && (
        <EmployeeDetailsModal
          employee={selectedEmployee}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedEmployee(null);
          }}
        />
      )}

      {/* Edit Modal */}
      {showEditModal && editingEmployee && (
        <EditEmployeeModal
          employee={editingEmployee}
          onClose={() => {
            setShowEditModal(false);
            setEditingEmployee(null);
          }}
          onSave={handleUpdateEmployee}
          onChange={(field, value) => {
            setEditingEmployee({ ...editingEmployee, [field]: value });
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && selectedEmployee && (
        <DeleteConfirmationModal
          employee={selectedEmployee}
          onClose={() => {
            setShowDeleteConfirm(false);
            setSelectedEmployee(null);
          }}
          onConfirm={confirmDelete}
        />
      )}
    </div>
  );
};

// Insight Card Component
const InsightCard = ({ title, value, icon, trend, color }) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600',
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm">{title}</p>
          <p className="text-3xl font-bold mt-1">{value}</p>
          <p className="text-xs text-gray-400 mt-2">{trend}</p>
        </div>
        <div className={`text-3xl ${colorClasses[color]} p-3 rounded-full`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

// Employee Details Modal
const EmployeeDetailsModal = ({ employee, onClose }) => {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-lg bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-900">Employee Details</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2 bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-lg">{employee.full_name || `${employee.first_name} ${employee.last_name}`}</h4>
            <p className="text-gray-600">ID: {employee.employee_id}</p>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm text-gray-500">Personal Information</p>
            <p><span className="font-medium">First Name:</span> {employee.first_name}</p>
            <p><span className="font-medium">Last Name:</span> {employee.last_name}</p>
            <p><span className="font-medium">Date of Birth:</span> {employee.date_of_birth}</p>
            <p><span className="font-medium">Gender:</span> {employee.gender}</p>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm text-gray-500">Contact Information</p>
            <p><span className="font-medium">Email:</span> {employee.email}</p>
            <p><span className="font-medium">Phone:</span> {employee.phone}</p>
            <p><span className="font-medium">Address:</span> {employee.address}</p>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm text-gray-500">Employment Details</p>
            <p><span className="font-medium">Department:</span> {employee.department}</p>
            <p><span className="font-medium">Job Title:</span> {employee.job_title}</p>
            <p><span className="font-medium">Location:</span> {employee.location}</p>
            <p><span className="font-medium">Start Date:</span> {employee.employment_start_date}</p>
            <p><span className="font-medium">Status:</span> 
              <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                employee.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {employee.status}
              </span>
            </p>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm text-gray-500">Emergency Contact</p>
            <p><span className="font-medium">Name:</span> {employee.emergency_contact_name}</p>
            <p><span className="font-medium">Relationship:</span> {employee.emergency_contact_relationship}</p>
            <p><span className="font-medium">Phone:</span> {employee.emergency_contact_phone}</p>
          </div>
        </div>
        
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// Edit Employee Modal
const EditEmployeeModal = ({ employee, onClose, onSave, onChange }) => {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-lg bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-900">Edit Employee</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">First Name</label>
            <input
              type="text"
              value={employee.first_name || ''}
              onChange={(e) => onChange('first_name', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Last Name</label>
            <input
              type="text"
              value={employee.last_name || ''}
              onChange={(e) => onChange('last_name', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={employee.email || ''}
              onChange={(e) => onChange('email', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <input
              type="text"
              value={employee.phone || ''}
              onChange={(e) => onChange('phone', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Department</label>
            <input
              type="text"
              value={employee.department || ''}
              onChange={(e) => onChange('department', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Job Title</label>
            <input
              type="text"
              value={employee.job_title || ''}
              onChange={(e) => onChange('job_title', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              value={employee.status || ''}
              onChange={(e) => onChange('status', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="Active">Active</option>
              <option value="Newly Hired">Newly Hired</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Location</label>
            <input
              type="text"
              value={employee.location || ''}
              onChange={(e) => onChange('location', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>
        
        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

// Delete Confirmation Modal
const DeleteConfirmationModal = ({ employee, onClose, onConfirm }) => {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-lg bg-white">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <span className="text-red-600 text-2xl">⚠️</span>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Delete Employee</h3>
          <p className="text-sm text-gray-500 mb-4">
            Are you sure you want to delete {employee.full_name || `${employee.first_name} ${employee.last_name}`}? 
            This action cannot be undone.
          </p>
          <div className="flex justify-center space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HRDashboard;