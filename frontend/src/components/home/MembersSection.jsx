import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useCMS } from '../../context/CMSContext';
import DynamicList from '../cms/DynamicList';
import EditableText from '../cms/EditableText';
import EditableImage from '../cms/EditableImage';
import ImageWithFallback from '../common/ImageWithFallback';
import { FaPen, FaSave, FaTimes } from 'react-icons/fa';


const MemberItem = ({ member, updateMember, isAdmin, isEditMode }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [tempName, setTempName] = useState(member.name);
    const [tempRole, setTempRole] = useState(member.role);
    const [tempImage, setTempImage] = useState(member.image);

    const handleEdit = () => {
        setTempName(member.name);
        setTempRole(member.role);
        setTempImage(member.image);
        setIsEditing(true);
    };

    const handleCancel = () => {
        setTempName(member.name);
        setTempRole(member.role);
        setTempImage(member.image);
        setIsEditing(false);
    };

    const handleSave = () => {
        if (tempName !== member.name) updateMember('name', tempName);
        if (tempRole !== member.role) updateMember('role', tempRole);
        if (tempImage !== member.image) updateMember('image', tempImage);
        setIsEditing(false);
    };

    return (
        <div className="flex-none w-64 bg-white rounded-lg shadow-lg overflow-hidden border border-gray-100 group relative">
            <div className="h-64 w-full relative overflow-hidden bg-gray-200">
                <ImageWithFallback
                    src={isEditing ? tempImage : member.image}
                    alt={member.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Image URL Input - Only visible when Editing */}
                {isEditing && (
                    <input
                        value={tempImage}
                        onChange={(e) => setTempImage(e.target.value)}
                        className="absolute bottom-2 left-2 right-2 text-xs bg-white/90 p-1 rounded border shadow-sm outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Image URL..."
                    />
                )}
            </div>

            <div className="p-4 text-center">
                <h5 className="font-bold text-lg text-gray-800">
                    {isEditing ? (
                        <input
                            value={tempName}
                            onChange={(e) => setTempName(e.target.value)}
                            className="w-full text-center bg-gray-50 border-b border-gray-300 focus:border-primary focus:outline-none"
                            placeholder="Name"
                        />
                    ) : (
                        <span>{member.name}</span>
                    )}
                </h5>
                <p className="text-blue-600 text-sm font-medium mt-1">
                    {isEditing ? (
                        <input
                            value={tempRole}
                            onChange={(e) => setTempRole(e.target.value)}
                            className="w-full text-center bg-gray-50 border-b border-gray-300 focus:border-secondary focus:outline-none"
                            placeholder="Role"
                        />
                    ) : (
                        <span>{member.role}</span>
                    )}
                </p>

                {/* Edit Controls */}
                {isEditing && (
                    <div className="flex justify-center gap-2 mt-3">
                        <button onClick={handleSave} className="bg-green-600 text-white px-2 py-1 rounded text-xs flex items-center gap-1 hover:bg-green-700">
                            <FaSave /> Save
                        </button>
                        <button onClick={handleCancel} className="bg-red-600 text-white px-2 py-1 rounded text-xs flex items-center gap-1 hover:bg-red-700">
                            <FaTimes /> Cancel
                        </button>
                    </div>
                )}
            </div>

            {/* Edit Trigger Button - Only for Admin in Edit Mode */}
            {isAdmin && isEditMode && !isEditing && (
                <button
                    onClick={handleEdit}
                    className="absolute top-2 right-2 bg-white/80 p-2 rounded-full text-gray-800 shadow-md hover:bg-white hover:text-primary transition-all opacity-0 group-hover:opacity-100"
                    title="Edit Member"
                >
                    <FaPen size={12} />
                </button>
            )}
        </div>
    );
};

const MembersSection = () => {
    const { user } = useAuth();
    const { isEditMode } = useCMS();
    const isAdmin = user?.role?.name === 'Admin';

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
                const res = await axios.get('/api/content/Home');
                if (res.data.team_members) {
                    setMembers(res.data.team_members);
                }
            } catch (err) {
                console.error("Failed to fetch members", err);
            }
        };
        fetchContent();
    }, []);

    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-gray-800 mb-4">
                        <EditableText contentKey="team_section_title" section="Home" defaultText="Our Leadership" />
                    </h2>
                    <div className="w-24 h-1 bg-primary mx-auto rounded"></div>
                </div>

                {/* Founder / President */}
                <div className="flex flex-col items-center mb-16">
                    <div className="w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden shadow-2xl border-4 border-white mb-6 relative group">
                        <EditableImage
                            contentKey="founder_image"
                            section="Home"
                            alt="Founder"
                            className="w-full h-full object-cover"
                            defaultSrc="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000&auto=format&fit=crop"
                        />
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
                        <EditableText contentKey="founder_name" section="Home" defaultText="Dr. A. Founder" />
                    </h3>
                    <div className="text-primary font-medium text-lg uppercase tracking-wide">
                        <EditableText contentKey="founder_role" section="Home" defaultText="Founder & President" />
                    </div>
                    <div className="max-w-2xl text-center mt-4 text-gray-600 italic">
                        <EditableText
                            contentKey="founder_bio"
                            section="Home"
                            type="textarea"
                            defaultText="Dedicated to serving the community for over 30 years. Believes in the power of collective action to bring about chang."
                        />
                    </div>
                </div>

                {/* CEO */}
                <div className="flex flex-col items-center mb-20">
                    <div className="w-40 h-40 md:w-48 md:h-48 rounded-full overflow-hidden shadow-xl border-4 border-gray-100 mb-5 relative group">
                        <EditableImage
                            contentKey="ceo_image"
                            section="Home"
                            alt="CEO"
                            className="w-full h-full object-cover"
                            defaultSrc="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=1000&auto=format&fit=crop"
                        />
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900">
                        <EditableText contentKey="ceo_name" section="Home" defaultText="Mr. B. CEO" />
                    </h3>
                    <div className="text-secondary font-medium text-base uppercase tracking-wide">
                        <EditableText contentKey="ceo_role" section="Home" defaultText="Chief Executive Officer" />
                    </div>
                    <div className="max-w-xl text-center mt-3 text-gray-600">
                        <EditableText
                            contentKey="ceo_bio"
                            section="Home"
                            type="textarea"
                            defaultText="Leading the organization towards sustainable growth and impact."
                        />
                    </div>
                </div>

                {/* Other Team Members - Horizontal Scroll */}
                <div className="mb-8 px-4">
                    <h4 className="text-2xl font-bold text-gray-800 mb-8 border-l-4 border-primary pl-4">
                        <EditableText contentKey="team_list_title" section="Home" defaultText="Core Team Members" />
                    </h4>

                    <DynamicList
                        contentKey="team_members"
                        section="Home"
                        defaultItems={members}
                        className="flex overflow-x-auto gap-8 pb-8 no-scrollbar scroll-smooth"
                        renderItem={(member, updateMember) => (
                            <MemberItem
                                member={member}
                                updateMember={updateMember}
                                isAdmin={isAdmin}
                                isEditMode={isEditMode}
                            />
                        )}
                    />
                </div>
            </div>
        </section>
    );
};

export default MembersSection;
