import React, { Suspense, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Import Router, Routes, and Route
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar/Navbar.js'; // Adjust path as needed
import HeroSection from './components/HeroSection/HeroSection.js';
import EventList from './components/EventList/EventList.js';
import EventDetails from './components/eventDetails/eventdetails.js';
import NotFound from './components/common/notfound';
import LoadingSpinner from './components/common/loadingspinner.js';
import Footer from './components/Footer/Footer.js';
import TrendingEvents from './components/TrendingEvents/TrendingEvents.js';
import Login from './components/auth/login.js';
import Eventsection from './components/eventsection/eventSection.js';
import Register from './components/auth/register.js';
import NotifyEventPage from './components/eventsection/notifyeventpage.js';
import CreateEventPage from './components/eventsection/createevent.js';
import DiscoverPage from './components/discover/eventdiscover.js';
import CommunityPage from './components/community/community.js';
import { opportunities } from './data/dummy_data';
import EventsPage from './components/eventpage.js';
import UserProfile from './components/userprofile/userProfile.jsx';


// In App.js, remove the Router component:
function App() {
  const [filteredEvents, setFilteredEvents] = useState(opportunities);

  const handleSearch = (filteredResults) => {
    setFilteredEvents(filteredResults);
  };

  return (
    <AuthProvider>
      <div className="App">
        <Navbar />
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <HeroSection onSearch={handleSearch} />
                  <EventsPage events={filteredEvents} />
                  <EventList />
                  <Eventsection />
                  <TrendingEvents />
                  <Footer />
                </>
              }
            />
        <Route path="/events" element={<EventList />} />
        <Route path="/event/:id" element={<EventDetails />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/create-event" element={<CreateEventPage />} />
        <Route path="/notify-event" element={<NotifyEventPage />} />

        <Route path="/discover" element={<DiscoverPage />} />
        <Route path="/community" element={<CommunityPage />} />
        <Route path="/profile" element={<UserProfile />}/>
        
          </Routes>
        </Suspense>
      </div>
    </AuthProvider>
  );
}
export default App;
