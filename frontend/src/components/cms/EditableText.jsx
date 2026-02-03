import React, { useState, useEffect } from 'react';
import { FaCheck, FaTimes } from 'react-icons/fa';
import axios from 'axios';
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
                const token = localStorage.getItem('token');
                await axios.put('/api/admin/content', {
                    key: contentKey,
                    value: value,
                    section: section
                }, {
                    headers: { Authorization: `Bearer ${token}` }
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
            <div className="flex gap-2 items-center text-base font-normal z-50">
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
                <button onClick={handleSave} className="flex items-center gap-1 bg-green-600 text-white px-3 py-1.5 rounded-md text-sm font-medium hover:bg-green-700 transition-colors shadow-sm whitespace-nowrap">
                    <FaCheck size={12} /> Save
                </button>
                <button onClick={handleCancel} className="flex items-center gap-1 bg-gray-500 text-white px-3 py-1.5 rounded-md text-sm font-medium hover:bg-gray-600 transition-colors shadow-sm whitespace-nowrap">
                    <FaTimes size={12} /> Cancel
                </button>
            </div>
        );
    }

    return (
        <div className={`relative group ${className}`}>
            {type === 'textarea' ? <p className="whitespace-pre-wrap">{value}</p> : <span>{value}</span>}
            {isAdmin && isEditMode && editable && (
                <button
                    onClick={() => setIsEditing(true)}
                    className="absolute -top-4 -right-4 bg-gray-200 text-gray-600 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                >
                    Edit
                </button>
            )}
        </div>
    );
};

export default EditableText;
