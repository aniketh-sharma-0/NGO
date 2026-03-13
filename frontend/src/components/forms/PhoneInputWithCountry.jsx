import React, { useState, useEffect } from 'react';
import { FaChevronDown } from 'react-icons/fa';

const countryCodes = [
    { code: '+91', country: 'IND', name: 'India', pattern: '\\d{10}', placeholder: '9876543210', maxLength: 10 },
    { code: '+1', country: 'USA', name: 'United States', pattern: '\\d{10}', placeholder: '5551234567', maxLength: 10 },
    { code: '+44', country: 'GBR', name: 'United Kingdom', pattern: '\\d{10}', placeholder: '7123456789', maxLength: 10 },
    { code: '+61', country: 'AUS', name: 'Australia', pattern: '\\d{9}', placeholder: '412345678', maxLength: 9 },
    { code: '+971', country: 'ARE', name: 'UAE', pattern: '\\d{9}', placeholder: '501234567', maxLength: 9 },
    { code: '+00', country: 'OTH', name: 'Other', pattern: '\\d{5,15}', placeholder: '1234567890', maxLength: 15 }
];

const PhoneInputWithCountry = ({ value = '', onChange, className = '', required = false }) => {
    // Initialize parsed states safely
    const getSafeInitialData = (val) => {
        const safeVal = typeof val === 'string' ? val : '';
        const initialMatchedCountry = countryCodes.find(c => safeVal && safeVal.startsWith(c.code)) || countryCodes[0];
        const initialCode = initialMatchedCountry.code;
        const initialNumber = safeVal ? safeVal.replace(new RegExp(`^\\${initialCode}\\s?`), '') : '';
        return { initialCode, initialNumber };
    };

    const data = getSafeInitialData(value);
    const [selectedCode, setSelectedCode] = useState(data.initialCode);
    const [phoneNumber, setPhoneNumber] = useState(data.initialNumber);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    // Sync state if value prop changes from outside (e.g. form reset or parent update)
    useEffect(() => {
        const newData = getSafeInitialData(value);
        setSelectedCode(newData.initialCode);
        setPhoneNumber(newData.initialNumber);
    }, [value]);

    const activeCountry = countryCodes.find(c => c.code === selectedCode) || countryCodes[0];

    const handleSelect = (code) => {
        setSelectedCode(code);
        setDropdownOpen(false);
        const currentNum = phoneNumber || '';
        onChange({ target: { name: 'phone', value: `${code} ${currentNum}`.trim() } });
    };

    const handleNumberChange = (e) => {
        const val = (e.target.value || '').replace(/\D/g, ''); // Allow only numbers
        setPhoneNumber(val);
        onChange({ target: { name: 'phone', value: `${selectedCode} ${val}`.trim() } });
    };

    return (
        <div className={`flex relative rounded-xl border border-gray-200 bg-gray-50 focus-within:ring-2 focus-within:ring-gray-900 focus-within:border-transparent transition-all ${className}`}>
            <div className="flex-shrink-0 relative">
                <button
                    type="button"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="h-full px-3 py-3 border-r border-gray-200 flex items-center justify-center gap-1 hover:bg-gray-100 rounded-l-xl transition-colors font-bold text-gray-700 w-28 text-sm"
                >
                    {activeCountry.country} {activeCountry.code}
                    <FaChevronDown size={10} className="text-gray-400 mt-0.5 ml-1" />
                </button>
                {dropdownOpen && (
                    <div className="absolute top-12 left-0 w-64 bg-white shadow-xl rounded-xl border border-gray-100 overflow-hidden z-20">
                        {countryCodes.map(c => (
                            <button
                                key={c.country}
                                type="button"
                                onClick={() => handleSelect(c.code)}
                                className="w-full text-left px-4 py-2.5 text-sm hover:bg-blue-50 hover:text-blue-700 font-bold text-gray-700 transition-colors flex justify-between group items-center"
                            >
                                <span className="flex gap-2">
                                    <span className="text-gray-400 group-hover:text-blue-400">{c.country}</span>
                                    <span>{c.name}</span>
                                </span>
                                <span className="text-gray-500 group-hover:text-blue-600 bg-gray-50 group-hover:bg-blue-100 px-2 rounded-md">{c.code}</span>
                            </button>
                        ))}
                    </div>
                )}
            </div>
            <input
                type="tel"
                name="phone"
                value={phoneNumber}
                onChange={handleNumberChange}
                placeholder={activeCountry.placeholder}
                required={required}
                pattern={activeCountry.pattern}
                maxLength={activeCountry.maxLength}
                title={`Valid Format: ${activeCountry.maxLength} digits expected (${activeCountry.placeholder})`}
                className="flex-1 w-full bg-transparent p-3 outline-none text-gray-900 placeholder-gray-300 font-bold text-base"
            />
            {/* Backdrop for closing dropdown */}
            {dropdownOpen && (
                <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)}></div>
            )}
        </div>
    );
};

export default PhoneInputWithCountry;
