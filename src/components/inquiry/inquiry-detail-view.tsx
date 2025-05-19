
"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Archive, ArrowLeft, Edit3, Tag, ThumbsDown, ThumbsUp, Trash2, Send, ChevronDown, ChevronUp, Info, MessageCircle, SlidersHorizontal } from "lucide-react";
import ConversationPanel from "./conversation-panel";
import CustomerDetailsPanel from "./customer-details-panel";
import AiAssistPanel from "./ai-assist-panel";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Inquiry, Customer, Message, UserProfile } from "@/types/support";
import { generateAgentResponse } from "@/ai/flows/generate-agent-response"; 
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { cn } from "@/lib/utils";


interface InquiryDetailViewProps {
  inquiry: Inquiry;
  customer?: Customer;
  currentUser: UserProfile;
  onBackToList: () => void; // For mobile view, to go back to inbox
  isMobile?: boolean;
}

const InquiryDetailView: React.FC<InquiryDetailViewProps> = ({ inquiry, customer, currentUser, onBackToList, isMobile }) => {
  const [messages, setMessages] = useState<Message[]>(inquiry.messages);
  const [aiSuggestedResponse, setAiSuggestedResponse] = useState<string | null>(null); 
  const [isLoadingAiResponse, setIsLoadingAiResponse] = useState(false); 
  const [draftMessageForConversation, setDraftMessageForConversation] = useState<string>("");
  const [isInfoPanelOpen, setIsInfoPanelOpen] = useState(!isMobile); // Open by default on desktop

  useEffect(() => {
    setMessages(inquiry.messages); 
    setAiSuggestedResponse(null); 
    setDraftMessageForConversation(""); 
    setIsInfoPanelOpen(!isMobile); // Adjust based on mobile status

    const fetchAiResponse = async () => {
      if (inquiry.messages.length > 0) {
        setIsLoadingAiResponse(true);
        try {
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
  }, [inquiry, customer?.name, currentUser.name, isMobile]);

  const handleSendMessage = (content: string) => {
    const newMessage: Message = {
      id: `msg_${Date.now()}`,
      sender: 'agent',
      content,
      timestamp: new Date().toISOString(),
      avatar: currentUser.avatarUrl,
    };
    setMessages(prevMessages => [...prevMessages, newMessage]);
    setDraftMessageForConversation(""); 
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
    <div className="flex flex-col h-full max-h-screen overflow-hidden bg-background">
      {/* Header Section */}
      <header className="p-4 border-b bg-card sticky top-0 z-20">
        <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
                {isMobile && (
                  <Button variant="ghost" size="icon" onClick={onBackToList} className="mr-1">
                      <ArrowLeft className="h-5 w-5" />
                  </Button>
                )}
                <h2 className="text-lg font-semibold truncate max-w-md">{inquiry.subject}</h2>
                <Badge variant={inquiry.status === 'open' ? 'default' : inquiry.status === 'resolved' ? 'success' : 'secondary'} className="capitalize text-xs px-2 py-0.5">
                    {inquiry.status}
                </Badge>
            </div>
            <div className="flex items-center gap-1.5">
            <Tooltip>
              <TooltipTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8"><Edit3 className="h-4 w-4" /></Button></TooltipTrigger>
              <TooltipContent><p>Edit Status/Assign</p></TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8"><Tag className="h-4 w-4" /></Button></TooltipTrigger>
              <TooltipContent><p>Add Tags</p></TooltipContent>
            </Tooltip>
             <Button variant="ghost" size="icon" className="h-8 w-8 md:hidden" onClick={() => setIsInfoPanelOpen(!isInfoPanelOpen)}>
                {isInfoPanelOpen ? <SlidersHorizontal className="h-4 w-4" /> : <SlidersHorizontal className="h-4 w-4" />} 
             </Button>
          </div>
        </div>
        <div className="text-xs text-muted-foreground">
          <span>From: {customer?.name || 'Unknown'} ({customer?.email || 'N/A'})</span>
          <span className="mx-1.5">|</span>
          <span>Channel: {inquiry.channel}</span>
        </div>
      </header>

      {/* Main Content Area (Conversation and Info Panel) */}
      <div className="flex-1 flex overflow-hidden">
        {/* Conversation Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
           {/* AI Assistant Suggested Response - Collapsible */}
           {isLoadingAiResponse ? (
              <div className="p-4 border-b">
                  <Skeleton className="h-4 w-1/3 mb-2" />
                  <Skeleton className="h-16 w-full rounded-md" />
                  <Skeleton className="h-8 w-1/4 ml-auto mt-2" />
              </div>
          ) : aiSuggestedResponse ? (
              <Accordion type="single" collapsible className="border-b" defaultValue="item-1">
                <AccordionItem value="item-1" className="border-none">
                  <AccordionTrigger className="px-4 py-3 text-sm hover:no-underline hover:bg-muted/50 data-[state=open]:bg-muted/50">
                    <div className="flex items-center gap-2">
                      <MessageCircle className="h-4 w-4 text-primary" />
                      <span>AI Suggested Reply</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pt-0 pb-3">
                      <p className="text-sm whitespace-pre-wrap text-muted-foreground mb-2">{aiSuggestedResponse}</p>
                      <div className="flex justify-between items-center">
                        <div className="flex gap-1">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-success">
                                <span><ThumbsUp className="h-4 w-4"/></span>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent><p>Good Suggestion</p></TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive">
                                <span><ThumbsDown className="h-4 w-4"/></span>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent><p>Bad Suggestion</p></TooltipContent>
                          </Tooltip>
                        </div>
                        <Button size="sm" variant="default" onClick={handleUseSuggestedResponse} className="text-xs h-8 px-3 py-1.5">
                            <Send className="h-3.5 w-3.5 mr-1.5" /> Use This
                        </Button>
                      </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
          ) : null}

          <ConversationPanel
            messages={messages}
            currentUser={currentUser}
            customer={customer}
            onSendMessage={handleSendMessage}
            initialDraftMessage={draftMessageForConversation}
            onDraftChange={setDraftMessageForConversation}
          />
        </div>

        {/* Collapsible Right Info Panel */}
        <div className={cn(
            "transition-all duration-300 ease-in-out overflow-hidden border-l bg-card",
            isInfoPanelOpen ? "w-[320px] p-0" : "w-0 p-0",
            isMobile && !isInfoPanelOpen ? "hidden" : "flex flex-col", // Hide on mobile if closed
            isMobile && isInfoPanelOpen ? "absolute top-0 right-0 h-full z-20 w-full max-w-sm shadow-xl" : "" // Full overlay on mobile
        )}>
            {isMobile && isInfoPanelOpen && (
                <div className="p-4 border-b flex justify-between items-center">
                    <h3 className="font-semibold">Details</h3>
                    <Button variant="ghost" size="icon" onClick={() => setIsInfoPanelOpen(false)}>
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </div>
            )}
            <ScrollArea className="flex-1">
              <div className="p-4 space-y-4">
                <CustomerDetailsPanel customer={customer} />
                <AiAssistPanel 
                    customerInquiryText={inquiryTextForAISuggestions} 
                    onSelectQuickResponse={handleQuickResponseSelect} 
                />
              </div>
            </ScrollArea>
        </div>
      </div>
    </div>
    </TooltipProvider>
  );
};

export default InquiryDetailView;

    