import React, { useState, useEffect } from 'react';
import { FaEye, FaEyeSlash, FaCheck, FaTimes, FaLock } from 'react-icons/fa';

const PasswordInput = ({ value, onChange, name = "password", placeholder = "Enter password", className = "", required = false, showStrengthConfig = false }) => {
    const [showPassword, setShowPassword] = useState(false);
    
    const getStrength = (val) => {
        if (!val) return { label: '', color: '' };
        if (val.length < 6) return { label: 'Password is too short', color: 'text-red-500' };
        
        // Simpler strength logic based on length and a few variety checks
        let score = 0;
        if (val.length >= 8) score++;
        if (val.length >= 12) score++;
        if (/[A-Z]/.test(val)) score++;
        if (/[0-9]/.test(val)) score++;
        if (/[!@#$%^&*]/.test(val)) score++;

        if (score <= 1) return { label: 'Weak', color: 'text-red-500' };
        if (score <= 3) return { label: 'Medium', color: 'text-yellow-500' };
        return { label: 'Strong', color: 'text-green-500' };
    };

    const strength = getStrength(value);

    return (
        <div className="w-full">
            <div className={`relative flex items-center rounded-xl bg-gray-50 border border-gray-200 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all overflow-hidden ${className}`}>
                <FaLock className="absolute left-3 text-gray-400" />
                <input
                    type={showPassword ? "text" : "password"}
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    required={required}
                    className="w-full bg-transparent pl-10 pr-10 py-3 outline-none text-gray-900 placeholder-gray-400 font-medium"
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 text-gray-400 hover:text-gray-600 focus:outline-none transition-colors"
                >
                    {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                </button>
            </div>

            {/* Strength Indicator Label Only */}
            {showStrengthConfig && value.length > 0 && (
                <div className="mt-2 px-1">
                    <span className={`text-xs font-bold uppercase tracking-wider ${strength.color}`}>
                        {strength.label}
                    </span>
                </div>
            )}
        </div>
    );
};

export default PasswordInput;
