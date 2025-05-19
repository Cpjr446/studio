
"use client";

import type React from "react";
import { Lightbulb } from "lucide-react";
import SuggestedArticlesList from "./suggested-articles-list";
import QuickResponseList from "./quick-response-list";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";


interface AiAssistPanelProps {
  customerInquiryText: string;
  onSelectQuickResponse: (content: string) => void;
}

const AiAssistPanel: React.FC<AiAssistPanelProps> = ({ customerInquiryText, onSelectQuickResponse }) => {
  return (
    <Card className="h-full flex flex-col shadow-none border-none bg-card">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-primary" />
          <CardTitle className="text-base font-semibold">AI Assistant</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto p-0"> {/* ScrollArea will handle padding for its content */}
        <div className="space-y-4 p-4 pt-0"> {/* Padding for inner content */}
          <SuggestedArticlesList customerInquiryText={customerInquiryText} />
          <QuickResponseList onSelectResponse={onSelectQuickResponse} />
        </div>
      </CardContent>
    </Card>
  );
};

export default AiAssistPanel;

    