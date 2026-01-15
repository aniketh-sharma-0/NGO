import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { FaUsers, FaTasks, FaHandHoldingHeart, FaCheck, FaTimes, FaPlus } from 'react-icons/fa';

const Dashboard = () => {
    const { user } = useAuth();
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
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <div className="w-64 bg-white shadow-lg hidden md:block">
                <div className="p-6">
                    <h2 className="text-xl font-bold text-gray-800">Admin Panel</h2>
                </div>
                <nav className="mt-6">
                    {['Overview', 'Volunteers', 'Donations', 'Chatbot'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`w-full text-left px-6 py-3 hover:bg-gray-50 transition-colors ${activeTab === tab ? 'bg-blue-50 text-primary border-r-4 border-primary' : 'text-gray-600'}`}
                        >
                            {tab}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-8 overflow-y-auto">
                <h1 className="text-3xl font-bold text-gray-800 mb-8">{activeTab}</h1>

                {activeTab === 'Overview' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-500">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-gray-500">Total Volunteers (Active)</p>
                                    <h3 className="text-2xl font-bold">{volunteers.filter(v => v.status === 'Active').length}</h3>
                                </div>
                                <FaUsers className="text-3xl text-blue-200" />
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-500">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-gray-500">Total Donations</p>
                                    <h3 className="text-2xl font-bold">₹{donations.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0)}</h3>
                                </div>
                                <FaHandHoldingHeart className="text-3xl text-green-200" />
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-purple-500">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-gray-500">Active Projects</p>
                                    <h3 className="text-2xl font-bold">--</h3>
                                </div>
                                <FaTasks className="text-3xl text-purple-200" />
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'Volunteers' && (
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 text-gray-500 border-b">
                                <tr>
                                    <th className="p-4">Name</th>
                                    <th className="p-4">Skills</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {volunteers.map(vol => (
                                    <tr key={vol._id} className="hover:bg-gray-50">
                                        <td className="p-4 font-medium">{vol.user?.name || 'Unknown'}</td>
                                        <td className="p-4 text-sm text-gray-600">{vol.skills.join(', ')}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded text-xs font-bold 
                                                ${vol.status === 'Active' ? 'bg-green-100 text-green-800' :
                                                    vol.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                                                {vol.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right space-x-2">
                                            {vol.status === 'Pending' && (
                                                <>
                                                    <button onClick={() => handleVerifyVolunteer(vol._id, 'Active')} className="bg-green-100 text-green-600 p-2 rounded hover:bg-green-200" title="Approve">
                                                        <FaCheck />
                                                    </button>
                                                    <button onClick={() => handleVerifyVolunteer(vol._id, 'Inactive')} className="bg-red-100 text-red-600 p-2 rounded hover:bg-red-200" title="Reject">
                                                        <FaTimes />
                                                    </button>
                                                </>
                                            )}
                                            {vol.status === 'Active' && (
                                                <button onClick={() => openTaskModal(vol)} className="bg-blue-100 text-blue-600 p-2 rounded hover:bg-blue-200" title="Assign Task">
                                                    <FaPlus /> Assign Task
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === 'Donations' && (
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 text-gray-500 border-b">
                                <tr>
                                    <th className="p-4">Donor</th>
                                    <th className="p-4">Amount</th>
                                    <th className="p-4">Category</th>
                                    <th className="p-4">Date</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {donations.map(don => (
                                    <tr key={don._id} className="hover:bg-gray-50">
                                        <td className="p-4">
                                            <div className="font-medium">{don.name}</div>
                                            <div className="text-xs text-gray-500">{don.email}</div>
                                        </td>
                                        <td className="p-4 font-bold">₹{don.amount}</td>
                                        <td className="p-4 text-sm">{don.category}</td>
                                        <td className="p-4 text-sm text-gray-500">{new Date(don.createdAt).toLocaleDateString()}</td>
                                        <td className="p-4">
                                            <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">
                                                {don.status}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <button onClick={() => openDonationModal(don)} className="text-blue-600 hover:underline text-sm">View Details</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === 'Chatbot' && (
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <div className="flex justify-between mb-6">
                            <h2 className="text-xl font-bold">FAQs & Chat Intents</h2>
                            <button onClick={() => openBotModal()} className="bg-primary text-white px-4 py-2 rounded flex items-center gap-2">
                                <FaPlus /> Add FAQ
                            </button>
                        </div>
                        <div className="grid gap-4">
                            {intents.map(intent => (
                                <div key={intent._id} className="border p-4 rounded-lg hover:shadow-md transition-shadow relative group">
                                    <div className="absolute top-4 right-4 hidden group-hover:flex gap-2">
                                        <button onClick={() => openBotModal(intent)} className="text-blue-600 hover:text-blue-800">Edit</button>
                                        <button onClick={() => handleDeleteIntent(intent._id)} className="text-red-600 hover:text-red-800">Delete</button>
                                    </div>
                                    <h3 className="font-bold text-lg mb-1">{intent.question}</h3>
                                    <p className="text-gray-600 mb-2">{intent.answer}</p>
                                    <div className="text-xs text-gray-400">
                                        Keywords: {intent.keywords.join(', ')}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Task Assign Modal */}
            {isTaskModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
                        <h3 className="text-xl font-bold mb-4">Assign Task to {selectedVolunteer?.user?.name}</h3>
                        <form onSubmit={handleAssignTask} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Task Title</label>
                                <input
                                    className="w-full border p-2 rounded"
                                    value={taskForm.title}
                                    onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Description</label>
                                <textarea
                                    className="w-full border p-2 rounded h-24"
                                    value={taskForm.description}
                                    onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Due Date</label>
                                <input
                                    type="date"
                                    className="w-full border p-2 rounded"
                                    value={taskForm.dueDate}
                                    onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
                                />
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button type="button" onClick={() => setIsTaskModalOpen(false)} className="px-4 py-2 border rounded hover:bg-gray-50">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-primary text-white rounded hover:bg-blue-800">Assign</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Chatbot Modal */}
            {isBotModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
                        <h3 className="text-xl font-bold mb-4">{botForm.id ? 'Edit FAQ' : 'Add FAQ'}</h3>
                        <form onSubmit={handleSaveIntent} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Question (Canonical)</label>
                                <input
                                    className="w-full border p-2 rounded"
                                    value={botForm.question}
                                    onChange={(e) => setBotForm({ ...botForm, question: e.target.value })}
                                    required
                                    placeholder="e.g. How do I donate?"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Answer</label>
                                <textarea
                                    className="w-full border p-2 rounded h-32"
                                    value={botForm.answer}
                                    onChange={(e) => setBotForm({ ...botForm, answer: e.target.value })}
                                    required
                                    placeholder="You can donate by clicking..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Keywords (comma separated)</label>
                                <input
                                    className="w-full border p-2 rounded"
                                    value={botForm.keywords}
                                    onChange={(e) => setBotForm({ ...botForm, keywords: e.target.value })}
                                    required
                                    placeholder="donate, give, contribute"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Category</label>
                                <select
                                    className="w-full border p-2 rounded"
                                    value={botForm.category}
                                    onChange={(e) => setBotForm({ ...botForm, category: e.target.value })}
                                >
                                    <option value="General">General</option>
                                    <option value="Donation">Donation</option>
                                    <option value="Volunteer">Volunteer</option>
                                    <option value="Project">Project</option>
                                </select>
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button type="button" onClick={() => setIsBotModalOpen(false)} className="px-4 py-2 border rounded hover:bg-gray-50">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-primary text-white rounded hover:bg-blue-800">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {/* Donation Details Modal */}
            {isDonationModalOpen && selectedDonation && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6 border-b pb-4">
                            <h3 className="text-xl font-bold">Donation Details</h3>
                            <button onClick={() => setIsDonationModalOpen(false)} className="text-gray-500 hover:text-red-500">
                                <FaTimes size={20} />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase">Donor Name</label>
                                    <p className="text-gray-800">{selectedDonation.name}</p>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase">Amount</label>
                                    <p className="text-xl font-bold text-green-600">₹{selectedDonation.amount}</p>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase">Email</label>
                                    <p className="text-gray-800">{selectedDonation.email}</p>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase">Phone</label>
                                    <p className="text-gray-800">{selectedDonation.phone || 'N/A'}</p>
                                </div>
                            </div>
                            {selectedDonation.organization && (
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase">Organization</label>
                                    <p className="text-gray-800">{selectedDonation.organization}</p>
                                </div>
                            )}
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase">Address</label>
                                <p className="text-gray-800">{selectedDonation.address || 'N/A'}</p>
                            </div>
                            {selectedDonation.pan && (
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase">PAN</label>
                                    <p className="text-gray-800">{selectedDonation.pan}</p>
                                </div>
                            )}
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase">Message</label>
                                <div className="bg-gray-50 p-3 rounded text-gray-700 text-sm">
                                    {selectedDonation.message || 'No message provided.'}
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase">Timestamp</label>
                                <p className="text-sm text-gray-500">{new Date(selectedDonation.createdAt).toLocaleString()}</p>
                            </div>
                        </div>
                        <div className="mt-6 flex justify-end">
                            <button onClick={() => setIsDonationModalOpen(false)} className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200">Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

};

export default Dashboard;
