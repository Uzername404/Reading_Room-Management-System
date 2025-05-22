import React from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';

const Header = ({ onLogout }) => {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();
  const username = user?.username || user?.first_name || user?.name || 'User';

  const handleLogoutClick = () => {
    if (window.confirm('Do you want to log out?')) {
      if (onLogout) onLogout();
      navigate('/');
    }
  };

  return (
    <div className="header">
      <p
        style={{ cursor: 'pointer', fontWeight: 'bold' }}
        onClick={handleLogoutClick}
        title="Click to log out"
      >
        {username}
      </p>
    </div>
  );
};

export default Header; 