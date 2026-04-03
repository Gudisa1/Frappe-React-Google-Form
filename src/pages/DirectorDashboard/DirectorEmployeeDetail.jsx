

// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import { getEmployee, updateEmployee } from '../../api/hrapi';
// import './DirectorEmployeeDetail.css';

// const DirectorEmployeeDetail = () => {
//   const { id } = useParams();
//   const [employee, setEmployee] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [modalOpen, setModalOpen] = useState(false);
//   const [currentChildType, setCurrentChildType] = useState('');
//   const [editingIndex, setEditingIndex] = useState(null);
//   const [childForm, setChildForm] = useState({});
//   const [toast, setToast] = useState(null);

//   // ========== SELECT OPTIONS - EXACTLY AS PER BACKEND ==========
  
//   // Leave Details Options
//   const leaveTypeOptions = [
//     "Annual Leave",
//     "Sick Leave", 
//     "Emergency Leave",
//     "Maternity Leave",
//     "Paternity Leave",
//     "Parental Leave",
//     "Compassionate Leave",
//     "Study Leave",
//     "Sabbatical Leave",
//     "Unpaid Leave",
//     "Marriage Leave"
//   ];
  
//   const leaveStatusOptions = ["Pending", "Approved", "Rejected"];
  
//   // Guarantees Options
//   const guaranteeTypeOptions = ["Personal", "Financial", "Loan", "Job"];
//   const guaranteeStatusOptions = ["Active", "Inactive", "Completed"];
  
//   // Disciplinary Records Options
//   const incidentTypeOptions = [
//     "Warning",
//     "Misconduct",
//     "Policy Violation",
//     "Harassment",
//     "Discrimination",
//     "Theft or Fraud",
//     "Conflict of Interest",
//     "Safety Violation",
//     "Negligence",
//     "Abuse of Authority",
//     "Insubordination",
//     "Breach of Confidentiality",
//     "Unprofessional Behavior",
//     "Workplace Violence",
//     "Data or IT Security Breach"
//   ];
  
//   const severityOptions = ["Minor", "Major", "Critical"];
//   const incidentStatusOptions = ["Open", "Closed", "Resolved"];
  
//   // Performance Records Options
//   const ratingOptions = ["Average", "Good", "Excellent"];
  
//   // Employee Status Options (for main employee)
//   const employeeStatusOptions = [
//     "Newly Hired",
//     "Active",
//     "Probation",
//     "Contract Ended",
//     "Resigned",
//     "Retired"
//   ];

//   useEffect(() => {
//     if (!id) return;
//     fetchEmployeeData();
//   }, [id]);

//   const fetchEmployeeData = async () => {
//     try {
//       setLoading(true);
//       const response = await getEmployee(id);
      
//       // Ensure numeric fields are properly typed in medical_details
//       if (response.medical_details && Array.isArray(response.medical_details)) {
//         response.medical_details = response.medical_details.map(detail => ({
//           ...detail,
//           medical_year: detail.medical_year ? parseInt(detail.medical_year) : new Date().getFullYear(),
//           medical_claim_date: detail.medical_claim_date || new Date().toISOString().split('T')[0],
//           medical_max_limit: detail.medical_max_limit ? parseFloat(detail.medical_max_limit) : 0,
//           medical_used: detail.medical_used ? parseFloat(detail.medical_used) : 0,
//           medica_remain: detail.medica_remain ? parseFloat(detail.medica_remain) : 
//             (detail.medical_max_limit ? parseFloat(detail.medical_max_limit) - (parseFloat(detail.medical_used) || 0) : 0)
//         }));
//       }
      
//       setEmployee(response);
//       setError(null);
//     } catch (error) {
//       console.error('Error fetching employee:', error);
//       const errorMessage = extractErrorMessage(error);
//       setError(errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Extract detailed error message from backend response
//   const extractErrorMessage = (error) => {
//     if (error.response) {
//       const { data, status } = error.response;
      
//       if (data) {
//         if (data.exception) {
//           return data.exception;
//         }
//         if (data.message) {
//           return data.message;
//         }
//         if (data._server_messages) {
//           try {
//             const messages = JSON.parse(data._server_messages);
//             if (messages && messages.length > 0) {
//               return messages[0];
//             }
//           } catch (e) {
//             return data._server_messages;
//           }
//         }
//         if (data.error) {
//           return data.error;
//         }
//         if (typeof data === 'string') {
//           return data;
//         }
//       }
      
//       if (status === 404) return 'Resource not found';
//       if (status === 403) return 'You do not have permission to perform this action';
//       if (status === 401) return 'Authentication required. Please log in again.';
//       if (status === 500) return 'Server error. Please try again later.';
//     }
    
//     if (error.message) {
//       return error.message;
//     }
    
//     return 'An unexpected error occurred. Please try again.';
//   };

//   const showToast = (message, type = "success") => {
//     setToast({ message, type });
//     setTimeout(() => setToast(null), 5000);
//   };

//   const handleChildChange = (e) => {
//     const { name, value } = e.target;
    
//     // Handle numeric fields conversion
//     let processedValue = value;
//     if (name === 'medical_year' || name === 'number_of_days' || name === 'score') {
//       processedValue = value === '' ? '' : parseFloat(value);
//     } else if (name === 'medical_max_limit' || name === 'medical_used') {
//       processedValue = value === '' ? '' : parseFloat(value);
//     }
    
//     setChildForm(prev => ({ ...prev, [name]: processedValue }));
//   };

//   const openModal = (type, index = null) => {
//     setCurrentChildType(type);
//     setEditingIndex(index);
    
//     if (index !== null && employee[type] && employee[type][index]) {
//       setChildForm({ ...employee[type][index] });
//     } else {
//       setChildForm(getEmptyChildForm(type));
//     }
//     setModalOpen(true);
//   };

//   const getEmptyChildForm = (type) => {
//     switch(type) {
//       case 'leave_details':
//         return {
//           from_date: '',
//           to_date: '',
//           leave_type: '',
//           number_of_days: '',
//           reason: '',
//           status: 'Pending'
//         };
//       case 'disciplinary_records':
//         return {
//           date_of_incident: '',
//           incident_type: '',
//           severity: '',
//           action_taken: '',
//           remarks: '',
//           status: 'Open'
//         };
//       case 'guarantees':
//         return {
//           guaranted_employee: employee?.employee_id || '',
//           guaranteetype: '',
//           start_date: '',
//           end_date: '',
//           status: 'Active',
//           remarks: ''
//         };
//       case 'medical_details':
//         const existingMedicalRecord = employee?.medical_details && employee.medical_details.length > 0;
//         const firstMedicalRecord = existingMedicalRecord ? employee.medical_details[0] : null;
        
//         return {
//           medical_year: new Date().getFullYear(),
//           medical_claim_date: new Date().toISOString().split('T')[0],
//           // If editing existing record, use its max limit
//           // If creating new but records exist, use the first record's max limit
//           // Otherwise, leave empty for user to set
//           medical_max_limit: editingIndex !== null && childForm.medical_max_limit 
//             ? childForm.medical_max_limit 
//             : (existingMedicalRecord && editingIndex === null 
//                 ? firstMedicalRecord.medical_max_limit 
//                 : ''),
//           medical_used: 0,
//           medica_remain: 0
//         };
//       case 'performance_records':
//         return {
//           period: '',
//           score: '',
//           rating: '',
//           remarks: ''
//         };
//       default:
//         return {};
//     }
//   };

