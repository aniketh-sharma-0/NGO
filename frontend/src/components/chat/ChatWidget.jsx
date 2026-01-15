import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { FaCommentDots, FaPaperPlane, FaTimes } from 'react-icons/fa';

const ChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { sender: 'bot', text: 'Hi there! How can I help you today?' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (isOpen) scrollToBottom();
    }, [messages, isOpen]);

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = input;
        setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
        setInput('');
        setLoading(true);

        try {
            const res = await axios.post('/api/chat/message', { message: userMsg });
            setMessages(prev => [...prev, { sender: 'bot', text: res.data.reply }]);
        } catch (error) {
            setMessages(prev => [...prev, { sender: 'bot', text: 'Sorry, I am having trouble connecting.' }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">

            {/* Chat Window */}
            {isOpen && (
                <div className="bg-white w-80 h-96 rounded-2xl shadow-2xl mb-4 flex flex-col overflow-hidden border border-gray-200 animate-fade-in-up">
                    <div className="bg-primary p-4 text-white flex justify-between items-center shadow">
                        <div className="flex items-center gap-2">
                            <FaCommentDots />
                            <span className="font-bold">NGO Assistant</span>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="hover:text-red-200"><FaTimes /></button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] p-3 rounded-lg text-sm shadow-sm
                                    ${msg.sender === 'user'
                                        ? 'bg-primary text-white rounded-br-none'
                                        : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
                                    }`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="flex justify-start">
                                <div className="bg-white text-gray-500 text-xs p-2 rounded-lg border italic">Typing...</div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <form onSubmit={sendMessage} className="p-3 border-t bg-white flex gap-2">
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type a message..."
                            className="flex-1 border rounded-full px-4 py-2 text-sm focus:outline-none focus:border-primary"
                        />
                        <button type="submit" className="bg-primary text-white p-2 rounded-full hover:bg-blue-800 transition-colors">
                            <FaPaperPlane size={14} />
                        </button>
                    </form>
                </div>
            )}

            {/* Float Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="bg-primary text-white p-4 rounded-full shadow-lg hover:bg-blue-800 transition-all hover:scale-110 flex items-center justify-center"
            >
                {isOpen ? <FaTimes size={24} /> : <FaCommentDots size={28} />}
            </button>
        </div>
    );
};

export default ChatWidget;
