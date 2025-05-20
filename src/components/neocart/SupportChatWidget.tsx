
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageSquare, Send, X, Mic } from 'lucide-react';
import { cn } from '@/lib/utils';
// import Image from 'next/image'; // Not used currently

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string | React.ReactNode; 
  timestamp: string;
}

const initialBotMessageText = "Hi there! I'm SupportPal, your AI assistant for NeoCart. How can I help you today?\nHere are some common questions:";

const commonQueries = [
  "How to reset password?",
  "Order tracking assistance",
  "SmartOrder features",
  "Pricing information",
  "Integration questions",
];

const predefinedAnswers: { [key: string]: string } = {
  "How to reset password?": "You can reset your password by going to the login page and clicking 'Forgot Password'. If you need further help, please use our contact form.",
  "Order tracking assistance": "To track your order, log in to your NeoCart account and go to the 'Orders' section. You'll find tracking information there. For specific issues, our team can assist via the contact form.",
  "SmartOrder features": "SmartOrder offers real-time order tracking, smart inventory alerts, and seamless CRM integration to streamline your e-commerce operations! You can find more details on our features page.",
  "Pricing information": "For detailed pricing information, please visit our Pricing page or contact our sales team through the form on the Contact Us page.",
  "Integration questions": "SmartOrder is designed for easy integration. For specific questions about integrating with your existing systems, please provide more details through our contact form, and our technical team will assist you.",
};

interface SupportChatWidgetProps {
  isOpen: boolean;
  onToggle: () => void;
}

export default function SupportChatWidget({ isOpen, onToggle }: SupportChatWidgetProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const createInitialBotMessage = (): ChatMessage => ({
    id: `bot-initial-${Date.now()}`,
    sender: 'bot',
    text: initialBotMessageText,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  });

  const createQuickSelectMessage = (): ChatMessage => ({
    id: `bot-qs-${Date.now()}`,
    sender: 'bot',
    text: (
      <div className="flex flex-col space-y-2 items-start pt-2">
        {commonQueries.map((query) => (
          <Button
            key={query}
            variant="outline"
            size="sm"
            className="bg-white hover:bg-slate-100 text-primary border-primary/50 h-auto py-1.5 px-3 text-left w-full"
            onClick={() => handleQuickSelect(query)}
          >
            {query}
          </Button>
        ))}
      </div>
    ),
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  });

  useEffect(() => {
    if (isOpen) {
      if (inputRef.current) {
        inputRef.current.focus();
      }
      // Initialize messages only if chat is opened and messages are empty
      if (messages.length === 0) {
        setMessages([createInitialBotMessage(), createQuickSelectMessage()]);
      }
    }
  }, [isOpen]); // Removed messages from dependency array to prevent re-initialization on new message

  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollViewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
      if (scrollViewport) {
        scrollViewport.scrollTop = scrollViewport.scrollHeight;
      }
    }
  }, [messages]);
  
  const handleSendMessage = (text?: string) => {
    const messageText = text || inputValue;
    if (messageText.trim() === '') return;

    const newUserMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: messageText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    // Remove only the last quick select message if it exists
    setMessages(prevMessages => {
      const lastMessageIsQuickSelect = prevMessages.length > 0 && typeof prevMessages[prevMessages.length - 1].text !== 'string';
      const messagesWithoutLastQuickSelect = lastMessageIsQuickSelect ? prevMessages.slice(0, -1) : prevMessages;
      return [...messagesWithoutLastQuickSelect, newUserMessage];
    });
    
    setTimeout(() => {
      const botResponseText = predefinedAnswers[messageText] || "I'm still learning! For complex queries, please use the contact form on our website or try one of the quick options.";
      const newBotMessage: ChatMessage = {
        id: `bot-reply-${Date.now() + 1}`,
        sender: 'bot',
        text: botResponseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prevMessages => [...prevMessages, newBotMessage, createQuickSelectMessage()]);
    }, 1000);

    setInputValue('');
  };

  const handleQuickSelect = (query: string) => {
    handleSendMessage(query);
  };

  return (
    <>
      {!isOpen && (
        <Button
          onClick={onToggle}
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-primary text-white shadow-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 z-50 flex items-center justify-center"
          aria-label="Open chat"
        >
          <MessageSquare size={28} />
        </Button>
      )}

      {isOpen && (
        <div className="fixed bottom-6 right-6 w-full max-w-sm h-[calc(100vh-7rem)] max-h-[600px] bg-slate-50 rounded-xl shadow-2xl flex flex-col z-50 border border-slate-200">
          <div className="flex items-center justify-between p-4 bg-primary text-white rounded-t-xl">
            <div className="flex items-center gap-2">
              <MessageSquare size={20} />
              <h3 className="font-semibold text-lg">SupportPal AI</h3>
            </div>
            <Button variant="ghost" size="icon" onClick={onToggle} className="text-white hover:bg-primary/80 h-8 w-8">
              <X size={20} />
            </Button>
          </div>

          <ScrollArea ref={scrollAreaRef} className="flex-1 p-4 bg-white">
            <div className="space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    "flex w-full max-w-[85%]",
                    msg.sender === 'user' ? 'ml-auto justify-end' : 'mr-auto justify-start'
                  )}
                >
                  <div className="flex items-end gap-2">
                    {msg.sender === 'bot' && (
                       <div className="flex-shrink-0 h-7 w-7 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">
                         <MessageSquare size={16} />
                       </div>
                    )}
                    <div
                      className={cn(
                        'p-3 rounded-lg shadow-sm text-sm',
                        msg.sender === 'user'
                          ? 'bg-primary/90 text-white rounded-br-none'
                          : 'bg-slate-100 text-slate-800 rounded-bl-none'
                      )}
                    >
                      {typeof msg.text === 'string' ? <p className="whitespace-pre-wrap">{msg.text}</p> : msg.text}
                      <div className={cn(
                        "text-xs mt-1.5",
                        msg.sender === 'user' ? 'text-primary-foreground/70 text-right' : 'text-slate-500 text-left'
                        )}
                      >
                        {msg.timestamp}
                      </div>
                    </div>
                     {msg.sender === 'user' && (
                        <div className="flex-shrink-0 h-7 w-7 rounded-full bg-slate-300 text-slate-600 flex items-center justify-center text-sm font-bold" data-ai-hint="user avatar">
                          U
                       </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          <div className="p-3 border-t border-slate-200 bg-slate-50 rounded-b-xl">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <Input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 bg-white border-slate-300 focus:border-primary focus:ring-primary/50 text-sm"
                autoComplete="off"
              />
              <Button type="button" variant="ghost" size="icon" className="text-slate-500 hover:text-primary h-9 w-9">
                <Mic size={18} />
                <span className="sr-only">Voice input</span>
              </Button>
              <Button type="submit" size="icon" className="bg-primary hover:bg-primary/90 text-white h-9 w-9" disabled={!inputValue.trim()}>
                <Send size={18} />
                <span className="sr-only">Send</span>
              </Button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
