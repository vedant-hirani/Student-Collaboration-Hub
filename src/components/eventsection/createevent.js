import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const CreateEventPage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    category: '',
    eventType: '',
    startDate: '',
    startTime: '',
    location: '',
    description: '',
    image: null
  });

  // Preview image
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    
    if (name === 'image') {
      // Handle file upload and preview
      if (files && files[0]) {
        setFormData({ ...formData, image: files[0] });
        
        // Create preview URL for the image
        const reader = new FileReader();
        reader.onload = (e) => {
          setImagePreview(e.target.result);
        };
        reader.readAsDataURL(files[0]);
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    // Create FormData object for multipart/form-data submission
    const data = new FormData();
    
    // Append text fields
    data.append('title', formData.title);
    data.append('category', formData.category);
    data.append('eventType', formData.eventType);
    data.append('startDate', formData.startDate);
    data.append('startTime', formData.startTime);
    data.append('location', formData.location);
    data.append('description', formData.description);
    
    // Append file with correct field name (should match backend)
    if (formData.image) {
      data.append('image', formData.image);
    }

    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Authentication token not found');
      }
      
      const response = await fetch(`${process.env.REACT_APP_API_URL}/events`, { // Use env variable
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: data
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Event created successfully:', result.event);
        navigate('/events');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to create event');
      }
    } catch (error) {
      console.error('Error creating event:', error);
      setError('An error occurred while creating the event');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card border-0 shadow-lg">
            <div className="card-header bg-primary text-white p-4">
              <h3 className="mb-0 text-center fw-bold">Create New Event</h3>
            </div>
            
            <div className="card-body p-4">
              {error && (
                <div className="alert alert-danger d-flex align-items-center" role="alert">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  <div>{error}</div>
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
             
                
                {/* Basic Info Section */}
                <div>
                  <div className="card-header bg-primary bg-opacity-10">
                    <h5 className="mb-0 text-primary">
                      <i className="bi bi-info-circle me-2"></i>Basic Information
                    </h5>
                  </div>
                  <div className="card-body">
                    <div className="mb-3">
                      <label htmlFor="title" className="form-label fw-bold">Event Title</label>
                      <input 
                        type="text" 
                        className="form-control form-control-lg" 
                        id="title"
                        name="title" 
                        placeholder="Enter a captivating title for your event" 
                        value={formData.title} 
                        onChange={handleChange} 
                        required 
                      />
                    </div>
                    
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label htmlFor="category" className="form-label fw-bold">Category</label>
                        <select 
                          className="form-select" 
                          id="category"
                          name="category" 
                          value={formData.category} 
                          onChange={handleChange} 
                          required
                        >
                          <option value="">Select category</option>
                          <option value="Music">Music</option>
                          <option value="Sports">Sports</option>
                          <option value="Business">Business</option>
                          <option value="Food">Food & Drinks</option>
                          <option value="Arts">Arts & Culture</option>
                          <option value="Technology">Technology</option>
                          <option value="Education">Education</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      
                      <div className="col-md-6 mb-3">
                        <label htmlFor="eventType" className="form-label fw-bold">Event Type</label>
                        <select 
                          className="form-select" 
                          id="eventType"
                          name="eventType" 
                          value={formData.eventType} 
                          onChange={handleChange} 
                          required
                        >
                          <option value="">Select event type</option>
                          <option value="Conference">Conference</option>
                          <option value="Workshop">Workshop</option>
                          <option value="Concert">Concert</option>
                          <option value="Meetup">Meetup</option>
                          <option value="Exhibition">Exhibition</option>
                          <option value="Party">Party</option>
                          <option value="Seminar">Seminar</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Date & Location Section */}
                <div >
                  <div className="card-header bg-primary bg-opacity-10">
                    <h5 className="mb-0 text-primary">
                      <i className="bi bi-calendar-event me-2"></i>Date & Location
                    </h5>
                  </div>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label htmlFor="startDate" className="form-label fw-bold">Event Date</label>
                        <input 
                          type="date" 
                          className="form-control" 
                          id="startDate"
                          name="startDate" 
                          value={formData.startDate} 
                          onChange={handleChange} 
                          required 
                        />
                      </div>
                      
                      <div className="col-md-6 mb-3">
                        <label htmlFor="startTime" className="form-label fw-bold">Start Time</label>
                        <input 
                          type="time" 
                          className="form-control" 
                          id="startTime"
                          name="startTime" 
                          value={formData.startTime} 
                          onChange={handleChange} 
                          required 
                        />
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <label htmlFor="location" className="form-label fw-bold">Location</label>
                      <div className="input-group">
                        <span className="input-group-text bg-light">
                          <i className="bi bi-geo-alt"></i>
                        </span>
                        <input 
                          type="text" 
                          className="form-control" 
                          id="location"
                          name="location" 
                          placeholder="Venue name or address" 
                          value={formData.location} 
                          onChange={handleChange} 
                          required 
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Description Section */}
                <div >
                  <div className="card-header bg-primary bg-opacity-10">
                    <h5 className="mb-0 text-primary">
                      <i className="bi bi-file-text me-2"></i>Event Details
                    </h5>
                  </div>
                  <div className="card-body">
                    <div className="mb-3">
                      <label htmlFor="description" className="form-label fw-bold">Description</label>
                      <textarea 
                        className="form-control" 
                        id="description"
                        name="description" 
                        rows="5" 
                        placeholder="Provide detailed information about your event" 
                        value={formData.description} 
                        onChange={handleChange} 
                        required
                      ></textarea>
                    </div>
                  </div>
                </div>
                
                {/* Image Upload Section */}
                <div >
                  <div className="card-header bg-primary bg-opacity-10">
                    <h5 className="mb-0 text-primary">
                      <i className="bi bi-image me-2"></i>Event Image
                    </h5>
                  </div>
                  <div className="card-body">
                    <div className="mb-3">
                      <label htmlFor="image" className="form-label fw-bold">Upload Event Banner</label>
                      <input 
                        type="file" 
                        className="form-control" 
                        id="image"
                        name="image" 
                        accept="image/*" 
                        onChange={handleChange} 
                        required 
                      />
                      <div className="form-text">Recommended image size: 1200 x 600 pixels (2:1 ratio)</div>
                    </div>
                    
                    {imagePreview && (
                      <div className="mt-3">
                        <label className="form-label">Image Preview</label>
                        <div className="position-relative">
                          <img 
                            src={imagePreview} 
                            alt="Event preview" 
                            className="img-fluid rounded shadow-sm border" 
                            style={{ maxHeight: '200px', objectFit: 'cover' }}
                          />
                          <button 
                            type="button" 
                            className="btn btn-sm btn-light position-absolute top-0 end-0 m-2 rounded-circle"
                            onClick={() => {
                              setImagePreview(null);
                              setFormData({...formData, image: null});
                            }}
                          >
                            <i className="bi bi-x"></i>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Form Actions */}
                <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                  <button 
                    type="button" 
                    className="btn btn-light btn-lg px-4"
                    onClick={() => navigate(-1)}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary btn-lg px-5"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Creating...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-plus-circle me-2"></i>Create Event
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

export default CreateEventPage;