"use client";

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useEffect, useState } from "react";

interface SearchResult {
  type: "page" | "section";
  title: string;
  path: string;
  content: string;
  pageTitle?: string;
}

interface SearchResultsProps {
  query: string;
  onClose: () => void;
}

export function SearchResults({ query, onClose }: SearchResultsProps) {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const searchContent = async () => {
      if (!query) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await response.json();
        setResults(data.results);
      } catch (error) {
        console.error("Search failed:", error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(searchContent, 300);
    return () => clearTimeout(debounceTimer);
  }, [query]);

  if (!query) return null;

  return (
    <div className="absolute left-0 right-0 top-full z-50 mt-2 max-h-[60vh] overflow-y-auto rounded-md border bg-popover p-2 shadow-md">
      {isLoading ? (
        <div className="flex items-center justify-center p-4">
          <MagnifyingGlassIcon className="size-5 animate-spin" />
        </div>
      ) : results.length > 0 ? (
        <div className="space-y-2">
          {results.map((result, index) => (
            <Link
              key={`${result.type}-${result.path}-${index}`}
              href={result.path}
              onClick={onClose}
              className="block rounded-md p-2 hover:bg-accent"
            >
              <div className="text-sm font-medium">
                {result.type === "section" ? (
                  <>
                    {result.title} <span className="text-muted-foreground">in {result.pageTitle}</span>
                  </>
                ) : (
                  result.title
                )}
              </div>
              <div className="text-muted-foreground mt-1 text-sm line-clamp-2">
                {result.content}
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-muted-foreground p-4 text-center text-sm">
          No results found
        </div>
      )}
    </div>
  );
} 