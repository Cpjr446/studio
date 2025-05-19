
"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { Mail, MessageSquare, Phone, Zap, CheckCircle, AlertCircle, Info, AlertTriangle, Flame } from "lucide-react"; // Added Flame for Urgent, AlertTriangle for High
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Inquiry, Customer } from "@/types/support";
import { prioritizeInquiry, type PrioritizeInquiryOutput } from "@/ai/flows/prioritize-inquiries";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from 'date-fns';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider
} from "@/components/ui/tooltip"; 

interface InquiryListItemProps {
  inquiry: Inquiry;
  customer?: Customer;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

const ChannelIcon: React.FC<{ channel: Inquiry['channel'] }> = ({ channel }) => {
  if (channel === 'email') return <Mail className="h-4 w-4 text-muted-foreground" />;
  if (channel === 'chat') return <MessageSquare className="h-4 w-4 text-muted-foreground" />;
  if (channel === 'phone') return <Phone className="h-4 w-4 text-muted-foreground" />;
  return null;
};

const SentimentIcon: React.FC<{ sentiment?: PrioritizeInquiryOutput['sentiment'] }> = ({ sentiment }) => {
  if (sentiment === 'positive') return <CheckCircle className="h-4 w-4 text-success" />;
  if (sentiment === 'negative') return <AlertCircle className="h-4 w-4 text-destructive" />;
  if (sentiment === 'neutral') return <Info className="h-4 w-4 text-primary" />; // Using primary for neutral
  return <Info className="h-4 w-4 text-muted-foreground" />;
};

const UrgencyIndicator: React.FC<{ urgency?: PrioritizeInquiryOutput['urgency'] }> = ({ urgency }) => {
  let color = "bg-gray-400"; // Default
  let title = "Urgency: N/A";
  if (urgency === 'low') { color = "bg-green-500"; title = "Urgency: Low"; } // Consider using success color
  if (urgency === 'medium') { color = "bg-yellow-500"; title = "Urgency: Medium"; } // Consider using accent color
  if (urgency === 'high') { color = "bg-red-500"; title = "Urgency: High"; } // Consider using destructive color
  return <TooltipProvider><Tooltip><TooltipTrigger asChild><span className={cn("h-2.5 w-2.5 rounded-full inline-block", color)}></span></TooltipTrigger><TooltipContent><p>{title}</p></TooltipContent></Tooltip></TooltipProvider>;
};

const getPriorityLabel = (score?: number): string => {
  if (score === undefined) return "N/A";
  if (score >= 9) return "Urgent";
  if (score >= 7) return "High";
  if (score >= 4) return "Medium";
  return "Low";
};

const getPriorityIcon = (priorityLabel: string) => {
  if (priorityLabel === "Urgent") return <Flame className="h-3.5 w-3.5 mr-1 text-destructive" />;
  if (priorityLabel === "High") return <AlertTriangle className="h-3.5 w-3.5 mr-1 text-accent" />; // Using accent for High
  return null;
}

const InquiryListItem: React.FC<InquiryListItemProps> = ({ inquiry, customer, isSelected, onSelect }) => {
  const [priorityInfo, setPriorityInfo] = useState<PrioritizeInquiryOutput | undefined>(inquiry.priority);
  const [isLoading, setIsLoading] = useState(inquiry.isLoadingPriority || false);

  useEffect(() => {
    if (inquiry.priority !== priorityInfo) {
      setPriorityInfo(inquiry.priority);
    }
    if (inquiry.isLoadingPriority !== isLoading) {
        setIsLoading(inquiry.isLoadingPriority || false);
    }
    if (!inquiry.priority && !inquiry.isLoadingPriority && !isLoading) {
      setIsLoading(true);
      prioritizeInquiry({ inquiry: `${inquiry.subject} ${inquiry.previewText}` })
        .then(data => {
            setPriorityInfo(data);
        })
        .catch(console.error)
        .finally(() => setIsLoading(false));
    }
  }, [inquiry, isLoading, priorityInfo]);

  const timeAgo = formatDistanceToNow(new Date(inquiry.timestamp), { addSuffix: true });
  const priorityLabel = getPriorityLabel(priorityInfo?.priorityScore);
  const PriorityIcon = getPriorityIcon(priorityLabel);

  return (
    <TooltipProvider>
    <button
      onClick={() => onSelect(inquiry.id)}
      className={cn(
        "w-full text-left p-4 rounded-lg hover:bg-sidebar-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring", // Increased padding
        isSelected && "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90"
      )}
    >
      <div className="flex items-start gap-3">
        {customer?.avatarUrl && (
          <Avatar className="h-10 w-10 border">
            <AvatarImage src={customer.avatarUrl} alt={customer.name} data-ai-hint="person avatar" />
            <AvatarFallback>{customer.name.charAt(0)}</AvatarFallback>
          </Avatar>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-0.5">
            <h3 className={cn("text-sm font-semibold truncate", isSelected ? "text-sidebar-primary-foreground" : "text-sidebar-foreground")}>
              {customer?.name || 'Unknown Customer'}
            </h3>
            <span className={cn("text-xs", isSelected ? "text-sidebar-primary-foreground/80" : "text-sidebar-foreground/70")}>{timeAgo}</span>
          </div>
          <p className={cn("text-sm truncate", isSelected ? "text-sidebar-primary-foreground/90" : "text-sidebar-foreground/80")}>{inquiry.subject}</p> {/* text-sm for subject */}
          <p className={cn("text-xs text-opacity-70 truncate mt-1", isSelected ? "text-sidebar-primary-foreground/70" : "text-sidebar-foreground/60")}> {/* Increased mt */}
            {inquiry.previewText}
          </p>
          <div className="mt-2.5 flex items-center justify-between"> {/* Increased mt */}
            <div className="flex items-center gap-2.5"> {/* Increased gap */}
              <ChannelIcon channel={inquiry.channel} />
              {isLoading ? (
                <Skeleton className="h-5 w-24 rounded" /> 
              ) : priorityInfo ? (
                <>
                  <SentimentIcon sentiment={priorityInfo.sentiment} />
                  <UrgencyIndicator urgency={priorityInfo.urgency} />
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge 
                        variant={isSelected ? "secondary" : "outline"} 
                        className={cn(
                          "text-xs px-2 py-1 cursor-default flex items-center", // Increased padding
                          isSelected ? "bg-sidebar-accent text-sidebar-accent-foreground border-transparent" : "border-sidebar-border text-sidebar-foreground/80",
                          priorityLabel === "Urgent" && (isSelected ? "bg-destructive text-destructive-foreground border-transparent" : "bg-destructive/10 text-destructive border-destructive/30"),
                          priorityLabel === "High" && (isSelected ? "bg-accent text-accent-foreground border-transparent" : "bg-accent/10 text-accent-color-dark dark:text-accent-color-light border-accent/30"), // Assuming accent is amber
                          priorityLabel === "Medium" && (isSelected ? "bg-blue-500 text-white border-transparent" : "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30"),
                          priorityLabel === "Low" && (isSelected ? "bg-green-500 text-white border-transparent" : "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/30")
                        )}
                      >
                        {PriorityIcon}
                        {priorityLabel}
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent side="top" align="start" className="max-w-xs bg-popover text-popover-foreground p-2 rounded shadow-lg">
                      <p className="text-xs font-medium mb-1">AI Priority Assessment:</p>
                      <p className="text-xs">{priorityInfo.reason || "No specific reason provided."}</p>
                    </TooltipContent>
                  </Tooltip>
                </>
              ) : (
                <Zap className="h-4 w-4 text-muted-foreground" title="Priority not yet determined" /> 
              )}
            </div>
            <Badge 
              variant={inquiry.status === 'open' ? 'default' : inquiry.status === 'resolved' ? 'secondary' : 'outline'} 
              className={cn(
                "text-xs capitalize px-2 py-1", // Increased padding
                isSelected ? "bg-sidebar-accent text-sidebar-accent-foreground border-transparent" : "border-sidebar-border",
                inquiry.status === 'open' && !isSelected && "bg-primary/10 text-primary border-primary/30",
                inquiry.status === 'open' && isSelected && "bg-primary text-primary-foreground border-primary",
                inquiry.status === 'resolved' && (isSelected ? "bg-success text-success-foreground border-transparent" : "bg-success/10 text-success border-success/30"),
                !isSelected && "text-sidebar-foreground/70"
              )}
            >
              {inquiry.status}
            </Badge>
          </div>
        </div>
      </div>
    </button>
    </TooltipProvider>
  );
};

// Helper for text color on accent (amber) which might need dark text
// This isn't used in the current badge structure directly but good for reference
// const getAccentTextColor = (isSelected: boolean) => {
//   return isSelected ? 'text-accent-foreground' : 'text-yellow-700 dark:text-yellow-400'; 
// };

export default InquiryListItem;
