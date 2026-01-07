
import React from 'react';
import { Message, MessageRole } from '../types';

interface MessageItemProps {
  message: Message;
}

const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
  const isBot = message.role === MessageRole.BOT;

  // Simple formatting helper
  const formatText = (text: string) => {
    return text.split('\n').map((line, i) => (
      <p key={i} className={line.trim() === '' ? 'h-2' : 'mb-1'}>
        {line.split(/(\*\*.*?\*\*)/).map((part, j) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={j} className="font-bold text-slate-900">{part.slice(2, -2)}</strong>;
          }
          return part;
        })}
      </p>
    ));
  };

  return (
    <div className={`flex ${isBot ? 'justify-start' : 'justify-end'} group animate-in fade-in slide-in-from-bottom-2 duration-300`}>
      <div className={`flex max-w-[85%] sm:max-w-[75%] ${isBot ? 'flex-row' : 'flex-row-reverse'}`}>
        {isBot && (
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-2 mt-1">
            <span className="text-xs font-bold">AI</span>
          </div>
        )}
        
        <div className={`flex flex-col ${isBot ? 'items-start' : 'items-end'}`}>
          <div 
            className={`rounded-2xl px-4 py-3 shadow-sm ${
              isBot 
                ? 'bg-white border border-slate-200 text-slate-700' 
                : 'bg-blue-600 text-white'
            }`}
          >
            {message.image && (
              <div className="mb-2 overflow-hidden rounded-lg">
                <img 
                  src={message.image} 
                  alt="User uploaded content" 
                  className="max-w-full h-auto max-h-60 object-contain bg-slate-100" 
                />
              </div>
            )}
            <div className="text-sm leading-relaxed whitespace-pre-wrap">
              {isBot ? formatText(message.text) : message.text}
            </div>
          </div>
          <span className="text-[10px] text-slate-400 mt-1 px-1">
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MessageItem;
