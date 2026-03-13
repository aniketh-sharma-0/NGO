import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { useCMS } from '../context/CMSContext';
import { useUI } from '../context/UIContext';
import { FaFilter, FaPlus, FaChevronDown, FaEdit, FaTrash, FaTimes, FaGlobe, FaLayerGroup, FaCalendarAlt, FaUsers, FaArrowRight, FaMapMarkerAlt, FaUsersCog, FaHandshake } from 'react-icons/fa';
import CMSIconButton from '../components/common/CMSIconButton';
import Modal from '../components/common/Modal';
import SEO from '../components/common/SEO';
import useBodyScrollLock from '../hooks/useBodyScrollLock';

const getDemoProjects = () => [
    // GOVERNMENT PROJECTS
    {
        _id: '1',
        title: 'Rural Road Development',
        category: 'Government',
        status: 'Ongoing',
        description: 'Constructing all-weather roads to connect remote villages to the main highway, improving accessibility and economic opportunities for over 5000 residents.',
        location: 'Anantapur District',
        beneficiaries: '5000+ Villagers',
        sponsor: 'Govt of Andhra Pradesh',
        images: ['https://images.unsplash.com/photo-1596627689623-28c005b4b104?auto=format&fit=crop&q=80&w=800'],
        members: [{ name: 'Rk. Naidu', position: 'Project Lead' }, { name: 'S. Kumar', position: 'Site Engineer' }],
        projectReport: '#',
        financialReport: '#'
    },
    {
        _id: '11',
        title: 'Watershed Management Project',
        category: 'Government',
        status: 'Completed',
        description: 'Implementing sustainable water conservation structures to improve groundwater levels and support agriculture in drought-prone areas.',
        location: 'Dharmavaram Region',
        beneficiaries: '1200 Farmers',
        sponsor: 'NABARD',
        images: ['https://images.unsplash.com/photo-1588691866761-aa7a8f152345?q=80&w=800&auto=format&fit=crop'],
        members: [{ name: 'A. Rao', position: 'Hydrologist' }],
        projectReport: '#',
        financialReport: '#'
    },
    {
        _id: '12',
        title: 'Village Electrification Scheme',
        category: 'Government',
        status: 'Upcoming',
        description: 'Bringing solar-powered electricity to off-grid hamlets, ensuring every household has access to clean and reliable energy.',
        location: 'Tribal Hamlets',
        beneficiaries: '500 Households',
        sponsor: 'Ministry of Power',
        images: ['https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?q=80&w=800&auto=format&fit=crop'],
        members: [{ name: 'M. Reddy', position: 'Coordinator' }],
        projectReport: '#',
        financialReport: '#'
    },

    // CSR PROJECTS
    {
        _id: '2',
        title: 'Tech for Education',
        category: 'CSR',
        status: 'Upcoming',
        description: 'Partnering with tech giants to provide tablets and internet access to underprivileged schools in the district, bridging the digital divide.',
        location: 'Govt High Schools',
        beneficiaries: '2000 Students',
        sponsor: 'Tech Mahindra Foundation',
        images: ['https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&q=80&w=800'],
        members: [{ name: 'Sarah J.', position: 'Coordinator' }],
        projectReport: '#',
        financialReport: '#'
    },
    {
        _id: '21',
        title: 'Women Skill Development',
        category: 'CSR',
        status: 'Ongoing',
        description: 'Providing vocational training in tailoring and handicrafts to empower rural women with sustainable livelihood opportunities.',
        location: 'Skill Center, HQ',
        beneficiaries: '300 Women',
        sponsor: 'Reliance Foundation',
        images: ['https://images.unsplash.com/photo-1555529733-0e670560f7e1?q=80&w=800&auto=format&fit=crop'],
        members: [{ name: 'L. Devi', position: 'Trainer' }],
        projectReport: '#',
        financialReport: '#'
    },
    {
        _id: '22',
        title: 'Clean Drinking Water Plants',
        category: 'CSR',
        status: 'Completed',
        description: 'Installing RO water purification plants in schools and community centers to ensure access to safe drinking water.',
        location: '15 Villages',
        beneficiaries: '10,000+ Residents',
        sponsor: 'Tata Trusts',
        images: ['https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800&auto=format&fit=crop'],
        members: [{ name: 'K. Singh', position: 'Project Manager' }],
        projectReport: '#',
        financialReport: '#'
    },

    // CLIENT PROJECTS
    {
        _id: '3',
        title: 'Corporate Training Program',
        category: 'Client',
        status: 'Completed',
        description: 'Customized training modules for corporate employees focusing on CSR awareness, soft skills, and leadership development.',
        location: 'Bangalore & Hyderabad',
        beneficiaries: '500+ Employees',
        sponsor: 'Various Corporates',
        images: ['https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800'],
        members: [],
        projectReport: '#',
        financialReport: '#'
    },
    {
        _id: '31',
        title: 'Impact Assessment Survey',
        category: 'Client',
        status: 'Ongoing',
        description: 'Conducting third-party impact assessment studies for external NGOs to evaluate the effectiveness of their social interventions.',
        location: 'Pan-India',
        beneficiaries: 'Partner NGOs',
        sponsor: 'International Agencies',
        images: ['https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=800&auto=format&fit=crop'],
        members: [{ name: 'Dr. P. Kumar', position: 'Lead Researcher' }],
        projectReport: '#',
        financialReport: '#'
    },
    {
        _id: '32',
        title: 'Capacity Building Workshop',
        category: 'Client',
        status: 'Upcoming',
        description: 'Organizing workshops for grassroots organizations to enhance their operational efficiency and fundraising capabilities.',
        location: 'District HQ',
        beneficiaries: '50 Local NGOs',
        sponsor: 'Civil Society Network',
        projectReport: '#',
        financialReport: '#'
    }
];

