import React, { useState, useEffect } from 'react';
import { FaPlus, FaTimes, FaPen } from 'react-icons/fa';
import CMSIconButton from '../common/CMSIconButton';
import Modal from '../common/Modal';
import { useAuth } from '../../context/AuthContext';
import { useCMS } from '../../context/CMSContext';
import api from '../../utils/api';

const EditableImage = ({ contentKey, section, defaultSrc, alt, className, imgClassName = "w-full h-full object-cover", onSave, editable = true, editPosition = "bottom-right" }) => {
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

        // File size limit: 5MB
        if (file.size > 5 * 1024 * 1024) {
            alert('File size too large. Please upload an image smaller than 5MB.');
            return;
        }

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
                <>
                    {/* Standardized Edit Trigger Button */}
                    <CMSIconButton 
                        icon={FaPen}
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowImageTools(true); }}
                        title="Change Photo"
                        className={`absolute z-20 
                            ${editPosition === 'center' ? 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2' : ''}
                            ${editPosition === 'top-right' ? 'top-4 right-4' : ''}
                            ${editPosition === 'bottom-right' ? 'bottom-4 right-4' : ''}
                            ${editPosition === 'bottom-center' ? 'bottom-4 left-1/2 -translate-x-1/2' : ''}
                            ${!['center', 'top-right', 'bottom-right', 'bottom-center'].includes(editPosition) ? 'bottom-4 right-4' : ''}
                        `}
                    />

                    {/* Stable Modal for Editing - Rendered via Portal */}
                    <Modal 
                        isOpen={showImageTools} 
                        onClose={() => setShowImageTools(false)}
                        title="Update Image"
                        maxWidth="max-w-sm"
                    >
                        <div className="flex flex-col gap-4">
                            {/* URL Input */}
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Image URL</label>
                                <input
                                    className="w-full border border-gray-200 p-3 rounded-xl text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none bg-gray-50 transition-all"
                                    placeholder="https://..."
                                    value={src}
                                    onChange={(e) => handleUpdate(e.target.value)}
                                />
                            </div>

                            <div className="relative flex py-1 items-center">
                                <div className="flex-grow border-t border-gray-100"></div>
                                <span className="flex-shrink-0 mx-4 text-gray-400 text-[10px] font-bold uppercase tracking-widest">OR</span>
                                <div className="flex-grow border-t border-gray-100"></div>
                            </div>

                            {/* Upload Button */}
                            <label className="w-full bg-gray-900 text-white py-4 rounded-2xl text-center cursor-pointer hover:bg-black transition-all transform hover:scale-[1.02] shadow-lg flex items-center justify-center gap-2 font-bold">
                                <FaPlus /> Upload New Photo
                                <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
                            </label>
                            
                            <p className="text-[10px] text-gray-400 text-center font-medium italic">Supports JPG, PNG, WEBP (Max 5MB)</p>
                        </div>
                    </Modal>
                </>
            )}
        </div>
    );
};

export default EditableImage;
