import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPhoneAlt, FaEnvelope } from 'react-icons/fa';
import EditableText from '../cms/EditableText';

const TopMarquee = () => {
    const [content, setContent] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const res = await axios.get('/api/content/Home');
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
            {/* Scrolling Left Section */}
            <div className="flex-1 overflow-hidden relative h-full flex items-center mask-image-gradient">
                <div className="animate-marquee whitespace-nowrap flex items-center gap-8 text-sm md:text-base font-medium tracking-wide">
                    <span>Yaswanth Rural Development Society</span>
                    <span>•</span>
                    <EditableText
                        contentKey="top_marquee_text"
                        section="Home"
                        defaultText={content?.top_marquee_text || 'Registration No: 12345/NGO/2026'}
                        className="inline-block"
                    />
                </div>
            </div>

            {/* Static Right Section */}
            <div className="flex-shrink-0 bg-slate-800 z-10 px-4 h-full flex items-center gap-6 shadow-[-5px_0_10px_rgba(0,0,0,0.1)]">
                <div className="hidden md:flex items-center gap-2">
                    <FaPhoneAlt size={14} className="text-blue-200" />
                    <EditableText
                        contentKey="top_marquee_phone"
                        section="Home"
                        defaultText={content?.top_marquee_phone || '+91 98765 43210'}
                        className="font-semibold text-sm"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <FaEnvelope size={14} className="text-blue-200" />
                    <EditableText
                        contentKey="top_marquee_email"
                        section="Home"
                        defaultText={content?.top_marquee_email || 'contact@yrds.org'}
                        className="font-semibold text-sm"
                    />
                </div>
            </div>
        </div>
    );
};

export default TopMarquee;
