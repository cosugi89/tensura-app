import React, { forwardRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";
import { Term } from "@/data/terms";

interface TermCardProps {
  term: Term;
  onShare?: (termId: number) => void;
  onTagClick?: (tag: string) => void;
  isDetailView?: boolean;
  onClick?: () => void;
  className?: string;
}

export const TermCard = forwardRef<HTMLDivElement, TermCardProps>(
  (
    { term, onShare, onTagClick, isDetailView = false, onClick, className },
    ref
  ) => {
    return (
      <Card
        ref={ref}
        className={`${isDetailView ? "h-full overflow-auto" : "w-full"} ${
          className || ""
        }`}
        onClick={onClick}
      >
        <CardHeader>
          <CardTitle>{term.title}</CardTitle>
          <CardDescription>{term.category}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{term.description}</p>
          {isDetailView && onShare && (
            <Button onClick={() => onShare(term.id)} className="mt-4">
              <Share2 className="mr-2 h-4 w-4" />
              このページを共有
            </Button>
          )}
        </CardContent>
        <CardFooter>
          <div className="flex flex-wrap gap-2">
            {term.tags.map((tag) => (
              <Button
                key={tag}
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onTagClick && onTagClick(tag);
                }}
              >
                {tag}
              </Button>
            ))}
          </div>
        </CardFooter>
      </Card>
    );
  }
);

TermCard.displayName = "TermCard";