//   const validateChildForm = () => {
//     switch(currentChildType) {
//       case 'leave_details':
//         if (!childForm.from_date) return 'From Date is required';
//         if (!childForm.to_date) return 'To Date is required';
//         if (!childForm.leave_type) return 'Leave Type is required';
//         if (!childForm.number_of_days) return 'Number of Days is required';
//         const days = parseFloat(childForm.number_of_days);
//         if (isNaN(days) || days <= 0) return 'Number of Days must be greater than 0';
        
//         if (new Date(childForm.from_date) > new Date(childForm.to_date)) {
//           return 'From Date cannot be later than To Date';
//         }
//         break;
//       case 'disciplinary_records':
//         if (!childForm.date_of_incident) return 'Date of Incident is required';
//         if (!childForm.incident_type) return 'Incident Type is required';
//         if (!childForm.severity) return 'Severity is required';
//         if (!severityOptions.includes(childForm.severity)) {
//           return `Severity must be one of: ${severityOptions.join(', ')}`;
//         }
//         if (!incidentStatusOptions.includes(childForm.status)) {
//           return `Status must be one of: ${incidentStatusOptions.join(', ')}`;
//         }
//         break;
//       case 'guarantees':
//         if (!childForm.guaranted_employee) return 'Guaranteed Employee is required';
//         if (!childForm.guaranteetype) return 'Guarantee Type is required';
//         if (!guaranteeTypeOptions.includes(childForm.guaranteetype)) {
//           return `Guarantee Type must be one of: ${guaranteeTypeOptions.join(', ')}`;
//         }
//         if (!guaranteeStatusOptions.includes(childForm.status)) {
//           return `Status must be one of: ${guaranteeStatusOptions.join(', ')}`;
//         }
        
//         if (childForm.start_date && childForm.end_date) {
//           if (new Date(childForm.start_date) > new Date(childForm.end_date)) {
//             return 'Start Date cannot be later than End Date';
//           }
//         }
//         break;
//       case 'medical_details':
//         if (!childForm.medical_year) return 'Medical Year is required';
//         if (!childForm.medical_claim_date) return 'Medical Claim Date is required';
        
//         const claimDate = new Date(childForm.medical_claim_date);
//         const today = new Date();
//         if (claimDate > today) {
//           return 'Medical Claim Date cannot be in the future';
//         }
//         // Check if this is the first medical record (no existing records)
//         const hasExistingRecords = employee?.medical_details && employee.medical_details.length > 0;
//         const isEditing = editingIndex !== null;

//         // For first record, medical_max_limit is required
//         if (!hasExistingRecords && !isEditing) {
//           if (!childForm.medical_max_limit || childForm.medical_max_limit === '') {
//             return 'Medical Max Limit is required for the first medical record';
//           }
//           const maxLimit = parseFloat(childForm.medical_max_limit);
//           if (isNaN(maxLimit) || maxLimit <= 0) {
//             return 'Medical Max Limit must be a positive number';
//           }
//         }
        
//         const used = parseFloat(childForm.medical_used || 0);
//         if (isNaN(used) || used < 0) return 'Medical Used must be a positive number';
        
//         // Get the max limit (from existing record or current form)
//         let maxLimit;
//         if (hasExistingRecords && !isEditing) {
//           // For new claims, get the max limit from the first medical record
//           const firstMedicalRecord = employee.medical_details[0];
//           maxLimit = parseFloat(firstMedicalRecord.medical_max_limit);
//           // Set it in the form for validation
//           childForm.medical_max_limit = maxLimit;
//         } else if (isEditing) {
//           maxLimit = parseFloat(childForm.medical_max_limit);
//         } else {
//           maxLimit = parseFloat(childForm.medical_max_limit);
//         }
        
//         // Calculate total used claims (including current + all previous)
//         let totalUsed = used;
//         if (hasExistingRecords && !isEditing) {
//           // Sum all previous medical_used
//           totalUsed = employee.medical_details.reduce((sum, record) => {
//             return sum + parseFloat(record.medical_used || 0);
//           }, 0) + used;
//         } else if (isEditing) {
//           // For editing, sum all other records plus this one
//           totalUsed = employee.medical_details.reduce((sum, record, idx) => {
//             if (idx !== editingIndex) {
//               return sum + parseFloat(record.medical_used || 0);
//             }
//             return sum + used;
//           }, 0);
//         }
        
//         if (totalUsed > maxLimit) {
//           return `Medical claims total (${totalUsed.toFixed(2)}) cannot exceed Medical Max Limit (${maxLimit.toFixed(2)})`;
//         }
        
//         // Auto-calculate medical_remain
//         childForm.medica_remain = maxLimit - totalUsed;
//         break;
//       case 'performance_records':
//         if (!childForm.period) return 'Period is required';
//         if (!childForm.score) return 'Score is required';
//         const score = parseFloat(childForm.score);
//         if (isNaN(score) || score < 0 || score > 100) {
//           return 'Score must be between 0 and 100';
//         }
//         if (childForm.rating && !ratingOptions.includes(childForm.rating)) {
//           return `Rating must be one of: ${ratingOptions.join(', ')}`;
//         }
//         break;
//       default:
//         break;
//     }
//     return null;
//   };

//   const preparePayload = () => {
//     const payload = { ...employee };
    
//     // Ensure all numeric fields in medical_details are numbers
//     if (payload.medical_details && Array.isArray(payload.medical_details)) {
//       payload.medical_details = payload.medical_details.map(detail => ({
//         ...detail,
//         medical_year: parseInt(detail.medical_year) || new Date().getFullYear(),
//         medical_max_limit: parseFloat(detail.medical_max_limit) || 0,
//         medical_used: parseFloat(detail.medical_used) || 0,
//         medica_remain: parseFloat(detail.medica_remain) || 
//           (parseFloat(detail.medical_max_limit) - (parseFloat(detail.medical_used) || 0))
//       }));
//     }
    
//     // Ensure leave_details numeric fields
//     if (payload.leave_details && Array.isArray(payload.leave_details)) {
//       payload.leave_details = payload.leave_details.map(detail => ({
//         ...detail,
//         number_of_days: parseFloat(detail.number_of_days) || 0
//       }));
//     }
    
//     // Ensure performance_records numeric fields
//     if (payload.performance_records && Array.isArray(payload.performance_records)) {
//       payload.performance_records = payload.performance_records.map(detail => ({
//         ...detail,
//         score: parseFloat(detail.score) || 0
//       }));
//     }
    
//     return payload;
//   };

//   const saveChildRecord = async () => {
//     const validationError = validateChildForm();
//     if (validationError) {
//       showToast(validationError, "error");
//       return;
//     }

//     const payload = preparePayload();
    
//     if (!payload[currentChildType]) {
//       payload[currentChildType] = [];
//     }

//     // Ensure numeric values are numbers before saving
//     const processedRecord = { ...childForm };
    
