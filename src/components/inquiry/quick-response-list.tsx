
"use client";

import type React from "react";
import { MessagesSquare, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { QuickResponse } from "@/types/support";
import { mockQuickResponses } from "@/lib/mock-data";

interface QuickResponseListProps {
  onSelectResponse: (content: string) => void;
}

const QuickResponseList: React.FC<QuickResponseListProps> = ({ onSelectResponse }) => {
  const quickResponses = mockQuickResponses; 

  return (
    <Card className="shadow-none border bg-background">
      <CardHeader className="pb-2 pt-3 px-3">
        <CardTitle className="text-sm font-medium">Quick Responses</CardTitle>
      </CardHeader>
      <CardContent className="px-3 pb-3">
        {quickResponses.length === 0 ? (
          <p className="text-xs text-muted-foreground">No quick responses available.</p>
        ) : (
          <ScrollArea className="h-[120px] pr-2 -mr-2"> 
            <ul className="space-y-1.5">
              {quickResponses.slice(0,3).map((response) => ( // Show max 3
                <li key={response.id} className="p-2 rounded-md border border-border hover:bg-muted/50 transition-colors">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <h4 className="text-xs font-medium leading-tight">{response.title}</h4>
                      <p className="text-xs text-muted-foreground mt-0.5 truncate">{response.content}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onSelectResponse(response.content)}
                      className="text-muted-foreground hover:text-accent-foreground flex-shrink-0 h-6 w-6"
                      title={`Use: ${response.title}`}
                    >
                      <Send className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};

export default QuickResponseList;

    