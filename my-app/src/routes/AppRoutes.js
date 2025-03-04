import React, { Suspense, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';

// Components
import Navbar from '../components/Navbar/Navbar';
import HeroSection from '../components/HeroSection/HeroSection';
import EventList from '../components/EventList/EventList';
import EventDetails from '../components/eventDetails/eventdetails';
import NotFound from '../components/common/notfound';
import LoadingSpinner from '../components/common/loadingspinner';
import Footer from '../components/Footer/Footer';
import TrendingEvents from '../components/TrendingEvents/TrendingEvents';
import Login from '../components/auth/login';
import Register from '../components/auth/register';
import Eventsection from '../components/eventsection/eventSection';
import NotifyEventPage from '../components/eventsection/notifyeventpage';
import CreateEventPage from '../components/eventsection/createevent';
import DiscoverPage from '../components/discover/eventdiscover';
import CommunityPage from '../components/community/community';
import EventsPage from '../components/eventpage';

// Initial data
import { opportunities } from '../data/dummy_data';

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();
  const [filteredEvents, setFilteredEvents] = useState(opportunities);

  const handleSearch = (filteredResults) => {
    setFilteredEvents(filteredResults);
  };

  if (!isAuthenticated) {
    return (
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Suspense>
    );
  }

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Navbar />
      <Routes>
        {/* Main Route */}
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

        {/* Event Routes */}
        <Route path="/events" element={<EventList />} />
        <Route path="/event/:id" element={<EventDetails />} />
        <Route path="/create-event" element={<CreateEventPage />} />
        <Route path="/notify-event" element={<NotifyEventPage />} />
        
        {/* Feature Routes */}
        <Route path="/discover" element={<DiscoverPage />} />
        <Route path="/community" element={<CommunityPage />} />

        {/* Auth Routes - Redirect if already authenticated */}
        <Route
          path="/login"
          element={<Navigate to="/" replace />}
        />
        <Route
          path="/register"
          element={<Navigate to="/" replace />}
        />

        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;