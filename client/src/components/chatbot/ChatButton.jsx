import React from 'react';
import { motion } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';
import '../../assets/styles/chatbot.css';
import chatbotLogo from '../../assets/chatbot-logo.svg';

const ChatButton = ({ isOpen, toggleChat }) => {
  return (
    <motion.button
      className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-primary-600 text-white flex items-center justify-center shadow-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 z-50 chatbot-button"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleChat}
      aria-label={isOpen ? "Close chatbot" : "Open chatbot"}
    >
      {isOpen ? (
        <FaTimes className="text-2xl" />
      ) : (
        <>
          <img src={chatbotLogo} alt="EcoGuide" className="w-8 h-8" />
          <span className="absolute top-0 right-0 h-3 w-3 rounded-full bg-accent-500 animate-pulse"></span>
        </>
      )}
    </motion.button>
  );
};

export default ChatButton; 