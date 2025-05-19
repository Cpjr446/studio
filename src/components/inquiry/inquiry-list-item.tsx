
"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { Mail, MessageSquare, Phone, Zap, CheckCircle, AlertCircle, Info } from "lucide-react";
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
} from "@/components/ui/tooltip"; // TooltipProvider is usually higher up

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
  if (sentiment === 'positive') return <CheckCircle className="h-4 w-4 text-green-500" />;
  if (sentiment === 'negative') return <AlertCircle className="h-4 w-4 text-red-500" />;
  if (sentiment === 'neutral') return <Info className="h-4 w-4 text-blue-500" />;
  return <Info className="h-4 w-4 text-muted-foreground" />;
};

const UrgencyIndicator: React.FC<{ urgency?: PrioritizeInquiryOutput['urgency'] }> = ({ urgency }) => {
  let color = "bg-gray-400"; // Default
  let title = "Urgency: N/A";
  if (urgency === 'low') { color = "bg-green-500"; title = "Urgency: Low"; }
  if (urgency === 'medium') { color = "bg-yellow-500"; title = "Urgency: Medium"; }
  if (urgency === 'high') { color = "bg-red-500"; title = "Urgency: High"; }
  return <span className={cn("h-2 w-2 rounded-full inline-block", color)} title={title}></span>;
};

const getPriorityLabel = (score?: number): string => {
  if (score === undefined) return "N/A";
  if (score >= 9) return "Urgent";
  if (score >= 7) return "High";
  if (score >= 4) return "Medium";
  return "Low";
};

const InquiryListItem: React.FC<InquiryListItemProps> = ({ inquiry, customer, isSelected, onSelect }) => {
  const [priorityInfo, setPriorityInfo] = useState<PrioritizeInquiryOutput | undefined>(inquiry.priority);
  const [isLoading, setIsLoading] = useState(inquiry.isLoadingPriority || false);

  useEffect(() => {
    // Update local state if inquiry.priority changes externally (e.g. after initial batch load)
    if (inquiry.priority !== priorityInfo) {
      setPriorityInfo(inquiry.priority);
    }
    // Update loading state if inquiry.isLoadingPriority changes
    if (inquiry.isLoadingPriority !== isLoading) {
        setIsLoading(inquiry.isLoadingPriority || false);
    }

    // Only fetch if priority is not set and not already loading triggered by this component
    // This condition might need refinement if parent component re-triggers loading
    if (!inquiry.priority && !inquiry.isLoadingPriority && !isLoading) {
      setIsLoading(true);
      prioritizeInquiry({ inquiry: `${inquiry.subject} ${inquiry.previewText}` })
        .then(data => {
            setPriorityInfo(data);
            // Potentially call a function to update the parent's inquiry object
            // so sorting can happen with the new data. For now, local update is fine.
        })
        .catch(console.error)
        .finally(() => setIsLoading(false));
    }
  }, [inquiry, isLoading, priorityInfo]); // Added priorityInfo to dependencies

  const timeAgo = formatDistanceToNow(new Date(inquiry.timestamp), { addSuffix: true });
  const priorityLabel = getPriorityLabel(priorityInfo?.priorityScore);

  return (
    <button
      onClick={() => onSelect(inquiry.id)}
      className={cn(
        "w-full text-left p-3 rounded-lg hover:bg-sidebar-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring",
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
          <div className="flex items-center justify-between">
            <h3 className={cn("text-sm font-semibold truncate", isSelected ? "text-sidebar-primary-foreground" : "text-sidebar-foreground")}>
              {customer?.name || 'Unknown Customer'}
            </h3>
            <span className={cn("text-xs", isSelected ? "text-sidebar-primary-foreground/80" : "text-sidebar-foreground/70")}>{timeAgo}</span>
          </div>
          <p className={cn("text-xs truncate", isSelected ? "text-sidebar-primary-foreground/90" : "text-sidebar-foreground/80")}>{inquiry.subject}</p>
          <p className={cn("text-xs text-opacity-60 truncate mt-0.5", isSelected ? "text-sidebar-primary-foreground/70" : "text-sidebar-foreground/60")}>
            {inquiry.previewText}
          </p>
          <div className="mt-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ChannelIcon channel={inquiry.channel} />
              {isLoading ? (
                <Skeleton className="h-4 w-24" /> // Increased width for "Loading Priority..."
              ) : priorityInfo ? (
                <>
                  <SentimentIcon sentiment={priorityInfo.sentiment} />
                  <UrgencyIndicator urgency={priorityInfo.urgency} />
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge 
                        variant={isSelected ? "secondary" : "outline"} 
                        className={cn(
                          "text-xs px-1.5 py-0.5 cursor-default", 
                          isSelected ? "bg-sidebar-accent text-sidebar-accent-foreground" : "border-sidebar-border text-sidebar-foreground/70",
                          priorityLabel === "Urgent" && (isSelected ? "bg-red-500 text-white" : "bg-red-500/20 text-red-700 border-red-500/30"),
                          priorityLabel === "High" && (isSelected ? "bg-orange-500 text-white" : "bg-orange-500/20 text-orange-700 border-orange-500/30")
                        )}
                      >
                        {priorityLabel}
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent side="top" align="start" className="max-w-xs">
                      <p className="text-xs font-medium">Reasoning:</p>
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
                "text-xs capitalize px-1.5 py-0.5",
                isSelected ? "bg-sidebar-accent text-sidebar-accent-foreground border-sidebar-accent" : "border-sidebar-border",
                inquiry.status === 'open' && !isSelected && "bg-primary/20 text-primary border-primary/30",
                inquiry.status === 'open' && isSelected && "bg-primary text-primary-foreground border-primary",
                inquiry.status === 'resolved' && !isSelected && "bg-green-500/20 text-green-700 border-green-500/30",
                inquiry.status === 'resolved' && isSelected && "bg-green-500 text-white border-green-500",
                 !isSelected && "text-sidebar-foreground/70"
              )}
            >
              {inquiry.status}
            </Badge>
          </div>
        </div>
      </div>
    </button>
  );
};

export default InquiryListItem;
