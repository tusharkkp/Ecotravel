import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaLeaf, FaPaperPlane, FaSpinner, FaTimes } from 'react-icons/fa';
import '../../assets/styles/chatbot.css';
import chatbotLogo from '../../assets/chatbot-logo.svg';

const ChatWindow = ({ isOpen, messages, sendMessage, isTyping, closeChat }) => {
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputMessage.trim()) {
      sendMessage(inputMessage);
      setInputMessage('');
    }
  };

  // Quick reply buttons
  const quickReplies = [
    { id: 'carbon', text: 'Calculate Carbon Footprint', route: '/calculator' },
    { id: 'certs', text: 'Green Certifications', route: '/certifications' },
    { id: 'rewards', text: 'How to earn rewards?', query: 'How do I earn eco-points?' },
  ];

  const handleQuickReply = (reply) => {
    if (reply.query) {
      sendMessage(reply.query);
    } else if (reply.route) {
      sendMessage(`Take me to ${reply.text}`);
    }
  };

  const windowVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        type: 'spring',
        damping: 25,
        stiffness: 300
      }
    },
    exit: {
      opacity: 0,
      y: 50,
      scale: 0.9,
      transition: { duration: 0.2 }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed bottom-24 right-6 w-80 sm:w-96 h-[500px] bg-white rounded-2xl shadow-xl flex flex-col overflow-hidden z-40 border border-primary-100"
          variants={windowVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-primary-700 to-primary-600 text-white p-4 flex items-center justify-between shadow-md">
            <div className="flex items-center">
              <div className="bg-white rounded-full mr-3 w-10 h-10 flex items-center justify-center shadow-md">
                <img src={chatbotLogo} alt="EcoGuide" className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-bold text-base tracking-wide">EcoGuide</h3>
                <p className="text-xs text-white">Your sustainable travel assistant</p>
              </div>
            </div>
            <button 
              onClick={closeChat}
              className="text-white hover:text-white bg-primary-800/40 hover:bg-primary-800/60 p-2 rounded-full transition-colors"
              aria-label="Close chat window"
            >
              <FaTimes />
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-5 bg-gray-50 chatbot-messages">
            <div className="space-y-6">
              {messages.map((msg, index) => (
                <motion.div 
                  key={index} 
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {msg.sender === 'bot' && (
                    <div className="bg-primary-100 rounded-full p-2 mr-2 self-end w-8 h-8 flex items-center justify-center shadow-md">
                      <img src={chatbotLogo} alt="EcoGuide" className="w-6 h-6" />
                    </div>
                  )}
                  <div 
                    className={msg.sender === 'user' 
                      ? 'chatbot-message-user font-medium' 
                      : 'chatbot-message-bot'
                    }
                  >
                    {msg.text}
                    {msg.options && (
                      <div className="mt-4 space-y-2">
                        {msg.options.map((option, i) => (
                          <button
                            key={i}
                            onClick={() => sendMessage(option.text, option.value)}
                            className="block w-full text-left px-4 py-2 text-sm quick-reply-button"
                          >
                            {option.text}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-primary-100 rounded-full p-2 mr-2 self-end w-8 h-8 flex items-center justify-center shadow-md">
                    <img src={chatbotLogo} alt="EcoGuide" className="w-6 h-6" />
                  </div>
                  <div className="bg-white border border-gray-200 p-3 rounded-lg rounded-bl-none inline-flex space-x-2 shadow-sm">
                    <div className="h-2 w-2 bg-gray-500 rounded-full typing-indicator-dot"></div>
                    <div className="h-2 w-2 bg-gray-500 rounded-full typing-indicator-dot"></div>
                    <div className="h-2 w-2 bg-gray-500 rounded-full typing-indicator-dot"></div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Quick Replies */}
          {messages.length < 3 && (
            <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
              <p className="text-xs font-medium text-gray-700 mb-2">Suggested topics:</p>
              <div className="flex flex-wrap gap-2">
                {quickReplies.map(reply => (
                  <button
                    key={reply.id}
                    onClick={() => handleQuickReply(reply)}
                    className="quick-reply-button"
                  >
                    {reply.text}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Form */}
          <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 bg-white shadow-inner">
            <div className="flex rounded-full border border-gray-300 overflow-hidden focus-within:ring-2 focus-within:ring-primary-500 focus-within:border-primary-500 bg-white shadow-sm">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 focus:outline-none text-gray-800 chatbot-input"
                ref={inputRef}
              />
              <button
                type="submit"
                className={`chatbot-send-button ${!inputMessage.trim() ? 'disabled' : ''}`}
                disabled={!inputMessage.trim()}
                aria-label="Send message"
              >
                {isTyping ? (
                  <FaSpinner className="animate-spin" />
                ) : (
                  <FaPaperPlane />
                )}
              </button>
            </div>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ChatWindow; 