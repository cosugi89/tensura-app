import React, { forwardRef } from "react";
import Link from "next/link";
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
import { Term, TagItem } from "@/data/terms";

interface TermCardProps {
  term: Term;
  allTerms?: Term[];
  onShare?: (termId: number) => void;
  onTagClick?: (tag: TagItem) => void;
  isDetailView?: boolean;
  onClick?: () => void;
  className?: string;
  selectedTags?: string[]; // 新しく追加されたプロパティ
}

export const TermCard = forwardRef<HTMLDivElement, TermCardProps>(
  (
    {
      term,
      allTerms = [],
      onShare,
      onTagClick,
      isDetailView = false,
      onClick,
      className,
      selectedTags = [], // デフォルト値を空の配列に設定
    },
    ref
  ) => {
    const addLinksToDescription = (description: string): JSX.Element => {
      if (!isDetailView) return <>{description}</>;

      let result: (string | JSX.Element)[] = [description];

      // Sort all keywords by length in descending order
      const sortedKeywords = allTerms
        .flatMap((term) => term.keywords)
        .sort((a, b) => b.length - a.length);

      sortedKeywords.forEach((keyword) => {
        result = result.flatMap((part) => {
          if (typeof part === "string") {
            const parts = part.split(new RegExp(`(${keyword})`, "gi"));
            return parts.map((subPart, index) => {
              if (subPart.toLowerCase() === keyword.toLowerCase()) {
                const linkedTerm = allTerms.find((t) =>
                  t.keywords.includes(keyword)
                );
                if (linkedTerm) {
                  return (
                    <Link
                      key={`${keyword}-${index}`}
                      href={`/data?category=${encodeURIComponent(
                        linkedTerm.category
                      )}&termId=${linkedTerm.id}`}
                      className="text-sky-600 hover:underline hover:text-cyan-500"
                    >
                      {subPart}
                    </Link>
                  );
                }
              }
              return subPart;
            });
          }
          return part;
        });
      });

      return <>{result}</>;
    };

    const processStatusDetail = (detail: string): JSX.Element => {
      const parts = detail.split(/(\（[^）]+\）)/);
      return (
        <>
          {parts.map((part, index) => {
            if (part.startsWith("（") && part.endsWith("）")) {
              return (
                <span
                  key={index}
                  className="text-xs text-muted-foreground mx-1"
                >
                  {part.slice(1, -1)}
                </span>
              );
            }
            return addLinksToDescription(part);
          })}
        </>
      );
    };

    const descriptionsWithLinks = term.description.map((desc) =>
      addLinksToDescription(desc)
    );

    return (
      <Card
        ref={ref}
        className={`${isDetailView ? "h-full overflow-auto" : "w-full"} ${
          className || ""
        }`}
        onClick={onClick}
      >
        <CardHeader>
          <CardTitle>{term.id}</CardTitle>
          <CardDescription>{term.category}</CardDescription>
        </CardHeader>
        <CardContent>
          {isDetailView ? (
            <div className="text-sm space-y-6 tracking-widest">
              <div className="space-y-4">
                {descriptionsWithLinks.map((desc, index) => (
                  <p key={index}>{desc}</p>
                ))}
              </div>
              {term.status && (
                <div className="pt-4 pb-6">
                  {term.status.map((item, index) => (
                    <div
                      key={index}
                      className="grid gap-3 grid-cols-4 border-b py-3"
                    >
                      <div className="text-sm">{item.category}</div>
                      <div className="text-sm col-span-3 flex flex-wrap gap-x-3 gap-y-1">
                        {item.details.map((detail, detailIndex) => (
                          <p key={detailIndex} className="">
                            {processStatusDetail(detail)}
                          </p>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {term.description2 &&
                term.description2.map((item, index) => (
                  <div key={index} className="space-y-1">
                    <div className="text-primary font-semibold text-lg">
                      {item.category}
                    </div>
                    <p>{addLinksToDescription(item.details)}</p>
                  </div>
                ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground line-clamp-3">
              {term.description[0]}
            </p>
          )}
        </CardContent>
        <CardFooter className="flex flex-col items-start gap-4">
          <div className="flex flex-wrap gap-2">
            {term.tags.map((tag) => (
              <Button
                key={tag}
                variant={selectedTags.includes(tag) ? "destructive" : "outline"}
                size="xs"
                onClick={(e) => {
                  e.stopPropagation();
                  onTagClick && onTagClick(tag);
                }}
                className={selectedTags.includes(tag) ? "text-white" : ""}
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

export default TermCard;
