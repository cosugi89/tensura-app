"use client";

import { useState } from "react";
import Link from "next/link";
import { Undo2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import SageContent from "@/components/SageContent";
import EpRankingContent from "@/components/EpRankingContent";
import QuizContent from "@/components/QuizContent";

export default function Page() {
  const [selectedContent, setSelectedContent] = useState("sage");

  const handleValueChange = (value: string) => {
    setSelectedContent(value);
  };

  return (
    <div>
      <header className="fixed top-0 left-0 right-0 bg-background z-50 shadow-md">
        <div className="lg:hidden flex items-center justify-between container mx-auto p-4">
          <Select
            onValueChange={handleValueChange}
            defaultValue={selectedContent}
          >
            <SelectTrigger className="w-[180px] shadow border-none pl-5">
              <SelectValue placeholder="解説・考察" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="sage">解説・考察</SelectItem>
                <SelectItem value="ep">EP ランキング</SelectItem>
                <SelectItem value="quiz">クイズ</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <Button variant="ghost" className="shadow">
            <Link href="/">
              <Undo2 transform="scale(1, -1)" className="w-4 h-4" />
            </Link>
          </Button>
        </div>
        <div className="hidden lg:flex items-center justify-between container mx-auto p-4 min-h-[72px]">
          <Breadcrumb className="pl-4">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/" className="font-semibold text-base">
                  転スラ百科
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="font-medium text-base">
                  {selectedContent === "sage" && "解説・考察"}
                  {selectedContent === "ep" && "EP ランキング"}
                  {selectedContent === "quiz" && "クイズ"}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <main className="mt-24 p-4">
        {selectedContent === "sage" && <SageContent />}
        {selectedContent === "ep" && <EpRankingContent />}
        {selectedContent === "quiz" && <QuizContent />}
      </main>
    </div>
  );
}
