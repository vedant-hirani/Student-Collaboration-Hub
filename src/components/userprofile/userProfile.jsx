import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.js';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Calendar, MapPin, Clock, User, Mail, Calendar as CalendarIcon } from 'lucide-react';

const UserProfile = () => {
  const { user } = useAuth();
  const [createdEvents, setCreatedEvents] = useState([]);
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [activeTab, setActiveTab] = useState('created');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserEvents = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        };

        // Fetch events created by user
        const createdRes = await axios.get('http://localhost:5000/api/events/user/created', config);
        setCreatedEvents(createdRes.data.events);

        // Fetch events user has registered for
        const registeredRes = await axios.get('http://localhost:5000/api/events/user/registered', config);
        setRegisteredEvents(registeredRes.data.events);

        setLoading(false);
      } catch (err) {
        console.error('Error fetching user events:', err);
        setError('Failed to load events. Please try again later.');
        setLoading(false);
      }
    };

    fetchUserEvents();
  }, []);

  // Format date and time for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="bg-white min-vh-100 d-flex justify-content-center align-items-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white min-vh-100 py-5">
        <div className="container">
          <div className="alert alert-danger d-flex align-items-center" role="alert">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-exclamation-triangle-fill flex-shrink-0 me-2" viewBox="0 0 16 16">
              <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
            </svg>
            <div>{error}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-vh-100 py-5">
      <div className="container">
        {/* User Info Card */}
        <div className="card border-0 rounded-4 shadow-sm mb-4 overflow-hidden">

          <div className="card-body p-4">
            <div className="row align-items-center">

              <div className="col-lg-9">
                <div className="row g-3">
                  <div className="col-md-6">
                    <div className="d-flex align-items-center p-3 bg-light rounded-3">
                      <User size={22} className="text-primary me-3" />
                      <div>
                        <small className="text-muted text-uppercase">Username</small>
                        <p className="fw-medium mb-0">{user?.username || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="d-flex align-items-center p-3 bg-light rounded-3">
                      <Mail size={22} className="text-primary me-3" />
                      <div>
                        <small className="text-muted text-uppercase">Email</small>
                        <p className="fw-medium mb-0">{user?.email || 'N/A'}</p>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Events Section */}
        <div className="card border-0 rounded-4 shadow-sm overflow-hidden">
          {/* Tabs */}
          <ul className="nav nav-tabs border-0 px-4 pt-3">
            <li className="nav-item me-2">
              <button
                className={`nav-link ${activeTab === 'created' ? 'active fw-medium' : ''} px-4`}
                onClick={() => setActiveTab('created')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-calendar-plus me-2" viewBox="0 0 16 16">
                  <path d="M8 7a.5.5 0 0 1 .5.5V9H10a.5.5 0 0 1 0 1H8.5v1.5a.5.5 0 0 1-1 0V10H6a.5.5 0 0 1 0-1h1.5V7.5A.5.5 0 0 1 8 7z" />
                  <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z" />
                </svg>
                Created Events
                <span className="badge bg-primary rounded-pill ms-2">{createdEvents.length}</span>
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 'registered' ? 'active fw-medium' : ''} px-4`}
                onClick={() => setActiveTab('registered')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-ticket-perforated me-2" viewBox="0 0 16 16">
                  <path d="M4 4.85v.9h1v-.9H4Zm7 0v.9h1v-.9h-1Zm-7 1.8v.9h1v-.9H4Zm7 0v.9h1v-.9h-1Zm-7 1.8v.9h1v-.9H4Zm7 0v.9h1v-.9h-1Zm-7 1.8v.9h1v-.9H4Zm7 0v.9h1v-.9h-1Z" />
                  <path d="M1.5 3A1.5 1.5 0 0 0 0 4.5V6a.5.5 0 0 0 .5.5 1.5 1.5 0 1 1 0 3 .5.5 0 0 0-.5.5v1.5A1.5 1.5 0 0 0 1.5 13h13a1.5 1.5 0 0 0 1.5-1.5V10a.5.5 0 0 0-.5-.5 1.5 1.5 0 0 1 0-3A.5.5 0 0 0 16 6V4.5A1.5 1.5 0 0 0 14.5 3h-13ZM1 4.5a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 .5.5v1.05a2.5 2.5 0 0 0 0 4.9v1.05a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-1.05a2.5 2.5 0 0 0 0-4.9V4.5Z" />
                </svg>
                Registered Events
                <span className="badge bg-primary rounded-pill ms-2">{registeredEvents.length}</span>
              </button>
            </li>
          </ul>

          {/* Tab Content */}
          <div className="card-body p-4">
            {activeTab === 'created' && (
              <div>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h2 className="h5 fw-bold mb-0">Events You Created</h2>
                  <Link to="/events/create" className="btn btn-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-plus-lg me-2" viewBox="0 0 16 16">
                      <path fillRule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z" />
                    </svg>
                    Create Event
                  </Link>
                </div>

                {createdEvents.length === 0 ? (
                  <div className="text-center py-5 my-4">
                    <div className="mb-3">
                      <div className="bg-light p-3 rounded-circle d-inline-flex">
                        <Calendar size={48} className="text-primary opacity-50" />
                      </div>
                    </div>
                    <h3 className="h5 fw-semibold mb-2">No Events Created Yet</h3>
                    <p className="text-muted mb-4 col-md-6 mx-auto">Create your first event and start managing your gatherings.</p>
                    <Link to="/events/create" className="btn btn-primary px-4">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-plus-lg me-2" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z" />
                      </svg>
                      Create Your First Event
                    </Link>
                  </div>
                ) : (
                  <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                    {createdEvents.map(event => (
                      <div key={event._id} className="col">
                        <div className="card h-100 border-0 shadow-sm rounded-3 overflow-hidden">
                          {event.imageUrl && (
                            <div className="image-container">
                              <img
                                src={`http://localhost:5000${event.imageUrl}`}
                                alt={event.title}
                                className="event-image"
                              />
                            </div>
                          )}
                          <div className="position-absolute top-0 end-0 p-2">
                            <span className="badge bg-primary px-3 py-2 fs-7">
                              {event.category}
                            </span>
                          </div>
                          <div className="card-body p-3">
                            <h3 className="card-title h6 fw-bold mb-3">{event.title}</h3>
                            <div className="d-flex align-items-center text-muted small mb-2">
                              <Calendar className="me-2 text-primary" size={14} />
                              <span>{formatDate(event.startDate)}</span>
                            </div>
                            <div className="d-flex align-items-center text-muted small mb-2">
                              <Clock className="me-2 text-primary" size={14} />
                              <span>{event.startTime}</span>
                            </div>
                            <div className="d-flex align-items-center text-muted small mb-3">
                              <MapPin className="me-2 text-primary" size={14} />
                              <span className="text-truncate">{event.location}</span>
                            </div>
                          </div>

                          <div className="card-footer bg-white border-0 p-3 pt-0">
                            <Link to={`/events/attendees/${event._id}`} className="btn btn-outline-primary me-2">
                              View Attendees
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'registered' && (
              <div>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h2 className="h5 fw-bold mb-0">Events You're Registered For</h2>
                  <Link to="/events" className="btn btn-outline-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-search me-2" viewBox="0 0 16 16">
                      <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                    </svg>
                    Find Events
                  </Link>
                </div>

                {registeredEvents.length === 0 ? (
                  <div className="text-center py-5 my-4">
                    <div className="mb-3">
                      <div className="bg-light p-3 rounded-circle d-inline-flex">
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" className="bi bi-ticket-perforated text-primary opacity-50" viewBox="0 0 16 16">
                          <path d="M4 4.85v.9h1v-.9H4Zm7 0v.9h1v-.9h-1Zm-7 1.8v.9h1v-.9H4Zm7 0v.9h1v-.9h-1Zm-7 1.8v.9h1v-.9H4Zm7 0v.9h1v-.9h-1Zm-7 1.8v.9h1v-.9H4Zm7 0v.9h1v-.9h-1Z" />
                          <path d="M1.5 3A1.5 1.5 0 0 0 0 4.5V6a.5.5 0 0 0 .5.5 1.5 1.5 0 1 1 0 3 .5.5 0 0 0-.5.5v1.5A1.5 1.5 0 0 0 1.5 13h13a1.5 1.5 0 0 0 1.5-1.5V10a.5.5 0 0 0-.5-.5 1.5 1.5 0 0 1 0-3A.5.5 0 0 0 16 6V4.5A1.5 1.5 0 0 0 14.5 3h-13ZM1 4.5a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 .5.5v1.05a2.5 2.5 0 0 0 0 4.9v1.05a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-1.05a2.5 2.5 0 0 0 0-4.9V4.5Z" />
                        </svg>
                      </div>
                    </div>
                    <h3 className="h5 fw-semibold mb-2">No Events Registered</h3>
                    <p className="text-muted mb-4 col-md-6 mx-auto">Discover events and register to see them here.</p>
                    <Link to="/events" className="btn btn-primary px-4">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-search me-2" viewBox="0 0 16 16">
                        <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                      </svg>
                      Browse Events
                    </Link>
                  </div>
                ) : (
                  <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                    {registeredEvents.map(event => (
                      <div key={event._id} className="col">
                        <div className="card h-100 border-0 shadow-sm rounded-3 overflow-hidden">
                          {event.imageUrl && (
                            <div className="image-container">
                              <img
                                src={`http://localhost:5000${event.imageUrl}`}
                                alt={event.title}
                                className="event-image"
                              />
                            </div>
                          )}

                          <div className="position-absolute top-0 end-0 p-2">
                            <span className="badge bg-primary px-3 py-2 fs-7">
                              {event.category}
                            </span>
                          </div>
                          <div className="card-body p-3">
                            <h3 className="card-title h6 fw-bold mb-3">{event.title}</h3>
                            <div className="d-flex align-items-center text-muted small mb-2">
                              <Calendar className="me-2 text-primary" size={14} />
                              <span>{formatDate(event.startDate)}</span>
                            </div>
                            <div className="d-flex align-items-center text-muted small mb-2">
                              <Clock className="me-2 text-primary" size={14} />
                              <span>{event.startTime}</span>
                            </div>
                            <div className="d-flex align-items-center text-muted small mb-3">
                              <MapPin className="me-2 text-primary" size={14} />
                              <span className="text-truncate">{event.location}</span>
                            </div>
                          </div>
                          <div className="card-footer bg-white border-0 p-3 pt-0">
                            <Link
                              to={`/events/${event._id}`}
                              className="btn btn-sm btn-primary w-100"
                            >
                              View Details
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;