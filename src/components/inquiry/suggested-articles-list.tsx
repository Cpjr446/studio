
"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { FileText, ExternalLink, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { suggestKnowledgeArticles } from "@/ai/flows/suggest-knowledge-articles";
import type { KnowledgeArticle } from "@/types/support"; 
import { mockKnowledgeArticles } from "@/lib/mock-data"; 
import { cn } from "@/lib/utils";

interface SuggestedArticlesListProps {
  customerInquiryText: string;
}

const SuggestedArticlesList: React.FC<SuggestedArticlesListProps> = ({ customerInquiryText }) => {
  const [suggestedArticles, setSuggestedArticles] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSuggestions = async () => {
    if (!customerInquiryText) return;
    setIsLoading(true);
    setError(null);
    try {
      const result = await suggestKnowledgeArticles({ customerInquiry: customerInquiryText });
      setSuggestedArticles(result.suggestedArticles);
    } catch (err) {
      console.error("Failed to fetch article suggestions:", err);
      setError("Could not load suggestions.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSuggestions();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customerInquiryText]);

  return (
    <Card className="shadow-none border bg-background">
      <CardHeader className="pb-2 pt-3 px-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">Suggested Articles</CardTitle>
          <Button variant="ghost" size="icon" onClick={fetchSuggestions} disabled={isLoading} className="h-7 w-7">
            <RefreshCw className={cn("h-3.5 w-3.5", isLoading && "animate-spin")} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="px-3 pb-3">
        {isLoading && (
          <div className="space-y-2.5">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex items-center gap-2 p-2 rounded-md border border-border">
                <Skeleton className="h-5 w-5 rounded-full" />
                <div className="flex-1 space-y-1">
                  <Skeleton className="h-3.5 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        )}
        {!isLoading && error && (
          <p className="text-xs text-destructive">{error}</p>
        )}
        {!isLoading && !error && suggestedArticles.length === 0 && (
          <p className="text-xs text-muted-foreground">No specific articles found.</p>
        )}
        {!isLoading && !error && suggestedArticles.length > 0 && (
          <ul className="space-y-1.5">
            {suggestedArticles.slice(0, 3).map((articleTitle, index) => { // Show max 3
              const articleDetail = mockKnowledgeArticles.find(a => a.title.toLowerCase().includes(articleTitle.toLowerCase().slice(0,15)));
              return (
                <li key={index} className="flex items-center justify-between gap-2 p-2 rounded-md border border-border hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary flex-shrink-0" />
                    <div>
                      <h4 className="text-xs font-medium leading-tight">{articleTitle}</h4>
                      {/* {articleDetail?.summary && <p className="text-xs text-muted-foreground mt-0.5">{articleDetail.summary}</p>} */}
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" asChild className="text-muted-foreground hover:text-accent-foreground h-6 w-6">
                    <a href={articleDetail?.url || "#"} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </Button>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};

export default SuggestedArticlesList;

    