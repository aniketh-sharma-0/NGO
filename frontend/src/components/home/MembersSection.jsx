import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { useCMS } from '../../context/CMSContext';
import DynamicList from '../cms/DynamicList';
import EditableText from '../cms/EditableText';
import EditableImage from '../cms/EditableImage';
import ImageWithFallback from '../common/ImageWithFallback';
import { FaPen, FaSave, FaTimes } from 'react-icons/fa';
import SectionTitle from '../common/SectionTitle';


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
        const updates = {};
        if (tempName !== member.name) updates.name = tempName;
        if (tempRole !== member.role) updates.role = tempRole;
        if (tempImage !== member.image) updates.image = tempImage;

        if (Object.keys(updates).length > 0) {
            updateMember(updates);
        }
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

                {/* Image URL Input & Upload - Only visible when Editing */}
                {isEditing && (
                    <div className="absolute bottom-2 left-2 right-2 flex gap-1">
                        <input
                            value={tempImage}
                            onChange={(e) => setTempImage(e.target.value)}
                            className="flex-1 text-xs bg-white/90 p-1 rounded border shadow-sm outline-none focus:ring-2 focus:ring-primary"
                            placeholder="Image URL..."
                        />
                        <label className="bg-primary text-white p-1 rounded cursor-pointer hover:bg-blue-700 shadow-sm flex items-center justify-center w-8" title="Upload Image">
                            <span className="text-xs font-bold">+</span>
                            <input
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={async (e) => {
                                    const file = e.target.files[0];
                                    if (!file) return;
                                    const formData = new FormData();
                                    formData.append('image', file);
                                    try {
                                        const res = await api.post('/admin/upload', formData, {
                                            headers: {
                                                'Content-Type': 'multipart/form-data'
                                            }
                                        });
                                        setTempImage(res.data.filePath);
                                    } catch (err) {
                                        console.error(err);
                                        alert('Upload Failed');
                                    }
                                }}
                            />
                        </label>
                    </div>
                )}

                {/* Edit Trigger Button - Pushed inside image container per user request */}
                {isAdmin && isEditMode && !isEditing && (
                    <button
                        onClick={handleEdit}
                        className="absolute bottom-2 right-2 bg-white/80 p-2 rounded-full text-gray-800 shadow-md hover:bg-white hover:text-primary transition-all opacity-0 group-hover:opacity-100 z-10"
                        title="Edit Member"
                    >
                        <FaPen size={12} />
                    </button>
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
        </div>
    );
};

const MembersSection = () => {
    const { user } = useAuth();
    const { isEditMode } = useCMS();
    const isAdmin = user?.role?.name === 'Admin';
    const [homeContent, setHomeContent] = useState({});

    // Default team members for initial render
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
                setHomeContent(res.data || {}); // Store full content for founder/ceo images
                if (res.data.team_members) {
                    setMembers(res.data.team_members);
                }
            } catch (err) {
                console.error("Failed to fetch members", err);
            }
        };
        fetchContent();
    }, []);



    // ... (in component)

    return (
        <section className="py-12 bg-white">
            <div className="container mx-auto px-4">
                <SectionTitle subtitle="WHO WE ARE">
                    <EditableText
                        contentKey="team_section_title_prefix"
                        section="Home"
                        defaultText={homeContent.team_section_title_prefix || "Our"}
                        className="inline-block"
                    />
                    <span className="ml-3 inline-block">
                        <EditableText
                            contentKey="team_section_title_suffix"
                            section="Home"
                            defaultText={homeContent.team_section_title_suffix || "Leadership"}
                            className="inline-block"
                        />
                    </span>
                </SectionTitle>

                {/* Founder / President Section */}
                <div className="mb-24">
                    <div className="flex flex-col md:flex-row items-center gap-12 max-w-5xl mx-auto">
                        <div className="w-full md:w-1/3 flex justify-center md:justify-end">
                            <div className="w-64 h-64 shadow-2xl border-4 border-white relative group rounded-full overflow-hidden">
                                <EditableImage
                                    contentKey="founder_image"
                                    section="Home"
                                    alt="Founder"
                                    className="w-full h-full"
                                    imgClassName="w-full h-full object-cover"
                                    defaultSrc={homeContent.founder_image || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000&auto=format&fit=crop"}
                                    editPosition="center"
                                />
                            </div>
                        </div>
                        <div className="w-full md:w-2/3 text-center md:text-left">
                            <div className="text-secondary font-bold text-sm tracking-widest uppercase mb-2">
                                <EditableText contentKey="founder_role" section="Home" defaultText={homeContent.founder_role || "Founder & President"} />
                            </div>
                            <h3 className="text-4xl font-bold text-gray-900 mb-6 font-heading">
                                <EditableText contentKey="founder_name" section="Home" defaultText={homeContent.founder_name || "Dr. A. Founder"} />
                            </h3>
                            <div className="text-xl text-gray-600 leading-relaxed font-light">
                                <EditableText
                                    contentKey="founder_bio"
                                    section="Home"
                                    type="textarea"
                                    defaultText={homeContent.founder_bio || "Dedicated to serving the community for over 30 years. Believes in the power of collective action to bring about change."}
                                />
                            </div>
                            <div className="mt-8">
                                <div className="h-1 w-20 bg-secondary rounded mx-auto md:mx-0"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CEO Section */}
                <div className="mb-24">
                    <div className="flex flex-col md:flex-row-reverse items-center gap-12 max-w-5xl mx-auto">
                        <div className="w-full md:w-1/3 flex justify-center md:justify-start">
                            <div className="w-56 h-56 shadow-2xl border-4 border-white relative group rounded-full overflow-hidden">
                                <EditableImage
                                    contentKey="ceo_image"
                                    section="Home"
                                    alt="CEO"
                                    className="w-full h-full"
                                    imgClassName="w-full h-full object-cover"
                                    editPosition="center"
                                    defaultSrc={homeContent.ceo_image || "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=1000&auto=format&fit=crop"}
                                />
                            </div>
                        </div>
                        <div className="w-full md:w-2/3 text-center md:text-right">
                            <div className="text-primary font-bold text-sm tracking-widest uppercase mb-2">
                                <EditableText contentKey="ceo_role" section="Home" defaultText={homeContent.ceo_role || "Chief Executive Officer"} />
                            </div>
                            <h3 className="text-3xl font-bold text-gray-900 mb-6 font-heading">
                                <EditableText contentKey="ceo_name" section="Home" defaultText={homeContent.ceo_name || "Mr. B. CEO"} />
                            </h3>
                            <div className="text-xl text-gray-600 leading-relaxed font-light">
                                <EditableText
                                    contentKey="ceo_bio"
                                    section="Home"
                                    type="textarea"
                                    defaultText={homeContent.ceo_bio || "Leading the organization towards sustainable growth and impact."}
                                />
                            </div>
                            <div className="mt-8 flex justify-center md:justify-end">
                                <div className="h-1 w-20 bg-primary rounded"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Other Team Members - Horizontal Scroll */}
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