//     if (currentChildType === 'medical_details') {
//       const hasExistingRecords = employee?.medical_details && employee.medical_details.length > 0;
//       const isEditing = editingIndex !== null;
      
//       processedRecord.medical_year = parseInt(processedRecord.medical_year) || new Date().getFullYear();
//       processedRecord.medical_claim_date = processedRecord.medical_claim_date || new Date().toISOString().split('T')[0];
      
//       // Handle medical_max_limit correctly
//       if (!hasExistingRecords && !isEditing) {
//         // First record - use the user-provided value
//         processedRecord.medical_max_limit = parseFloat(processedRecord.medical_max_limit);
//       } else {
//         // Subsequent records - use existing max limit from first record
//         processedRecord.medical_max_limit = parseFloat(employee.medical_details[0].medical_max_limit);
//       }
      
//       processedRecord.medical_used = parseFloat(processedRecord.medical_used) || 0;
      
//       // Calculate total used including this record
//       let totalUsed = processedRecord.medical_used;
//       if (hasExistingRecords && !isEditing) {
//         totalUsed = employee.medical_details.reduce((sum, record) => {
//           return sum + parseFloat(record.medical_used || 0);
//         }, 0) + processedRecord.medical_used;
//       } else if (isEditing) {
//         totalUsed = employee.medical_details.reduce((sum, record, idx) => {
//           if (idx !== editingIndex) {
//             return sum + parseFloat(record.medical_used || 0);
//           }
//           return sum + processedRecord.medical_used;
//         }, 0);
//       }
      
//       processedRecord.medica_remain = processedRecord.medical_max_limit - totalUsed;
//     }
    
//     if (currentChildType === 'leave_details') {
//       processedRecord.number_of_days = parseFloat(processedRecord.number_of_days) || 0;
//     }
    
//     if (currentChildType === 'performance_records') {
//       processedRecord.score = parseFloat(processedRecord.score) || 0;
//     }

//     if (editingIndex !== null) {
//       payload[currentChildType][editingIndex] = processedRecord;
//     } else {
//       payload[currentChildType].push(processedRecord);
//     }

//     try {
//       const updated = await updateEmployee(employee.employee_id, payload);
//       setEmployee(updated.data || updated);
//       closeModal();
//       showToast(`${currentChildType.replace(/_/g, ' ')} saved successfully!`, "success");
//     } catch (error) {
//       console.error('Error saving record:', error);
//       const errorMessage = extractErrorMessage(error);
//       showToast(`Failed to save record: ${errorMessage}`, "error");
//     }
//   };

//   const deleteChildRecord = async (type, index) => {
//     if (!window.confirm('Are you sure you want to delete this record? This action cannot be undone.')) return;
    
//     const payload = preparePayload();
//     if (payload[type] && payload[type][index]) {
//       payload[type].splice(index, 1);
      
//       try {
//         const updated = await updateEmployee(employee.employee_id, payload);
//         setEmployee(updated.data || updated);
//         showToast(`${type.replace(/_/g, ' ')} deleted successfully!`, "success");
//       } catch (error) {
//         console.error('Error deleting record:', error);
//         const errorMessage = extractErrorMessage(error);
//         showToast(`Failed to delete record: ${errorMessage}`, "error");
//       }
//     }
//   };

//   const closeModal = () => {
//     setModalOpen(false);
//     setCurrentChildType('');
//     setEditingIndex(null);
//     setChildForm({});
//   };

//   const renderChildSection = (records, title, type, columns, dataMapping) => {
//     const recordsArray = records || [];
//     const hasRecords = recordsArray.length > 0;

//     // Calculate remaining balance for medical details
//     let remainingBalance = null;
//     let totalUsed = 0;
//     let maxLimit = 0;
    
//     if (type === 'medical_details' && hasRecords) {
//       const firstRecord = recordsArray[0];
//       totalUsed = recordsArray.reduce((sum, rec) => sum + parseFloat(rec.medical_used || 0), 0);
//       maxLimit = parseFloat(firstRecord.medical_max_limit || 0);
//       remainingBalance = maxLimit - totalUsed;
//     }

//     return (
//       <div className="child-section">
//         <div className="section-header">
//           <h3>{title}</h3>
//           {type === 'medical_details' && hasRecords && (
//             <div className="medical-summary">
//               <span className={`remaining-balance ${remainingBalance <= 0 ? 'exhausted' : ''}`}>
//                 💰 Remaining Balance: ETB {remainingBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
//               </span>
//               <span className="total-used">
//                 | Total Claims: ETB {totalUsed.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
//               </span>
//             </div>
//           )}
//           <button 
//             className="btn-create"
//             onClick={() => openModal(type)}
//             disabled={type === 'medical_details' && remainingBalance !== null && remainingBalance <= 0}
//             title={type === 'medical_details' && remainingBalance !== null && remainingBalance <= 0 ? "Medical claim exhausted - no balance remaining" : ""}
//           >
//             + Create {title}
//           </button>
//         </div>

//         {!hasRecords ? (
//           <div className="empty-state-mini">
//             <span className="empty-icon-mini">📋</span>
//             <p>No {title.toLowerCase()} records found</p>
//             <button 
//               className="btn-create-mini"
//               onClick={() => openModal(type)}
//             >
//               Create First Record
//             </button>
//           </div>
//         ) : (
//           <div className="table-responsive">
//             <table className="child-table">
//               <thead>
//                 <tr>
//                   {columns.map(col => <th key={col}>{col}</th>)}
//                   <th>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {recordsArray.map((rec, idx) => (
//                   <tr key={idx}>
//                     {columns.map(col => {
//                       const fieldName = dataMapping[col];
//                       let value = rec[fieldName];
                      
//                       if (fieldName === 'medical_max_limit' || fieldName === 'medical_used' || fieldName === 'medica_remain') {
//                         value = value || value === 0 ? `ETB ${parseFloat(value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '-';
//                       }
//                       else if ((fieldName === 'from_date' || fieldName === 'to_date' || fieldName === 'start_date' || 
//                                 fieldName === 'end_date' || fieldName === 'date_of_incident' || fieldName === 'period'|| fieldName === 'medical_claim_date') && value) {
//                         value = new Date(value).toLocaleDateString();
//                       }
//                       else if (fieldName === 'score' && value) {
//                         value = `${parseFloat(value).toFixed(1)}%`;
//                       }
//                       else if (fieldName === 'number_of_days' && value) {
//                         value = `${parseFloat(value).toFixed(1)} days`;
//                       }
                      
//                       return <td key={col}>{value || '-'}</td>;
//                     })}
//                     <td className="action-buttons-cell">
//                       <button 
//                         className="btn-edit-mini"
//                         onClick={() => openModal(type, idx)}
//                         title="Edit"
//                       >
//                         ✏️
//                       </button>
//                       <button 
//                         className="btn-delete-mini"
//                         onClick={() => deleteChildRecord(type, idx)}
//                         title="Delete"
//                       >
//                         🗑️
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
//     );
//   };

//   if (loading) return (
//     <div className="loading-container">
//       <div className="loader"></div>
//       <p>Loading employee details...</p>
//     </div>
//   );
  
