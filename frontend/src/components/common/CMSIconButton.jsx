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
    const baseStyles = "min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full shadow-lg transition-all duration-200 transform hover:scale-105 active:scale-95 focus-visible:ring-2 focus-visible:ring-offset-2 outline-none z-20 backdrop-blur-sm";
    
    // Variant maps
    const variants = {
        default: "bg-white/90 text-gray-800 hover:bg-white hover:text-primary border border-gray-100 focus-visible:ring-primary",
        primary: "bg-primary/90 text-white hover:bg-primary border border-primary/20 focus-visible:ring-primary",
        danger: "bg-red-500/90 text-white hover:bg-red-600 border border-red-400/20 focus-visible:ring-red-500",
        "danger-light": "bg-white text-red-600 hover:bg-red-50 border border-red-100 shadow-sm focus-visible:ring-red-500",
        "danger-outline": "bg-transparent text-red-600 hover:bg-red-50 border border-red-200 focus-visible:ring-red-500",
        success: "bg-green-500/90 text-white hover:bg-green-600 border border-green-400/20 focus-visible:ring-green-500",
        ghost: "bg-white/20 text-white hover:bg-white/40 border border-white/30 focus-visible:ring-white"
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
