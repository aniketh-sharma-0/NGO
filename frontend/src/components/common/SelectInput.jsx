import React, { useState, useRef, useEffect } from 'react';
import { FaChevronDown } from 'react-icons/fa';

const SelectInput = ({ label, name, value, onChange, options, placeholder, required = false }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const selectedOption = options.find(opt => opt.value === value);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (val) => {
        onChange({ target: { name, value: val } });
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {label && <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">{label}</label>}

            <div
                className="w-full bg-white border border-gray-200 text-gray-800 text-lg py-3 px-4 rounded-xl flex justify-between items-center cursor-pointer shadow-sm hover:border-blue-300 transition-all"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className={!selectedOption ? "text-gray-400" : ""}>
                    {selectedOption ? selectedOption.label : (placeholder || "Select an option")}
                </span>
                <FaChevronDown className={`text-gray-400 text-sm transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </div>

            {/* Hidden Input for Form Submission compliance if needed, though we use controlled state */}
            <input type="hidden" name={name} value={value} required={required} />

            {isOpen && (
                <div className="absolute z-50 top-full left-0 w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden animate-fade-in-up">
                    <ul className="max-h-60 overflow-y-auto py-1">
                        {placeholder && (
                            <li
                                onClick={() => handleSelect("")}
                                className="px-5 py-3 text-gray-400 hover:bg-gray-50 cursor-pointer pointer-events-none"
                            >
                                {placeholder}
                            </li>
                        )}
                        {options.map((opt) => (
                            <li
                                key={opt.value}
                                onClick={() => handleSelect(opt.value)}
                                className={`px-5 py-3 cursor-pointer transition-colors font-medium flex items-center justify-between
                                    ${value === opt.value ? 'bg-gray-100 text-gray-900' : 'text-gray-700 hover:bg-gray-900 hover:text-white'}
                                `}
                            >
                                {opt.label}
                                {value === opt.value && <span className="w-2 h-2 rounded-full bg-gray-900"></span>}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default SelectInput;
