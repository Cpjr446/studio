
"use client";

import type React from "react";
import { Lightbulb } from "lucide-react";
import SuggestedArticlesList from "./suggested-articles-list";
import QuickResponseList from "./quick-response-list";
import { ScrollArea } from "@/components/ui/scroll-area";

interface AiAssistPanelProps {
  customerInquiryText: string;
  onSelectQuickResponse: (content: string) => void;
}

const AiAssistPanel: React.FC<AiAssistPanelProps> = ({ customerInquiryText, onSelectQuickResponse }) => {
  return (
    <div className="h-full flex flex-col gap-4">
      <div className="flex items-center gap-2 p-4 border-b bg-card rounded-t-lg">
        <Lightbulb className="h-6 w-6 text-primary" />
        <h2 className="text-lg font-semibold">AI Assistant</h2>
      </div>
      <ScrollArea className="flex-1 px-1 py-1 md:px-2 md:py-2"> {/* Reduced padding for scroll area content */}
        <div className="space-y-6 p-2 md:p-0"> {/* Further reduced padding for inner content */}
          <SuggestedArticlesList customerInquiryText={customerInquiryText} />
          <QuickResponseList onSelectResponse={onSelectQuickResponse} />
        </div>
      </ScrollArea>
    </div>
  );
};

export default AiAssistPanel;
