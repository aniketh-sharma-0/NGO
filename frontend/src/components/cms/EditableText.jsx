import React, { useState, useEffect } from 'react';
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
        if (!isEditing) {
            setValue(defaultText || '');
            setOriginalValue(defaultText || '');
        }
    }, [defaultText, isEditing]);

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
            <div className="flex gap-2 items-center">
                {type === 'textarea' ? (
                    <textarea
                        className="border p-1 rounded w-full"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        autoComplete="off"
                    />
                ) : (
                    <input
                        type="text"
                        className="border p-1 rounded w-full"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        autoComplete="off"
                    />
                )}
                <button onClick={handleSave} className="text-green-600 bg-green-100 px-2 rounded">Save</button>
                <button onClick={handleCancel} className="text-red-600 bg-red-100 px-2 rounded">Cancel</button>
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
