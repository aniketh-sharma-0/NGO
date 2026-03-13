import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from './context/AuthContext';
import { CMSProvider } from './context/CMSContext';
import { UIProvider } from './context/UIContext';
import { NotificationProvider } from './context/NotificationContext';
import { ToastProvider } from './context/ToastContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import PrivateRoute from './utils/PrivateRoute';
import Home from './pages/Home';
import About from './pages/About';
import Projects from './pages/Projects';
import Donate from './pages/Donate';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import VolunteerRegister from './pages/Volunteer/VolunteerRegister';
import VolunteerLanding from './pages/Volunteer/VolunteerLanding';
import VolunteerDashboard from './pages/Volunteer/VolunteerDashboard';
import BlogsEvents from './pages/BlogsEvents';
import Contact from './pages/Contact';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import { useIdleTimer } from 'react-idle-timer';

import TopMarquee from './components/home/TopMarquee';
import ChatWidget from './components/chat/ChatWidget';
import EditToggle from './components/cms/EditToggle';

import RoleRoute from './utils/RoleRoute';

function App() {
  useEffect(() => {
    // Dynamic Favicon Generator: Forces the logo into a circle for the browser tab
    const setRoundedFavicon = () => {
      const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
      link.type = 'image/png';
      link.rel = 'icon';
      document.head.appendChild(link);

      const canvas = document.createElement('canvas');
      canvas.width = 64;
      canvas.height = 64;
      const ctx = canvas.getContext('2d');
      const img = new Image();
      img.src = '/logo.png';
      img.onload = () => {
        ctx.beginPath();
        ctx.arc(32, 32, 32, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(img, 0, 0, 64, 64);
        link.href = canvas.toDataURL();
      };
    };
    setRoundedFavicon();
  }, []);

  const handleOnIdle = () => {
    console.log('User is idle. Logging out...');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  useIdleTimer({
    timeout: 1000 * 60 * 30, // 30 minutes
    onIdle: handleOnIdle,
    debounce: 500
  });

  return (
    <HelmetProvider>
      <AuthProvider>
        <ToastProvider>
          <NotificationProvider>
            <CMSProvider>
              <UIProvider>
                <Router>
                  <div className="flex flex-col min-h-screen bg-white">
                    <TopMarquee />
                    <Header />
                    <ChatWidget />
                    <EditToggle />
                    <main className="flex-grow">
                      <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/projects" element={<Projects />} />
                        <Route path="/donate" element={<Donate />} />
                        <Route path="/media" element={<BlogsEvents />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/volunteer" element={<VolunteerLanding />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/forgot-password" element={<ForgotPassword />} />
                        <Route path="/reset-password/:token" element={<ResetPassword />} />
                        {/* Protected Routes */}
                        <Route element={<PrivateRoute />}>
                          <Route path="/dashboard" element={<Dashboard />} />
                          <Route path="/volunteer/register" element={<VolunteerRegister />} />

                          {/* Volunteer Only Routes */}
                          <Route element={<RoleRoute allowedRoles={['Volunteer']} />}>
                            <Route path="/volunteer/dashboard" element={<VolunteerDashboard />} />
                          </Route>
                        </Route>
                      </Routes>
                    </main>
                    <Footer />
                  </div>
                </Router>
              </UIProvider>
            </CMSProvider>
          </NotificationProvider>
        </ToastProvider>
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;
