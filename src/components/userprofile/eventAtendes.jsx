import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.js';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Calendar, MapPin, Clock, Users, BarChart2, ArrowLeft, Download, Search, PieChart, TrendingUp } from 'lucide-react';

const EventAttendees = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { eventId } = useParams(); // Get eventId from URL
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [attendees, setAttendees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [metrics, setMetrics] = useState({
    totalAttendees: 0,
    registrationRate: 0,
    registrationsByDay: {}
  });

  console.log({attendees})
  useEffect(() => {
    const fetchUserCreatedEvents = async () => {
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
        setEvents(createdRes.data.events);
        
        // If eventId is provided in URL, use that event
        if (eventId) {
          const eventFromId = createdRes.data.events.find(event => event._id === eventId);
          if (eventFromId) {
            setSelectedEvent(eventFromId);
            fetchEventAttendees(eventId);
          } else {
            setError('Event not found or you do not have permission to view it.');
            setLoading(false);
          }
        } 
        // Otherwise use the first event if available
        else if (createdRes.data.events.length > 0) {
          setSelectedEvent(createdRes.data.events[0]);
          // Update URL to include the eventId without reloading
          navigate(`/events/attendees/${createdRes.data.events[0]._id}`, { replace: true });
          fetchEventAttendees(createdRes.data.events[0]._id);
        } else {
          setLoading(false);
        }
      } catch (err) {
        console.error('Error fetching user events:', err);
        setError('Failed to load events. Please try again later.');
        setLoading(false);
      }
    };

    fetchUserCreatedEvents();
  }, [eventId, navigate]);

  const fetchEventAttendees = async (eventId) => {
    if (!eventId) {
      setLoading(false);
      return;
    }
    
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      // Fetch event details with attendees
      const response = await axios.get(`http://localhost:5000/api/events/${eventId}/attendees`, config);
      
      if (response.data && response.data.attendees) {
        setAttendees(response.data.attendees);
        // Calculate metrics
        calculateMetrics(response.data.attendees, response.data.event);
      } else {
        setAttendees([]);
        setMetrics({
          totalAttendees: 0,
          registrationRate: 0,
          registrationsByDay: {}
        });
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching event attendees:', err);
      setError('Failed to load attendees. Please try again later.');
      setLoading(false);
    }
  };

  const calculateMetrics = (attendeesList, event) => {
    // Total attendees count
    const totalAttendees = attendeesList.length;
    
    // Registration rate (if capacity is available)
    let registrationRate = 0;
    if (event.capacity && event.capacity > 0) {
      registrationRate = (totalAttendees / event.capacity) * 100;
    }
    
    // Group registrations by day
    const registrationsByDay = {};
    attendeesList.forEach(attendee => {
      const date = new Date(attendee.registeredAt).toLocaleDateString();
      if (registrationsByDay[date]) {
        registrationsByDay[date]++;
      } else {
        registrationsByDay[date] = 1;
      }
    });
    
    setMetrics({
      totalAttendees,
      registrationRate,
      registrationsByDay
    });
  };

  const handleExportCSV = () => {
    if (!attendees.length) return;
    
    // Create CSV content
    const headers = ['Name', 'Email', 'Phone', 'Registration Date'];
    const csvRows = [headers.join(',')];
    
    attendees.forEach(attendee => {
      const row = [
        attendee.name || 'N/A',
        attendee.email || 'N/A',
        attendee.phone || 'N/A',
        new Date(attendee.registeredAt).toLocaleDateString()
      ];
      csvRows.push(row.join(','));
    });
    
    const csvContent = csvRows.join('\n');
    
    // Create and download the CSV file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${selectedEvent.title}-attendees.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Filter attendees based on search term
  const filteredAttendees = attendees.filter(attendee => 
    (attendee.name && attendee.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (attendee.email && attendee.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Generate registration trend data for chart
  const getRegistrationTrendData = () => {
    const sortedDates = Object.keys(metrics.registrationsByDay).sort((a, b) => new Date(a) - new Date(b));
    return sortedDates.map(date => ({
      date,
      count: metrics.registrationsByDay[date]
    }));
  };

  if (loading && !selectedEvent) {
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
              <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
            </svg>
            <div>{error}</div>
          </div>
          <div className="text-center mt-4">
            <button 
              className="btn btn-primary"
              onClick={() => navigate('/profile')}
            >
              Return to Profile
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="bg-white min-vh-100 py-5">
        <div className="container">
          <div className="d-flex align-items-center mb-4">
            <button 
              className="btn btn-outline-secondary me-3"
              onClick={() => navigate('/profile')}
            >
              <ArrowLeft size={18} className="me-2" />
              Back to Profile
            </button>
            <h1 className="h4 mb-0">Event Attendees</h1>
          </div>
          
          <div className="card border-0 rounded-4 shadow-sm">
            <div className="card-body p-5 text-center">
              <div className="mb-4">
                <div className="bg-light p-3 rounded-circle d-inline-flex">
                  <Calendar size={48} className="text-primary opacity-50" />
                </div>
              </div>
              <h2 className="h5 fw-semibold mb-2">No Events Created Yet</h2>
              <p className="text-muted mb-4 col-md-6 mx-auto">Create your first event to start tracking attendees and registration metrics.</p>
              <Link to="/events/create" className="btn btn-primary px-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-plus-lg me-2" viewBox="0 0 16 16">
                  <path fillRule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z"/>
                </svg>
                Create Your First Event
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-vh-100 py-5">
      <div className="container">
        <div className="d-flex align-items-center mb-4">
          <button 
            className="btn btn-outline-secondary me-3"
            onClick={() => navigate('/profile')}
          >
            <ArrowLeft size={18} className="me-2" />
            Back to Profile
          </button>
        </div>

        <div className="row">
       
          {/* Metrics and Attendees */}
          <div className="col-md-8">
            {selectedEvent ? (
              <>
                {/* Event Details */}
                <div className="card border-0 rounded-4 shadow-sm mb-4">
                  <div className="card-body p-4">
                    <h3 className="h5 fw-bold mb-3">{selectedEvent.title}</h3>
                    <div className="row">
                      <div className="col-sm-6">
                        <div className="d-flex align-items-center text-muted mb-2">
                          <Calendar size={16} className="text-primary me-2" />
                          <span>{formatDate(selectedEvent.startDate)}</span>
                        </div>
                        <div className="d-flex align-items-center text-muted mb-2">
                          <Clock size={16} className="text-primary me-2" />
                          <span>{selectedEvent.startTime}</span>
                        </div>
                      </div>
                      <div className="col-sm-6">
                        <div className="d-flex align-items-center text-muted mb-2">
                          <MapPin size={16} className="text-primary me-2" />
                          <span>{selectedEvent.location}</span>
                        </div>
                        {selectedEvent.capacity && (
                          <div className="d-flex align-items-center text-muted mb-2">
                            <Users size={16} className="text-primary me-2" />
                            <span>Capacity: {selectedEvent.capacity}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Metrics Cards */}
                <div className="row g-3 mb-4">
                  <div className="col-sm-4">
                    <div className="card border-0 rounded-4 shadow-sm h-100">
                      <div className="card-body p-4">
                        <div className="d-flex align-items-center mb-2">
                          <Users size={20} className="text-primary me-2" />
                          <h3 className="h6 fw-bold mb-0">Total Registrations</h3>
                        </div>
                        <div className="d-flex align-items-baseline">
                          <h4 className="display-6 fw-bold mb-0">{metrics.totalAttendees}</h4>
                          <span className="text-muted ms-2">attendees</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-sm-4">
                    <div className="card border-0 rounded-4 shadow-sm h-100">
                      <div className="card-body p-4">
                        <div className="d-flex align-items-center mb-2">
                          <TrendingUp size={20} className="text-primary me-2" />
                          <h3 className="h6 fw-bold mb-0">Daily Registrations</h3>
                        </div>
                        <div className="d-flex align-items-baseline">
                          <h4 className="display-6 fw-bold mb-0">
                            {Object.keys(metrics.registrationsByDay).length}
                          </h4>
                          <span className="text-muted ms-2">days</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

               x``

                {/* Attendees List */}
                <div className="card border-0 rounded-4 shadow-sm">
                  <div className="card-header bg-white p-3 border-0 d-flex justify-content-between align-items-center">
                    <h3 className="h6 fw-bold mb-0">Registered Attendees</h3>
                    {attendees.length > 0 && (
                      <button 
                        className="btn btn-sm btn-outline-primary"
                        onClick={handleExportCSV}
                      >
                        <Download size={16} className="me-1" />
                        Export CSV
                      </button>
                    )}
                  </div>
                  
                  {attendees.length > 0 ? (
                    <>
                      <div className="card-body p-3 border-bottom">
                        <div className="input-group">
                          <span className="input-group-text bg-light border-0">
                            <Search size={16} />
                          </span>
                          <input
                            type="text"
                            className="form-control bg-light border-0"
                            placeholder="Search attendees..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                          />
                        </div>
                      </div>
                      
                      <div className="table-responsive">
                        <table className="table table-hover mb-0">
                          <thead className="table-light">
                            <tr>
                              <th scope="col" className="fw-medium">Name</th>
                              <th scope="col" className="fw-medium">Email</th>
                              <th scope="col" className="fw-medium">Registration Date</th>
                            </tr>
                          </thead>
                          <tbody>
                            {loading ? (
                              <tr>
                                <td colSpan="4" className="text-center py-4">
                                  <div className="spinner-border spinner-border-sm text-primary" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                  </div>
                                </td>
                              </tr>
                            ) : filteredAttendees.length > 0 ? (
                              filteredAttendees.map((attendee, index) => (
                                <tr key={index}>
                                  <td>{attendee.name || 'N/A'}</td>
                                  <td>{attendee.email || 'N/A'}</td>
                                  <td>{new Date(attendee.registeredAt).toLocaleDateString()}</td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan="4" className="text-center py-4">
                                  {searchTerm ? 'No matching attendees found' : 'No attendees data available'}
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </>
                  ) : (
                    <div className="card-body p-5 text-center">
                      <div className="mb-3">
                        <div className="bg-light p-3 rounded-circle d-inline-flex">
                          <Users size={48} className="text-primary opacity-50" />
                        </div>
                      </div>
                      <h3 className="h5 fw-semibold mb-2">No Registrations Yet</h3>
                      <p className="text-muted mb-0 col-md-8 mx-auto">
                        Share your event with potential attendees to start collecting registrations.
                      </p>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="card border-0 rounded-4 shadow-sm">
                <div className="card-body p-5 text-center">
                  <p className="text-muted mb-0">Select an event to view attendees and metrics</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventAttendees;