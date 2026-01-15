import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

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
        skills: '', // Comma separated
        availability: 'Weekends' // Default
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            const skillsArray = formData.skills.split(',').map(s => s.trim());

            await axios.post('/api/volunteers/register', {
                ...formData,
                skills: skillsArray
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            navigate('/volunteer/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white min-h-screen">
            {/* Hero Section */}
            <section className="relative h-[400px] flex items-center justify-center text-white">
                <div className="absolute inset-0 overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?q=80&w=2070&auto=format&fit=crop" alt="Volunteer" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/60"></div>
                </div>
                <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Become a Volunteer</h1>
                    <p className="text-xl md:text-2xl text-gray-200">Join our community of changemakers. Your time and skills can transform lives.</p>
                </div>
            </section>

            <div className="container mx-auto px-4 py-16 grid md:grid-cols-2 gap-12">
                {/* Info Side */}
                <div className="space-y-8">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">Why Volunteer With Us?</h2>
                        <div className="grid gap-6">
                            <div className="flex gap-4">
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xl">1</div>
                                <div>
                                    <h3 className="font-bold text-lg">Make a Real Impact</h3>
                                    <p className="text-gray-600">Directly contribute to projects that improve education, healthcare, and livelihoods.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold text-xl">2</div>
                                <div>
                                    <h3 className="font-bold text-lg">Gain Experience</h3>
                                    <p className="text-gray-600">Develop leadership, organizational, and social skills while working with diverse teams.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold text-xl">3</div>
                                <div>
                                    <h3 className="font-bold text-lg">Be Part of a Community</h3>
                                    <p className="text-gray-600">Connect with like-minded individuals who share your passion for social good.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                        <h3 className="font-bold text-lg mb-2">Volunteer Areas</h3>
                        <div className="flex flex-wrap gap-2">
                            {['Teaching', 'Medical Camps', 'Event Management', 'Fundraising', 'Social Media', 'Content Writing'].map(tag => (
                                <span key={tag} className="px-3 py-1 bg-white border border-gray-200 rounded-full text-sm text-gray-700">{tag}</span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Form Side */}
                <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                    <div className="text-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">Volunteer Registration</h2>
                        <p className="text-gray-500">Fill in the details to get started.</p>
                    </div>

                    {error && <div className="bg-red-50 text-red-500 p-3 rounded text-sm text-center mb-4">{error}</div>}

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                            <input
                                type="tel" required
                                className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                placeholder="+91 9876543210"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Why do you want to join us?</label>
                            <textarea
                                required
                                rows={3}
                                className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                placeholder="Tell us about your motivation..."
                                value={formData.motivation || ''}
                                onChange={(e) => setFormData({ ...formData, motivation: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Skills / Experience</label>
                            <input
                                type="text"
                                className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                placeholder="e.g. Teaching, Design, Medical..."
                                value={formData.skills}
                                onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Availability</label>
                            <select
                                className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                value={formData.availability}
                                onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                            >
                                <option value="Weekends">Weekends</option>
                                <option value="Weekdays">Weekdays</option>
                                <option value="Anytime">Anytime</option>
                            </select>
                        </div>

                        {/* Hidden Address field if strictly required by backend validation, or add back if needed. 
                            User said "form should only have name email and phone no" (for contact), 
                            but for volunteer "questionaire kindof". 
                            I'll keep address hidden or dummy if backend validation requires it, or just remove if I update backend call. 
                            Let's keep it simple. If backend requires, I'll add it back or dummy it. 
                            Assuming I can relax it. But for now I will add it back as "City/Location" to correspond to "address" state 
                            but label it simpler.
                         */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Current City</label>
                            <input
                                type="text" required
                                className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                placeholder="City"
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-md text-white bg-primary hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 shadow-lg tracking-wide uppercase"
                        >
                            {loading ? 'Submitting...' : 'Enroll as Volunteer'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default VolunteerRegister;
