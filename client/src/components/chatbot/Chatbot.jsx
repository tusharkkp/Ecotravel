import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ChatButton from './ChatButton';
import ChatWindow from './ChatWindow';
import ChatbotService from '../../services/chatbotService';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const navigate = useNavigate();
  
  // Initialize chatbot with welcome message
  useEffect(() => {
    if (localStorage.getItem('chatbotWelcomeShown') !== 'true') {
      // Only show welcome message if it hasn't been shown before
      const welcomeMessage = ChatbotService.getWelcomeMessage();
      setMessages([
        { sender: 'bot', text: welcomeMessage.text, options: welcomeMessage.options }
      ]);
      localStorage.setItem('chatbotWelcomeShown', 'true');
    }
  }, []);
  
  // Toggle chat window
  const toggleChat = () => {
    if (!isOpen && messages.length === 0) {
      // If opening chat and no messages, show welcome message
      const welcomeMessage = ChatbotService.getWelcomeMessage();
      setMessages([
        { sender: 'bot', text: welcomeMessage.text, options: welcomeMessage.options }
      ]);
    }
    setIsOpen(!isOpen);
  };
  
  // Close chat window
  const closeChat = () => {
    setIsOpen(false);
  };
  
  // Add typing indicator and delay before showing bot response
  const simulateTyping = (response) => {
    return new Promise(resolve => {
      setIsTyping(true);
      
      // Calculate delay based on message length (faster typing for shorter messages)
      const baseDelay = 700;
      const charDelay = 25; // ms per character
      const delay = Math.min(
        baseDelay + (response.text.length * charDelay), 
        2000 // Cap at 2 seconds for long messages
      );
      
      setTimeout(() => {
        setIsTyping(false);
        resolve(response);
      }, delay);
    });
  };
  
  // Process user message and get bot response
  const processUserMessage = async (userMessage, optionValue) => {
    // Add user message to chat
    if (userMessage) {
      setMessages(prevMessages => [
        ...prevMessages,
        { sender: 'user', text: userMessage }
      ]);
    }
    
    let response;
    
    // If option value is provided, handle it directly
    if (optionValue) {
      response = ChatbotService.handleOptionSelection(optionValue);
    } else {
      // Otherwise process the user's message text
      response = ChatbotService.processMessage(userMessage);
    }
    
    // Simulate typing before showing response
    const typedResponse = await simulateTyping(response);
    
    // Add bot response to chat
    setMessages(prevMessages => [
      ...prevMessages,
      { 
        sender: 'bot', 
        text: typedResponse.text, 
        options: typedResponse.options
      }
    ]);
    
    // Handle navigation if needed
    if (typedResponse.action === 'navigate' && typedResponse.route) {
      setTimeout(() => {
        navigate(typedResponse.route);
        // Optionally close the chat after navigation
        setIsOpen(false);
      }, 500);
    }
  };
  
  // Send message handler (called from ChatWindow)
  const sendMessage = (message, optionValue) => {
    processUserMessage(message, optionValue);
  };
  
  return (
    <>
      <ChatButton isOpen={isOpen} toggleChat={toggleChat} />
      <ChatWindow 
        isOpen={isOpen}
        messages={messages}
        sendMessage={sendMessage}
        isTyping={isTyping}
        closeChat={closeChat}
      />
    </>
  );
};

export default Chatbot; 