"use client";

import { useState, useCallback, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useTerminology } from "@/lib/useTerminology";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from "@/components/ui/drawer";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ChevronLeft, ChevronRight, Filter } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import TermCard from "./TermCard";
import { Term } from "@/data/terms";

const AnimatedCard = motion(TermCard);

export default function ClientComponent({ terms }: { terms: Term[] }) {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "キャラクター";
  const initialTermId = searchParams.get("termId");

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
    setInitialData,
  } = useTerminology(terms);

  const [openDrawer, setOpenDrawer] = useState(false);
  const [openSheet, setOpenSheet] = useState(false);
  const [emblaRef, emblaApi] = useEmblaCarousel({
    startIndex: 0,
    align: "center",
  });
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    setInitialData(initialCategory, initialTermId);
  }, [initialCategory, initialTermId, setInitialData]);

  const scrollPrev = useCallback(
    () => emblaApi && emblaApi.scrollPrev(),
    [emblaApi]
  );
  const scrollNext = useCallback(
    () => emblaApi && emblaApi.scrollNext(),
    [emblaApi]
  );

  const toggleFilterMenu = useCallback(() => {
    setIsFilterMenuOpen((prev) => !prev);
  }, []);

  const handleShare = useCallback((termId: number) => {
    const url = `${window.location.origin}/data/${termId}`;
    navigator.clipboard
      .writeText(url)
      .then(() => {
        setAlertMessage("このページのURLがクリップボードにコピーされました。");
        setIsAlertOpen(true);
      })
      .catch((err) => {
        console.error("クリップボードへのコピーに失敗しました:", err);
        setAlertMessage("URLのコピーに失敗しました。");
        setIsAlertOpen(true);
      });
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

  const FilterMenu = () => (
    <div className="space-y-6 p-4">
      <div>
        <h3 className="font-medium mb-2">カテゴリー</h3>
        <RadioGroup
          value={selectedCategory}
          onValueChange={handleCategoryChange}
          className="flex flex-wrap gap-2"
        >
          {["キャラクター", "スキル", "場所", "その他"].map((category) => (
            <div key={category} className="flex items-center">
              <RadioGroupItem
                value={category}
                id={`category-${category}`}
                className="peer sr-only"
              />
              <Label
                htmlFor={`category-${category}`}
                className="px-3 py-1 rounded-full bg-muted hover:bg-muted/80 peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-primary-foreground cursor-pointer transition-colors"
              >
                {category}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
      <div>
        <h3 className="font-medium mb-2">タグ</h3>
        <div className="space-y-2">
          {availableTags.map((tag) => (
            <div key={tag} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`tag-${tag}`}
                  checked={selectedTags.includes(tag)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      handleTagClick(tag);
                    } else {
                      handleTagClick(tag);
                    }
                  }}
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
  );

  return (
    <>
      <aside className="hidden lg:block lg:w-1/4 space-y-6">
        <FilterMenu />
      </aside>

      <div className="lg:w-3/4">
        <header className="lg:hidden fixed top-0 left-0 right-0 bg-background z-50 p-4 shadow-md">
          <div className="flex items-center max-w-6xl mx-auto">
            <Button
              variant="outline"
              className="flex items-center gap-2 w-48 justify-center"
              onClick={toggleFilterMenu}
            >
              <Filter className="w-4 h-4" />
              {selectedCategory}
            </Button>
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
                className="fixed inset-x-0 top-0 bg-background shadow-lg z-50 pt-20 pb-6 px-6 overflow-y-auto max-h-screen"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="max-w-2xl mx-auto">
                  <FilterMenu />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <main className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 mt-20 lg:mt-0">
          {filteredTerms.map((term: Term, index: number) => (
            <AnimatedCard
              key={term.id}
              term={term}
              onTagClick={handleTagClick}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              onClick={() => {
                setSelectedTermIndex(index);
                if (window.innerWidth >= 1024) {
                  setOpenSheet(true);
                } else {
                  setOpenDrawer(true);
                }
              }}
              allTerms={terms}
            />
          ))}
        </main>
      </div>

      <Drawer open={openDrawer} onOpenChange={handleDrawerOpenChange}>
        <DrawerContent className="bg-opacity-0">
          <DrawerHeader className="text-left">
            <DrawerTitle>詳細情報</DrawerTitle>
          </DrawerHeader>
          <div className="h-[calc(100vh-200px)] overflow-hidden" ref={emblaRef}>
            <div className="flex h-full">
              {filteredTerms.map((term: Term, index: number) => (
                <div
                  className="flex-[0_0_100%] min-w-0 h-full px-4"
                  key={term.id}
                >
                  <TermCard
                    term={term}
                    allTerms={terms}
                    onShare={handleShare}
                    onTagClick={handleTagClick}
                    isDetailView={true}
                  />
                </div>
              ))}
            </div>
          </div>
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

      <Sheet open={openSheet} onOpenChange={handleSheetOpenChange}>
        <SheetContent
          side="right"
          className="w-[100%] sm:w-[540px] sm:max-w-[75vw] p-0"
        >
          <SheetHeader className="p-6">
            <SheetTitle>詳細情報</SheetTitle>
          </SheetHeader>
          <div className="h-[calc(100vh-200px)] overflow-hidden" ref={emblaRef}>
            <div className="flex h-full">
              {filteredTerms.map((term: Term, index: number) => (
                <div
                  className="flex-[0_0_100%] min-w-0 h-full px-4"
                  key={term.id}
                >
                  <TermCard
                    term={term}
                    allTerms={terms}
                    onShare={handleShare}
                    onTagClick={handleTagClick}
                    isDetailView={true}
                  />
                </div>
              ))}
            </div>
          </div>
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
        </SheetContent>
      </Sheet>

      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>通知</AlertDialogTitle>
            <AlertDialogDescription>{alertMessage}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>OK</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
