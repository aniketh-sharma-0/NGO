import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { useCMS } from '../../context/CMSContext';
import { FaPlus, FaTimes, FaPen } from 'react-icons/fa';

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



    return (
        <div className={`relative group ${className}`}>
            <img src={src} alt={alt} className={imgClassName} />

            {isAdmin && isEditMode && editable && (
                <div>
                    {/* Trigger Button - Visible on Hover */}
                    <button
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowImageTools(true); }}
                        className="absolute bottom-4 right-0 transform translate-x-1/2 bg-white text-gray-800 p-3 rounded-full shadow-xl hover:bg-primary hover:text-white transition-all z-20 opacity-0 group-hover:opacity-100 border border-gray-100"
                        title="Change Photo"
                    >
                        <FaPen size={14} />
                    </button>

                    {/* Fixed Modal for Editing */}
                    {showImageTools && (
                        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in" onClick={(e) => { e.stopPropagation(); setShowImageTools(false); }}>
                            <div className="bg-white p-6 rounded-2xl shadow-2xl flex flex-col gap-4 w-80 relative animate-scale-in" onClick={e => e.stopPropagation()}>
                                <button
                                    onClick={() => setShowImageTools(false)}
                                    className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
                                >
                                    <FaTimes size={18} />
                                </button>

                                <h3 className="text-lg font-bold text-gray-800 border-b pb-2">Update Image</h3>

                                {/* URL Input */}
                                <div>
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">Image URL</label>
                                    <input
                                        className="w-full border border-gray-300 p-2 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                        placeholder="https://..."
                                        value={src}
                                        onChange={(e) => handleUpdate(e.target.value)}
                                    />
                                </div>

                                <div className="relative flex py-1 items-center">
                                    <div className="flex-grow border-t border-gray-200"></div>
                                    <span className="flex-shrink-0 mx-4 text-gray-400 text-xs font-medium">OR</span>
                                    <div className="flex-grow border-t border-gray-200"></div>
                                </div>

                                {/* Upload Button */}
                                <label className="w-full bg-blue-900 text-white py-3 rounded-xl text-center cursor-pointer hover:bg-blue-700 transition-all transform hover:scale-[1.02] shadow-md flex items-center justify-center gap-2 font-semibold">
                                    <FaPlus /> Upload New Photo
                                    <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
                                </label>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default EditableImage;
