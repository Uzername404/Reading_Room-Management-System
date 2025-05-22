import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../resourcesmanagement.css";
import logo from "../assets/logo.png";
import { returnService, borrowService } from "../services/api";
import Header from "./Header";

const ReturnManagement = ({ onLogout, user }) => {
  const [returns, setReturns] = useState([]);
  const [filteredReturns, setFilteredReturns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [formData, setFormData] = useState({
    borrow_record_id: "",
    condition_notes: "",
  });
  const [activeBorrows, setActiveBorrows] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchReturns();
    fetchActiveBorrows();
  }, []);

  const fetchActiveBorrows = async () => {
    try {
      const data = await borrowService.getAll({ status: 'ACTIVE' });
      // Filter explicitly on frontend as fallback
      const filtered = data.filter(borrow => borrow.status === 'ACTIVE');
      setActiveBorrows(filtered);
    } catch (err) {
      console.error("Failed to fetch active borrows", err);
    }
  };

  useEffect(() => {
    if (searchTerm === "") {
      setFilteredReturns(returns);
    } else {
      const lowerSearchTerm = searchTerm.toLowerCase();
      const filtered = returns.filter((record) => {
        const studentName = record.borrow_record ? `${record.borrow_record.student.first_name} ${record.borrow_record.student.last_name}` : "";
        return (
          record.return_date.toLowerCase().includes(lowerSearchTerm) ||
          (record.borrow_record?.student?.student_id || "").toLowerCase().includes(lowerSearchTerm) ||
          studentName.toLowerCase().includes(lowerSearchTerm) ||
          (record.borrow_record?.resource?.resource_id || "").toLowerCase().includes(lowerSearchTerm) ||
          (record.borrow_record?.resource?.title || "").toLowerCase().includes(lowerSearchTerm)
        );
      });
      setFilteredReturns(filtered);
    }
  }, [searchTerm, returns]);

  const fetchReturns = async () => {
    try {
      setLoading(true);
      const data = await returnService.getAll();
      setReturns(data);
      setFilteredReturns(data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch returned resources");
    } finally {
      setLoading(false);
    }
  };

  const handleReturnModal = () => {
    setFormData({ student_id: "", resource_id: "", title: "" });
    setShowReturnModal(true);
  };

  const handleCloseModal = () => {
    setShowReturnModal(false);
    setFormData({ student_id: "", resource_id: "", title: "" });
  };

  const handleSaveReturn = async () => {
    try {
      await returnService.create(formData);
      handleCloseModal();
      fetchReturns();
    } catch (err) {
      setError("Failed to save return record");
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
          <Link to="/borrow">Borrow</Link>
          <Link to="/return" className="active">Return</Link>
          <Link to="/users">User</Link>
          <Link to="/generate-report">Generate Report</Link>
        </nav>
      </aside>

      {showReturnModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Return Resource</h2>
            <select
              value={formData.borrow_record_id}
              onChange={(e) => setFormData({ ...formData, borrow_record_id: e.target.value })}
              required
            >
              <option value="" disabled>Select Borrow Record</option>
              {activeBorrows.map((borrow) => (
                <option key={borrow.id} value={borrow.id}>
                  {borrow.student.first_name} {borrow.student.last_name} - {borrow.resource.title} (Due: {borrow.due_date})
                </option>
              ))}
            </select>
            <textarea
              placeholder="Condition Notes (optional)"
              value={formData.condition_notes}
              onChange={(e) => setFormData({ ...formData, condition_notes: e.target.value })}
            />
            <button className="save-user" onClick={handleSaveReturn}>Return Resource</button>
            <button onClick={handleCloseModal}>Close</button>
          </div>
        </div>
      )}

      <main className="main-content">
        <Header onLogout={onLogout} />
        <div className="breadcrumb">
          <span>🏠 {'>'} <Link to="/dashboard">Home</Link></span> {'>'} <span>Return Management</span>
        </div>
        <h1>
          Manage <span className="highlight">Returned Resources</span>
        </h1>
        {error && <div className="error-message">{error}</div>}
        <div className="resources-list">
          <div className="table-header">
            <h3>Returned Resources List</h3>
            <input
              type="text"
              placeholder="Search returned resources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button onClick={handleReturnModal}>Return Resource</button>
          </div>
          <table className="resource-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Student ID</th>
                <th>Name</th>
                <th>Resource ID</th>
                <th>Title</th>
              </tr>
            </thead>
            <tbody>
              {filteredReturns.map((record, index) => (
                <tr key={record.id || index}>
                  <td>{record.return_date}</td>
                  <td>{record.borrow_record?.student?.student_id}</td>
                  <td>{record.borrow_record ? `${record.borrow_record.student.first_name} ${record.borrow_record.student.last_name}` : ""}</td>
                  <td>{record.borrow_record?.resource?.resource_id}</td>
                  <td>{record.borrow_record?.resource?.title}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="pagination">Showing 1 to {filteredReturns.length} of {filteredReturns.length} entries</div>
        </div>
        <footer>
          <p>
            Copyright © 2025 Reading Room Management Information System. All rights reserved.
          </p>
        </footer>
      </main>
    </div>
  );
};

export default ReturnManagement;
