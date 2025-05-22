import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../resourcesmanagement.css";
import logo from "../assets/logo.png";
import { userService } from "../services/api";
import Header from "./Header";
import useUsersModals from "../assets/useusersmodals"; // Import the useUsersModals hook

const UserManagement = ({ onLogout, user }) => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const {
    showUserModal,
    formData,
    setFormData,
    handleAddUserModal,
    handleCloseUserModal,
    handleSaveUser,
  } = useUsersModals(); // Using the custom hook to handle modal logic

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (searchTerm === "") {
      setFilteredUsers(users);
    } else {
      const lowerSearchTerm = searchTerm.toLowerCase();
      const filtered = users.filter((user) =>
        user.id.toString().toLowerCase().includes(lowerSearchTerm) ||
        user.last_name.toLowerCase().includes(lowerSearchTerm) ||
        user.first_name.toLowerCase().includes(lowerSearchTerm) ||
        user.email.toLowerCase().includes(lowerSearchTerm)
      );
      setFilteredUsers(filtered);
    }
  }, [searchTerm, users]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await userService.getAll();
      setUsers(data);
      setFilteredUsers(data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch users");
    } finally {
      setLoading(false);
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
          <Link to="/return">Return</Link>
          <Link to="/users" className="active">User</Link>
          <Link to="/generate-report">Generate Report</Link>
        </nav>
      </aside>

      {showUserModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Add User</h2>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
            <input
              type="text"
              name="first_name"
              placeholder="First Name"
              value={formData.first_name}
              onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
              required
            />
            <input
              type="text"
              name="last_name"
              placeholder="Last Name"
              value={formData.last_name}
              onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
            <input
              type="password"
              name="password2"
              placeholder="Confirm Password"
              value={formData.password2}
              onChange={(e) => setFormData({ ...formData, password2: e.target.value })}
              required
            />
            <button className="save-user" onClick={handleSaveUser}>Save User</button>
            <button onClick={handleCloseUserModal}>Close</button>
          </div>
        </div>
      )}

      <main className="main-content">
        <Header onLogout={onLogout} />
        <div className="breadcrumb">
          <span>🏠 {'>'} <Link to="/dashboard">Home</Link></span> {'>'} <span>Users</span>
        </div>
        <h1>
          Manage <span className="highlight">Users</span>
        </h1>
        {error && <div className="error-message">{error}</div>}
        <div className="resources-list">
          <div className="table-header">
            <h3>User List</h3>
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button onClick={handleAddUserModal}>Add User</button>
          </div>
          <table className="resource-table">
            <thead>
              <tr>
                <th>User ID</th>
                <th>Username</th>
                <th>Last Name</th>
                <th>First Name</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.username}</td>
                  <td>{user.last_name}</td>
                  <td>{user.first_name}</td>
                  <td>{user.email}</td>
                  <td>
                    <Link to={`/users/edit/${user.id}`}>Edit</Link> |{" "}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="pagination">Showing 1 to {filteredUsers.length} of {filteredUsers.length} users</div>
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

export default UserManagement;
