import React, { createContext, useContext, useState } from 'react';

const UIContext = createContext();

export const UIProvider = ({ children }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <UIContext.Provider value={{ isMobileMenuOpen, setIsMobileMenuOpen }}>
            {children}
        </UIContext.Provider>
    );
};

export const useUI = () => useContext(UIContext);
