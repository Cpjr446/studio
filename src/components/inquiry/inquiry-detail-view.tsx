
"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Archive, ArrowLeft, Edit3, Tag, ThumbsDown, ThumbsUp, Trash2, Send } from "lucide-react";
import ConversationPanel from "./conversation-panel";
import CustomerDetailsPanel from "./customer-details-panel";
import AiAssistPanel from "./ai-assist-panel";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Inquiry, Customer, Message, UserProfile } from "@/types/support";
import { generateAgentResponse } from "@/ai/flows/generate-agent-response"; // Changed from summarizeInquiry
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
  const [aiSuggestedResponse, setAiSuggestedResponse] = useState<string | null>(null); // Renamed from summary
  const [isLoadingAiResponse, setIsLoadingAiResponse] = useState(false); // Renamed from isLoadingSummary
  const [draftMessageForConversation, setDraftMessageForConversation] = useState<string>("");


  useEffect(() => {
    setMessages(inquiry.messages); // Update messages when inquiry changes
    setAiSuggestedResponse(null); // Clear previous suggestion
    setDraftMessageForConversation(""); // Clear draft message for text area

    const fetchAiResponse = async () => {
      if (inquiry.messages.length > 0) {
        setIsLoadingAiResponse(true);
        try {
          // Construct a coherent thread for the AI
          const inquiryThread = inquiry.messages
            .map(m => `${m.sender === 'agent' ? currentUser.name : (customer?.name || 'Customer')}: ${m.content}`)
            .join('\n\n');

          const result = await generateAgentResponse({ 
            inquiryThread,
            customerName: customer?.name 
          });
          setAiSuggestedResponse(result.suggestedResponse);
        } catch (error) {
          console.error("Failed to generate AI response:", error);
          setAiSuggestedResponse("Could not generate AI assistance at this time. Please try again or proceed manually.");
        } finally {
          setIsLoadingAiResponse(false);
        }
      } else {
        setAiSuggestedResponse(null);
      }
    };
    fetchAiResponse();
  }, [inquiry, customer?.name, currentUser.name]);

  const handleSendMessage = (content: string) => {
    const newMessage: Message = {
      id: `msg_${Date.now()}`,
      sender: 'agent',
      content,
      timestamp: new Date().toISOString(),
      avatar: currentUser.avatarUrl,
    };
    setMessages(prevMessages => [...prevMessages, newMessage]);
    setDraftMessageForConversation(""); // Clear textarea after sending
    // Here you would also send the message to your backend
  };

  const handleUseSuggestedResponse = () => {
    if (aiSuggestedResponse) {
      setDraftMessageForConversation(aiSuggestedResponse);
    }
  };
  
  const handleQuickResponseSelect = (content: string) => {
    setDraftMessageForConversation(prev => prev ? `${prev}\n${content}` : content);
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
        
        {/* AI Assistant Suggested Response */}
        {isLoadingAiResponse ? (
             <div className="mt-3 space-y-2">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-12 w-full rounded" />
                <Skeleton className="h-8 w-1/5 ml-auto" />
            </div>
        ) : aiSuggestedResponse ? (
            <div className="mt-3 p-3 bg-secondary/50 rounded-lg shadow">
                <div className="flex justify-between items-center mb-1.5">
                    <h4 className="text-sm font-semibold text-secondary-foreground">AI Assistant Suggests:</h4>
                    <Button size="sm" variant="outline" onClick={handleUseSuggestedResponse} className="text-xs h-7 px-2 py-1">
                        <Send className="h-3 w-3 mr-1.5" /> Use This Response
                    </Button>
                </div>
                <p className="text-sm whitespace-pre-wrap text-secondary-foreground/90">{aiSuggestedResponse}</p>
                <div className="flex gap-1 mt-1.5 justify-end">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-primary"><ThumbsUp className="h-3.5 w-3.5"/></Button>
                    </TooltipTrigger>
                    <TooltipContent><p>Good Suggestion</p></TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                       <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-destructive"><ThumbsDown className="h-3.5 w-3.5"/></Button>
                    </TooltipTrigger>
                    <TooltipContent><p>Bad Suggestion</p></TooltipContent>
                  </Tooltip>
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
            initialDraftMessage={draftMessageForConversation}
            onDraftChange={setDraftMessageForConversation} // Allow ConversationPanel to update the draft
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
