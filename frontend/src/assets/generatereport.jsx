import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { jsPDF } from "jspdf";
import "../resourcesmanagement.css";
import logo from "../assets/logo.png";
import { borrowService, returnService } from "../services/api";
import Header from "./Header";

const GenerateReport = ({ onLogout, user }) => {
  const [borrowData, setBorrowData] = useState([]);
  const [returnData, setReturnData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [borrows, returns] = await Promise.all([
          borrowService.getAll(),
          returnService.getAll(),
        ]);
        setBorrowData(borrows);
        setReturnData(returns);
        setError(null);
      } catch (err) {
        setError("Failed to fetch report data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Combine borrow and return data for the report with nested field access
  const reportData = [
    ...borrowData.map((b) => ({
      type: "Borrow",
      date: b.borrow_date,
      student_id: b.student?.student_id,
      name: b.student ? `${b.student.first_name} ${b.student.last_name}` : "",
      resource_id: b.resource?.resource_id,
      title: b.resource?.title,
    })),
    ...returnData.map((r) => ({
      type: "Return",
      date: r.return_date,
      student_id: r.borrow_record?.student?.student_id,
      name: r.borrow_record ? `${r.borrow_record.student.first_name} ${r.borrow_record.student.last_name}` : "",
      resource_id: r.borrow_record?.resource?.resource_id,
      title: r.borrow_record?.resource?.title,
    })),
  ];

  // Function to generate PDF
  const generatePDF = () => {
    const doc = new jsPDF();

    // Add logo to PDF (Optional)
    doc.addImage(logo, 'PNG', 10, 10, 50, 50);

    // Add Title
    doc.setFontSize(18);
    doc.text("Reading Room Report", 80, 30);

    // Set Table Column Headers
    doc.setFontSize(12);
    doc.text("Type", 10, 60);
    doc.text("Date", 30, 60);
    doc.text("Student ID", 60, 60);
    doc.text("Name", 90, 60);
    doc.text("Resource ID", 130, 60);
    doc.text("Title", 160, 60);

    // Add Table Data
    let yPosition = 70; // Start y position for table data
    reportData.forEach((row) => {
      doc.text(row.type, 10, yPosition);
      doc.text(String(row.date), 30, yPosition);
      doc.text(String(row.student_id), 60, yPosition);
      doc.text(String(row.name), 90, yPosition);
      doc.text(String(row.resource_id), 130, yPosition);
      doc.text(String(row.title), 160, yPosition);
      yPosition += 10;
      if (yPosition > 270) {
        doc.addPage();
        yPosition = 20;
      }
    });

    // Save the generated PDF
    doc.save("report.pdf");
  };

  return (
    <div className="resources-wrapper">
      {/* Sidebar */}
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
          <Link to="/return">Return</Link>
          <Link to="/users">User</Link>
          <Link to="/generate-report" className="active">Generate Report</Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <Header onLogout={onLogout} />
        <div className="breadcrumb">
          <span>🏠 <Link to="/dashboard">Home</Link></span> &gt; <span>Generate Report</span>
        </div>
        <h1>
          Generate <span className="highlight">Reports</span>
        </h1>
        <div className="resources-list">
          <div className="table-header">
            <h3>Report List</h3>
            <div style={{ display: "flex", gap: "10px" }}>
              <input type="text" placeholder="Search..." />
              <button onClick={generatePDF}>Generate PDF</button>
            </div>
          </div>
          {loading ? (
            <div>Loading...</div>
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : (
            <table className="resource-table">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Date</th>
                  <th>Student ID</th>
                  <th>Name</th>
                  <th>Resource ID</th>
                  <th>Title</th>
                </tr>
              </thead>
              <tbody>
                {reportData.map((row, idx) => (
                  <tr key={idx}>
                    <td>{row.type}</td>
                    <td>{row.date}</td>
                    <td>{row.student_id}</td>
                    <td>{row.name}</td>
                    <td>{row.resource_id}</td>
                    <td>{row.title}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <div className="pagination">Showing 1 to {reportData.length} of {reportData.length} entries</div>
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

export default GenerateReport;
