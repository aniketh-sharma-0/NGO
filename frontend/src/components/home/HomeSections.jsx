import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight, FaPlus, FaTrash, FaTimes, FaSmile, FaPhoneAlt, FaEnvelope, FaBars } from 'react-icons/fa';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { useCMS } from '../../context/CMSContext';

// Common/Shared CMS Components (Assuming they are imported in the original files)
import EditableText from '../cms/EditableText';
import EditableImage from '../cms/EditableImage';
import DynamicList from '../cms/DynamicList';
import SectionTitle from '../common/SectionTitle';
import CMSIconButton from '../common/CMSIconButton';
import ImageWithFallback from '../common/ImageWithFallback';

// ==========================================
// 1. Top Marquee
// ==========================================
export const TopMarquee = () => {
    const [content, setContent] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const res = await api.get('/content/Home');
                setContent(res.data);
            } catch (error) {
                console.error('Failed to fetch top marquee content', error);
            } finally {
                setLoading(false);
            }
        };
        fetchContent();
    }, []);

    if (loading) {
        return <div className="h-10 bg-primary/10 animate-pulse"></div>;
    }

    return (
        <div className="bg-slate-800 text-white shadow-md overflow-hidden relative flex items-center h-10">
            <div className="flex-1 overflow-hidden relative h-full flex items-center mask-image-gradient">
                <div className="animate-marquee whitespace-nowrap flex items-center gap-4 md:gap-8 text-xs md:text-sm lg:text-base font-medium tracking-wide">
                    <EditableText
                        contentKey="ngo_name_marquee"
                        section="Header"
                        defaultText="Yaswanth Rural Development Society"
                        className="font-bold"
                    />
                    <span>•</span>
                    <EditableText
                        contentKey="top_marquee_text"
                        section="Home"
                        defaultText={content?.top_marquee_text || 'Registration No: 12345/NGO/2026'}
                        className="inline-block"
                    />
                </div>
            </div>

            <div className="flex-shrink-0 bg-slate-800 z-10 px-3 md:px-4 h-full flex items-center gap-4 md:gap-6 shadow-[-5px_0_10px_rgba(0,0,0,0.1)]">
                <div className="hidden lg:flex items-center gap-2">
                    <FaPhoneAlt size={12} className="text-blue-200 md:text-[14px]" />
                    <EditableText
                        contentKey="top_marquee_phone"
                        section="Home"
                        defaultText={content?.top_marquee_phone || '9538026060'}
                        className="font-semibold text-xs md:text-sm"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <FaEnvelope size={12} className="text-blue-200 md:text-[14px]" />
                    <EditableText
                        contentKey="top_marquee_email"
                        section="Home"
                        defaultText={content?.top_marquee_email || 'contact@yrds.org'}
                        className="font-semibold text-xs md:text-sm"
                    />
                </div>
            </div>
        </div>
    );
};

