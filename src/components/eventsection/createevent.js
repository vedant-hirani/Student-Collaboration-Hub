import React, { useState } from 'react';
import './eventpage.css';

const CreateEventPage = () => {
  const [activeStep, setActiveStep] = useState(1);

  return (
    <div className="page-container">
      {/* Navigation */}
      <nav className="top-nav">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center">
            <button className="back-button" onClick={() => window.history.back()}>
              <i className="bi bi-arrow-left"></i>
              Back
            </button>
            <h2 className="mb-0">Create New Event</h2>
            <div style={{width: '80px'}}></div>
          </div>
        </div>
      </nav>

      <div className="container">
        {/* Progress Steps */}
        <div className="progress-steps">
          {[1, 2, 3].map(step => (
            <div key={step} className="progress-step">
              <div className={`step-number ${activeStep >= step ? 'active' : ''}`}>
                {step}
              </div>
              <div className={`step-label ${activeStep >= step ? 'active' : ''}`}>
                {step === 1 ? 'Basic Info' : step === 2 ? 'Details' : 'Preview'}
              </div>
            </div>
          ))}
        </div>

        {/* Form Container */}
        <div className="form-container">
          {activeStep === 1 && (
            <form>
              <div className="upload-area mb-4">
                <i className="bi bi-camera upload-icon"></i>
                <p className="mb-2">Drag and drop an image here, or</p>
                <button type="button" className="btn btn-primary">Browse Files</button>
              </div>

              <div className="mb-3">
                <label className="form-label">Event Title</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Give your event a catchy title"
                />
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Category</label>
                  <select className="form-select">
                    <option>Conference</option>
                    <option>Workshop</option>
                    <option>Seminar</option>
                    <option>Networking</option>
                  </select>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Event Type</label>
                  <select className="form-select">
                    <option>In-Person</option>
                    <option>Virtual</option>
                    <option>Hybrid</option>
                  </select>
                </div>
              </div>
            </form>
          )}

          {activeStep === 2 && (
            <form>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    <i className="bi bi-calendar form-icon"></i>
                    Start Date
                  </label>
                  <input type="date" className="form-control" />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    <i className="bi bi-clock form-icon"></i>
                    Start Time
                  </label>
                  <input type="time" className="form-control" />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">
                  <i className="bi bi-geo-alt form-icon"></i>
                  Location
                </label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Enter venue or virtual meeting link"
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea 
                  className="form-control" 
                  rows="4"
                  placeholder="Describe your event..."
                ></textarea>
              </div>
            </form>
          )}

          {activeStep === 3 && (
            <div className="preview-container bg-light p-4 rounded">
              <h4 className="mb-4">Event Preview</h4>
              {/* Add preview content here */}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="d-flex justify-content-between mt-4">
            {activeStep > 1 && (
              <button 
                className="btn btn-outline-secondary"
                onClick={() => setActiveStep(activeStep - 1)}
              >
                Previous
              </button>
            )}
            <button 
              className="btn btn-primary ms-auto"
              onClick={() => activeStep < 3 ? setActiveStep(activeStep + 1) : console.log('Submit')}
            >
              {activeStep === 3 ? 'Create Event' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

};
export default CreateEventPage;
