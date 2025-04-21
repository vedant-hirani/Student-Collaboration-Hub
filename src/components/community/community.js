import React, { useState, useEffect } from 'react';
import { communityGroups, discussions } from '../../data/dummy_data.js';
import './community.css';

const CommunityPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [filteredGroups, setFilteredGroups] = useState(communityGroups);
  const [filteredDiscussions, setFilteredDiscussions] = useState(discussions);
  const [isLoading, setIsLoading] = useState(false);
  const [joinedGroups, setJoinedGroups] = useState([]);
  const [likedDiscussions, setLikedDiscussions] = useState([]);

  const categories = ['All', 'Development', 'Design', 'Marketing', 'Business'];

  useEffect(() => {
    setIsLoading(true);
    
    const filterContent = () => {
      const groups = communityGroups.filter(group =>
        (group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        group.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (selectedCategory === 'All' || group.category === selectedCategory)
      );

      const discussion = discussions.filter(disc =>
        (disc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        disc.content.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (selectedCategory === 'All' || disc.category === selectedCategory)
      );

      setTimeout(() => {
        setFilteredGroups(groups);
        setFilteredDiscussions(discussion);
        setIsLoading(false);
      }, 500);
    };

    filterContent();
  }, [searchTerm, selectedCategory]);

  const handleJoinGroup = (groupId) => {
    setJoinedGroups(prev => 
      prev.includes(groupId) 
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    );
  };

  const handleLikeDiscussion = (discussionId) => {
    setLikedDiscussions(prev => 
      prev.includes(discussionId)
        ? prev.filter(id => id !== discussionId)
        : [...prev, discussionId]
    );
  };

  return (
    <div className="community-container">
      <div className="container py-5">
        {/* Hero Section */}
        <div className="text-center mb-5">
          <h1 className="display-4 mb-3">Our Community</h1>
          <div className="row justify-content-center">
            <div className="col-md-6">
              <div className="search-box position-relative">
                <input
                  type="text"
                  className="form-control form-control-lg shadow-sm"
                  placeholder="Search communities and discussions..."
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

        {/* Category Filters */}
        <div className="mb-5">
          <div className="d-flex flex-wrap gap-2 justify-content-center">
            {categories.map((category) => (
              <button
                key={category}
                className={`btn ${selectedCategory === category ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <div className="row g-4">
            <div className="col-lg-8">
              {/* Groups */}
              <div className="card border-0 shadow-sm mb-4">
                <div className="card-body p-4">
                  <h3 className="card-title mb-4">Featured Groups</h3>
                  {filteredGroups.length === 0 ? (
                    <div className="text-center py-4">
                      <p className="mb-0">No groups found matching your criteria</p>
                    </div>
                  ) : (
                    filteredGroups.map((group) => (
                      <div key={group.id} className="community-group mb-4 p-3 rounded">
                        <div className="d-flex justify-content-between align-items-center">
                          <div className="d-flex align-items-center">
                            <div className="group-avatar me-3">
                              <img 
                                src={group.avatar} 
                                alt={group.name}
                                className="rounded-circle"
                                width="50"
                                height="50"
                              />
                            </div>
                            <div>
                              <h5 className="mb-1">{group.name}</h5>
                              <p className="text-muted mb-0">
                                <small>{group.memberCount} members • {group.category}</small>
                              </p>
                            </div>
                          </div>
                          <button
                            className={`btn ${joinedGroups.includes(group.id) ? 'btn-secondary' : 'btn-primary'}`}
                            onClick={() => handleJoinGroup(group.id)}
                          >
                            {joinedGroups.includes(group.id) ? 'Leave' : 'Join'}
                          </button>
                        </div>
                        <p className="mt-3 mb-0">{group.description}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Discussions */}
              <div className="card border-0 shadow-sm">
                <div className="card-body p-4">
                  <h3 className="card-title mb-4">Recent Discussions</h3>
                  {filteredDiscussions.length === 0 ? (
                    <div className="text-center py-4">
                      <p className="mb-0">No discussions found matching your criteria</p>
                    </div>
                  ) : (
                    filteredDiscussions.map((discussion) => (
                      <div key={discussion.id} className="discussion-item mb-4 p-3 rounded">
                        <div className="d-flex justify-content-between">
                          <div>
                            <h5 className="mb-2">{discussion.title}</h5>
                            <p className="text-muted mb-2">
                              <small>
                                Posted by {discussion.author} • {discussion.date} • {discussion.category}
                              </small>
                            </p>
                            <p className="mb-0">{discussion.content}</p>
                          </div>
                          <button
                            className={`btn btn-link ${likedDiscussions.includes(discussion.id) ? 'text-danger' : 'text-muted'}`}
                            onClick={() => handleLikeDiscussion(discussion.id)}
                          >
                            <i className={`bi ${likedDiscussions.includes(discussion.id) ? 'bi-heart-fill' : 'bi-heart'}`}></i>
                            <span className="ms-1">{discussion.likes + (likedDiscussions.includes(discussion.id) ? 1 : 0)}</span>
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="col-lg-4">
              <div className="card border-0 shadow-sm sticky-top" style={{ top: '20px' }}>
                <div className="card-body p-4">
                  <h4 className="card-title mb-4">Community Stats</h4>
                  <div className="stats-item mb-3">
                    <div className="d-flex justify-content-between">
                      <span>Total Members</span>
                      <span className="fw-bold">
                        {communityGroups.reduce((acc, group) => acc + group.memberCount, 0)}
                      </span>
                    </div>
                  </div>
                  <div className="stats-item mb-3">
                    <div className="d-flex justify-content-between">
                      <span>Active Groups</span>
                      <span className="fw-bold">{communityGroups.length}</span>
                    </div>
                  </div>
                  <div className="stats-item">
                    <div className="d-flex justify-content-between">
                      <span>Total Discussions</span>
                      <span className="fw-bold">{discussions.length}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommunityPage;