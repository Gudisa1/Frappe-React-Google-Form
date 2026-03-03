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
    setCurrentPage(1); // Reset page on search
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

  // Handle Delete
  const handleDelete = async (name) => {
    if (!window.confirm("Are you sure you want to delete this form?")) return;
    try {
      await deleteReportingForm(name);
      const updatedForms = forms.filter((f) => f.name !== name);
      setForms(updatedForms);
      setFilteredForms(updatedForms.filter((f) =>
        f.form_title.toLowerCase().includes(search.toLowerCase()) ||
        (f.reporting_period && f.reporting_period.toLowerCase().includes(search.toLowerCase())) ||
        (f.year && f.year.toString().includes(search)) ||
        (f.status && f.status.toLowerCase().includes(search.toLowerCase()))
      ));
    } catch (err) {
      console.error("Error deleting form:", err);
      alert("Failed to delete form: " + err.message);
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

  if (loading) return <p>Loading Reporting Forms...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

  return (
    <div style={{ maxWidth: "1200px", margin: "20px auto" }}>
      <h2>Reporting Forms</h2>

      {/* Search input */}
      <input
        type="text"
        placeholder="Search by title, period, year, status..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ marginBottom: "10px", padding: "5px", width: "300px" }}
      />

      {currentForms.length === 0 ? (
        <p>No forms found.</p>
      ) : (
        <>
          <table
            border="1"
            cellPadding="8"
            style={{ borderCollapse: "collapse", width: "100%" }}
          >
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
                  <td>{form.status}</td>
                  <td>
                    <button onClick={() => handleView(form.name)}>View</button>{" "}
                    <button onClick={() => handleEdit(form.name)}>Edit</button>{" "}
                    <button onClick={() => handleDelete(form.name)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination controls */}
          <div style={{ marginTop: "10px" }}>
            <button onClick={handlePrev} disabled={currentPage === 1}>
              Previous
            </button>{" "}
            <span>
              Page {currentPage} of {totalPages}
            </span>{" "}
            <button onClick={handleNext} disabled={currentPage === totalPages}>
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default FormList;