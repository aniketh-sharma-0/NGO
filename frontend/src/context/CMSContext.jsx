import React, { createContext, useContext, useState } from 'react';

const CMSContext = createContext();

export const useCMS = () => {
    return useContext(CMSContext);
};

export const CMSProvider = ({ children }) => {
    const [isEditMode, setIsEditMode] = useState(false);

    const toggleEditMode = () => {
        setIsEditMode(prev => !prev);
    };

    return (
        <CMSContext.Provider value={{ isEditMode, toggleEditMode }}>
            {children}
        </CMSContext.Provider>
    );
};
