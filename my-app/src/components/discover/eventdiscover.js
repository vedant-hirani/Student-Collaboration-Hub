import React, { useState, useEffect } from 'react';

const EventsDiscoverPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [filteredEvents, setFilteredEvents] = useState(events);
  const [isLoading, setIsLoading] = useState(false);

  const categories = ['All', 'Music', 'Sports', 'Academic', 'Cultural', 'Technology', 'Social'];
  const locations = ['All Locations', 'Campus Center', 'Auditorium', 'Sports Complex', 'Online'];

  useEffect(() => {
    setIsLoading(true);
    const filtered = events.filter(event => {
      const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          event.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === '' || selectedCategory === 'All' || 
                            event.category === selectedCategory;
      const matchesLocation = selectedLocation === '' || selectedLocation === 'All Locations' || 
                            event.location === selectedLocation;
      return matchesSearch && matchesCategory && matchesLocation;
    });

    setTimeout(() => {
      setFilteredEvents(filtered);
      setIsLoading(false);
    }, 500);
  }, [searchTerm, selectedCategory, selectedLocation]);

  return (
    <div className="discover-container">
      <div className="container py-5">
        {/* Hero Section */}
        <div className="text-center mb-5">
          <h1 className="display-4 mb-3">Discover Campus Events</h1>
          <div className="row justify-content-center">
            <div className="col-md-6">
              <div className="search-box position-relative">
                <input
                  type="text"
                  className="form-control form-control-lg shadow-sm"
                  placeholder="Search events..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button
                    className="btn btn-link position-absolute end-0 top-50 translate-middle-y text-decoration-none"
                    onClick={() => setSearchTerm('')}
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="mb-5">
          <div className="d-flex flex-wrap gap-2 justify-content-center">
            {categories.map((category) => (
              <button
                key={category}
                className={`btn ${selectedCategory === category ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setSelectedCategory(category === selectedCategory ? '' : category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="row g-4">
          {/* Main Content */}
          <div className="col-md-8">
            {isLoading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (
              <>
                <h3 className="mb-4">
                  {filteredEvents.length} Events Found
                </h3>
                {filteredEvents.length === 0 ? (
                  <div className="text-center py-5">
                    <h4>No Events found</h4>
                    <p className="text-muted">Try adjusting your search criteria</p>
                  </div>
                ) : (
                  <div className="event-list">
                    {filteredEvents.map((event) => (
                      <div key={event.id} className="event-card card border-0 shadow-sm mb-4">
                        <div className="card-body p-4">
                          <div className="d-flex justify-content-between align-items-start">
                            <div>
                              <h4 className="mb-2">{event.title}</h4>
                              <h6 className="text-primary mb-3">{event.organizer}</h6>
                              <p className="mb-3">{event.description}</p>
                              <div className="d-flex flex-wrap gap-2 mb-3">
                                <span className="badge bg-primary">{event.category}</span>
                                {event.tags.map((tag, index) => (
                                  <span key={index} className="badge bg-light text-dark">
                                    {tag}
                                  </span>
                                ))}
                              </div>
                              <div className="d-flex gap-3 text-muted small">
                                <span>{event.location}</span>
                                <span>•</span>
                                <span>{event.date}</span>
                                <span>•</span>
                                <span>{event.time}</span>
                              </div>
                            </div>
                            <button className="btn btn-primary">Register Now</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Sidebar */}
          <div className="col-md-4">
            <div className="card border-0 shadow-sm sticky-top" style={{ top: '20px' }}>
              <div className="card-body p-4">
                <h3 className="card-title mb-4">Filters</h3>
                <form>
                  <div className="mb-3">
                    <label className="form-label">Location</label>
                    <select 
                      className="form-select"
                      value={selectedLocation}
                      onChange={(e) => setSelectedLocation(e.target.value)}
                    >
                      {locations.map((location) => (
                        <option key={location} value={location}>{location}</option>
                      ))}
                    </select>
                  </div>
                  <button 
                    type="button"
                    className="btn btn-outline-secondary w-100"
                    onClick={() => {
                      setSelectedLocation('');
                      setSelectedCategory('');
                      setSearchTerm('');
                    }}
                  >
                    Reset Filters
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Updated dummy data for student events
const events = [
  {
    id: 1,
    title: "Musical Night 2025",
    organizer: "Student Music Club",
    description: "Join us for an evening of amazing performances by talented student musicians. Featured performances include classical, rock, and jazz music.",
    category: "Music",
    location: "Auditorium",
    date: "February 15, 2025",
    time: "6:00 PM",
    tags: ["Live Music", "Student Performance", "Entertainment"],
    registrationDeadline: "2025-02-14"
  },
  {
    id: 2,
    title: "Inter-College Sports Tournament",
    organizer: "Sports Committee",
    description: "Annual sports competition featuring basketball, football, and athletics. Open for all students to participate or spectate.",
    category: "Sports",
    location: "Sports Complex",
    date: "March 1-5, 2025",
    time: "9:00 AM - 5:00 PM",
    tags: ["Competition", "Athletics", "Team Sports"],
    registrationDeadline: "2025-02-25"
  },
  {
    id: 3,
    title: "Tech Innovation Workshop",
    organizer: "Computer Science Society",
    description: "Learn about the latest technology trends and participate in hands-on coding sessions. Perfect for tech enthusiasts!",
    category: "Technology",
    location: "Online",
    date: "February 20, 2025",
    time: "2:00 PM - 4:00 PM",
    tags: ["Workshop", "Coding", "Innovation"],
    registrationDeadline: "2025-02-19"
  },
  {
    id: 4,
    title: "Cultural Festival",
    organizer: "Cultural Committee",
    description: "Annual cultural fest featuring dance, drama, and art exhibitions. Showcase your talents and celebrate diversity!",
    category: "Cultural",
    location: "Campus Center",
    date: "March 15-17, 2025",
    time: "10:00 AM - 8:00 PM",
    tags: ["Festival", "Arts", "Performance"],
    registrationDeadline: "2025-03-10"
  }
];

export default EventsDiscoverPage;