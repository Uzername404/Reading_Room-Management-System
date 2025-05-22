import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "../resourcesmanagement.css";
import logo from "../assets/logo.png";
import { borrowService } from "../services/api";
import Header from "./Header";


const BorrowManagement = ({ onLogout, user }) => {
  const location = useLocation(); // Get location object
  const [borrows, setBorrows] = useState([]);
  const [filteredBorrows, setFilteredBorrows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showBorrowModal, setShowBorrowModal] = useState(false);
  const [formData, setFormData] = useState({
    student: "",
    resource: "",
    due_date: "",
  });


  useEffect(() => {
    fetchBorrows();
    // Parse URL parameters when component mounts
    const searchParams = new URLSearchParams(location.search);
    const studentId = searchParams.get("student_id");


    if (studentId) {
      setFormData((prev) => ({
        ...prev,
        student: studentId,
      }));


      // Optionally open the modal automatically if student ID is provided
      setShowBorrowModal(true);
    }
  }, [location.search]);


  useEffect(() => {
    if (searchTerm === "") {
      setFilteredBorrows(borrows);
    } else {
      const lowerSearchTerm = searchTerm.toLowerCase();
      const filtered = borrows.filter(
        (borrow) =>
          (borrow.student.first_name + " " + borrow.student.last_name)
            .toLowerCase()
            .includes(lowerSearchTerm) ||
          borrow.resource.title.toLowerCase().includes(lowerSearchTerm) ||
          borrow.borrow_date.toLowerCase().includes(lowerSearchTerm) ||
          borrow.due_date.toLowerCase().includes(lowerSearchTerm) ||
          borrow.status.toLowerCase().includes(lowerSearchTerm)
      );
      setFilteredBorrows(filtered);
    }
  }, [searchTerm, borrows]);


  const fetchBorrows = async () => {
    try {
      setLoading(true);
      const data = await borrowService.getAll();
      setBorrows(data);
      setFilteredBorrows(data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch borrow records");
    } finally {
      setLoading(false);
    }
  };


  const handleBorrowModal = () => {
    setFormData({ student_id: "", resource_id: "", due_date: "" });
    setShowBorrowModal(true);
  };


  const handleCloseModal = () => {
    setShowBorrowModal(false);
    setFormData({ student_id: "", resource_id: "", due_date: "" });
  };


  const handleSaveBorrow = async () => {
    try {
      if (!formData.student || !formData.resource || !formData.due_date) {
        setError("Please fill in all fields");
        return;
      }


      // Update field names to match backend expectations
      const borrowData = {
        student_id: formData.student, // Changed to student_id
        resource_id: formData.resource, // Changed to resource_id
        due_date: formData.due_date,
      };


      await borrowService.create(borrowData); // Send correct data structure
      handleCloseModal();
      fetchBorrows();
    } catch (err) {
      setError("Failed to save borrow record");
    }
  };


  if (loading) {
    return <div>Loading...</div>;
  }


  return (
    <div className="resources-wrapper">
      <aside className="sidebar">
        <div className="sidebar-header">
          <img src={logo} alt="Logo" className="logo" />
          <h2>Reading Room</h2>
        </div>
        <div className="user-section">
          <div className="avatar"></div>
          <div>
            <p className="username">{user?.fullName || "User"}</p>
            <p className="status">Online</p>
          </div>
        </div>
        <nav className="nav-links">
          <h4>REPORTS</h4>
          <Link to="/dashboard">Dashboard</Link>
          <h4>MANAGE</h4>
          <Link to="/resources">Resources</Link>
          <Link to="/students">Student</Link>
          <Link to="/borrow" className="active">
            Borrow
          </Link>
          <Link to="/return">Return</Link>
          <Link to="/users">User</Link>
          <Link to="/generate-report">Generate Report</Link>
        </nav>
      </aside>


      {showBorrowModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Borrow Resource</h2>
            <input
              type="text"
              placeholder="Student ID"
              value={formData.student}
              onChange={(e) =>
                setFormData({ ...formData, student: e.target.value })
              }
              required
            />
            <input
              type="text"
              placeholder="Resource ID"
              value={formData.resource}
              onChange={(e) =>
                setFormData({ ...formData, resource: e.target.value })
              }
              required
            />
            <input
              type="date"
              placeholder="Due Date"
              value={formData.due_date}
              onChange={(e) =>
                setFormData({ ...formData, due_date: e.target.value })
              }
              required
            />
            <button className="save-user" onClick={handleSaveBorrow}>
              Borrow Resource
            </button>
            <button onClick={handleCloseModal}>Close</button>
          </div>
        </div>
      )}


      <main className="main-content">
        <Header onLogout={onLogout} />
        <div className="breadcrumb">
          <span>
            🏠 {">"} <Link to="/dashboard">Home</Link>
          </span>{" "}
          {">"} <span>Borrow Records</span>
        </div>
        <h1>
          Manage <span className="highlight">Borrow Records</span>
        </h1>
        {error && <div className="error-message">{error}</div>}
        <div className="resources-list">
          <div className="table-header">
            <h3>Borrow List</h3>
            <input
              type="text"
              placeholder="Search borrow records..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button onClick={handleBorrowModal}>Borrow Resource</button>
          </div>
          <table className="resource-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Resource</th>
                <th>Borrow Date</th>
                <th>Due Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredBorrows.map((borrow) => (
                <tr key={borrow.id}>
                  <td>
                    {borrow.student.first_name} {borrow.student.last_name}
                  </td>
                  <td>{borrow.resource.title}</td>
                  <td>{borrow.borrow_date}</td>
                  <td>{borrow.due_date}</td>
                  <td>{borrow.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="pagination">
            Showing 1 to {filteredBorrows.length} of {filteredBorrows.length}{" "}
            entries
          </div>
        </div>
        <footer>
          <p>
            Copyright © 2025 Reading Room Management Information System. All
            rights reserved.
          </p>
        </footer>
      </main>
    </div>
  );
};


export default BorrowManagement;
