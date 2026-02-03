import React from 'react';

const SectionTitle = ({ subtitle, children, center = true }) => {
    return (
        <div className={`mb-16 ${center ? 'text-center' : ''}`}>
            {subtitle && (
                <div className="text-green-600 font-bold tracking-widest uppercase text-sm mb-2">
                    {subtitle}
                </div>
            )}
            <h2 className="text-4xl md:text-5xl font-black text-black font-heading mb-4">
                {children}
            </h2>
            <div className={`h-1.5 w-24 bg-green-600 rounded-full ${center ? 'mx-auto' : ''}`}></div>
        </div>
    );
};

export default SectionTitle;
