
"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { FileText, ExternalLink, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { suggestKnowledgeArticles } from "@/ai/flows/suggest-knowledge-articles";
import type { KnowledgeArticle } from "@/types/support"; // Assuming mockKnowledgeArticles provides structure
import { mockKnowledgeArticles } from "@/lib/mock-data"; // For fallback/demo structure

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
      // The flow returns string array, map them to KnowledgeArticle like structure for display consistency
      // For this example, we'll just use the titles. A real app might fetch full article details.
      setSuggestedArticles(result.suggestedArticles);
    } catch (err) {
      console.error("Failed to fetch article suggestions:", err);
      setError("Could not load suggestions. Please try again.");
      // Fallback to mock for demo purposes if API fails in a real scenario
      // setSuggestedArticles(mockKnowledgeArticles.slice(0,2).map(a => a.title)); 
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSuggestions();
  }, [customerInquiryText]);

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Suggested Articles</CardTitle>
          <Button variant="ghost" size="icon" onClick={fetchSuggestions} disabled={isLoading}>
            <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
          </Button>
        </div>
        <CardDescription className="text-xs">AI-powered recommendations based on the inquiry.</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="space-y-3">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-2 rounded-md border">
                <Skeleton className="h-6 w-6 rounded-full" />
                <div className="flex-1 space-y-1">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        )}
        {!isLoading && error && (
          <p className="text-sm text-destructive">{error}</p>
        )}
        {!isLoading && !error && suggestedArticles.length === 0 && (
          <p className="text-sm text-muted-foreground">No specific articles found for this inquiry.</p>
        )}
        {!isLoading && !error && suggestedArticles.length > 0 && (
          <ul className="space-y-2">
            {suggestedArticles.map((articleTitle, index) => {
              // Try to find a matching mock article for more details, otherwise just use title
              const articleDetail = mockKnowledgeArticles.find(a => a.title.toLowerCase().includes(articleTitle.toLowerCase().slice(0,15)));
              return (
                <li key={index} className="flex items-center justify-between gap-2 p-2.5 rounded-md border border-border hover:bg-accent/50 transition-colors">
                  <div className="flex items-center gap-2.5">
                    <FileText className="h-5 w-5 text-primary flex-shrink-0" />
                    <div>
                      <h4 className="text-sm font-medium leading-tight">{articleTitle}</h4>
                      {articleDetail?.summary && <p className="text-xs text-muted-foreground mt-0.5">{articleDetail.summary}</p>}
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" asChild className="text-muted-foreground hover:text-accent-foreground">
                    <a href={articleDetail?.url || "#"} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4" />
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
