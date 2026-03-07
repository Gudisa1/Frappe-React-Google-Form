// import React, { useEffect, useState } from "react";
// import { getAllReportingForms, deleteReportingForm } from "../../api/datacollection";
// import { useNavigate } from "react-router-dom";
// import './FormList.css';

// const FormList = () => {
//   const [forms, setForms] = useState([]);
//   const [filteredForms, setFilteredForms] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [search, setSearch] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const formsPerPage = 20;

//   const navigate = useNavigate();

//   useEffect(() => {
//     async function loadForms() {
//       try {
//         setLoading(true);
//         const data = await getAllReportingForms();
//         setForms(data);
//         setFilteredForms(data);
//       } catch (err) {
//         console.error("Error loading forms:", err);
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     }
//     loadForms();
//   }, []);

//   // Handle search
//   useEffect(() => {
//     const lowerSearch = search.toLowerCase();
//     const filtered = forms.filter(
//       (f) =>
//         f.form_title.toLowerCase().includes(lowerSearch) ||
//         (f.reporting_period && f.reporting_period.toLowerCase().includes(lowerSearch)) ||
//         (f.year && f.year.toString().includes(lowerSearch)) ||
//         (f.status && f.status.toLowerCase().includes(lowerSearch))
//     );
//     setFilteredForms(filtered);
//     setCurrentPage(1); // Reset page on search
//   }, [search, forms]);

//   // Pagination calculations
//   const indexOfLastForm = currentPage * formsPerPage;
//   const indexOfFirstForm = indexOfLastForm - formsPerPage;
//   const currentForms = filteredForms.slice(indexOfFirstForm, indexOfLastForm);
//   const totalPages = Math.ceil(filteredForms.length / formsPerPage);

//   const handleNext = () => {
//     if (currentPage < totalPages) setCurrentPage(currentPage + 1);
//   };
//   const handlePrev = () => {
//     if (currentPage > 1) setCurrentPage(currentPage - 1);
//   };

//   // Handle Delete
//   const handleDelete = async (name) => {
//     if (!window.confirm("Are you sure you want to delete this form?")) return;
//     try {
//       await deleteReportingForm(name);
//       const updatedForms = forms.filter((f) => f.name !== name);
//       setForms(updatedForms);
//       setFilteredForms(updatedForms.filter((f) =>
//         f.form_title.toLowerCase().includes(search.toLowerCase()) ||
//         (f.reporting_period && f.reporting_period.toLowerCase().includes(search.toLowerCase())) ||
//         (f.year && f.year.toString().includes(search)) ||
//         (f.status && f.status.toLowerCase().includes(search.toLowerCase()))
//       ));
//     } catch (err) {
//       console.error("Error deleting form:", err);
//       alert("Failed to delete form: " + err.message);
//     }
//   };
// const handleView = (name) => {
//   const safeName = encodeURIComponent(name);
//   navigate(`/mr-dashboard/forms/${safeName}`);
// };

// const handleEdit = (name) => {
//   const safeName = encodeURIComponent(name);
//   navigate(`/mr-dashboard/forms/${safeName}/edit`);
// };

//   if (loading) return <p>Loading Reporting Forms...</p>;
//   if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

//   return (
//     <div style={{ maxWidth: "1200px", margin: "20px auto" }}>
//       <h2>Reporting Forms</h2>

//       {/* Search input */}
//       <input
//         type="text"
//         placeholder="Search by title, period, year, status..."
//         value={search}
//         onChange={(e) => setSearch(e.target.value)}
//         style={{ marginBottom: "10px", padding: "5px", width: "300px" }}
//       />

//       {currentForms.length === 0 ? (
//         <p>No forms found.</p>
//       ) : (
//         <>
//           <table
//             border="1"
//             cellPadding="8"
//             style={{ borderCollapse: "collapse", width: "100%" }}
//           >
//             <thead>
//               <tr>
//                 <th>Form Title</th>
//                 <th>Reporting Period</th>
//                 <th>Year</th>
//                 <th>Status</th>
//                 <th>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {currentForms.map((form) => (
//                 <tr key={form.name}>
//                   <td>{form.form_title}</td>
//                   <td>{form.reporting_period}</td>
//                   <td>{form.year}</td>
//                   <td>{form.status}</td>
//                   <td>
//                     <button onClick={() => handleView(form.name)}>View</button>{" "}
//                     <button onClick={() => handleEdit(form.name)}>Edit</button>{" "}
//                     <button onClick={() => handleDelete(form.name)}>Delete</button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>

