import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";

interface DescriptionItem {
  category: string;
  details: string;
}

interface StatusItem {
  category: string;
  details: string[];
}

interface Term {
  id: number;
  title: string;
  description: string[];
  description2?: DescriptionItem[];
  status?: StatusItem[];
  tags: string[];
  category: string;
  keywords: string[];
}

interface TermCardProps {
  term: Term;
  onTagClick?: (tag: string) => void;
  onKeywordClick?: (keyword: string) => void;
  onShare?: (termId: number) => void;
  isDetailView?: boolean;
  allTerms?: Term[];
  className?: string;
  onClick?: () => void;
}

export const TermCard: React.FC<TermCardProps> = ({
  term,
  onTagClick,
  onKeywordClick,
  onShare,
  isDetailView = false,
  allTerms = [],
  className = "",
  onClick,
}) => {
  const handleTagClick = (
    e: React.MouseEvent<HTMLSpanElement>,
    tag: string
  ) => {
    e.stopPropagation();
    onTagClick?.(tag);
  };

  const handleKeywordClick = (
    e: React.MouseEvent<HTMLSpanElement>,
    keyword: string
  ) => {
    e.stopPropagation();
    onKeywordClick?.(keyword);
  };

  const handleShare = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onShare?.(term.id);
  };

  const renderLinkedContent = (content: string) => {
    const words = content.split(/(\s+)/);
    return words.map((word, index) => {
      const linkedTerm = allTerms.find(
        (t) => t.title === word || t.keywords.includes(word)
      );
      if (linkedTerm) {
        return (
          <span
            key={index}
            className="text-primary cursor-pointer hover:underline"
            onClick={(e) => handleKeywordClick(e, word)}
          >
            {word}
          </span>
        );
      }
      return word;
    });
  };

  return (
    <Card
      className={`h-full flex flex-col ${className}`}
      onClick={onClick}
      tabIndex={0}
      role="button"
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick?.();
        }
      }}
    >
      <CardContent className="flex-grow p-6">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-2xl font-bold">{term.title}</h2>
          {!isDetailView && onShare && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleShare}
              aria-label="共有"
            >
              <Share2 className="h-4 w-4" />
            </Button>
          )}
        </div>
        <div className="text-muted-foreground mb-4">
          {term.description.map((desc, index) => (
            <p key={index} className="mb-2">
              {isDetailView ? renderLinkedContent(desc) : desc}
            </p>
          ))}
        </div>
        {isDetailView && term.description2 && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">追加情報</h3>
            {term.description2.map((item, index) => (
              <div key={index} className="mb-2">
                <h4 className="font-medium">{item.category}</h4>
                <p className="text-muted-foreground">
                  {renderLinkedContent(item.details)}
                </p>
              </div>
            ))}
          </div>
        )}
        {isDetailView && term.status && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">ステータス</h3>
            {term.status.map((item, index) => (
              <div key={index} className="mb-2">
                <h4 className="font-medium">{item.category}</h4>
                <ul className="list-disc list-inside">
                  {item.details.map((detail, detailIndex) => (
                    <li key={detailIndex} className="text-muted-foreground">
                      {renderLinkedContent(detail)}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-wrap gap-2 p-6 pt-0">
        {term.tags.map((tag) => (
          <Badge
            key={tag}
            variant="secondary"
            className="cursor-pointer"
            onClick={(e) => handleTagClick(e, tag)}
          >
            {tag}
          </Badge>
        ))}
      </CardFooter>
    </Card>
  );
};
