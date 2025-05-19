
"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Archive, ArrowLeft, Edit3, Tag, ThumbsDown, ThumbsUp, Trash2 } from "lucide-react";
import ConversationPanel from "./conversation-panel";
import CustomerDetailsPanel from "./customer-details-panel";
import AiAssistPanel from "./ai-assist-panel";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { Inquiry, Customer, Message, UserProfile } from "@/types/support";
import { summarizeInquiry } from "@/ai/flows/summarize-inquiry";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface InquiryDetailViewProps {
  inquiry: Inquiry;
  customer?: Customer;
  currentUser: UserProfile;
  onBackToList: () => void;
}

const InquiryDetailView: React.FC<InquiryDetailViewProps> = ({ inquiry, customer, currentUser, onBackToList }) => {
  const [messages, setMessages] = useState<Message[]>(inquiry.messages);
  const [summary, setSummary] = useState<string | null>(null);
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);

  useEffect(() => {
    setMessages(inquiry.messages); // Update messages when inquiry changes
    // Fetch summary when inquiry changes
    const fetchSummary = async () => {
      if (inquiry.messages.length > 0) {
        setIsLoadingSummary(true);
        try {
          const inquiryText = inquiry.messages.map(m => m.content).join('\n');
          const result = await summarizeInquiry({ inquiry: inquiryText });
          setSummary(result.summary);
        } catch (error) {
          console.error("Failed to summarize inquiry:", error);
          setSummary("Could not generate summary.");
        } finally {
          setIsLoadingSummary(false);
        }
      } else {
        setSummary(null);
      }
    };
    fetchSummary();
  }, [inquiry]);

  const handleSendMessage = (content: string) => {
    const newMessage: Message = {
      id: `msg_${Date.now()}`,
      sender: 'agent',
      content,
      timestamp: new Date().toISOString(),
      avatar: currentUser.avatarUrl,
    };
    setMessages(prevMessages => [...prevMessages, newMessage]);
    // Here you would also send the message to your backend
  };

  const handleQuickResponseSelect = (content: string) => {
    // For now, this just calls send message. Could also populate textarea.
    handleSendMessage(content);
  };

  const inquiryTextForAISuggestions = inquiry.messages.map(m => m.content).join(" ");

  return (
    <TooltipProvider>
    <div className="flex flex-col h-full max-h-screen overflow-hidden">
      {/* Header Section */}
      <header className="p-4 border-b bg-card">
        <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={onBackToList} className="md:hidden">
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <h2 className="text-xl font-semibold truncate">{inquiry.subject}</h2>
                <Badge variant={inquiry.status === 'open' ? 'default' : 'secondary'} className="capitalize">
                    {inquiry.status}
                </Badge>
            </div>
            <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild><Button variant="outline" size="icon"><Edit3 className="h-4 w-4" /></Button></TooltipTrigger>
              <TooltipContent><p>Edit Status/Assign</p></TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild><Button variant="outline" size="icon"><Tag className="h-4 w-4" /></Button></TooltipTrigger>
              <TooltipContent><p>Add Tags</p></TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild><Button variant="outline" size="icon"><Archive className="h-4 w-4" /></Button></TooltipTrigger>
              <TooltipContent><p>Archive</p></TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" aria-label="Delete">
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </TooltipTrigger>
              <TooltipContent><p>Delete</p></TooltipContent>
            </Tooltip>
          </div>
        </div>
        <div className="text-xs text-muted-foreground">
          <span>From: {customer?.name || 'Unknown'} ({customer?.email || 'N/A'})</span>
          <span className="mx-2">|</span>
          <span>Channel: {inquiry.channel}</span>
          <span className="mx-2">|</span>
          <span>Received: {new Date(inquiry.timestamp).toLocaleString()}</span>
        </div>
        {isLoadingSummary ? (
            <Skeleton className="h-4 w-full mt-2 rounded" />
        ) : summary ? (
            <div className="mt-2 p-2 bg-secondary/50 rounded-md text-sm text-secondary-foreground">
                <strong className="font-medium">AI Summary:</strong> {summary}
                <div className="flex gap-1 mt-1">
                  <Button variant="ghost" size="icon" className="h-6 w-6"><ThumbsUp className="h-3 w-3"/></Button>
                  <Button variant="ghost" size="icon" className="h-6 w-6"><ThumbsDown className="h-3 w-3"/></Button>
                </div>
            </div>
        ) : null}
      </header>

      {/* Main Content Area (Panels) */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-0 overflow-hidden">
        {/* Conversation Panel (takes up more space on medium screens) */}
        <div className="md:col-span-5 lg:col-span-5 xl:col-span-6 flex flex-col h-full overflow-y-auto border-r">
          <ConversationPanel
            messages={messages}
            currentUser={currentUser}
            customer={customer}
            onSendMessage={handleSendMessage}
          />
        </div>

        {/* Customer Details & AI Assist (stacked or side-by-side) */}
        <div className="md:col-span-4 lg:col-span-4 xl:col-span-3 flex flex-col h-full overflow-y-auto border-r">
           <CustomerDetailsPanel customer={customer} />
        </div>
        <div className="md:col-span-3 lg:col-span-3 xl:col-span-3 flex flex-col h-full overflow-y-auto">
           <AiAssistPanel 
            customerInquiryText={inquiryTextForAISuggestions} 
            onSelectQuickResponse={handleQuickResponseSelect} 
           />
        </div>
      </div>
    </div>
    </TooltipProvider>
  );
};

export default InquiryDetailView;
