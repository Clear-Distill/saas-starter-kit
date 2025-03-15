import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import { 
  PaperAirplaneIcon, 
  PaperClipIcon, 
  DocumentIcon, 
  XMarkIcon,
  ChatBubbleLeftRightIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  attachments?: Attachment[];
}

interface Attachment {
  id: string;
  name: string;
  size: number;
  type: string;
}

interface ReportChatProps {
  reportId: string;
}

const ReportChat: React.FC<ReportChatProps> = ({ reportId }) => {
  const { t } = useTranslation('common');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: t('chat-welcome-message'),
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom of messages when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim() && attachments.length === 0) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      isUser: true,
      timestamp: new Date(),
      attachments: attachments.length > 0 ? [...attachments] : undefined,
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setAttachments([]);
    setIsLoading(true);
    
    // Simulate API call to get response
    // In a real implementation, this would be an API call to a backend service
    setTimeout(() => {
      let responseContent = `This is a simulated response to your question`;
      
      if (inputValue.trim()) {
        responseContent += ` about "${inputValue}"`;
      }
      
      if (attachments.length > 0) {
        responseContent += ` and your ${attachments.length} attached document${attachments.length > 1 ? 's' : ''}`;
      }
      
      responseContent += ` for report ${reportId}. In a real implementation, this would be a response from an AI or backend service.`;
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: responseContent,
        isUser: false,
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, botMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).map(file => ({
        id: Date.now() + Math.random().toString(),
        name: file.name,
        size: file.size,
        type: file.type
      }));
      
      setAttachments(prev => [...prev, ...newFiles]);
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removeAttachment = (id: string) => {
    setAttachments(prev => prev.filter(attachment => attachment.id !== id));
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-3 flex items-center">
        <ChatBubbleLeftRightIcon className="h-5 w-5 text-blue-500 mr-2" />
        <h3 className="text-sm font-medium text-gray-900 dark:text-white">
          {t('chat-assistant')}
        </h3>
      </div>
      
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div className="flex items-start max-w-[80%]">
                {!message.isUser && (
                  <div className="flex-shrink-0 mr-2 mt-1">
                    <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                      <ChatBubbleLeftRightIcon className="h-5 w-5 text-blue-600 dark:text-blue-300" />
                    </div>
                  </div>
                )}
                
                <div
                  className={`rounded-lg px-4 py-2 ${
                    message.isUser
                      ? 'bg-blue-600 text-white'
                      : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  
                  {/* Attachments */}
                  {message.attachments && message.attachments.length > 0 && (
                    <div className="mt-2 space-y-2">
                      {message.attachments.map((attachment) => (
                        <div 
                          key={attachment.id}
                          className={`flex items-center p-2 rounded ${
                            message.isUser 
                              ? 'bg-blue-700' 
                              : 'bg-gray-100 dark:bg-gray-600'
                          }`}
                        >
                          <DocumentIcon className={`h-5 w-5 mr-2 ${
                            message.isUser ? 'text-blue-200' : 'text-blue-500 dark:text-blue-300'
                          }`} />
                          <div className="overflow-hidden">
                            <p className={`text-xs font-medium truncate ${
                              message.isUser ? 'text-white' : 'text-gray-900 dark:text-white'
                            }`}>
                              {attachment.name}
                            </p>
                            <p className={`text-xs ${
                              message.isUser ? 'text-blue-200' : 'text-gray-500 dark:text-gray-300'
                            }`}>
                              {formatFileSize(attachment.size)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div
                    className={`text-xs mt-1 ${
                      message.isUser ? 'text-blue-200' : 'text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>
                
                {message.isUser && (
                  <div className="flex-shrink-0 ml-2 mt-1">
                    <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                      <UserCircleIcon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex items-start">
                <div className="flex-shrink-0 mr-2 mt-1">
                  <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                    <ChatBubbleLeftRightIcon className="h-5 w-5 text-blue-600 dark:text-blue-300" />
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-2 border border-gray-200 dark:border-gray-600">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      {/* Attachments Preview */}
      {attachments.length > 0 && (
        <div className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 p-2">
          <div className="flex flex-wrap gap-2">
            {attachments.map((file) => (
              <div 
                key={file.id} 
                className="flex items-center bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700 p-2 pr-3"
              >
                <DocumentIcon className="h-4 w-4 text-blue-500 mr-2" />
                <span className="text-xs text-gray-700 dark:text-gray-300 max-w-[150px] truncate">
                  {file.name}
                </span>
                <button 
                  onClick={() => removeAttachment(file.id)}
                  className="ml-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Input Area */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-800">
        <form onSubmit={handleSendMessage} className="flex space-x-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={t('type-your-question')}
            className="flex-1 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            disabled={isLoading}
          />
          
          {/* File Input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            multiple
          />
          
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
            className="inline-flex items-center justify-center rounded-md bg-gray-200 dark:bg-gray-700 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50"
          >
            <PaperClipIcon className="h-4 w-4" />
          </button>
          
          <button
            type="submit"
            disabled={isLoading || (!inputValue.trim() && attachments.length === 0)}
            className="inline-flex items-center justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            <PaperAirplaneIcon className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReportChat;