// ==========================================
// 2. Carousel Section
// ==========================================
export const CarouselSection = () => {
    const { user } = useAuth();
    const { isEditMode } = useCMS();
    const navigate = useNavigate();
    const isAdmin = user?.role?.name === 'Admin';
    const [slides, setSlides] = useState([]);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [loading, setLoading] = useState(true);

    const defaultSlides = [
        { id: 1, title: 'Welcome to YRDS', description: 'Empowering communities through sustainable development.', image: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=2070&auto=format&fit=crop' },
        { id: 2, title: 'Our Mission', description: 'To provide education and healthcare to the underprivileged.', image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=2070&auto=format&fit=crop' },
    ];

    useEffect(() => {
        const fetchSlides = async () => {
            try {
                const res = await api.get('/content/Home');
                const fetchedSlides = res.data.home_carousel || defaultSlides;
                setSlides(fetchedSlides);
            } catch (error) {
                console.error('Failed to fetch slides', error);
                setSlides(defaultSlides);
            } finally {
                setLoading(false);
            }
        };
        fetchSlides();
    }, []);

    const persistToBackend = async (data) => {
        try {
            await api.put('/admin/content', {
                key: 'home_carousel',
                value: data,
                section: 'Home'
            });
        } catch (error) {
            console.error('Failed to save slides', error);
        }
    };

    const saveSlides = async (newSlides) => {
        setSlides(newSlides);
        await persistToBackend(newSlides);
    };

    const debounceTimer = useRef(null);

    const updateSlideContent = (id, field, value) => {
        const newSlides = slides.map(slide => slide.id === id ? { ...slide, [field]: value } : slide);
        setSlides(newSlides);
        if (debounceTimer.current) clearTimeout(debounceTimer.current);
        debounceTimer.current = setTimeout(() => {
            persistToBackend(newSlides);
        }, 1000);
    };

    useEffect(() => {
        if (slides.length <= 1) return;
        const interval = setInterval(() => {
            if (!isAdmin) {
                setCurrentSlide((prev) => (prev + 1) % slides.length);
            }
        }, 5000);
        return () => clearInterval(interval);
    }, [slides.length, isAdmin]);

    const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
    const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

    const addSlide = () => {
        if (slides.length >= 5) return;
        const newSlide = {
            id: Date.now(),
            title: 'New Headline',
            description: 'New Description',
            image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2070&auto=format&fit=crop'
        };
        saveSlides([...slides, newSlide]);
        setCurrentSlide(slides.length);
    };

    const deleteSlide = (id) => {
        if (slides.length <= 1) return alert("Minimum 1 slide required.");
        if (window.confirm("Delete this slide?")) {
            const newSlides = slides.filter(s => s.id !== id);
            saveSlides(newSlides);
            if (currentSlide >= newSlides.length) setCurrentSlide(0);
        }
    };

    if (loading) return <div className="h-[500px] bg-gray-100 flex items-center justify-center">Loading...</div>;

    const slide = slides[currentSlide];

    const handleExploreMore = () => {
        if (currentSlide === 0) {
            navigate('/projects');
        } else if (currentSlide === 1) {
            navigate('/about');
        } else {
            navigate('/contact');
        }
    };

    return (
        <div className="flex flex-col">
            <section className="relative w-full h-[600px] md:h-[600px] flex items-center overflow-hidden bg-white">
                {slides.length > 0 && (
                    <div className="w-full h-full flex relative">
                        <div className="md:w-1/2 md:bg-white h-full relative z-20 flex items-center">
                            <div className="container mx-auto px-4 sm:px-6 md:px-12 w-full flex flex-col justify-end pb-24 md:pb-0 md:justify-center">
                                <div className="mb-4 md:mb-6">
                                    <EditableText
                                        defaultText={slide.title}
                                        onSave={(val) => updateSlideContent(slide.id, 'title', val)}
                                        editable={isAdmin && isEditMode}
                                        className="text-4xl md:text-5xl lg:text-6xl font-black text-white md:text-gray-900 font-heading leading-tight tracking-tight block drop-shadow-lg md:drop-shadow-none"
                                    />
                                </div>
                                <div className="mb-8 md:mb-10 w-full">
                                    <EditableText
                                        defaultText={slide.description}
                                        onSave={(val) => updateSlideContent(slide.id, 'description', val)}
                                        type="textarea"
                                        editable={isAdmin && isEditMode}
                                        className="text-lg md:text-xl text-gray-200 md:text-gray-600 font-medium w-full max-w-xl leading-relaxed block drop-shadow-md md:drop-shadow-none"
                                    />
                                </div>
                                <div className="flex flex-col md:flex-row gap-4 mb-4 md:mb-0">
                                    <button onClick={handleExploreMore} className="px-6 py-3 md:px-8 md:py-4 bg-primary text-white rounded-full font-bold hover:bg-blue-700 active:bg-blue-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-center flex items-center justify-center max-w-[200px]">
                                        Explore More
                                    </button>
                                    {isAdmin && isEditMode && (
                                        <CMSIconButton 
                                            icon={FaTrash}
                                            onClick={() => deleteSlide(slide.id)}
                                            title="Delete Slide"
                                            variant="danger"
                                            className="!shadow-none backdrop-blur-none"
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="absolute inset-0 md:relative md:w-1/2 h-full z-0">
                            <EditableImage
                                defaultSrc={slide.image}
                                alt={slide.title}
                                className="w-full h-full"
                                imgClassName="w-full h-full object-cover object-center"
                                onSave={(newSrc) => updateSlideContent(slide.id, 'image', newSrc)}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-black/10 md:hidden z-10 pointer-events-none"></div>
                        </div>
                    </div>
                )}
                <button onClick={prevSlide} className="absolute left-3 md:left-6 bottom-24 md:top-1/2 md:-translate-y-1/2 bg-black/40 hover:bg-black/60 md:bg-white/50 md:hover:bg-white w-12 h-12 rounded-full backdrop-blur-sm transition-all z-30 flex items-center justify-center active:scale-95 text-white md:text-gray-800 border border-white/20 md:border-none shadow-lg outline-none focus:ring-2 focus:ring-primary/50">
                    <FaChevronLeft className="w-5 h-5 md:w-6 md:h-6 drop-shadow-md md:drop-shadow-none" />
                </button>
                <button onClick={nextSlide} className="absolute right-3 md:right-6 bottom-24 md:top-1/2 md:-translate-y-1/2 bg-black/40 hover:bg-black/60 md:bg-white/50 md:hover:bg-white w-12 h-12 rounded-full backdrop-blur-sm transition-all z-30 flex items-center justify-center active:scale-95 text-white md:text-gray-800 border border-white/20 md:border-none shadow-lg outline-none focus:ring-2 focus:ring-primary/50">
                    <FaChevronRight className="w-5 h-5 md:w-6 md:h-6 drop-shadow-md md:drop-shadow-none" />
                </button>
                <div className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-30 bg-black/20 md:bg-transparent px-4 py-2 rounded-full backdrop-blur-md md:backdrop-blur-none border border-white/10 md:border-none shadow-lg md:shadow-none">
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentSlide(index)}
                            className={`min-h-[10px] rounded-full transition-all duration-500 ease-in-out shadow-sm outline-none
                                ${index === currentSlide ? 'w-8 bg-white md:bg-primary' : 'w-2.5 h-2.5 bg-white/50 md:bg-gray-400 hover:bg-white md:hover:bg-gray-600'}`}
                            aria-label={`Go to slide ${index + 1}`}
                            style={{ minWidth: '10px', minHeight: '10px' }}
                        />
                    ))}
                </div>
            </section>
            {isAdmin && isEditMode && slides.length < 5 && (
                <div className="container mx-auto px-4 py-4 flex justify-end border-b border-gray-100 bg-gray-50/50">
                    <button
                        onClick={addSlide}
                        className="bg-green-600 text-white px-6 py-3 min-h-[44px] rounded-full shadow-md hover:bg-green-700 flex items-center justify-center gap-2 transition-all transform hover:scale-105 active:bg-green-800"
                    >
                        <FaPlus /> Add New Slide
                    </button>
                </div>
            )}
        </div>
    );
};

