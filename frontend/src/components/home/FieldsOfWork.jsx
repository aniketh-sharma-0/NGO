import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { useCMS } from '../../context/CMSContext'; // Import useCMS
import DynamicList from '../cms/DynamicList';
import EditableText from '../cms/EditableText';
import EditableImage from '../cms/EditableImage';
import ImageWithFallback from '../common/ImageWithFallback';
import { FaPen, FaSave, FaTimes } from 'react-icons/fa';
import SectionTitle from '../common/SectionTitle';

// Sub-component for individual Field Item to manage its own Edit state
const FieldItem = ({ field, updateField, isAdmin, isEditMode }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [tempTitle, setTempTitle] = useState(field.title);
    const [tempImage, setTempImage] = useState(field.image);

    const handleEdit = () => {
        setTempTitle(field.title);
        setTempImage(field.image);
        setIsEditing(true);
    };

    const handleCancel = () => {
        setTempTitle(field.title);
        setTempImage(field.image);
        setIsEditing(false);
    };

    const handleSave = () => {
        // We update the parent list ONE by ONE.
        // DynamicList's updateItem will handle the persist.
        // Note: DynamicList expects field updates via (field, value).
        // We might need to call updateField twice or pass object?
        // DynamicList's renderItem callback: `(field, val) => updateItem(item.id, field, val)`
        // So we call it for each changed field.
        if (tempTitle !== field.title) updateField('title', tempTitle);
        if (tempImage !== field.image) updateField('image', tempImage);
        setIsEditing(false);
    };

    return (
        <div className="flex-none w-64 md:w-72 relative group overflow-hidden rounded-xl shadow-lg cursor-pointer">
            <div className="h-96 w-full relative">
                <ImageWithFallback
                    src={isEditing ? tempImage : field.image}
                    alt={field.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                <div className="absolute bottom-0 left-0 w-full p-6">
                    <h3 className="text-xl font-bold text-white mb-2">
                        {isEditing ? (
                            <input
                                value={tempTitle}
                                onChange={(e) => setTempTitle(e.target.value)}
                                className="bg-transparent text-white border-b border-white/30 focus:border-white focus:outline-none w-full font-bold placeholder-gray-300"
                            />
                        ) : (
                            <span>{field.title}</span>
                        )}
                    </h3>

                    {isEditing && (
                        <input
                            value={tempImage}
                            onChange={(e) => setTempImage(e.target.value)}
                            className="mt-2 text-xs text-white/70 bg-black/50 p-1 w-full rounded border border-white/20 placeholder-white/50"
                            placeholder="Image URL..."
                        />
                    )}

                    {/* Action Buttons */}
                    {isAdmin && isEditMode && !isEditing && (
                        <button
                            onClick={handleEdit}
                            className="absolute top-2 right-2 bg-white/20 p-2 rounded-full text-white hover:bg-white/40 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <FaPen size={12} />
                        </button>
                    )}

                    {isEditing && (
                        <div className="flex gap-2 mt-4">
                            <button onClick={handleSave} className="bg-green-600 text-white px-3 py-1 rounded text-sm flex items-center gap-1">
                                <FaSave size={12} /> Save
                            </button>
                            <button onClick={handleCancel} className="bg-red-600 text-white px-3 py-1 rounded text-sm flex items-center gap-1">
                                <FaTimes size={12} /> Cancel
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const FieldsOfWork = () => {
    const { user } = useAuth();
    const { isEditMode } = useCMS(); // Get isEditMode
    const isAdmin = user?.role?.name === 'Admin';
    const defaultFields = [
        { id: 1, title: 'Education', image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=600&auto=format&fit=crop' },
        { id: 2, title: 'Health', image: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?q=80&w=600&auto=format&fit=crop' },
        { id: 3, title: 'Resilience', image: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?q=80&w=600&auto=format&fit=crop' },
        { id: 4, title: 'Livelihood', image: 'https://images.unsplash.com/photo-1595246140625-573b715d11dc?q=80&w=600&auto=format&fit=crop' },
        { id: 5, title: 'Protection', image: 'https://images.unsplash.com/photo-1502086223501-686ded6262d4?q=80&w=600&auto=format&fit=crop' },
        { id: 6, title: 'Humanitarian', image: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?q=80&w=600&auto=format&fit=crop' },
    ];

    const [fields, setFields] = useState(defaultFields);
    const [homeContent, setHomeContent] = useState({});

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const res = await api.get('/content/Home');
                setHomeContent(res.data || {});
                if (res.data.fields_of_work_v2) {
                    setFields(res.data.fields_of_work_v2);
                }
            } catch (err) {
                console.error("Failed to fetch fields", err);
            }
        };
        fetchContent();
    }, []);



    // ... (inside the component render)

    return (
        <section className="py-12 bg-gray-100 border-y border-gray-200">
            <div className="container mx-auto px-4">
                <SectionTitle subtitle="WHAT WE DO">
                    <EditableText
                        contentKey="fields_title_prefix"
                        section="Home"
                        defaultText={homeContent.fields_title_prefix || "Our Fields"}
                        className="inline-block"
                    />
                    <span className="ml-3 inline-block">
                        <EditableText
                            contentKey="fields_title_suffix"
                            section="Home"
                            defaultText={homeContent.fields_title_suffix || "of Work"}
                            className="inline-block"
                        />
                    </span>
                </SectionTitle>

                <DynamicList
                    contentKey="fields_of_work_v2"
                    section="Home"
                    defaultItems={fields}
                    className="flex overflow-x-auto gap-6 pb-8 no-scrollbar md:justify-center md:flex-wrap lg:flex-nowrap lg:justify-start"
                    newItemTemplate={{ title: 'New Field', image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=600&auto=format&fit=crop' }}
                    renderItem={(field, updateField) => (
                        <FieldItem
                            field={field}
                            updateField={updateField}
                            isAdmin={isAdmin}
                            isEditMode={isEditMode}
                        />
                    )}
                />
            </div>
        </section>
    );
};

export default FieldsOfWork;
