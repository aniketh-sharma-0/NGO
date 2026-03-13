import React, { useState, useEffect } from 'react';
import { FaCheck, FaTimes } from 'react-icons/fa';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { useCMS } from '../../context/CMSContext';

const EditableText = ({ contentKey, section, defaultText, className, type = 'text', onSave, editable = true }) => {
    const { user } = useAuth();
    const { isEditMode } = useCMS();
    const [isEditing, setIsEditing] = useState(false);
    const [value, setValue] = useState(defaultText || '');
    const [originalValue, setOriginalValue] = useState(defaultText || '');

    // Check if user is admin
    const isAdmin = user?.role?.name === 'Admin';

    useEffect(() => {
        setValue(defaultText || '');
        setOriginalValue(defaultText || '');
    }, [defaultText]);

    const handleSave = async () => {
        try {
            if (onSave) {
                onSave(value);
            } else {
                await api.put('/admin/content', {
                    key: contentKey,
                    value: value,
                    section: section
                });
            }
            setIsEditing(false);
            setOriginalValue(value);
        } catch (error) {
            console.error('Failed to save content', error);
            alert('Failed to save changes');
        }
    };

    const handleCancel = () => {
        setValue(originalValue);
        setIsEditing(false);
    };

    if (isEditing) {
        return (
            <span className="flex gap-2 items-center text-base font-normal z-50">
                {type === 'textarea' ? (
                    <textarea
                        className="border border-gray-300 p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm text-sm text-gray-800"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        autoComplete="off"
                        rows={3}
                    />
                ) : (
                    <input
                        type="text"
                        className="border border-gray-300 p-1.5 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm text-sm text-gray-800"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        autoComplete="off"
                    />
                )}
                <button 
                    onClick={handleSave} 
                    className="flex-shrink-0 w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center hover:bg-green-600 transition-colors shadow-sm"
                    title="Save"
                >
                    <FaCheck size={12} />
                </button>
            </span>
        );
    }

    return (
        <span 
            className={`relative group inline-block ${isAdmin && isEditMode && editable ? 'cursor-pointer hover:ring-2 hover:ring-blue-100 hover:ring-offset-2 rounded px-1 transition-all' : ''} ${className}`}
            onClick={() => { if (isAdmin && isEditMode && editable) setIsEditing(true); }}
            title={isAdmin && isEditMode && editable ? "Click to edit" : ""}
        >
            {type === 'textarea' ? <span className="inline whitespace-pre-wrap">{value}</span> : <span>{value}</span>}
        </span>
    );
};

export default EditableText;
