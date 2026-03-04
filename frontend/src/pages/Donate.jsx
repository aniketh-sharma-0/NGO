import React, { useState } from 'react';
import api from '../utils/api';
import { FaHandHoldingHeart, FaBuilding, FaGlobe, FaUserFriends, FaTimes, FaRupeeSign, FaLandmark, FaHandshake, FaHeart, FaCheck } from 'react-icons/fa';
import EditableText from '../components/cms/EditableText';
import SEO from '../components/common/SEO';

const Donate = () => {
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        organization: '',
        email: '',
        phone: '',
        address: '',
        pan: '',
        message: ''
    });
    const [status, setStatus] = useState('');

    const openModal = (category) => {
        setSelectedCategory(category);
        setFormData({ ...formData, category }); // Reset/Init
        setStatus('');
    };

    const closeModal = () => {
        setSelectedCategory(null);
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
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
                    <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed px-4">
                        <EditableText contentKey="donate_subtitle" section="Donate" defaultText="Your support enables us to continue our mission of empowering communities." />
                    </p>
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

            {/* Modal */}
            {selectedCategory && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white z-10">
                            <h2 className="text-2xl font-bold text-gray-800">{selectedCategory} Enquiry</h2>
                            <button onClick={closeModal} className="text-gray-500 hover:text-red-500 p-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full active:bg-gray-100 transition-colors">
                                <FaTimes size={24} />
                            </button>
                        </div>

                        <div className="p-6">
                            {status === 'success' ? (
                                <div className="text-center py-8 text-green-600">
                                    <FaCheck className="text-6xl mx-auto mb-4" />
                                    <h3 className="text-2xl font-bold">It's Done!</h3>
                                    <p className="mt-2 text-gray-600">Your enquiry has been submitted.</p>
                                    <p className="text-sm text-gray-500 mt-1">Our team will contact you shortly to coordinate your donation.</p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="bg-blue-50 p-4 rounded-lg flex items-center gap-3 text-blue-900 text-sm mb-4">
                                        <FaHandHoldingHeart className="text-xl shrink-0" />
                                        <p>Thank you for choosing to support us. Please fill in your details to proceed.</p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Full Name</label>
                                        <input
                                            name="name"
                                            value={formData.name} onChange={handleInputChange}
                                            className="w-full bg-white border border-gray-300 text-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
                                            required
                                        />
                                    </div>

                                    {/* Amount Field Removed */}

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-1">Email</label>
                                            <input
                                                name="email" type="email"
                                                value={formData.email} onChange={handleInputChange}
                                                className="w-full bg-white border border-gray-300 text-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-1">Phone</label>
                                            <input
                                                name="phone"
                                                value={formData.phone} onChange={handleInputChange}
                                                className="w-full bg-white border border-gray-300 text-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Show Organization ONLY if NOT Voluntary */}
                                    {selectedCategory !== 'Voluntary' && (
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-1">Organization Name</label>
                                            <input
                                                name="organization"
                                                value={formData.organization} onChange={handleInputChange}
                                                className="w-full bg-white border border-gray-300 text-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
                                                required={selectedCategory !== 'Voluntary'}
                                            />
                                        </div>
                                    )}

                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Message (Optional)</label>
                                        <textarea
                                            name="message"
                                            value={formData.message} onChange={handleInputChange}
                                            className="w-full bg-white border border-gray-300 text-gray-700 rounded-lg px-4 py-3 h-24 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all shadow-sm resize-none"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full bg-blue-900 text-white py-4 min-h-[44px] rounded-lg font-bold shadow-lg hover:bg-opacity-90 active:bg-blue-800 hover:shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                        disabled={status === 'submitting'}
                                    >
                                        {status === 'submitting' ? 'Sending...' : 'Submit Enquiry'}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div >
            )}
        </div >
    );
};

export default Donate;
