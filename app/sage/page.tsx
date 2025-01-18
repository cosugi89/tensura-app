"use client";

import { useState } from "react";
import Link from "next/link";
import { Undo2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import SageContent from "@/components/sage/SageContent";
import EpRankingContent from "@/components/sage/EpRankingContent";
import QuizContent from "@/components/sage/QuizContent";

export default function Page() {
  const [selectedContent, setSelectedContent] = useState("sage");

  const handleValueChange = (value: string) => {
    setSelectedContent(value);
  };

  return (
    <div className="h-max bg-gray-50/50">
      <header className="fixed top-0 left-0 right-0 bg-background z-50 shadow-md">
        <div className="lg:hidden flex items-center justify-between container mx-auto p-4">
          <h3 className="font-medium text-base pl-4">解説・考察</h3>
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
      <main className="mx-auto">
        <Tabs
          defaultValue={selectedContent}
          onValueChange={handleValueChange}
          className=""
        >
          <div className="bg-background">
            <div className="mx-4 pb-2 pt-[88px]">
              <TabsList className="container mx-auto grid w-full grid-cols-3 px-4">
                <TabsTrigger value="sage" className="text-xs">
                  解説・考察
                </TabsTrigger>
                <TabsTrigger value="ep" className="text-xs">
                  EPランキング
                </TabsTrigger>
                <TabsTrigger value="quiz" className="text-xs">
                  クイズ
                </TabsTrigger>
              </TabsList>
            </div>
          </div>
          <TabsContent value="sage" className="mt-0 bg-gray-50/50">
            <SageContent />
          </TabsContent>
          <TabsContent value="ep" className="mt-0">
            <EpRankingContent />
          </TabsContent>
          <TabsContent value="quiz" className="mt-0">
            <QuizContent />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
