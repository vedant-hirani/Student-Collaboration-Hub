import React, { useState } from 'react';
import { Bell } from 'lucide-react';

const Navbar = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isNavCollapsed, setIsNavCollapsed] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Dummy credentials
  const DUMMY_EMAIL = "test@test.com";
  const DUMMY_PASSWORD = "123456";

  const handleLogin = () => {
    if (email === DUMMY_EMAIL && password === DUMMY_PASSWORD) {
      setIsLoggedIn(true);
      setShowAuthModal(false);
      setError('');
    } else {
      setError('Invalid credentials! Use test@test.com / 123456');
    }
  };

  const handleRegister = () => {
    setIsLoggedIn(true);
    setShowAuthModal(false);
  };

  const handleAuthClick = (type) => {
    setIsLogin(type === 'login');
    <a className="nav-link px-3" href="/login">Login</a>

  };

  const handleModalClose = () => {
    setShowAuthModal(false);
    setError('');
    setEmail('');
    setPassword('');
  };

  return (
    <>
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
                <a className="nav-link px-3" href="/discover">Discover</a>
              </li>
              <li className="nav-item">
                <a className="nav-link px-3" href="/community">Community</a>
              </li>
            </ul>

            <div className="d-flex align-items-center gap-3">
            {!isLoggedIn && (
              <div className="d-flex gap-2">
                <a 
                  href="/login" 
                  className="btn btn-outline-light px-4"
                >
                  Login
                </a>
                <a 
                  href="/register" 
                  className="btn btn-light px-4"
                >
                  Register
                </a>
              </div>
            )}

            {isLoggedIn && (
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
                    aria-expanded="false"
                  >
                    <span className="d-none d-lg-inline">test@test.com</span>
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end shadow-sm border-0 mt-2">
                    <li><a className="dropdown-item py-2" href="/profile">My Profile</a></li>
                    <li><a className="dropdown-item py-2" href="/settings">Settings</a></li>
                    <li><hr className="dropdown-divider" /></li>
                    <li>
                      <button 
                        className="dropdown-item py-2 text-danger"
                        onClick={() => setIsLoggedIn(false)}
                      >
                        Logout
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            )}
            </div>
          </div>
        </div>
      </nav>

      {showAuthModal && (
        <div className="modal fade show d-block" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content shadow border-0">
              <div className="modal-header border-0">
                <h5 className="modal-title fw-bold">
                  {isLogin ? 'Login' : 'Register'}
                </h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={handleModalClose}
                ></button>
              </div>
              <div className="modal-body p-4">
                {error && (
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                )}
                {isLogin ? (
                  <div>
                    <div className="mb-3">
                      <label className="form-label">Email address</label>
                      <input
                        type="email"
                        className="form-control"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    <div className="mb-4">
                      <label className="form-label">Password</label>
                      <input
                        type="password"
                        className="form-control"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                    <button 
                      className="btn btn-primary w-100 mb-3"
                      onClick={handleLogin}
                    >
                      Login
                    </button>
                    <p className="text-center mb-0">
                      Don't have an account?{' '}
                      <button 
                        className="btn btn-link p-0"
                        onClick={() => setIsLogin(false)}
                      >
                        Register here
                      </button>
                    </p>
                  </div>
                ) : (
                  <div>
                    <div className="mb-3">
                      <label className="form-label">Email address</label>
                      <input
                        type="email"
                        className="form-control"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    <div className="mb-4">
                      <label className="form-label">Password</label>
                      <input
                        type="password"
                        className="form-control"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                    <button 
                      className="btn btn-primary w-100 mb-3"
                      onClick={handleRegister}
                    >
                      Register
                    </button>
                    <p className="text-center mb-0">
                      Already have an account?{' '}
                      <button 
                        className="btn btn-link p-0"
                        onClick={() => setIsLogin(true)}
                      >
                        Login here
                      </button>
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );};

export default Navbar;