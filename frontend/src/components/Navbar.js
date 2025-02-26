

import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Home, User } from 'lucide-react';
import '../styles/global.css';
import { useSelector } from 'react-redux';

const Navbar = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [token, setToken] = useState(null); 
  const [userName, setUserName] = useState(''); 

  // Check localStorage for token on initial render
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    let userData = localStorage.getItem('user');
    userData = JSON.parse(userData)
    setToken(storedToken);
    setUserName(userData?.name)
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove token on logout
    setToken(null); // Update state
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          <Link to="/" className="navbar-brand">
            <Home size={24} />
            <span>SocialApp</span>
          </Link>

          <div className="navbar-nav">
            {token ? ( // Check if token exists
              <>
                <div className="user-info">
                  <User size={20} />
                  <span>{userName}</span>
                </div>
                <button onClick={handleLogout} className="btn btn-danger">
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <div className="auth-buttons">
                <Link to="/login" className="btn btn-link">
                  Login
                </Link>
                <Link to="/signup" className="btn btn-primary">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
