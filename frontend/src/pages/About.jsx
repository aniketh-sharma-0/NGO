import React from 'react';
import EditableText from '../components/cms/EditableText';
import DynamicList from '../components/cms/DynamicList';
import EditableImage from '../components/cms/EditableImage';

const About = () => {
    // Default compliance documents
    const defaultDocs = [
        { id: 1, title: 'Registration Certificate', image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=400&h=560' }, // Certificate like
        { id: 2, title: '12A Certificate', image: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=400&h=560' }, // Document
        { id: 3, title: '80G Certificate', image: 'https://images.unsplash.com/photo-1626178793926-22b28830aa30?auto=format&fit=crop&q=80&w=400&h=560' }, // Paper
        { id: 4, title: 'CSR Registration', image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=400&h=560' }, // Signing
        { id: 5, title: 'FCRA Registration', image: 'https://images.unsplash.com/photo-1618044733300-9472054094ee?auto=format&fit=crop&q=80&w=400&h=560' }, // Official
    ];

    return (
        <div className="bg-gray-50 min-h-screen pb-16">
            {/* Header */}
            <div className="bg-gray-900 py-16 text-center text-white">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                    <EditableText contentKey="about_header_title" section="About" defaultText="About Us" />
                </h1>
                <div className="text-xl max-w-2xl mx-auto px-4 opacity-90">
                    <EditableText contentKey="about_header_subtitle" section="About" defaultText="Transparency, Integrity, and Impact." />
                </div>
            </div>

            <div className="container mx-auto px-4 mt-12 space-y-20">

                {/* 1. Brief Summary */}
                <section className="bg-white p-10 rounded-2xl shadow-sm border border-gray-100">
                    <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-4">
                        <EditableText contentKey="about_brief_title" section="About" defaultText="Who We Are" />
                    </h2>
                    <div className="text-gray-600 leading-relaxed text-lg">
                        <EditableText
                            contentKey="about_brief_content"
                            section="About"
                            type="textarea"
                            defaultText="YRDS NGO was established in 2010 with a vision to empower marginalized communities. We strictly adhere to all government regulations and maintain complete transparency in our operations. Our mission is to bridge the gap between resources and those in need through sustainable initiatives."
                            className="whitespace-pre-wrap"
                        />
                    </div>
                </section>

                {/* 2. Documents */}
                <section>
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">
                            <EditableText contentKey="about_docs_title" section="About" defaultText="Legal & Compliance Documents" />
                        </h2>
                        <p className="text-gray-500 max-w-2xl mx-auto">We operate with verified certifications and full regulatory compliance.</p>
                    </div>

                    <DynamicList
                        contentKey="about_documents_v2"
                        section="About"
                        defaultItems={defaultDocs}
                        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6"
                        newItemTemplate={{ title: 'New Document', image: 'https://via.placeholder.com/200x280' }}
                        renderItem={(doc, updateDoc) => (
                            <div className="bg-white p-4 rounded-xl shadow-md hover:shadow-xl transition-shadow flex flex-col items-center group">
                                <div className="w-full aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden relative mb-4 border border-gray-200">
                                    <EditableImage
                                        contentKey="temp_key"
                                        section="About"
                                        defaultSrc={doc.image}
                                        alt={doc.title}
                                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                        onSave={(newSrc) => updateDoc('image', newSrc)}
                                    />
                                </div>
                                <h3 className="font-semibold text-gray-700 text-center w-full text-sm">
                                    <input
                                        value={doc.title}
                                        onChange={(e) => updateDoc('title', e.target.value)}
                                        className="text-center w-full bg-transparent focus:outline-none focus:border-b border-primary p-1"
                                        placeholder="Document Name"
                                    />
                                </h3>
                            </div>
                        )}
                    />
                </section>

                {/* 3. Vision & Mission */}
                <section className="grid md:grid-cols-2 gap-8">
                    <div className="bg-blue-600 text-white p-10 rounded-2xl shadow-lg relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-10 opacity-10">
                            <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"></path></svg>
                        </div>
                        <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                            <span className="bg-white/20 p-2 rounded-lg">🚀</span>
                            <EditableText contentKey="vision_title" section="About" defaultText="Our Vision" />
                        </h3>
                        <div className="text-blue-100 text-lg leading-relaxed">
                            <EditableText
                                contentKey="vision_content"
                                section="About"
                                type="textarea"
                                defaultText="To create a world where every individual has equal opportunities to thrive, dignified living conditions, and the power to shape their own future."
                            />
                        </div>
                    </div>
                    <div className="bg-green-600 text-white p-10 rounded-2xl shadow-lg relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-10 opacity-10">
                            <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L1 21h22L12 2zm0 3.99L19.53 19H4.47L12 5.99z"></path></svg>
                        </div>
                        <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                            <span className="bg-white/20 p-2 rounded-lg">🎯</span>
                            <EditableText contentKey="mission_title" section="About" defaultText="Our Mission" />
                        </h3>
                        <div className="text-green-100 text-lg leading-relaxed">
                            <EditableText
                                contentKey="mission_content"
                                section="About"
                                type="textarea"
                                defaultText="To implement sustainable development projects in education, healthcare, and livelihood that directly impact the most vulnerable communities, ensuring transparency and long-term growth."
                            />
                        </div>
                    </div>
                </section>

                {/* 4. Explore Highlights (Blogs, Events, Volunteers) */}
                <section>
                    <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
                        <EditableText contentKey="highlights_title" section="About" defaultText="Explore Our Impact" />
                    </h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Blogs */}
                        <a href="/media" className="group relative h-64 rounded-2xl overflow-hidden shadow-lg cursor-pointer">
                            <img src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=800" alt="Blogs" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                            <div className="absolute inset-0 bg-black/50 group-hover:bg-black/60 transition-colors flex flex-col items-center justify-center text-white">
                                <h3 className="text-2xl font-bold mb-2">Blogs & Stories</h3>
                                <span className="underline opacity-0 group-hover:opacity-100 transition-opacity">Read More</span>
                            </div>
                        </a>
                        {/* Events */}
                        <a href="/media" className="group relative h-64 rounded-2xl overflow-hidden shadow-lg cursor-pointer">
                            <img src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=800" alt="Events" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                            <div className="absolute inset-0 bg-black/50 group-hover:bg-black/60 transition-colors flex flex-col items-center justify-center text-white">
                                <h3 className="text-2xl font-bold mb-2">Upcoming Events</h3>
                                <span className="underline opacity-0 group-hover:opacity-100 transition-opacity">Join Us</span>
                            </div>
                        </a>
                        {/* Volunteers */}
                        <a href="/volunteer" className="group relative h-64 rounded-2xl overflow-hidden shadow-lg cursor-pointer">
                            <img src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&q=80&w=800" alt="Volunteers" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                            <div className="absolute inset-0 bg-black/50 group-hover:bg-black/60 transition-colors flex flex-col items-center justify-center text-white">
                                <h3 className="text-2xl font-bold mb-2">Join as Volunteer</h3>
                                <span className="underline opacity-0 group-hover:opacity-100 transition-opacity">Get Involved</span>
                            </div>
                        </a>
                    </div>
                </section>

                {/* 5. Terms & Conditions */}
                <section className="bg-gray-100 p-8 rounded-2xl border border-gray-200">
                    <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <span className="w-2 h-8 bg-gray-800 rounded-full"></span>
                        <EditableText contentKey="about_terms_title" section="About" defaultText="Terms & Conditions" />
                    </h2>
                    <div className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap font-medium">
                        <EditableText
                            contentKey="about_terms_content"
                            section="About"
                            type="textarea"
                            defaultText={`1. All donations are voluntary and non-refundable.

2. The organization reserves the right to use the funds for any of its ongoing projects.

3. Receipts will be issued for all eligible donations.

4. Users must not misuse the content of this website.

5. We are committed to protecting your privacy.`}
                            className="whitespace-pre-wrap"
                        />
                    </div>
                </section>

            </div>
        </div>
    );
};

export default About;
