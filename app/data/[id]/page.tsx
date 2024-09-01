"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { terms } from "@/data/terms";
import { TermCard } from "../components/TermCard";

export default function TermPage({ params }: { params: { id: string } }) {
  const router = useRouter();

  const term = terms.find((t) => t.id.toString() === params.id);

  useEffect(() => {
    if (!term) {
      router.push("/data");
    }
  }, [term, router]);

  if (!term) {
    return null;
  }

  const handleBack = () => {
    router.push(
      `/data?category=${encodeURIComponent(term.category)}&termId=${term.id}`
    );
  };

  return (
    <div className="container mx-auto p-4">
      <Button onClick={handleBack} className="mb-4">
        ← 戻る
      </Button>
      <div className="w-full max-w-2xl mx-auto">
        <TermCard term={term} allTerms={terms} isDetailView={true} />
      </div>
    </div>
  );
}
