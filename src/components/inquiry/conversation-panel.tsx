
"use client";

import type React from "react";
import { useEffect }from "react";
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
  initialDraftMessage?: string;
  onDraftChange: (content: string) => void; 
}

const ConversationPanel: React.FC<ConversationPanelProps> = ({ 
  messages, 
  currentUser, 
  customer, 
  onSendMessage,
  initialDraftMessage,
  onDraftChange
}) => {

  useEffect(() => {
    if (initialDraftMessage !== undefined && initialDraftMessage !== (document.getElementById('conversation-textarea') as HTMLTextAreaElement)?.value) {
      // This directly sets the textarea value. Consider if onDraftChange should be called instead
      // or if the parent truly controls this value. For now, this ensures "Use this response" works.
      const textarea = document.getElementById('conversation-textarea') as HTMLTextAreaElement;
      if (textarea) textarea.value = initialDraftMessage;
      // If the parent should also know about this change (e.g. to keep its own state in sync)
      // then call onDraftChange here.
      // onDraftChange(initialDraftMessage); 
    }
  }, [initialDraftMessage]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onDraftChange(e.target.value);
  };

  const handleSendMessageInternal = () => {
    const currentMessage = (document.getElementById('conversation-textarea') as HTMLTextAreaElement)?.value;
    if (currentMessage && currentMessage.trim()) {
      onSendMessage(currentMessage.trim());
      // Parent (InquiryDetailView) will clear its draftMessageForConversation state via onSendMessage
      // and this component's textarea will be cleared via the useEffect reacting to initialDraftMessage becoming ""
    }
  };

  const getMessageAvatar = (senderType: Message['sender']) => {
    if (senderType === 'agent') return currentUser.avatarUrl;
    if (senderType === 'customer') return customer?.avatarUrl;
    return 'https://placehold.co/40x40.png'; 
  }

  const getMessageSenderName = (senderType: Message['sender']) => {
    if (senderType === 'agent') return currentUser.name;
    if (senderType === 'customer') return customer?.name || 'Customer';
    return 'System';
  }

  return (
    <div className="flex flex-col flex-1 h-full bg-background"> {/* Changed bg-card to bg-background */}
      <ScrollArea className="flex-1 p-4 md:p-6 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              "flex items-end gap-2.5", // items-end for bubble tails
              msg.sender === "agent" ? "justify-end" : "justify-start"
            )}
          >
            {msg.sender === "customer" && (
              <Avatar className="h-7 w-7 border shrink-0">
                <AvatarImage src={getMessageAvatar(msg.sender)} alt={getMessageSenderName(msg.sender)} data-ai-hint="person avatar" />
                <AvatarFallback className="text-xs">{getMessageSenderName(msg.sender).charAt(0)}</AvatarFallback>
              </Avatar>
            )}
            <div
              className={cn(
                "max-w-[70%] rounded-xl p-3 text-sm shadow-sm",
                msg.sender === "agent"
                  ? "bg-chat-bubble-agent-bg text-chat-bubble-agent-text rounded-br-none"
                  : "bg-chat-bubble-customer-bg text-chat-bubble-customer-text rounded-bl-none"
              )}
            >
              <p className="font-semibold mb-0.5 text-xs opacity-80">{msg.sender === 'agent' ? 'You' : getMessageSenderName(msg.sender)}</p>
              <p className="whitespace-pre-wrap">{msg.content}</p>
              <p className="text-xs opacity-60 mt-1.5 text-right">
                {format(new Date(msg.timestamp), "MMM d, HH:mm")}
              </p>
            </div>
            {msg.sender === "agent" && (
              <Avatar className="h-7 w-7 border shrink-0">
                <AvatarImage src={getMessageAvatar(msg.sender)} alt={getMessageSenderName(msg.sender)} data-ai-hint="agent avatar" />
                <AvatarFallback className="text-xs">{getMessageSenderName(msg.sender).charAt(0)}</AvatarFallback>
              </Avatar>
            )}
          </div>
        ))}
      </ScrollArea>
      <div className="border-t p-3 bg-card sticky bottom-0">
        <div className="relative">
          <Textarea
            id="conversation-textarea"
            placeholder="Type your message or select a suggested reply…"
            defaultValue={initialDraftMessage || ""} // Use defaultValue to allow internal updates, parent still controls initial seed.
            onChange={handleTextChange} // This now updates parent's draft
            onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessageInternal();
                }
            }}
            className="min-h-[70px] resize-none pr-28 rounded-lg border-input focus:border-primary text-sm bg-input"
          />
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-0.5">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Smile className="h-4.5 w-4.5 text-muted-foreground" />
              <span className="sr-only">Add emoji</span>
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Paperclip className="h-4.5 w-4.5 text-muted-foreground" />
              <span className="sr-only">Attach file</span>
            </Button>
            <Button size="icon" className="h-8 w-8 bg-primary hover:bg-primary/90" onClick={handleSendMessageInternal} disabled={!initialDraftMessage?.trim()}>
              <Send className="h-4 w-4" />
              <span className="sr-only">Send message</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversationPanel;

    