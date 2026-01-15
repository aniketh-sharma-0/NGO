import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHandsHelping, FaNetworkWired, FaGraduationCap } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

const VolunteerLanding = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user && user.role?.name === 'Volunteer') {
            navigate('/volunteer/dashboard');
        }
    }, [user, navigate]);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="relative h-[500px] flex items-center justify-center">
                <div className="absolute inset-0 overflow-hidden">
                    <img
                        src="https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=2070&auto=format&fit=crop"
                        alt="Volunteers"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/60"></div>
                </div>
                <div className="relative z-10 text-center px-4 max-w-4xl mx-auto text-white">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6">Join Our Movement</h1>
                    <p className="text-xl md:text-2xl text-gray-200 mb-8">
                        Your time and passion can change lives. Become a part of our global community of changemakers.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/login" className="px-8 py-3 bg-white text-gray-900 font-bold rounded-full hover:bg-gray-100 transition-colors shadow-lg">
                            Login (Existing Volunteers)
                        </Link>
                        <Link to="/volunteer/register" className="px-8 py-3 bg-primary text-white font-bold rounded-full hover:bg-blue-700 transition-colors shadow-lg">
                            Enroll as Volunteer
                        </Link>
                    </div>
                </div>
            </div>

            {/* Why Join Us */}
            <div className="container mx-auto px-4 py-20">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">Why Volunteer With Us?</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Volunteering is more than just giving time; it's about making a tangible difference and growing as an individual.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 text-center border border-gray-100 group">
                        <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300 shadow-inner">
                            <FaHandsHelping />
                        </div>
                        <h3 className="text-xl font-bold mb-3 text-gray-800">Make Real Impact</h3>
                        <p className="text-gray-600 leading-relaxed">Work directly with communities and see the change you create with your own eyes.</p>
                    </div>
                    <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 text-center border border-gray-100 group">
                        <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl group-hover:bg-green-600 group-hover:text-white transition-colors duration-300 shadow-inner">
                            <FaNetworkWired />
                        </div>
                        <h3 className="text-xl font-bold mb-3 text-gray-800">Community & Networking</h3>
                        <p className="text-gray-600 leading-relaxed">Connect with like-minded individuals, professionals, and leaders from diverse backgrounds.</p>
                    </div>
                    <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 text-center border border-gray-100 group">
                        <div className="w-20 h-20 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl group-hover:bg-purple-600 group-hover:text-white transition-colors duration-300 shadow-inner">
                            <FaGraduationCap />
                        </div>
                        <h3 className="text-xl font-bold mb-3 text-gray-800">Skill Development</h3>
                        <p className="text-gray-600 leading-relaxed">Gain valuable experience, leadership skills, and training that boosts your career profile.</p>
                    </div>
                </div>
            </div>

            {/* Call to Action */}
            <div className="bg-blue-900 text-white py-20 text-center px-4">
                <h2 className="text-3xl font-bold mb-6">Ready to Start?</h2>
                <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                    Whether you have an hour a week or can commit full-time, we have a place for you.
                </p>
                <Link to="/volunteer/register" className="inline-block px-10 py-4 bg-white text-blue-900 font-bold rounded-lg hover:bg-gray-100 transition-colors shadow-lg text-lg">
                    Begin Your Application
                </Link>
            </div>
        </div>
    );
};

export default VolunteerLanding;
