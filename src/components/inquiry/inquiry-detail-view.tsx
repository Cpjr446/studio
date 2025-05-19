
"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { ArrowLeft, MessageCircle, SlidersHorizontal, ThumbsDown, ThumbsUp, Send, X } from "lucide-react"; 
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
  onBackToList: () => void; 
  isMobile?: boolean;
}

const InquiryDetailView: React.FC<InquiryDetailViewProps> = ({ inquiry, customer, currentUser, onBackToList, isMobile }) => {
  const [messages, setMessages] = useState<Message[]>(inquiry.messages);
  const [aiSuggestedResponse, setAiSuggestedResponse] = useState<string | null>(null); 
  const [isLoadingAiResponse, setIsLoadingAiResponse] = useState(false); 
  const [draftMessageForConversation, setDraftMessageForConversation] = useState<string>("");
  const [isInfoPanelOpen, setIsInfoPanelOpen] = useState(!isMobile); 

  useEffect(() => {
    setMessages(inquiry.messages); 
    setAiSuggestedResponse(null); 
    setDraftMessageForConversation(""); 
  }, [inquiry, currentUser.name, customer?.name]); 

  useEffect(() => {
    setIsInfoPanelOpen(!isMobile);
  }, [isMobile]);


  useEffect(() => {
    const fetchAiResponse = async () => {
      if (inquiry.messages.length > 0) {
        setIsLoadingAiResponse(true);
        try {
          const inquiryThread = inquiry.messages
            .map(m => `${m.sender === 'agent' ? currentUser.name : (customer?.name || inquiry.anonymousUserName || 'Customer')}: ${m.content}`)
            .join('\n\n');

          const result = await generateAgentResponse({ 
            inquiryThread,
            customerName: customer?.name || inquiry.anonymousUserName 
          });
          setAiSuggestedResponse(result.suggestedResponse);
        } catch (error: any) {
          console.error("Failed to generate AI response:", error);
          let userFriendlyMessage = "Could not generate AI assistance at this time. Please try again or proceed manually.";
          // This check is now handled within the Genkit flow itself
          // if (error.message && error.message.includes('[429 Too Many Requests]')) {
          //   userFriendlyMessage = "AI Assistant is temporarily unavailable due to high demand. Please try again later.";
          // }
          setAiSuggestedResponse(userFriendlyMessage); // The flow should return a user-friendly message
        } finally {
          setIsLoadingAiResponse(false);
        }
      } else {
        setAiSuggestedResponse(null);
      }
    };
    fetchAiResponse();
  }, [inquiry, customer?.name, inquiry.anonymousUserName, currentUser.name]);

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
    // Replaces the current draft with the selected quick response
    setDraftMessageForConversation(content);
  };

  const inquiryTextForAISuggestions = inquiry.messages.map(m => m.content).join(" ");
  const displayCustomerName = customer?.name || inquiry.anonymousUserName || "Unknown";
  const displayCustomerEmail = customer?.email || inquiry.anonymousUserEmail || "N/A";


  return (
    <TooltipProvider>
    <div className="flex flex-col h-full max-h-screen overflow-hidden bg-background">
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
             <Button variant="ghost" size="icon" className="h-8 w-8 md:hidden" onClick={() => setIsInfoPanelOpen(!isInfoPanelOpen)}>
                <SlidersHorizontal className="h-4 w-4" /> 
             </Button>
          </div>
        </div>
        <div className="text-xs text-muted-foreground">
          <span>From: {displayCustomerName} ({displayCustomerEmail})</span>
          <span className="mx-1.5">|</span>
          <span>Channel: {inquiry.channel === 'product_query' ? 'Product Form' : inquiry.channel}</span>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 flex flex-col overflow-hidden">
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
                        <Button size="sm" variant="default" onClick={handleUseSuggestedResponse} className="text-xs h-8 px-3 py-1.5 bg-primary hover:bg-primary/90 text-primary-foreground">
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
            customer={customer || (inquiry.anonymousUserName ? { id: inquiry.customerId, name: inquiry.anonymousUserName, email: inquiry.anonymousUserEmail || '', avatarUrl: 'https://placehold.co/80x80.png', joinDate: '', lastContacted: '', tags: [] } : undefined)}
            onSendMessage={handleSendMessage}
            initialDraftMessage={draftMessageForConversation}
            onDraftChange={setDraftMessageForConversation}
          />
        </div>

        <div className={cn(
            "transition-all duration-300 ease-in-out overflow-hidden border-l bg-card",
            isInfoPanelOpen ? "w-full md:w-[320px] p-0" : "w-0 p-0",
            isMobile && !isInfoPanelOpen ? "hidden" : "flex flex-col", 
            isMobile && isInfoPanelOpen ? "absolute top-0 right-0 h-full z-30 w-full max-w-md shadow-xl" : "" 
        )}>
            {isMobile && isInfoPanelOpen && (
                <div className="p-4 border-b flex justify-between items-center sticky top-0 bg-card z-10">
                    <h3 className="font-semibold text-foreground">Details</h3>
                    <Button variant="ghost" size="icon" onClick={() => setIsInfoPanelOpen(false)}>
                        <X className="h-5 w-5 text-muted-foreground" />
                    </Button>
                </div>
            )}
            <ScrollArea className="flex-1">
              <div className="p-4 space-y-4">
                <CustomerDetailsPanel customer={customer || (inquiry.anonymousUserName ? { id: inquiry.customerId, name: inquiry.anonymousUserName, email: inquiry.anonymousUserEmail || '', avatarUrl: 'https://placehold.co/80x80.png', joinDate: '', lastContacted: '', tags: [] } : undefined)} />
                <AiAssistPanel 
                    customerInquiryText={inquiryTextForAISuggestions} 
                    onSelectQuickResponse={handleQuickResponseSelect} 
                />
              </div>
            </ScrollArea>
             {isMobile && isInfoPanelOpen && (
                 <div className="p-4 border-t bg-card">
                     <Button variant="outline" className="w-full" onClick={() => setIsInfoPanelOpen(false)}>Close Details</Button>
                 </div>
             )}
        </div>
      </div>
    </div>
    </TooltipProvider>
  );
};

export default InquiryDetailView;