//   if (error) return (
//     <div className="error-container">
//       <span className="error-icon">⚠️</span>
//       <div className="error-details">
//         <h3>Error Loading Employee</h3>
//         <p>{error}</p>
//         <button onClick={fetchEmployeeData} className="btn-retry">Try Again</button>
//       </div>
//     </div>
//   );
  
//   if (!employee) return (
//     <div className="error-container">
//       <p>No employee found with ID: {id}</p>
//     </div>
//   );

//   return (
//     <div className="employee-detail-container">
//       {/* Toast Notification */}
//       {toast && (
//         <div className={`toast toast-${toast.type}`}>
//           <div className="toast-content">
//             <span className="toast-icon">
//               {toast.type === 'success' ? '✅' : '❌'}
//             </span>
//             <span className="toast-message">{toast.message}</span>
//           </div>
//         </div>
//       )}

//       <div className="detail-wrapper">
//         {/* Header */}
//         <div className="detail-header">
//           <div className="header-left">
//             <h1>Employee Details</h1>
//             <p>View and manage employee information</p>
//           </div>
//           <div className="employee-status-badge">
//             <span className={`status-badge-large status-${employee.status?.toLowerCase().replace(/ /g, '-')}`}>
//               {employee.status}
//             </span>
//           </div>
//         </div>

//         {/* Main Info Grid */}
//         <div className="info-grid">
//           {/* Personal Info Card */}
//           <div className="info-card">
//             <div className="card-header">
//               <span className="card-icon">👤</span>
//               <h3>Personal Information</h3>
//             </div>
//             <div className="card-content">
//               <div className="info-row">
//                 <span className="info-label">Employee ID:</span>
//                 <span className="info-value employee-id-badge">{employee.employee_id}</span>
//               </div>
//               <div className="info-row">
//                 <span className="info-label">Full Name:</span>
//                 <span className="info-value">{employee.first_name} {employee.last_name}</span>
//               </div>
//               <div className="info-row">
//                 <span className="info-label">Date of Birth:</span>
//                 <span className="info-value">{employee.date_of_birth ? new Date(employee.date_of_birth).toLocaleDateString() : '-'}</span>
//               </div>
//               <div className="info-row">
//                 <span className="info-label">Gender:</span>
//                 <span className="info-value">{employee.gender || '-'}</span>
//               </div>
//               <div className="info-row">
//                 <span className="info-label">Phone:</span>
//                 <span className="info-value">{employee.phone || '-'}</span>
//               </div>
//               <div className="info-row">
//                 <span className="info-label">Email:</span>
//                 <span className="info-value">{employee.email || '-'}</span>
//               </div>
//               <div className="info-row">
//                 <span className="info-label">Address:</span>
//                 <span className="info-value">{employee.address || '-'}</span>
//               </div>
//             </div>
//           </div>

//           {/* Employment Info Card */}
//           <div className="info-card">
//             <div className="card-header">
//               <span className="card-icon">💼</span>
//               <h3>Employment Information</h3>
//             </div>
//             <div className="card-content">
//               <div className="info-row">
//                 <span className="info-label">Job Title:</span>
//                 <span className="info-value">{employee.job_title || '-'}</span>
//               </div>
//               <div className="info-row">
//                 <span className="info-label">Department:</span>
//                 <span className="info-value">{employee.department || '-'}</span>
//               </div>
//               <div className="info-row">
//                 <span className="info-label">Location:</span>
//                 <span className="info-value">{employee.location || '-'}</span>
//               </div>
//               <div className="info-row">
//                 <span className="info-label">Start Date:</span>
//                 <span className="info-value">{employee.employment_start_date ? new Date(employee.employment_start_date).toLocaleDateString() : '-'}</span>
//               </div>
//               <div className="info-row">
//                 <span className="info-label">End Date:</span>
//                 <span className="info-value">{employee.employment_end_date ? new Date(employee.employment_end_date).toLocaleDateString() : '-'}</span>
//               </div>
//               <div className="info-row">
//                 <span className="info-label">Project:</span>
//                 <span className="info-value project-badge">{employee.project || '-'}</span>
//               </div>
//             </div>
//           </div>

//           {/* Emergency Contact Card */}
//           <div className="info-card">
//             <div className="card-header">
//               <span className="card-icon">🚨</span>
//               <h3>Emergency Contact</h3>
//             </div>
//             <div className="card-content">
//               <div className="info-row">
//                 <span className="info-label">Contact Name:</span>
//                 <span className="info-value">{employee.emergency_contact_name || '-'}</span>
//               </div>
//               <div className="info-row">
//                 <span className="info-label">Relationship:</span>
//                 <span className="info-value">{employee.emergency_contact_relationship || '-'}</span>
//               </div>
//               <div className="info-row">
//                 <span className="info-label">Phone:</span>
//                 <span className="info-value">{employee.emergency_contact_phone || '-'}</span>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Child Records Sections */}
//         <div className="child-sections">
//           {/* Leave Details */}
//           {renderChildSection(
//             employee.leave_details,
//             'Leave Details',
//             'leave_details',
//             ['From Date', 'To Date', 'Leave Type', 'Number of Days', 'Reason', 'Status'],
//             {
//               'From Date': 'from_date',
//               'To Date': 'to_date',
//               'Leave Type': 'leave_type',
//               'Number of Days': 'number_of_days',
//               'Reason': 'reason',
//               'Status': 'status'
//             }
//           )}

//           {/* Disciplinary Records */}
//           {renderChildSection(
//             employee.disciplinary_records,
//             'Disciplinary Records',
//             'disciplinary_records',
//             ['Date of Incident', 'Incident Type', 'Severity', 'Action Taken', 'Remarks', 'Status'],
//             {
//               'Date of Incident': 'date_of_incident',
//               'Incident Type': 'incident_type',
//               'Severity': 'severity',
//               'Action Taken': 'action_taken',
//               'Remarks': 'remarks',
//               'Status': 'status'
//             }
//           )}

//           {/* Guarantees */}
//           {renderChildSection(
//             employee.guarantees,
//             'Guarantees',
//             'guarantees',
//             ['Guaranteed Employee', 'Guarantee Type', 'Start Date', 'End Date', 'Status', 'Remarks'],
//             {
//               'Guaranteed Employee': 'guaranted_employee',
//               'Guarantee Type': 'guaranteetype',
//               'Start Date': 'start_date',
//               'End Date': 'end_date',
//               'Status': 'status',
//               'Remarks': 'remarks'
//             }
//           )}

//           {/* Medical Details */}
//           {renderChildSection(
//             employee.medical_details,
//             'Medical Details',
//             'medical_details',
//             ['Medical Year',"Claim Date", 'Medical Max Limit', 'Medical Used', 'Medical Remain'],
//             {
//               'Medical Year': 'medical_year',
//               'Claim Date': 'medical_claim_date',
//               'Medical Max Limit': 'medical_max_limit',
//               'Medical Used': 'medical_used',
//               'Medical Remain': 'medica_remain'
//             }
//           )}

