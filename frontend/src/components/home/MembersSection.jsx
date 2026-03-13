import React, { useState, useEffect } from 'react';
import { FaPen, FaSave, FaTimes, FaPlus } from 'react-icons/fa';
import CMSIconButton from '../common/CMSIconButton';
import Modal from '../common/Modal';
import SectionTitle from '../common/SectionTitle';
import ImageWithFallback from '../common/ImageWithFallback';
import EditableText from '../cms/EditableText';
import EditableImage from '../cms/EditableImage';
import DynamicList from '../cms/DynamicList';
import { useAuth } from '../../context/AuthContext';
import { useCMS } from '../../context/CMSContext';
import api from '../../utils/api';


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
        <div
            className="flex-none w-64 bg-white rounded-lg shadow-lg overflow-hidden border border-gray-100 group relative"
        >
            <div className="h-64 w-full relative overflow-hidden bg-gray-200">
                <ImageWithFallback
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Edit Trigger Button - Always stable in the container */}
                {isAdmin && isEditMode && (
                    <CMSIconButton 
                        icon={FaPen}
                        onClick={handleEdit}
                        title="Edit Member"
                        className="absolute bottom-2 right-2"
                    />
                )}
            </div>

            <div className="p-4 text-center">
                <h5 className="font-bold text-lg text-gray-800">
                    <span>{member.name}</span>
                </h5>
                <p className="text-blue-600 text-sm font-medium mt-1">
                    <span>{member.role}</span>
                </p>
            </div>

            {/* Stable Member Edit Modal - Rendered via Portal */}
            <Modal
                isOpen={isEditing}
                onClose={handleCancel}
                title="Edit Team Member"
                maxWidth="max-w-md"
            >
                <div className="space-y-6">
                    {/* Profile Preview */}
                    <div className="flex justify-center">
                        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-50 shadow-xl">
                            <img src={tempImage} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">Full Name</label>
                            <input
                                value={tempName}
                                onChange={(e) => setTempName(e.target.value)}
                                className="w-full bg-gray-50 border border-gray-100 p-3 rounded-xl focus:ring-2 focus:ring-gray-900 focus:outline-none transition-all font-medium"
                                placeholder="Member Name"
                            />
                        </div>

                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">Designation / Role</label>
                            <input
                                value={tempRole}
                                onChange={(e) => setTempRole(e.target.value)}
                                className="w-full bg-gray-50 border border-gray-100 p-3 rounded-xl focus:ring-2 focus:ring-gray-900 focus:outline-none transition-all font-medium text-blue-600"
                                placeholder="e.g. Field Coordinator"
                            />
                        </div>

                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">Profile Photo URL</label>
                            <div className="flex gap-2">
                                <input
                                    value={tempImage}
                                    onChange={(e) => setTempImage(e.target.value)}
                                    className="flex-1 bg-gray-50 border border-gray-100 p-3 rounded-xl focus:ring-2 focus:ring-gray-900 focus:outline-none transition-all text-xs"
                                    placeholder="https://images.unsplash.com/..."
                                />
                                <label className="bg-gray-900 text-white w-12 h-12 rounded-xl flex items-center justify-center cursor-pointer hover:bg-black transition-colors flex-shrink-0" title="Upload Image">
                                    <FaPlus size={14} />
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={async (e) => {
                                            const file = e.target.files[0];
                                            if (!file) return;

                                            if (file.size > 5 * 1024 * 1024) {
                                                alert('File size too large (Max 5MB)');
                                                return;
                                            }

                                            const formData = new FormData();
                                            formData.append('image', file);
                                            try {
                                                const res = await api.post('/admin/upload', formData, {
                                                    headers: { 'Content-Type': 'multipart/form-data' }
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
                        </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button onClick={handleSave} className="flex-1 bg-green-600 text-white py-3.5 rounded-2xl flex justify-center items-center gap-2 hover:bg-green-700 font-bold active:scale-95 transition-all shadow-lg shadow-green-200">
                            <FaSave /> Save Changes
                        </button>
                        <button onClick={handleCancel} className="bg-gray-100 text-gray-600 px-6 py-3.5 rounded-2xl flex justify-center items-center gap-2 hover:bg-gray-200 font-bold active:scale-95 transition-all">
                            Cancel
                        </button>
                    </div>
                </div>
            </Modal>
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
                <div className="mb-16 md:mb-24">
                    <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 max-w-5xl mx-auto">
                        <div className="w-full md:w-1/3 flex justify-center md:justify-end">
                            <div className="w-48 h-48 md:w-64 md:h-64 shadow-2xl border-4 border-white relative group rounded-full flex-shrink-0">
                                <EditableImage
                                    contentKey="founder_image"
                                    section="Home"
                                    alt="Founder"
                                    className="w-full h-full"
                                    imgClassName="w-full h-full object-cover rounded-full"
                                    defaultSrc={homeContent.founder_image || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000&auto=format&fit=crop"}
                                    editPosition="center"
                                />
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
                <div className="mb-20 md:mb-24">
                    <div className="flex flex-col md:flex-row-reverse items-center gap-8 md:gap-12 max-w-5xl mx-auto">
                        <div className="w-full md:w-1/3 flex justify-center md:justify-start">
                            <div className="w-40 h-40 md:w-56 md:h-56 shadow-2xl border-4 border-white relative group rounded-full flex-shrink-0">
                                <EditableImage
                                    contentKey="ceo_image"
                                    section="Home"
                                    alt="CEO"
                                    className="w-full h-full"
                                    imgClassName="w-full h-full object-cover rounded-full"
                                    editPosition="center"
                                    defaultSrc={homeContent.ceo_image || "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=1000&auto=format&fit=crop"}
                                />
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
