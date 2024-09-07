"use client";

import { useState, useMemo, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { terms } from "@/data/terms";

export function useTerminology(
  initialCategory: string,
  initialTermId: string | null
) {
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedTermIndex, setSelectedTermIndex] = useState(0);
  const router = useRouter();
  const pathname = usePathname();

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

  const availableTags = useMemo(() => {
    const tags = new Set<string>();
    terms.forEach((term) => {
      if (term.category === selectedCategory) {
        term.tags.forEach((tag) => tags.add(tag));
      }
    });
    return Array.from(tags);
  }, [selectedCategory]);

  const tagCounts = useMemo(
    () =>
      availableTags.reduce((acc, tag) => {
        acc[tag] = terms.filter(
          (term) =>
            term.category === selectedCategory && term.tags.includes(tag)
        ).length;
        return acc;
      }, {} as Record<string, number>),
    [selectedCategory, availableTags]
  );

  const handleTagClick = useCallback((tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }, []);

  const handleCategoryChange = useCallback((category: string) => {
    setSelectedCategory(category);
    setSelectedTags([]);
  }, []);

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
