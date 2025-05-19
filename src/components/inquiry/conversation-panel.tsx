
"use client";

import type React from "react";
import { useState } from "react";
import { Paperclip, Send, Smile } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import type { Message, UserProfile, Customer } from "@/types/support";
import { format } from 'date-fns';

interface ConversationPanelProps {
  messages: Message[];
  currentUser: UserProfile;
  customer: Customer | undefined;
  onSendMessage: (content: string) => void;
}

const ConversationPanel: React.FC<ConversationPanelProps> = ({ messages, currentUser, customer, onSendMessage }) => {
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      onSendMessage(newMessage.trim());
      setNewMessage("");
    }
  };

  const getMessageAvatar = (senderType: Message['sender']) => {
    if (senderType === 'agent') return currentUser.avatarUrl;
    if (senderType === 'customer') return customer?.avatarUrl;
    return 'https://placehold.co/40x40.png'; // System or default
  }

  const getMessageSenderName = (senderType: Message['sender']) => {
    if (senderType === 'agent') return currentUser.name;
    if (senderType === 'customer') return customer?.name || 'Customer';
    return 'System';
  }

  return (
    <div className="flex flex-col h-full bg-card rounded-lg shadow">
      <ScrollArea className="flex-1 p-4 md:p-6 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              "flex items-start gap-3",
              msg.sender === "agent" ? "justify-end" : "justify-start"
            )}
          >
            {msg.sender === "customer" && (
              <Avatar className="h-8 w-8 border">
                <AvatarImage src={getMessageAvatar(msg.sender)} alt={getMessageSenderName(msg.sender)} data-ai-hint="person avatar" />
                <AvatarFallback>{getMessageSenderName(msg.sender).charAt(0)}</AvatarFallback>
              </Avatar>
            )}
            <div
              className={cn(
                "max-w-[70%] rounded-xl p-3 text-sm",
                msg.sender === "agent"
                  ? "bg-primary text-primary-foreground rounded-br-none"
                  : "bg-secondary text-secondary-foreground rounded-bl-none"
              )}
            >
              <p className="font-semibold mb-0.5 text-xs">{msg.sender === 'agent' ? 'You' : getMessageSenderName(msg.sender)}</p>
              <p>{msg.content}</p>
              <p className="text-xs opacity-70 mt-1 text-right">
                {format(new Date(msg.timestamp), "MMM d, HH:mm")}
              </p>
            </div>
            {msg.sender === "agent" && (
              <Avatar className="h-8 w-8 border">
                <AvatarImage src={getMessageAvatar(msg.sender)} alt={getMessageSenderName(msg.sender)} data-ai-hint="agent avatar" />
                <AvatarFallback>{getMessageSenderName(msg.sender).charAt(0)}</AvatarFallback>
              </Avatar>
            )}
          </div>
        ))}
      </ScrollArea>
      <div className="border-t p-4">
        <div className="relative">
          <Textarea
            placeholder="Type your message here..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                }
            }}
            className="min-h-[80px] resize-none pr-20 rounded-lg border-input focus:border-primary"
          />
          <div className="absolute right-3 top-3 flex items-center gap-1">
            <Button variant="ghost" size="icon">
              <Smile className="h-5 w-5 text-muted-foreground" />
              <span className="sr-only">Add emoji</span>
            </Button>
            <Button variant="ghost" size="icon">
              <Paperclip className="h-5 w-5 text-muted-foreground" />
              <span className="sr-only">Attach file</span>
            </Button>
            <Button size="icon" onClick={handleSendMessage} disabled={!newMessage.trim()}>
              <Send className="h-5 w-5" />
              <span className="sr-only">Send message</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversationPanel;
