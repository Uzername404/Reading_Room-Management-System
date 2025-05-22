import React, { useState } from "react";

import "./loginpage.css";
import logo from "../assets/logo.png";

const LoginPage = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(username, password);
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <img src={logo} alt="Logo" className="login-logo" />
        <h1 className="login-title">Reading Room</h1>
        <p className="login-subtitle">Management Information System</p>
      </div>
      <div className="login-right">
        <h2 className="login-heading">Login</h2>
        <p className="login-instructions">Please enter login details</p>
        <form className="login-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="username"
            className="login-input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="password"
            className="login-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="login-button">
            Log-in
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;