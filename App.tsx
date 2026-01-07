
import React, { useState, useRef, useEffect } from 'react';
import { Message, MessageRole } from './types';
import { QUICK_ACTIONS } from './constants';
import { getChatResponse } from './geminiService';
import MessageItem from './components/MessageItem';
import QuickActions from './components/QuickActions';
import ImageUploader from './components/ImageUploader';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: MessageRole.BOT,
      text: "Hello! I'm your Travel Policy Explainer. I can help you understand booking processes, cancellation rules, and travel documentation. How can I assist you today?",
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (text: string, image?: string) => {
    if (!text.trim() && !image) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: MessageRole.USER,
      text: text,
      image: image,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setSelectedImage(null);
    setIsTyping(true);

    const botResponse = await getChatResponse(text || "Please analyze this travel document image.", image);
    
    const botMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: MessageRole.BOT,
      text: botResponse,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, botMessage]);
    setIsTyping(false);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputText, selectedImage || undefined);
  };

  return (
    <div className="flex flex-col h-screen max-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-4 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white text-xl font-bold shadow-sm">
            ✈️
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-800 leading-tight">TravelGuide AI</h1>
            <p className="text-xs text-slate-500 font-medium">Policy & Process Explainer</p>
          </div>
        </div>
        <div className="hidden sm:block">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            System Online
          </span>
        </div>
      </header>

      {/* Warning Banner */}
      <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-center">
        <p className="text-xs text-amber-800 font-medium italic">
          ⚠️ Information Only. No real bookings or transactions can be performed here.
        </p>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {messages.map((msg) => (
            <MessageItem key={msg.id} message={msg} />
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white border border-slate-200 rounded-2xl px-4 py-3 shadow-sm">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce [animation-delay:-.15s]"></div>
                  <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce [animation-delay:-.3s]"></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Bottom UI */}
      <footer className="bg-white border-t border-slate-200 p-4 sticky bottom-0 z-10">
        <div className="max-w-3xl mx-auto space-y-4">
          {/* Quick Actions - Only show at start or when empty history */}
          {messages.length < 5 && (
            <QuickActions onSelect={(action) => handleSendMessage(action.prompt)} />
          )}

          {/* Input Area */}
          <form onSubmit={handleFormSubmit} className="relative">
            {selectedImage && (
              <div className="absolute bottom-full mb-2 bg-white p-2 rounded-lg border border-slate-200 shadow-lg flex items-center space-x-2">
                <img src={selectedImage} alt="Selected" className="h-12 w-12 object-cover rounded" />
                <span className="text-xs text-slate-500">Document attached</span>
                <button 
                  type="button" 
                  onClick={() => setSelectedImage(null)}
                  className="p-1 bg-slate-100 hover:bg-slate-200 rounded-full"
                >
                  <span className="text-xs">✕</span>
                </button>
              </div>
            )}
            
            <div className="flex items-center space-x-2">
              <ImageUploader onImageSelected={setSelectedImage} />
              
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Ask about cancellation, baggage, or visas..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-full px-5 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
                <button
                  type="submit"
                  disabled={isTyping || (!inputText.trim() && !selectedImage)}
                  className="absolute right-2 top-1.5 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:bg-slate-300 transition-colors shadow-sm"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                  </svg>
                </button>
              </div>
            </div>
          </form>
          
          <p className="text-[10px] text-center text-slate-400">
            Powered by Gemini AI • Always verify policies with your travel provider directly.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
