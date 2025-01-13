"use client";

import React, {
  useState,
  useMemo,
  useCallback,
  useRef,
  useEffect,
  memo,
} from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from "@/components/ui/drawer";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  ChevronLeft,
  ChevronRight,
  Filter,
  Home,
  HomeIcon,
  Search,
  Undo2,
  X,
} from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useToast } from "@/hooks/use-toast";
import { terms, allTags, TagItem, allCategory, Term } from "@/data/terms";

// useTerminology フック
function useTerminology(initialCategory: string, initialTermId: string | null) {
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedTags, setSelectedTags] = useState<TagItem[]>([]);
  const [selectedTermIndex, setSelectedTermIndex] = useState(0);
  const router = useRouter();
  const pathname = usePathname();

  // 選択されたカテゴリーとタグに基づいて用語をフィルタリング
  const filteredTerms = useMemo(
    () =>
      terms.filter(
        (term) =>
          term.category === selectedCategory &&
          (selectedTags.length === 0 ||
            selectedTags.every((tag) => term.tags.includes(tag)))
      ),
    [selectedCategory, selectedTags]
  );

  // 選択されたカテゴリーに基づいて利用可能なタグを取得
  const availableTags = useMemo(() => {
    return allTags
      .filter((tag) => tag.category === selectedCategory)
      .map((tag) => tag.name);
  }, [selectedCategory]);

  // 各タグの用語数をカウント
  const tagCounts = useMemo(
    () =>
      availableTags.reduce((acc, tag) => {
        acc[tag] = terms.filter(
          (term) =>
            term.category === selectedCategory && term.tags.includes(tag)
        ).length;
        return acc;
      }, {} as Record<TagItem, number>),
    [selectedCategory, availableTags]
  );

  // タグクリックのハンドラ
  const handleTagClick = useCallback(
    (tag: TagItem) => {
      if (selectedTags.includes(tag)) {
        setSelectedTags(selectedTags.filter((t) => t !== tag));
      } else {
        setSelectedTags([...selectedTags, tag]);
      }
    },
    [selectedTags]
  );

  // カテゴリー変更のハンドラ
  const handleCategoryChange = useCallback(
    (category: string) => {
      setSelectedCategory(category);
      setSelectedTags([]);
      setSelectedTermIndex(0);
    },
    [setSelectedCategory, setSelectedTags, setSelectedTermIndex]
  );

  // 詳細ビューを閉じるハンドラ
  const closeDetailView = useCallback(() => {
    router.push(pathname);
  }, [router, pathname]);

  return {
    selectedCategory,
    selectedTags,
    selectedTermIndex,
    filteredTerms,
    availableTags,
    tagCounts,
    setSelectedTermIndex,
    handleTagClick,
    handleCategoryChange,
    closeDetailView,
  };
}

