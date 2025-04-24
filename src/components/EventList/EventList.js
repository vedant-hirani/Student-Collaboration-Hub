import React, { useEffect, useState, useRef } from 'react';
import './EventList.css';

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    additionalInfo: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [currentPage, setCurrentPage] = useState(0);
  const eventsPerPage = 4;
  const carouselRef = useRef(null);
  const modalRef = useRef(null);
  console.log(currentEvent);


  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/events');
        const data = await response.json();
        setEvents(data.events);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    // Add event listener for clicking outside modal to close it
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target) && 
          event.target.className === 'modal-overlay show') {
        handleCloseModal();
      }
    };

    if (showModal) {
      document.addEventListener('mousedown', handleClickOutside);
      // Prevent body scrolling when modal is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'auto';
    };
  }, [showModal]);

  const scrollCarousel = (direction) => {
    if (carouselRef.current) {
      // Calculate exact width of visible area
      const containerWidth = carouselRef.current.clientWidth;
      const scrollAmount = direction === 'right' ? containerWidth : -containerWidth;
      
      carouselRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
      
      // Update current page
      if (direction === 'right' && currentPage < Math.ceil(events.length / eventsPerPage) - 1) {
        setCurrentPage(currentPage + 1);
      } else if (direction === 'left' && currentPage > 0) {
        setCurrentPage(currentPage - 1);
      }
    }
  };

  const handleOpenModal = (event) => {
    setCurrentEvent(event);
    setShowModal(true);
    setMessage({ type: '', text: '' });
    // Reset form data for new registration
    setFormData({
      name: '',
      email: '',
      phone: '',
      additionalInfo: ''
    });
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Format time for display
  const formatTime = (timeString) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  // Using controlled inputs with direct state updates
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Direct state update to maintain focus
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Get token from localStorage
      const token = localStorage.getItem('token');
      
      if (!token) {
        setMessage({ type: 'error', text: 'You must be logged in to register for events.' });
        setLoading(false);
        return;
      }

      const response = await fetch(`http://localhost:5000/api/events/${currentEvent._id}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: 'Registration successful!' });
        // Update events
        const updatedEvents = events.map(event => 
          event._id === currentEvent._id 
            ? { ...event, registrations: [...(event.registrations || []), { userData: formData }] } 
            : event
        );
        setEvents(updatedEvents);
        
        // Close modal after delay
        setTimeout(() => {
          handleCloseModal();
        }, 2000);
      } else {
        setMessage({ type: 'error', text: data.message || 'Registration failed.' });
      }
    } catch (error) {
      console.error('Error registering for event:', error);
      setMessage({ type: 'error', text: 'An error occurred during registration.' });
    }
    
    setLoading(false);
  };

  // Custom modal with improved form handling
  const CustomModal = () => {
    if (!showModal) return null;
    
    return (
      <div className={`modal-overlay ${showModal ? 'show' : ''}`}>
      <div className={`modal-bottom-sheet ${showModal ? 'show' : ''}`} ref={modalRef}>
        <div className="modal-handle-wrapper">
          <div className="modal-handle"></div>
        </div>
        
        <div className="modal-content">
          <div className="modal-header">
            <button className="close-button" onClick={handleCloseModal}>
              <i className="bi bi-x-lg"></i>
            </button>
            <h3 className="modal-title fw-bold">Register for Event</h3>
          </div>
          
          <div className="modal-body">
            {/* Event details section */}
            <div className="event-details-section">
              <div className="row">
                <div className="col-md-4">
                  {currentEvent.imageUrl && (
                    <img
                      src={`http://localhost:5000${currentEvent.imageUrl}`}
                      alt={currentEvent.title}
                      className="event-detail-image img-fluid rounded"
                    />
                  )}
                </div>
                
                <div className="col-md-8">
                  <h4 className="event-title fw-bold">{currentEvent.title}</h4>
                  <div className="event-info">
                    <div className="event-info-item">
                      <i className="bi bi-calendar-event text-primary"></i>
                      <span>{formatDate(currentEvent.startDate)}</span>
                    </div>
                    <div className="event-info-item">
                      <i className="bi bi-clock text-primary"></i>
                      <span>{formatTime(currentEvent.startTime)}</span>
                    </div>
                    <div className="event-info-item">
                      <i className="bi bi-geo-alt text-primary"></i>
                      <span>{currentEvent.location}</span>
                    </div>
                    <div className="event-info-item">
                      <i className="bi bi-tag text-primary"></i>
                      <span>{currentEvent.category}</span>
                    </div>
                    <div className="event-info-item">
                      <i className="bi bi-activity text-primary"></i>
                      <span>{currentEvent.eventType}</span>
                    </div>
                    <div className="event-info-item">
                      <i className="bi bi-activity text-primary"></i>
                      <span>Description: {currentEvent.description}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="registration-section">
              <h5 className="registration-title fw-bold">
                <i className="bi bi-person-plus-fill me-2 text-primary"></i>
                Personal Information
              </h5>
              
              {message.text && (
                <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-danger'} d-flex align-items-center`} role="alert">
                  <i className={`bi ${message.type === 'success' ? 'bi-check-circle' : 'bi-exclamation-triangle'} me-2`}></i>
                  <div>{message.text}</div>
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="registration-form">
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group mb-3">
                      <label htmlFor="name" className="form-label fw-semibold">Full Name <span className="text-danger">*</span></label>
                      <div className="input-group">
                        <span className="input-group-text bg-light">
                          <i className="bi bi-person"></i>
                        </span>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Enter your full name"
                          required
                          className="form-control"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group mb-3">
                      <label htmlFor="email" className="form-label fw-semibold">Email Address <span className="text-danger">*</span></label>
                      <div className="input-group">
                        <span className="input-group-text bg-light">
                          <i className="bi bi-envelope"></i>
                        </span>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="Enter your email"
                          required
                          className="form-control"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group mb-3">
                      <label htmlFor="phone" className="form-label fw-semibold">Phone Number <span className="text-danger">*</span></label>
                      <div className="input-group">
                        <span className="input-group-text bg-light">
                          <i className="bi bi-telephone"></i>
                        </span>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="Enter your phone number"
                          required
                          className="form-control"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="form-group mb-4">
                  <label htmlFor="additionalInfo" className="form-label fw-semibold">Additional Information</label>
                  <textarea
                    id="additionalInfo"
                    name="additionalInfo"
                    value={formData.additionalInfo}
                    onChange={handleInputChange}
                    placeholder="Any dietary restrictions, special needs, accommodation requirements, etc."
                    rows={3}
                    className="form-control"
                  />
                </div>

                <div className="d-grid">
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg fw-semibold"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Processing...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check2-circle me-2"></i>Complete Registration
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Calculate total pages for indicators
const totalPages = Math.ceil(events.length / eventsPerPage);

// Get current visible events based on page
const startIndex = currentPage * eventsPerPage;
const endIndex = startIndex + eventsPerPage;
const currentEvents = events.slice(startIndex, endIndex);

  return (
    <div className="event-list-container">
      <h2 className="section-title fw-bold mb-4">All Events</h2>
      
      <div className="event-carousel-wrapper">
        <div className="event-carousel-inner">
          {currentPage > 0 && (
            <button 
              className="nav-button prev-button"
              onClick={() => scrollCarousel('left')}
              aria-label="Previous events"
            >
              <span className="nav-icon">‹</span>
            </button>
          )}
          
          <div className="events-container" ref={carouselRef}>
            {currentEvents.map(event => (
              <div key={event._id} className="event-card">
                {event.imageUrl && (
                  <div className="image-container">
                    <img
                      src={`http://localhost:5000${event.imageUrl}`}
                      alt={event.title}
                      className="event-image"
                    />
                  </div>
                )}
                <h3>{event.title}</h3>
                <div className="event-details">
                  <p className="event-description">Event Description: {event.description}</p>
                  <div >
                    <p className="event-date-time">
                      <i className="bi bi-calendar"></i>
                      {event.startDate} @ {event.startTime}
                    </p>
                    <p className="event-location">
                      <i className="bi bi-geo-alt"></i>
                      Location: {event.location}
                    </p>
                    <button 
                      className="register-button"
                      onClick={() => handleOpenModal(event)}
                    >
                      Register Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {currentPage < totalPages - 1 && (
            <button 
              className="nav-button next-button"
              onClick={() => scrollCarousel('right')}
              aria-label="Next events"
            >
              <span className="nav-icon">›</span>
            </button>
          )}
        </div>
      </div>
      
      <CustomModal />
    </div>
  );
};

export default EventList;