import React from 'react';

/**
 * A standardized, reusable icon button for CMS actions.
 * Ensures consistent styling, mobile responsiveness, and accessibility.
 */
const CMSIconButton = ({ 
    icon: Icon, 
    onClick, 
    title, 
    className = "", 
    variant = "default",
    size = 14,
    type = "button"
}) => {
    // Base styles: circular, centered content, shadow, transitions
    const baseStyles = "min-w-[40px] min-h-[40px] flex items-center justify-center rounded-full shadow-md transition-all duration-200 transform hover:scale-105 active:scale-95 focus-visible:ring-2 focus-visible:ring-offset-2 outline-none z-20";
    
    // Variant maps
    const variants = {
        default: "bg-white text-gray-800 hover:text-black shadow-lg border border-gray-50 focus-visible:ring-gray-200",
        primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200 focus-visible:ring-blue-500",
        danger: "bg-red-500 text-white hover:bg-red-600 focus-visible:ring-red-500",
        "danger-light": "bg-white text-red-600 hover:bg-red-50 border border-red-100 shadow-sm focus-visible:ring-red-500",
        "danger-outline": "bg-transparent text-red-600 hover:bg-red-50 border border-red-200 focus-visible:ring-red-500",
        success: "bg-green-500 text-white hover:bg-green-600 focus-visible:ring-green-500",
        ghost: "bg-white/20 text-white hover:bg-white/40 border border-white/30 focus-visible:ring-white",
        transparent: "bg-transparent shadow-none border-none hover:bg-gray-100 focus-visible:ring-gray-200"
    };

    const variantClass = variants[variant] || variants.default;

    return (
        <button
            type={type}
            onClick={onClick}
            className={`${baseStyles} ${variantClass} ${className}`}
            title={title}
            aria-label={title || "Action Button"}
        >
            <Icon size={size} />
        </button>
    );
};

export default CMSIconButton;
