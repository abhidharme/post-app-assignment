import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import ForgotPassword from './components/auth/ForgotPassword';
import VerifyOtp from './components/auth/VerifyOtp';
import Feed from './components/Feed';
import PrivateRoute from './components/PrivateRoute';
import './App.css'

function App() {
  return (
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <div className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/verify-otp" element={<VerifyOtp />} />
              <Route
                path="/"
                element={
                  <PrivateRoute>
                    <Feed />
                  </PrivateRoute>
                }
              />
            </Routes>
          </div>
          <Toaster position="top-right" />
        </div>
      </Router>
  );
}

export default App;
