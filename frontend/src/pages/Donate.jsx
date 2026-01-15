import React, { useState } from 'react';
import axios from 'axios';
import { FaHandHoldingHeart, FaBuilding, FaGlobe, FaUserFriends, FaTimes, FaRupeeSign, FaLandmark, FaHandshake, FaHeart } from 'react-icons/fa';
import EditableText from '../components/cms/EditableText';

const Donate = () => {
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        organization: '',
        email: '',
        phone: '',
        amount: '',
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
            await axios.post('/api/donations', { ...formData, category: selectedCategory });
            setStatus('success');
            setFormData({
                name: '', organization: '', email: '', phone: '', amount: '', address: '', pan: '', message: ''
            });
        } catch (error) {
            console.error(error);
            setStatus('error');
        }
    };

    const cards = [
        {
            id: 'Government',
            icon: <FaLandmark className="text-4xl text-blue-600" />,
            title: 'Government Funding',
            description: 'Support for state and central government initiatives and partnerships.',
            gradient: 'bg-gradient-to-r from-blue-400 to-blue-600',
            iconBg: 'bg-blue-50',
            btnColor: 'bg-blue-600 hover:bg-blue-700',
            ringColor: 'hover:ring-blue-200'
        },
        {
            id: 'Corporate',
            icon: <FaHandshake className="text-4xl text-purple-600" />,
            title: 'CSR & Corporate',
            description: 'Corporate Social Responsibility partnerships and grants.',
            gradient: 'bg-gradient-to-r from-purple-400 to-purple-600',
            iconBg: 'bg-purple-50',
            btnColor: 'bg-purple-600 hover:bg-purple-700',
            ringColor: 'hover:ring-purple-200'
        },
        {
            id: 'Voluntary',
            icon: <FaHeart className="text-4xl text-red-600" />,
            title: 'Individual / Voluntary',
            description: 'Make a personal contribution to change lives directly.',
            gradient: 'bg-gradient-to-r from-red-400 to-red-600',
            iconBg: 'bg-red-50',
            btnColor: 'bg-red-600 hover:bg-red-700',
            ringColor: 'hover:ring-red-200'
        }
    ];

    return (
        <div className="bg-gray-50 min-h-screen py-16">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-bold text-gray-800 mb-4">
                        <EditableText contentKey="donate_title" section="Donate" defaultText="Make a Difference" />
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        <EditableText contentKey="donate_subtitle" section="Donate" defaultText="Your support enables us to continue our mission of empowering communities." />
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto z-10 relative">
                    {cards.map((card) => (
                        <div
                            key={card.id}
                            onClick={() => openModal(card.id)}
                            className={`group bg-white p-10 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer flex flex-col items-center text-center border border-gray-100 hover:border-transparent hover:ring-4 ${card.ringColor} relative overflow-hidden`}
                        >
                            <div className={`absolute top-0 left-0 w-full h-2 ${card.gradient}`}></div>
                            <div className={`w-20 h-20 ${card.iconBg} rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-inner`}>
                                {card.icon}
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-3">{card.title}</h3>
                            <p className="text-gray-600 mb-8 leading-relaxed">{card.description}</p>
                            <button className={`mt-auto px-8 py-3 ${card.btnColor} text-white font-bold rounded-full shadow-lg transform group-hover:-translate-y-1 transition-all`}>
                                Donate Now
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
                            <h2 className="text-2xl font-bold text-gray-800">{selectedCategory} Donation</h2>
                            <button onClick={closeModal} className="text-gray-500 hover:text-red-500">
                                <FaTimes size={24} />
                            </button>
                        </div>

                        <div className="p-6">
                            {status === 'success' ? (
                                <div className="text-center py-8 text-green-600">
                                    <FaHandHoldingHeart className="text-6xl mx-auto mb-4" />
                                    <h3 className="text-2xl font-bold">Thank You!</h3>
                                    <p>Your details have been recorded. We will contact you shortly.</p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="bg-blue-50 p-4 rounded-lg flex items-center gap-3 text-blue-800 text-sm mb-4">
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
                                        className="w-full bg-blue-600 text-white py-4 rounded-lg font-bold shadow-lg hover:bg-blue-800 hover:shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                        disabled={status === 'submitting'}
                                    >
                                        {status === 'submitting' ? 'Processing...' : 'Proceed'}
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
