import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useCMS } from '../../context/CMSContext';

const EditableImage = ({ contentKey, section, defaultSrc, alt, className, onSave, editable = true }) => {
    const { user } = useAuth();
    const { isEditMode } = useCMS();
    const [src, setSrc] = useState(defaultSrc);
    const [uploading, setUploading] = useState(false);

    const isAdmin = user?.role?.name === 'Admin';

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);

        setUploading(true);
        try {
            const token = localStorage.getItem('token');

            // 1. Upload Image
            const uploadRes = await axios.post('/api/admin/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`
                }
            });

            const newSrc = uploadRes.data.filePath;

            // 2. Update Content
            if (onSave) {
                onSave(newSrc);
            } else {
                await axios.put('/api/admin/content', {
                    key: contentKey,
                    value: newSrc,
                    section: section
                }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }

            setSrc(newSrc);
        } catch (error) {
            console.error('Failed to upload image', error);
            alert('Failed to upload image');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className={`relative group ${className}`}>
            <img src={src} alt={alt} className="w-full h-full object-cover" />
            {isAdmin && isEditMode && editable && (
                <label className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white font-bold">
                    {uploading ? 'Uploading...' : 'Change Image'}
                    <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
                </label>
            )}
        </div>
    );
};

export default EditableImage;
