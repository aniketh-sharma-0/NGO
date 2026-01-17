import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCMS } from '../../context/CMSContext';
import { FaBars, FaTimes, FaUserCircle } from 'react-icons/fa';
import EditableText from '../cms/EditableText';
import EditableImage from '../cms/EditableImage';

const Header = () => {
    const { user, logout } = useAuth();
    const { setIsEditMode } = useCMS();
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        setIsEditMode(false); // Turn off edit mode
        logout();
        navigate('/login');
        setIsMobileMenuOpen(false);
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const NavItem = ({ to, labelKey, defaultLabel, className = "" }) => {
        // Use default text colors/hover only if not overridden by custom classes (heuristic or prop)
        // Simpler: Just allow className to dictate everything if we want, or keep defaults.
        // Let's toggle default styles based on if it's a "button" style passed in (e.g. bg-...).
        const isButton = className.includes('bg-');
        const defaultClasses = isButton ? "" : "text-gray-700 hover:text-blue-600";

        return (
            <Link to={to} className={`${defaultClasses} font-medium transition-colors whitespace-nowrap ${className}`} onClick={() => setIsMobileMenuOpen(false)}>
                <EditableText
                    contentKey={labelKey}
                    section="Navigation"
                    defaultText={defaultLabel}
                    className="inline-block"
                    editable={false}
                />
            </Link>
        );
    };

    return (
        <header className="bg-white shadow-md relative z-40">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                {/* Logo and Name */}
                <Link to="/" className="flex items-center gap-3">
                    <div className="w-10 h-10 md:w-12 md:h-12 relative overflow-hidden rounded-full border border-gray-200">
                        <EditableImage
                            contentKey="ngo_logo"
                            section="Header"
                            alt="NGO Logo"
                            className="w-full h-full object-cover"
                            defaultSrc="https://via.placeholder.com/150"
                            editable={false}
                        />
                    </div>
                    <div className="flex flex-col justify-center">
                        <span className="text-lg md:text-xl font-bold text-blue-900 leading-tight whitespace-nowrap">
                            Yaswanth Rural
                        </span>
                        <span className="text-lg md:text-xl font-bold text-blue-900 leading-tight whitespace-nowrap">
                            Development Society
                        </span>
                    </div>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden lg:flex items-center space-x-6 text-sm font-medium">
                    <NavItem to="/" labelKey="nav_home" defaultLabel="Home" />
                    <NavItem to="/about" labelKey="nav_about" defaultLabel="About Us" />
                    <NavItem to="/media" labelKey="nav_media" defaultLabel="Blogs & Events" />
                    <NavItem to="/donate" labelKey="nav_donate" defaultLabel="Donation" />
                    <NavItem to="/volunteer" labelKey="nav_volunteer" defaultLabel="Volunteering" />

                    {/* Projects Dropdown */}
                    <div className="relative group">
                        <button className="flex items-center gap-1 text-gray-700 hover:text-blue-600 transition-colors py-2">
                            <span>Projects</span>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </button>
                        <div className="absolute top-full left-0 w-48 bg-white shadow-xl rounded-b-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0">
                            <Link to="/projects?category=Government" className="block px-4 py-3 hover:bg-gray-50 text-gray-700 hover:text-blue-600 border-b border-gray-50">Government Projects</Link>
                            <Link to="/projects?category=CSR" className="block px-4 py-3 hover:bg-gray-50 text-gray-700 hover:text-blue-600 border-b border-gray-50">CSR Projects</Link>
                            <Link to="/projects?category=Client" className="block px-4 py-3 hover:bg-gray-50 text-gray-700 hover:text-blue-600">Client Projects</Link>
                        </div>
                    </div>

                    <NavItem to="/contact" labelKey="nav_contact" defaultLabel="Contact Us" className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700 transition-colors" />

                    {user ? (
                        <div className="relative group z-50">
                            <button className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors focus:outline-none py-2">
                                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold border border-blue-200">
                                    {user.name ? user.name.charAt(0).toUpperCase() : <FaUserCircle />}
                                </div>
                                <span className="max-w-[100px] truncate font-medium">{user.name}</span>
                            </button>

                            {/* Dropdown Menu */}
                            <div className="absolute right-0 top-full mt-0 w-48 bg-white shadow-xl rounded-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 overflow-hidden">
                                <div className="px-4 py-3 border-b border-gray-50 bg-gray-50">
                                    <p className="text-xs font-bold text-gray-500 uppercase">Signed in as</p>
                                    <p className="text-sm font-medium text-gray-800 truncate" title={user.email}>{user.email}</p>
                                </div>

                                {user.role?.name === 'Admin' && (
                                    <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                                        Admin Dashboard
                                    </Link>
                                )}
                                {user.role?.name === 'Volunteer' && (
                                    <Link to="/volunteer/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                                        Volunteer Dashboard
                                    </Link>
                                )}

                                <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">
                                    Logout
                                </button>
                            </div>
                        </div>
                    ) : (
                        <Link to="/login" className="bg-blue-900 text-white px-6 py-2 rounded-full hover:bg-blue-800 transition-versions shadow-md hover:shadow-lg font-bold tracking-wide">
                            Login
                        </Link>
                    )}
                </nav>

                {/* Mobile Menu Button */}
                <button className="lg:hidden text-gray-700 focus:outline-none p-2" onClick={toggleMobileMenu}>
                    {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                </button>
            </div>

            {/* Mobile Navigation Slide-in/Dropdown */}
            {isMobileMenuOpen && (
                <div className="lg:hidden absolute top-full left-0 w-full bg-white shadow-xl border-t border-gray-100 flex flex-col max-h-[80vh] overflow-y-auto z-40">
                    <div className="flex flex-col p-4 gap-2">
                        <NavItem to="/" labelKey="nav_home" defaultLabel="Home" />
                        <NavItem to="/about" labelKey="nav_about" defaultLabel="About Us" />
                        <NavItem to="/media" labelKey="nav_media" defaultLabel="Blogs & Events" />
                        <NavItem to="/donate" labelKey="nav_donate" defaultLabel="Donation" />
                        <NavItem to="/volunteer" labelKey="nav_volunteer" defaultLabel="Volunteering" />

                        <div className="py-2 border-t border-gray-50 mt-2">
                            <span className="text-gray-400 text-xs font-bold uppercase tracking-wider px-2 block mb-2">Projects</span>
                            <div className="flex flex-col gap-1 pl-4 border-l-2 border-gray-100 ml-2">
                                <Link to="/projects?category=Government" onClick={() => setIsMobileMenuOpen(false)} className="py-2 text-gray-600 hover:text-primary block">Government Projects</Link>
                                <Link to="/projects?category=CSR" onClick={() => setIsMobileMenuOpen(false)} className="py-2 text-gray-600 hover:text-primary block">CSR Projects</Link>
                                <Link to="/projects?category=Client" onClick={() => setIsMobileMenuOpen(false)} className="py-2 text-gray-600 hover:text-primary block">Client Projects</Link>
                            </div>
                        </div>

                        <NavItem to="/contact" labelKey="nav_contact" defaultLabel="Contact Us" />

                        <div className="border-t border-gray-200 pt-4 mt-2">
                            {user ? (
                                <div className="flex flex-col gap-3">
                                    <div className="flex items-center gap-2 font-bold text-gray-700">
                                        <FaUserCircle /> {user.name}
                                    </div>
                                    {user.role?.name === 'Admin' && (
                                        <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="text-primary font-bold">Dashboard</Link>
                                    )}
                                    <button onClick={handleLogout} className="text-left text-red-500 font-medium">Logout</button>
                                </div>
                            ) : (
                                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="block w-full bg-primary text-white text-center py-3 rounded-lg font-bold shadow-md">
                                    Login
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;