// TermCard コンポーネント
const TermCard: React.FC<{
  term: Term;
  allTerms?: Term[];
  onShare?: (termId: number) => void;
  onTagClick?: (tag: TagItem) => void;
  onTermLinkClick?: (category: string, termId: string) => void;
  isDetailView?: boolean;
  onClick?: () => void;
  className?: string;
  selectedTags?: string[];
}> = memo(
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
    // キーワードをソート
    const sortedKeywords = useMemo(() => {
      return allTerms
        .flatMap((term) => term.keywords)
        .sort((a, b) => b.length - a.length);
    }, [allTerms]);

    // 説明文にリンクを追加する関数
    const addLinksToDescription = (description: string): JSX.Element => {
      if (!isDetailView) return <>{description}</>;

      let result: (string | JSX.Element)[] = [description];

      // キャラクターカテゴリーを除く全てのキーワードを長さの降順でソート
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

    // キャラクター名にリンクを追加する関数
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

    // ステータス詳細を処理する関数
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
            </div>
          </div>
        ) : (
          <div
            className={`p-4 md:p-6 grid-cols-5 gap-6 h-full min-h-36 ${
              isCategoryWithImage(term.category) ? "grid" : ""
            }`}
          >
            <div
              className={`relative col-span-2 justify-center ${
                isCategoryWithImage(term.category) ? "" : "hidden"
              }`}
            >
              <Image
                src={term.image || "/placeholder.svg"}
                alt={term.name || "Term image"}
                objectFit="cover"
                className="object-cover shadow-md rounded-md"
                layout="fill"
                priority
              />
            </div>
            <div className="flex flex-col space-y-6 col-span-3 justify-between h-full">
              <div className="space-y-1.5">
                <h3
                  className={`text-lg font-semibold leading-none tracking-tight ${
                    isCategoryWithImage(term.category) ? "mt-3" : "mt-1"
                  }`}
                >
                  {term.name}
                </h3>
                <p className="text-xs md:text-sm text-muted-foreground">
                  {term.ruby}
                </p>
              </div>
              <div className="">
                <p className="text-xs md:text-sm text-muted-foreground line-clamp-3">
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

// ClientComponent
export default function ClientComponent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });
  const inputRef = useRef<HTMLInputElement>(null);

  const initialCategory = searchParams?.get("category") || "キャラクター";
  const initialTermId = searchParams?.get("termId") || null;

  const {
    selectedCategory,
    selectedTags,
    selectedTermIndex,
    filteredTerms,
    availableTags,
    tagCounts,
    setSelectedTermIndex,
    handleTagClick,
    handleCategoryChange,
    closeDetailView,
  } = useTerminology(initialCategory, initialTermId);

  const [openDrawer, setOpenDrawer] = useState(false);
  const [openSheet, setOpenSheet] = useState(false);
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);
  const [searchValue, setSearchValue] = useState("");
  const [activeTab, setActiveTab] = useState("category");

  const searchTerms = useCallback((terms: Term[], searchValue: string) => {
    if (!searchValue.trim())
      return { nameKeywordMatches: [], statusMatches: [] };
    const lowercasedSearch = searchValue.toLowerCase();
    const nameKeywordMatches: Term[] = [];
    const statusMatches: Term[] = [];

    terms.forEach((term) => {
      const nameMatch = term.name?.toLowerCase().includes(lowercasedSearch);
      const rubyMatch = term.ruby?.toLowerCase().includes(lowercasedSearch);
      const keywordMatch = term.keywords.some((keyword) =>
        keyword.toLowerCase().includes(lowercasedSearch)
      );
      const statusMatch =
        term.status &&
        Array.isArray(term.status) &&
        term.status.some(
          (statusItem) =>
            Array.isArray(statusItem.details) &&
            statusItem.details.some((detail) =>
              detail.toLowerCase().includes(lowercasedSearch)
            )
        );

      if (nameMatch || rubyMatch || keywordMatch) {
        nameKeywordMatches.push(term);
      } else if (statusMatch) {
        statusMatches.push(term);
      }
    });

    return { nameKeywordMatches, statusMatches };
  }, []);

  const searchResults = useMemo(
    () => searchTerms(terms, searchValue),
    [searchTerms, terms, searchValue]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 入力中は状態を更新しない
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchValue(newValue);
    if (newValue) {
      setActiveTab("keyword");
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (value === "category") {
      setSearchValue("");
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  };

  useEffect(() => {
    if (emblaApi) {
      const onSelect = () => {
        const currentIndex = emblaApi.selectedScrollSnap();
        const currentTerm = filteredTerms[currentIndex];
        if (currentTerm) {
          const newUrl = `/data?category=${encodeURIComponent(
            selectedCategory
          )}&termId=${currentTerm.id}`;
          router.push(newUrl, { scroll: false });
        }
      };

      emblaApi.on("select", onSelect);

      return () => {
        emblaApi.off("select", onSelect);
      };
    }
  }, [emblaApi, filteredTerms, selectedCategory, router]);

  useEffect(() => {
    if (emblaApi && selectedTermIndex !== undefined) {
      emblaApi.scrollTo(selectedTermIndex);
    }
  }, [emblaApi, selectedTermIndex, openDrawer, openSheet]);

  useEffect(() => {
    const category = searchParams?.get("category");
    const termId = searchParams?.get("termId");

    if (category && termId) {
      if (category !== selectedCategory) {
        handleCategoryChange(category);
        setIsAnimating(true);
        setAnimationKey((prev) => prev + 1);
      }

      const termIndex = filteredTerms.findIndex(
        (term) => term.id.toString() === termId
      );

      if (termIndex !== -1) {
        setSelectedTermIndex(termIndex);
        if (window.innerWidth >= 1024) {
          setOpenSheet(true);
        } else {
          setOpenDrawer(true);
        }
      }
    }
  }, [
    searchParams,
    selectedCategory,
    handleCategoryChange,
    setSelectedTermIndex,
    filteredTerms,
    terms,
  ]);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const toggleFilterMenu = useCallback(() => {
    setIsFilterMenuOpen((prev) => !prev);
  }, []);

  const handleCloseDetail = useCallback(() => {
    setOpenDrawer(false);
    setOpenSheet(false);
    closeDetailView();
  }, [closeDetailView]);

  const handleDrawerOpenChange = useCallback(
    (open: boolean) => {
      setOpenDrawer(open);
      if (!open) {
        handleCloseDetail();
      }
    },
    [handleCloseDetail]
  );

  const handleSheetOpenChange = useCallback(
    (open: boolean) => {
      setOpenSheet(open);
      if (!open) {
        handleCloseDetail();
      }
    },
    [handleCloseDetail]
  );

  const handleTermClick = useCallback(
    (termId: number) => {
      const termIndex = terms.findIndex((t) => t.id === termId);
      if (termIndex !== -1) {
        const term = terms[termIndex];
        // カテゴリーが現在のものと異なる場合のみ変更
        if (term.category !== selectedCategory) {
          handleCategoryChange(term.category);
        }
        setSelectedTermIndex(filteredTerms.findIndex((t) => t.id === termId));
        const newUrl = `/data?category=${encodeURIComponent(
          term.category
        )}&termId=${term.id}`;
        router.push(newUrl, { scroll: false });
        if (window.innerWidth >= 1024) {
          setOpenSheet(true);
        } else {
          setOpenDrawer(true);
        }
      }
    },
    [
      terms,
      handleCategoryChange,
      filteredTerms,
      router,
      setSelectedTermIndex,
      selectedCategory,
    ]
  );

  const isCategoryWithImage = (category: string) => {
    return allCategory.find((c) => c.category === category)?.image ?? false;
  };

  const FilterMenu = useCallback(
    () => (
      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="p-4 space-y-3"
      >
        <TabsList className="grid w-full grid-cols-2 shadow-inner">
          <TabsTrigger value="category">カテゴリー</TabsTrigger>
          <TabsTrigger value="keyword">キーワード</TabsTrigger>
        </TabsList>
        <TabsContent value="category">
          <div className="space-y-6">
            <div>
              <div className=" shadow p-4 rounded-lg">
                <RadioGroup
                  value={selectedCategory}
                  onValueChange={handleCategoryChange}
                  className="grid grid-cols-2 gap-3"
                >
                  {allCategory.map(({ category }) => (
                    <div key={category} className="items-center flex">
                      <RadioGroupItem
                        value={category}
                        id={`category-${category}`}
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor={`category-${category}`}
                        className="shadow w-full text-center py-2 rounded-full hover:bg-muted/80 peer-data-[state=checked]:bg-muted-foreground peer-data-[state=checked]:text-muted cursor-pointer transition-colors"
                      >
                        {category}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </div>
            <div>
              <h3 className="font-medium mb-2">タグ</h3>
              <div className="space-y-2 shadow p-6 rounded-lg">
                {availableTags.map((tag) => (
                  <div key={tag} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`tag-${tag}`}
                        checked={selectedTags.includes(tag)}
                        onCheckedChange={() => handleTagClick(tag)}
                        className="border-muted-foreground data-[state=checked]:bg-muted-foreground"
                      />
                      <Label htmlFor={`tag-${tag}`}>{tag}</Label>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {tagCounts[tag]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="keyword">
          <div className="shadow p-6 rounded-lg min-h-[188PX]">
            <div className="relative mb-6">
              <Input
                ref={inputRef}
                placeholder="検索"
                className="shadow-inner border-none bg-muted pr-10 text-sm"
                defaultValue={searchValue}
                onChange={handleChange}
                onBlur={handleBlur}
                aria-label="検索入力"
              />
              {searchValue && (
                <button
                  onClick={() => {
                    setSearchValue("");
                    if (inputRef.current) {
                      inputRef.current.value = "";
                    }
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="検索をクリア"
                >
                  <X size={18} />
                </button>
              )}
            </div>
            <div className="space-y-4">
              {searchResults.nameKeywordMatches.length > 0 ||
              searchResults.statusMatches.length > 0 ? (
                <>
                  {searchResults.nameKeywordMatches.map((term) => (
                    <div
                      key={term.id}
                      className="p-2 hover:bg-muted transition-colors cursor-pointer"
                      onClick={() => handleTermClick(term.id)}
                    >
                      <p className="font-medium">{term.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {term.category}
                      </p>
                    </div>
                  ))}
                  {searchResults.nameKeywordMatches.length > 0 &&
                    searchResults.statusMatches.length > 0 && (
                      <div className="my-4 border-t border-gray-200"></div>
                    )}
                  {searchResults.statusMatches.map((term) => (
                    <div
                      key={term.id}
                      className="p-2 hover:bg-muted transition-colors cursor-pointer"
                      onClick={() => handleTermClick(term.id)}
                    >
                      <p className="font-medium">{term.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {term.category}（関連用語）
                      </p>
                    </div>
                  ))}
                </>
              ) : searchValue ? (
                <p className="text-sm text-muted-foreground">
                  検索結果がありません
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">
                  検索バーから離れると結果が表示されます
                </p>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    ),
    [
      activeTab,
      allTags,
      allCategory,
      handleCategoryChange,
      handleTagClick,
      selectedCategory,
      selectedTags,
      tagCounts,
      searchValue,
      setSearchValue,
      searchResults,
      handleTermClick,
      terms,
    ]
  );

  const AnimatedCard = motion(TermCard);

  return (
    <div className="container mx-auto p-4 mt-20 lg:grid grid-cols-10 lg:gap-6">
      <aside className="hidden lg:block col-span-3 space-y-6">
        <FilterMenu />
      </aside>

      <div className="col-span-7">
        <header className="fixed top-0 left-0 right-0 bg-background z-50 shadow-md">
          <div className="lg:hidden flex items-center justify-between container mx-auto p-4">
            <Button
              variant="ghost"
              className="flex items-center gap-2 w-48 justify-center shadow"
              onClick={toggleFilterMenu}
            >
              <Filter className="w-4 h-4" />
              {selectedCategory}
            </Button>

            <AnimatePresence>
              {!isFilterMenuOpen && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Button variant="ghost" className="shadow">
                    <Link href="/">
                      <Undo2 transform="scale(1, -1)" className="w-4 h-4" />
                    </Link>
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="hidden lg:flex items-center justify-between container mx-auto p-4 min-h-[72px]">
            <Breadcrumb className="pl-4">
              <BreadcrumbList>
                <BreadcrumbItem></BreadcrumbItem>
                <BreadcrumbLink href="/" className="font-semibold text-base">
                  転スラ百科
                </BreadcrumbLink>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="font-medium text-base font">
                    設定資料集
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <AnimatePresence>
          {isFilterMenuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
              onClick={toggleFilterMenu}
            >
              <motion.div
                initial={{ y: "-100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: "-100%", opacity: 0 }}
                transition={{ type: "spring", damping: 30, stiffness: 300 }}
                className="fixed inset-x-0 top-0 bg-background shadow-lg z-50 pt-20 pb-6 px-6 overflow-y-auto h-screen"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="max-w-2xl mx-auto">
                  <FilterMenu />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {filteredTerms.length > 0 ? (
          <main
            className={`grid gap-3 lg:gap-4 ${
              isCategoryWithImage(selectedCategory)
                ? "sm:grid-cols-1 md:grid-cols-2"
                : "grid-cols-2 md:grid-cols-3"
            } lg:mt-0`}
          >
            {filteredTerms.map((term) => (
              <AnimatedCard
                key={term.id}
                term={term}
                onTagClick={handleTagClick}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className={
                  term.id.toString() === searchParams?.get("termId")
                    ? "ring-2 ring-primary"
                    : ""
                }
                onClick={() => handleTermClick(term.id)}
                allTerms={terms}
              />
            ))}
          </main>
        ) : (
          <div className="flex flex-col items-center p-4">
            <p className="text-muted-foreground text-center">
              該当する用語が見つかりませんでした。
              <br />
              絞り込み条件を変えてお試しください。
            </p>
          </div>
        )}
      </div>

      <Drawer open={openDrawer} onOpenChange={handleDrawerOpenChange}>
        <DrawerContent className="bg-opacity-0">
          <DrawerHeader className="text-left">
            <DrawerTitle>{selectedCategory}</DrawerTitle>
          </DrawerHeader>
          <AnimatePresence mode="wait">
            <motion.div
              key={`${animationKey}-${selectedCategory}`}
              className="h-[calc(100vh-200px)] overflow-hidden"
              ref={emblaRef}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex h-full">
                {filteredTerms.map((term, index) => (
                  <div
                    className="flex-[0_0_100%] min-w-0 h-full px-4"
                    key={term.id}
                  >
                    <TermCard
                      term={term}
                      allTerms={terms}
                      onTagClick={handleTagClick}
                      isDetailView={true}
                    />
                  </div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
          <div className="p-4 flex justify-between items-center">
            <Button onClick={scrollPrev} variant="outline" size="icon">
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">前の用語</span>
            </Button>
            <DrawerClose asChild>
              <Button variant="outline" onClick={handleCloseDetail}>
                閉じる
              </Button>
            </DrawerClose>
            <Button onClick={scrollNext} variant="outline" size="icon">
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">次の用語</span>
            </Button>
          </div>
        </DrawerContent>
      </Drawer>

      <Dialog open={openSheet} onOpenChange={handleSheetOpenChange}>
        <DialogContent className="p-0 max-w-4xl">
          <DialogHeader className="p-6">
            <DialogTitle>{selectedCategory}</DialogTitle>
          </DialogHeader>
          <AnimatePresence mode="wait">
            <motion.div
              key={`${animationKey}-${selectedCategory}`}
              className="h-[calc(100vh-200px)] overflow-hidden"
              ref={emblaRef}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex h-full">
                {filteredTerms.map((term, index) => (
                  <div
                    className="flex-[0_0_100%] min-w-0 h-full px-4"
                    key={term.id}
                  >
                    <TermCard
                      term={term}
                      allTerms={terms}
                      onTagClick={handleTagClick}
                      isDetailView={true}
                    />
                  </div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
          <div className="p-4 flex justify-between items-center">
            <Button onClick={scrollPrev} variant="outline" size="icon">
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">前の用語</span>
            </Button>
            <Button variant="outline" onClick={handleCloseDetail}>
              閉じる
            </Button>
            <Button onClick={scrollNext} variant="outline" size="icon">
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">次の用語</span>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
