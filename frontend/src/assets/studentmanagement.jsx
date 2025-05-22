import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../resourcesmanagement.css";
import QRCode from "react-qr-code";
import logo from "../assets/logo.png";
import { studentService } from "../services/api";
import Header from "./Header";


const StudentManagement = ({ onLogout, user }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showQRCodeModal, setShowQRCodeModal] = useState(false);
  const [qrData, setQrData] = useState(null);
  const [formData, setFormData] = useState({
    student_id: "",
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
  });
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingStudent, setEditingStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");


  useEffect(() => {
    fetchStudents();
  }, []);


  useEffect(() => {
    if (searchTerm === "") {
      setFilteredStudents(students);
    } else {
      const lowerSearchTerm = searchTerm.toLowerCase();
      const filtered = students.filter(
        (student) =>
          student.student_id.toLowerCase().includes(lowerSearchTerm) ||
          student.first_name.toLowerCase().includes(lowerSearchTerm) ||
          student.last_name.toLowerCase().includes(lowerSearchTerm) ||
          student.phone.toLowerCase().includes(lowerSearchTerm) ||
          student.email.toLowerCase().includes(lowerSearchTerm)
      );
      setFilteredStudents(filtered);
    }
  }, [searchTerm, students]);


  const fetchStudents = async () => {
    try {
      setLoading(true);
      const data = await studentService.getAll();
      setStudents(data);
      setFilteredStudents(data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch students");
    } finally {
      setLoading(false);
    }
  };


  const generateQRData = (student) => {
    return {
      student_id: student.student_id,
      first_name: student.first_name,
      last_name: student.last_name,
      phone: student.phone,
      // email: student.email,
      timestamp: new Date().toISOString(),
    };
  };


  const handleAddStudentModal = () => {
    setFormData({
      student_id: "",
      first_name: "",
      last_name: "",
      phone: "",
      email: "",
    });
    setShowAddModal(true);
  };


  const handleEditStudentModal = (student) => {
    setEditingStudent(student);
    setFormData({
      student_id: student.student_id,
      first_name: student.first_name,
      last_name: student.last_name,
      phone: student.phone,
      email: student.email,
    });
    setShowEditModal(true);
  };


  const handleCloseModal = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setShowQRCodeModal(false);
    setEditingStudent(null);
    setFormData({
      student_id: "",
      first_name: "",
      last_name: "",
      phone: "",
      email: "",
    });
  };


  const handleSaveStudent = async () => {
    try {
      let savedStudent;
      if (showAddModal) {
        savedStudent = await studentService.create(formData);
      } else if (showEditModal && editingStudent) {
        savedStudent = await studentService.update(
          editingStudent.student_id,
          formData
        );
      }


      handleCloseModal();
      fetchStudents();


      // Show QR code after successful save
      if (savedStudent) {
        setQrData(generateQRData(savedStudent));
        setShowQRCodeModal(true);
      }
    } catch (err) {
      setError("Failed to save student");
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
          <Link to="/students" className="active">
            Student
          </Link>
          <Link to="/borrow">Borrow</Link>
          <Link to="/return">Return</Link>
          <Link to="/users">User</Link>
          <Link to="/generate-report">Generate Report</Link>
        </nav>
      </aside>


      {(showAddModal || showEditModal) && (
        <div className="modal">
          <div className="modal-content">
            <h2>{showAddModal ? "Add Student" : "Edit Student"}</h2>
            <input
              type="text"
              placeholder="Student ID"
              value={formData.student_id}
              onChange={(e) =>
                setFormData({ ...formData, student_id: e.target.value })
              }
              required
            />
            <input
              type="text"
              placeholder="First Name"
              value={formData.first_name}
              onChange={(e) =>
                setFormData({ ...formData, first_name: e.target.value })
              }
              required
            />
            <input
              type="text"
              placeholder="Last Name"
              value={formData.last_name}
              onChange={(e) =>
                setFormData({ ...formData, last_name: e.target.value })
              }
              required
            />
            <input
              type="text"
              placeholder="Phone"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
            <button className="save-user" onClick={handleSaveStudent}>
              {showAddModal ? "Add Student" : "Save Changes"}
            </button>
            <button onClick={handleCloseModal}>Close</button>
          </div>
        </div>
      )}


      {showQRCodeModal && qrData && (
        <div className="modal">
          <div className="modal-content qr-modal">
            <h2>Student QR Code</h2>
            <div className="qr-code-container">
              <QRCode
                // value={qrData}
                value={`http://172.20.10.2:5173/borrow?student_id=${qrData.student_id}&first_name=${qrData.first_name}`}
                size={200}
                level="H" // High error correction
              />
            </div>
            <p>Scan this QR code for future purposes</p>
            <button onClick={handleCloseModal}>Close</button>
          </div>
        </div>
      )}


      <main className="main-content">
        <Header onLogout={onLogout} />
        <div className="breadcrumb">
          <span>
            🏠 <Link to="/dashboard">Home</Link>
          </span>{" "}
          &gt; <span>Students</span>
        </div>
        <h1>
          Manage <span className="highlight">Students</span>
        </h1>
        {error && <div className="error-message">{error}</div>}
        <div className="resources-list">
          <div className="table-header">
            <h3>Student List</h3>
            <input
              type="text"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button onClick={handleAddStudentModal}>Add new Student</button>
          </div>
          <table className="resource-table">
            <thead>
              <tr>
                <th>Student ID</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <tr key={student.student_id}>
                  <td>{student.student_id}</td>
                  <td>{student.first_name}</td>
                  <td>{student.last_name}</td>
                  <td>{student.phone}</td>
                  <td>{student.email}</td>
                  <td>
                    <button
                      className="action-button"
                      onClick={() => handleEditStudentModal(student)}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="pagination">
            Showing 1 to {filteredStudents.length} of {filteredStudents.length}{" "}
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


export default StudentManagement;
