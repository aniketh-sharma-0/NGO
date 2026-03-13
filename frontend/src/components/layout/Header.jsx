import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCMS } from '../../context/CMSContext';
import { FaBars, FaTimes, FaUserCircle, FaBell } from 'react-icons/fa';
import EditableText from '../cms/EditableText';
import EditableImage from '../cms/EditableImage';
import { useUI } from '../../context/UIContext';
import { useNotifications } from '../../context/NotificationContext';

const Header = () => {
    const { user, logout } = useAuth();
    const { setIsEditMode } = useCMS();
    const navigate = useNavigate();
    const { isMobileMenuOpen, setIsMobileMenuOpen, unreadCount, fetchUnreadCount } = useUI();
    const { notifications, unreadCount: notifUnread, markAsRead } = useNotifications();
    const [isProjectsDropdownOpen, setIsProjectsDropdownOpen] = useState(false);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const [isNotificationDropdownOpen, setIsNotificationDropdownOpen] = useState(false);
    const notificationRef = React.useRef(null);

    const handleNotificationClick = async (notification) => {
        if (!notification.isRead) {
            await markAsRead(notification._id);
        }
        setIsNotificationDropdownOpen(false);
        if (notification.redirectLink) {
            navigate(notification.redirectLink);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                setIsNotificationDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (user && user.role?.name === 'Admin') {
            fetchUnreadCount();
        }
    }, [user, fetchUnreadCount]);

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
        <header className="bg-white shadow-sm z-40 font-heading">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 md:py-4 flex justify-between items-center">
                {/* Logo and Name */}
                <Link to="/" className="flex items-center gap-2 sm:gap-3 active:opacity-70 transition-opacity min-w-0">
                    <div className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 relative overflow-hidden rounded-full border border-gray-200 shadow-sm flex-shrink-0">
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
                    <div className="flex flex-col justify-center overflow-hidden min-w-0">
                        <span className="text-xs sm:text-base md:text-lg lg:text-xl font-bold text-slate-800 leading-tight truncate">
                            Yaswanth Rural
                        </span>
                        <span className="text-xs sm:text-base md:text-lg lg:text-xl font-bold text-slate-800 leading-tight truncate">
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
                    <div 
                        className="relative group/dropdown h-full flex items-center"
                        onMouseEnter={() => setIsProjectsDropdownOpen(true)}
                        onMouseLeave={() => setIsProjectsDropdownOpen(false)}
                    >
                        <div
                            role="button"
                            onClick={() => setIsProjectsDropdownOpen(!isProjectsDropdownOpen)}
                            className="relative font-sans font-medium leading-tight flex items-center gap-1 text-gray-700 hover:text-blue-600 transition-colors h-full px-1 transform-gpu backface-hidden cursor-pointer after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-[2px] after:bg-blue-600 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300"
                        >
                            <span>Projects</span>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </div>
                        <div className={`absolute top-full left-0 w-48 bg-white shadow-xl rounded-b-lg border border-gray-100 transition-all duration-200 transform ${isProjectsDropdownOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-2'}`}>
                            <Link to="/projects?category=Government" onClick={() => setIsProjectsDropdownOpen(false)} className="block px-4 py-3 hover:bg-gray-50 text-gray-700 hover:text-blue-600 border-b border-gray-50">Government Projects</Link>
                            <Link to="/projects?category=CSR" onClick={() => setIsProjectsDropdownOpen(false)} className="block px-4 py-3 hover:bg-gray-50 text-gray-700 hover:text-blue-600 border-b border-gray-50">CSR Projects</Link>
                            <Link to="/projects?category=Client" onClick={() => setIsProjectsDropdownOpen(false)} className="block px-4 py-3 hover:bg-gray-50 text-gray-700 hover:text-blue-600">Client Projects</Link>
                        </div>
                    </div>

                    <NavItem to="/contact" labelKey="nav_contact" defaultLabel="Contact Us" className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700 transition-colors h-auto flex-none flex items-center justify-center self-center font-sans leading-tight transform-gpu border-2 border-transparent" />

                    {user ? (
                        <div className="flex items-center gap-1">
                            {/* Notification Bell */}
                            {(user.role?.name === 'Admin' || user.role?.name === 'Volunteer') && (
                                <div className="relative group z-50 h-full flex items-center mr-1" ref={notificationRef}>
                                    <button
                                        onClick={() => setIsNotificationDropdownOpen(!isNotificationDropdownOpen)}
                                        className="relative p-2 text-gray-500 hover:text-blue-600 transition-colors rounded-full hover:bg-gray-100"
                                    >
                                        <FaBell size={20} />
                                    </button>
                                    
                                    {/* Notification Dropdown Menu */}
                                    <div className={`absolute right-0 top-full mt-2 w-80 bg-white shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] rounded-2xl border border-gray-100 transition-all duration-300 transform overflow-hidden z-50 ${isNotificationDropdownOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-2'}`}>
                                        <div className="px-4 py-3 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                                            <span className="font-bold text-gray-800 text-sm tracking-wide uppercase">Notifications</span>
                                        </div>
                                        <div className="max-h-[320px] overflow-y-auto">
                                            {notifications.length > 0 ? (
                                                notifications.slice(0, 5).map(n => (
                                                    <div key={n._id} onClick={() => handleNotificationClick(n)} className={`px-4 py-3 border-b border-gray-50 cursor-pointer hover:bg-gray-50 transition-colors ${!n.isRead ? 'bg-blue-50/30' : ''}`}>
                                                        <div className="flex justify-between items-start gap-2">
                                                            <p className={`text-sm leading-tight ${!n.isRead ? 'font-bold text-gray-900' : 'font-medium text-gray-700'}`}>{n.title}</p>
                                                        </div>
                                                        <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-snug">{n.message}</p>
                                                        <p className="text-[10px] text-gray-400 mt-1.5">{new Date(n.createdAt).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="px-4 py-8 text-center text-gray-500 text-sm flex flex-col items-center gap-2">
                                                    <FaBell className="text-gray-300 text-2xl" />
                                                    <p>All caught up!</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                        <div 
                            className="relative group z-50 h-full flex items-center"
                            onMouseEnter={() => setIsProfileDropdownOpen(true)}
                            onMouseLeave={() => setIsProfileDropdownOpen(false)}
                        >
                            <button
                                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                                className="flex items-center gap-3 pl-1 pr-3 py-1.5 rounded-full hover:bg-blue-50 transition-all group-hover:bg-blue-50/50 border border-transparent hover:border-blue-100"
                            >
                                <div className="w-9 h-9 rounded-full bg-[#1e3a8a] text-white flex items-center justify-center font-bold text-sm shadow-sm font-heading relative">
                                    {user.name ? user.name.charAt(0).toUpperCase() : <FaUserCircle />}
                                    {notifUnread > 0 && (
                                        <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-red-500 border-2 border-white rounded-full shadow-sm"></span>
                                    )}
                                </div>
                                <div className="flex flex-col items-start px-1 text-left">
                                    <span className="max-w-[100px] truncate font-bold text-gray-800 text-sm leading-tight font-sans group-hover:text-blue-900 transition-colors">{user.name}</span>
                                    <span className="text-[10px] font-medium text-gray-500 leading-tight uppercase tracking-wider font-sans">{user.role?.name || 'User'}</span>
                                </div>
                            </button>

                            {/* Dropdown Menu */}
                            <div className={`absolute right-0 top-full mt-2 w-60 bg-white shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] rounded-2xl border border-gray-100 transition-all duration-300 transform overflow-hidden z-50 ${isProfileDropdownOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-2'}`}>
                                {/* User Header */}
                                <div className="px-5 py-4 border-b border-gray-50">
                                    <p className="font-bold text-gray-900 truncate text-sm">{user.name}</p>
                                    <p className="text-[10px] text-gray-500 truncate">{user.email}</p>
                                </div>

                                {/* Menu Items */}
                                <div className="p-1.5">
                                    {user.role?.name === 'Admin' && (
                                        <Link
                                            to="/dashboard"
                                            onClick={() => { setIsMobileMenuOpen(false); setIsProfileDropdownOpen(false); }}
                                            className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-50 text-gray-700 hover:text-gray-900 transition-colors group/item"
                                        >
                                            <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center group-hover/item:bg-blue-600 group-hover/item:text-white transition-colors relative">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
                                            </div>
                                            <div className="flex-1 flex justify-between items-center">
                                                <span className="font-bold text-sm">Dashboard</span>
                                                {notifUnread > 0 && (
                                                    <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center shadow-sm">
                                                        {notifUnread > 9 ? '9+' : notifUnread}
                                                    </span>
                                                )}
                                            </div>
                                        </Link>
                                    )}
                                    {user.role?.name === 'Volunteer' && (
                                        <Link
                                            to="/volunteer/dashboard"
                                            onClick={() => { setIsMobileMenuOpen(false); setIsProfileDropdownOpen(false); }}
                                            className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-50 text-gray-700 hover:text-gray-900 transition-colors group/item"
                                        >
                                            <div className="w-8 h-8 rounded-full bg-green-50 text-green-600 flex items-center justify-center group-hover/item:bg-green-600 group-hover/item:text-white transition-colors">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                                            </div>
                                            <div className="flex-1 flex justify-between items-center">
                                                <span className="font-bold text-sm">Volunteer Hub</span>
                                                {notifUnread > 0 && (
                                                    <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center shadow-sm">
                                                        {notifUnread > 9 ? '9+' : notifUnread}
                                                    </span>
                                                )}
                                            </div>
                                        </Link>
                                    )}

                                    <div className="h-px bg-gray-50 my-1 mx-2"></div>

                                    <button
                                        onClick={() => { setIsProfileDropdownOpen(false); handleLogout(); }}
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
                        </div>
                    ) : (
                        <Link to="/login" className="bg-blue-900 text-white px-6 py-2 rounded-full hover:bg-blue-800 transition-versions shadow-md hover:shadow-lg font-bold tracking-wide">
                            Login
                        </Link>
                    )
                    }
                </nav >

                {/* Mobile Menu Button */}
                <button className="lg:hidden text-gray-700 focus:outline-none p-3 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full active:bg-gray-100 transition-colors ml-2 flex-shrink-0" onClick={toggleMobileMenu}>
                    {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                </button>
            </div >

            {/* Mobile Navigation Overlay */}
            {isMobileMenuOpen && (
                <>
                    {/* Backdrop */}
                    <div 
                        className="lg:hidden fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] animate-fade-in"
                        onClick={() => setIsMobileMenuOpen(false)}
                    />
                    
                    {/* Menu Content */}
                    <div className="lg:hidden fixed top-0 right-0 w-4/5 max-w-sm h-full bg-white shadow-2xl z-[101] flex flex-col animate-slide-in-right overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <span className="font-bold text-gray-900 uppercase tracking-widest text-sm">Navigation</span>
                            <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-gray-500 hover:text-red-500 transition-colors">
                                <FaTimes size={24} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-1">
                            <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="block py-4 text-lg font-bold text-gray-800 hover:text-blue-600 transition-all border-b border-gray-50">Home</Link>
                            <Link to="/about" onClick={() => setIsMobileMenuOpen(false)} className="block py-4 text-lg font-bold text-gray-800 hover:text-blue-600 transition-all border-b border-gray-50">About Us</Link>
                            <Link to="/media" onClick={() => setIsMobileMenuOpen(false)} className="block py-4 text-lg font-bold text-gray-800 hover:text-blue-600 transition-all border-b border-gray-50">Blogs & Events</Link>
                            <Link to="/donate" onClick={() => setIsMobileMenuOpen(false)} className="block py-4 text-lg font-bold text-gray-800 hover:text-blue-600 transition-all border-b border-gray-50">Donation</Link>
                            <Link to="/volunteer" onClick={() => setIsMobileMenuOpen(false)} className="block py-4 text-lg font-bold text-gray-800 hover:text-blue-600 transition-all border-b border-gray-50">Volunteering</Link>

                            <div className="pt-6 pb-4">
                                <span className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.2em] block mb-4">Focus Areas</span>
                                <div className="space-y-3">
                                    <Link to="/projects?category=Government" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 text-gray-600 font-bold hover:text-blue-600 transition-all text-sm group">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-200 group-hover:bg-blue-600 transition-all"></div>
                                        Government Projects
                                    </Link>
                                    <Link to="/projects?category=CSR" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 text-gray-600 font-bold hover:text-blue-600 transition-all text-sm group">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-200 group-hover:bg-blue-600 transition-all"></div>
                                        CSR Projects
                                    </Link>
                                    <Link to="/projects?category=Client" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 text-gray-600 font-bold hover:text-blue-600 transition-all text-sm group">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-200 group-hover:bg-blue-600 transition-all"></div>
                                        Client Projects
                                    </Link>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 bg-gray-50 border-t border-gray-100 mt-auto">
                            <Link
                                to="/contact"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="block w-full bg-green-600 text-white text-center py-4 rounded-xl font-bold hover:bg-green-700 transition-all shadow-lg active:scale-[0.98] mb-4"
                            >
                                Contact Us
                            </Link>

                            {user ? (
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-gray-200 shadow-sm">
                                        <div className="w-10 h-10 rounded-full bg-blue-900 text-white flex items-center justify-center font-bold text-sm">
                                            {user.name?.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="flex flex-col min-w-0">
                                            <span className="font-bold text-gray-900 text-sm truncate">{user.name}</span>
                                            <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">{user.role?.name}</span>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        {(user.role?.name === 'Admin' || user.role?.name === 'Volunteer') && (
                                            <Link
                                                to={user.role?.name === 'Admin' ? "/dashboard" : "/volunteer/dashboard"}
                                                onClick={() => setIsMobileMenuOpen(false)}
                                                className="py-3 bg-white border border-gray-200 rounded-xl text-xs font-bold text-blue-900 text-center shadow-sm"
                                            >
                                                Dashboard
                                            </Link>
                                        )}
                                        <button
                                            onClick={handleLogout}
                                            className="py-3 bg-red-50 border border-red-100 rounded-xl text-xs font-bold text-red-600 hover:bg-red-100 transition-all shadow-sm"
                                        >
                                            Logout
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="block w-full bg-blue-900 text-white text-center py-4 rounded-xl font-bold shadow-xl active:scale-[0.98]">
                                    Login
                                </Link>
                            )}
                        </div>
                    </div>
                </>
            )}
        </header >
    );
};

export default Header;
