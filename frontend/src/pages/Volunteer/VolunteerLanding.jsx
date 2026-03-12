import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHandsHelping, FaNetworkWired, FaGraduationCap } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { useCMS } from '../../context/CMSContext';
import api from '../../utils/api';
import SEO from '../../components/common/SEO';
import EditableImage from '../../components/cms/EditableImage';

const VolunteerLanding = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { isEditMode } = useCMS();
    const isAdmin = user?.role?.name === 'Admin';
    const [pageContent, setPageContent] = useState({});

    useEffect(() => {
        if (user && user.role?.name === 'Volunteer') {
            navigate('/volunteer/dashboard');
        }
    }, [user, navigate]);

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const res = await api.get('/content/Volunteer');
                setPageContent(res.data || {});
            } catch (err) {
                console.error("Failed to fetch volunteer content", err);
            }
        };
        fetchContent();
    }, []);

    return (
        <div className="min-h-screen font-sans">
            <SEO
                title="Volunteer With Us"
                description="Join YRDS as a volunteer and make a real impact in rural communities. Sign up or log in to your dashboard."
                url="/volunteer"
            />
            {/* Hero Section */}
            <div className="relative h-[600px] flex items-center justify-center">
                <div className="absolute inset-0 overflow-hidden">
                    <EditableImage
                        defaultSrc={pageContent.hero_bg_image || "https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=2070&auto=format&fit=crop"}
                        alt="Volunteers"
                        className="w-full h-full absolute inset-0"
                        imgClassName="w-full h-full object-cover"
                        onSave={async (newUrl) => {
                            await api.put('/admin/content', { key: 'hero_bg_image', value: newUrl, section: 'Volunteer' });
                            setPageContent(prev => ({ ...prev, hero_bg_image: newUrl }));
                        }}
                        editable={isAdmin && isEditMode}
                        editPosition="bottom-right"
                    />
                    <div className="absolute inset-0 bg-black/50"></div>
                </div>
                <div className="relative z-10 text-center px-4 max-w-4xl mx-auto text-white">
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 font-heading tracking-tight leading-tight">Join Our Movement</h1>
                    <p className="text-xl md:text-2xl text-blue-100 mb-10 font-light max-w-2xl mx-auto">
                        Your time and passion can change lives. Become a part of our global community of changemakers.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-6 justify-center">
                        <Link to="/login" className="px-8 py-4 bg-white text-blue-900 font-bold rounded-full hover:bg-blue-50 transition-all shadow-xl hover:scale-105 transform duration-300">
                            Login (Existing Volunteers)
                        </Link>
                        <Link to="/volunteer/register" className="px-8 py-4 bg-green-500 text-white font-bold rounded-full hover:bg-green-600 transition-all shadow-xl hover:scale-105 transform duration-300">
                            Enroll as Volunteer
                        </Link>
                    </div>
                </div>
            </div>

            {/* Why Join Us - Gray Partition */}
            <div className="bg-gray-100 border-y border-gray-200 py-24">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-800 mb-4 font-heading">Why Volunteer With Us?</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                            Volunteering is more than just giving time; it's about making a tangible difference and growing as an individual.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        <div className="bg-white p-10 rounded-3xl shadow-lg border border-gray-100">
                            <div className="w-20 h-20 bg-gray-100 text-gray-600 rounded-2xl flex items-center justify-center mx-auto mb-8 text-3xl shadow-sm">
                                <FaHandsHelping />
                            </div>
                            <h3 className="text-2xl font-bold mb-4 text-gray-800 font-heading">Make Real Impact</h3>
                            <p className="text-gray-600 leading-relaxed">Work directly with communities and see the change you create with your own eyes.</p>
                        </div>
                        <div className="bg-white p-10 rounded-3xl shadow-lg border border-gray-100">
                            <div className="w-20 h-20 bg-gray-100 text-gray-600 rounded-2xl flex items-center justify-center mx-auto mb-8 text-3xl shadow-sm">
                                <FaNetworkWired />
                            </div>
                            <h3 className="text-2xl font-bold mb-4 text-gray-800 font-heading">Community & Networking</h3>
                            <p className="text-gray-600 leading-relaxed">Connect with like-minded individuals, professionals, and leaders from diverse backgrounds.</p>
                        </div>
                        <div className="bg-white p-10 rounded-3xl shadow-lg border border-gray-100">
                            <div className="w-20 h-20 bg-gray-100 text-gray-600 rounded-2xl flex items-center justify-center mx-auto mb-8 text-3xl shadow-sm">
                                <FaGraduationCap />
                            </div>
                            <h3 className="text-2xl font-bold mb-4 text-gray-800 font-heading">Skill Development</h3>
                            <p className="text-gray-600 leading-relaxed">Gain valuable experience, leadership skills, and training that boosts your career profile.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Call to Action */}
            <div className="bg-gray-900 text-white pt-24 pb-32 md:pb-24 text-center px-4 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                    <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
                    </svg>
                </div>
                <div className="relative z-10">
                    <h2 className="text-4xl font-bold mb-6 font-heading">Ready to Start?</h2>
                    <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto font-light">
                        Whether you have an hour a week or can commit full-time, we have a place for you.
                    </p>
                    <Link to="/volunteer/register" className="inline-block px-12 py-5 bg-white text-gray-900 font-bold rounded-full hover:bg-blue-50 transition-all shadow-xl text-lg hover:scale-105 transform duration-300">
                        Begin Your Application
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default VolunteerLanding;