//           {/* Performance Records */}
//           {renderChildSection(
//             employee.performance_records,
//             'Performance Records',
//             'performance_records',
//             ['Period', 'Score', 'Rating', 'Remarks'],
//             {
//               'Period': 'period',
//               'Score': 'score',
//               'Rating': 'rating',
//               'Remarks': 'remarks'
//             }
//           )}
//         </div>

//         {/* Modal for Create/Edit */}
//         {modalOpen && (
//           <div className="modal-overlay" onClick={closeModal}>
//             <div className="modal-content" onClick={(e) => e.stopPropagation()}>
//               <div className="modal-header">
//                 <h3>{editingIndex !== null ? 'Edit' : 'Create'} {currentChildType.replace(/_/g, ' ')}</h3>
//                 <button className="modal-close" onClick={closeModal}>✕</button>
//               </div>
//               <div className="modal-body">
//                 {/* Leave Details Form */}
//                 {currentChildType === 'leave_details' && (
//                   <div className="form-group">
//                     <label>From Date *</label>
//                     <input type="date" name="from_date" value={childForm.from_date || ''} onChange={handleChildChange} />
                    
//                     <label>To Date *</label>
//                     <input type="date" name="to_date" value={childForm.to_date || ''} onChange={handleChildChange} />
                    
//                     <label>Leave Type *</label>
//                     <select name="leave_type" value={childForm.leave_type || ''} onChange={handleChildChange}>
//                       <option value="">Select Leave Type</option>
//                       {leaveTypeOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
//                     </select>
                    
//                     <label>Number of Days *</label>
//                     <input type="number" step="0.5" name="number_of_days" value={childForm.number_of_days || ''} onChange={handleChildChange} />
                    
//                     <label>Reason</label>
//                     <textarea name="reason" rows="3" value={childForm.reason || ''} onChange={handleChildChange} placeholder="Reason for leave"></textarea>
                    
//                     <label>Status</label>
//                     <select name="status" value={childForm.status || ''} onChange={handleChildChange}>
//                       {leaveStatusOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
//                     </select>
//                   </div>
//                 )}

//                 {/* Disciplinary Records Form */}
//                 {currentChildType === 'disciplinary_records' && (
//                   <div className="form-group">
//                     <label>Date of Incident *</label>
//                     <input type="date" name="date_of_incident" value={childForm.date_of_incident || ''} onChange={handleChildChange} />
                    
//                     <label>Incident Type *</label>
//                     <select name="incident_type" value={childForm.incident_type || ''} onChange={handleChildChange}>
//                       <option value="">Select Incident Type</option>
//                       {incidentTypeOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
//                     </select>
                    
//                     <label>Severity *</label>
//                     <select name="severity" value={childForm.severity || ''} onChange={handleChildChange}>
//                       <option value="">Select Severity</option>
//                       {severityOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
//                     </select>
                    
//                     <label>Action Taken</label>
//                     <textarea name="action_taken" rows="3" value={childForm.action_taken || ''} onChange={handleChildChange} placeholder="Action taken against employee"></textarea>
                    
//                     <label>Remarks</label>
//                     <textarea name="remarks" rows="3" value={childForm.remarks || ''} onChange={handleChildChange} placeholder="Additional remarks"></textarea>
                    
//                     <label>Status</label>
//                     <select name="status" value={childForm.status || ''} onChange={handleChildChange}>
//                       {incidentStatusOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
//                     </select>
//                   </div>
//                 )}

//                 {/* Guarantees Form */}
//                 {currentChildType === 'guarantees' && (
//                   <div className="form-group">
//                     <label>Guaranteed Employee *</label>
//                     <input 
//                       type="text" 
//                       name="guaranted_employee" 
//                       placeholder="Employee ID or Name" 
//                       value={childForm.guaranted_employee || ''} 
//                       onChange={handleChildChange}
//                       readOnly={!editingIndex && childForm.guaranted_employee === employee?.employee_id}
//                       className={!editingIndex && childForm.guaranted_employee === employee?.employee_id ? 'disabled-input' : ''}
//                     />
//                     {!editingIndex && childForm.guaranted_employee === employee?.employee_id && (
//                       <small className="field-hint">Auto-populated with current employee ID</small>
//                     )}
                    
//                     <label>Guarantee Type *</label>
//                     <select name="guaranteetype" value={childForm.guaranteetype || ''} onChange={handleChildChange}>
//                       <option value="">Select Guarantee Type</option>
//                       {guaranteeTypeOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
//                     </select>
                    
//                     <label>Start Date</label>
//                     <input type="date" name="start_date" value={childForm.start_date || ''} onChange={handleChildChange} />
                    
//                     <label>End Date</label>
//                     <input type="date" name="end_date" value={childForm.end_date || ''} onChange={handleChildChange} />
                    
//                     <label>Status</label>
//                     <select name="status" value={childForm.status || ''} onChange={handleChildChange}>
//                       {guaranteeStatusOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
//                     </select>
                    
//                     <label>Remarks</label>
//                     <textarea name="remarks" rows="3" value={childForm.remarks || ''} onChange={handleChildChange} placeholder="Additional remarks"></textarea>
//                   </div>
//                 )}

//                 {/* Medical Details Form */}
//                 {currentChildType === 'medical_details' && (
//                   <div className="form-group">
//                     <label>Medical Year *</label>
//                     <input type="number" name="medical_year" value={childForm.medical_year || ''} onChange={handleChildChange} />
//                     <label>Medical Claim Date *</label>
//                       <input 
//                         type="date" 
//                         name="medical_claim_date" 
//                         value={childForm.medical_claim_date || new Date().toISOString().split('T')[0]} 
//                         onChange={handleChildChange}
//                         max={new Date().toISOString().split('T')[0]} // Prevent future dates
//                       />
//                       <small className="field-hint">Date when the medical claim was made</small>
                    
//                     {/* Only show Medical Max Limit field if no records exist yet */}
//                     {(!employee?.medical_details || employee.medical_details.length === 0) && editingIndex === null && (
//                       <>
//                         <label>Medical Max Limit (ETB) * (Set once - cannot be changed later)</label>
//                         <input 
//                           type="number" 
//                           step="0.01" 
//                           name="medical_max_limit" 
//                           value={childForm.medical_max_limit || ''} 
//                           onChange={handleChildChange}
//                           placeholder="Enter maximum medical claim limit"
//                           required
//                         />
//                         <small className="field-hint">⚠️ This value can only be set once and cannot be modified after the first medical record</small>
//                       </>
//                     )}
                    
//                     {/* Show read-only max limit if records exist */}
//                     {employee?.medical_details && employee.medical_details.length > 0 && (
//                       <>
//                         <label>Medical Max Limit (ETB) (Read-only)</label>
//                         <input 
//                           type="number" 
//                           step="0.01" 
//                           name="medical_max_limit" 
//                           value={childForm.medical_max_limit || employee.medical_details[0].medical_max_limit} 
//                           disabled 
//                           readOnly
//                           className="disabled-input"
//                         />
//                         <small className="field-hint">Medical max limit was set to ETB {parseFloat(childForm.medical_max_limit || employee.medical_details[0].medical_max_limit).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} and cannot be changed</small>
//                       </>
//                     )}
                    
