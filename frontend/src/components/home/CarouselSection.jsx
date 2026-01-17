import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaChevronLeft, FaChevronRight, FaPlus, FaTrash, FaTimes } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { useCMS } from '../../context/CMSContext';
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
                const res = await axios.get('/api/content/Home');
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
            const token = localStorage.getItem('token');
            await axios.put('/api/admin/content', {
                key: 'home_carousel',
                value: data,
                section: 'Home'
            }, {
                headers: { Authorization: `Bearer ${token}` }
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
            <section className="relative w-full h-[500px] md:h-[600px] bg-gray-50 flex items-center overflow-hidden">
                {slides.length > 0 && (
                    <div className="container mx-auto px-4 flex flex-col-reverse md:flex-row h-full items-center">

                        {/* Text Content (Left 40%) */}
                        <div className="w-full md:w-2/5 flex flex-col justify-center p-6 md:p-12 z-10 bg-white/90 md:bg-transparent backdrop-blur-sm md:backdrop-blur-none absolute bottom-0 md:relative md:bottom-auto rounded-t-xl md:rounded-none">
                            {isAdmin && isEditMode ? (
                                <input
                                    className="text-3xl md:text-5xl font-bold text-gray-800 mb-4 bg-transparent border-b border-gray-300 focus:outline-none focus:border-primary w-full"
                                    value={slide.title}
                                    onChange={(e) => updateSlideContent(slide.id, 'title', e.target.value)}
                                />
                            ) : (
                                <h2 className="text-3xl md:text-5xl font-bold text-gray-800 mb-4">{slide.title}</h2>
                            )}

                            {isAdmin && isEditMode ? (
                                <textarea
                                    className="text-lg text-gray-600 mb-8 bg-transparent border-b border-gray-300 focus:outline-none focus:border-primary w-full resize-none"
                                    value={slide.description}
                                    onChange={(e) => updateSlideContent(slide.id, 'description', e.target.value)}
                                    rows={3}
                                />
                            ) : (
                                <p className="text-lg text-gray-600 mb-8">{slide.description}</p>
                            )}

                            <div className="flex gap-4">
                                <button className="px-6 py-3 bg-primary text-white rounded-md font-semibold hover:bg-blue-800 transition-colors">
                                    Explore More
                                </button>
                                {isAdmin && isEditMode && (
                                    <button onClick={() => deleteSlide(slide.id)} className="px-4 py-3 bg-red-100 text-red-600 rounded-md hover:bg-red-200">
                                        <FaTrash />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Image Content (Right 60%) */}
                        <div className="w-full md:w-3/5 h-full absolute top-0 right-0 md:relative group">
                            <EditableImage
                                defaultSrc={slide.image}
                                alt={slide.title}
                                className="w-full h-full"
                                onSave={(newSrc) => updateSlideContent(slide.id, 'image', newSrc)}
                            />
                        </div>
                    </div>
                )}

                {/* Navigation Arrows */}
                <button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/50 p-3 rounded-full hover:bg-white transition-colors z-20">
                    <FaChevronLeft size={24} />
                </button>
                <button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/50 p-3 rounded-full hover:bg-white transition-colors z-20">
                    <FaChevronRight size={24} />
                </button>

                {/* Dots */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-30">
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentSlide(index)}
                            className={`h-3 rounded-full transition-all duration-500 ease-in-out shadow-sm
                                ${index === currentSlide ? 'w-10 bg-primary' : 'w-3 bg-gray-400 hover:bg-gray-600'}`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            </section>

            {/* Add Slide Button (Admin) - Moved Below Carousel */}
            {isAdmin && isEditMode && slides.length < 5 && (
                <div className="container mx-auto px-4 py-4 flex justify-end border-b border-gray-100 bg-gray-50/50">
                    <button
                        onClick={addSlide}
                        className="bg-green-600 text-white px-6 py-2 rounded-full shadow-md hover:bg-green-700 flex items-center gap-2 transition-all transform hover:scale-105"
                    >
                        <FaPlus /> Add New Slide
                    </button>
                </div>
            )}
        </div>
    );
};

export default CarouselSection;
