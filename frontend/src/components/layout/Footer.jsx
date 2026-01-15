import React from 'react';
import { Link } from 'react-router-dom';
import { FaPhoneAlt, FaEnvelope, FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-gray-300 pt-16 pb-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* Column 1: Info */}
                    <div className="space-y-6">
                        <h3 className="text-2xl font-bold text-white">YRDS NGO</h3>
                        <div className="text-gray-400">
                            Empowering communities and building a sustainable future for all.
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <FaPhoneAlt className="text-primary" />
                                +91 98765 43210
                            </div>
                            <div className="flex items-center gap-3">
                                <FaEnvelope className="text-primary" />
                                contact@ngo.org
                            </div>
                        </div>
                    </div>

                    {/* Column 2: Quick Links */}
                    <div>
                        <h4 className="text-lg font-bold text-white mb-6">Quick Links</h4>
                        <ul className="space-y-3">
                            <li><Link to="/" className="hover:text-primary transition-colors">Home</Link></li>
                            <li><Link to="/about" className="hover:text-primary transition-colors">About Us</Link></li>
                            <li><Link to="/projects" className="hover:text-primary transition-colors">Projects</Link></li>
                            <li><Link to="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
                            <li><Link to="/donate" className="hover:text-primary transition-colors">Donate</Link></li>
                        </ul>
                    </div>

                    {/* Column 3: Resources */}
                    <div>
                        <h4 className="text-lg font-bold text-white mb-6">Resources</h4>
                        <ul className="space-y-3">
                            <li><Link to="/reports" className="hover:text-primary transition-colors">Annual Reports</Link></li>
                            <li><Link to="/policies" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                            <li><Link to="/terms" className="hover:text-primary transition-colors">Terms of Use</Link></li>
                            <li><Link to="/careers" className="hover:text-primary transition-colors">Careers</Link></li>
                        </ul>
                    </div>

                    {/* Column 4: Newsletter / Social */}
                    <div>
                        <h4 className="text-lg font-bold text-white mb-6">Connect With Us</h4>
                        <div className="mb-6 text-gray-400">
                            Follow us on social media for updates and stories.
                        </div>
                        <div className="flex gap-4">
                            <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary transition-colors">
                                <FaFacebook />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary transition-colors">
                                <FaTwitter />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary transition-colors">
                                <FaInstagram />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary transition-colors">
                                <FaLinkedin />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-500">
                    <div className="text-center md:text-left text-gray-400 mt-4 md:mt-0">
                        &copy; {new Date().getFullYear()} <span className="inline">YRDS NGO</span>. All rights reserved.
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
