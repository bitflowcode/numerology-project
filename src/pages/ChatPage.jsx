import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Copy, Check, ChevronDown } from 'lucide-react';
import { sendChatMessage } from '../services/numerologyApi';

const ChatPage = () => {
  const navigate = useNavigate();
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [messageCount, setMessageCount] = useState(0);
  const [typingMessageIndex, setTypingMessageIndex] = useState(null);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [showScrollIndicator, setShowScrollIndicator] = useState(false);

  const CHAT_STORAGE_KEY = 'numerology_chat_history';
  const CHAT_COUNT_KEY = 'numerology_chat_count';
  const messagesContainerRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Load chat history from localStorage
  useEffect(() => {
    try {
      const savedMessages = localStorage.getItem(CHAT_STORAGE_KEY);
      const savedCount = localStorage.getItem(CHAT_COUNT_KEY);
      if (savedMessages) {
        setChatMessages(JSON.parse(savedMessages));
      }
      if (savedCount) {
        setMessageCount(parseInt(savedCount, 10));
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
    }
  }, []);

  // Save messages to localStorage
  useEffect(() => {
    if (chatMessages.length > 0) {
      try {
        localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(chatMessages));
      } catch (error) {
        console.error('Error saving chat history:', error);
      }
    }
  }, [chatMessages]);

  // Save message count
  useEffect(() => {
    if (messageCount > 0) {
      try {
        localStorage.setItem(CHAT_COUNT_KEY, messageCount.toString());
      } catch (error) {
        console.error('Error saving message count:', error);
      }
    }
  }, [messageCount]);

  // Check if there's content below the viewport
  useEffect(() => {
    const checkScrollIndicator = () => {
      if (messagesContainerRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
        const isScrolledToBottom = scrollHeight - scrollTop - clientHeight < 50;
        setShowScrollIndicator(!isScrolledToBottom && chatMessages.length > 0);
      }
    };

    checkScrollIndicator();
    const container = messagesContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScrollIndicator);
      return () => container.removeEventListener('scroll', checkScrollIndicator);
    }
  }, [chatMessages, typingMessageIndex]);

  // Typing effect for assistant messages
  const simulateTyping = (message, index) => {
    const fullText = message.content;
    let currentIndex = 0;

    const typingInterval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setChatMessages(prev => {
          const newMessages = [...prev];
          newMessages[index] = {
            ...newMessages[index],
            displayContent: fullText.substring(0, currentIndex)
          };
          return newMessages;
        });
        currentIndex++;
      } else {
        clearInterval(typingInterval);
        setTypingMessageIndex(null);
      }
    }, 10); // Speed: 10ms per character

    return () => clearInterval(typingInterval);
  };

  // Send message handler
  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;

    setIsSendingMessage(true);

    try {
      // Create user message
      const userMessage = {
        role: 'user',
        content: chatInput.trim(),
        timestamp: Date.now()
      };

      // Add user message to chat
      const updatedMessages = [...chatMessages, userMessage];
      setChatMessages(updatedMessages);
      setChatInput('');

      // Prepare conversation history (last 10 messages)
      const conversationHistory = updatedMessages.slice(-10);

      // Call API
      const response = await sendChatMessage(userMessage.content, conversationHistory);

      // Add Claude's response with typing effect
      const assistantMessage = {
        role: 'assistant',
        content: response.response,
        displayContent: '', // For typing effect
        timestamp: Date.now()
      };

      const newMessages = [...updatedMessages, assistantMessage];
      setChatMessages(newMessages);
      setMessageCount(prev => prev + 1);

      // Start typing effect
      const messageIndex = newMessages.length - 1;
      setTypingMessageIndex(messageIndex);
      simulateTyping(assistantMessage, messageIndex);

    } catch (error) {
      console.error('Error sending message:', error);
      // Show error message
      const errorMessage = {
        role: 'assistant',
        content: `❌ Error: ${error.message || 'No se pudo enviar el mensaje'}`,
        displayContent: `❌ Error: ${error.message || 'No se pudo enviar el mensaje'}`,
        timestamp: Date.now(),
        isError: true
      };
      setChatMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsSendingMessage(false);
    }
  };

  // Clear chat
  const handleClearChat = () => {
    if (confirm('¿Borrar toda la conversación?')) {
      setChatMessages([]);
      setMessageCount(0);
      localStorage.removeItem(CHAT_STORAGE_KEY);
      localStorage.removeItem(CHAT_COUNT_KEY);
    }
  };

  // Copy message to clipboard
  const handleCopyMessage = async (content, index) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (error) {
      console.error('Error copying to clipboard:', error);
    }
  };

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Handle Enter key
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Render markdown (simplified version from NumerologyCards)
  const renderMarkdown = (text) => {
    if (!text) return '';

    const cleanBold = (str) => str.replace(/\*\*(.+?)\*\*/g, '$1');
    const lines = text.split('\n');
    let html = '';
    let inList = false;

    lines.forEach((line) => {
      if (line.startsWith('### ')) {
        if (inList) { html += '</ul>'; inList = false; }
        const content = cleanBold(line.slice(4));
        html += `<h3 class="text-base sm:text-lg font-bold text-gray-800 mt-3 mb-2">${content}</h3>`;
      } else if (line.startsWith('## ')) {
        if (inList) { html += '</ul>'; inList = false; }
        const content = cleanBold(line.slice(3));
        html += `<h2 class="text-lg sm:text-xl font-bold text-gray-800 mt-4 mb-2">${content}</h2>`;
      } else if (line.startsWith('# ')) {
        if (inList) { html += '</ul>'; inList = false; }
        const content = cleanBold(line.slice(2));
        html += `<h1 class="text-xl sm:text-2xl font-bold text-gray-800 mt-4 mb-3">${content}</h1>`;
      } else if (line.trim() === '---') {
        if (inList) { html += '</ul>'; inList = false; }
        html += '<hr class="my-3 border-gray-300" />';
      } else if (line.startsWith('- ')) {
        if (!inList) {
          html += '<ul class="list-disc list-inside mb-2 text-gray-700 ml-4">';
          inList = true;
        }
        const content = line.slice(2).replace(/\*\*(.+?)\*\*/g, '<strong class="font-bold">$1</strong>');
        html += `<li class="mb-1">${content}</li>`;
      } else if (line.trim() === '') {
        if (inList) { html += '</ul>'; inList = false; }
        html += '<br/>';
      } else {
        if (inList) { html += '</ul>'; inList = false; }
        const content = line.replace(/\*\*(.+?)\*\*/g, '<strong class="font-bold">$1</strong>');
        html += `<p class="mb-2 text-gray-700">${content}</p>`;
      }
    });

    if (inList) html += '</ul>';
    return `<div class="text-left leading-relaxed">${html}</div>`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 via-white to-purple-50">
      {/* Header - Fixed */}
      <div className="fixed top-0 left-0 right-0 z-20 bg-white/95 backdrop-blur-sm border-b-2 border-purple-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-3 sm:py-4 flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-700 hover:text-purple-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            <span className="font-semibold text-sm sm:text-base">Volver</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-2xl">🔮</span>
            <h1 className="text-lg sm:text-xl font-bold text-gray-800">Chat con IA</h1>
          </div>

          <button
            onClick={handleClearChat}
            className="text-xs sm:text-sm text-gray-500 hover:text-red-600 transition-colors"
          >
            🗑️ Limpiar
          </button>
        </div>
      </div>

      {/* Messages Container - with padding for fixed header and input */}
      <div
        ref={messagesContainerRef}
        className="overflow-y-auto pt-16 sm:pt-20 pb-32 sm:pb-36"
        style={{ height: '100vh' }}
      >
        <div className="max-w-4xl mx-auto px-4 py-4 sm:py-6 space-y-4">
          {/* Empty state */}
          {chatMessages.length === 0 && (
            <div className="text-center text-gray-500 py-16">
              <div className="text-6xl sm:text-7xl mb-4">🔮</div>
              <h2 className="text-xl sm:text-2xl font-bold mb-2">Inicia una conversación</h2>
              <p className="text-sm sm:text-base">Pregunta lo que quieras sobre numerología</p>
            </div>
          )}

          {/* Messages */}
          {chatMessages.map((msg, index) => (
            <div key={index} className={`flex items-start gap-2 sm:gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              {/* Avatar */}
              <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                msg.role === 'user'
                  ? 'bg-gradient-to-br from-blue-400 to-blue-600'
                  : 'bg-gradient-to-br from-purple-400 to-pink-500'
              }`}>
                <span className="text-sm sm:text-base">{msg.role === 'user' ? '👤' : '🔮'}</span>
              </div>

              {/* Message bubble */}
              <div className="flex-1 max-w-[85%] sm:max-w-[80%]">
                <div className={`group relative px-4 py-3 rounded-2xl ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-br from-blue-100 to-blue-200'
                    : msg.isError
                    ? 'bg-red-50 border-2 border-red-200'
                    : 'bg-white border-2 border-gray-200'
                }`}>
                  <div
                    className="text-sm sm:text-base"
                    dangerouslySetInnerHTML={{
                      __html: msg.role === 'assistant'
                        ? renderMarkdown(msg.displayContent || msg.content)
                        : `<p class="text-gray-800">${msg.content}</p>`
                    }}
                  />

                  {/* Copy button for assistant messages */}
                  {msg.role === 'assistant' && !msg.isError && (
                    <button
                      onClick={() => handleCopyMessage(msg.content, index)}
                      className="absolute top-2 right-2 p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors opacity-0 group-hover:opacity-100"
                      title="Copiar respuesta"
                    >
                      {copiedIndex === index ? (
                        <Check className="w-4 h-4 text-green-600" />
                      ) : (
                        <Copy className="w-4 h-4 text-gray-600" />
                      )}
                    </button>
                  )}

                  {/* Typing indicator */}
                  {typingMessageIndex === index && (
                    <span className="inline-block w-1 h-4 bg-purple-500 animate-pulse ml-1"></span>
                  )}
                </div>

                {/* Timestamp */}
                <div className={`text-xs text-gray-500 mt-1 px-1 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                  {new Date(msg.timestamp).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}

          {/* "Claude is typing..." indicator */}
          {isSendingMessage && (
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center flex-shrink-0">
                <span className="text-sm sm:text-base">🔮</span>
              </div>
              <div className="px-4 py-3 rounded-2xl bg-white border-2 border-gray-200">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Scroll indicator */}
      {showScrollIndicator && (
        <button
          onClick={scrollToBottom}
          className="fixed bottom-32 sm:bottom-40 left-1/2 transform -translate-x-1/2 z-30 p-3 rounded-full bg-purple-500 text-white shadow-xl hover:bg-purple-600 transition-all animate-bounce"
        >
          <ChevronDown className="w-5 h-5" />
        </button>
      )}

      {/* Input Area - Fixed at bottom */}
      <div className="fixed bottom-0 left-0 right-0 z-20 bg-white border-t-2 border-purple-200 shadow-lg">
        <div className="max-w-4xl mx-auto px-4 py-3 sm:py-4">
          <div className="flex gap-2 items-end">
            <textarea
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Pregunta sobre numerología..."
              rows="1"
              disabled={isSendingMessage}
              className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
              style={{ minHeight: '48px', maxHeight: '120px', fontSize: '16px' }}
            />

            <button
              onClick={handleSendMessage}
              disabled={isSendingMessage || !chatInput.trim()}
              className={`px-5 py-3 rounded-2xl font-bold text-white transition-all duration-300 flex-shrink-0 ${
                isSendingMessage || !chatInput.trim()
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:shadow-lg active:scale-95'
              }`}
              style={{ fontSize: '16px' }}
            >
              {isSendingMessage ? '...' : 'Enviar'}
            </button>
          </div>

          {/* Message counter */}
          <div className="mt-2 text-xs text-gray-500 text-center">
            Mensajes enviados: {messageCount}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
