import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, UseAuth } from './client/hook/UseAuth';
import WelcomePage from './client/pages/WelcomePage';
import LoginPage from './client/pages/LoginPage';
import SignUpPage from './client/pages/SignUpPage';
import HomePage from './client/pages/HomePage';
import MoviePage from './client/pages/MoviePage';
import PersonPage from './client/pages/PersonPage';
import SearchPage from './client/pages/SearchPage';
import FavoritePage from './client/pages/FavoritePage';
import BuyTicketPage from './client/pages/BuyTicketPage';
import ProfilePage from './client/pages/ProfilePage';


export default function Routers() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

function AppRoutes() {
  const { user } = UseAuth();

  return (
    <Routes>
      {user ? (
        <>
          <Route path="/home" element={<HomePage />} />
          <Route path="/movie/:id" element={<MoviePage />} />
          <Route path="/person/:id" element={<PersonPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/favorite" element={<FavoritePage />} />
          <Route path="*" element={<Navigate to="/home" />} />
          <Route path="/buy/:id" element={<BuyTicketPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          
        </>
      ) : (
        <>
          <Route path="/welcome" element={<WelcomePage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<Navigate to="/welcome" />} />
        </>
      )}
    </Routes>
  );
}
