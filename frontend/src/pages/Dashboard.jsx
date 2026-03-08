import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { useCMS } from '../context/CMSContext';
import { useUI } from '../context/UIContext';
import { FaUsers, FaTasks, FaHandHoldingHeart, FaCheck, FaTimes, FaPlus, FaSearch, FaTrash, FaEdit, FaInbox, FaEnvelope } from 'react-icons/fa';
import useBodyScrollLock from '../hooks/useBodyScrollLock';

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
    const [taskForm, setTaskForm] = useState({ title: '', description: '', dueDate: '' });
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

    // Chatbot Modal
    const [isBotModalOpen, setIsBotModalOpen] = useState(false);
    const [botForm, setBotForm] = useState({ keywords: '', question: '', answer: '', category: 'General', id: null });

    // Donation Modal
    const [selectedDonation, setSelectedDonation] = useState(null);
    const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);

    // Message Modal
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);

    useBodyScrollLock(isTaskModalOpen || isBotModalOpen || isDonationModalOpen || isMessageModalOpen);

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
            if (activeTab === 'Volunteers' || activeTab === 'Overview') {
                const res = await api.get('/admin/volunteers');
                setVolunteers(res.data);
            }
            if (activeTab === 'Donations' || activeTab === 'Overview') {
                const res = await api.get('/donations');
                setDonations(res.data);
            }
            if (activeTab === 'Chatbot') {
                const res = await api.get('/chat/intents');
                setIntents(res.data);
            }
            if (activeTab === 'Inbox' || activeTab === 'Overview') {
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
            fetchData(); // Refresh
        } catch (error) {
            alert('Action failed');
        }
    };

    const handleVerifyDonation = async (id, status) => {
        if (!window.confirm(`Are you sure you want to ${status.toLowerCase()} this donation enquiry?`)) return;
        try {
            await api.put(`/donations/${id}/status`, { status });
            fetchData(); // Refresh
        } catch (error) {
            alert('Action failed');
        }
    };

    const handleAssignTask = async (e) => {
        e.preventDefault();
        try {
            await api.post(`/admin/volunteers/${selectedVolunteer._id}/assign`, {
                taskId: Date.now().toString(),
                description: taskForm.description,
                title: taskForm.title,
                dueDate: taskForm.dueDate
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
                    {['Overview', 'Inbox', 'Volunteers', 'Donations', 'Chatbot'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`w-full text-left px-5 py-3.5 rounded-xl transition-all font-bold flex items-center justify-between ${activeTab === tab
                                ? 'bg-gray-900 text-white shadow-lg shadow-gray-200 transform scale-105'
                                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                {tab === 'Overview' && <FaSearch className="text-sm opacity-50" />} {/* Placeholder Icon */}
                                {tab === 'Inbox' && <FaInbox className="text-sm opacity-50" />}
                                {tab === 'Volunteers' && <FaUsers className="text-sm opacity-50" />}
                                {tab === 'Donations' && <FaHandHoldingHeart className="text-sm opacity-50" />}
                                {tab === 'Chatbot' && <FaTasks className="text-sm opacity-50" />}
                                {tab === 'Donations' ? 'Enquiries' : tab}
                            </div>

                            {tab === 'Inbox' && unreadCount > 0 && (
                                <span className={`text-[10px] px-2 py-0.5 rounded-full ${activeTab === tab ? 'bg-blue-500 text-white' : 'bg-blue-100 text-blue-600'}`}>
                                    {unreadCount} New
                                </span>
                            )}
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
                                                    <button className="text-blue-600 hover:text-blue-800 transition-colors font-bold text-sm bg-blue-50 px-3 py-1.5 rounded-lg">Read</button>
                                                    <button onClick={(e) => handleDeleteMessage(e, msg._id)} className="text-red-500 hover:text-red-700 transition-colors bg-red-50 p-2 rounded-lg" title="Delete">
                                                        <FaTrash size={14} />
                                                    </button>
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
                                                    ${vol.status === 'Approved' ? 'bg-green-100 text-green-700' :
                                                        vol.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                                                    {vol.status}
                                                </span>
                                            </td>
                                            <td className="p-6 text-right">
                                                <div className="flex justify-end gap-2">
                                                    {vol.status === 'Pending' && (
                                                        <>
                                                            <button onClick={() => handleVerifyVolunteer(vol._id, 'Approved')} className="bg-green-100 text-green-600 p-2 rounded-lg hover:bg-green-200 transition-colors" title="Approve">
                                                                <FaCheck />
                                                            </button>
                                                            <button onClick={() => handleVerifyVolunteer(vol._id, 'Rejected')} className="bg-red-100 text-red-600 p-2 rounded-lg hover:bg-red-200 transition-colors" title="Reject">
                                                                <FaTimes />
                                                            </button>
                                                        </>
                                                    )}
                                                    {vol.status === 'Approved' && (
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
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide
                                                    ${don.status === 'Approved' ? 'bg-green-100 text-green-700' :
                                                        don.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                                                            don.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                                                                'bg-blue-100 text-blue-700'}`}>
                                                    {don.status}
                                                </span>
                                            </td>
                                            <td className="p-6 text-right">
                                                <div className="flex justify-end gap-2 items-center">
                                                    {don.status === 'Pending' && (
                                                        <div className="flex gap-2 mr-2">
                                                            <button onClick={() => handleVerifyDonation(don._id, 'Approved')} className="bg-green-100 text-green-600 p-2 rounded-lg hover:bg-green-200 transition-colors" title="Approve">
                                                                <FaCheck />
                                                            </button>
                                                            <button onClick={() => handleVerifyDonation(don._id, 'Rejected')} className="bg-red-100 text-red-600 p-2 rounded-lg hover:bg-red-200 transition-colors" title="Reject">
                                                                <FaTimes />
                                                            </button>
                                                        </div>
                                                    )}
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

            {/* Message Details Modal */}
            {isMessageModalOpen && selectedMessage && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-0 overflow-hidden transform transition-all flex flex-col max-h-[90vh]">
                        <div className="bg-blue-900 p-5 sm:p-6 flex justify-between items-center flex-shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-blue-100">
                                    <FaEnvelope size={18} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white leading-tight">Message Details</h3>
                                    <p className="text-blue-200 text-xs">Direct Inquiry</p>
                                </div>
                            </div>
                            <button onClick={() => setIsMessageModalOpen(false)} className="text-blue-200 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors">
                                <FaTimes size={16} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 sm:p-8 bg-gray-50">
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
                                <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4 mb-6 pb-6 border-b border-gray-100">
                                    <div>
                                        <h4 className="text-xl font-bold text-gray-900 mb-1">{selectedMessage.subject}</h4>
                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                            <span className="font-medium text-gray-700">{selectedMessage.name}</span>
                                            <span>&bull;</span>
                                            <a href={`mailto:${selectedMessage.email}`} className="hover:text-blue-600 transition-colors">{selectedMessage.email}</a>
                                        </div>
                                    </div>
                                    <div className="flex flex-col sm:items-end gap-2 text-sm">
                                        <span className="text-gray-400 whitespace-nowrap">{new Date(selectedMessage.createdAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}</span>
                                        <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest w-max">
                                            {selectedMessage.inquiryType}
                                        </span>
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <p className="text-sm text-gray-500 font-bold uppercase tracking-wider mb-2">Message</p>
                                    <div className="text-gray-800 text-sm sm:text-base leading-relaxed whitespace-pre-wrap bg-gray-50 p-5 rounded-xl border border-gray-100">
                                        {selectedMessage.message}
                                    </div>
                                </div>

                                {(selectedMessage.phone || selectedMessage.organization) && (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm bg-blue-50/50 p-4 rounded-xl border border-blue-100/50">
                                        {selectedMessage.phone && (
                                            <div>
                                                <span className="text-gray-400 block text-xs uppercase font-bold tracking-wider mb-1">Phone Number</span>
                                                <a href={`tel:${selectedMessage.phone}`} className="text-gray-900 font-medium hover:text-blue-600 transition-colors">
                                                    {selectedMessage.phone}
                                                </a>
                                            </div>
                                        )}
                                        {selectedMessage.organization && (
                                            <div>
                                                <span className="text-gray-400 block text-xs uppercase font-bold tracking-wider mb-1">Organization</span>
                                                <span className="text-gray-900 font-medium">{selectedMessage.organization}</span>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="p-4 sm:p-6 bg-white border-t border-gray-100 flex justify-between flex-shrink-0">
                            <button onClick={(e) => handleDeleteMessage(e, selectedMessage._id)} className="px-6 py-2.5 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-100 transition-colors w-full sm:w-auto mb-2 sm:mb-0">
                                Delete Message
                            </button>
                            <button onClick={() => setIsMessageModalOpen(false)} className="px-6 py-2.5 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors w-full sm:w-auto">
                                Close Window
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

};

export default Dashboard;
