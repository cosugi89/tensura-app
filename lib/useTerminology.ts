import { useState, useMemo, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { terms, allTags, TagItem } from "@/data/terms";

export function useTerminology(
  initialCategory: string,
  initialTermId: string | null
) {
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedTags, setSelectedTags] = useState<TagItem[]>([]);
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
    return allTags
      .filter((tag) => tag.category === selectedCategory)
      .map((tag) => tag.name);
  }, [selectedCategory]);

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

  const handleCategoryChange = useCallback(
    (category: string) => {
      setSelectedCategory(category);
      setSelectedTags([]);
      setSelectedTermIndex(0);
    },
    [setSelectedCategory, setSelectedTags, setSelectedTermIndex]
  );

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
