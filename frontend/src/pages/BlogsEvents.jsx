import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaCalendarAlt, FaMapMarkerAlt, FaUser, FaClock, FaArrowRight } from 'react-icons/fa';
import EditableText from '../components/cms/EditableText';
import ImageWithFallback from '../components/common/ImageWithFallback';

const ExpandCard = ({ item, type }) => {
    return (
        <div className="group relative h-96 min-w-[60px] md:min-w-[80px] flex-1 cursor-pointer overflow-hidden rounded-2xl transition-all duration-500 hover:flex-[3] hover:shadow-2xl">
            {/* Background Image */}
            {/* Background Image */}
            <ImageWithFallback
                src={item.image || (type === 'blog' ? 'https://via.placeholder.com/600x400?text=Blog' : 'https://via.placeholder.com/600x400?text=Event')}
                alt={item.title}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            />

            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent md:bg-gradient-to-r md:from-black/80 md:via-black/20 md:to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

            {/* Content - Vertical Title (Collapsed) */}
            <div className="absolute bottom-6 left-6 md:left-4 md:bottom-auto md:top-1/2 md:-translate-y-1/2 w-full origin-left -rotate-90 md:rotate-0 transition-all duration-300 md:group-hover:opacity-0 group-hover:opacity-0 whitespace-nowrap z-10">
                <h3 className="text-xl font-bold text-white tracking-widest uppercase md:writing-vertical-rl md:text-orientation-mixed drop-shadow-md">
                    {item.title.substring(0, 15)}...
                </h3>
            </div>

            {/* Content - Expanded Details */}
            <div className="absolute inset-0 p-8 flex flex-col justify-end md:justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 translate-y-4 group-hover:translate-y-0">
                <div className="transform transition-transform duration-500 translate-x-4 group-hover:translate-x-0">
                    <div className="bg-primary/90 text-white text-xs font-bold px-3 py-1 rounded-full w-fit mb-4">
                        {type === 'blog' ? 'Blog Post' : 'Event'}
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-2 leading-tight">{item.title}</h3>

                    {type === 'event' && (
                        <div className="flex flex-wrap gap-4 text-gray-300 mb-4 text-sm">
                            <span className="flex items-center gap-1"><FaCalendarAlt /> {new Date(item.date).toLocaleDateString()}</span>
                            <span className="flex items-center gap-1"><FaMapMarkerAlt /> {item.location}</span>
                        </div>
                    )}

                    {type === 'blog' && (
                        <div className="flex items-center gap-2 text-gray-300 mb-4 text-sm">
                            <FaUser /> <span>{item.author || 'Admin'}</span>
                            •
                            <FaClock /> <span>5 min read</span>
                        </div>
                    )}

                    <p className="text-gray-200 mb-6 line-clamp-3 md:line-clamp-4 max-w-lg">
                        {item.description || item.content?.substring(0, 150)}...
                    </p>

                    <button className="flex items-center gap-2 text-white font-bold hover:text-primary transition-colors group/btn">
                        Read More <FaArrowRight className="transform transition-transform group-hover/btn:translate-x-1" />
                    </button>
                </div>
            </div>
        </div>
    );
};

const BlogsEvents = () => {
    const [blogs, setBlogs] = useState([]);
    const [events, setEvents] = useState([]);

    // Dummy Data to visualize if API empty
    const dummyEvents = [
        { id: 1, title: 'Charity Marathon 2026', date: '2026-03-15', location: 'City Park', description: 'Join us for a 5k run to raise funds for education.', image: 'https://images.unsplash.com/photo-1595821557929-e1ae6724a7d6?q=80&w=800&auto=format&fit=crop' },
        { id: 2, title: 'Medical Camp', date: '2026-04-10', location: 'Rural Center', description: 'Free checkups and medicine distribution for villagers.', image: 'https://images.unsplash.com/photo-1584515933487-779824d29309?q=80&w=800&auto=format&fit=crop' },
        { id: 3, title: 'Tree Plantation Drive', date: '2026-06-05', location: 'Green Belt Area', description: 'Planting 1000 trees this World Environment Day.', image: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?q=80&w=800&auto=format&fit=crop' },
        { id: 4, title: 'Education Seminar', date: '2026-07-20', location: 'Community Hall', description: 'Discussing the future of rural education.', image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=800&auto=format&fit=crop' },
    ];

    const dummyBlogs = [
        { id: 1, title: 'Empowering Women', author: 'Sarah J.', content: 'Women empowerment is not just a buzzword...', image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=800&auto=format&fit=crop' },
        { id: 2, title: 'Clean Water Initiative', author: 'Mike T.', content: 'Access to clean water changes everything...', image: 'https://images.unsplash.com/photo-1563974465492-cce7d5d7e5d8?q=80&w=800&auto=format&fit=crop' },
        { id: 3, title: 'Digital Literacy', author: 'Anita R.', content: 'Bridging the digital divide one tablet at a time.', image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800&auto=format&fit=crop' },
    ];

    useEffect(() => {
        // Fetch real data, fallback to dummy
        const fetchData = async () => {
            try {
                const resBlogs = await axios.get('/api/media/blogs');
                setBlogs(resBlogs.data.length ? resBlogs.data : dummyBlogs);

                const resEvents = await axios.get('/api/media/events');
                setEvents(resEvents.data.length ? resEvents.data : dummyEvents);
            } catch (err) {
                setBlogs(dummyBlogs);
                setEvents(dummyEvents);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="bg-gray-100 min-h-screen pb-20">
            {/* Header */}
            <div className="bg-gray-900 text-white py-20 px-4 text-center">
                <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in-down">
                    <EditableText contentKey="media_title" section="BlogsEvents" defaultText="Stories & Updates" />
                </h1>
                <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                    <EditableText contentKey="media_subtitle" section="BlogsEvents" defaultText="Stay connected with our latest activities, upcoming events, and impactful stories." />
                </p>
            </div>

            <div className="container mx-auto px-4 -mt-10 relative z-10 space-y-20">

                {/* Upcoming Events Section */}
                <section>
                    <div className="flex items-center gap-4 mb-8">
                        <div className="h-10 w-2 bg-primary"></div>
                        <h2 className="text-3xl font-bold text-gray-800">
                            <EditableText contentKey="media_events_title" section="BlogsEvents" defaultText="Upcoming Events" />
                        </h2>
                    </div>

                    {/* Horizontal Accordion */}
                    <div className="flex flex-col md:flex-row gap-4 h-[800px] md:h-96 w-full">
                        {events.map((event, idx) => (
                            <ExpandCard key={idx} item={event} type="event" />
                        ))}
                    </div>
                </section>

                {/* Recent Blogs Section */}
                <section>
                    <div className="flex items-center gap-4 mb-8">
                        <div className="h-10 w-2 bg-secondary"></div>
                        <h2 className="text-3xl font-bold text-gray-800">
                            <EditableText contentKey="media_blogs_title" section="BlogsEvents" defaultText="Recent Articles" />
                        </h2>
                    </div>

                    {/* Reuse Accordion or Grid? Let's generic Accordion again for consistency or Grid? 
                        User asked for "image on left details on right" hover effect. 
                        The Accordion fits this perfectly: Image strip -> Expands to show details on right (in desktop row).
                        Let's use the same cool component.
                    */}
                    <div className="flex flex-col md:flex-row gap-4 h-[800px] md:h-96 w-full">
                        {blogs.map((blog, idx) => (
                            <ExpandCard key={idx} item={blog} type="blog" />
                        ))}
                    </div>
                </section>

            </div>
        </div>
    );
};

export default BlogsEvents;
