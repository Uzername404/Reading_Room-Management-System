import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./resourcesmanagement.css";
import logo from "./assets/logo.png";
import { resourceService } from "./services/api";
import Header from "./assets/Header";

const ResourcesManagement = ({ onLogout, user }) => {
  const navigate = useNavigate();
  const [resources, setResources] = useState([]);
  const [filteredResources, setFilteredResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState({
    resource_id: "",
    title: "",
    author: "",
    resource_type: "",
    publication_year: "",
  });
  const [editingResource, setEditingResource] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchResources();
  }, []);

  useEffect(() => {
    if (searchTerm === "") {
      setFilteredResources(resources);
    } else {
      const lowerSearchTerm = searchTerm.toLowerCase();
      const filtered = resources.filter((resource) =>
        resource.resource_id.toString().toLowerCase().includes(lowerSearchTerm) ||
        resource.title.toLowerCase().includes(lowerSearchTerm) ||
        resource.author.toLowerCase().includes(lowerSearchTerm) ||
        resource.resource_type.toLowerCase().includes(lowerSearchTerm) ||
        resource.publication_year.toString().toLowerCase().includes(lowerSearchTerm) ||
        resource.status.toLowerCase().includes(lowerSearchTerm)
      );
      setFilteredResources(filtered);
    }
  }, [searchTerm, resources]);

  const fetchResources = async () => {
    try {
      setLoading(true);
      const data = await resourceService.getAll();
      setResources(data);
      setFilteredResources(data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch resources");
      console.error("Error fetching resources:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddResourceModal = () => {
    setFormData({
      resource_id: "",
      title: "",
      author: "",
      resource_type: "",
      publication_year: "",
    });
    setShowAddModal(true);
  };

  const handleEditResourceModal = (resource) => {
    setEditingResource(resource);
    setFormData({
      resource_id: resource.resource_id,
      title: resource.title,
      author: resource.author,
      resource_type: resource.resource_type,
      publication_year: resource.publication_year,
    });
    setShowEditModal(true);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setEditingResource(null);
    setFormData({
      resource_id: "",
      title: "",
      author: "",
      resource_type: "",
      publication_year: "",
    });
  };

  const handleSaveResource = async () => {
    try {
      if (showAddModal) {
        await resourceService.create(formData);
      } else if (showEditModal && editingResource) {
        await resourceService.update(editingResource.resource_id, formData);
      }
      handleCloseModal();
      fetchResources();
    } catch (err) {
      if (err.response && err.response.status === 403) {
        setError("Permission denied: You do not have rights to add or edit resources.");
      } else if (err.response && err.response.data) {
        setError(`Failed to save resource: ${JSON.stringify(err.response.data)}`);
      } else {
        setError("Failed to save resource");
      }
      console.error("Error saving resource:", err);
    }
  };

  const handleDeleteResource = async (resourceId) => {
    if (window.confirm("Are you sure you want to delete this resource?")) {
      try {
        await resourceService.delete(resourceId);
        fetchResources();
      } catch (err) {
        setError("Failed to delete resource");
        console.error("Error deleting resource:", err);
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

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

      {/* Modal for Add/Edit Resource */}
      {(showAddModal || showEditModal) && (
        <div className="modal">
          <div className="modal-content">
            <h2>{showAddModal ? "Add Resource" : "Edit Resource"}</h2>
            <input
              type="text"
              placeholder="Resource ID"
              value={formData.resource_id}
              onChange={(e) => setFormData({ ...formData, resource_id: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Author"
              value={formData.author}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              required
            />
            <select
              value={formData.resource_type}
              onChange={(e) => setFormData({ ...formData, resource_type: e.target.value })}
              required
            >
              <option value="">Select Resource Type</option>
              <option value="BOOK">Book</option>
              <option value="MAGAZINE">Magazine</option>
              <option value="NEWSPAPER">Newspaper</option>
              <option value="OTHER">Other</option>
            </select>
            <input
              type="number"
              min="1900"
              max="2099"
              step="1"
              placeholder="Publication Year"
              value={formData.publication_year}
              onChange={(e) => setFormData({ ...formData, publication_year: e.target.value })}
              required
            />
            <button className="save-user" onClick={handleSaveResource}>
              {showAddModal ? "Add Resource" : "Save Changes"}
            </button>
            <button onClick={handleCloseModal}>Close</button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="main-content">
        <Header onLogout={onLogout} />
        <div className="breadcrumb">
          <span>🏠 {'>'} <Link to="/dashboard">Home</Link></span> {'>'} <span>Resources</span>
        </div>
        <h1>
          Manage <span className="highlight">Resources</span>
        </h1>
        {error && <div className="error-message">{error}</div>}
        <div className="resources-list">
          <div className="table-header">
            <h3>Resources List</h3>
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button onClick={handleAddResourceModal}>Add new Resources</button>
          </div>
          <table className="resource-table">
            <thead>
              <tr>
                <th>Resource ID</th>
                <th>Title</th>
                <th>Author</th>
                <th>Type</th>
                <th>Year</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredResources.map((resource) => (
                <tr key={resource.resource_id}>
                  <td>{resource.resource_id}</td>
                  <td>{resource.title}</td>
                  <td>{resource.author}</td>
                  <td>{resource.resource_type}</td>
                  <td>{resource.publication_year}</td>
                  <td className={resource.status === "BORROWED" ? "status-borrowed" : "status-available"}>
                    {resource.status}
                  </td>
                  <td className="actionss">
                    <Link onClick={() => handleEditResourceModal(resource)}>Edit</Link>

                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="pagination">Showing 1 to {filteredResources.length} of {filteredResources.length} entries</div>
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

export default ResourcesManagement;
