
"use client";

import { useState, useEffect, useCallback } // Added useCallback
import { BaseWidget } from "./base-widget";
import { Button } from "@/components/ui/button";
import { getMotivationalQuote, type MotivationalQuoteOutput } from "@/ai/flows/motivational-quote";
import { Quote as QuoteIcon, RefreshCw, Lightbulb } from "lucide-react"; // Added Lightbulb
import { Skeleton } from "@/components/ui/skeleton";

export function QuoteWidget() {
  const [quoteData, setQuoteData] = useState<MotivationalQuoteOutput | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchQuote = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getMotivationalQuote();
      setQuoteData(data);
    } catch (err) {
      console.error("Failed to fetch quote:", err);
      setError("Could not fetch a new quote. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []); // useCallback dependencies are empty as it doesn't depend on component state/props

  useEffect(() => {
    fetchQuote();
  }, [fetchQuote]); // useEffect depends on fetchQuote

  return (
    <BaseWidget 
      title="Daily Motivation" 
      icon={<Lightbulb className="text-primary h-5 w-5" />} // Changed icon
      headerActions={
        <Button variant="ghost" size="icon" onClick={fetchQuote} disabled={isLoading} className="h-7 w-7 text-primary hover:text-primary">
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          <span className="sr-only">New Quote</span>
        </Button>
      }
    >
      <div className="flex flex-col items-center justify-center h-full text-center p-2">
        {isLoading && !quoteData ? (
          <div className="space-y-3 w-full">
            <Skeleton className="h-6 w-3/4 mx-auto" />
            <Skeleton className="h-4 w-1/2 mx-auto" />
          </div>
        ) : error ? (
          <p className="text-destructive">{error}</p>
        ) : quoteData ? (
          <>
            <QuoteIcon className="w-8 h-8 text-primary mb-3 opacity-50" />
            <p className="text-lg italic text-foreground leading-relaxed">
              "{quoteData.quote}"
            </p>
          </>
        ) : (
          <p className="text-muted-foreground">No quote available.</p>
        )}
      </div>
    </BaseWidget>
  );
}
