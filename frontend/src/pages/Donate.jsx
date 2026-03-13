import React, { useState } from 'react';
import api from '../utils/api';
import { FaHandHoldingHeart, FaBuilding, FaGlobe, FaUserFriends, FaTimes, FaRupeeSign, FaLandmark, FaHandshake, FaHeart, FaCheck } from 'react-icons/fa';
import EditableText from '../components/cms/EditableText';
import PhoneInputWithCountry from '../components/forms/PhoneInputWithCountry';
import Modal from '../components/common/Modal';
import SEO from '../components/common/SEO';
import useBodyScrollLock from '../hooks/useBodyScrollLock';
import { useAuth } from '../context/AuthContext';

const Donate = () => {
    const { user } = useAuth();
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        organization: '',
        email: user?.email || '',
        phone: '',
        address: '',
        pan: '',
        message: ''
    });

    React.useEffect(() => {
        if (user) {
            setFormData(prev => ({ 
                ...prev, 
                name: prev.name || user.name || '',
                email: user.email || '' 
            }));
        }
    }, [user]);

    const [status, setStatus] = useState('');

    useBodyScrollLock(!!selectedCategory);

    const openModal = (category) => {
        setSelectedCategory(category);
        setFormData({ ...formData, category }); // Reset/Init
        setStatus('');
    };

    const closeModal = () => {
        setSelectedCategory(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'name') {
            const filteredValue = value.replace(/[0-9]/g, '');
            setFormData({ ...formData, [name]: filteredValue });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('submitting');
        try {
            await api.post('/donations', { ...formData, category: selectedCategory });
            setStatus('success');
            setFormData({
                name: '', organization: '', email: '', phone: '', address: '', pan: '', message: ''
            });
        } catch (error) {
            console.error(error);
            setStatus('error');
        }
    };

    const cards = [
        {
            id: 'Government',
            icon: <FaLandmark className="text-4xl text-primary" />,
            title: 'Government Funding',
            description: 'Support for state and central government initiatives and partnerships.',
            gradient: 'hidden',
            iconBg: 'bg-blue-50',
            btnColor: 'bg-gray-900 hover:bg-black',
            ringColor: 'hover:ring-gray-200'
        },
        {
            id: 'Corporate',
            icon: <FaHandshake className="text-4xl text-primary" />,
            title: 'CSR & Corporate',
            description: 'Corporate Social Responsibility partnerships and grants.',
            gradient: 'hidden',
            iconBg: 'bg-blue-50',
            btnColor: 'bg-gray-900 hover:bg-black',
            ringColor: 'hover:ring-gray-200'
        },
        {
            id: 'Voluntary',
            icon: <FaHeart className="text-4xl text-primary" />,
            title: 'Individual / Voluntary',
            description: 'Make a personal contribution to change lives directly.',
            gradient: 'hidden',
            iconBg: 'bg-blue-50',
            btnColor: 'bg-gray-900 hover:bg-black',
            ringColor: 'hover:ring-gray-200'
        }
    ];

    return (
        <div className="min-h-screen py-20 bg-gray-100 font-sans">
            <SEO
                title="Donate"
                description="Support YRDS by donating to our causes. Your contribution helps us empower marginalized communities."
                url="/donate"
            />
            <div className="container mx-auto px-4">
                <div className="text-center mb-12 md:mb-16">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-4 font-heading leading-tight">
                        <EditableText contentKey="donate_title" section="Donate" defaultText="Make a Difference" />
                    </h1>
                    <div className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed px-4">
                        <EditableText contentKey="donate_subtitle" section="Donate" defaultText="Your support enables us to continue our mission of empowering communities." />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto z-10 relative">
                    {cards.map((card) => (
                        <div
                            key={card.id}
                            onClick={() => openModal(card.id)}
                            className={`group bg-white p-6 md:p-8 lg:p-10 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer flex flex-col items-center text-center border border-gray-100 hover:border-transparent hover:ring-4 ${card.ringColor} relative overflow-hidden`}
                        >
                            <div className={`absolute top-0 left-0 w-full h-2 ${card.gradient}`}></div>
                            <div className={`w-16 h-16 md:w-20 md:h-20 ${card.iconBg} rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-inner shrink-0`}>
                                {card.icon}
                            </div>
                            <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-3 leading-tight">{card.title}</h3>
                            <p className="text-gray-600 text-sm md:text-base mb-8 leading-relaxed flex-1 w-full">{card.description}</p>
                            <button className={`mt-auto px-6 md:px-8 py-3 min-h-[44px] w-full md:w-auto ${card.btnColor} text-white font-bold rounded-full shadow-lg transform group-hover:-translate-y-1 active:bg-gray-800 transition-all flex items-center justify-center`}>
                                Enquire Now
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Donation Enquiry Modal - Rendered via Portal */}
            <Modal
                isOpen={!!selectedCategory}
                onClose={closeModal}
                title={`${selectedCategory} Enquiry`}
                maxWidth="max-w-xl"
            >
                <div className="space-y-6">
                    {status === 'success' ? (
                        <div className="text-center py-12 animate-fade-in">
                            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                                <FaCheck size={40} />
                            </div>
                            <h3 className="text-3xl font-bold text-gray-900 mb-3">It's Done!</h3>
                            <p className="text-gray-600 font-medium">Your enquiry has been submitted.</p>
                            <p className="text-sm text-gray-400 mt-2 max-w-xs mx-auto">Our team will contact you shortly to coordinate your donation.</p>
                            <button onClick={closeModal} className="mt-8 px-10 py-3 bg-gray-900 text-white font-bold rounded-2xl hover:bg-black transition-all shadow-xl">
                                Close Window
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="bg-blue-50/50 p-4 rounded-2xl flex items-center gap-4 text-blue-900 border border-blue-100/50 mb-4 transition-all animate-fade-in-down">
                                <div className="p-3 bg-white rounded-xl shadow-sm">
                                    <FaHandHoldingHeart className="text-blue-600 text-xl" />
                                </div>
                                <p className="text-sm font-medium leading-relaxed">Thank you for your support. Please share your details to proceed.</p>
                            </div>
                            
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className={`grid grid-cols-1 ${user ? '' : 'sm:grid-cols-2'} gap-4`}>
                                    <div className="space-y-1.5">
                                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Full Name</label>
                                        <input
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            className="w-full bg-gray-50 border border-gray-100 p-3 rounded-xl focus:ring-2 focus:ring-gray-900 focus:outline-none transition-all font-medium"
                                            placeholder="Your Name"
                                            required
                                        />
                                    </div>
                                    {!user && (
                                        <div className="space-y-1.5">
                                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Email Address</label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                className="w-full bg-gray-50 border border-gray-100 p-3 rounded-xl focus:ring-2 focus:ring-gray-900 focus:outline-none transition-all font-medium"
                                                placeholder="you@example.com"
                                                required
                                            />
                                        </div>
                                    )}
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-1.5 flex flex-col">
                                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Phone Number</label>
                                        <PhoneInputWithCountry
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            className="w-full"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Organization (Optional)</label>
                                        <input
                                            name="organization"
                                            value={formData.organization}
                                            onChange={handleInputChange}
                                            className="w-full bg-gray-50 border border-gray-100 p-3 rounded-xl focus:ring-2 focus:ring-gray-900 focus:outline-none transition-all font-medium"
                                            placeholder="Company name"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Message</label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleInputChange}
                                        className="w-full bg-gray-50 border border-gray-100 p-3 rounded-xl h-24 focus:ring-2 focus:ring-gray-900 focus:outline-none transition-all resize-none font-medium"
                                        placeholder="Any specific heart for this donation?"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={status === 'submitting'}
                                    className="w-full bg-gray-900 text-white font-bold py-4 rounded-2xl hover:bg-black transition-all shadow-xl active:scale-[0.98] disabled:opacity-50 mt-4 h-14 flex items-center justify-center"
                                >
                                    {status === 'submitting' ? (
                                        <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                    ) : 'Submit Enquiry'}
                                </button>
                            </form>
                        </>
                    )}
                </div>
            </Modal>
        </div >
    );
};

export default Donate;
