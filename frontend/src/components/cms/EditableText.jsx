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
            <span className={`relative inline-block w-full min-h-[40px] ${className}`}>
                {type === 'textarea' ? (
                    <textarea
                        className="w-full border-2 border-primary p-2 rounded-lg focus:outline-none bg-white shadow-xl text-gray-800 transition-all font-inherit"
                        style={{ 
                            fontSize: 'inherit', 
                            fontWeight: 'inherit', 
                            fontFamily: 'inherit',
                            lineHeight: 'inherit',
                            minHeight: '100px'
                        }}
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        autoComplete="off"
                        autoFocus
                    />
                ) : (
                    <input
                        type="text"
                        className="w-full border-2 border-primary p-2 rounded-lg focus:outline-none bg-white shadow-xl text-gray-800 transition-all font-inherit"
                        style={{ 
                            fontSize: 'inherit', 
                            fontWeight: 'inherit', 
                            fontFamily: 'inherit',
                            lineHeight: 'inherit'
                        }}
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        autoComplete="off"
                        autoFocus
                    />
                )}
                <div className="absolute -top-12 right-0 flex gap-2 z-[60] bg-white p-1 rounded-full shadow-lg border border-gray-100 animate-in fade-in slide-in-from-bottom-2 duration-200">
                    <button 
                        onClick={handleSave} 
                        className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center hover:bg-green-600 transition-all transform hover:scale-110 active:scale-95 shadow-md"
                        title="Save"
                    >
                        <FaCheck size={12} />
                    </button>
                    <button 
                        onClick={handleCancel} 
                        className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-all transform hover:scale-110 active:scale-95 shadow-md"
                        title="Cancel"
                    >
                        <FaTimes size={12} />
                    </button>
                </div>
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
