import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaFilter, FaPlus, FaChevronDown } from 'react-icons/fa';

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
        image2: '',
        members: [], // Array of { name, position }
        location: '',
        beneficiaries: '',
        sponsor: '',
        projectReport: '',
        financialReport: ''
    });

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
            let url = '/api/projects';
            if (filterCategory !== 'All') {
                url += `?category=${filterCategory}`;
            }
            const res = await axios.get(url);
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
                await axios.put(`/api/projects/${editProject._id}`, projectData);
            } else {
                await axios.post('/api/projects', projectData);
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
        <div className="min-h-screen py-20 bg-soft-blue font-sans">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-800 font-heading">Our Projects</h1>
                    <div className="w-24 h-1 bg-primary mx-auto mt-4 rounded"></div>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center mb-10">
                    <div className="flex gap-4 items-center ml-auto">
                        <div className="relative z-50">
                            {/* Custom Dropdown Trigger */}
                            <button
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="bg-white pl-5 pr-12 py-3 rounded-full shadow-md border border-gray-100 flex items-center gap-3 hover:shadow-lg transition-all transform hover:-translate-y-0.5 w-48 relative"
                            >
                                <FaFilter className="text-primary/80" />
                                <span className="font-bold text-gray-700">{filterCategory}</span>
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
                                        <div key={project._id || Math.random()} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow border border-gray-100 flex flex-col">
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
                                            <div className="p-6 flex-1 flex flex-col">
                                                <div className="text-xs text-accent font-bold uppercase tracking-wider mb-2">
                                                    {project.category || 'General'}
                                                </div>
                                                <h3 className="text-xl font-bold text-gray-800 mb-2">{project.title || 'Untitled Project'}</h3>
                                                <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-1">{project.description || 'No description available.'}</p>

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
                                                        <button onClick={() => openModal(project, 'edit')} className="text-gray-400 hover:text-blue-600">
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                                                        </button>
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

            {/* Admin/Details Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white z-10">
                            <h2 className="text-2xl font-bold text-gray-800">
                                {viewMode === 'edit' ? (editProject ? 'Edit Project' : 'Add New Project') : 'Project Details'}
                            </h2>
                            <div className="flex gap-2">
                                {viewMode === 'details' && isAdmin && (
                                    <button onClick={() => setViewMode('edit')} className="px-4 py-2 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 font-medium">Edit Project</button>
                                )}
                                <button onClick={closeModal} className="text-gray-500 hover:text-red-500">
                                    <span className="text-2xl">&times;</span>
                                </button>
                            </div>
                        </div>

                        <div className="p-6">
                            {viewMode === 'details' ? (
                                <div className="space-y-8">
                                    {/* Header Info */}
                                    <div className="flex flex-col md:flex-row gap-6">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold text-white
                                                    ${formData.status === 'Upcoming' ? 'bg-blue-500' :
                                                        formData.status === 'Ongoing' ? 'bg-green-500' : 'bg-gray-500'}`}>
                                                    {formData.status}
                                                </span>
                                                <span className="text-primary font-bold text-sm tracking-wide">{formData.category.toUpperCase()}</span>
                                            </div>
                                            <h1 className="text-3xl font-bold text-gray-800 mb-4">{formData.title}</h1>

                                            {/* Key Details Grid */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 bg-gray-50 p-4 rounded-lg border border-gray-100">
                                                <div>
                                                    <span className="block text-xs text-gray-400 font-bold uppercase">Location</span>
                                                    <span className="text-gray-700 font-medium">{formData.location || 'N/A'}</span>
                                                </div>
                                                <div>
                                                    <span className="block text-xs text-gray-400 font-bold uppercase">Beneficiaries</span>
                                                    <span className="text-gray-700 font-medium">{formData.beneficiaries || 'N/A'}</span>
                                                </div>
                                                <div>
                                                    <span className="block text-xs text-gray-400 font-bold uppercase">Supported By</span>
                                                    <span className="text-gray-700 font-medium">{formData.sponsor || 'Self-Funded'}</span>
                                                </div>
                                                <div>
                                                    <span className="block text-xs text-gray-400 font-bold uppercase">Timeline</span>
                                                    <span className="text-gray-700 font-medium">{formData.status}</span>
                                                </div>
                                            </div>

                                            <p className="text-gray-600 leading-relaxed text-lg">{formData.description}</p>
                                        </div>
                                    </div>

                                    {/* Images */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="h-64 rounded-lg overflow-hidden bg-gray-100 shadow-inner">
                                            {formData.image1 ? (
                                                <img src={formData.image1} alt="Primary" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-400">No Image 1</div>
                                            )}
                                        </div>
                                        <div className="h-64 rounded-lg overflow-hidden bg-gray-100 shadow-inner">
                                            {formData.image2 ? (
                                                <img src={formData.image2} alt="Secondary" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-400">No Image 2</div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex flex-col md:flex-row gap-8">
                                        {/* Members */}
                                        <div className="flex-1">
                                            <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Modules & Members Involved</h3>
                                            <div className="space-y-3">
                                                {formData.members && formData.members.map((m, i) => (
                                                    <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded border border-gray-100">
                                                        <span className="font-bold text-gray-700">{m.name}</span>
                                                        <span className="text-sm text-gray-500 bg-white px-2 py-1 rounded border shadow-sm">{m.position}</span>
                                                    </div>
                                                ))}
                                                {(!formData.members || formData.members.length === 0) && <p className="text-gray-400 italic">No members listed.</p>}
                                            </div>
                                        </div>

                                        {/* Reports */}
                                        <div className="w-full md:w-1/3 space-y-4">
                                            <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Project Reports</h3>

                                            <div className="p-4 bg-soft-blue rounded-lg border border-blue-100">
                                                <h4 className="font-bold text-primary mb-1">Project Report</h4>
                                                {formData.projectReport ? (
                                                    <a href={formData.projectReport} target="_blank" rel="noreferrer" className="text-accent hover:underline text-sm break-all">
                                                        View Document &rarr;
                                                    </a>
                                                ) : <span className="text-gray-400 text-sm">Not Available</span>}
                                            </div>

                                            <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                                                <h4 className="font-bold text-green-800 mb-1">Financial Report</h4>
                                                {formData.financialReport ? (
                                                    <a href={formData.financialReport} target="_blank" rel="noreferrer" className="text-green-600 hover:underline text-sm break-all">
                                                        View Document &rarr;
                                                    </a>
                                                ) : <span className="text-gray-400 text-sm">Not Available</span>}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-1">Mission Name (Title)</label>
                                            <input name="title" value={formData.title} onChange={handleInputChange} className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none" required />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-1">Category</label>
                                                <select name="category" value={formData.category} onChange={handleInputChange} className="w-full border border-gray-300 p-3 rounded-lg bg-white">
                                                    <option value="Government">Government</option>
                                                    <option value="CSR">CSR</option>
                                                    <option value="Client">Client</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-1">Status</label>
                                                <select name="status" value={formData.status} onChange={handleInputChange} className="w-full border border-gray-300 p-3 rounded-lg bg-white">
                                                    <option value="Upcoming">Upcoming</option>
                                                    <option value="Ongoing">Ongoing</option>
                                                    <option value="Completed">Completed</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
                                        <textarea name="description" value={formData.description} onChange={handleInputChange} className="w-full border border-gray-300 p-3 rounded-lg h-32 focus:ring-2 focus:ring-primary/20 outline-none" required />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-1">Image 1 URL</label>
                                            <input name="image1" value={formData.image1} onChange={handleInputChange} className="w-full border border-gray-300 p-3 rounded-lg" placeholder="https://..." />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-1">Image 2 URL</label>
                                            <input name="image2" value={formData.image2} onChange={handleInputChange} className="w-full border border-gray-300 p-3 rounded-lg" placeholder="https://..." />
                                        </div>
                                    </div>



                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-1">Location</label>
                                            <input name="location" value={formData.location} onChange={handleInputChange} className="w-full border border-gray-300 p-3 rounded-lg" placeholder="e.g. District HQ" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-1">Beneficiaries</label>
                                            <input name="beneficiaries" value={formData.beneficiaries} onChange={handleInputChange} className="w-full border border-gray-300 p-3 rounded-lg" placeholder="e.g. 500 Farmers" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-1">Sponsor/Donor</label>
                                            <input name="sponsor" value={formData.sponsor} onChange={handleInputChange} className="w-full border border-gray-300 p-3 rounded-lg" placeholder="e.g. Govt/CSR" />
                                        </div>
                                    </div>

                                    <div className="space-y-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                        <div className="flex justify-between items-center">
                                            <label className="block text-sm font-bold text-gray-700">Members Involved</label>
                                            <button type="button" onClick={addMember} className="text-xs bg-primary text-white px-2 py-1 rounded hover:bg-blue-800">+ Add Member</button>
                                        </div>
                                        {formData.members.map((member, index) => (
                                            <div key={index} className="flex gap-2">
                                                <input placeholder="Name" value={member.name} onChange={(e) => handleMemberChange(index, 'name', e.target.value)} className="flex-1 border p-2 rounded" />
                                                <input placeholder="Position" value={member.position} onChange={(e) => handleMemberChange(index, 'position', e.target.value)} className="flex-1 border p-2 rounded" />
                                                <button type="button" onClick={() => removeMember(index)} className="text-red-500 hover:bg-red-50 px-2 rounded">&times;</button>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-1">Project Report URL</label>
                                            <input name="projectReport" value={formData.projectReport} onChange={handleInputChange} className="w-full border border-gray-300 p-3 rounded-lg" placeholder="#" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-1">Financial Report URL</label>
                                            <input name="financialReport" value={formData.financialReport} onChange={handleInputChange} className="w-full border border-gray-300 p-3 rounded-lg" placeholder="#" />
                                        </div>
                                    </div>

                                    <div className="flex justify-end gap-3 pt-6 border-t">
                                        <button type="button" onClick={() => setViewMode('details')} className="px-6 py-2 border rounded-lg hover:bg-gray-50 font-medium">Cancel</button>
                                        <button type="submit" className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-800 font-bold shadow-lg hover:shadow-xl transition-all">
                                            Save Changes
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            )
            }
        </div >
    );
};

export default Projects;
