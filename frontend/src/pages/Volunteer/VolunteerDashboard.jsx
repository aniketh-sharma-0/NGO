import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaUpload, FaCheckCircle, FaClock, FaClipboardList } from 'react-icons/fa';

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

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            // 1. Get Profile
            try {
                const profileRes = await axios.get('/api/volunteers/me', config);
                setProfile(profileRes.data);

                // 2. If Active, Get Tasks
                if (profileRes.data.status === 'Active') {
                    const tasksRes = await axios.get('/api/volunteers/me/tasks', config);
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
            const token = localStorage.getItem('token');

            // 1. Upload Image if exists
            let imageUrl = '';
            if (submissionImage) {
                const formData = new FormData();
                formData.append('image', submissionImage);
                const uploadRes = await axios.post('/api/volunteers/upload', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${token}`
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
            await axios.put(`/api/volunteers/tasks/${selectedTask._id}/submit`, {
                submissionText: formattedSubmission,
                submissionImage: imageUrl
            }, {
                headers: { Authorization: `Bearer ${token}` }
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

    if (loading) return <div className="min-h-screen flex items-center justify-center text-xl text-primary font-bold">Loading Dashboard...</div>;
    if (!profile) return null;

    return (
        <div className="min-h-screen p-4 md:p-8 bg-soft-blue font-sans">
            <div className="container mx-auto">
                {/* Header */}
                <div className="bg-white p-8 rounded-3xl shadow-lg mb-8 flex flex-col md:flex-row justify-between items-center border border-white">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-2 font-heading">Volunteer Dashboard</h1>
                        <p className="text-gray-600">Welcome back, <span className="font-bold text-blue-600">{profile.user?.name || 'Volunteer'}</span>!</p>
                    </div>
                    <div className="mt-4 md:mt-0">
                        <span className={`px-5 py-2 rounded-full font-bold text-sm shadow-sm border flex items-center gap-2
                            ${profile.status === 'Active' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-yellow-50 text-yellow-600 border-yellow-100'}`}>
                            <span className={`w-2 h-2 rounded-full ${profile.status === 'Active' ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
                            Status: {profile.status}
                        </span>
                    </div>
                </div>

                {profile.status === 'Pending' ? (
                    <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100 max-w-2xl mx-auto">
                        <div className="w-24 h-24 bg-yellow-50 text-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl shadow-inner animate-pulse">
                            <FaClock />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2 font-heading">Application Under Review</h2>
                        <p className="text-gray-500 max-w-md mx-auto">Thank you for your interest. Our team is currently reviewing your application. You will be notified once approved.</p>
                    </div>
                ) : (
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Task List */}
                        <div className="lg:col-span-2 space-y-8">
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-1.5 bg-gray-800 rounded-full"></div>
                                <h2 className="text-2xl font-bold text-gray-800 font-heading">Assignments & Projects</h2>
                            </div>

                            {tasks.length === 0 ? (
                                <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
                                    <FaClipboardList className="text-5xl text-gray-300 mx-auto mb-4" />
                                    <p className="text-gray-500 font-medium text-lg">No projects assigned yet.</p>
                                </div>
                            ) : (
                                <div className="grid gap-6">
                                    {tasks.map(task => (
                                        <div key={task._id} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 group">
                                            <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-3">
                                                        <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-lg">
                                                            {task.project?.title || 'General Task'}
                                                        </span>
                                                        {task.dueDate && (
                                                            <span className="text-xs text-red-500 font-medium bg-red-50 px-3 py-1 rounded-lg">
                                                                Due: {new Date(task.dueDate).toLocaleDateString()}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <h3 className="text-2xl font-bold text-gray-800 mb-3 font-heading">{task.title}</h3>
                                                    <p className="text-gray-600 mb-6 leading-relaxed">{task.description}</p>

                                                    {/* Status Badge */}
                                                    <span className={`inline-block px-4 py-1.5 rounded-full text-xs font-bold 
                                                        ${task.status === 'Assigned' ? 'bg-blue-100 text-blue-800' :
                                                            task.status === 'Submitted' ? 'bg-yellow-100 text-yellow-800' :
                                                                task.status === 'Approved' ? 'bg-green-100 text-green-800' : 'bg-gray-100'}`}>
                                                        {task.status}
                                                    </span>
                                                </div>

                                                <div className="flex-shrink-0 w-full md:w-auto">
                                                    {task.status === 'Assigned' ? (
                                                        <button
                                                            onClick={() => openModal(task)}
                                                            className="w-full md:w-auto bg-gray-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-black transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 transform active:scale-95"
                                                        >
                                                            <FaClipboardList /> Fill Daily Report
                                                        </button>
                                                    ) : (
                                                        <div className="bg-gray-50 px-6 py-3 rounded-2xl text-sm text-gray-500 font-bold text-center border border-gray-100">
                                                            Report Submitted
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
                            <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
                                <h3 className="font-bold text-xl text-gray-800 mb-6 font-heading border-b pb-4">Daily Reporting Guide</h3>
                                <ul className="space-y-5 text-gray-600">
                                    <li className="flex gap-4">
                                        <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 flex-shrink-0">
                                            <FaCheckCircle />
                                        </div>
                                        <span className="text-sm font-medium pt-1">Fill out the questionnaire honestly detailing your activities.</span>
                                    </li>
                                    <li className="flex gap-4">
                                        <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 flex-shrink-0">
                                            <FaUpload />
                                        </div>
                                        <span className="text-sm font-medium pt-1">Upload clear photos as proof of work (Geo-tagged preferred).</span>
                                    </li>
                                    <li className="flex gap-4">
                                        <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 flex-shrink-0">
                                            <FaClock />
                                        </div>
                                        <span className="text-sm font-medium pt-1">Submit reports by end of day for timely approval.</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Daily Report Modal */}
            {/* Daily Report Modal */}
            {selectedTask && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh]">

                        {/* Modal Header */}
                        <div className="flex-none bg-gray-50 p-5 border-b border-gray-100 flex justify-between items-center rounded-t-2xl">
                            <div>
                                <h3 className="text-xl font-bold text-gray-800">Submit Daily Report</h3>
                                <p className="text-sm text-gray-500 mt-1">Task: <span className="font-medium text-primary">{selectedTask.title}</span></p>
                            </div>
                            <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <FaTimes className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Modal Body (Scrollable Form) */}
                        <form onSubmit={handleSubmitTask} className="flex flex-col min-h-0 flex-1">
                            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                                {/* Structured Questionnaire */}
                                <div className="space-y-5">
                                    {/* Hours */}
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">
                                            Hours Worked Today <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="number"
                                            name="hours"
                                            value={reportData.hours}
                                            onChange={handleReportChange}
                                            placeholder="e.g. 4"
                                            className="w-full border border-gray-200 bg-gray-50/50 p-3 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium"
                                            required
                                            min="0"
                                            step="0.5"
                                        />
                                    </div>

                                    {/* Accomplishments */}
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">
                                            What did you accomplish? <span className="text-red-500">*</span>
                                        </label>
                                        <textarea
                                            name="work"
                                            value={reportData.work}
                                            onChange={handleReportChange}
                                            placeholder="Briefly describe the activities completed..."
                                            className="w-full border border-gray-200 bg-gray-50/50 p-3 rounded-xl h-28 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none"
                                            required
                                        />
                                    </div>

                                    {/* Challenges */}
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Challenges faced (if any)</label>
                                        <textarea
                                            name="challenges"
                                            value={reportData.challenges}
                                            onChange={handleReportChange}
                                            placeholder="Note any issues or support needed..."
                                            className="w-full border border-gray-200 bg-gray-50/50 p-3 rounded-xl h-24 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none"
                                        />
                                    </div>

                                    {/* Photo Upload */}
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Upload Proof of Work (Photo)</label>
                                        <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-all relative group bg-gray-50/30">
                                            <input
                                                type="file"
                                                onChange={handleFileChange}
                                                accept="image/*"
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            />
                                            <div className="flex flex-col items-center">
                                                <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                                    <FaUpload className="text-lg text-primary" />
                                                </div>
                                                <p className="text-sm text-gray-600 font-medium">
                                                    {submissionImage ? (
                                                        <span className="text-green-600 font-bold flex items-center gap-1">
                                                            <FaCheckCircle /> {submissionImage.name}
                                                        </span>
                                                    ) : (
                                                        <span><span className="text-primary font-bold">Click to upload</span> or drag & drop</span>
                                                    )}
                                                </p>
                                                <p className="text-xs text-gray-400 mt-1">SVG, PNG, JPG or GIF (max. 5MB)</p>
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
                                    className="px-6 py-2.5 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-100 transition-colors focus:ring-2 focus:ring-gray-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className={`px-8 py-2.5 bg-gradient-to-r from-primary to-blue-600 text-white font-bold rounded-xl shadow-md hover:shadow-lg transform active:scale-95 transition-all flex items-center gap-2 ${submitting ? 'opacity-70 cursor-not-allowed' : 'hover:from-blue-700 hover:to-blue-800'}`}
                                >
                                    {submitting ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            Submitting...
                                        </>
                                    ) : (
                                        <>
                                            Submit Report <FaCheckCircle />
                                        </>
                                    )}
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
