import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { FaSmile } from 'react-icons/fa';
import EditableText from '../cms/EditableText';
import EditableImage from '../cms/EditableImage';

const SummarySection = () => {
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
                    {/* Image Column */}
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

                        {/* Trusted By Badge */}
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

                    {/* Content Column */}
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
                                defaultText={content.summary_content || "We are dedicated to improving the lives of the underprivileged through education, healthcare, and sustainable development projects. Over the past decade, we have touched the lives of thousands, building a brighter future for communities in need. Join us in our mission to create a world where every individual has the opportunity to thrive."}
                                className="whitespace-pre-wrap"
                            />
                        </div>

                        <div className="pt-6 grid grid-cols-2 gap-6 md:gap-8 border-t border-blue-50 mt-6">
                            <div>
                                <h4 className="text-3xl md:text-4xl font-bold text-blue-600 font-heading">
                                    <EditableText
                                        contentKey="stat_1_number"
                                        section="Home"
                                        defaultText={content.stat_1_number || "10+"}
                                    />
                                </h4>
                                <div className="text-gray-500 font-bold text-xs md:text-sm tracking-wider uppercase mt-1">
                                    <EditableText
                                        contentKey="stat_1_label"
                                        section="Home"
                                        defaultText={content.stat_1_label || "Years of Service"}
                                    />
                                </div>
                            </div>
                            <div>
                                <h4 className="text-3xl md:text-4xl font-bold text-green-600 font-heading">
                                    <EditableText
                                        contentKey="stat_2_number"
                                        section="Home"
                                        defaultText={content.stat_2_number || "5000+"}
                                    />
                                </h4>
                                <div className="text-gray-500 font-bold text-sm tracking-wider uppercase mt-1">
                                    <EditableText
                                        contentKey="stat_2_label"
                                        section="Home"
                                        defaultText={content.stat_2_label || "Lives Impacted"}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SummarySection;
