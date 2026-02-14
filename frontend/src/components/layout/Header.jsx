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
        const defaultClasses = isButton
            ? ""
            : "relative font-sans leading-tight text-gray-700 hover:text-blue-600 h-full flex items-center transform-gpu backface-hidden after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-[2px] after:bg-blue-600 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300";

        return (
            <Link to={to} className={`${defaultClasses} font-medium transition-colors whitespace-nowrap ${className}`} onClick={() => setIsMobileMenuOpen(false)}>
                <span>{defaultLabel}</span>
            </Link>
        );
    };

    return (
        <header className="bg-white shadow-sm sticky top-0 z-40 font-heading">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                {/* Logo and Name */}
                <Link to="/" className="flex items-center gap-3">
                    <div className="w-10 h-10 md:w-12 md:h-12 relative overflow-hidden rounded-full border border-gray-200 shadow-sm">
                        <EditableImage
                            contentKey="ngo_logo"
                            section="Header"
                            alt="NGO Logo"
                            className="w-full h-full flex items-center justify-center"
                            imgClassName="w-full h-full object-cover rounded-full"
                            defaultSrc="/logo.png"
                            editable={false}
                        />
                    </div>
                    <div className="flex flex-col justify-center">
                        <span className="text-lg md:text-xl font-bold text-slate-800 leading-tight whitespace-nowrap">
                            Yaswanth Rural
                        </span>
                        <span className="text-lg md:text-xl font-bold text-slate-800 leading-tight whitespace-nowrap">
                            Development Society
                        </span>
                    </div>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden lg:flex items-center space-x-6 text-sm font-medium h-[42px]">
                    <NavItem to="/" labelKey="nav_home" defaultLabel="Home" />
                    <NavItem to="/about" labelKey="nav_about" defaultLabel="About Us" />
                    <NavItem to="/media" labelKey="nav_media" defaultLabel="Blogs & Events" />
                    <NavItem to="/donate" labelKey="nav_donate" defaultLabel="Donation" />
                    <NavItem to="/volunteer" labelKey="nav_volunteer" defaultLabel="Volunteering" />

                    {/* Projects Dropdown */}
                    <div className="relative group/dropdown h-full flex items-center">
                        <div role="button" className="relative font-sans font-medium leading-tight flex items-center gap-1 text-gray-700 hover:text-blue-600 transition-colors h-full px-1 transform-gpu backface-hidden cursor-pointer after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-[2px] after:bg-blue-600 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300">
                            <span>Projects</span>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </div>
                        <div className="absolute top-full left-0 w-48 bg-white shadow-xl rounded-b-lg border border-gray-100 opacity-0 invisible group-hover/dropdown:opacity-100 group-hover/dropdown:visible transition-all duration-200 transform translate-y-2 group-hover/dropdown:translate-y-0">
                            <Link to="/projects?category=Government" className="block px-4 py-3 hover:bg-gray-50 text-gray-700 hover:text-blue-600 border-b border-gray-50">Government Projects</Link>
                            <Link to="/projects?category=CSR" className="block px-4 py-3 hover:bg-gray-50 text-gray-700 hover:text-blue-600 border-b border-gray-50">CSR Projects</Link>
                            <Link to="/projects?category=Client" className="block px-4 py-3 hover:bg-gray-50 text-gray-700 hover:text-blue-600">Client Projects</Link>
                        </div>
                    </div>

                    <NavItem to="/contact" labelKey="nav_contact" defaultLabel="Contact Us" className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700 transition-colors h-auto flex-none flex items-center justify-center self-center font-sans leading-tight transform-gpu border-2 border-transparent" />

                    {user ? (
                        <div className="relative group z-50 h-full flex items-center">
                            <button className="flex items-center gap-3 pl-1 pr-3 py-1.5 rounded-full hover:bg-blue-50 transition-all group-hover:bg-blue-50/50 border border-transparent hover:border-blue-100">
                                <div className="w-9 h-9 rounded-full bg-[#1e3a8a] text-white flex items-center justify-center font-bold text-sm shadow-sm font-heading">
                                    {user.name ? user.name.charAt(0).toUpperCase() : <FaUserCircle />}
                                </div>
                                <div className="flex flex-col items-start px-1 text-left">
                                    <span className="max-w-[100px] truncate font-bold text-gray-800 text-sm leading-tight font-sans group-hover:text-blue-900 transition-colors">{user.name}</span>
                                    <span className="text-[10px] font-medium text-gray-500 leading-tight uppercase tracking-wider font-sans">{user.role?.name || 'User'}</span>
                                </div>
                                <svg className="w-3 h-3 text-gray-400 group-hover:text-blue-800 transition-colors ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                            </button>

                            {/* Dropdown Menu */}
                            <div className="absolute right-0 top-full mt-2 w-60 bg-white shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] rounded-2xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 overflow-hidden animate-fade-in-up z-50">
                                {/* User Header */}
                                <div className="px-5 py-4 border-b border-gray-50">
                                    <p className="font-bold text-gray-900 truncate text-sm">{user.name}</p>
                                    <p className="text-[10px] text-gray-500 truncate">{user.email}</p>
                                </div>

                                {/* Menu Items */}
                                {/* Menu Items */}
                                <div className="p-1.5">
                                    {user.role?.name === 'Admin' && (
                                        <Link
                                            to="/dashboard"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-50 text-gray-700 hover:text-gray-900 transition-colors group/item"
                                        >
                                            <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center group-hover/item:bg-blue-600 group-hover/item:text-white transition-colors">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
                                            </div>
                                            <span className="font-bold text-sm">Dashboard</span>
                                        </Link>
                                    )}
                                    {user.role?.name === 'Volunteer' && (
                                        <Link
                                            to="/volunteer/dashboard"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-50 text-gray-700 hover:text-gray-900 transition-colors group/item"
                                        >
                                            <div className="w-8 h-8 rounded-full bg-green-50 text-green-600 flex items-center justify-center group-hover/item:bg-green-600 group-hover/item:text-white transition-colors">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                                            </div>
                                            <span className="font-bold text-sm">Volunteer Hub</span>
                                        </Link>
                                    )}

                                    <div className="h-px bg-gray-50 my-1 mx-2"></div>

                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-red-50 text-gray-600 hover:text-red-600 transition-colors group/exit"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center group-hover/exit:bg-red-200 group-hover/exit:text-red-600 transition-colors">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                                        </div>
                                        <span className="font-bold text-sm">Log out</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <Link to="/login" className="bg-blue-900 text-white px-6 py-2 rounded-full hover:bg-blue-800 transition-versions shadow-md hover:shadow-lg font-bold tracking-wide">
                            Login
                        </Link>
                    )
                    }
                </nav >

                {/* Mobile Menu Button */}
                < button className="lg:hidden text-gray-700 focus:outline-none p-2" onClick={toggleMobileMenu} >
                    {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                </button >
            </div >

            {/* Mobile Navigation Slide-in/Dropdown */}
            {isMobileMenuOpen && (
                <div className="lg:hidden absolute top-full left-0 w-full bg-white shadow-2xl border-t border-gray-100 flex flex-col max-h-[90vh] overflow-y-auto z-40 animate-fade-in">
                    <div className="flex flex-col p-6 gap-3">
                        <NavItem to="/" labelKey="nav_home" defaultLabel="Home" className="py-2 text-lg border-b border-gray-50" />
                        <NavItem to="/about" labelKey="nav_about" defaultLabel="About Us" className="py-2 text-lg border-b border-gray-50" />
                        <NavItem to="/media" labelKey="nav_media" defaultLabel="Blogs & Events" className="py-2 text-lg border-b border-gray-50" />
                        <NavItem to="/donate" labelKey="nav_donate" defaultLabel="Donation" className="py-2 text-lg border-b border-gray-50" />
                        <NavItem to="/volunteer" labelKey="nav_volunteer" defaultLabel="Volunteering" className="py-2 text-lg border-b border-gray-50" />

                        <div className="py-3 border-b border-gray-50">
                            <span className="text-gray-400 text-xs font-bold uppercase tracking-wider block mb-2">Projects</span>
                            <div className="flex flex-col gap-2 pl-4 border-l-2 border-gray-100 ml-1">
                                <Link to="/projects?category=Government" onClick={() => setIsMobileMenuOpen(false)} className="py-1 text-gray-600 hover:text-blue-900 block font-medium">Government Projects</Link>
                                <Link to="/projects?category=CSR" onClick={() => setIsMobileMenuOpen(false)} className="py-1 text-gray-600 hover:text-blue-900 block font-medium">CSR Projects</Link>
                                <Link to="/projects?category=Client" onClick={() => setIsMobileMenuOpen(false)} className="py-1 text-gray-600 hover:text-blue-900 block font-medium">Client Projects</Link>
                            </div>
                        </div>

                        {/* Distinct Contact Us Button in Mobile */}
                        <Link
                            to="/contact"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="w-full bg-green-600 text-white text-center py-3 rounded-xl font-bold hover:bg-green-700 transition-colors shadow-sm mt-2"
                        >
                            Contact Us
                        </Link>

                        <div className="pt-2">
                            {user ? (
                                <div className="flex flex-col gap-4 bg-gray-50 p-4 rounded-xl">
                                    <div className="flex items-center gap-3 font-bold text-gray-800">
                                        <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center">
                                            <FaUserCircle size={20} />
                                        </div>
                                        <div className="flex flex-col">
                                            <span>{user.name}</span>
                                            <span className="text-xs text-gray-500 font-normal">{user.email}</span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2">
                                        {user.role?.name === 'Admin' && (
                                            <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="text-center py-2 bg-white border border-gray-200 rounded-lg text-sm font-bold text-blue-900 hover:bg-blue-50">
                                                Dashboard
                                            </Link>
                                        )}
                                        <button onClick={handleLogout} className="text-center py-2 bg-white border border-gray-200 rounded-lg text-sm font-bold text-red-600 hover:bg-red-50 w-full">
                                            Logout
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="block w-full bg-blue-900 text-white text-center py-3 rounded-xl font-bold shadow-md hover:bg-blue-800 transition-colors">
                                    Login
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </header >
    );
};

export default Header;
