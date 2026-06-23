import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { MessageCircle, X, Send } from 'lucide-react';

const API_BASE_URL = '/api';

const Chatbox = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { text: "Chào bạn! Tôi có thể giúp gì cho bạn hôm nay?", sender: 'bot' }
    ]);
    const [input, setInput] = useState('');
    const [sessionId, setSessionId] = useState('');
    const messagesEndRef = useRef(null);

    useEffect(() => {
        // Simple session ID
        let sid = sessionStorage.getItem('chat_session_id');
        if (!sid) {
            sid = 'sess_' + Math.random().toString(36).substr(2, 9);
            sessionStorage.setItem('chat_session_id', sid);
        }
        setSessionId(sid);
    }, []);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = input.trim();
        setMessages(prev => [...prev, { text: userMsg, sender: 'user' }]);
        setInput('');

        try {
            const response = await axios.post(`${API_BASE_URL}/public/chat`, {
                session_id: sessionId,
                message: userMsg
            });
            
            setMessages(prev => [...prev, { text: response.data.reply, sender: 'bot' }]);
        } catch (error) {
            setMessages(prev => [...prev, { text: "Xin lỗi, hệ thống đang bận. Vui lòng liên hệ Hotline.", sender: 'bot' }]);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {/* Chat Icon */}
            {!isOpen && (
                <button 
                    onClick={() => setIsOpen(true)}
                    className="bg-gold-500 hover:bg-gold-600 text-white p-4 rounded-full shadow-xl transition-transform hover:scale-110 flex items-center justify-center"
                >
                    <MessageCircle size={28} />
                </button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div className="bg-white rounded-2xl shadow-2xl w-80 md:w-96 overflow-hidden flex flex-col border border-borderLight h-[500px] max-h-[80vh]">
                    {/* Header */}
                    <div className="bg-dark text-white p-4 flex justify-between items-center">
                        <div>
                            <h3 className="font-serif font-bold text-lg text-gold-500">Trợ Lý Ảo Spa</h3>
                            <p className="text-xs text-gray-400">Trực tuyến</p>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white transition">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 bg-ivory space-y-4">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] rounded-2xl p-3 text-sm ${msg.sender === 'user' ? 'bg-gold-500 text-white rounded-tr-none' : 'bg-white border border-borderLight text-dark rounded-tl-none whitespace-pre-wrap'}`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-3 bg-white border-t border-borderLight">
                        <form onSubmit={handleSend} className="flex gap-2">
                            <input 
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Nhập tin nhắn..."
                                className="flex-1 px-4 py-2 bg-ivory rounded-full outline-none focus:ring-1 focus:ring-gold-500 text-sm"
                            />
                            <button 
                                type="submit"
                                className="bg-dark text-gold-500 p-2 rounded-full hover:bg-gray-800 transition"
                            >
                                <Send size={20} />
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Chatbox;
