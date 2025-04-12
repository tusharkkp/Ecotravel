import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

// Page components
import Home from './pages/Home';
import CarbonCalculator from './pages/CarbonCalculator';
import Certifications from './pages/Certifications';
import Rewards from './pages/Rewards';
import CompareOptions from './pages/CompareOptions';
import NotFound from './pages/NotFound';
import Login from './pages/Login';
import Register from './pages/Register';
import ProfilePage from './pages/ProfilePage';
import ContributePage from './pages/ContributePage';
import WalletPage from './pages/WalletPage';
import SettingsPage from './pages/SettingsPage';
import Reviews from './pages/Reviews';

// UI components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import EcoCoinAnimationProvider from './components/wallet/EcoCoinAnimationProvider';
import Chatbot from './components/chatbot/Chatbot';

// Auth components
import ProtectedRoute from './components/auth/ProtectedRoute';

// Context providers
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/AuthContext';
import authService from './api/auth';

// Auto-login component for development
const AutoLogin = () => {
  const { currentUser } = useAuth();
  
  useEffect(() => {
    const autoLogin = async () => {
      // Only auto-login for development and when no user is already logged in
      if (window.location.hostname === 'localhost' && !currentUser && !localStorage.getItem('ecoTravelToken')) {
        console.log('Auto-logging in test user for development...');
        try {
          const result = await authService.login('user@example.com', 'password');
          if (result.token) {
            localStorage.setItem('ecoTravelToken', result.token);
            localStorage.setItem('ecoTravelUser', JSON.stringify(result.user));
            // Reload to apply the login
            window.location.reload();
          }
        } catch (error) {
          console.error('Auto-login failed:', error);
        }
      }
    };
    
    autoLogin();
  }, [currentUser]);
  
  return null;
};

// ScrollToTop component to handle navigation behavior
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Only scroll to top if there's no hash fragment
    if (!window.location.hash) {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return null;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <AutoLogin />
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow pt-20">
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Home />} />
              <Route path="/calculator" element={<CarbonCalculator />} />
              <Route path="/certifications" element={<Certifications />} />
              <Route path="/comparison" element={<CompareOptions />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/reviews" element={<Reviews />} />
              
              {/* Protected routes */}
              <Route 
                path="/profile/*" 
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/wallet" 
                element={
                  <ProtectedRoute>
                    <WalletPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/contribute" 
                element={
                  <ProtectedRoute>
                    <ContributePage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/rewards" 
                element={
                  <ProtectedRoute>
                    <Rewards />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/settings" 
                element={
                  <ProtectedRoute>
                    <SettingsPage />
                  </ProtectedRoute>
                } 
              />
              
              {/* 404 route - must be last */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
          {/* EcoCoin Animation Provider */}
          <EcoCoinAnimationProvider />
          {/* Chatbot */}
          <Chatbot />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App; 