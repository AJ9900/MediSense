import React, { useState } from 'react';
import API from '../services/api';
import { Bot, MessageSquare, X, Send, Sparkles, AlertCircle, Globe } from 'lucide-react';

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [language, setLanguage] = useState('en'); // 'en' | 'hi'
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: 'Hello! I am MediSense AI Health Assistant. How can I assist you with hospital services, departments, or token status today?',
      disclaimer: 'Informational guidance only. Not a medical diagnosis.'
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setIsTyping(true);

    try {
      const response = await API.post('/ai/chat', { query: userMsg, language });
      const { reply, disclaimer } = response.data.data;
      setMessages(prev => [...prev, { sender: 'ai', text: reply, disclaimer }]);
    } catch (err) {
      setMessages(prev => [...prev, { 
        sender: 'ai', 
        text: 'I am currently operating in offline mode. Please check the Find Doctors tab for department assistance.',
        disclaimer: 'Informational guidance only.'
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-[#FF5841] to-[#C53678] hover:from-[#ea3e26] hover:to-[#ab2261] text-white p-4 rounded-full shadow-2xl shadow-[#FF5841]/40 flex items-center gap-2 border border-white/20 transition hover:scale-105"
        >
          <Bot className="w-6 h-6 animate-pulse" />
          <span className="text-xs font-bold hidden sm:inline">AI Health Assistant</span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-80 sm:w-96 h-[500px] flex flex-col justify-between overflow-hidden animate-in fade-in zoom-in duration-200">
          
          {/* Header */}
          <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-sky-500 flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-sm">MediSense AI Assistant</h3>
                <p className="text-[10px] text-sky-300">English + Hindi Support</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Language Switcher */}
              <button
                onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
                className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-xs px-2.5 py-1 rounded-lg border border-slate-700 transition"
              >
                <Globe className="w-3.5 h-3.5 text-sky-400" />
                <span className="font-bold">{language === 'en' ? 'EN' : 'HI'}</span>
              </button>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages Body */}
          <div className="p-4 flex-1 overflow-y-auto space-y-3 bg-slate-50 scrollbar-thin">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-sky-600 text-white rounded-br-none shadow-sm'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none shadow-sm'
                  }`}
                >
                  <p>{m.text}</p>
                  {m.disclaimer && (
                    <div className="mt-1.5 pt-1.5 border-t border-slate-200/60 text-[9px] text-slate-500 font-medium italic flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 text-amber-500 shrink-0" />
                      <span>{m.disclaimer}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex items-center gap-2 text-xs text-slate-400 italic bg-white p-2.5 rounded-xl border border-slate-200 w-fit">
                <Sparkles className="w-3.5 h-3.5 text-sky-500 animate-spin" />
                <span>AI is thinking...</span>
              </div>
            )}
          </div>

          {/* Input Footer */}
          <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
            <input
              type="text"
              placeholder={language === 'hi' ? 'अपनी समस्या लिखें...' : 'Ask a question...'}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 text-xs py-2.5 px-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="p-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl disabled:opacity-50 transition"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}
    </div>
  );
}
