import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCMS } from '../../context/CMSContext';
import { FaPlus, FaTimes, FaPen } from 'react-icons/fa';

const EditToggle = () => {
    const { user } = useAuth();
    const { isEditMode, toggleEditMode } = useCMS();

    const handleToggle = () => {
        if (!isEditMode) {
            if (window.confirm("Do you want to enter Editor Mode?")) {
                toggleEditMode();
            }
        } else {
            if (window.confirm("Do you want to Exit Editor Mode? Make sure you have saved your changes.")) {
                toggleEditMode();
            }
        }
    };

    if (user?.role?.name !== 'Admin') return null;

    return (
        <button
            onClick={handleToggle}
            className={`fixed bottom-6 right-28 z-50 p-4 rounded-full shadow-lg transition-all hover:scale-110 flex items-center justify-center ${isEditMode ? 'bg-red-600 text-white' : 'bg-blue-600 text-white'
                }`}
            title={isEditMode ? 'Exit Edit Mode' : 'Enter Edit Mode'}
        >
            {isEditMode ? <FaTimes size={24} /> : <FaPlus size={24} />}
        </button>
    );
};

export default EditToggle;
