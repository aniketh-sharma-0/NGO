import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { FaChevronLeft, FaChevronRight, FaPlus, FaTrash, FaTimes } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { useCMS } from '../../context/CMSContext';
import { useNavigate } from 'react-router-dom';
import EditableText from '../cms/EditableText';
import EditableImage from '../cms/EditableImage';
import ImageWithFallback from '../common/ImageWithFallback';

const CarouselSection = () => {
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
                // Ensure slides have unique IDs if fresh default
                if (!res.data.home_carousel) {
                    // Keep defaults
                }
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

    // Debounce Ref
    const debounceTimer = React.useRef(null);

    const updateSlideContent = (id, field, value) => {
        const newSlides = slides.map(slide => slide.id === id ? { ...slide, [field]: value } : slide);
        setSlides(newSlides); // Immediate Update

        if (debounceTimer.current) clearTimeout(debounceTimer.current);
        debounceTimer.current = setTimeout(() => {
            persistToBackend(newSlides);
        }, 1000);
    };

    // Auto-slide
    useEffect(() => {
        if (slides.length <= 1) return;
        const interval = setInterval(() => {
            if (!isAdmin) { // Pause auto-slide if admin (editing might be annoying otherwise)
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
        setCurrentSlide(slides.length); // Go to new slide
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
                        {/* Text Content Container (Solid White on Desktop) */}
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
                                        <button onClick={() => deleteSlide(slide.id)} className="px-8 py-4 bg-red-500/80 md:bg-red-50 text-white md:text-red-600 rounded-full hover:bg-red-600 md:hover:bg-red-100 transition-colors w-full sm:w-auto text-center flex items-center justify-center gap-2 backdrop-blur-sm md:backdrop-blur-none shadow-lg md:shadow-none">
                                            <FaTrash /> <span className="sm:hidden md:inline">Delete Slide</span>
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Image Content Container */}
                        <div className="absolute inset-0 md:relative md:w-1/2 h-full z-0">
                            <EditableImage
                                defaultSrc={slide.image}
                                alt={slide.title}
                                className="w-full h-full"
                                imgClassName="w-full h-full object-cover object-center"
                                onSave={(newSrc) => updateSlideContent(slide.id, 'image', newSrc)}
                            />
                            {/* Mobile Dark Gradient Overlay to make Text Readable */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-black/10 md:hidden z-10 pointer-events-none"></div>
                        </div>
                    </div>
                )}

                {/* Navigation Arrows */}
                <button onClick={prevSlide} className="absolute left-3 md:left-6 bottom-24 md:top-1/2 md:-translate-y-1/2 bg-black/40 hover:bg-black/60 md:bg-white/50 md:hover:bg-white w-12 h-12 rounded-full backdrop-blur-sm transition-all z-30 flex items-center justify-center active:scale-95 text-white md:text-gray-800 border border-white/20 md:border-none shadow-lg outline-none focus:ring-2 focus:ring-primary/50">
                    <FaChevronLeft className="w-5 h-5 md:w-6 md:h-6 drop-shadow-md md:drop-shadow-none" />
                </button>
                <button onClick={nextSlide} className="absolute right-3 md:right-6 bottom-24 md:top-1/2 md:-translate-y-1/2 bg-black/40 hover:bg-black/60 md:bg-white/50 md:hover:bg-white w-12 h-12 rounded-full backdrop-blur-sm transition-all z-30 flex items-center justify-center active:scale-95 text-white md:text-gray-800 border border-white/20 md:border-none shadow-lg outline-none focus:ring-2 focus:ring-primary/50">
                    <FaChevronRight className="w-5 h-5 md:w-6 md:h-6 drop-shadow-md md:drop-shadow-none" />
                </button>

                {/* Dots Pagination */}
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

            {/* Add Slide Button (Admin) - Moved Below Carousel */}
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

export default CarouselSection;
