import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./resourcesmanagement.css";
import logo from "./assets/logo.png";
import { resourceService } from "./services/api";
import Header from "./assets/Header";

const ResourcesManagement = ({ onLogout, user }) => {
  // ... existing code ...
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
          <Link to="/resources" className="active">Resources</Link>
          <Link to="/students">Student</Link>
          <Link to="/borrow">Borrow</Link>
          <Link to="/return">Return</Link>
          <Link to="/users">User</Link>
          <Link to="/generate-report">Generate Report</Link>
        </nav>
      </aside>
      {/* Main Content */}
      <main className="main-content">
        <Header onLogout={onLogout} />
        {/* ... rest of the main content ... */}
      </main>
    </div>
  );
};

export default ResourcesManagement;
