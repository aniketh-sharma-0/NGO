import React, { useEffect, useState } from 'react';
import { FaInfoCircle, FaCheckCircle, FaExclamationCircle, FaTimesCircle, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Toast = ({ title, message, type, onClose, redirect }) => {
    const navigate = useNavigate();
    const [progress, setProgress] = useState(100);
    const duration = 5000;

    useEffect(() => {
        const timer = setTimeout(onClose, duration);
        const interval = setInterval(() => {
            setProgress((prev) => Math.max(0, prev - (100 / (duration / 100))));
        }, 100);

        return () => {
            clearTimeout(timer);
            clearInterval(interval);
        };
    }, [onClose]);

    const getIcon = () => {
        switch (type) {
            case 'success': return <FaCheckCircle className="text-green-500" />;
            case 'error': return <FaTimesCircle className="text-red-500" />;
            case 'warning': return <FaExclamationCircle className="text-yellow-500" />;
            default: return <FaInfoCircle className="text-blue-500" />;
        }
    };

    const handleAction = () => {
        if (redirect) navigate(redirect);
        onClose();
    };

    return (
        <div 
            className="pointer-events-auto bg-white border border-gray-100 shadow-2xl rounded-2xl p-4 flex flex-col gap-3 animate-slide-in-right overflow-hidden relative group"
            style={{ minWidth: '320px' }}
        >
            <div className="flex gap-4 items-start">
                <div className="text-xl mt-0.5">{getIcon()}</div>
                <div className="flex-1">
                    <h4 className="text-sm font-bold text-gray-900 mb-0.5">{title}</h4>
                    <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{message}</p>
                    {redirect && (
                        <button 
                            onClick={handleAction}
                            className="text-xs font-bold text-blue-600 mt-2 hover:text-blue-800 transition-colors uppercase tracking-widest flex items-center gap-1"
                        >
                            View Details
                        </button>
                    )}
                </div>
                <button 
                    onClick={onClose}
                    className="p-1 hover:bg-gray-50 rounded-lg text-gray-400 hover:text-gray-600 transition-all"
                >
                    <FaTimes size={14} />
                </button>
            </div>
            
            {/* Progress bar */}
            <div className="absolute bottom-0 left-0 h-1 bg-gray-50 w-full">
                <div 
                    className="h-full bg-blue-500/30 transition-all duration-100 ease-linear"
                    style={{ width: `${progress}%` }}
                />
            </div>
        </div>
    );
};

export default Toast;
