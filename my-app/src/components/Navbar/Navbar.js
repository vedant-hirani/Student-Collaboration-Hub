import React, { useState, useEffect } from 'react';
import { Bell, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const [isNavCollapsed, setIsNavCollapsed] = useState(true);
  const [user, setUser] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Function to check and update user data
  const checkUserData = () => {
    const userData = localStorage.getItem('userData');
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      setUser(null);
    }
  };

  useEffect(() => {
    // Initial check
    checkUserData();

    // Add storage event listener
    window.addEventListener('storage', checkUserData);
    
    // Create a custom event listener for login
    window.addEventListener('userLogin', checkUserData);

    return () => {
      window.removeEventListener('storage', checkUserData);
      window.removeEventListener('userLogin', checkUserData);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userData');
    localStorage.removeItem('rememberMe');
    setUser(null);
    navigate('/login');
  };

  // Add click outside listener for dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isDropdownOpen && !event.target.closest('.dropdown')) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isDropdownOpen]);

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
          </ul>

          <div className="d-flex align-items-center gap-3">
            {!user ? (
              <div className="d-flex gap-2">
                <a href="/login" className="btn btn-outline-light px-4">
                  Login
                </a>
                <a href="/register" className="btn btn-light px-4">
                  Register
                </a>
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
                    className="btn btn-link text-light text-decoration-none d-flex align-items-center gap-2" 
                    type="button" 
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  >
                    <div className="d-flex align-items-center gap-2">
                      <div className="rounded-circle bg-light d-flex align-items-center justify-content-center" 
                           style={{ width: '32px', height: '32px' }}>
                        <User size={20} className="text-primary" />
                      </div>
                      <span className="d-none d-lg-inline">{user?.name || user?.email}</span>
                    </div>
                  </button>
                  {isDropdownOpen && (
                    <ul className="dropdown-menu show dropdown-menu-end shadow-sm border-0 mt-2">
                      <li>
                        <button 
                          className="dropdown-item py-2"
                          onClick={() => {
                            navigate('/profile');
                            setIsDropdownOpen(false);
                          }}
                        >
                          <div className="d-flex align-items-center gap-2">
                            <User size={16} />
                            My Profile
                          </div>
                        </button>
                      </li>
                      <li>
                        <button 
                          className="dropdown-item py-2"
                          onClick={() => {
                            navigate('/settings');
                            setIsDropdownOpen(false);
                          }}
                        >
                          Settings
                        </button>
                      </li>
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