// ==========================================
// 3. Summary Section
// ==========================================
export const SummarySection = () => {
    const [content, setContent] = useState({});

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const res = await api.get('/content/Home');
                setContent(res.data || {});
            } catch (err) {
                console.error("Failed to fetch summary content", err);
            }
        };
        fetchContent();
    }, []);

    return (
        <section className="py-16 md:py-20 lg:py-24 bg-white overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row gap-12 items-center">
                    <div className="w-full md:w-1/2 relative">
                        <div className="rounded-2xl overflow-hidden shadow-xl">
                            <EditableImage
                                contentKey="summary_image"
                                section="Home"
                                alt="About Our NGO"
                                className="w-full h-[500px] object-cover"
                                defaultSrc={content.summary_image || "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?q=80&w=1000&auto=format&fit=crop"}
                                editPosition="top-right"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none"></div>
                        </div>
                        <div className="absolute right-2 -bottom-4 md:-bottom-6 md:-right-6 bg-white p-3 md:p-4 rounded-xl shadow-2xl flex items-center gap-2 md:gap-4 max-w-[280px] md:max-w-xs z-20 animate-fade-in-up">
                            <div className="w-10 h-10 md:w-12 md:h-12 bg-green-50 rounded-full flex items-center justify-center text-green-600 text-xl md:text-2xl flex-shrink-0">
                                <FaSmile />
                            </div>
                            <div>
                                <div className="text-[10px] md:text-xs font-bold text-gray-500 tracking-wider uppercase">
                                    <EditableText 
                                        contentKey="summary_trusted_label"
                                        section="Home"
                                        defaultText={content.summary_trusted_label || "Trusted By"}
                                    />
                                </div>
                                <div className="text-base md:text-lg font-black text-gray-900 whitespace-nowrap">
                                    <EditableText 
                                        contentKey="summary_trusted_count"
                                        section="Home"
                                        defaultText={content.summary_trusted_count || "20k+ People"}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="w-full md:w-1/2 space-y-8">
                        <div className="inline-block px-4 py-2 bg-green-50 text-green-600 rounded-full text-xs md:text-sm font-bold tracking-wide uppercase font-heading shadow-sm">
                            <EditableText
                                contentKey="summary_badge"
                                section="Home"
                                defaultText={content.summary_badge || "Who We Are"}
                            />
                        </div>
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-black leading-tight font-heading">
                            <EditableText
                                contentKey="summary_title"
                                section="Home"
                                type="textarea"
                                defaultText={content.summary_title || "Driving Change Through\nCommunity Action"}
                            />
                        </h2>
                        <div className="text-base md:text-lg text-gray-700 leading-relaxed font-light">
                            <EditableText
                                contentKey="summary_content"
                                section="Home"
                                type="textarea"
                                defaultText={content.summary_content || "We are dedicated to improving the lives of the underprivileged through education, healthcare, and sustainable development projects..."}
                                className="whitespace-pre-wrap"
                            />
                        </div>
                        <div className="pt-6 grid grid-cols-2 gap-6 md:gap-8 border-t border-blue-50 mt-6">
                            <div>
                                <h4 className="text-3xl md:text-4xl font-bold text-blue-600 font-heading">
                                    <EditableText contentKey="stat_1_number" section="Home" defaultText={content.stat_1_number || "10+"} />
                                </h4>
                                <div className="text-gray-500 font-bold text-xs md:text-sm tracking-wider uppercase mt-1">
                                    <EditableText contentKey="stat_1_label" section="Home" defaultText={content.stat_1_label || "Years of Service"} />
                                </div>
                            </div>
                            <div>
                                <h4 className="text-3xl md:text-4xl font-bold text-green-600 font-heading">
                                    <EditableText contentKey="stat_2_number" section="Home" defaultText={content.stat_2_number || "5000+"} />
                                </h4>
                                <div className="text-gray-500 font-bold text-sm tracking-wider uppercase mt-1">
                                    <EditableText contentKey="stat_2_label" section="Home" defaultText={content.stat_2_label || "Lives Impacted"} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

// ==========================================
// 4. Fields of Work
// ==========================================
const FieldItem = ({ field, updateField, isAdmin, isEditMode }) => (
    <div className="flex-none w-60 md:w-72 lg:w-80 relative group overflow-hidden rounded-xl shadow-lg cursor-pointer">
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
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-full p-4 md:p-6 z-10">
                <h3 className="text-lg md:text-xl font-bold text-white mb-2">
                    <EditableText
                        defaultText={field.title}
                        onSave={(val) => updateField('title', val)}
                        editable={isAdmin && isEditMode}
                        className="w-full inline-block"
                    />
                </h3>
            </div>
        </div>
    </div>
);

export const FieldsOfWork = () => {
    const { user } = useAuth();
    const { isEditMode } = useCMS();
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
                if (res.data.fields_of_work_v2) setFields(res.data.fields_of_work_v2);
            } catch (err) {
                console.error("Failed to fetch fields", err);
            }
        };
        fetchContent();
    }, []);

    return (
        <section className="py-16 md:py-20 lg:py-24 bg-gray-100 border-y border-gray-200 overflow-hidden">
            <div className="container mx-auto px-4">
                <SectionTitle subtitle="WHAT WE DO">
                    <EditableText contentKey="fields_title" section="Home" defaultText={homeContent.fields_title || "Our Fields of Work"} />
                </SectionTitle>
                <DynamicList
                    contentKey="fields_of_work_v2"
                    section="Home"
                    defaultItems={fields}
                    className="flex overflow-x-auto gap-4 md:gap-6 pb-8 no-scrollbar md:justify-center md:flex-wrap lg:flex-nowrap lg:justify-start"
                    newItemTemplate={{ title: 'New Field', image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=600&auto=format&fit=crop' }}
                    renderItem={(field, updateField) => (
                        <FieldItem field={field} updateField={updateField} isAdmin={isAdmin} isEditMode={isEditMode} />
                    )}
                />
            </div>
        </section>
    );
};

// ==========================================
// 5. Members Section
// ==========================================
const MemberItem = ({ member, updateMember, isAdmin, isEditMode }) => (
    <div className="flex-none w-64 bg-white rounded-lg shadow-lg overflow-hidden border border-gray-100 group relative">
        <div className="h-64 w-full relative overflow-hidden bg-gray-200">
            <EditableImage
                defaultSrc={member.image}
                alt={member.name}
                className="w-full h-full absolute inset-0"
                imgClassName="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                onSave={(newSrc) => updateMember({ image: newSrc })}
                editable={isAdmin && isEditMode}
                editPosition="bottom-right"
            />
        </div>
        <div className="p-4 text-center">
            <h5 className="font-bold text-lg text-gray-800">
                <EditableText defaultText={member.name} onSave={(val) => updateMember({ name: val })} editable={isAdmin && isEditMode} className="w-full inline-block" />
            </h5>
            <p className="text-blue-600 text-sm font-medium mt-1">
                <EditableText defaultText={member.role} onSave={(val) => updateMember({ role: val })} editable={isAdmin && isEditMode} className="w-full inline-block" />
            </p>
        </div>
    </div>
);

export const MembersSection = () => {
    const { user } = useAuth();
    const { isEditMode } = useCMS();
    const isAdmin = user?.role?.name === 'Admin';
    const [homeContent, setHomeContent] = useState({});
    const defaultTeam = [
        { id: 1, name: 'John Doe', role: 'Operations Manager', image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1000&auto=format&fit=crop' },
        { id: 2, name: 'Jane Smith', role: 'Field Coordinator', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1000&auto=format&fit=crop' },
        { id: 3, name: 'Mike Ross', role: 'Volunteer Lead', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=1000&auto=format&fit=crop' },
        { id: 4, name: 'Rachel Zane', role: 'Legal Advisor', image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1000&auto=format&fit=crop' },
    ];
    const [members, setMembers] = useState(defaultTeam);

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const res = await api.get('/content/Home');
                setHomeContent(res.data || {});
                if (res.data.team_members) setMembers(res.data.team_members);
            } catch (err) {
                console.error("Failed to fetch members", err);
            }
        };
        fetchContent();
    }, []);

    return (
        <section className="py-12 bg-white">
            <div className="container mx-auto px-4">
                <SectionTitle subtitle="WHO WE ARE">
                    <EditableText contentKey="team_section_title" section="Home" defaultText={homeContent.team_section_title || "Our Leadership"} />
                </SectionTitle>

                <div className="mb-16 md:mb-24">
                    <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 max-w-5xl mx-auto">
                        <div className="w-full md:w-1/3 flex justify-center md:justify-end">
                            <div className="w-48 h-48 md:w-64 md:h-64 shadow-2xl border-4 border-white relative group rounded-full flex-shrink-0">
                                <EditableImage contentKey="founder_image" section="Home" alt="Founder" className="w-full h-full" imgClassName="w-full h-full object-cover rounded-full" defaultSrc={homeContent.founder_image || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000&auto=format&fit=crop"} editPosition="center" />
                            </div>
                        </div>
                        <div className="w-full md:w-2/3 text-center md:text-left">
                            <div className="text-secondary font-bold text-xs md:text-sm tracking-widest uppercase mb-2">
                                <EditableText contentKey="founder_role" section="Home" defaultText={homeContent.founder_role || "Founder & President"} />
                            </div>
                            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 md:mb-6 font-heading">
                                <EditableText contentKey="founder_name" section="Home" defaultText={homeContent.founder_name || "Dr. A. Founder"} />
                            </h3>
                            <div className="text-base md:text-xl text-gray-600 leading-relaxed font-light">
                                <EditableText contentKey="founder_bio" section="Home" type="textarea" defaultText={homeContent.founder_bio || "Dedicated to serving the community for over 30 years."} />
                            </div>
                            <div className="mt-8"><div className="h-1 w-20 bg-secondary rounded mx-auto md:mx-0"></div></div>
                        </div>
                    </div>
                </div>

                <div className="mb-20 md:mb-24">
                    <div className="flex flex-col md:flex-row-reverse items-center gap-8 md:gap-12 max-w-5xl mx-auto">
                        <div className="w-full md:w-1/3 flex justify-center md:justify-start">
                            <div className="w-40 h-40 md:w-56 md:h-56 shadow-2xl border-4 border-white relative group rounded-full flex-shrink-0">
                                <EditableImage contentKey="ceo_image" section="Home" alt="CEO" className="w-full h-full" imgClassName="w-full h-full object-cover rounded-full" editPosition="center" defaultSrc={homeContent.ceo_image || "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=1000&auto=format&fit=crop"} />
                            </div>
                        </div>
                        <div className="w-full md:w-2/3 text-center md:text-right">
                            <div className="text-primary font-bold text-xs md:text-sm tracking-widest uppercase mb-2">
                                <EditableText contentKey="ceo_role" section="Home" defaultText={homeContent.ceo_role || "Chief Executive Officer"} />
                            </div>
                            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 md:mb-6 font-heading">
                                <EditableText contentKey="ceo_name" section="Home" defaultText={homeContent.ceo_name || "Mr. B. CEO"} />
                            </h3>
                            <div className="text-base md:text-xl text-gray-600 leading-relaxed font-light">
                                <EditableText contentKey="ceo_bio" section="Home" type="textarea" defaultText={homeContent.ceo_bio || "Leading the organization towards sustainable growth."} />
                            </div>
                            <div className="mt-8 flex justify-center md:justify-end"><div className="h-1 w-20 bg-primary rounded"></div></div>
                        </div>
                    </div>
                </div>

                <div className="mb-8 px-4">
                    <h4 className="text-2xl font-bold text-gray-800 mb-8 border-l-4 border-primary pl-4">
                        <EditableText contentKey="team_list_title" section="Home" defaultText={homeContent.team_list_title || "Core Team Members"} />
                    </h4>
                    <DynamicList
                        contentKey="team_members"
                        section="Home"
                        defaultItems={members}
                        className="flex overflow-x-auto gap-8 pb-8 no-scrollbar scroll-smooth"
                        newItemTemplate={{ name: 'New Member', role: 'Role', image: 'https://via.placeholder.com/150' }}
                        renderItem={(member, updateMember) => (
                            <MemberItem member={member} updateMember={updateMember} isAdmin={isAdmin} isEditMode={isEditMode} />
                        )}
                    />
                </div>
            </div>
        </section>
    );
};
