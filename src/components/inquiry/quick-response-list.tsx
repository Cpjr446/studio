
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
  const quickResponses = mockQuickResponses; // Using mock data

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Quick Responses</CardTitle>
        <CardDescription className="text-xs">Pre-written templates for common inquiries.</CardDescription>
      </CardHeader>
      <CardContent>
        {quickResponses.length === 0 ? (
          <p className="text-sm text-muted-foreground">No quick responses available.</p>
        ) : (
          <ScrollArea className="h-[150px] pr-3 -mr-3"> {/* Adjust height as needed */}
            <ul className="space-y-2">
              {quickResponses.map((response) => (
                <li key={response.id} className="p-2.5 rounded-md border border-border hover:bg-accent/50 transition-colors">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <h4 className="text-sm font-medium leading-tight">{response.title}</h4>
                      <p className="text-xs text-muted-foreground mt-0.5 truncate">{response.content}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onSelectResponse(response.content)}
                      className="text-muted-foreground hover:text-accent-foreground flex-shrink-0"
                      title={`Use: ${response.title}`}
                    >
                      <Send className="h-4 w-4" />
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
