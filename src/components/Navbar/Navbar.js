import React, { useState } from 'react';
import { Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.js';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [isNavCollapsed, setIsNavCollapsed] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    logout(); // Use the logout function from context
    setIsDropdownOpen(false);
    navigate('/'); // Redirect to home page after logout
  };

  return (
    <nav className="navbar navbar-expand-lg bg-primary navbar-dark py-3 shadow-sm">
      <div className="container">
        <a className="navbar-brand fw-bold" href="/">
          Link IT
        </a>

        <button
          className="navbar-toggler border-0"
          type="button"
          onClick={() => setIsNavCollapsed(!isNavCollapsed)}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`${isNavCollapsed ? 'collapse' : ''} navbar-collapse`}>
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <a className="nav-link px-3 active" href="/events">Events</a>
            </li>
            <li className="nav-item">
              <a className="nav-link px-3 active" href="/discover">Discover</a>
            </li>
            <li className="nav-item">
              <a className="nav-link px-3 active" href="/community">Community</a>
            </li>
            <li className="nav-item">
              <a className="nav-link px-3 active" href="/dashboard">Dashboard</a>
            </li>
          </ul>

          <div className="d-flex align-items-center gap-3">
            {!isAuthenticated ? (
              <div className="d-flex gap-2">
                <a href="/login" className="btn btn-outline-light px-4">Login</a>
                <a href="/register" className="btn btn-light px-4">Register</a>
              </div>
            ) : (
              <div className="d-flex align-items-center gap-3">
                <button className="btn btn-link text-light p-0 position-relative">
                  <Bell size={20} />
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    3
                  </span>
                </button>

                <div className="dropdown">
                  <button
                    className="btn btn-link text-light text-decoration-none dropdown-toggle d-flex align-items-center gap-2"
                    type="button"
                    onClick={toggleDropdown}
                    aria-expanded={isDropdownOpen}
                  >
                    <span className="d-none d-lg-inline">{user?.username || user?.email}</span>
                  </button>
                  {isDropdownOpen && (
                    <ul className="dropdown-menu dropdown-menu-end shadow-sm border-0 mt-2 show">
                      <li><a className="dropdown-item py-2" href="/profile">My Profile</a></li>
                      <li><a className="dropdown-item py-2" href="/settings">Settings</a></li>
                      <li><hr className="dropdown-divider" /></li>
                      <li>
                        <button
                          className="dropdown-item py-2 text-danger"
                          onClick={handleLogout}
                        >
                          Logout
                        </button>
                      </li>
                    </ul>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;