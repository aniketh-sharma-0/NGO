import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { useNavigate } from 'react-router-dom';
import { FaUpload, FaCheckCircle, FaClock, FaClipboardList, FaTimes } from 'react-icons/fa';
import useBodyScrollLock from '../../hooks/useBodyScrollLock';

const VolunteerDashboard = () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    // Modal State
    const [selectedTask, setSelectedTask] = useState(null);

    // Structured Report State
    const [reportData, setReportData] = useState({
        hours: '',
        work: '',
        challenges: ''
    });

    const [submissionImage, setSubmissionImage] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    useBodyScrollLock(!!selectedTask);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            // 1. Get Profile
            try {
                const profileRes = await api.get('/volunteers/me');
                setProfile(profileRes.data);

                // 2. If Active, Get Tasks
                if (profileRes.data.status === 'Active') {
                    const tasksRes = await api.get('/volunteers/me/tasks');
                    setTasks(tasksRes.data);
                }
            } catch (err) {
                if (err.response && err.response.status === 404) {
                    navigate('/volunteer/register');
                }
            }

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            setSubmissionImage(e.target.files[0]);
        }
    };

    const handleReportChange = (e) => {
        const { name, value } = e.target;
        setReportData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmitTask = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            // 1. Upload Image if exists
            let imageUrl = '';
            if (submissionImage) {
                const formData = new FormData();
                formData.append('image', submissionImage);
                const uploadRes = await api.post('/volunteers/upload', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                imageUrl = uploadRes.data.filePath;
            }

            // 2. Format Submission Text (Structured Data -> String)
            const formattedSubmission = `
DAILY REPORT
------------
Hours Worked: ${reportData.hours}
Work Description: ${reportData.work}
Challenges/Notes: ${reportData.challenges}
            `.trim();

            // 3. Submit Task
            await api.put(`/volunteers/tasks/${selectedTask._id}/submit`, {
                submissionText: formattedSubmission,
                submissionImage: imageUrl
            });

            fetchData();
            closeModal();

        } catch (error) {
            console.error("Submission failed", error);
            alert("Failed to submit task.");
        } finally {
            setSubmitting(false);
        }
    };

    const openModal = (task) => {
        setSelectedTask(task);
        setReportData({ hours: '', work: '', challenges: '' });
        setSubmissionImage(null);
    };

    const closeModal = () => {
        setSelectedTask(null);
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center text-xl text-gray-600 font-bold">Loading Dashboard...</div>;
    if (!profile) return null;

    return (
        <div className="min-h-screen p-4 md:p-8 bg-gray-50 font-sans">
            <div className="container mx-auto max-w-7xl">
                {/* Header - Clean White */}
                <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm mb-8 flex flex-col md:flex-row justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-2 font-heading">Volunteer Dashboard</h1>
                        <p className="text-gray-500">Welcome back, <span className="font-bold text-gray-900">{profile.user?.name || 'Volunteer'}</span></p>
                    </div>
                    <div className="mt-4 md:mt-0">
                        <span className={`px-4 py-1.5 rounded-full font-bold text-sm flex items-center gap-2
                            ${profile.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                            <span className={`w-2 h-2 rounded-full ${profile.status === 'Active' ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
                            {profile.status}
                        </span>
                    </div>
                </div>

                {profile.status === 'Pending' ? (
                    <div className="text-center py-20 bg-white rounded-2xl shadow-sm max-w-2xl mx-auto">
                        <div className="w-20 h-20 bg-yellow-50 text-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl animate-pulse">
                            <FaClock />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2 font-heading">Application Under Review</h2>
                        <p className="text-gray-500 max-w-md mx-auto">Thank you for your interest. Our team is currently reviewing your application. You will be notified once approved.</p>
                    </div>
                ) : (
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Task List */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="flex items-center gap-3 mb-2">
                                <h2 className="text-xl font-bold text-gray-800 font-heading">Assignments & Projects</h2>
                                <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs font-bold">{tasks.length}</span>
                            </div>

                            {tasks.length === 0 ? (
                                <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-200">
                                    <FaClipboardList className="text-4xl text-gray-300 mx-auto mb-4" />
                                    <p className="text-gray-500 font-medium">No projects assigned yet.</p>
                                </div>
                            ) : (
                                <div className="grid gap-6">
                                    {tasks.map(task => (
                                        <div key={task._id} className="bg-white p-6 md:p-8 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-transparent hover:border-gray-100 group">
                                            <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-3">
                                                        <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                                                            {task.project?.title || 'General Task'}
                                                        </span>
                                                        {task.dueDate && (
                                                            <span className="text-xs text-red-600 font-medium bg-red-50 px-2 py-0.5 rounded">
                                                                Due: {new Date(task.dueDate).toLocaleDateString()}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 font-heading">{task.title}</h3>
                                                    <p className="text-gray-600 mb-6 leading-relaxed text-sm md:text-base">{task.description}</p>

                                                    {/* Status Badge */}
                                                    <span className={`inline-block px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wide
                                                        ${task.status === 'Assigned' ? 'bg-blue-50 text-blue-700' :
                                                            task.status === 'Submitted' ? 'bg-yellow-50 text-yellow-700' :
                                                                task.status === 'Approved' ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-600'}`}>
                                                        {task.status}
                                                    </span>
                                                </div>

                                                <div className="flex-shrink-0 w-full md:w-auto">
                                                    {task.status === 'Assigned' ? (
                                                        <button
                                                            onClick={() => openModal(task)}
                                                            className="w-full md:w-auto bg-gray-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-black transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 transform active:scale-95 text-sm"
                                                        >
                                                            <FaClipboardList /> Report
                                                        </button>
                                                    ) : (
                                                        <div className="bg-gray-50 px-5 py-2.5 rounded-xl text-sm text-gray-500 font-bold text-center border border-gray-100">
                                                            Submitted
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            <div className="bg-white p-6 rounded-2xl shadow-sm">
                                <h3 className="font-bold text-lg text-gray-800 mb-6 font-heading border-b border-gray-100 pb-4">Reporting Guide</h3>
                                <ul className="space-y-5 text-gray-600">
                                    <li className="flex gap-4 items-start">
                                        <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 flex-shrink-0 mt-0.5">
                                            <FaCheckCircle size={12} />
                                        </div>
                                        <span className="text-sm">Be honest and detailed in your daily reports.</span>
                                    </li>
                                    <li className="flex gap-4 items-start">
                                        <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 flex-shrink-0 mt-0.5">
                                            <FaUpload size={12} />
                                        </div>
                                        <span className="text-sm">Upload clear photos (geo-tagged if possible).</span>
                                    </li>
                                    <li className="flex gap-4 items-start">
                                        <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 flex-shrink-0 mt-0.5">
                                            <FaClock size={12} />
                                        </div>
                                        <span className="text-sm">Submit by EOD for timely approval.</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Daily Report Modal */}
            {selectedTask && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl flex flex-col max-h-[90vh]">

                        {/* Modal Header */}
                        <div className="flex-none p-5 border-b border-gray-100 flex justify-between items-center">
                            <div>
                                <h3 className="text-lg font-bold text-gray-800">Submit Daily Report</h3>
                                <p className="text-xs text-gray-500 mt-1">Task: <span className="font-medium text-blue-600">{selectedTask.title}</span></p>
                            </div>
                            <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 transition-colors bg-gray-50 p-2 rounded-full hover:bg-gray-100">
                                <FaTimes className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Modal Body (Scrollable Form) */}
                        <form onSubmit={handleSubmitTask} className="flex flex-col min-h-0 flex-1">
                            <div className="flex-1 overflow-y-auto p-6 space-y-5 custom-scrollbar">
                                {/* Structured Questionnaire */}
                                <div className="space-y-5">
                                    {/* Hours */}
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                                            Hours Worked <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="number"
                                            name="hours"
                                            value={reportData.hours}
                                            onChange={handleReportChange}
                                            placeholder="0.0"
                                            className="w-full border border-gray-200 bg-gray-50 p-3 rounded-lg focus:bg-white focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all font-bold text-lg"
                                            required
                                            min="0"
                                            step="0.5"
                                        />
                                    </div>

                                    {/* Accomplishments */}
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                                            Accomplishments <span className="text-red-500">*</span>
                                        </label>
                                        <textarea
                                            name="work"
                                            value={reportData.work}
                                            onChange={handleReportChange}
                                            placeholder="What did you get done today?"
                                            className="w-full border border-gray-200 bg-gray-50 p-3 rounded-lg h-24 focus:bg-white focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all resize-none text-sm"
                                            required
                                        />
                                    </div>

                                    {/* Challenges */}
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Challenges / Notes</label>
                                        <textarea
                                            name="challenges"
                                            value={reportData.challenges}
                                            onChange={handleReportChange}
                                            placeholder="Any blockers?"
                                            className="w-full border border-gray-200 bg-gray-50 p-3 rounded-lg h-20 focus:bg-white focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all resize-none text-sm"
                                        />
                                    </div>

                                    {/* Photo Upload */}
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Proof of Work</label>
                                        <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center cursor-pointer hover:bg-gray-50 hover:border-gray-400 transition-all relative group">
                                            <input
                                                type="file"
                                                onChange={handleFileChange}
                                                accept="image/*"
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            />
                                            <div className="flex flex-col items-center">
                                                <div className="w-10 h-10 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mb-2 group-hover:bg-gray-200 transition-colors">
                                                    <FaUpload className="text-sm" />
                                                </div>
                                                <p className="text-sm text-gray-600 font-medium">
                                                    {submissionImage ? (
                                                        <span className="text-green-600 font-bold flex items-center gap-1">
                                                            <FaCheckCircle /> {submissionImage.name}
                                                        </span>
                                                    ) : (
                                                        <span className="text-gray-500">Upload Image</span>
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Modal Footer (Fixed Actions) */}
                            <div className="flex-none p-5 border-t border-gray-100 bg-gray-50 rounded-b-2xl flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="px-5 py-2.5 text-gray-600 font-bold hover:bg-gray-200 rounded-lg transition-colors text-sm"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className={`px-6 py-2.5 bg-gray-900 text-white font-bold rounded-lg shadow-md hover:bg-black transform active:scale-95 transition-all flex items-center gap-2 text-sm ${submitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                                >
                                    {submitting ? 'Sending...' : 'Submit Report'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VolunteerDashboard;