//                     {/* For editing existing records, also show read-only max limit */}
//                     {editingIndex !== null && employee?.medical_details && employee.medical_details.length > 0 && (
//                       <>
//                         <label>Medical Max Limit (ETB) (Read-only)</label>
//                         <input 
//                           type="number" 
//                           step="0.01" 
//                           name="medical_max_limit" 
//                           value={childForm.medical_max_limit} 
//                           disabled 
//                           readOnly
//                           className="disabled-input"
//                         />
//                         <small className="field-hint">Medical max limit cannot be changed once set</small>
//                       </>
//                     )}
                    
//                     <label>Medical Claim Amount (ETB)</label>
//                     <input 
//                       type="number" 
//                       step="0.01" 
//                       name="medical_used" 
//                       value={childForm.medical_used || 0} 
//                       onChange={handleChildChange}
//                       placeholder="Enter claim amount"
//                     />
//                     <small className="field-hint">Enter the claim amount to deduct from your medical balance</small>
                    
//                     <label>Remaining Balance (ETB) - Auto-calculated</label>
//                     <input 
//                       type="number" 
//                       step="0.01" 
//                       name="medica_remain" 
//                       value={(() => {
//                         // Calculate remaining balance properly
//                         if (childForm.medica_remain !== undefined && childForm.medica_remain !== '') {
//                           return childForm.medica_remain;
//                         }
                        
//                         let maxLimit = 0;
//                         let totalUsed = parseFloat(childForm.medical_used || 0);
                        
//                         if (employee?.medical_details && employee.medical_details.length > 0) {
//                           maxLimit = parseFloat(employee.medical_details[0].medical_max_limit);
//                           // Sum all previous claims except the one being edited
//                           totalUsed += employee.medical_details.reduce((sum, record, idx) => {
//                             if (editingIndex !== idx) {
//                               return sum + parseFloat(record.medical_used || 0);
//                             }
//                             return sum;
//                           }, 0);
//                         } else if (childForm.medical_max_limit) {
//                           maxLimit = parseFloat(childForm.medical_max_limit);
//                         }
                        
//                         return (maxLimit - totalUsed).toFixed(2);
//                       })()} 
//                       readOnly 
//                       disabled 
//                       className="disabled-input" 
//                     />
//                     <small className="field-hint">Automatically calculated as Max Limit - Total Claims</small>
//                   </div>
//                 )}

//                 {/* Performance Records Form */}
//                 {currentChildType === 'performance_records' && (
//                   <div className="form-group">
//                     <label>Period *</label>
//                     <input type="date" name="period" value={childForm.period || ''} onChange={handleChildChange} />
                    
//                     <label>Score * (0-100)</label>
//                     <input type="number" step="0.1" min="0" max="100" name="score" value={childForm.score || ''} onChange={handleChildChange} />
                    
//                     <label>Rating</label>
//                     <select name="rating" value={childForm.rating || ''} onChange={handleChildChange}>
//                       <option value="">Select Rating</option>
//                       {ratingOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
//                     </select>
                    
//                     <label>Remarks</label>
//                     <textarea name="remarks" rows="3" value={childForm.remarks || ''} onChange={handleChildChange} placeholder="Performance remarks"></textarea>
//                   </div>
//                 )}
//               </div>
//               <div className="modal-footer">
//                 <button className="btn-cancel" onClick={closeModal}>Cancel</button>
//                 <button className="btn-save" onClick={saveChildRecord}>Save</button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default DirectorEmployeeDetail;

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getEmployee, updateEmployee } from '../../api/hrapi';
import './DirectorEmployeeDetail.css';

