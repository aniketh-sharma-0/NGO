import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import SEO from '../components/common/SEO';
import EmailValidationInput from '../components/forms/EmailValidationInput';
import PasswordInput from '../components/forms/PasswordInput';

const ForgotPassword = () => {
    const [formData, setFormData] = useState({ email: '', password: '', confirmPassword: '' });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);

        try {
            const res = await api.post('/auth/direct-reset', { 
                email: formData.email, 
                password: formData.password 
            });
            setMessage('Password updated successfully! Redirecting to login...');
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong. Make sure the email is correct.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
            <SEO title="Reset Password" description="Update your password directly" url="/forgot-password" />
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-black text-gray-900 font-heading">Reset Password</h1>
                    <p className="text-gray-500 mt-2 text-sm leading-relaxed px-4">Enter your email and your new password to update your account.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <EmailValidationInput 
                        value={formData.email}
                        onChange={handleChange}
                        name="email"
                    />

                    <PasswordInput 
                        placeholder="New Password"
                        value={formData.password}
                        onChange={handleChange}
                        name="password"
                        showStrengthConfig={true}
                    />

                    <PasswordInput 
                        placeholder="Confirm Password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        name="confirmPassword"
                        showStrengthConfig={false}
                    />

                    {message && <div className="text-green-600 text-sm font-bold bg-green-50 p-4 rounded-xl text-center border border-green-100 animate-in fade-in slide-in-from-top-2">{message}</div>}
                    {error && <div className="text-red-500 text-sm font-bold bg-red-50 p-4 rounded-xl text-center border border-red-100 animate-in fade-in slide-in-from-top-2">{error}</div>}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white font-black py-4 rounded-xl hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl active:scale-[0.98] disabled:opacity-50 text-sm tracking-wide uppercase"
                    >
                        {loading ? 'Updating...' : 'Update Password'}
                    </button>
                </form>

                <div className="mt-8 text-center border-t border-gray-100 pt-6">
                    <Link to="/login" className="text-gray-500 text-sm font-bold hover:text-primary transition-colors">
                        Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
