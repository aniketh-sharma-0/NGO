import React from 'react';
import EditableText from '../cms/EditableText';
import EditableImage from '../cms/EditableImage';

const SummarySection = () => {
    return (
        <section className="py-24 bg-white">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row gap-12 items-center">
                    {/* Image Column */}
                    <div className="w-full md:w-1/2">
                        <div className="relative rounded-2xl overflow-hidden shadow-xl transform transition-transform hover:scale-[1.02] duration-300">
                            <EditableImage
                                contentKey="summary_image"
                                section="Home"
                                alt="About Our NGO"
                                className="w-full h-[500px] object-cover"
                                defaultSrc="https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?q=80&w=1000&auto=format&fit=crop"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none"></div>
                        </div>
                    </div>

                    {/* Content Column */}
                    <div className="w-full md:w-1/2 space-y-8">
                        <div className="inline-block px-4 py-1 bg-blue-50 text-primary rounded-full text-sm font-semibold tracking-wide uppercase font-heading shadow-sm">
                            <EditableText
                                contentKey="summary_badge"
                                section="Home"
                                defaultText="Who We Are"
                            />
                        </div>

                        <h2 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight font-heading">
                            <EditableText
                                contentKey="summary_title_prefix"
                                section="Home"
                                defaultText="Driving Change Through"
                            />
                            <span className="text-accent block mt-2">
                                <EditableText
                                    contentKey="summary_title_suffix"
                                    section="Home"
                                    defaultText="Community Action"
                                />
                            </span>
                        </h2>

                        <div className="text-lg text-gray-700 leading-relaxed font-light">
                            <EditableText
                                contentKey="summary_content"
                                section="Home"
                                type="textarea"
                                defaultText="We are dedicated to improving the lives of the underprivileged through education, healthcare, and sustainable development projects. Over the past decade, we have touched the lives of thousands, building a brighter future for communities in need. Join us in our mission to create a world where every individual has the opportunity to thrive."
                                className="whitespace-pre-wrap"
                            />
                        </div>

                        <div className="pt-6 grid grid-cols-2 gap-8 border-t border-blue-100">
                            <div>
                                <h4 className="text-4xl font-bold text-accent font-heading">
                                    <EditableText
                                        contentKey="stat_1_number"
                                        section="Home"
                                        defaultText="10+"
                                    />
                                </h4>
                                <div className="text-gray-600 font-medium mt-1">
                                    <EditableText
                                        contentKey="stat_1_label"
                                        section="Home"
                                        defaultText="Years of Service"
                                    />
                                </div>
                            </div>
                            <div>
                                <h4 className="text-4xl font-bold text-accent font-heading">
                                    <EditableText
                                        contentKey="stat_2_number"
                                        section="Home"
                                        defaultText="5000+"
                                    />
                                </h4>
                                <div className="text-gray-600 font-medium mt-1">
                                    <EditableText
                                        contentKey="stat_2_label"
                                        section="Home"
                                        defaultText="Lives Impacted"
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
