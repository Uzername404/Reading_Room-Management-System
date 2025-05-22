import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import '../resourcesmanagement.css'; // Shared CSS
import logo from '../assets/logo.png';
import { studentService, resourceService, borrowService, returnService } from '../services/api';

const Dashboard = ({ onLogout, user }) => {
  const [counts, setCounts] = useState({
    students: 0,
    resources: 0,
    borrows: 0,
    returns: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        setLoading(true);
        const [students, resources, borrows, returns] = await Promise.all([
          studentService.getAll(),
          resourceService.getAll(),
          borrowService.getAll(),
          returnService.getAll(),
        ]);
        setCounts({
          students: students.length,
          resources: resources.length,
          borrows: borrows.length,
          returns: returns.length,
        });
        setError(null);
      } catch (err) {
        setError('Failed to fetch dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchCounts();
  }, []);

  const handleLogoutClick = () => {
    if (window.confirm('Do you want to log out?')) {
      if (onLogout) onLogout();
      navigate('/');
    }
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
          <NavLink to="/dashboard" className={({ isActive }) => isActive ? "active" : ""}>Dashboard</NavLink>
          <h4>MANAGE</h4>
          <NavLink to="/resources" className={({ isActive }) => isActive ? "active" : ""}>Resources</NavLink>
          <NavLink to="/students" className={({ isActive }) => isActive ? "active" : ""}>Student</NavLink>
          <NavLink to="/borrow" className={({ isActive }) => isActive ? "active" : ""}>Borrow</NavLink>
          <NavLink to="/return" className={({ isActive }) => isActive ? "active" : ""}>Return</NavLink>
          <NavLink to="/users" className={({ isActive }) => isActive ? "active" : ""}>User</NavLink>
          <NavLink to="/generate-report" className={({ isActive }) => isActive ? "active" : ""}>Generate Report</NavLink>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <div className="header">
          <p style={{ cursor: 'pointer', fontWeight: 'bold' }} onClick={handleLogoutClick} title="Click to log out">{user?.fullName || "User"}</p>
        </div>
        <div className="breadcrumb">
          <span>🏠 Dashboard</span>
        </div>
        <h1>
          Welcome to the <span className="highlight">Dashboard</span>
        </h1>
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : (
          <section className="dashboard-summary">
            <div className="summary-box">
              <h3>{counts.students}</h3>
              <p className="summary-count">Total Students</p>
            </div>
            <div className="summary-box">
              <h3>{counts.resources}</h3>
              <p className="summary-count">Total Resources</p>
            </div>
            <div className="summary-box">
              <h3>{counts.borrows}</h3>
              <p className="summary-count">Total Borrow</p>
            </div>
            <div className="summary-box">
              <h3>{counts.returns}</h3>
              <p className="summary-count">Total Return</p>
            </div>
          </section>
        )}
        <footer>
          <p>
            Copyright © 2025 Reading Room Management Information System. All rights reserved.
          </p>
        </footer>
      </main>
    </div>
  );
};

export default Dashboard;
