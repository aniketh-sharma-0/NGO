import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { useCMS } from '../../context/CMSContext';
import { FaPlus, FaTimes } from 'react-icons/fa';

const EditableImage = ({ contentKey, section, defaultSrc, alt, className, imgClassName = "w-full h-full object-cover", onSave, editable = true, editPosition = "center" }) => {
    const { user } = useAuth();
    const { isEditMode } = useCMS();
    const [src, setSrc] = useState(defaultSrc);
    // State for Image Editor Tools
    const [showImageTools, setShowImageTools] = useState(false);

    const isAdmin = user?.role?.name === 'Admin';

    useEffect(() => {
        setSrc(defaultSrc);
    }, [defaultSrc]);

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);

        try {
            const res = await api.post('/admin/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            const newSrc = res.data.filePath;
            await handleUpdate(newSrc);

            setShowImageTools(false);
        } catch (error) {
            console.error('Failed to upload image', error);
            alert('Failed to upload image');
        }
    };

    const handleUpdate = async (newVal) => {
        setSrc(newVal);
        if (onSave) {
            onSave(newVal);
        } else {
            await api.put('/admin/content', {
                key: contentKey,
                value: newVal,
                section: section
            });
        }
    };

    const overlayClasses = editPosition === 'center'
        ? `absolute inset-0 bg-black/50 flex flex-col items-center justify-center transition-all duration-300 ${showImageTools ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`
        : `absolute left-full top-1/2 -translate-y-1/2 ml-4 z-50 transition-all duration-300 ${showImageTools ? 'opacity-100 visible' : 'opacity-0 invisible group-hover:opacity-100 group-hover:visible'}`;

    return (
        <div className={`relative group ${className}`}>
            <img src={src} alt={alt} className={imgClassName} />

            {isAdmin && isEditMode && editable && (
                <div className={`${overlayClasses} z-20`}>
                    {!showImageTools ? (
                        <button
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowImageTools(true); }}
                            className="bg-white text-gray-900 px-4 py-2 rounded-full font-bold hover:bg-gray-100 shadow-lg transform hover:scale-105 transition-all text-sm whitespace-nowrap"
                        >
                            Change Photo
                        </button>
                    ) : (
                        <div className="bg-white p-4 rounded-xl shadow-2xl flex flex-col gap-3 w-64 animate-fade-in border border-gray-100" onClick={e => e.stopPropagation()}>
                            <div className="flex justify-between items-center border-b pb-2 mb-1">
                                <span className="font-bold text-gray-700 text-sm">Update Image</span>
                                <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowImageTools(false); }} className="text-gray-400 hover:text-red-500"><FaTimes /></button>
                            </div>

                            {/* URL Input */}
                            <input
                                className="w-full border p-2 rounded text-xs focus:ring-2 focus:ring-primary outline-none text-gray-800"
                                placeholder="Paste image URL..."
                                value={src}
                                onChange={(e) => handleUpdate(e.target.value)}
                            />

                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-200"></div>
                                </div>
                                <div className="relative flex justify-center text-xs">
                                    <span className="px-2 bg-white text-gray-500">OR</span>
                                </div>
                            </div>

                            {/* Upload Button */}
                            <label className="w-full bg-primary text-white py-2 rounded-lg text-center cursor-pointer hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 text-sm font-medium">
                                <FaPlus size={10} /> Upload File
                                <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
                            </label>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default EditableImage;
