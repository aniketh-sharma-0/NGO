import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useCMS } from '../context/CMSContext';
import { FaUsers, FaTasks, FaHandHoldingHeart, FaCheck, FaTimes, FaPlus, FaSearch, FaTrash, FaEdit } from 'react-icons/fa';

const Dashboard = () => {
    const { user } = useAuth();
    const { isEditMode } = useCMS();
    const isAdmin = user?.role?.name === 'Admin';
    const [activeTab, setActiveTab] = useState('Overview');
    const [loading, setLoading] = useState(false);

    // Data States
    const [volunteers, setVolunteers] = useState([]);
    const [donations, setDonations] = useState([]);
    const [intents, setIntents] = useState([]);

    // Task Assignment Modal
    const [selectedVolunteer, setSelectedVolunteer] = useState(null);
    const [taskForm, setTaskForm] = useState({ title: '', description: '', dueDate: '' });
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

    // Chatbot Modal
    const [isBotModalOpen, setIsBotModalOpen] = useState(false);
    const [botForm, setBotForm] = useState({ keywords: '', question: '', answer: '', category: 'General', id: null });

    // Donation Modal
    const [selectedDonation, setSelectedDonation] = useState(null);
    const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);

    const openDonationModal = (donation) => {
        setSelectedDonation(donation);
        setIsDonationModalOpen(true);
    };

    useEffect(() => {
        if (isAdmin) {
            fetchData();
        }
    }, [isAdmin, activeTab]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            if (activeTab === 'Volunteers' || activeTab === 'Overview') {
                const res = await axios.get('/api/admin/volunteers', config);
                setVolunteers(res.data);
            }
            if (activeTab === 'Donations' || activeTab === 'Overview') {
                const res = await axios.get('/api/donations', config);
                setDonations(res.data);
            }
            if (activeTab === 'Chatbot') {
                const res = await axios.get('/api/chat/intents', config);
                setIntents(res.data);
            }
        } catch (error) {
            console.error("Fetch error", error);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyVolunteer = async (id, status) => {
        if (!window.confirm(`Are you sure you want to ${status} this volunteer?`)) return;
        try {
            const token = localStorage.getItem('token');
            await axios.put(`/api/admin/volunteers/${id}/verify`, { status }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchData(); // Refresh
        } catch (error) {
            alert('Action failed');
        }
    };

    const handleAssignTask = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post(`/api/admin/volunteers/${selectedVolunteer._id}/assign`, {
                ...taskForm,
                projectId: null // Optional logic to link project later
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Task Assigned Successfully');
            setIsTaskModalOpen(false);
            setTaskForm({ title: '', description: '', dueDate: '' });
        } catch (error) {
            alert('Failed to assign task');
        }
    };

    const handleSaveIntent = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            if (botForm.id) {
                // Update
                await axios.put(`/api/chat/intents/${botForm.id}`, botForm, config);
            } else {
                // Create
                await axios.post('/api/chat/intents', botForm, config);
            }
            fetchData();
            setIsBotModalOpen(false);
            setBotForm({ keywords: '', question: '', answer: '', category: 'General', id: null });
        } catch (error) {
            alert('Operation failed');
        }
    };

    const handleDeleteIntent = async (id) => {
        if (!window.confirm("Delete this FAQ?")) return;
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`/api/chat/intents/${id}`, { headers: { Authorization: `Bearer ${token}` } },);
            fetchData();
        } catch (error) {
            alert('Failed to delete');
        }
    };

    const openTaskModal = (vol) => {
        setSelectedVolunteer(vol);
        setIsTaskModalOpen(true);
    };

    const openBotModal = (intent = null) => {
        if (intent) {
            setBotForm({
                keywords: intent.keywords.join(', '),
                question: intent.question,
                answer: intent.answer,
                category: intent.category,
                id: intent._id
            });
        } else {
            setBotForm({ keywords: '', question: '', answer: '', category: 'General', id: null });
        }
        setIsBotModalOpen(true);
    };

    if (!isAdmin) {
        return (
            <div className="container mx-auto p-10 text-center">
                <h1 className="text-2xl font-bold">Access Denied</h1>
                <p>Only admins can view this dashboard.</p>
            </div>
        );
    }

    return (
        <div className="h-screen overflow-hidden bg-gray-50 flex font-sans">
            {/* Sidebar */}
            <div className="w-72 bg-white shadow-xl hidden md:flex flex-col z-10 h-full">
                <div className="p-8 border-b border-gray-100">
                    <h2 className="text-2xl font-bold text-gray-800 font-heading tracking-tight">Admin <span className="text-blue-600">Panel</span></h2>
                    <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider font-bold">Management Suite</p>
                </div>
                <nav className="flex-1 p-6 space-y-2">
                    {['Overview', 'Volunteers', 'Donations', 'Chatbot'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`w-full text-left px-5 py-3.5 rounded-xl transition-all font-bold flex items-center gap-3 ${activeTab === tab
                                ? 'bg-gray-900 text-white shadow-lg shadow-gray-200 transform scale-105'
                                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                                }`}
                        >
                            {tab === 'Overview' && <FaSearch className="text-sm opacity-50" />} {/* Placeholder Icon */}
                            {tab === 'Volunteers' && <FaUsers className="text-sm opacity-50" />}
                            {tab === 'Donations' && <FaHandHoldingHeart className="text-sm opacity-50" />}
                            {tab === 'Chatbot' && <FaTasks className="text-sm opacity-50" />}
                            {tab === 'Donations' ? 'Enquiries' : tab}
                        </button>
                    ))}
                </nav>
                <div className="p-6 border-t border-gray-100">
                    <div className="bg-blue-50 rounded-xl p-4 flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                            {user.name.charAt(0)}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-bold text-gray-900 truncate">{user.name}</p>
                            <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-8 md:p-12 h-full overflow-y-auto pb-24 bg-gray-50/50">
                <header className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900 font-heading">{activeTab}</h1>
                        <p className="text-gray-500 mt-1">
                            {activeTab === 'Overview' ? 'Welcome back! Here is what’s happening today.' : `Manage your ${activeTab.toLowerCase()} efficiently.`}
                        </p>
                    </div>
                    {/* Placeholder for global actions or date */}
                    <div className="hidden md:block text-sm font-bold text-gray-400 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100">
                        {new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                </header>

                {activeTab === 'Overview' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div
                            onClick={() => setActiveTab('Volunteers')}
                            className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 cursor-pointer active:scale-95 transition-transform duration-150"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-gray-100 rounded-xl text-gray-600">
                                    <FaUsers size={24} />
                                </div>
                                <span className={`text-xs font-bold px-2 py-1 rounded bg-green-100 text-green-700`}>Active</span>
                            </div>
                            <div>
                                <h3 className="text-4xl font-bold text-gray-900 mb-1">{volunteers.filter(v => v.status === 'Active').length}</h3>
                                <p className="text-gray-500 font-medium">Volunteers</p>
                            </div>
                        </div>

                        <div
                            onClick={() => setActiveTab('Donations')}
                            className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 cursor-pointer active:scale-95 transition-transform duration-150"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-gray-100 rounded-xl text-gray-600">
                                    <FaHandHoldingHeart size={24} />
                                </div>
                                <span className="text-xs font-bold px-2 py-1 rounded bg-green-100 text-green-700">+12%</span>
                            </div>
                            <div>
                                <h3 className="text-4xl font-bold text-gray-900 mb-1">{donations.length}</h3>
                                <p className="text-gray-500 font-medium">Total Enquiries</p>
                            </div>
                        </div>

                        <div
                            onClick={() => setActiveTab('Chatbot')}
                            className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 cursor-pointer active:scale-95 transition-transform duration-150"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-gray-100 rounded-xl text-gray-600">
                                    <FaTasks size={24} />
                                </div>
                            </div>
                            <div>
                                <h3 className="text-4xl font-bold text-gray-900 mb-1">{intents.length}</h3>
                                <p className="text-gray-500 font-medium">Chatbot Intents</p>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'Volunteers' && (
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-gray-50 border-b border-gray-100">
                                    <tr>
                                        <th className="p-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Name</th>
                                        <th className="p-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Skills</th>
                                        <th className="p-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="p-6 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {volunteers.map(vol => (
                                        <tr key={vol._id} className="hover:bg-blue-50/30 transition-colors group">
                                            <td className="p-6 font-bold text-gray-900">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-600">
                                                        {vol.user?.name ? vol.user.name.charAt(0) : '?'}
                                                    </div>
                                                    <div>
                                                        <p>{vol.user?.name || 'Unknown'}</p>
                                                        <p className="text-xs text-gray-400 font-normal">{vol.user?.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-6 text-sm text-gray-600">
                                                <div className="flex flex-wrap gap-1">
                                                    {vol.skills.slice(0, 3).map((s, i) => (
                                                        <span key={i} className="px-2 py-0.5 bg-gray-100 rounded text-xs">{s}</span>
                                                    ))}
                                                    {vol.skills.length > 3 && <span className="px-2 py-0.5 bg-gray-100 rounded text-xs">+{vol.skills.length - 3}</span>}
                                                </div>
                                            </td>
                                            <td className="p-6">
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide
                                                    ${vol.status === 'Active' ? 'bg-green-100 text-green-700' :
                                                        vol.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                                                    {vol.status}
                                                </span>
                                            </td>
                                            <td className="p-6 text-right">
                                                <div className="flex justify-end gap-2">
                                                    {vol.status === 'Pending' && (
                                                        <>
                                                            <button onClick={() => handleVerifyVolunteer(vol._id, 'Active')} className="bg-green-100 text-green-600 p-2 rounded-lg hover:bg-green-200 transition-colors" title="Approve">
                                                                <FaCheck />
                                                            </button>
                                                            <button onClick={() => handleVerifyVolunteer(vol._id, 'Inactive')} className="bg-red-100 text-red-600 p-2 rounded-lg hover:bg-red-200 transition-colors" title="Reject">
                                                                <FaTimes />
                                                            </button>
                                                        </>
                                                    )}
                                                    {vol.status === 'Active' && (
                                                        <button onClick={() => openTaskModal(vol)} className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-black text-xs font-bold shadow-md transition-all">
                                                            Assign Task
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'Donations' && (
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-gray-50 border-b border-gray-100">
                                    <tr>
                                        <th className="p-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Donor</th>
                                        <th className="p-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Category</th>
                                        <th className="p-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                                        <th className="p-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="p-6 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {donations.map(don => (
                                        <tr key={don._id} className="hover:bg-blue-50/30 transition-colors">
                                            <td className="p-6">
                                                <div className="font-bold text-gray-900">{don.name}</div>
                                                <div className="text-xs text-gray-500">{don.email}</div>
                                            </td>
                                            {/* Amount Removed */}
                                            <td className="p-6 text-sm text-gray-600">{don.category}</td>
                                            <td className="p-6 text-sm text-gray-500">{new Date(don.createdAt).toLocaleDateString()}</td>
                                            <td className="p-6">
                                                <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                                                    {don.status}
                                                </span>
                                            </td>
                                            <td className="p-6 text-right">
                                                <button onClick={() => openDonationModal(don)} className="text-gray-400 hover:text-blue-600 transition-colors font-bold text-sm">View</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'Chatbot' && (
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 font-heading">Knowledge Base</h2>
                                <p className="text-gray-500">Manage what your AI assistant knows.</p>
                            </div>
                            {isEditMode && (
                                <button onClick={() => openBotModal()} className="bg-gray-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-black transition-all shadow-lg flex items-center gap-2">
                                    <FaPlus /> Add FAQ
                                </button>
                            )}
                        </div>
                        <div className="grid md:grid-cols-2 gap-6">
                            {intents.map(intent => (
                                <div key={intent._id} className="border border-gray-100 p-6 rounded-2xl hover:shadow-lg transition-all relative group bg-gray-50/30 hover:bg-white">
                                    {isEditMode && (
                                        <div className="absolute top-4 right-4 flex gap-2">
                                            <button onClick={() => openBotModal(intent)} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"><FaEdit size={14} /></button>
                                            <button onClick={() => handleDeleteIntent(intent._id)} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"><FaTrash size={14} /></button>
                                        </div>
                                    )}
                                    <h3 className="font-bold text-lg mb-2 text-gray-900 pr-12">{intent.question}</h3>
                                    <div className="text-gray-600 mb-4 text-sm leading-relaxed bg-white p-3 rounded-xl border border-gray-100">
                                        {intent.answer}
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {intent.keywords.map((k, i) => (
                                            <span key={i} className="text-[10px] font-bold uppercase tracking-wider bg-gray-200 text-gray-600 px-2 py-1 rounded-sm">
                                                {k}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Task Assign Modal */}
            {isTaskModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-gray-900">Assign Task</h3>
                            <button onClick={() => setIsTaskModalOpen(false)} className="text-gray-400 hover:text-gray-600"><FaTimes /></button>
                        </div>
                        <form onSubmit={handleAssignTask} className="space-y-5">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Task Title</label>
                                <input
                                    className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none bg-gray-50"
                                    value={taskForm.title}
                                    onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                                    required
                                    placeholder="e.g. Field Survey"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Description</label>
                                <textarea
                                    className="w-full border border-gray-200 p-3 rounded-xl h-28 focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none bg-gray-50 resize-none"
                                    value={taskForm.description}
                                    onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                                    required
                                    placeholder="Details about the task..."
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Due Date</label>
                                <input
                                    type="date"
                                    className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none bg-gray-50"
                                    value={taskForm.dueDate}
                                    onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
                                />
                            </div>
                            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-50">
                                <button type="button" onClick={() => setIsTaskModalOpen(false)} className="px-5 py-2.5 text-gray-600 font-bold hover:bg-gray-50 rounded-lg transition-colors">Cancel</button>
                                <button type="submit" className="px-6 py-2.5 bg-gray-900 text-white font-bold rounded-lg hover:bg-black shadow-lg">Assign Task</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Chatbot Modal */}
            {isBotModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-gray-900">{botForm.id ? 'Edit Knowledge' : 'Add Knowledge'}</h3>
                            <button onClick={() => setIsBotModalOpen(false)} className="text-gray-400 hover:text-gray-600"><FaTimes /></button>
                        </div>
                        <form onSubmit={handleSaveIntent} className="space-y-5">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">User Question</label>
                                <input
                                    className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none bg-gray-50"
                                    value={botForm.question}
                                    onChange={(e) => setBotForm({ ...botForm, question: e.target.value })}
                                    required
                                    placeholder="e.g. How do I donate?"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Bot Answer</label>
                                <textarea
                                    className="w-full border border-gray-200 p-3 rounded-xl h-32 focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none bg-gray-50 resize-none"
                                    value={botForm.answer}
                                    onChange={(e) => setBotForm({ ...botForm, answer: e.target.value })}
                                    required
                                    placeholder="The exact response the bot should give..."
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Keywords</label>
                                    <input
                                        className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none bg-gray-50"
                                        value={botForm.keywords}
                                        onChange={(e) => setBotForm({ ...botForm, keywords: e.target.value })}
                                        required
                                        placeholder="donate, money"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Category</label>
                                    <select
                                        className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none bg-gray-50"
                                        value={botForm.category}
                                        onChange={(e) => setBotForm({ ...botForm, category: e.target.value })}
                                    >
                                        <option value="General">General</option>
                                        <option value="Donation">Donation</option>
                                        <option value="Volunteer">Volunteer</option>
                                        <option value="Project">Project</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-50">
                                <button type="button" onClick={() => setIsBotModalOpen(false)} className="px-5 py-2.5 text-gray-600 font-bold hover:bg-gray-50 rounded-lg transition-colors">Cancel</button>
                                <button type="submit" className="px-6 py-2.5 bg-gray-900 text-white font-bold rounded-lg hover:bg-black shadow-lg">Save Knowledge</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {/* Donation Details Modal */}
            {isDonationModalOpen && selectedDonation && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-0 overflow-hidden transform transition-all">
                        <div className="bg-gray-900 p-6 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-white">Donation Receipt</h3>
                            <button onClick={() => setIsDonationModalOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                                <FaTimes size={20} />
                            </button>
                        </div>
                        <div className="p-8 max-h-[70vh] overflow-y-auto">
                            <div className="text-center mb-8">
                                <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-2">Enquiry Status</p>
                                <span className="inline-block mt-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase">{selectedDonation.status}</span>
                            </div>

                            <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Donor Name</label>
                                        <p className="text-gray-900 font-bold text-lg">{selectedDonation.name}</p>
                                    </div>
                                    <div className="text-right">
                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Date</label>
                                        <p className="text-gray-900 font-medium">{new Date(selectedDonation.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div className="border-t border-gray-100 pt-4">
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <span className="text-gray-500 block">Email</span>
                                            <span className="text-gray-900 font-medium">{selectedDonation.email}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-500 block">Phone</span>
                                            <span className="text-gray-900 font-medium">{selectedDonation.phone || 'N/A'}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-500 block">PAN</span>
                                            <span className="text-gray-900 font-medium">{selectedDonation.pan || 'N/A'}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-500 block">Category</span>
                                            <span className="text-gray-900 font-medium">{selectedDonation.category}</span>
                                        </div>
                                    </div>
                                </div>
                                {selectedDonation.message && (
                                    <div className="bg-gray-50 p-4 rounded-xl">
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Message</p>
                                        <p className="text-gray-700 text-sm italic">"{selectedDonation.message}"</p>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="bg-gray-50 p-4 flex justify-center border-t border-gray-100">
                            <button onClick={() => setIsDonationModalOpen(false)} className="text-gray-500 text-sm font-bold hover:text-gray-900">Close Receipt</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

};

export default Dashboard;
