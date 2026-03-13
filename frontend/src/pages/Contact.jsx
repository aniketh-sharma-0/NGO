import React, { useState } from 'react';
import api from '../utils/api';
import { FaWhatsapp, FaPhoneVolume, FaEnvelopeOpenText, FaComments, FaPaperPlane } from 'react-icons/fa';
import PhoneInputWithCountry from '../components/forms/PhoneInputWithCountry';

import EditableText from '../components/cms/EditableText';
import SelectInput from '../components/common/SelectInput';
import SEO from '../components/common/SEO';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: '',
        inquiryType: 'General',
        organization: ''
    });
    const [status, setStatus] = useState('');
    const [fieldErrors, setFieldErrors] = useState({});

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('submitting');
        setFieldErrors({});
        try {
            await api.post('/contact', formData);
            setStatus('success');
            setFormData({ name: '', email: '', phone: '', message: '', inquiryType: 'General', organization: '' });
        } catch (error) {
            console.error(error);
            if (error.response?.data?.errors) {
                const formattedErrors = {};
                error.response.data.errors.forEach(err => {
                    formattedErrors[err.path || err.param] = err.msg;
                });
                setFieldErrors(formattedErrors);
            }
            setStatus('error');
        }
    };

    const contactChannels = [
        {
            icon: <FaWhatsapp className="text-4xl text-white" />,
            title: 'WhatsApp',
            action: 'Chat with us',
            link: 'https://wa.me/919538026060',
            bg: 'bg-green-500',
            hover: 'hover:bg-green-600',
            text: 'text-green-600'
        },
        {
            icon: <FaPhoneVolume className="text-3xl text-white" />,
            title: 'Call Us',
            action: '9538026060',
            link: 'tel:+919538026060',
            bg: 'bg-blue-900',
            hover: 'hover:bg-opacity-90',
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
            link: 'sms:+919538026060',
            bg: 'bg-yellow-500',
            hover: 'hover:bg-yellow-600',
            text: 'text-yellow-600'
        }
    ];

    return (
        <div className="min-h-screen">
            <SEO
                title="Contact Us"
                description="Get in touch with YRDS for inquiries, partnerships, or support. We are here to help."
                url="/contact"
            />
            {/* Header */}
            <div className="bg-gray-900 text-white py-16 md:py-24 text-center px-4 font-heading">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
                    <EditableText contentKey="contact_title" section="Contact" defaultText="Get in Touch" />
                </h1>
                <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto font-sans font-light leading-relaxed px-4">
                    <EditableText contentKey="contact_subtitle" section="Contact" defaultText="Have questions? We'd love to hear from you." />
                </p>
            </div>

            <div className="container mx-auto px-4 -mt-16 relative z-10 pb-20 font-sans">

                {/* Contact Channels Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                    {contactChannels.map((channel, idx) => (
                        <a
                            key={idx}
                            href={channel.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group bg-white p-6 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 flex flex-col items-center text-center border border-gray-50"
                        >
                            <div className={`w-16 h-16 ${channel.bg} rounded-full flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300 text-white`}>
                                {channel.icon}
                            </div>
                            <h3 className="font-bold text-gray-800 text-lg mb-1 font-heading">{channel.title}</h3>
                            <p className="text-gray-500 font-medium group-hover:text-primary transition-colors">{channel.action}</p>
                        </a>
                    ))}
                </div>

                {/* Main Content Layout */}
                <div className="grid md:grid-cols-2 gap-12 items-start max-w-6xl mx-auto">

                    {/* Map / Image Section */}
                    <div className="rounded-3xl h-[600px] w-full overflow-hidden shadow-2xl relative group">
                        {/* Placeholder for Map */}
                        <img
                            src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=2068&auto=format&fit=crop"
                            alt="Our Team"
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent flex items-end p-6 md:p-10">
                            <div className="text-white text-left">
                                <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2 md:mb-4 font-heading leading-tight">Let's Make a Difference</h3>
                                <p className="text-base md:text-lg opacity-90 font-light text-gray-200 leading-relaxed">Reach out to us and start your journey of impact today.</p>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form - Removed Card Wrapper */}
                    <div className="pl-0 md:pl-8">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 md:mb-8 font-heading leading-tight">Send a Message</h2>
                        <p className="text-gray-600 mb-8 text-base md:text-lg leading-relaxed">We are here to help and answer any question you might have. We look forward to hearing from you.</p>

                        {status === 'success' ? (
                            <div className="text-center py-20 bg-green-50 rounded-3xl border border-green-100">
                                <FaPaperPlane className="text-primary text-6xl mx-auto mb-4 animate-bounce" />
                                <h3 className="text-2xl font-bold text-gray-800 mb-2">Message Sent!</h3>
                                <p className="text-gray-600">We will get back to you as soon as possible.</p>
                                <button onClick={() => setStatus('')} className="mt-6 text-primary underline">Send another</button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <SelectInput
                                        label="Inquiry Type"
                                        name="inquiryType"
                                        value={formData.inquiryType || 'General'}
                                        onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                                        options={[
                                            { value: 'General', label: 'General Inquiry' },
                                            { value: 'Government', label: 'Government Project' },
                                            { value: 'Corporate', label: 'Corporate / CSR' }
                                        ]}
                                    />
                                </div>

                                {(formData.inquiryType === 'Government' || formData.inquiryType === 'Corporate') && (
                                    <div className="col-span-2">
                                        <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Organization Name</label>
                                        <input
                                            name="organization"
                                            value={formData.organization || ''}
                                            onChange={handleChange}
                                            className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-lg py-3 px-4 rounded-xl focus:outline-none focus:bg-white focus:border-blue-900 focus:ring-4 focus:ring-blue-100 transition-all"
                                            placeholder="Enter organization name"
                                            required
                                        />
                                    </div>
                                )}

                                <div className="grid grid-cols-2 gap-8">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Name</label>
                                        <input
                                            name="name"
                                            value={formData.name} onChange={handleChange}
                                            className={`w-full bg-gray-50 border ${fieldErrors.name ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-200'} text-gray-800 text-lg py-3 px-4 rounded-xl focus:outline-none focus:bg-white focus:border-blue-900 focus:ring-4 focus:ring-blue-100 transition-all`}
                                            placeholder="Your Name"
                                            required
                                        />
                                        {fieldErrors.name && <p className="text-red-500 text-xs font-bold mt-1 pl-1">{fieldErrors.name}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Email</label>
                                        <input
                                            type="email" name="email"
                                            value={formData.email} onChange={handleChange}
                                            className={`w-full bg-gray-50 border ${fieldErrors.email ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-200'} text-gray-800 text-lg py-3 px-4 rounded-xl focus:outline-none focus:bg-white focus:border-blue-900 focus:ring-4 focus:ring-blue-100 transition-all`}
                                            placeholder="email@example.com"
                                            required
                                        />
                                        {fieldErrors.email && <p className="text-red-500 text-xs font-bold mt-1 pl-1">{fieldErrors.email}</p>}
                                    </div>
                                </div>

                                <div className={fieldErrors.phone ? 'ring-2 ring-red-500 rounded-xl' : ''}>
                                    <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Phone</label>
                                    <PhoneInputWithCountry
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                    {fieldErrors.phone && <p className="text-red-500 text-xs font-bold mt-1 pl-1">{fieldErrors.phone}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Message</label>
                                    <textarea
                                        name="message"
                                        value={formData.message} onChange={handleChange}
                                        className={`w-full bg-gray-50 border ${fieldErrors.message ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-200'} text-gray-800 text-lg p-4 rounded-xl h-40 focus:outline-none focus:bg-white focus:border-blue-900 focus:ring-4 focus:ring-blue-100 transition-all resize-none`}
                                        placeholder="How can we help you?"
                                        required
                                    ></textarea>
                                    {fieldErrors.message && <p className="text-red-500 text-xs font-bold mt-1 pl-1">{fieldErrors.message}</p>}
                                </div>

                                <button
                                    type="submit"
                                    className="px-10 py-4 bg-gray-900 text-white font-bold rounded-full hover:bg-black transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center gap-3 disabled:opacity-50"
                                    disabled={status === 'submitting'}
                                >
                                    {status === 'submitting' ? 'Sending...' : <><FaPaperPlane /> Send Message</>}
                                </button>

                                {status === 'error' && <p className="text-red-500 text-left mt-2">Failed to send message. Please try again.</p>}
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
