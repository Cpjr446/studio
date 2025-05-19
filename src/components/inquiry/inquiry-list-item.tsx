
"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { Mail, MessageSquare, Phone, Flame, AlertTriangle, ShieldCheck } from "lucide-react"; // Added ShieldCheck for Low
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Inquiry, Customer } from "@/types/support";
import { type PrioritizeInquiryOutput } from "@/ai/flows/prioritize-inquiries"; // prioritizeInquiry removed as it's handled in page.tsx
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
  if (channel === 'email') return <Mail className="h-3.5 w-3.5 text-muted-foreground" />;
  if (channel === 'chat') return <MessageSquare className="h-3.5 w-3.5 text-muted-foreground" />;
  if (channel === 'phone') return <Phone className="h-3.5 w-3.5 text-muted-foreground" />;
  return null;
};

const getPriorityLabel = (score?: number): "Urgent" | "High" | "Medium" | "Low" | "N/A" => {
  if (score === undefined) return "N/A";
  if (score >= 9) return "Urgent";
  if (score >= 7) return "High";
  if (score >= 4) return "Medium";
  return "Low";
};

const PriorityBadge: React.FC<{ score?: number, isSelected: boolean }> = ({ score, isSelected }) => {
  const label = getPriorityLabel(score);
  if (label === "N/A") return null;

  let icon = null;
  let badgeClasses = "";
  let textClasses = isSelected ? "text-primary-foreground" : "text-foreground";
  let borderClasses = "border-transparent";

  switch (label) {
    case "Urgent":
      icon = <Flame className="h-3 w-3 mr-1" />;
      badgeClasses = isSelected ? "bg-status-high" : "bg-status-high/20";
      textClasses = isSelected ? "text-white" : "text-status-high";
      borderClasses = isSelected ? "border-status-high" : "border-status-high/30";
      break;
    case "High":
      icon = <AlertTriangle className="h-3 w-3 mr-1" />;
      badgeClasses = isSelected ? "bg-status-medium" : "bg-status-medium/20"; // Using Medium for High as per palette
      textClasses = isSelected ? "text-black" : "text-status-medium"; // Amber often needs dark text
      borderClasses = isSelected ? "border-status-medium" : "border-status-medium/30";
      break;
    case "Medium":
      // No specific icon for medium, or choose one like Zap
      badgeClasses = isSelected ? "bg-accent" : "bg-accent/20";
      textClasses = isSelected ? "text-accent-foreground" : "text-accent";
      borderClasses = isSelected ? "border-accent" : "border-accent/30";
      break;
    case "Low":
      icon = <ShieldCheck className="h-3 w-3 mr-1" />;
      badgeClasses = isSelected ? "bg-status-low" : "bg-status-low/20";
      textClasses = isSelected ? "text-white" : "text-status-low";
      borderClasses = isSelected ? "border-status-low" : "border-status-low/30";
      break;
  }

  return (
    <Badge
      className={cn(
        "text-xs px-1.5 py-0.5 flex items-center font-medium capitalize",
        badgeClasses,
        textClasses,
        borderClasses
      )}
    >
      {icon}
      {label}
    </Badge>
  );
};


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
    // Removed automatic fetching from item, should be handled by parent (page.tsx)
  }, [inquiry, isLoading, priorityInfo]);

  const timeAgo = formatDistanceToNow(new Date(inquiry.timestamp), { addSuffix: true });

  return (
    <TooltipProvider>
    <button
      onClick={() => onSelect(inquiry.id)}
      className={cn(
        "w-full text-left p-3 rounded-lg hover:bg-sidebar-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring",
        isSelected && "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90"
      )}
    >
      <div className="flex items-start gap-2.5">
        {customer?.avatarUrl && (
          <Avatar className="h-8 w-8 border border-sidebar-border shrink-0">
            <AvatarImage src={customer.avatarUrl} alt={customer.name} data-ai-hint="person avatar" />
            <AvatarFallback className="text-xs">{customer.name.charAt(0)}</AvatarFallback>
          </Avatar>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-0.5">
            <h3 className={cn("text-sm font-medium truncate", isSelected ? "text-sidebar-primary-foreground" : "text-sidebar-foreground")}>
              {customer?.name || 'Unknown Customer'}
            </h3>
            <span className={cn("text-xs shrink-0 ml-2", isSelected ? "text-sidebar-primary-foreground/80" : "text-muted-foreground")}>{timeAgo}</span>
          </div>
          <p className={cn("text-xs font-normal truncate", isSelected ? "text-sidebar-primary-foreground/90" : "text-foreground")}>{inquiry.subject}</p>
          
          <div className="mt-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ChannelIcon channel={inquiry.channel} />
              {isLoading ? (
                <Skeleton className="h-5 w-16 rounded" /> 
              ) : priorityInfo ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div> {/* Div wrapper for TooltipTrigger if PriorityBadge is complex */}
                        <PriorityBadge score={priorityInfo.priorityScore} isSelected={isSelected} />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="top" align="start" className="max-w-xs bg-popover text-popover-foreground p-2 rounded shadow-lg">
                    <p className="text-xs font-medium mb-1">AI Priority Assessment:</p>
                    <p className="text-xs">{priorityInfo.reason || "No specific reason provided."}</p>
                  </TooltipContent>
                </Tooltip>
              ) : (
                 <Badge variant="outline" className={cn("text-xs px-1.5 py-0.5", isSelected ? "border-sidebar-accent text-sidebar-accent-foreground" : "border-sidebar-border")}>N/A</Badge>
              )}
            </div>
            <Badge 
              variant={inquiry.status === 'open' ? 'default' : inquiry.status === 'resolved' ? 'secondary' : 'outline'} 
              className={cn(
                "text-xs capitalize px-1.5 py-0.5", 
                isSelected ? "bg-sidebar-accent text-sidebar-accent-foreground border-transparent" : "border-sidebar-border",
                inquiry.status === 'open' && !isSelected && "bg-primary/10 text-primary border-primary/30",
                inquiry.status === 'open' && isSelected && "bg-primary text-primary-foreground border-primary",
                inquiry.status === 'resolved' && (isSelected ? "bg-success text-success-foreground border-transparent" : "bg-success/10 text-success border-success/30"),
                !isSelected && "text-muted-foreground"
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

export default InquiryListItem;

    