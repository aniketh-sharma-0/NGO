import { FaUsers, FaTasks, FaHandHoldingHeart, FaCheck, FaTimes, FaPlus, FaSearch, FaTrash, FaEdit, FaInbox, FaEnvelope, FaArrowRight } from 'react-icons/fa';
import CMSIconButton from '../components/common/CMSIconButton';
import Modal from '../components/common/Modal';
import useBodyScrollLock from '../hooks/useBodyScrollLock';
import { useAuth } from '../context/AuthContext';
import { useCMS } from '../context/CMSContext';
import { useUI } from '../context/UIContext';
import api, { API_URL } from '../utils/api';
import React, { useState, useEffect } from 'react';

const Dashboard = () => {
    const { user } = useAuth();
    const { isEditMode } = useCMS();
    const { unreadCount, fetchUnreadCount } = useUI();
    const isAdmin = user?.role?.name === 'Admin';
    const [activeTab, setActiveTab] = useState('Overview');
    const [loading, setLoading] = useState(false);

    // Data States
    const [volunteers, setVolunteers] = useState([]);
    const [donations, setDonations] = useState([]);
    const [intents, setIntents] = useState([]);
    const [messages, setMessages] = useState([]);

    // Task Assignment Modal
    const [selectedVolunteer, setSelectedVolunteer] = useState(null);
    const [taskForm, setTaskForm] = useState({ title: '', description: '', dueDate: '', assignedHours: 1 });
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    
    // Volunteer Tasks Viewer
    const [selectedVolunteerTasks, setSelectedVolunteerTasks] = useState([]);
    const [isVolunteerTasksModalOpen, setIsVolunteerTasksModalOpen] = useState(false);
    const [expandedTaskId, setExpandedTaskId] = useState(null);

    // Chatbot Modal
    const [isBotModalOpen, setIsBotModalOpen] = useState(false);
    const [botForm, setBotForm] = useState({ keywords: '', question: '', answer: '', category: 'General', id: null });

    // Donation Modal
    const [selectedDonation, setSelectedDonation] = useState(null);
    const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);

    // Message Modal
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);

    const [activeActionId, setActiveActionId] = useState(null);

    useEffect(() => {
        const handleClickOutside = () => setActiveActionId(null);
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    const openDonationModal = (donation) => {
        setSelectedDonation(donation);
        setIsDonationModalOpen(true);
    };

    const openMessageModal = async (msg) => {
        setSelectedMessage(msg);
        setIsMessageModalOpen(true);
        if (msg.status === 'New') {
            try {
                // Mark as read in backend
                await api.put(`/contact/${msg._id}/read`);
                fetchData(); // refresh list to show it as read
                fetchUnreadCount(); // update the dot globally
            } catch (error) {
                console.error('Failed to mark message as read', error);
            }
        }
    };

    const handleDeleteMessage = async (e, id) => {
        e.stopPropagation();
        if (!window.confirm("Are you sure you want to delete this message?")) return;
        try {
            await api.delete(`/contact/${id}`);
            fetchData();
            if (selectedMessage && selectedMessage._id === id) {
                setIsMessageModalOpen(false);
                setSelectedMessage(null);
            }
        } catch (error) {
            console.error('Failed to delete message', error);
            alert('Failed to delete message');
        }
    };

    useEffect(() => {
        if (isAdmin) {
            fetchData();
        }
    }, [isAdmin, activeTab]);

    const fetchData = async () => {
        setLoading(true);
        try {
            // In Overview, we want to fetch everything to show accurate counts
            const fetchAll = activeTab === 'Overview';

            if (activeTab === 'Volunteers' || fetchAll) {
                const res = await api.get('/admin/volunteers');
                setVolunteers(res.data);
            }
            if (activeTab === 'Donations' || fetchAll) {
                const res = await api.get('/donations');
                setDonations(res.data);
            }
            if (activeTab === 'Chatbot' || fetchAll) {
                const res = await api.get('/chat/intents');
                setIntents(res.data);
            }
            if (activeTab === 'Inbox' || fetchAll) {
                const res = await api.get('/contact');
                setMessages(res.data);
                fetchUnreadCount();
            }
        } catch (error) {
            console.error("Fetch error", error);
        } finally {
            setLoading(false);
        }
    };


    const handleVerifyVolunteer = async (id, status) => {
        if (!window.confirm(`Are you sure you want to ${status.toLowerCase()} this volunteer?`)) return;
        try {
            await api.put(`/admin/volunteers/${id}/verify`, { status });
            alert(`Volunteer ${status.toLowerCase()} successfully`);
            fetchData(); // Refresh
            // If viewing this volunteer in modal, update selectedVolunteer state locally
            if (selectedVolunteer && selectedVolunteer._id === id) {
                setSelectedVolunteer({ ...selectedVolunteer, status });
            }
        } catch (error) {
            alert('Action failed');
        }
    };

    const handleVerifyDonation = async (id, status) => {
        if (!window.confirm(`Are you sure you want to ${status.toLowerCase()} this donation enquiry?`)) return;
        try {
            await api.put(`/donations/${id}/status`, { status });
            alert(`Donation enquiry ${status.toLowerCase()} successfully`);
            fetchData(); // Refresh
            setIsDonationModalOpen(false);
        } catch (error) {
            alert('Action failed');
        }
    };

    const handleVerifyTask = async (taskId, status) => {
        if (!window.confirm(`Are you sure you want to ${status.toLowerCase()} this task submission?`)) return;
        try {
            await api.put(`/admin/volunteers/tasks/${taskId}/status`, { status });
            alert(`Task ${status.toLowerCase()} successfully`);
            // Refresh volunteer tasks
            if (selectedVolunteer) {
                handleViewVolunteerDetails(selectedVolunteer);
            }
            fetchData(); // For stats update
        } catch (error) {
            alert('Task verification failed');
        }
    };

    const handleAssignTask = async (e) => {
        e.preventDefault();
        try {
            await api.post(`/admin/volunteers/${selectedVolunteer._id}/assign`, {
                taskId: Date.now().toString(),
                description: taskForm.description,
                title: taskForm.title,
                dueDate: taskForm.dueDate,
                assignedHours: Number(taskForm.assignedHours) || 1
            });
            alert('Task Assigned Successfully');
            // Refresh tasks list for the selected volunteer
            handleViewVolunteerDetails(selectedVolunteer);
            setTaskForm({ title: '', description: '', dueDate: '', assignedHours: 1 });
        } catch (error) {
            alert('Failed to assign task');
        }
    };

    const handleSaveIntent = async (e) => {
        e.preventDefault();
        try {
            if (botForm.id) {
                // Update
                await api.put(`/chat/intents/${botForm.id}`, botForm);
            } else {
                // Create
                await api.post('/chat/intents', botForm);
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
            await api.delete(`/chat/intents/${id}`);
            fetchData();
        } catch (error) {
            alert('Failed to delete');
        }
    };

    const openTaskModal = (vol) => {
        setSelectedVolunteer(vol);
        setIsTaskModalOpen(true);
    };

    const handleViewVolunteerDetails = async (vol) => {
        if (!vol || !vol._id) {
            alert('Invalid volunteer data selected');
            return;
        }
        setSelectedVolunteer(vol);
        const fetchUrl = `/admin/volunteers/tasks/list/${vol._id}`;
        try {
            const res = await api.get(fetchUrl);
            setSelectedVolunteerTasks(res.data);
            setIsVolunteerTasksModalOpen(true);
        } catch (error) {
            console.error('Fetch volunteer details error:', error);
            const msg = error.response?.data?.message || error.message || 'Unknown error';
            const fullUrl = `${api.defaults.baseURL}${fetchUrl}`;
            alert(`Failed to fetch volunteer details.\n\nURL: ${fullUrl}\nStatus: ${error.response?.status || 'N/A'}\nError: ${msg}\n\nPlease ensure the backend is correctly deployed.`);
        }
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
                    {['Overview', 'Inbox', 'Volunteers', 'Donations', 'Chatbot'].map(tab => {
                        let badgeCount = 0;
                        if (tab === 'Inbox') badgeCount = unreadCount;
                        if (tab === 'Volunteers') badgeCount = volunteers.filter(v => v.status === 'Pending').length;
                        if (tab === 'Donations') badgeCount = donations.filter(d => d.status === 'Pending').length;

                        return (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`w-full text-left px-5 py-3.5 rounded-xl transition-all font-bold flex items-center justify-between ${activeTab === tab
                                    ? 'bg-gray-900 text-white shadow-lg shadow-gray-200 transform scale-105'
                                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    {tab === 'Overview' && <FaSearch className="text-sm opacity-50" />} 
                                    {tab === 'Inbox' && <FaInbox className="text-sm opacity-50" />}
                                    {tab === 'Volunteers' && <FaUsers className="text-sm opacity-50" />}
                                    {tab === 'Donations' && <FaHandHoldingHeart className="text-sm opacity-50" />}
                                    {tab === 'Chatbot' && <FaTasks className="text-sm opacity-50" />}
                                    {tab === 'Donations' ? 'Enquiries' : tab}
                                </div>

                                {badgeCount > 0 && (
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${activeTab === tab ? 'bg-blue-500 text-white' : 'bg-blue-100 text-blue-600'}`}>
                                        {badgeCount} {tab === 'Inbox' ? 'New' : 'Pending'}
                                    </span>
                                )}
                            </button>
                        );
                    })}
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
                                <span className={`text-xs font-bold px-2 py-1 rounded bg-green-100 text-green-700`}>Approved</span>
                            </div>
                            <div>
                                <h3 className="text-4xl font-bold text-gray-900 mb-1">{volunteers.filter(v => v.status === 'Approved').length}</h3>
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

                {activeTab === 'Inbox' && (
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <h2 className="text-xl font-bold text-gray-900 font-heading">Messages</h2>
                            <div className="text-sm text-gray-500 font-medium">
                                {messages.filter(m => m.status === 'New').length} Unread
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-white border-b border-gray-100">
                                    <tr>
                                        <th className="p-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Sender</th>
                                        <th className="p-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Subject / Type</th>
                                        <th className="p-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Date</th>
                                        <th className="p-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                                        <th className="p-5 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {messages.map(msg => (
                                        <tr key={msg._id} className={`hover:bg-blue-50/30 transition-colors cursor-pointer ${msg.status === 'New' ? 'bg-blue-50/10' : ''}`} onClick={() => openMessageModal(msg)}>
                                            <td className="p-5">
                                                <div className={`font-medium ${msg.status === 'New' ? 'text-gray-900 font-bold' : 'text-gray-700'}`}>{msg.name}</div>
                                                <div className="text-xs text-gray-500">{msg.email}</div>
                                            </td>
                                            <td className="p-5">
                                                <div className={`text-sm ${msg.status === 'New' ? 'text-gray-900 font-bold' : 'text-gray-600'}`}>{msg.subject}</div>
                                                <div className="text-xs text-gray-400">{msg.inquiryType} {msg.organization ? `(${msg.organization})` : ''}</div>
                                            </td>
                                            <td className="p-5 text-sm text-gray-500">{new Date(msg.createdAt).toLocaleDateString()}</td>
                                            <td className="p-5">
                                                {msg.status === 'New' ? (
                                                    <span className="bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 w-max">
                                                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></span> New
                                                    </span>
                                                ) : (
                                                    <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                                                        {msg.status}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="p-5 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button className="text-blue-600 hover:text-blue-800 transition-colors font-bold text-sm bg-blue-50 px-4 py-2 rounded-lg">Read</button>
                                                    <CMSIconButton 
                                                        icon={FaTrash}
                                                        onClick={(e) => handleDeleteMessage(e, msg._id)}
                                                        title="Delete"
                                                        variant="danger-light"
                                                        className="!min-w-[38px] !min-h-[38px] !shadow-none"
                                                        size={14}
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {messages.length === 0 && (
                                        <tr>
                                            <td colSpan="5" className="p-12 text-center text-gray-400">
                                                <FaInbox className="text-4xl mx-auto mb-3 opacity-20" />
                                                <p>No messages in your inbox.</p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
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
                                        <th className="p-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Stats</th>
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
                                            <td className="p-6 text-sm">
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-gray-900 font-bold text-xs"><span className="text-gray-500 uppercase tracking-wider">Hrs:</span> {vol.totalHours || 0}</span>
                                                    <span className="text-gray-900 font-bold text-xs"><span className="text-gray-500 uppercase tracking-wider">Tasks:</span> {vol.completedTasks || 0}</span>
                                                </div>
                                            </td>
                                            <td className="p-6">
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide
                                                    ${vol.status === 'Approved' ? 'bg-green-100 text-green-700' :
                                                        vol.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                                                            'bg-yellow-100 text-yellow-700'} w-max block`}>
                                                    {vol.status}
                                                </span>
                                            </td>
                                            <td className="p-6 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button onClick={() => handleViewVolunteerDetails(vol)} className="bg-blue-50 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100 text-xs font-bold shadow-sm transition-all border border-blue-100">
                                                        View Details
                                                    </button>
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
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide
                                                    ${don.status === 'Approved' ? 'bg-green-100 text-green-700' :
                                                        don.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                                                            'bg-yellow-100 text-yellow-700'} w-max block`}
                                                >
                                                    {don.status}
                                                </span>
                                            </td>
                                            <td className="p-6 text-right">
                                                <div className="flex justify-end gap-2 items-center">
                                                    <button onClick={() => openDonationModal(don)} className="text-gray-400 hover:text-blue-600 transition-colors font-bold text-sm bg-gray-50 px-3 py-1.5 rounded-lg">View</button>
                                                </div>
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
                                            <CMSIconButton 
                                                icon={FaEdit}
                                                onClick={() => openBotModal(intent)}
                                                title="Edit FAQ"
                                                variant="default"
                                                className="!min-w-[40px] !min-h-[40px]"
                                                size={14}
                                            />
                                            <CMSIconButton 
                                                icon={FaTrash}
                                                onClick={() => handleDeleteIntent(intent._id)}
                                                title="Delete FAQ"
                                                variant="danger-light"
                                                className="!min-w-[40px] !min-h-[40px]"
                                                size={14}
                                            />
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
            {/* Volunteer Details & Task History Modal - Rendered via Portal */}
            <Modal
                isOpen={isVolunteerTasksModalOpen}
                onClose={() => setIsVolunteerTasksModalOpen(false)}
                title={`Volunteer: ${selectedVolunteer?.user?.name}`}
                maxWidth="max-w-6xl"
            >
                <div className="flex flex-col md:flex-row gap-8 min-h-[500px]">
                    {/* Left Column: Profile & Management */}
                    <div className="w-full md:w-80 space-y-8 flex-shrink-0 sticky top-0 h-fit">
                        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 space-y-6">
                            <h4 className="font-bold text-gray-900 uppercase tracking-widest text-[10px]">Applicant Profile</h4>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 border-b border-gray-200/50 pb-1 mb-2 uppercase tracking-widest">Status</p>
                                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider inline-block
                                        ${selectedVolunteer?.status === 'Approved' ? 'bg-green-100 text-green-700' :
                                        selectedVolunteer?.status === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                        {selectedVolunteer?.status}
                                    </span>
                                </div>
                                <div className="grid grid-cols-1 gap-4">
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Contact</p>
                                        <p className="text-sm font-bold text-gray-900 truncate">{selectedVolunteer?.user?.email}</p>
                                        <p className="text-sm text-gray-500">{selectedVolunteer?.phone || 'No Phone'}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Availability</p>
                                        <p className="text-sm font-medium text-gray-900">{selectedVolunteer?.availability}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {selectedVolunteer?.status === 'Pending' && (
                            <div className="bg-blue-50/30 rounded-2xl p-6 border border-blue-100/50 space-y-3">
                                <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-2">Management Actions</p>
                                <button onClick={() => handleVerifyVolunteer(selectedVolunteer._id, 'Approved')} className="w-full py-3 bg-white text-green-600 border border-green-100 hover:bg-green-50 font-bold rounded-xl transition-all shadow-sm flex items-center justify-center gap-2">
                                    <FaCheck /> Approve
                                </button>
                                <button onClick={() => handleVerifyVolunteer(selectedVolunteer._id, 'Rejected')} className="w-full py-3 bg-white text-red-500 border border-red-100 hover:bg-red-50 font-bold rounded-xl transition-all shadow-sm flex items-center justify-center gap-2">
                                    <FaTimes /> Reject
                                </button>
                            </div>
                        )}

                        {selectedVolunteer?.status === 'Approved' && (
                            <div className="bg-gray-900 rounded-2xl p-6 shadow-xl space-y-4">
                                <h4 className="font-bold text-white uppercase tracking-widest text-[10px]">Assign New Task</h4>
                                <form onSubmit={handleAssignTask} className="space-y-3">
                                    <input className="w-full bg-white/10 border border-white/10 p-3 text-sm rounded-xl focus:ring-1 focus:ring-white/30 outline-none text-white placeholder:text-gray-500" value={taskForm.title} onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })} required placeholder="Task Title" />
                                    <textarea className="w-full bg-white/10 border border-white/10 p-3 text-sm rounded-xl h-24 focus:ring-1 focus:ring-white/30 outline-none text-white placeholder:text-gray-500 resize-none" value={taskForm.description} onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })} required placeholder="Task details..." />
                                    <div className="grid grid-cols-2 gap-2">
                                        <input type="date" className="w-full bg-white/10 border border-white/10 p-3 text-xs rounded-xl text-white outline-none" value={taskForm.dueDate} onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })} />
                                        <input type="number" min="0.5" step="0.5" className="w-full bg-white/10 border border-white/10 p-3 text-xs rounded-xl text-white outline-none" value={taskForm.assignedHours} required placeholder="Hrs" onChange={(e) => setTaskForm({ ...taskForm, assignedHours: e.target.value })} />
                                    </div>
                                    <button type="submit" className="w-full py-3 bg-white text-gray-900 font-bold rounded-xl hover:bg-gray-100 transition-all text-sm shadow-lg active:scale-[0.98]">
                                        Deliver Task
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>

                    {/* Right Column: Task History & Submissions */}
                    <div className="flex-1 space-y-6">
                        <div className="flex justify-between items-center bg-gray-50 p-4 rounded-2xl border border-gray-100 mb-6 transition-all">
                            <h4 className="font-bold text-gray-900 uppercase tracking-widest text-[10px]">Activity & Submissions</h4>
                            <span className="text-[10px] font-bold text-gray-400">{selectedVolunteerTasks.length} Tasks Total</span>
                        </div>
                        
                        <div className="grid grid-cols-1 gap-6 pr-2">
                            {selectedVolunteerTasks.length === 0 ? (
                                <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-100">
                                    <p className="text-gray-400 font-medium">No tasks assigned yet.</p>
                                </div>
                            ) : (
                                [...selectedVolunteerTasks].map(task => (
                                    <div 
                                        key={task._id} 
                                        className={`bg-white border rounded-3xl p-6 shadow-sm hover:shadow-md transition-[border-color,box-shadow,ring] relative overflow-hidden group cursor-pointer ${expandedTaskId === task._id ? 'border-blue-200 ring-1 ring-blue-50' : 'border-gray-100'}`}
                                        onClick={() => setExpandedTaskId(expandedTaskId === task._id ? null : task._id)}
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h4 className="font-bold text-gray-900 text-lg group-hover:text-blue-600 transition-colors flex items-center gap-2">
                                                    {task.title}
                                                    {task.submissionText && <span className="w-2 h-2 rounded-full bg-blue-500" title="Has Submission"></span>}
                                                </h4>
                                                <div className="flex gap-4 mt-1">
                                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Hrs: {task.assignedHours}</span>
                                                    {task.dueDate && <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Due: {new Date(task.dueDate).toLocaleDateString()}</span>}
                                                </div>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-sm
                                            ${task.status === 'Completed' || task.status === 'Approved' ? 'bg-green-100 text-green-700' :
                                                    task.status === 'Pending' || task.status === 'Assigned' ? 'bg-blue-50 text-blue-600' : 
                                                    task.status === 'Submitted' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600'}`}>
                                                {task.status}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-600 mb-2 leading-relaxed line-clamp-2">{task.description}</p>

                                        {expandedTaskId === task._id && (
                                            <div className="animate-fade-in space-y-4 mt-4 pt-4 border-t border-gray-50">
                                                <div className="bg-gray-50/50 p-4 rounded-2xl space-y-3">
                                                    <p className="text-xs text-gray-500 font-medium">Full Description:</p>
                                                    <p className="text-sm text-gray-700 leading-relaxed">{task.description}</p>
                                                </div>

                                                {(task.submissionText || task.submissionImage) ? (
                                                    <div className="bg-blue-50/30 rounded-2xl p-6 border border-blue-100/30 space-y-4">
                                                        <div className="flex justify-between items-center">
                                                            <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Submission Report</p>
                                                            <p className="text-[9px] text-gray-400 font-medium">{task.submittedAt ? new Date(task.submittedAt).toLocaleString() : 'Date N/A'}</p>
                                                        </div>
                                                        {task.submissionText && (
                                                            <div className="text-sm text-gray-800 whitespace-pre-wrap font-medium leading-relaxed italic border-l-2 border-blue-200 pl-4 py-1">
                                                                "{task.submissionText}"
                                                            </div>
                                                        )}
                                                        {task.submissionImage && (
                                                            <div className="pt-2">
                                                                <a 
                                                                    href={`${task.submissionImage.startsWith('http') ? task.submissionImage : `${API_URL}${task.submissionImage}`}?t=${new Date().getTime()}`} 
                                                                    target="_blank" 
                                                                    rel="noopener noreferrer"
                                                                    className="flex items-center gap-3 bg-white p-4 rounded-2xl border border-blue-100 hover:border-blue-300 transition-all group shadow-sm w-fit"
                                                                >
                                                                    <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                                                                    </div>
                                                                    <div className="flex flex-col">
                                                                        <span className="text-xs font-bold text-gray-800 tracking-wide uppercase">Proof Attachment</span>
                                                                        <span className="text-[10px] text-blue-500 font-bold uppercase tracking-widest">Click to View Image</span>
                                                                    </div>
                                                                </a>
                                                            </div>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <div className="py-4 text-center text-gray-400 italic text-sm">
                                                        No submission data available yet.
                                                    </div>
                                                )}

                                                {task.status === 'Submitted' && (
                                                    <div className="flex gap-3 pt-2">
                                                        <button 
                                                            onClick={(e) => { e.stopPropagation(); handleVerifyTask(task._id, 'Approved'); }}
                                                            className="flex-1 bg-green-600 text-white font-bold py-3 rounded-xl hover:bg-green-700 transition-all text-xs"
                                                        >
                                                            Approve Task
                                                        </button>
                                                        <button 
                                                            onClick={(e) => { e.stopPropagation(); handleVerifyTask(task._id, 'Rejected'); }}
                                                            className="flex-1 bg-red-50 text-red-600 font-bold py-3 rounded-xl hover:bg-red-100 transition-all text-xs"
                                                        >
                                                            Reject Submission
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                        
                                        {!expandedTaskId && (task.submissionText || task.submissionImage) && (
                                            <div className="mt-2 text-[10px] font-bold text-blue-500 uppercase flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                                                Click to view submission <FaArrowRight size={8} />
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </Modal>

            {/* Chatbot Knowledge Modal - Rendered via Portal */}
            <Modal
                isOpen={isBotModalOpen}
                onClose={() => setIsBotModalOpen(false)}
                title={botForm.id ? 'Edit Chatbot Knowledge' : 'Add Chatbot Knowledge'}
                maxWidth="max-w-xl"
            >
                <form onSubmit={handleSaveIntent} className="space-y-6">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">User Question</label>
                            <input
                                className="w-full bg-gray-50 border border-gray-100 p-3 rounded-xl focus:ring-2 focus:ring-gray-900 focus:outline-none transition-all font-medium"
                                value={botForm.question}
                                onChange={(e) => setBotForm({ ...botForm, question: e.target.value })}
                                required
                                placeholder="e.g. How do I donate?"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Bot Answer</label>
                            <textarea
                                className="w-full bg-gray-50 border border-gray-100 p-3 rounded-xl h-40 focus:ring-2 focus:ring-gray-900 focus:outline-none transition-all resize-none custom-scrollbar"
                                value={botForm.answer}
                                onChange={(e) => setBotForm({ ...botForm, answer: e.target.value })}
                                required
                                placeholder="The exact response the bot should give..."
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Keywords</label>
                                <input
                                    className="w-full bg-gray-50 border border-gray-100 p-3 rounded-xl focus:ring-2 focus:ring-gray-900 focus:outline-none transition-all"
                                    value={botForm.keywords}
                                    onChange={(e) => setBotForm({ ...botForm, keywords: e.target.value })}
                                    required
                                    placeholder="donate, money"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Category</label>
                                <select
                                    className="w-full bg-gray-50 border border-gray-100 p-3 rounded-xl focus:ring-2 focus:ring-gray-900 focus:outline-none transition-all outline-none"
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
                    </div>
                    <div className="flex gap-3 pt-4 border-t border-gray-50">
                        <button type="submit" className="flex-1 bg-gray-900 text-white font-bold py-4 rounded-2xl hover:bg-black transition-all shadow-xl active:scale-[0.98]">
                            Save Knowledge
                        </button>
                        <button type="button" onClick={() => setIsBotModalOpen(false)} className="px-8 bg-gray-100 text-gray-600 font-bold py-4 rounded-2xl hover:bg-gray-200 transition-all">
                            Cancel
                        </button>
                    </div>
                </form>
            </Modal>
            {/* Donation Enquiry Modal - Rendered via Portal */}
            <Modal
                isOpen={isDonationModalOpen}
                onClose={() => setIsDonationModalOpen(false)}
                title="Donation Enquiry"
                maxWidth="max-w-lg"
            >
                <div className="space-y-8">
                    <div className="text-center">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Enquiry Status</p>
                        <span className={`inline-block px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider
                            ${selectedDonation?.status === 'Approved' ? 'bg-green-100 text-green-700' : 
                              selectedDonation?.status === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                            {selectedDonation?.status}
                        </span>
                    </div>

                    <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 space-y-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Donor Details</label>
                                <p className="text-gray-900 font-bold text-xl">{selectedDonation?.name}</p>
                            </div>
                            <div className="text-right">
                                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Received On</label>
                                <p className="text-gray-900 font-bold text-sm">{selectedDonation?.createdAt && new Date(selectedDonation.createdAt).toLocaleDateString('en-GB')}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-y-4 gap-x-6 pt-4 border-t border-gray-200/50 text-sm">
                            <div>
                                <span className="text-gray-400 block text-[10px] font-bold uppercase tracking-widest mb-1">Email</span>
                                <span className="text-gray-900 font-medium">{selectedDonation?.email}</span>
                            </div>
                            <div>
                                <span className="text-gray-400 block text-[10px] font-bold uppercase tracking-widest mb-1">Phone</span>
                                <span className="text-gray-900 font-medium">{selectedDonation?.phone || 'N/A'}</span>
                            </div>
                            <div>
                                <span className="text-gray-400 block text-[10px] font-bold uppercase tracking-widest mb-1">PAN</span>
                                <span className="text-gray-900 font-medium">{selectedDonation?.pan || 'N/A'}</span>
                            </div>
                            <div>
                                <span className="text-gray-400 block text-[10px] font-bold uppercase tracking-widest mb-1">Category</span>
                                <span className="text-gray-900 font-medium">{selectedDonation?.category}</span>
                            </div>
                        </div>
                    </div>

                    {selectedDonation?.message && (
                        <div className="p-6 bg-blue-50/30 rounded-2xl border border-blue-100/50">
                            <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-2">Message from Donor</p>
                            <p className="text-gray-700 text-sm italic leading-relaxed">"{selectedDonation.message}"</p>
                        </div>
                    )}

                    {selectedDonation?.status === 'Pending' && (
                        <div className="flex gap-4">
                            <button 
                                onClick={() => handleVerifyDonation(selectedDonation._id, 'Approved')}
                                className="flex-1 bg-green-50 text-green-600 font-bold py-4 rounded-2xl hover:bg-green-100 transition-all flex items-center justify-center gap-2"
                            >
                                <FaCheck /> Approve
                            </button>
                            <button 
                                onClick={() => handleVerifyDonation(selectedDonation._id, 'Rejected')}
                                className="flex-1 bg-red-50 text-red-600 font-bold py-4 rounded-2xl hover:bg-red-100 transition-all flex items-center justify-center gap-2"
                            >
                                <FaTimes /> Reject
                            </button>
                        </div>
                    )}

                    <button onClick={() => setIsDonationModalOpen(false)} className="w-full bg-gray-900 text-white font-bold py-4 rounded-2xl hover:bg-black transition-all shadow-xl">
                        Back to List
                    </button>
                </div>
            </Modal>

            {/* Message Details Modal - Rendered via Portal */}
            <Modal
                isOpen={isMessageModalOpen}
                onClose={() => setIsMessageModalOpen(false)}
                title="Message Details"
                maxWidth="max-w-2xl"
            >
                <div className="space-y-8">
                    <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
                        <div className="flex flex-col sm:flex-row justify-between items-start gap-6 pb-6 border-b border-gray-200/50">
                            <div>
                                <h4 className="text-2xl font-bold text-gray-900 mb-2 leading-tight">{selectedMessage?.subject}</h4>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center font-bold text-xs">
                                        {selectedMessage?.name?.charAt(0)}
                                    </div>
                                    <div className="text-sm">
                                        <p className="font-bold text-gray-900">{selectedMessage?.name}</p>
                                        <a href={`mailto:${selectedMessage?.email}`} className="text-gray-500 hover:text-gray-900 transition-colors">{selectedMessage?.email}</a>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col sm:items-end gap-3 self-stretch sm:self-auto">
                                <span className="text-xs font-bold text-gray-400">{selectedMessage?.createdAt && new Date(selectedMessage.createdAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}</span>
                                <span className="bg-white border border-gray-200 text-gray-600 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-sm">
                                    {selectedMessage?.inquiryType}
                                </span>
                            </div>
                        </div>

                        <div className="py-8">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Message Snippet</p>
                            <div className="text-gray-800 text-lg leading-relaxed whitespace-pre-wrap font-medium">
                                {selectedMessage?.message}
                            </div>
                        </div>

                        {(selectedMessage?.phone || selectedMessage?.organization) && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-8 border-t border-gray-200/50">
                                {selectedMessage?.phone && (
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Phone Number</p>
                                        <a href={`tel:${selectedMessage.phone}`} className="text-gray-900 font-bold hover:text-blue-600 transition-colors flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                            {selectedMessage.phone}
                                        </a>
                                    </div>
                                )}
                                {selectedMessage?.organization && (
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Organization</p>
                                        <p className="text-gray-900 font-bold flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                                            {selectedMessage.organization}
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="flex gap-4">
                        <button onClick={(e) => handleDeleteMessage(e, selectedMessage?._id)} className="flex-1 bg-red-50 text-red-600 font-bold py-4 rounded-2xl hover:bg-red-100 transition-all active:scale-[0.98]">
                            Delete Message
                        </button>
                        <button onClick={() => setIsMessageModalOpen(false)} className="flex-1 bg-gray-900 text-white font-bold py-4 rounded-2xl hover:bg-black transition-all shadow-xl active:scale-[0.98]">
                            Close Window
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );

};

export default Dashboard;
