
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
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-2 p-4 border-b bg-card rounded-t-lg sticky top-0 z-10"> {/* Make header sticky */}
        <Lightbulb className="h-6 w-6 text-primary" />
        <h2 className="text-lg font-semibold">AI Assistant</h2>
      </div>
      <ScrollArea className="flex-1"> {/* Removed padding from scrollarea directly */}
        <div className="space-y-6 p-4"> {/* Added padding to inner content div */}
          <SuggestedArticlesList customerInquiryText={customerInquiryText} />
          <QuickResponseList onSelectResponse={onSelectQuickResponse} />
        </div>
      </ScrollArea>
    </div>
  );
};

export default AiAssistPanel;
