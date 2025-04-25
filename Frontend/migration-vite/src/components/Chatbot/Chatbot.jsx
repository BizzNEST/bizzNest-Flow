import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import "./Chatbot.css";
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:30001";

const Chatbot = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [error, setError] = useState(null);
    const messagesContainerRef = useRef(null);

    const api = axios.create({
        baseURL: API_BASE_URL,
        headers: {
            "Content-Type": "application/json"
        }
    });

    useEffect(() => {
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
    }, [messages]);

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMessage = { sender: "user", text: input };
        const userInput = input;
        setMessages(prev => [...prev, userMessage]);
        setInput("");
        setError(null);

        try {
            setIsTyping(true);

            const response = await api.post("/api/chat", { 
                message: userInput,
                projectName: "Sample Project",         // You can make these dynamic later
                requiredSkills: "React, Node.js"         // e.g., pick from the project
            });

            if (response.data.success) {
                const botMessage = { sender: "bot", text: response.data.response };
                setMessages(prev => [...prev, botMessage]);
            } else {
                setError(response.data.error || "Failed to get response");
            }
        } catch (err) {
            console.error("Error sending message:", err);
            setError("Sorry, something went wrong. Please try again.");
        } finally {
            setIsTyping(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            sendMessage();
        }
    };

    const renderMessageContent = (text) => (
        <div className="formatted-text">
            <ReactMarkdown>{text}</ReactMarkdown>
        </div>
    );

    return (
        <div className="chatbot-container">
            <div className="header">BizzNest Assistant</div>

            <div className="messages" ref={messagesContainerRef}>
                {messages.map((msg, idx) => (
                    <div key={idx} className={`message ${msg.sender}`}>
                        {msg.sender === "bot" ? renderMessageContent(msg.text) : msg.text}
                    </div>
                ))}
                {isTyping && (
                    <div className="message bot">
                        <div className="typing-indicator">
                            <div></div><div></div><div></div>
                        </div>
                    </div>
                )}
            </div>

            <div className="input-area">
                <input 
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask about intern/project matches..."
                    disabled={isTyping}
                />
                <button onClick={sendMessage} disabled={!input.trim() || isTyping}>
                    Send
                </button>
            </div>

            {error && <div className="error-message">{error}</div>}
        </div>
    );
};

export default Chatbot;