const Projects = () => {
    const { user } = useAuth();
    const isAdmin = user?.role?.name === 'Admin';
    const [searchParams] = useSearchParams();
    const { isMobileMenuOpen } = useUI();

    const [projects, setProjects] = useState([]);
    const [filterCategory, setFilterCategory] = useState(searchParams.get('category') || 'All');
    const [loading, setLoading] = useState(true);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const categories = ['All', 'Government', 'CSR', 'Client'];

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [viewMode, setViewMode] = useState('details'); // 'details' or 'edit'
    const [editProject, setEditProject] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'Government',
        status: 'Upcoming',
        startDate: '',
        location: '',
        image1: '',
        image2: '',
        members: [], // Array of { name, position }

        beneficiaries: '',
        sponsor: '',
        projectReport: '',
        financialReport: ''
    });

    useBodyScrollLock(isModalOpen);

    useEffect(() => {
        const categoryParam = searchParams.get('category');
        if (categoryParam) {
            setFilterCategory(categoryParam);
        }
    }, [searchParams]);

    useEffect(() => {
        fetchProjects();
    }, [filterCategory]);

    const fetchProjects = async () => {
        setLoading(true);
        try {
            let url = '/projects';
            if (filterCategory !== 'All') {
                url += `?category=${filterCategory}`;
            }
            const res = await api.get(url);
            let data = res.data;

            // Ensure data is array
            if (!Array.isArray(data)) {
                console.warn("API returned non-array:", data);
                data = [];
            }

            // Fallback to demo data if empty (for demonstration)
            if (data.length === 0) {
                data = getDemoProjects();
                if (filterCategory !== 'All') {
                    data = data.filter(p => p.category === filterCategory);
                }
            }

            // Sort by Status Priority: Upcoming > Ongoing > Completed
            const statusOrder = { 'Upcoming': 1, 'Ongoing': 2, 'Completed': 3 };
            const sortedProjects = data.sort((a, b) => {
                const statusA = a?.status || 'Completed';
                const statusB = b?.status || 'Completed';
                return (statusOrder[statusA] || 99) - (statusOrder[statusB] || 99);
            });

            setProjects(sortedProjects);
        } catch (error) {
            console.error('Failed to fetch projects', error);
            // Fallback on error
            let data = getDemoProjects();
            if (filterCategory !== 'All') data = data.filter(p => p.category === filterCategory);

            const statusOrder = { 'Upcoming': 1, 'Ongoing': 2, 'Completed': 3 };
            setProjects(data.sort((a, b) => (statusOrder[a.status] || 99) - (statusOrder[b.status] || 99)));
        } finally {
            setLoading(false);
        }
    };

    const openModal = (project = null, mode = 'details') => {
        setEditProject(project);
        setViewMode(mode);
        if (project && mode === 'edit') {
            setFormData({
                title: project.title || '',
                description: project.description || '',
                category: project.category || 'Government',
                status: project.status || 'Upcoming',
                startDate: project.startDate || '',
                location: project.location || '',
                image1: project.images?.[0] || '',
                image2: project.images?.[1] || '',
                members: project.members ? project.members.map(m => typeof m === 'string' ? { name: m, position: 'Member' } : m) : [],
                beneficiaries: project.beneficiaries || '',
                sponsor: project.sponsor || '',
                projectReport: project.projectReport || '',
                financialReport: project.financialReport || ''
            });
        } else if (mode === 'edit') {
            // New Project
            setFormData({
                title: '',
                description: '',
                category: 'Government',
                status: 'Upcoming',
                startDate: '',
                location: '',
                image1: '',
                image2: '',
                members: [],
                beneficiaries: '',
                sponsor: '',
                projectReport: '',
                financialReport: ''
            });
        } else if (project) {
            setFormData({
                ...project,
                image1: project.images?.[0] || '',
                image2: project.images?.[1] || ''
            });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditProject(null);
        setViewMode('details');
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleMemberChange = (index, field, value) => {
        const updatedMembers = [...formData.members];
        if (!updatedMembers[index]) updatedMembers[index] = { name: '', position: '' };
        updatedMembers[index] = { ...updatedMembers[index], [field]: value };
        setFormData(prev => ({ ...prev, members: updatedMembers }));
    };

    const addMember = () => {
        setFormData(prev => ({ ...prev, members: [...prev.members, { name: '', position: '' }] }));
    };

    const removeMember = (index) => {
        setFormData(prev => ({ ...prev, members: prev.members.filter((_, i) => i !== index) }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const projectData = {
                ...formData,
                images: [formData.image1, formData.image2].filter(Boolean)
            };

            // Check if it's a real backend project or demo
            // Demo IDs are usually short strings like '1', '11'
            // Mongo IDs are 24 chars
            const isDemo = editProject && editProject._id && editProject._id.length < 10;

            if (editProject && editProject._id) {
                if (isDemo) {
                    alert("Demo projects cannot be updated in this version.");
                    return;
                }
                await api.put(`/admin/projects/${editProject._id}`, projectData);
            } else {
                await api.post('/admin/projects', projectData);
            }

            fetchProjects();
            closeModal();
            alert('Project saved successfully!');
        } catch (error) {
            console.error('Error saving project:', error);
            alert('Failed to save project. Ensure backend is running.');
        }
    };

    return (
        <div className="min-h-screen py-20 bg-[#f4f5f6] font-sans">
            <SEO
                title="Our Projects"
                description="Explore our ongoing and completed projects in rural development, education, and healthcare across Andhra Pradesh."
                url="/projects"
            />
            <div className="container mx-auto px-4">
                <div className="text-center mb-8 md:mb-12 flex flex-col items-center">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-800 font-heading">Our Projects</h1>
                    <div className="w-24 h-1 bg-primary mt-4 rounded"></div>
                </div>

                <div className={`flex flex-col sm:flex-row justify-between items-center gap-4 mb-8 md:mb-10 transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                    <div className="flex w-full sm:w-auto gap-4 items-center sm:ml-auto">
                        <div className="relative z-30 flex-1 sm:flex-none w-full sm:w-auto">
                            {/* Custom Dropdown Trigger */}
                            <button
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="bg-white w-full sm:w-48 pl-5 pr-12 py-3 rounded-full shadow-md border border-gray-100 flex items-center gap-3 hover:shadow-lg transition-all transform hover:-translate-y-0.5 relative active:bg-gray-50 text-left min-h-[44px]"
                            >
                                <FaFilter className="text-primary/80 flex-shrink-0" />
                                <span className="font-bold text-gray-700 flex-1 truncate">{filterCategory}</span>
                                <div className={`absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`}>
                                    <FaChevronDown size={14} />
                                </div>
                            </button>

                            {/* Custom Dropdown Menu */}
                            {isDropdownOpen && (
                                <>
                                    <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)}></div>
                                    <div className="absolute top-full right-0 mt-2 w-full bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50 animate-fade-in-up">
                                        <ul className="py-2">
                                            {categories.map((cat) => (
                                                <li key={cat}>
                                                    <button
                                                        onClick={() => {
                                                            setFilterCategory(cat);
                                                            setIsDropdownOpen(false);
                                                        }}
                                                        className={`w-full text-left px-5 py-3 hover:bg-blue-50 transition-colors flex items-center justify-between
                                                            ${filterCategory === cat ? 'text-primary font-bold bg-blue-50/50' : 'text-gray-600'}`}
                                                    >
                                                        {cat}
                                                        {filterCategory === cat && <div className="w-2 h-2 rounded-full bg-primary"></div>}
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </>
                            )}
                        </div>
                        {isAdmin && (
                            <button onClick={() => openModal()} className="bg-[#1e3a8a] text-white px-5 py-3 rounded-full shadow-md hover:bg-blue-900 transition-all transform hover:shadow-lg flex items-center gap-2 font-bold tracking-wide">
                                <FaPlus className="text-sm" /> Add Project
                            </button>
                        )}
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-20">Loading...</div>
                ) : (
                    <>
                        {projects.length === 0 ? (
                            <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
                                <h3 className="text-xl font-bold text-gray-800 mb-2">No Projects Found</h3>
                                <p className="text-gray-500">There are currently no projects listed under the "{filterCategory}" category.</p>
                                {isAdmin && (
                                    <button onClick={() => openModal()} className="mt-4 text-primary font-bold hover:underline">
                                        + Add the first one
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {projects.map((project) => {
                                    if (!project) return null; // Skip invalid
                                    return (
                                        <div key={project._id || Math.random()} className="bg-[#f4f5f6] rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow border border-gray-100 flex flex-col">
                                            <div className="h-48 bg-gray-200 relative">
                                                <img
                                                    src={project.images?.[0] || 'https://via.placeholder.com/400x300'}
                                                    alt={project.title || 'Project'}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => { e.target.src = 'https://via.placeholder.com/400x300'; }}
                                                />
                                                <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold text-white
                                                ${project.status === 'Upcoming' ? 'bg-blue-500' :
                                                        project.status === 'Ongoing' ? 'bg-green-500' : 'bg-gray-500'}`}>
                                                    {project.status || 'Unknown'}
                                                </div>
                                            </div>
                                            <div className="p-5 md:p-6 flex-1 flex flex-col">
                                                <div className="text-xs text-accent font-bold uppercase tracking-wider mb-2">
                                                    {project.category || 'General'}
                                                </div>
                                                <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-2 leading-tight">{project.title || 'Untitled Project'}</h3>
                                                <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-4 line-clamp-3 flex-1">{project.description || 'No description available.'}</p>

                                                {project.members && Array.isArray(project.members) && project.members.length > 0 && (
                                                    <div className="mb-4">
                                                        <h4 className="text-xs font-bold text-gray-400 uppercase mb-1">Involved</h4>
                                                        <div className="flex flex-wrap gap-2">
                                                            {project.members.map((m, i) => (
                                                                <span key={i} className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">{typeof m === 'string' ? m : (m?.name || 'Member')}</span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                <div className="border-t pt-4 flex justify-between items-center mt-auto">
                                                    <button onClick={() => openModal(project)} className="text-primary font-bold hover:underline text-sm">
                                                        View Details &rarr;
                                                    </button>
                                                    {isAdmin && (
                                                        <CMSIconButton 
                                                            icon={FaEdit}
                                                            onClick={() => openModal(project, 'edit')}
                                                            title="Edit Project"
                                                            variant="default"
                                                            className="!min-w-[32px] !min-h-[32px] !shadow-none border-none bg-transparent"
                                                            size={14}
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Project Details & Management Modal - Rendered via Portal */}
            <Modal
                isOpen={isModalOpen}
                onClose={closeModal}
                title={viewMode === 'edit' ? (editProject ? 'Edit Project' : 'Add New Project') : 'Project Details'}
                maxWidth="max-w-5xl"
            >
                <div className="space-y-8">
                    {viewMode === 'details' ? (
                        <div className="space-y-8 animate-fade-in">
                            {/* Header Info */}
                            <div className="flex flex-col md:flex-row gap-10">
                                <div className="flex-1 space-y-6">
                                    <div className="flex items-center gap-4">
                                        <span className={`px-3 py-1.5 rounded-xl text-[10px] font-bold text-white uppercase tracking-widest shadow-sm
                                            ${formData.status === 'Upcoming' ? 'bg-blue-500' :
                                                formData.status === 'Ongoing' ? 'bg-green-500' : 'bg-gray-500'}`}>
                                            {formData.status}
                                        </span>
                                        <span className="text-gray-400 font-bold text-[10px] uppercase tracking-widest">{formData.category}</span>
                                    </div>
                                    <h1 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight">{formData.title}</h1>

                                    {/* Key Details Grid */}
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-gray-50/50 p-6 rounded-3xl border border-gray-100 mb-8">
                                        <div className="space-y-1">
                                            <span className="block text-[9px] text-gray-400 font-bold uppercase tracking-widest">Location</span>
                                            <div className="flex items-center gap-2 text-gray-700">
                                                <FaMapMarkerAlt className="text-gray-400" size={12} />
                                                <span className="text-sm font-bold">{formData.location || 'N/A'}</span>
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <span className="block text-[9px] text-gray-400 font-bold uppercase tracking-widest">Impact</span>
                                            <div className="flex items-center gap-2 text-gray-700">
                                                <FaUsers className="text-gray-400" size={12} />
                                                <span className="text-sm font-bold">{formData.beneficiaries || 'N/A'}</span>
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <span className="block text-[9px] text-gray-400 font-bold uppercase tracking-widest">Sponsor</span>
                                            <div className="flex items-center gap-2 text-gray-700">
                                                <FaHandshake className="text-gray-400" size={12} />
                                                <span className="text-sm font-bold">{formData.sponsor || 'Self-Funded'}</span>
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <span className="block text-[9px] text-gray-400 font-bold uppercase tracking-widest">Timeline</span>
                                            <div className="flex items-center gap-2 text-gray-700">
                                                <FaCalendarAlt className="text-gray-400" size={12} />
                                                <span className="text-sm font-bold">{formData.status}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="prose prose-blue max-w-none">
                                        <p className="text-gray-600 leading-relaxed text-lg italic border-l-4 border-gray-200 pl-6 py-2">{formData.description}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Images Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="group relative aspect-video rounded-3xl overflow-hidden bg-gray-100 shadow-xl border border-gray-100">
                                    {formData.image1 ? (
                                        <>
                                            <img src={formData.image1} alt="Primary" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                                        </>
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-300 gap-2">
                                            <FaGlobe size={32} />
                                            <span className="text-xs font-bold uppercase tracking-widest">Primary Media N/A</span>
                                        </div>
                                    )}
                                </div>
                                <div className="group relative aspect-video rounded-3xl overflow-hidden bg-gray-100 shadow-xl border border-gray-100">
                                    {formData.image2 ? (
                                        <>
                                            <img src={formData.image2} alt="Secondary" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                                        </>
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-300 gap-2">
                                            <FaLayerGroup size={32} />
                                            <span className="text-xs font-bold uppercase tracking-widest">Secondary Media N/A</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex flex-col lg:flex-row gap-10 border-t border-gray-100 pt-10">
                                {/* Members Involved */}
                                <div className="flex-1 space-y-6">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                                            <FaUsersCog className="text-gray-400" /> Crew & Roles
                                        </h3>
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{formData.members?.length || 0} Members</span>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {formData.members && formData.members.map((m, i) => (
                                            <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:bg-white hover:shadow-md transition-all group/member">
                                                <div>
                                                    <span className="block font-bold text-gray-900 group-hover/member:text-blue-600 transition-colors">{m.name}</span>
                                                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{m.position}</span>
                                                </div>
                                                <div className="w-8 h-8 rounded-full bg-white border border-gray-100 flex items-center justify-center shadow-sm">
                                                    <span className="text-[10px] font-bold text-gray-400">{m.name.charAt(0)}</span>
                                                </div>
                                            </div>
                                        ))}
                                        {(!formData.members || formData.members.length === 0) && (
                                            <div className="col-span-full py-10 bg-gray-50/50 rounded-3xl border border-dashed border-gray-200 text-center">
                                                <p className="text-gray-400 text-sm font-medium">No team members specified.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Doc Reports */}
                                <div className="w-full lg:w-80 space-y-6">
                                    <h3 className="text-xl font-bold text-gray-900">Project Data</h3>
                                    <div className="space-y-4">
                                        <a 
                                            href={formData.projectReport} 
                                            target="_blank" 
                                            rel="noreferrer" 
                                            className={`group/link flex items-center justify-between p-5 rounded-2xl border transition-all
                                                ${formData.projectReport ? 'bg-blue-50/30 border-blue-100 hover:bg-blue-50 hover:shadow-lg' : 'bg-gray-50 border-gray-100 pointer-events-none grayscale'}`}
                                        >
                                            <div>
                                                <h4 className="font-bold text-gray-900 group-hover/link:text-blue-600 transition-colors">Project Report</h4>
                                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Operational Audit</p>
                                            </div>
                                            <FaArrowRight className="text-gray-300 group-hover/link:text-blue-500 group-hover/link:translate-x-1 transition-all" />
                                        </a>
                                        <a 
                                            href={formData.financialReport} 
                                            target="_blank" 
                                            rel="noreferrer" 
                                            className={`group/link flex items-center justify-between p-5 rounded-2xl border transition-all
                                                ${formData.financialReport ? 'bg-green-50/30 border-green-100 hover:bg-green-50 hover:shadow-lg' : 'bg-gray-50 border-gray-100 pointer-events-none grayscale'}`}
                                        >
                                            <div>
                                                <h4 className="font-bold text-gray-900 group-hover/link:text-green-600 transition-colors">Financial View</h4>
                                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Budget Allocation</p>
                                            </div>
                                            <FaArrowRight className="text-gray-300 group-hover/link:text-green-500 group-hover/link:translate-x-1 transition-all" />
                                        </a>
                                    </div>
                                    
                                    {isAdmin && (
                                        <button 
                                            onClick={() => setViewMode('edit')} 
                                            className="w-full py-4 bg-gray-900 text-white font-bold rounded-2xl hover:bg-black transition-all shadow-xl flex items-center justify-center gap-3 active:scale-[0.98]"
                                        >
                                            <FaEdit /> Modify Mission
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-8 animate-fade-in">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <div className="space-y-1.5">
                                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Mission Identifier (Title)</label>
                                        <input name="title" value={formData.title} onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl focus:ring-2 focus:ring-gray-900 focus:outline-none transition-all font-bold text-gray-900" required placeholder="Project Name" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Category</label>
                                            <select name="category" value={formData.category} onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl focus:ring-2 focus:ring-gray-900 focus:outline-none transition-all font-medium text-gray-700">
                                                <option value="Government">Government</option>
                                                <option value="CSR">CSR</option>
                                                <option value="Client">Client</option>
                                            </select>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Status</label>
                                            <select name="status" value={formData.status} onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl focus:ring-2 focus:ring-gray-900 focus:outline-none transition-all font-medium text-gray-700">
                                                <option value="Upcoming">Upcoming</option>
                                                <option value="Ongoing">Ongoing</option>
                                                <option value="Completed">Completed</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Operation Description</label>
                                        <textarea name="description" value={formData.description} onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl h-32 focus:ring-2 focus:ring-gray-900 focus:outline-none transition-all resize-none text-sm leading-relaxed" required placeholder="Detailed timeline and goals..." />
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Primary Asset URL</label>
                                            <input name="image1" value={formData.image1} onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-100 p-3 rounded-xl text-xs" placeholder="https://..." />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Secondary Asset URL</label>
                                            <input name="image2" value={formData.image2} onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-100 p-3 rounded-xl text-xs" placeholder="https://..." />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Location</label>
                                            <input name="location" value={formData.location} onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-100 p-3 rounded-xl text-xs" placeholder="e.g. District" />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Reach</label>
                                            <input name="beneficiaries" value={formData.beneficiaries} onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-100 p-3 rounded-xl text-xs" placeholder="e.g. 500 Farmers" />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Funder</label>
                                            <input name="sponsor" value={formData.sponsor} onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-100 p-3 rounded-xl text-xs" placeholder="Govt/CSR" />
                                        </div>
                                    </div>
                                    <div className="space-y-4 p-5 bg-gray-50 rounded-3xl border border-gray-100">
                                        <div className="flex justify-between items-center mb-2">
                                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Personnel Management</label>
                                            <button type="button" onClick={addMember} className="px-3 py-1 bg-gray-900 text-white text-[10px] font-bold rounded-lg hover:bg-black transition-all">+ Add Crew</button>
                                        </div>
                                        <div className="space-y-2 max-h-32 overflow-y-auto custom-scrollbar pr-2">
                                            {formData.members.map((member, index) => (
                                                <div key={index} className="flex gap-2 animate-fade-in-down">
                                                    <input placeholder="Name" value={member.name} onChange={(e) => handleMemberChange(index, 'name', e.target.value)} className="flex-1 bg-white border border-gray-100 p-2 text-xs rounded-lg outline-none focus:ring-1 focus:ring-gray-900 shadow-sm" />
                                                    <input placeholder="Role" value={member.position} onChange={(e) => handleMemberChange(index, 'position', e.target.value)} className="flex-1 bg-white border border-gray-100 p-2 text-xs rounded-lg outline-none focus:ring-1 focus:ring-gray-900 shadow-sm" />
                                                    <button type="button" onClick={() => removeMember(index)} className="w-8 h-8 rounded-lg text-red-400 hover:bg-red-50 transition-colors">&times;</button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                                <div className="space-y-1.5">
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Operational Report Document</label>
                                    <input name="projectReport" value={formData.projectReport} onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl text-xs" placeholder="URL to PDF/Doc" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Financial Statement Document</label>
                                    <input name="financialReport" value={formData.financialReport} onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl text-xs" placeholder="URL to PDF/Doc" />
                                </div>
                            </div>

                            <div className="flex gap-4 pt-8 border-t border-gray-50">
                                <button type="submit" className="flex-1 bg-gray-900 text-white font-bold py-5 rounded-3xl hover:bg-black transition-all shadow-xl active:scale-[0.98]">
                                    Synchronize Database
                                </button>
                                <button type="button" onClick={() => setViewMode('details')} className="px-10 bg-gray-100 text-gray-600 font-bold py-5 rounded-3xl hover:bg-gray-200 transition-all">
                                    Cancel
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </Modal>
        </div >
    );
};

export default Projects;
