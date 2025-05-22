import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import LoginPage from "./assets/loginpage";
import Dashboard from "./assets/dashboard";
import ResourcesManagement from "./resourcesmanagement";
import StudentManagement from "./assets/studentmanagement";
import BorrowManagement from "./assets/borrowmanagement";
import ReturnManagement from "./assets/returnmanagement";
import UserManagement from "./assets/usermanagement";
import GenerateReport from "./assets/generatereport";
import { authService } from "./services/api";

const LoginWrapper = ({ onLogin }) => {
  const navigate = useNavigate();

  const handleLogin = async (username, password) => {
    try {
      const user = await authService.login(username, password);
      if (user) {
        onLogin();
        navigate("/resources");
      }
    } catch (error) {
      alert(error.response?.data?.error || "Invalid login credentials!");
    }
  };

  return <LoginPage onLogin={handleLogin} />;
};

// Protected Route Component
const ProtectedRoute = ({ isLoggedIn, children }) => {
  return isLoggedIn ? children : <Navigate to="/" />;
};

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (user) {
      setIsLoggedIn(true);
    }
    setLoading(false);
  }, []);

  const handleLogout = async () => {
    try {
      await authService.logout();
      setIsLoggedIn(false);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

 

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginWrapper onLogin={() => setIsLoggedIn(true)} />} />
        <Route
          path="/resources"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <ResourcesManagement onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <Dashboard onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/students"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <StudentManagement onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/borrow"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <BorrowManagement onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/return"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <ReturnManagement onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <UserManagement onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/generate-report"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <GenerateReport onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
