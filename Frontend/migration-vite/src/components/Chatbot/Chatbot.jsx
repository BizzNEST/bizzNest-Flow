import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import styles from "./Chatbot.module.css";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:30001";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState(null);
  const [internData, setInternData] = useState([]);
  const [projectData, setProjectData] = useState([]);
  const messagesContainerRef = useRef(null);

  const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Fetch intern and project data when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [internRes, projectRes] = await Promise.all([
          api.get("/api/getInternDataSummary"),
          api.get("/api/getProjectsDataSummary"),
        ]);
        setInternData(internRes.data);
        setProjectData(projectRes.data);
      } catch (err) {
        console.error("Error fetching intern/project data:", err);
      }
    };

    fetchData();
  }, []);

  // Scroll to bottom when messages update
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setError(null);

    try {
      setIsTyping(true);

      const response = await api.post("/api/chat", {
        message: input, // just the question now
      });

      if (response.data.success) {
        const botMessage = { sender: "bot", text: response.data.response };
        setMessages((prev) => [...prev, botMessage]);
      } else {
        setError(response.data.error || "Failed to get a response from AI");
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
    <div className={styles.formatedText}>
      <ReactMarkdown>{text}</ReactMarkdown>
    </div>
  );

  return (
    <div className={styles.chatbotContainer}>
      {/* Chat Messages */}
      <div className={styles.messages} ref={messagesContainerRef}>
        {messages.map((msg, idx) => (
          <div key={idx} className={`${styles.message} ${styles[msg.sender]}`}>
            {msg.sender === "bot" ? renderMessageContent(msg.text) : msg.text}
          </div>
        ))}
        {isTyping && (
          <div className={`${styles.message} ${styles.bot}`}>
            <div className={styles.typingIndicator}>
              <div></div>
              <div></div>
              <div></div>
            </div>
          </div>
        )}
      </div>

      {/* Chat Input */}
      <div className={styles.aiInputArea}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Hi, I'm Harvey! How can I help you?"
          disabled={isTyping}
        />
        <button onClick={sendMessage} disabled={!input.trim() || isTyping}>
          Send
        </button>
      </div>

      {/* Error Message */}
      {error && <div className={styles.errorMessage}>{error}</div>}
    </div>
  );
};

export default Chatbot;
