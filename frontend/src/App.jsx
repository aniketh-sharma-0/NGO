import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CMSProvider } from './context/CMSContext';
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

import TopMarquee from './components/home/TopMarquee';
import ChatWidget from './components/chat/ChatWidget';
import EditToggle from './components/cms/EditToggle';

import RoleRoute from './utils/RoleRoute';

function App() {
  return (
    <AuthProvider>
      <CMSProvider>
        <Router>
          <div className="flex flex-col min-h-screen">
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
      </CMSProvider>
    </AuthProvider>
  );
}

export default App;