//           {/* Pagination controls */}
//           <div style={{ marginTop: "10px" }}>
//             <button onClick={handlePrev} disabled={currentPage === 1}>
//               Previous
//             </button>{" "}
//             <span>
//               Page {currentPage} of {totalPages}
//             </span>{" "}
//             <button onClick={handleNext} disabled={currentPage === totalPages}>
//               Next
//             </button>
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default FormList;
import React, { useEffect, useState } from "react";
import { getAllReportingForms, deleteReportingForm } from "../../api/datacollection";
import { useNavigate } from "react-router-dom";
import './FormList.css';

const FormList = () => {
  const [forms, setForms] = useState([]);
  const [filteredForms, setFilteredForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    formName: null,
    confirmText: '',
    isDeleting: false,
    error: null
  });
  const formsPerPage = 20;

  const navigate = useNavigate();

  useEffect(() => {
    async function loadForms() {
      try {
        setLoading(true);
        const data = await getAllReportingForms();
        setForms(data);
        setFilteredForms(data);
      } catch (err) {
        console.error("Error loading forms:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadForms();
  }, []);

  // Handle search
  useEffect(() => {
    const lowerSearch = search.toLowerCase();
    const filtered = forms.filter(
      (f) =>
        f.form_title.toLowerCase().includes(lowerSearch) ||
        (f.reporting_period && f.reporting_period.toLowerCase().includes(lowerSearch)) ||
        (f.year && f.year.toString().includes(lowerSearch)) ||
        (f.status && f.status.toLowerCase().includes(lowerSearch))
    );
    setFilteredForms(filtered);
    setCurrentPage(1);
  }, [search, forms]);

  // Pagination calculations
  const indexOfLastForm = currentPage * formsPerPage;
  const indexOfFirstForm = indexOfLastForm - formsPerPage;
  const currentForms = filteredForms.slice(indexOfFirstForm, indexOfLastForm);
  const totalPages = Math.ceil(filteredForms.length / formsPerPage);

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };
  
  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  // Handle Delete with double confirmation
  const openDeleteModal = (name) => {
    setDeleteModal({
      isOpen: true,
      formName: name,
      confirmText: '',
      isDeleting: false,
      error: null
    });
  };

  const closeDeleteModal = () => {
    setDeleteModal({
      isOpen: false,
      formName: null,
      confirmText: '',
      isDeleting: false,
      error: null
    });
  };

  const confirmDelete = async () => {
    if (!deleteModal.formName || deleteModal.confirmText !== 'Delete') return;
    
    setDeleteModal(prev => ({ ...prev, isDeleting: true, error: null }));
    
    try {
      await deleteReportingForm(deleteModal.formName);
      
      const updatedForms = forms.filter((f) => f.name !== deleteModal.formName);
      setForms(updatedForms);
      setFilteredForms(updatedForms.filter((f) =>
        f.form_title.toLowerCase().includes(search.toLowerCase()) ||
        (f.reporting_period && f.reporting_period.toLowerCase().includes(search.toLowerCase())) ||
        (f.year && f.year.toString().includes(search)) ||
        (f.status && f.status.toLowerCase().includes(search.toLowerCase()))
      ));
      
      closeDeleteModal();
      
    } catch (err) {
      console.error("Error deleting form:", err);
      setDeleteModal(prev => ({ 
        ...prev, 
        isDeleting: false,
        error: err.message 
      }));
    }
  };

  const handleView = (name) => {
    const safeName = encodeURIComponent(name);
    navigate(`/mr-dashboard/forms/${safeName}`);
  };

  const handleEdit = (name) => {
    const safeName = encodeURIComponent(name);
    navigate(`/mr-dashboard/forms/${safeName}/edit`);
  };

  const clearSearch = () => {
    setSearch("");
  };

  if (loading) return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>Loading Reporting Forms...</p>
    </div>
  );
  
  if (error) return (
    <div className="error-container">
      <p>Error: {error}</p>
    </div>
  );

  return (
    <div className="formlist-container">
      <div className="formlist-card">
        <div className="formlist-header">
          <div className="header-left">
            <h1 className="formlist-title">Reporting Forms</h1>
            <p className="formlist-subtitle">Manage and monitor all your data collection forms</p>
          </div>
          
          <div className="stats-badge">
            <div className="stat-item">
              <span className="stat-value">{forms.length}</span>
              <span className="stat-label">Total</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{forms.filter(f => f.status === 'Published').length}</span>
              <span className="stat-label">Published</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{forms.filter(f => f.status === 'Draft').length}</span>
              <span className="stat-label">Drafts</span>
            </div>
          </div>
        </div>

        <div className="search-section">
          <div className="search-wrapper">
            <span className="search-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            </span>
            <input
              type="text"
              className="search-input"
              placeholder="Search by title, period, year, status..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button className="search-clear" onClick={clearSearch}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            )}
          </div>
        </div>

        {currentForms.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <line x1="9" y1="9" x2="15" y2="15"/>
                <line x1="15" y1="9" x2="9" y2="15"/>
              </svg>
            </div>
            <h2 className="empty-title">No forms found</h2>
            <p className="empty-message">
              {search ? "Try adjusting your search criteria" : "Get started by creating your first reporting form"}
            </p>
          </div>
        ) : (
          <>
            <div className="table-container">
              <table className="premium-table">
                <thead>
                  <tr>
                    <th>Form Title</th>
                    <th>Reporting Period</th>
                    <th>Year</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentForms.map((form) => (
                    <tr key={form.name}>
                      <td>{form.form_title}</td>
                      <td>{form.reporting_period}</td>
                      <td>{form.year}</td>
                      <td>
                        <span className={`status-badge ${form.status?.toLowerCase() || 'draft'}`}>
                          {form.status || 'Draft'}
                        </span>
                      </td>
                      <td>
                        <div className="actions-cell">
                          <button 
                            className="action-btn view" 
                            onClick={() => handleView(form.name)}
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                              <circle cx="12" cy="12" r="3"/>
                            </svg>
                            View
                          </button>
                          <button 
                            className="action-btn edit" 
                            onClick={() => handleEdit(form.name)}
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M20 14.66V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5.34"/>
                              <polygon points="18 2 22 6 12 16 8 16 8 12 18 2"/>
                            </svg>
                            Edit
                          </button>
                          <button 
                            className="action-btn delete" 
                            onClick={() => openDeleteModal(form.name)}
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <polyline points="3 6 5 6 21 6"/>
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                            </svg>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="pagination">
                <button 
                  className="pagination-btn" 
                  onClick={handlePrev} 
                  disabled={currentPage === 1}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="15 18 9 12 15 6"/>
                  </svg>
                  Previous
                </button>
                
                <span className="pagination-info">
                  Page {currentPage} of {totalPages}
                </span>
                
                <button 
                  className="pagination-btn" 
                  onClick={handleNext} 
                  disabled={currentPage === totalPages}
                >
                  Next
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal.isOpen && (
        <div className="modal-overlay" onClick={closeDeleteModal}>
          <div className="delete-modal" onClick={e => e.stopPropagation()}>
            <div className="delete-modal-header">
              <div className="delete-icon-wrapper">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <polyline points="3 6 5 6 21 6"/>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                </svg>
              </div>
              <button className="delete-modal-close" onClick={closeDeleteModal}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            
            <div className="delete-modal-body">
              <h3 className="delete-modal-title">Delete Reporting Form</h3>
              <p className="delete-modal-message">
                Are you sure you want to delete this form?
              </p>
              <p className="delete-modal-warning">
                This action cannot be undone. All data associated with this form will be permanently removed.
              </p>
              
              <div className="delete-confirm-input-group">
                <label htmlFor="confirmDelete" className="delete-confirm-label">
                  Type <span className="delete-confirm-text">"Delete"</span> to confirm
                </label>
                <input
                  id="confirmDelete"
                  type="text"
                  className="delete-confirm-input"
                  placeholder="Type Delete here"
                  value={deleteModal.confirmText}
                  onChange={(e) => setDeleteModal({
                    ...deleteModal, 
                    confirmText: e.target.value
                  })}
                  autoFocus
                />
              </div>
              
              {deleteModal.error && (
                <div className="delete-modal-error">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12"/>
                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  {deleteModal.error}
                </div>
              )}
            </div>
            
            <div className="delete-modal-footer">
              <button 
                className="delete-modal-cancel" 
                onClick={closeDeleteModal}
                disabled={deleteModal.isDeleting}
              >
                Cancel
              </button>
              <button 
                className="delete-modal-confirm" 
                onClick={confirmDelete}
                disabled={deleteModal.isDeleting || deleteModal.confirmText !== 'Delete'}
              >
                {deleteModal.isDeleting ? (
                  <>
                    <span className="delete-spinner"></span>
                    Deleting...
                  </>
                ) : (
                  'Yes, Delete Form'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormList;