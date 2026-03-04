import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import SEO from '../components/common/SEO';

const Login = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
    const [showPassword, setShowPassword] = useState(false);
    const { login, register, googleAuth } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleGoogleLogin = async (credentialResponse) => {
        setLoading(true);
        setError('');
        try {
            const result = await googleAuth(credentialResponse.credential);
            if (result.success) {
                if (result.user?.role?.name === 'Volunteer') {
                    navigate('/volunteer/dashboard');
                } else {
                    navigate('/');
                }
            } else {
                setError(result.message || 'Google authentication failed');
            }
        } catch (err) {
            setError('An unexpected error occurred during Google sign-in');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (!isLogin && formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        try {
            let result;
            if (isLogin) {
                result = await login(formData.email, formData.password);
            } else {
                result = await register(formData.name, formData.email, formData.password);
            }

            if (result.success) {
                if (result.user?.role?.name === 'Volunteer') {
                    navigate('/volunteer/dashboard');
                } else {
                    navigate('/'); // Or admin dashboard
                }
            } else {
                setError(result.message || 'Authentication failed');
            }
        } catch (err) {
            setError('An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <SEO
                title={isLogin ? "Login" : "Sign Up"}
                description="Login or Sign Up to Yaswanth Rural Development Society."
                url="/login"
            />
            <div className="bg-white rounded-2xl shadow-2xl flex flex-col md:flex-row w-full max-w-4xl overflow-hidden h-[650px]">

                {/* Visual Side */}
                <div className="w-full md:w-1/2 bg-black relative hidden md:block">
                    <img
                        src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=2068&auto=format&fit=crop"
                        alt="Community"
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent flex items-end p-10">
                        <div className="text-white relative z-10">
                            <h2 className="text-4xl font-bold mb-4">Join Our Mission</h2>
                            <p className="text-gray-200 text-lg">Connect with us to make a lasting difference in the world.</p>
                        </div>
                    </div>
                </div>

                {/* Form Side */}
                <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center relative bg-white overflow-y-auto">
                    <div className="mb-6 text-center">
                        <h1 className="text-3xl font-bold text-gray-800">{isLogin ? 'Welcome Back' : 'Create Account'}</h1>
                        <p className="text-gray-500 mt-2">{isLogin ? 'Please enter your details to sign in.' : 'Register to start your journey.'}</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4" autoComplete="on">
                        {!isLogin && (
                            <div className="relative">
                                <FaEnvelope className="absolute top-3.5 left-3 text-gray-400" />
                                <input
                                    name="name"
                                    type="text"
                                    placeholder="Full Name"
                                    value={formData.name} onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-gray-50"
                                    required
                                    autoComplete="name"
                                />
                            </div>
                        )}
                        <div className="relative">
                            <FaEnvelope className="absolute top-3.5 left-3 text-gray-400" />
                            <input
                                type="email" name="email"
                                placeholder="Email Address"
                                value={formData.email} onChange={handleChange}
                                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-gray-50"
                                required
                                autoComplete="username"
                            />
                        </div>

                        {/* Password Field */}
                        <div className="relative">
                            <FaLock className="absolute top-3.5 left-3 text-gray-400 z-10" />
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="Password"
                                value={formData.password} onChange={handleChange}
                                className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-gray-50"
                                required
                                autoComplete={isLogin ? "current-password" : "new-password"}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute top-3.5 right-4 text-gray-400 hover:text-gray-600 focus:outline-none z-10"
                            >
                                {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                            </button>
                        </div>

                        {/* Confirm Password Field - Only for Register */}
                        {!isLogin && (
                            <div className="relative">
                                <FaLock className="absolute top-3.5 left-3 text-gray-400" />
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    placeholder="Confirm Password"
                                    value={formData.confirmPassword} onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-gray-50"
                                    required
                                    autoComplete="new-password"
                                />
                            </div>
                        )}

                        {error && <p className="text-red-500 text-sm text-center font-medium bg-red-50 p-2 rounded">{error}</p>}

                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-800 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 mt-2"
                            disabled={loading}
                        >
                            {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Sign Up')}
                        </button>
                    </form>

                    <div className="my-6 flex items-center gap-4">
                        <div className="h-px bg-gray-200 flex-1"></div>
                        <span className="text-gray-400 text-sm">OR</span>
                        <div className="h-px bg-gray-200 flex-1"></div>
                    </div>

                    <div className="w-full flex justify-center">
                        <GoogleLogin
                            onSuccess={handleGoogleLogin}
                            onError={() => setError('Google Login Failed')}
                            useOneTap
                            theme="outline"
                            size="large"
                            width="250"
                        />
                    </div>

                    <div className="mt-6 text-center text-sm pb-4">
                        <span className="text-gray-600">{isLogin ? "Don't have an account?" : "Already have an account?"}</span>
                        <button
                            onClick={() => {
                                setIsLogin(!isLogin);
                                setError('');
                                setFormData({ name: '', email: '', password: '', confirmPassword: '' });
                            }}
                            className="text-primary font-bold ml-1 hover:underline outline-none"
                        >
                            {isLogin ? 'Sign Up' : 'Log in'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
