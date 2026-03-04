import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { FaCalendarAlt, FaMapMarkerAlt, FaUser, FaClock, FaArrowRight, FaPlus, FaEdit, FaTrash, FaTimes } from 'react-icons/fa';
import EditableText from '../components/cms/EditableText';
import ImageWithFallback from '../components/common/ImageWithFallback';
import { useAuth } from '../context/AuthContext';

import { useCMS } from '../context/CMSContext';
import SEO from '../components/common/SEO';
const ExpandCard = ({ item, type, isAdmin, isEditMode, onEdit, onDelete, isActive, onClick }) => {
    return (
        <div
            onClick={onClick}
            className={`group relative h-96 min-w-[60px] md:min-w-[80px] flex-1 cursor-pointer overflow-hidden rounded-2xl transition-all duration-500 hover:flex-[3] hover:shadow-2xl ${isActive ? 'flex-[3] shadow-2xl' : ''}`}
        >
            {/* Background Image */}
            <ImageWithFallback
                src={type === 'blog' ? (item.coverImage || item.image) : (item.images?.[0] || item.image)}
                fallbackSrc={type === 'blog' ? 'https://placehold.co/800x600/e2e8f0/1e293b?text=Blog+Image' : 'https://placehold.co/800x600/e2e8f0/1e293b?text=Event+Image'}
                alt={item.title}
                className={`absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110 ${isActive ? 'scale-110' : ''}`}
            />

            {/* Overlay Gradient */}
            <div className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent md:bg-gradient-to-r md:from-black/80 md:via-black/20 md:to-transparent opacity-80 group-hover:opacity-90 transition-opacity ${isActive ? 'opacity-90' : ''}`} />

            {/* Admin Controls */}
            {isAdmin && isEditMode && (
                <div className={`absolute top-4 right-4 z-20 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity delay-200 ${isActive ? 'opacity-100' : ''}`}>
                    <button
                        onClick={(e) => { e.stopPropagation(); onEdit(item, type); }}
                        className="p-2 bg-white/20 hover:bg-white text-white hover:text-blue-600 rounded-full backdrop-blur-sm transition-all"
                        title="Edit"
                    >
                        <FaEdit />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); onDelete(item._id, type); }}
                        className="p-2 bg-white/20 hover:bg-white text-white hover:text-red-600 rounded-full backdrop-blur-sm transition-all"
                        title="Delete"
                    >
                        <FaTrash />
                    </button>
                </div>
            )}

            {/* Content - Title (Horizontal on Mobile, Vertical on Desktop) */}
            <div className={`absolute bottom-6 left-6 right-6 md:right-auto md:left-4 md:bottom-auto md:top-1/2 md:-translate-y-1/2 md:w-full md:origin-left md:-rotate-90 md:rotate-0 transition-all duration-300 md:group-hover:opacity-0 group-hover:opacity-0 z-10 ${isActive ? 'opacity-0' : ''}`}>
                <h3 className="text-xl md:text-xl font-bold text-white tracking-wide md:tracking-widest uppercase whitespace-normal break-words md:whitespace-nowrap md:writing-vertical-rl md:text-orientation-mixed drop-shadow-md">
                    <span className="md:hidden">{item.title}</span>
                    <span className="hidden md:inline">{item.title.substring(0, 15)}...</span>
                </h3>
            </div>

            {/* Content - Expanded Details */}
            <div className={`absolute inset-0 p-8 flex flex-col justify-end md:justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 translate-y-4 group-hover:translate-y-0 ${isActive ? 'opacity-100 translate-y-0' : ''}`}>
                <div className={`transform transition-transform duration-500 translate-x-4 group-hover:translate-x-0 ${isActive ? 'translate-x-0' : ''}`}>
                    <div className="bg-primary/90 text-white text-xs font-bold px-3 py-1 rounded-full w-fit mb-4">
                        {type === 'blog' ? 'Blog Post' : 'Event'}
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 leading-tight">{item.title}</h3>

                    {type === 'event' && (
                        <div className="flex flex-wrap gap-4 text-gray-300 mb-4 text-sm">
                            <span className="flex items-center gap-1"><FaCalendarAlt /> {new Date(item.date).toLocaleDateString()}</span>
                            <span className="flex items-center gap-1"><FaMapMarkerAlt /> {item.location}</span>
                        </div>
                    )}

                    {type === 'blog' && (
                        <div className="flex items-center gap-2 text-gray-300 mb-4 text-sm">
                            <FaUser /> <span>{item.authorName || 'Admin'}</span>
                            •
                            <FaClock /> <span>5 min read</span>
                        </div>
                    )}

                    <p className="text-gray-200 mb-6 line-clamp-3 md:line-clamp-4 max-w-lg text-sm md:text-base leading-relaxed">
                        {item.description || item.content?.substring(0, 150)}...
                    </p>

                    <button className="flex items-center gap-2 text-white font-bold hover:text-primary transition-colors group/btn">
                        Read More <FaArrowRight className={`transform transition-transform group-hover/btn:translate-x-1 ${isActive ? 'translate-x-1' : ''}`} />
                    </button>
                </div>
            </div>
        </div>
    );
};

const BlogsEvents = () => {
    const { user } = useAuth();
    const { isEditMode } = useCMS();
    const isAdmin = user?.role?.name === 'Admin';
    const [blogs, setBlogs] = useState([]);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    const [activeEventId, setActiveEventId] = useState(null);
    const [activeBlogId, setActiveBlogId] = useState(null);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState('blog'); // 'blog' or 'event'
    const [editItem, setEditItem] = useState(null);
    const [formData, setFormData] = useState({});

    // Fetch Data
    const fetchData = async () => {
        setLoading(true);
        try {
            const [resBlogs, resEvents] = await Promise.all([
                api.get('/media/blogs'),
                api.get('/media/events')
            ]);
            setBlogs(resBlogs.data);
            setEvents(resEvents.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Handlers
    const handleAdd = (type) => {
        setModalType(type);
        setEditItem(null);
        setFormData(type === 'blog' ? { title: '', content: '', coverImage: '', authorName: 'Admin', published: true } : { title: '', description: '', date: '', location: '', images: [] });
        setIsModalOpen(true);
    };

    const handleEdit = (item, type) => {
        setModalType(type);
        setEditItem(item);
        setFormData(type === 'blog' ? {
            title: item.title,
            content: item.content,
            coverImage: item.coverImage || '',
            authorName: item.authorName || 'Admin',
            published: item.published
        } : {
            title: item.title,
            description: item.description,
            date: item.date ? item.date.split('T')[0] : '',
            location: item.location,
            images: item.images || []
        });
        setIsModalOpen(true);
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formDataUpload = new FormData();
        formDataUpload.append('image', file);

        try {
            const res = await api.post('/admin/upload', formDataUpload, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            // Handle different field names
            if (modalType === 'blog') {
                setFormData(prev => ({ ...prev, coverImage: res.data.filePath }));
            } else {
                setFormData(prev => ({ ...prev, images: [res.data.filePath] })); // Overwrite for single image simplicity
            }
        } catch (error) {
            console.error('Upload failed', error);
            alert('Image upload failed');
        }
    };

    const handleDelete = async (id, type) => {
        if (!window.confirm('Are you sure you want to delete this item?')) return;
        try {
            await api.delete(`/media/${type}s/${id}`);
            fetchData();
        } catch (error) {
            alert('Failed to delete item.');
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            const url = `/media/${modalType}s${editItem ? `/${editItem._id}` : ''}`;
            const method = editItem ? 'put' : 'post';
            await api[method](url, formData);
            setIsModalOpen(false);
            fetchData();
        } catch (error) {
            console.error(error);
            alert('Failed to save item.');
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen pb-20">
            <SEO
                title="Stories & Updates"
                description="Read our latest blogs and stay updated with upcoming events at YRDS."
                url="/media"
            />
            {/* ... (Header and Sections remain same until Modal) ... */}

            {/* Header */}
            <div className="bg-gray-900 text-white py-16 md:py-20 px-4 text-center">
                <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold mb-4 md:mb-6 animate-fade-in-down leading-tight">
                    <EditableText contentKey="media_title" section="BlogsEvents" defaultText="Stories & Updates" />
                </h1>
                <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed px-4">
                    <EditableText contentKey="media_subtitle" section="BlogsEvents" defaultText="Stay connected with our latest activities, upcoming events, and impactful stories." />
                </p>
            </div>

            <div className="container mx-auto px-4 mt-8 relative z-10 space-y-20">

                {/* Upcoming Events Section */}
                <section>
                    <div className="flex justify-between items-center mb-8">
                        <div className="flex items-center gap-3 md:gap-4">
                            <div className="h-8 md:h-10 w-2 bg-blue-900"></div>
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 leading-tight">
                                <EditableText contentKey="media_events_title" section="BlogsEvents" defaultText="Upcoming Events" />
                            </h2>
                        </div>
                        {isAdmin && isEditMode && (
                            <button onClick={() => handleAdd('event')} className="bg-blue-900 text-white px-4 py-2 rounded-full shadow hover:bg-blue-800 flex items-center gap-2">
                                <FaPlus /> Add Event
                            </button>
                        )}
                    </div>

                    {/* Horizontal Accordion */}
                    <div className="flex flex-col md:flex-row gap-4 h-[800px] md:h-96 w-full">
                        {events.length > 0 ? events.map((event, idx) => (
                            <ExpandCard
                                key={event._id || idx}
                                item={event}
                                type="event"
                                isAdmin={isAdmin}
                                isEditMode={isEditMode}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                                isActive={activeEventId === (event._id || idx)}
                                onClick={() => setActiveEventId(activeEventId === (event._id || idx) ? null : (event._id || idx))}
                            />
                        )) : (
                            <div className="w-full h-full flex items-center justify-center bg-white rounded-2xl shadow-sm text-gray-400">
                                No events found.
                            </div>
                        )}
                    </div>
                </section>

                {/* Recent Blogs Section */}
                <section>
                    <div className="flex justify-between items-center mb-8">
                        <div className="flex items-center gap-3 md:gap-4">
                            <div className="h-8 md:h-10 w-2 bg-emerald-500"></div>
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 leading-tight">
                                <EditableText contentKey="media_blogs_title" section="BlogsEvents" defaultText="Recent Articles" />
                            </h2>
                        </div>
                        {isAdmin && isEditMode && (
                            <button onClick={() => handleAdd('blog')} className="bg-emerald-500 text-white px-4 py-2 rounded-full shadow hover:bg-emerald-600 flex items-center gap-2">
                                <FaPlus /> Add Article
                            </button>
                        )}
                    </div>

                    <div className="flex flex-col md:flex-row gap-4 h-[800px] md:h-96 w-full">
                        {blogs.length > 0 ? blogs.map((blog, idx) => (
                            <ExpandCard
                                key={blog._id || idx}
                                item={blog}
                                type="blog"
                                isAdmin={isAdmin}
                                isEditMode={isEditMode}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                                isActive={activeBlogId === (blog._id || idx)}
                                onClick={() => setActiveBlogId(activeBlogId === (blog._id || idx) ? null : (blog._id || idx))}
                            />
                        )) : (
                            <div className="w-full h-full flex items-center justify-center bg-white rounded-2xl shadow-sm text-gray-400">
                                No articles found.
                            </div>
                        )}
                    </div>
                </section>

            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white z-10">
                            <h2 className="text-2xl font-bold text-gray-800">
                                {editItem ? 'Edit' : 'Add'} {modalType === 'blog' ? 'Article' : 'Event'}
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-red-500">
                                <FaTimes size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleSave} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Title</label>
                                <input
                                    className="w-full border p-2 rounded focus:ring-2 focus:ring-primary/20 outline-none"
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    required
                                />
                            </div>

                            {modalType === 'blog' ? (
                                <>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Content</label>
                                        <textarea
                                            className="w-full border p-2 rounded h-32 focus:ring-2 focus:ring-primary/20 outline-none"
                                            value={formData.content}
                                            onChange={e => setFormData({ ...formData, content: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Author Name</label>
                                        <input
                                            className="w-full border p-2 rounded focus:ring-2 focus:ring-primary/20 outline-none"
                                            value={formData.authorName}
                                            onChange={e => setFormData({ ...formData, authorName: e.target.value })}
                                        />
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
                                        <textarea
                                            className="w-full border p-2 rounded h-24 focus:ring-2 focus:ring-primary/20 outline-none"
                                            value={formData.description}
                                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-1">Date</label>
                                            <input
                                                type="date"
                                                className="w-full border p-2 rounded focus:ring-2 focus:ring-primary/20 outline-none"
                                                value={formData.date}
                                                onChange={e => setFormData({ ...formData, date: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-1">Location</label>
                                            <input
                                                className="w-full border p-2 rounded focus:ring-2 focus:ring-primary/20 outline-none"
                                                value={formData.location}
                                                onChange={e => setFormData({ ...formData, location: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </div>
                                </>
                            )}

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Image source (URL or Upload)</label>
                                <div className="flex gap-2">
                                    <input
                                        className="flex-1 border p-2 rounded focus:ring-2 focus:ring-primary/20 outline-none"
                                        value={modalType === 'blog' ? formData.coverImage : (formData.images && formData.images[0] || '')}
                                        onChange={e => {
                                            const val = e.target.value;
                                            if (modalType === 'blog') {
                                                setFormData({ ...formData, coverImage: val });
                                            } else {
                                                setFormData({ ...formData, images: [val] });
                                            }
                                        }}
                                        placeholder="https://... or upload"
                                    />
                                    <label className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded cursor-pointer transition-colors flex items-center">
                                        Upload
                                        <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
                                    </label>
                                </div>
                            </div>

                            <button type="submit" className="w-full bg-primary text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-lg">
                                Save {modalType === 'blog' ? 'Article' : 'Event'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BlogsEvents;
