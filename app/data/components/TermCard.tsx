import React, { useMemo } from "react";
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
import { Term, TagItem, allCategory } from "@/data/terms";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";

interface TermCardProps {
  term: Term;
  allTerms?: Term[];
  onShare?: (termId: number) => void;
  onTagClick?: (tag: TagItem) => void;
  onTermLinkClick?: (category: string, termId: string) => void;
  isDetailView?: boolean;
  onClick?: () => void;
  className?: string;
  selectedTags?: string[];
}

export const TermCard: React.FC<TermCardProps> = React.memo(
  ({
    term,
    allTerms = [],
    onShare,
    onTagClick,
    onTermLinkClick,
    isDetailView = false,
    onClick,
    className,
    selectedTags = [],
  }) => {
    const sortedKeywords = useMemo(() => {
      return allTerms
        .flatMap((term) => term.keywords)
        .sort((a, b) => b.length - a.length);
    }, [allTerms]);

    const addLinksToDescription = (description: string): JSX.Element => {
      if (!isDetailView) return <>{description}</>;

      let result: (string | JSX.Element)[] = [description];

      // Sort all keywords by length in descending order, excluding "キャラクター" category
      const sortedKeywords = allTerms
        .filter((term) => term.category !== "キャラクター")
        .flatMap((term) => term.keywords)
        .sort((a, b) => b.length - a.length);

      sortedKeywords.forEach((keyword) => {
        result = result.flatMap((part) => {
          if (typeof part === "string") {
            const parts = part.split(new RegExp(`(${keyword})`, "gi"));
            return parts.map((subPart, index) => {
              if (subPart.toLowerCase() === keyword.toLowerCase()) {
                const linkedTerm = allTerms.find(
                  (t) =>
                    t.keywords.includes(keyword) &&
                    t.category !== "キャラクター"
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

    const addLinksToCharacter = (character: string): JSX.Element => {
      if (!isDetailView) return <>{character}</>;

      let result: (string | JSX.Element)[] = [character];

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
                      className="text-sky-600 hover:text-cyan-500"
                    >
                      <span className="hover:underline">{subPart}</span>
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

    const { toast } = useToast();

    const isCategoryWithImage = (category: string) => {
      return allCategory.find((c) => c.category === category)?.image ?? false;
    };

    return (
      <Card
        className={`${isDetailView ? "h-full overflow-auto" : "w-full"} ${
          className || ""
        }`}
        onClick={onClick}
      >
        {isDetailView ? (
          <div
            className={`p-6  grid-cols-6 gap-8 ${
              isCategoryWithImage(term.category) ? "md:grid" : ""
            }`}
          >
            <div
              className={`relative col-span-2 justify-center mb-10 w-3/5 md:w-full mx-auto ${
                isCategoryWithImage(term.category) ? "" : "hidden"
              }`}
              style={{ aspectRatio: "4 / 5" }}
            >
              <Image
                src={term.image || "/placeholder.svg"}
                alt={term.name || "Term image"}
                className="object-cover shadow-md rounded-md"
                layout="fill"
                priority
              />
            </div>
            <div className="flex flex-col space-y-6 col-span-4">
              <div className="space-y-1.5">
                <h3 className="text-xl font-semibold leading-none tracking-tight mt-3 text-center">
                  {term.name}
                </h3>
                <p className="text-base text-muted-foreground mx-auto text-center">
                  {term.ruby}
                </p>
              </div>
              <div className="">
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
                          <div className="text-sm col-span-3 flex flex-wrap gap-x-4 gap-y-1">
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
                        {item.details.map((detail, detailIndex) => (
                          <p key={detailIndex}>
                            {addLinksToDescription(detail)}
                          </p>
                        ))}
                      </div>
                    ))}

                  {term.relationship && (
                    <div className="space-y-2">
                      <div className="text-primary font-semibold text-lg">
                        関連人物
                      </div>
                      {term.relationship?.map((item, index) => (
                        <div key={index} className="space-y-1">
                          <span className="text-sky-600">
                            <span className="pr-1 text-xs">■</span>

                            {item.character.map((char, charIndex) => (
                              <React.Fragment key={charIndex}>
                                {charIndex > 0 && " / "}
                                {addLinksToCharacter(char)}
                              </React.Fragment>
                            ))}
                          </span>
                          {item.details.map((detail, detailIndex) => (
                            <p key={detailIndex}>
                              {addLinksToDescription(detail)}
                            </p>
                          ))}
                        </div>
                      ))}
                    </div>
                  )}
                  {term.description3 &&
                    term.description3.map((item, index) => (
                      <div key={index} className="space-y-1">
                        <div className="text-primary font-semibold text-lg">
                          {item.category}
                        </div>
                        {item.details.map((detail, detailIndex) => (
                          <p key={detailIndex}>
                            {addLinksToDescription(detail)}
                          </p>
                        ))}
                      </div>
                    ))}
                </div>
              </div>
              {/* タグボタン　<div className="flex flex-col items-start gap-4">
                <div className="flex flex-wrap gap-2">
                  {term.tags.map((tag) => (
                    <Button
                      key={tag}
                      variant={
                        selectedTags.includes(tag) ? "destructive" : "outline"
                      }
                      size="xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        onTagClick && onTagClick(tag);
                        toast({
                          description: "タグの絞り込みが変更されました。",
                        });
                      }}
                      className={selectedTags.includes(tag) ? "text-white" : ""}
                    >
                      {tag}
                    </Button>
                  ))}
                </div>
              </div> */}
            </div>
          </div>
        ) : (
          <div
            className={`p-6 grid-cols-5 gap-6 h-full ${
              isCategoryWithImage(term.category) ? "md:grid" : ""
            }`}
          >
            <div
              className={`relative col-span-2 justify-center ${
                isCategoryWithImage(term.category) ? "" : "hidden"
              }`}
              // style={{ aspectRatio: "4 / 5" }}
            >
              <Image
                src={term.image || "/placeholder.svg"} // Use a placeholder if image is undefined
                alt={term.name || "Term image"}
                objectFit="cover"
                className="object-cover shadow-md rounded-md"
                layout="fill"
                priority
              />
            </div>
            <div className="flex flex-col space-y-6 col-span-3 justify-between h-full">
              <div className="space-y-1.5">
                <h3 className="text-lg font-semibold leading-none tracking-tight mt-3">
                  {term.name}
                </h3>
                <p className="text-sm text-muted-foreground">{term.ruby}</p>
              </div>
              <div className="">
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {term.description[0]}
                </p>
              </div>
            </div>
          </div>
        )}
      </Card>
    );
  }
);

TermCard.displayName = "TermCard";

export default TermCard;
