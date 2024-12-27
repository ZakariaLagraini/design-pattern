import { useState, useRef, useEffect } from 'react';
import { PaperAirplaneIcon, XMarkIcon } from '@heroicons/react/24/outline';
import axios from 'axios';

// Create axios instance directly in the component
const api = axios.create({
  baseURL: 'http://localhost:8080',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { type: 'bot', content: 'Hello! How can I help you with design patterns today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      // Add user message
      setMessages(prev => [...prev, { type: 'user', content: input }]);
      
      // Show typing indicator
      setMessages(prev => [...prev, { type: 'bot', content: 'Typing...', isLoading: true }]);
      
      // Send message to backend
      const response = await api.post('/api/chat/ask', input, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      // Remove typing indicator and add AI response
      setMessages(prev => {
        const filtered = prev.filter(msg => !msg.isLoading);
        return [...filtered, { 
          type: 'bot', 
          content: response.data.candidates[0].content.parts[0].text 
        }];
      });
    } catch (err) {
      console.error('Chat error:', err);
      setError('Failed to get response. Please try again.');
      setMessages(prev => {
        const filtered = prev.filter(msg => !msg.isLoading);
        return [...filtered, { 
          type: 'bot', 
          content: 'Sorry, I encountered an error. Please try again.' 
        }];
      });
    } finally {
      setIsLoading(false);
      setInput('');
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 p-4 rounded-full shadow-lg bg-primary-500 hover:bg-primary-600 text-white transition-all duration-200 z-50"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      </button>

      {isOpen && (
        <div className="fixed bottom-20 right-4 w-96 rounded-lg shadow-xl bg-white overflow-hidden z-50">
          <div className="p-4 bg-primary-500 text-white flex justify-between items-center">
            <h3 className="font-medium">Design Pattern Assistant</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-full hover:bg-white/20 transition-colors"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>

          <div className="h-96 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 
                    ${message.type === 'user' 
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-100 text-gray-900'
                    } ${message.isLoading ? 'animate-pulse' : ''}`}
                >
                  {message.content}
                </div>
              </div>
            ))}
            {error && (
              <div className="p-2 text-red-500 text-sm text-center">
                {error}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSubmit} className="p-4 border-t">
            <div className="flex space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                disabled={isLoading}
                className="flex-1 rounded-lg px-4 py-2 text-sm bg-gray-100 border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <button
                type="submit"
                disabled={isLoading}
                className={`p-2 rounded-lg ${
                  isLoading ? 'bg-gray-400' : 'bg-primary-500 hover:opacity-90'
                } text-white transition-opacity`}
              >
                {isLoading ? (
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                ) : (
                  <PaperAirplaneIcon className="h-5 w-5" />
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
} 