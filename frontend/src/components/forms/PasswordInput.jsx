import React, { useState, useEffect } from 'react';
import { FaEye, FaEyeSlash, FaCheck, FaTimes } from 'react-icons/fa';

const PasswordInput = ({ value, onChange, name = "password", placeholder = "Enter password", className = "", required = false, showStrengthConfig = false }) => {
    const [showPassword, setShowPassword] = useState(false);
    
    // Strength tracking
    const [strengthScore, setStrengthScore] = useState(0);
    const [measurements, setMeasurements] = useState({
        length: false,
        upperLower: false,
        number: false,
        symbol: false
    });

    useEffect(() => {
        if (!showStrengthConfig) return;

        const val = value || "";
        const m = {
            length: val.length >= 8,
            upperLower: /(?=.*[a-z])(?=.*[A-Z])/.test(val),
            number: /(?=.*[0-9])/.test(val),
            symbol: /(?=.*[!@#$%^&*])/.test(val)
        };
        setMeasurements(m);
        
        let score = 0;
        if (m.length) score += 25;
        if (m.upperLower) score += 25;
        if (m.number) score += 25;
        if (m.symbol) score += 25;
        setStrengthScore(score);

    }, [value, showStrengthConfig]);

    const getStrengthColor = () => {
        if (strengthScore <= 25) return 'bg-red-500';
        if (strengthScore <= 50) return 'bg-orange-500';
        if (strengthScore <= 75) return 'bg-yellow-500';
        return 'bg-green-500';
    };

    const getStrengthText = () => {
        if (strengthScore === 0) return '';
        if (strengthScore <= 25) return 'Weak';
        if (strengthScore <= 75) return 'Moderate';
        return 'Strong';
    };

    return (
        <div className="w-full">
            <div className={`relative flex items-center rounded-xl bg-gray-50 border border-gray-200 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all overflow-hidden ${className}`}>
                <input
                    type={showPassword ? "text" : "password"}
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    required={required}
                    className="w-full bg-transparent p-3 outline-none text-gray-900 placeholder-gray-400 font-bold"
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 text-gray-400 hover:text-gray-600 focus:outline-none transition-colors"
                >
                    {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                </button>
            </div>

            {/* Strength Indicator */}
            {showStrengthConfig && value.length > 0 && (
                <div className="mt-3 bg-white p-3 rounded-xl border border-gray-100 shadow-sm animate-fade-in">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Password Strength</span>
                        <span className={`text-xs font-bold ${getStrengthColor().replace('bg-', 'text-')}`}>
                            {getStrengthText()}
                        </span>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden mb-3">
                        <div 
                            className={`h-full ${getStrengthColor()} transition-all duration-300 ease-out`} 
                            style={{ width: `${Math.max(strengthScore, 5)}%` }}
                        ></div>
                    </div>

                    {/* Criteria List */}
                    <div className="grid grid-cols-2 gap-2 mt-2">
                        <div className={`flex items-center gap-1.5 text-xs font-medium ${measurements.length ? 'text-green-600' : 'text-gray-400'}`}>
                            {measurements.length ? <FaCheck size={10} /> : <span className="w-1 h-1 rounded-full bg-gray-300 ml-1"></span>}
                            <span>8+ characters</span>
                        </div>
                        <div className={`flex items-center gap-1.5 text-xs font-medium ${measurements.upperLower ? 'text-green-600' : 'text-gray-400'}`}>
                            {measurements.upperLower ? <FaCheck size={10} /> : <span className="w-1 h-1 rounded-full bg-gray-300 ml-1"></span>}
                            <span>Upper & lowercase</span>
                        </div>
                        <div className={`flex items-center gap-1.5 text-xs font-medium ${measurements.number ? 'text-green-600' : 'text-gray-400'}`}>
                            {measurements.number ? <FaCheck size={10} /> : <span className="w-1 h-1 rounded-full bg-gray-300 ml-1"></span>}
                            <span>At least 1 number</span>
                        </div>
                        <div className={`flex items-center gap-1.5 text-xs font-medium ${measurements.symbol ? 'text-green-600' : 'text-gray-400'}`}>
                            {measurements.symbol ? <FaCheck size={10} /> : <span className="w-1 h-1 rounded-full bg-gray-300 ml-1"></span>}
                            <span>Special character (!@#)</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PasswordInput;
