import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import SelectInput from '../../components/common/SelectInput';
import PhoneInputWithCountry from '../../components/forms/PhoneInputWithCountry';


const VolunteerRegister = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    React.useEffect(() => {
        if (user && user.role?.name === 'Volunteer') {
            navigate('/volunteer/dashboard');
        }
    }, [user, navigate]);

    const [formData, setFormData] = useState({
        phone: '',
        address: '',
        availability: 'Weekends' // Default
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [fieldErrors, setFieldErrors] = useState({});
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setFieldErrors({});

        try {
            await api.post('/volunteers/register', formData);

            setSuccess(true);
        } catch (err) {
            if (err.response?.data?.errors) {
                const formattedErrors = {};
                err.response.data.errors.forEach(e => {
                    formattedErrors[e.path || e.param] = e.msg;
                });
                setFieldErrors(formattedErrors);
                setError('Please correct the highlighted errors.');
            } else {
                setError(err.response?.data?.message || 'Registration failed');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen font-sans bg-gray-50">
            {/* Hero Section */}
            <section className="relative h-[400px] flex items-center justify-center text-white">
                <div className="absolute inset-0 overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=2070&auto=format&fit=crop" alt="Volunteer" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gray-900/70"></div>
                </div>
                <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 font-heading">Become a Volunteer</h1>
                    <p className="text-xl md:text-2xl text-gray-200 font-light">Join our community of changemakers. Your time and skills can transform lives.</p>
                </div>
            </section>

            <div className="container mx-auto px-4 -mt-20 relative z-20 pb-20">
                <div className="grid md:grid-cols-2 gap-12 bg-white rounded-3xl shadow-2xl overflow-hidden">
                    {/* Info Side */}
                    <div className="p-12 md:p-16 bg-soft-blue flex flex-col justify-center">
                        <h2 className="text-3xl font-bold text-gray-800 mb-8 font-heading">Why Volunteer With Us?</h2>
                        <div className="grid gap-8">
                            <div className="flex gap-5">
                                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-blue-600 font-bold text-xl shadow-sm flex-shrink-0">1</div>
                                <div>
                                    <h3 className="font-bold text-xl text-gray-800 mb-1 font-heading">Make a Real Impact</h3>
                                    <p className="text-gray-600 leading-relaxed">Directly contribute to projects that improve education, healthcare, and livelihoods.</p>
                                </div>
                            </div>
                            <div className="flex gap-5">
                                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-green-600 font-bold text-xl shadow-sm flex-shrink-0">2</div>
                                <div>
                                    <h3 className="font-bold text-xl text-gray-800 mb-1 font-heading">Gain Experience</h3>
                                    <p className="text-gray-600 leading-relaxed">Develop leadership, organizational, and social skills while working with diverse teams.</p>
                                </div>
                            </div>
                            <div className="flex gap-5">
                                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-purple-600 font-bold text-xl shadow-sm flex-shrink-0">3</div>
                                <div>
                                    <h3 className="font-bold text-xl text-gray-800 mb-1 font-heading">Be Part of a Community</h3>
                                    <p className="text-gray-600 leading-relaxed">Connect with like-minded individuals who share your passion for social good.</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-12">
                            <h3 className="font-bold text-lg mb-4 text-gray-700 font-heading">We are looking for:</h3>
                            <div className="flex flex-wrap gap-2">
                                {['Teaching', 'Medical Camps', 'Event Management', 'Fundraising', 'Social Media', 'Content Writing'].map(tag => (
                                    <span key={tag} className="px-4 py-2 bg-white rounded-xl text-sm font-medium text-gray-700 shadow-sm border border-blue-50">{tag}</span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Form Side */}
                    <div className="p-12 md:p-16">
                        {success ? (
                            <div className="text-center py-10 h-full flex flex-col justify-center items-center">
                                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 shadow-sm">
                                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                </div>
                                <h2 className="text-3xl font-bold text-gray-900 font-heading mb-4">Application Submitted</h2>
                                <p className="text-gray-600 mb-8 max-w-sm mx-auto">Thank you for registering to volunteer with us. Your application is now <span className="font-bold text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded">under review</span> by our NGO team.</p>
                                <button
                                    onClick={() => navigate('/volunteer/dashboard')}
                                    className="px-8 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-black transition-colors shadow-lg"
                                >
                                    Go to Dashboard
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="text-center mb-10">
                            <h2 className="text-3xl font-bold text-gray-900 font-heading">Volunteer Registration</h2>
                            <p className="text-gray-500 mt-2">Fill in the details to get started.</p>
                        </div>

                        {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm text-center mb-6 border border-red-100 font-medium">{error}</div>}

                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div className={fieldErrors.phone ? 'ring-2 ring-red-500 rounded-xl' : ''}>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
                                <PhoneInputWithCountry
                                    required
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                />
                                {fieldErrors.phone && <p className="text-red-500 text-xs font-bold mt-1 pl-1">{fieldErrors.phone}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Why do you want to join us?</label>
                                <textarea
                                    required
                                    rows={3}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                                    placeholder="Tell us about your motivation..."
                                    value={formData.motivation || ''}
                                    onChange={(e) => setFormData({ ...formData, motivation: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <SelectInput
                                        label="Availability"
                                        name="availability"
                                        value={formData.availability}
                                        onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                                        options={[
                                            { label: 'Weekends', value: 'Weekends' },
                                            { label: 'Weekdays', value: 'Weekdays' },
                                            { label: 'Anytime', value: 'Anytime' }
                                        ]}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Current City</label>
                                    <input
                                        type="text" required
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
                                        placeholder="City"
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 px-6 mt-4 bg-gray-900 hover:bg-black text-white font-bold rounded-xl shadow-lg transform active:scale-95 transition-all text-lg"
                            >
                                {loading ? 'Submitting...' : 'Enroll as Volunteer'}
                            </button>
                        </form>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VolunteerRegister;
