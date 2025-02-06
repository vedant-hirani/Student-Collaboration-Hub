import React from 'react';
import './eventpage.css';

export const NotifyEventPage = () => {
    return (
      <div className="page-container">
        <nav className="top-nav">
          <div className="container">
            <div className="d-flex justify-content-between align-items-center">
              <button className="back-button" onClick={() => window.history.back()}>
                <i className="bi bi-arrow-left"></i>
                Back
              </button>
              <h2 className="mb-0">Notify Event</h2>
              <div style={{width: '80px'}}></div>
            </div>
          </div>
        </nav>
  
        <div className="container">
          <div className="form-container notify-form">
            <form>
              <div className="row">
                {/* Left Column */}
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">
                      <i className="bi bi-person form-icon"></i>
                      Organizer Name
                    </label>
                    <input type="text" className="form-control" placeholder="Your name" />
                  </div>
  
                  <div className="mb-3">
                    <label className="form-label">
                      <i className="bi bi-envelope form-icon"></i>
                      Email
                    </label>
                    <input type="email" className="form-control" placeholder="Your email" />
                  </div>
  
                  <div className="mb-3">
                    <label className="form-label">
                      <i className="bi bi-telephone form-icon"></i>
                      Phone
                    </label>
                    <input type="tel" className="form-control" placeholder="Contact number" />
                  </div>
                </div>
  
                {/* Right Column */}
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Event Title</label>
                    <input type="text" className="form-control" placeholder="Event title" />
                  </div>
  
                  <div className="mb-3">
                    <label className="form-label">
                      <i className="bi bi-globe form-icon"></i>
                      Website
                    </label>
                    <input type="url" className="form-control" placeholder="Event website (optional)" />
                  </div>
  
                  <div className="mb-3">
                    <label className="form-label">Event Type</label>
                    <select className="form-select">
                      <option>Conference</option>
                      <option>Workshop</option>
                      <option>Seminar</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>
              </div>
  
              <div className="mb-3">
                <label className="form-label">Event Description</label>
                <textarea 
                  className="form-control" 
                  rows="4" 
                  placeholder="Provide details about your event..."
                ></textarea>
              </div>
  
              <button type="submit" className="btn btn-primary w-100">
                Submit Notification
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  };

export default NotifyEventPage;