import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./loginpage"; // Adjust the path if necessary
import Dashboard from "./dashboard"; // Adjust the path if necessary
import ResourcesManagement from "../resourcesmanagement"; // Adjust the path if necessary

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Redirect root to Dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/resources" element={<ResourcesManagement />} />
        {/* Add other routes as needed */}
      </Routes>
    </Router>
  );
};

export default App;