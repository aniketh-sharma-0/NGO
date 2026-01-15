import React, { useState } from 'react';
import axios from 'axios';
import { FaWhatsapp, FaPhoneVolume, FaEnvelopeOpenText, FaComments, FaPaperPlane } from 'react-icons/fa';
import EditableText from '../components/cms/EditableText';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });
    const [status, setStatus] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('submitting');
        try {
            await axios.post('/api/contact', formData);
            setStatus('success');
            setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
        } catch (error) {
            console.error(error);
            setStatus('error');
        }
    };

    const contactChannels = [
        {
            icon: <FaWhatsapp className="text-4xl text-white" />,
            title: 'WhatsApp',
            action: 'Chat with us',
            link: 'https://wa.me/919876543210',
            bg: 'bg-green-500',
            hover: 'hover:bg-green-600',
            text: 'text-green-600'
        },
        {
            icon: <FaPhoneVolume className="text-3xl text-white" />,
            title: 'Call Us',
            action: '+91 987 654 3210',
            link: 'tel:+919876543210',
            bg: 'bg-blue-500',
            hover: 'hover:bg-blue-600',
            text: 'text-blue-600'
        },
        {
            icon: <FaEnvelopeOpenText className="text-3xl text-white" />,
            title: 'Email Us',
            action: 'contact@ngo.org',
            link: 'mailto:contact@ngo.org',
            bg: 'bg-red-500',
            hover: 'hover:bg-red-600',
            text: 'text-red-600'
        },
        {
            icon: <FaComments className="text-4xl text-white" />,
            title: 'SMS',
            action: 'Send a text',
            link: 'sms:+919876543210',
            bg: 'bg-yellow-500',
            hover: 'hover:bg-yellow-600',
            text: 'text-yellow-600'
        }
    ];

    return (
        <div className="bg-white min-h-screen">
            {/* Header */}
            <div className="bg-gray-900 text-white py-20 text-center px-4">
                <h1 className="text-4xl font-bold mb-4">
                    <EditableText contentKey="contact_title" section="Contact" defaultText="Get in Touch" />
                </h1>
                <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                    <EditableText contentKey="contact_subtitle" section="Contact" defaultText="Have questions? We'd love to hear from you." />
                </p>
            </div>

            <div className="container mx-auto px-4 -mt-10 relative z-10 pb-20">

                {/* Contact Channels Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                    {contactChannels.map((channel, idx) => (
                        <a
                            key={idx}
                            href={channel.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group bg-white p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 flex flex-col items-center text-center border border-gray-100"
                        >
                            <div className={`w-16 h-16 ${channel.bg} rounded-full flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                {channel.icon}
                            </div>
                            <h3 className="font-bold text-gray-800 text-lg mb-1">{channel.title}</h3>
                            <p className="text-gray-500 font-medium group-hover:text-primary transition-colors">{channel.action}</p>
                        </a>
                    ))}
                </div>

                {/* Main Content Layout */}
                <div className="grid md:grid-cols-2 gap-12 items-start">

                    {/* Map / Image Section */}
                    <div className="bg-gray-100 rounded-2xl h-[500px] w-full overflow-hidden shadow-inner relative">
                        {/* Placeholder for Map */}
                        <img
                            src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=2068&auto=format&fit=crop"
                            alt="Our Team"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-blue-900/40 flex items-center justify-center">
                            <div className="text-white text-center p-6">
                                <h3 className="text-3xl font-bold mb-2">Let's Make a Difference</h3>
                                <p className="text-lg opacity-90">Reach out to us and start your journey of impact today.</p>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                        <h2 className="text-3xl font-bold text-gray-800 mb-6">Send a Message</h2>

                        {status === 'success' ? (
                            <div className="text-center py-20">
                                <FaPaperPlane className="text-primary text-6xl mx-auto mb-4 animate-bounce" />
                                <h3 className="text-2xl font-bold text-gray-800 mb-2">Message Sent!</h3>
                                <p className="text-gray-600">We will get back to you as soon as possible.</p>
                                <button onClick={() => setStatus('')} className="mt-6 text-primary underline">Send another</button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Inquiry Type</label>
                                    <select
                                        name="inquiryType"
                                        value={formData.inquiryType || 'General'}
                                        onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                                        className="w-full bg-white border border-gray-300 text-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all shadow-sm appearance-none"
                                    >
                                        <option value="General">General Inquiry</option>
                                        <option value="Government">Government Project</option>
                                        <option value="Corporate">Corporate / CSR</option>
                                    </select>
                                </div>

                                {(formData.inquiryType === 'Government' || formData.inquiryType === 'Corporate') && (
                                    <div className="col-span-2">
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Organization Name</label>
                                        <input
                                            name="organization"
                                            value={formData.organization || ''}
                                            onChange={handleChange}
                                            className="w-full bg-white border border-gray-300 text-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
                                            required
                                        />
                                    </div>
                                )}

                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Name</label>
                                        <input
                                            name="name"
                                            value={formData.name} onChange={handleChange}
                                            className="w-full bg-white border border-gray-300 text-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Email</label>
                                        <input
                                            type="email" name="email"
                                            value={formData.email} onChange={handleChange}
                                            className="w-full bg-white border border-gray-300 text-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Phone</label>
                                    <input
                                        name="phone"
                                        value={formData.phone} onChange={handleChange}
                                        className="w-full bg-white border border-gray-300 text-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Message</label>
                                    <textarea
                                        name="message"
                                        value={formData.message} onChange={handleChange}
                                        className="w-full bg-white border border-gray-300 text-gray-700 rounded-lg px-4 py-3 h-32 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all shadow-sm resize-none"
                                        required
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-blue-600 text-white font-bold py-4 rounded-lg shadow-lg hover:shadow-xl hover:bg-blue-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                    disabled={status === 'submitting'}
                                >
                                    {status === 'submitting' ? 'Sending...' : <><FaPaperPlane /> Send Message</>}
                                </button>

                                {status === 'error' && <p className="text-red-500 text-center">Failed to send message. Please try again.</p>}
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
