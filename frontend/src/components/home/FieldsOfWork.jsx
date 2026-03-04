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
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [isTapped, setIsTapped] = useState(false);
    const [tempTitle, setTempTitle] = useState(field.title);

    const handleEditTitle = () => {
        setTempTitle(field.title);
        setIsEditingTitle(true);
    };

    const handleCancelTitle = () => {
        setTempTitle(field.title);
        setIsEditingTitle(false);
    };

    const handleSaveTitle = () => {
        if (tempTitle !== field.title) updateField('title', tempTitle);
        setIsEditingTitle(false);
    };

    return (
        <div
            className="flex-none w-60 md:w-72 lg:w-80 relative group overflow-hidden rounded-xl shadow-lg cursor-pointer"
            onClick={() => setIsTapped(!isTapped)}
        >
            <div className="h-96 w-full relative">
                <EditableImage
                    defaultSrc={field.image}
                    alt={field.title}
                    className="w-full h-full absolute inset-0"
                    imgClassName="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onSave={(newSrc) => updateField('image', newSrc)}
                    editable={isAdmin && isEditMode}
                    editPosition="bottom-right"
                />

                {/* Gradient Overlay - pointer-events-none to allow clicking image edit button */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none"></div>

                <div className="absolute bottom-0 left-0 w-full p-4 md:p-6 z-10">
                    <h3 className="text-lg md:text-xl font-bold text-white mb-2">
                        {isEditingTitle ? (
                            <input
                                value={tempTitle}
                                onChange={(e) => setTempTitle(e.target.value)}
                                className="bg-transparent text-white border-b border-white/30 focus:border-white focus:outline-none w-full font-bold placeholder-gray-300"
                                autoFocus
                            />
                        ) : (
                            <span>{field.title}</span>
                        )}
                    </h3>

                    {/* Title Edit Trigger */}
                    {isAdmin && isEditMode && !isEditingTitle && (
                        <button
                            onClick={handleEditTitle}
                            className={`absolute top-2 right-2 bg-white/20 p-3 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full text-white hover:bg-white/40 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-auto active:bg-white/50 ${isTapped ? 'opacity-100' : ''}`}
                            title="Edit Title"
                        >
                            <FaPen size={14} />
                        </button>
                    )}

                    {isEditingTitle && (
                        <div className="flex gap-3 mt-4 pointer-events-auto">
                            <button onClick={handleSaveTitle} className="bg-green-600 text-white px-4 py-2 min-h-[44px] rounded text-sm flex items-center justify-center gap-1 flex-1 font-bold active:bg-green-700 transition-colors">
                                <FaSave size={14} /> Save
                            </button>
                            <button onClick={handleCancelTitle} className="bg-red-600 text-white px-4 py-2 min-h-[44px] rounded text-sm flex items-center justify-center gap-1 flex-1 font-bold active:bg-red-700 transition-colors">
                                <FaTimes size={14} /> Cancel
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
        <section className="py-16 md:py-20 lg:py-24 bg-gray-100 border-y border-gray-200 overflow-hidden">
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
                    className="flex overflow-x-auto gap-4 md:gap-6 pb-8 no-scrollbar md:justify-center md:flex-wrap lg:flex-nowrap lg:justify-start"
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
