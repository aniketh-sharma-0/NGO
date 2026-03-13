import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { FaTimes } from 'react-icons/fa';
import CMSIconButton from './CMSIconButton';

const Modal = ({ 
    isOpen, 
    onClose, 
    title, 
    children, 
    maxWidth = 'max-w-md',
    showCloseButton = true
}) => {
    // Handle Escape key to close modal
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            // Prevent scrolling on body when modal is open
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return createPortal(
        <div 
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 animate-fade-in"
            role="dialog"
            aria-modal="true"
        >
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className={`bg-white rounded-2xl shadow-2xl w-full ${maxWidth} relative z-10 animate-scale-in overflow-hidden flex flex-col max-h-[90vh]`}>
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-20">
                    <h3 className="text-xl font-bold text-gray-900 font-heading">
                        {title}
                    </h3>
                    {showCloseButton && (
                        <CMSIconButton 
                            icon={FaTimes}
                            onClick={onClose}
                            title="Close"
                            variant="ghost"
                            className="text-gray-400 hover:text-red-500 bg-transparent shadow-none border-none !min-w-[40px] !min-h-[40px]"
                        />
                    )}
                </div>

                {/* Body */}
                <div className="p-6 overflow-y-auto custom-scrollbar">
                    {children}
                </div>
            </div>
        </div>,
        document.body
    );
};

export default Modal;
