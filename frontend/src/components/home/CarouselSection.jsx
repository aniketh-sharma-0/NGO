import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { FaChevronLeft, FaChevronRight, FaPlus, FaTrash, FaTimes } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { useCMS } from '../../context/CMSContext';
import EditableText from '../cms/EditableText';
import EditableImage from '../cms/EditableImage';
import ImageWithFallback from '../common/ImageWithFallback';

const CarouselSection = () => {
    const { user } = useAuth();
    const { isEditMode } = useCMS();
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

    return (
        <div className="flex flex-col">
            <section className="relative w-full h-[500px] md:h-[600px] flex items-center overflow-hidden">
                {slides.length > 0 && (
                    <div className="container mx-auto px-4 flex flex-col-reverse md:flex-row h-full items-center relative z-10">

                        {/* Text Content (Left 50%) - Removed Card Styling */}
                        <div className="w-full md:w-1/2 flex flex-col justify-center p-6 md:p-12 z-10 text-left">
                            <div className="mb-4 md:mb-6">
                                <EditableText
                                    defaultText={slide.title}
                                    onSave={(val) => updateSlideContent(slide.id, 'title', val)}
                                    editable={isAdmin && isEditMode}
                                    className="text-3xl md:text-5xl lg:text-6xl font-bold text-gray-900 font-heading leading-tight tracking-tight block"
                                />
                            </div>

                            <div className="mb-6 md:mb-10">
                                <EditableText
                                    defaultText={slide.description}
                                    onSave={(val) => updateSlideContent(slide.id, 'description', val)}
                                    type="textarea"
                                    editable={isAdmin && isEditMode}
                                    className="text-base md:text-xl text-gray-600 font-light max-w-xl leading-relaxed block"
                                />
                            </div>

                            <div className="flex flex-col md:flex-row gap-4 md:gap-6 mt-2 md:mt-0 mb-8 md:mb-0">
                                <button className="px-6 py-3 min-h-[44px] md:px-8 md:py-4 bg-gray-900 text-white rounded-full font-bold hover:bg-black active:bg-gray-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 w-full md:w-auto text-center flex items-center justify-center">
                                    Explore More
                                </button>
                                {isAdmin && isEditMode && (
                                    <button onClick={() => deleteSlide(slide.id)} className="px-6 py-3 min-h-[44px] bg-red-50 text-red-600 rounded-full hover:bg-red-100 active:bg-red-200 transition-colors w-full md:w-auto text-center flex items-center justify-center gap-2">
                                        <FaTrash /> <span className="md:hidden">Delete Slide</span>
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Image Content (Right 50%) - Full Height */}
                        <div className="w-full md:w-1/2 h-full absolute md:relative top-0 right-0 z-0">
                            {/* Gradient Overlay for Mobile Readability */}
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/20 to-white/90 md:hidden z-10"></div>
                            <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/40 to-transparent hidden md:block z-10 w-2/3"></div>

                            <EditableImage
                                defaultSrc={slide.image}
                                alt={slide.title}
                                className="w-full h-full"
                                imgClassName="w-full h-full object-cover object-center"
                                onSave={(newSrc) => updateSlideContent(slide.id, 'image', newSrc)}
                            />
                        </div>
                    </div>
                )}

                {/* Navigation Arrows */}
                <button onClick={prevSlide} className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-white/50 p-2 md:p-3 min-w-[44px] min-h-[44px] rounded-full hover:bg-white transition-colors z-20 flex items-center justify-center active:bg-gray-200">
                    <FaChevronLeft className="w-4 h-4 md:w-6 md:h-6 text-gray-800" />
                </button>
                <button onClick={nextSlide} className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-white/50 p-2 md:p-3 min-w-[44px] min-h-[44px] rounded-full hover:bg-white transition-colors z-20 flex items-center justify-center active:bg-gray-200">
                    <FaChevronRight className="w-4 h-4 md:w-6 md:h-6 text-gray-800" />
                </button>

                {/* Dots */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-4 z-30">
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentSlide(index)}
                            className={`min-h-[12px] rounded-full transition-all duration-500 ease-in-out shadow-sm
                                ${index === currentSlide ? 'w-10 bg-primary' : 'w-3 h-3 bg-gray-400 hover:bg-gray-600'}`}
                            aria-label={`Go to slide ${index + 1}`}
                            style={{ minWidth: '12px', minHeight: '12px' }}
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
