import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HeroSection from '../components/HeroSection/HeroSection.js';
import EventList from '../components/EventList/EventList.js';
import EventDetails from '../components/eventDetails/eventdetails.js';
import NotFound from '../components/common/notfound';
import LoadingSpinner from '../components/common/loadingspinner.js';
import Footer from '../components/Footer/Footer.js';
import TrendingEvents from '../components/TrendingEvents/TrendingEvents.js';
import { Suspense } from 'react';
import Login from '../components/auth/login.js';
import Eventsection from '../components/eventsection/eventSection.js';
import Register from '../components/auth/register.js';
const AppRoutes = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <HeroSection />
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
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;