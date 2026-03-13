import React, { useState } from 'react';
import { FaEnvelope, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

const EmailValidationInput = ({ value, onChange, name = "email", placeholder = "Email Address", className = "", required = true, autoComplete = "email" }) => {
    const [hasBlurred, setHasBlurred] = useState(false);
    const isValid = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const showFeedback = hasBlurred && value.length > 0;
    const isEmailValid = isValid(value);

    const handleBlur = () => {
        if (value.length > 0) {
            setHasBlurred(true);
        }
    };

    return (
        <div className="w-full">
            <div className={`relative flex items-center rounded-xl bg-gray-50 border transition-all overflow-hidden
                ${showFeedback 
                    ? (isEmailValid ? 'border-green-500 ring-1 ring-green-500' : 'border-red-500 ring-1 ring-red-500') 
                    : 'border-gray-200 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent'} 
                ${className}`}
            >
                <FaEnvelope className={`absolute left-3 transition-colors ${showFeedback ? (isEmailValid ? 'text-green-500' : 'text-red-500') : 'text-gray-400'}`} />
                <input
                    type="email"
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    required={required}
                    onBlur={handleBlur}
                    className="w-full bg-transparent pl-10 pr-10 py-3 outline-none text-gray-900 placeholder-gray-400 font-medium"
                    autoComplete={autoComplete}
                />
                {showFeedback && (
                    <div className="absolute right-3">
                        {isEmailValid ? (
                            <FaCheckCircle className="text-green-500 animate-fade-in" size={20} />
                        ) : (
                            <FaExclamationCircle className="text-red-500 animate-fade-in" size={20} />
                        )}
                    </div>
                )}
            </div>
            {showFeedback && !isEmailValid && (
                <p className="text-red-500 text-[10px] font-bold mt-1.5 pl-1 tracking-wide uppercase">
                    Please enter a valid email address
                </p>
            )}
        </div>
    );
};

export default EmailValidationInput;