const DirectorEmployeeDetail = () => {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentChildType, setCurrentChildType] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);
  const [childForm, setChildForm] = useState({});
  const [toast, setToast] = useState(null);

  // ========== SELECT OPTIONS - EXACTLY AS PER BACKEND ==========
  
  // Leave Details Options
  const leaveTypeOptions = [
    "Annual Leave",
    "Sick Leave", 
    "Emergency Leave",
    "Maternity Leave",
    "Paternity Leave",
    "Parental Leave",
    "Compassionate Leave",
    "Study Leave",
    "Sabbatical Leave",
    "Unpaid Leave",
    "Marriage Leave"
  ];
  
  const leaveStatusOptions = ["Pending", "Approved", "Rejected"];
  
  // Guarantees Options
  const guaranteeTypeOptions = ["Personal", "Financial", "Loan", "Job"];
  const guaranteeStatusOptions = ["Active", "Inactive", "Completed"];
  
  // Disciplinary Records Options
  const incidentTypeOptions = [
    "Warning",
    "Misconduct",
    "Policy Violation",
    "Harassment",
    "Discrimination",
    "Theft or Fraud",
    "Conflict of Interest",
    "Safety Violation",
    "Negligence",
    "Abuse of Authority",
    "Insubordination",
    "Breach of Confidentiality",
    "Unprofessional Behavior",
    "Workplace Violence",
    "Data or IT Security Breach"
  ];
  
  const severityOptions = ["Minor", "Major", "Critical"];
  const incidentStatusOptions = ["Open", "Closed", "Resolved"];
  
  // Performance Records Options
  const ratingOptions = ["Average", "Good", "Excellent"];
  
  // Employee Status Options (for main employee)
  const employeeStatusOptions = [
    "Newly Hired",
    "Active",
    "Probation",
    "Contract Ended",
    "Resigned",
    "Retired"
  ];

  useEffect(() => {
    if (!id) return;
    fetchEmployeeData();
  }, [id]);

  const fetchEmployeeData = async () => {
    try {
      setLoading(true);
      const response = await getEmployee(id);
      
      // Ensure numeric fields are properly typed in medical_details
      if (response.medical_details && Array.isArray(response.medical_details)) {
        response.medical_details = response.medical_details.map(detail => ({
          ...detail,
          medical_year: detail.medical_year ? parseInt(detail.medical_year) : new Date().getFullYear(),
          medical_claim_date: detail.medical_claim_date || new Date().toISOString().split('T')[0],
          medical_max_limit: detail.medical_max_limit ? parseFloat(detail.medical_max_limit) : 0,
          medical_used: detail.medical_used ? parseFloat(detail.medical_used) : 0,
          medica_remain: detail.medica_remain ? parseFloat(detail.medica_remain) : 
            (detail.medical_max_limit ? parseFloat(detail.medical_max_limit) - (parseFloat(detail.medical_used) || 0) : 0)
        }));
      }
      
      setEmployee(response);
      setError(null);
    } catch (error) {
      console.error('Error fetching employee:', error);
      const errorMessage = extractErrorMessage(error);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Extract detailed error message from backend response
  const extractErrorMessage = (error) => {
    if (error.response) {
      const { data, status } = error.response;
      
      if (data) {
        if (data.exception) {
          return data.exception;
        }
        if (data.message) {
          return data.message;
        }
        if (data._server_messages) {
          try {
            const messages = JSON.parse(data._server_messages);
            if (messages && messages.length > 0) {
              return messages[0];
            }
          } catch (e) {
            return data._server_messages;
          }
        }
        if (data.error) {
          return data.error;
        }
        if (typeof data === 'string') {
          return data;
        }
      }
      
      if (status === 404) return 'Resource not found';
      if (status === 403) return 'You do not have permission to perform this action';
      if (status === 401) return 'Authentication required. Please log in again.';
      if (status === 500) return 'Server error. Please try again later.';
    }
    
    if (error.message) {
      return error.message;
    }
    
    return 'An unexpected error occurred. Please try again.';
  };

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

  const handleChildChange = (e) => {
    const { name, value } = e.target;
    
    // Handle numeric fields conversion
    let processedValue = value;
    if (name === 'medical_year' || name === 'number_of_days' || name === 'score') {
      processedValue = value === '' ? '' : parseFloat(value);
    } else if (name === 'medical_max_limit' || name === 'medical_used') {
      processedValue = value === '' ? '' : parseFloat(value);
    }
    
    setChildForm(prev => ({ ...prev, [name]: processedValue }));
  };

  const openModal = (type, index = null) => {
    // DISABLED - View only mode
    return;
  };

  const getEmptyChildForm = (type) => {
    switch(type) {
      case 'leave_details':
        return {
          from_date: '',
          to_date: '',
          leave_type: '',
          number_of_days: '',
          reason: '',
          status: 'Pending'
        };
      case 'disciplinary_records':
        return {
          date_of_incident: '',
          incident_type: '',
          severity: '',
          action_taken: '',
          remarks: '',
          status: 'Open'
        };
      case 'guarantees':
        return {
          guaranted_employee: employee?.employee_id || '',
          guaranteetype: '',
          start_date: '',
          end_date: '',
          status: 'Active',
          remarks: ''
        };
      case 'medical_details':
        const existingMedicalRecord = employee?.medical_details && employee.medical_details.length > 0;
        const firstMedicalRecord = existingMedicalRecord ? employee.medical_details[0] : null;
        
        return {
          medical_year: new Date().getFullYear(),
          medical_claim_date: new Date().toISOString().split('T')[0],
          // If editing existing record, use its max limit
          // If creating new but records exist, use the first record's max limit
          // Otherwise, leave empty for user to set
          medical_max_limit: editingIndex !== null && childForm.medical_max_limit 
            ? childForm.medical_max_limit 
            : (existingMedicalRecord && editingIndex === null 
                ? firstMedicalRecord.medical_max_limit 
                : ''),
          medical_used: 0,
          medica_remain: 0
        };
      case 'performance_records':
        return {
          period: '',
          score: '',
          rating: '',
          remarks: ''
        };
      default:
        return {};
    }
  };

  const validateChildForm = () => {
    return null;
  };

  const preparePayload = () => {
    const payload = { ...employee };
    
    // Ensure all numeric fields in medical_details are numbers
    if (payload.medical_details && Array.isArray(payload.medical_details)) {
      payload.medical_details = payload.medical_details.map(detail => ({
        ...detail,
        medical_year: parseInt(detail.medical_year) || new Date().getFullYear(),
        medical_max_limit: parseFloat(detail.medical_max_limit) || 0,
        medical_used: parseFloat(detail.medical_used) || 0,
        medica_remain: parseFloat(detail.medica_remain) || 
          (parseFloat(detail.medical_max_limit) - (parseFloat(detail.medical_used) || 0))
      }));
    }
    
    // Ensure leave_details numeric fields
    if (payload.leave_details && Array.isArray(payload.leave_details)) {
      payload.leave_details = payload.leave_details.map(detail => ({
        ...detail,
        number_of_days: parseFloat(detail.number_of_days) || 0
      }));
    }
    
    // Ensure performance_records numeric fields
    if (payload.performance_records && Array.isArray(payload.performance_records)) {
      payload.performance_records = payload.performance_records.map(detail => ({
        ...detail,
        score: parseFloat(detail.score) || 0
      }));
    }
    
    return payload;
  };

  const saveChildRecord = async () => {
    // DISABLED - View only mode
    showToast("This page is in view-only mode", "error");
    return;
  };

  const deleteChildRecord = async (type, index) => {
    // DISABLED - View only mode
    showToast("This page is in view-only mode", "error");
    return;
  };

  const closeModal = () => {
    setModalOpen(false);
    setCurrentChildType('');
    setEditingIndex(null);
    setChildForm({});
  };

  const renderChildSection = (records, title, type, columns, dataMapping) => {
    const recordsArray = records || [];
    const hasRecords = recordsArray.length > 0;

    // Calculate remaining balance for medical details
    let remainingBalance = null;
    let totalUsed = 0;
    let maxLimit = 0;
    
    if (type === 'medical_details' && hasRecords) {
      const firstRecord = recordsArray[0];
      totalUsed = recordsArray.reduce((sum, rec) => sum + parseFloat(rec.medical_used || 0), 0);
      maxLimit = parseFloat(firstRecord.medical_max_limit || 0);
      remainingBalance = maxLimit - totalUsed;
    }

    return (
      <div className="child-section">
        <div className="section-header">
          <h3>{title}</h3>
          {type === 'medical_details' && hasRecords && (
            <div className="medical-summary">
              <span className={`remaining-balance ${remainingBalance <= 0 ? 'exhausted' : ''}`}>
                💰 Remaining Balance: ETB {remainingBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span className="total-used">
                | Total Claims: ETB {totalUsed.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          )}
          {/* CREATE BUTTON - DISABLED */}
          <button 
            className="btn-create"
            onClick={() => openModal(type)}
            disabled={true}
            title="View only mode - Editing disabled"
            style={{ opacity: 0.5, cursor: 'not-allowed' }}
          >
            + Create {title}
          </button>
        </div>

        {!hasRecords ? (
          <div className="empty-state-mini">
            <span className="empty-icon-mini">📋</span>
            <p>No {title.toLowerCase()} records found</p>
            {/* CREATE BUTTON - DISABLED */}
            <button 
              className="btn-create-mini"
              onClick={() => openModal(type)}
              disabled={true}
              style={{ opacity: 0.5, cursor: 'not-allowed' }}
            >
              Create First Record
            </button>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="child-table">
              <thead>
                <tr>
                  {columns.map(col => <th key={col}>{col}</th>)}
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {recordsArray.map((rec, idx) => (
                  <tr key={idx}>
                    {columns.map(col => {
                      const fieldName = dataMapping[col];
                      let value = rec[fieldName];
                      
                      if (fieldName === 'medical_max_limit' || fieldName === 'medical_used' || fieldName === 'medica_remain') {
                        value = value || value === 0 ? `ETB ${parseFloat(value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '-';
                      }
                      else if ((fieldName === 'from_date' || fieldName === 'to_date' || fieldName === 'start_date' || 
                                fieldName === 'end_date' || fieldName === 'date_of_incident' || fieldName === 'period'|| fieldName === 'medical_claim_date') && value) {
                        value = new Date(value).toLocaleDateString();
                      }
                      else if (fieldName === 'score' && value) {
                        value = `${parseFloat(value).toFixed(1)}%`;
                      }
                      else if (fieldName === 'number_of_days' && value) {
                        value = `${parseFloat(value).toFixed(1)} days`;
                      }
                      
                      return <td key={col}>{value || '-'}</td>;
                    })}
                    <td className="action-buttons-cell">
                      {/* EDIT BUTTON - DISABLED */}
                      <button 
                        className="btn-edit-mini"
                        onClick={() => openModal(type, idx)}
                        title="View only mode - Editing disabled"
                        disabled={true}
                        style={{ opacity: 0.5, cursor: 'not-allowed' }}
                      >
                        ✏️
                      </button>
                      {/* DELETE BUTTON - DISABLED */}
                      <button 
                        className="btn-delete-mini"
                        onClick={() => deleteChildRecord(type, idx)}
                        title="View only mode - Deletion disabled"
                        disabled={true}
                        style={{ opacity: 0.5, cursor: 'not-allowed' }}
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  };

  if (loading) return (
    <div className="loading-container">
      <div className="loader"></div>
      <p>Loading employee details...</p>
    </div>
  );
  
  if (error) return (
    <div className="error-container">
      <span className="error-icon">⚠️</span>
      <div className="error-details">
        <h3>Error Loading Employee</h3>
        <p>{error}</p>
        <button onClick={fetchEmployeeData} className="btn-retry">Try Again</button>
      </div>
    </div>
  );
  
  if (!employee) return (
    <div className="error-container">
      <p>No employee found with ID: {id}</p>
    </div>
  );

  return (
    <div className="employee-detail-container">
      {/* View Only Mode Banner */}
      <div className="view-only-banner" style={{
        backgroundColor: '#f0f0f0',
        color: '#666',
        textAlign: 'center',
        padding: '8px',
        borderRadius: '4px',
        marginBottom: '16px',
        fontSize: '14px',
        border: '1px solid #ddd'
      }}>
        👁️ View Only Mode - You can only view employee information
      </div>

      {/* Toast Notification */}
      {toast && (
        <div className={`toast toast-${toast.type}`}>
          <div className="toast-content">
            <span className="toast-icon">
              {toast.type === 'success' ? '✅' : '❌'}
            </span>
            <span className="toast-message">{toast.message}</span>
          </div>
        </div>
      )}

      <div className="detail-wrapper">
        {/* Header */}
        <div className="detail-header">
          <div className="header-left">
            <h1>Employee Details</h1>
            <p>View and manage employee information</p>
          </div>
          <div className="employee-status-badge">
            <span className={`status-badge-large status-${employee.status?.toLowerCase().replace(/ /g, '-')}`}>
              {employee.status}
            </span>
          </div>
        </div>

        {/* Main Info Grid */}
        <div className="info-grid">
          {/* Personal Info Card */}
          <div className="info-card">
            <div className="card-header">
              <span className="card-icon">👤</span>
              <h3>Personal Information</h3>
            </div>
            <div className="card-content">
              <div className="info-row">
                <span className="info-label">Employee ID:</span>
                <span className="info-value employee-id-badge">{employee.employee_id}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Full Name:</span>
                <span className="info-value">{employee.first_name} {employee.last_name}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Date of Birth:</span>
                <span className="info-value">{employee.date_of_birth ? new Date(employee.date_of_birth).toLocaleDateString() : '-'}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Gender:</span>
                <span className="info-value">{employee.gender || '-'}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Phone:</span>
                <span className="info-value">{employee.phone || '-'}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Email:</span>
                <span className="info-value">{employee.email || '-'}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Address:</span>
                <span className="info-value">{employee.address || '-'}</span>
              </div>
            </div>
          </div>

          {/* Employment Info Card */}
          <div className="info-card">
            <div className="card-header">
              <span className="card-icon">💼</span>
              <h3>Employment Information</h3>
            </div>
            <div className="card-content">
              <div className="info-row">
                <span className="info-label">Job Title:</span>
                <span className="info-value">{employee.job_title || '-'}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Department:</span>
                <span className="info-value">{employee.department || '-'}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Location:</span>
                <span className="info-value">{employee.location || '-'}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Start Date:</span>
                <span className="info-value">{employee.employment_start_date ? new Date(employee.employment_start_date).toLocaleDateString() : '-'}</span>
              </div>
              <div className="info-row">
                <span className="info-label">End Date:</span>
                <span className="info-value">{employee.employment_end_date ? new Date(employee.employment_end_date).toLocaleDateString() : '-'}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Project:</span>
                <span className="info-value project-badge">{employee.project || '-'}</span>
              </div>
            </div>
          </div>

          {/* Emergency Contact Card */}
          <div className="info-card">
            <div className="card-header">
              <span className="card-icon">🚨</span>
              <h3>Emergency Contact</h3>
            </div>
            <div className="card-content">
              <div className="info-row">
                <span className="info-label">Contact Name:</span>
                <span className="info-value">{employee.emergency_contact_name || '-'}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Relationship:</span>
                <span className="info-value">{employee.emergency_contact_relationship || '-'}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Phone:</span>
                <span className="info-value">{employee.emergency_contact_phone || '-'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Child Records Sections */}
        <div className="child-sections">
          {/* Leave Details */}
          {renderChildSection(
            employee.leave_details,
            'Leave Details',
            'leave_details',
            ['From Date', 'To Date', 'Leave Type', 'Number of Days', 'Reason', 'Status'],
            {
              'From Date': 'from_date',
              'To Date': 'to_date',
              'Leave Type': 'leave_type',
              'Number of Days': 'number_of_days',
              'Reason': 'reason',
              'Status': 'status'
            }
          )}

          {/* Disciplinary Records */}
          {renderChildSection(
            employee.disciplinary_records,
            'Disciplinary Records',
            'disciplinary_records',
            ['Date of Incident', 'Incident Type', 'Severity', 'Action Taken', 'Remarks', 'Status'],
            {
              'Date of Incident': 'date_of_incident',
              'Incident Type': 'incident_type',
              'Severity': 'severity',
              'Action Taken': 'action_taken',
              'Remarks': 'remarks',
              'Status': 'status'
            }
          )}

          {/* Guarantees */}
          {renderChildSection(
            employee.guarantees,
            'Guarantees',
            'guarantees',
            ['Guaranteed Employee', 'Guarantee Type', 'Start Date', 'End Date', 'Status', 'Remarks'],
            {
              'Guaranteed Employee': 'guaranted_employee',
              'Guarantee Type': 'guaranteetype',
              'Start Date': 'start_date',
              'End Date': 'end_date',
              'Status': 'status',
              'Remarks': 'remarks'
            }
          )}

          {/* Medical Details */}
          {renderChildSection(
            employee.medical_details,
            'Medical Details',
            'medical_details',
            ['Medical Year',"Claim Date", 'Medical Max Limit', 'Medical Used', 'Medical Remain'],
            {
              'Medical Year': 'medical_year',
              'Claim Date': 'medical_claim_date',
              'Medical Max Limit': 'medical_max_limit',
              'Medical Used': 'medical_used',
              'Medical Remain': 'medica_remain'
            }
          )}

          {/* Performance Records */}
          {renderChildSection(
            employee.performance_records,
            'Performance Records',
            'performance_records',
            ['Period', 'Score', 'Rating', 'Remarks'],
            {
              'Period': 'period',
              'Score': 'score',
              'Rating': 'rating',
              'Remarks': 'remarks'
            }
          )}
        </div>
      </div>
    </div>
  );
};

export default DirectorEmployeeDetail;