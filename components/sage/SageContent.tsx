import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Articles, terms } from "@/data/articles";
import { Button } from "../ui/button";
import Link from "next/link";
import { SquareArrowOutUpRight } from "lucide-react";

function formatText(text: string): React.ReactNode[] {
  const parts = text.split("//");

  return parts.map((part, index) => {
    const formattedPart = part.replace(
      /\{(.*?)\}/g,
      (_, p1) => `<span style="color: #DC143C;">${p1}</span>`
    );

    return (
      <React.Fragment key={index}>
        {index > 0 && <br />}
        <span dangerouslySetInnerHTML={{ __html: formattedPart }} />
      </React.Fragment>
    );
  });
}

export default function SageContent() {
  const articles: Articles[] = terms;

  return (
    <div className="h-dvh bg-gray-50/50 space-y-4">
      <div className="shadow-lg rounded-lg p-4 text-sm bg-background">
        <div className=" container mx-auto">
          <div className="px-4 space-y-3 mb-4">
            <div className="space-y-1">
              <p>
                作中のわかりにくい概念の解説や、私個人の考察記事を掲載しています。
              </p>
              <p>用語ごとの解説は別ページ（設定資料集）でまとめています。</p>
            </div>
          </div>
          <Button
            variant="ghost"
            className="shadow p-4 mx-4 rounded-lg bg-gradient-to-br from-rose-50 md:my-3"
            asChild
          >
            <Link href="/" target="_blank">
              <div className="flex items-center space-x-5">
                <p>それぞれの用語の解説はこちら</p>
                <SquareArrowOutUpRight className="h-4 w-4 mt-0.5" />
              </div>
            </Link>
          </Button>
        </div>
      </div>
      <div className="container grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 p-4 mx-auto">
        {articles.map((article, index) => (
          <Dialog key={index}>
            <DialogTrigger className="text-left">
              <div className="p-6 shadow-lg border bg-card rounded-lg space-y-6 h-full flex flex-col justify-between">
                <div className="space-y-1.5">
                  <h3 className="lg:text-lg font-bold">{article.title}</h3>
                  <p className="text-muted-foreground text-sm">{article.sub}</p>
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <div className="text-xs border rounded-lg px-3 py-1">
                      {article.type}
                    </div>
                    <div className="text-xs border rounded-lg px-3 py-1">
                      {article.volume}巻
                    </div>
                    <div className="text-sm">{article.date}</div>
                  </div>
                </div>
              </div>
            </DialogTrigger>
            <DialogContent className="max-w-[90%] md:max-w-[70%] lg:max-w-[50%] h-full max-h-[80%] rounded-lg">
              <ScrollArea className="p-2">
                <DialogHeader>
                  <DialogTitle className="pt-5 font-normal text-sm md:text-base">
                    <div className="space-y-6">
                      <div className="space-y-1.5">
                        <h3 className="lg:text-lg font-bold">
                          {article.title}
                        </h3>
                        <p className="text-muted-foreground text-xs md:text-sm">
                          {article.sub}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2 md:space-x-3 justify-center md:justify-normal">
                        <div className="text-xs border rounded-lg px-3 py-1">
                          {article.type}
                        </div>
                        <div className="text-xs border rounded-lg px-3 py-1">
                          {article.volume}巻
                        </div>
                        <div className="text-sm">{article.date}</div>
                      </div>
                    </div>
                  </DialogTitle>
                  {article.description && (
                    <DialogDescription className="pt-6 text-left space-y-3 text-foreground">
                      {article.description.map((desc, i) => (
                        <p key={i}>{formatText(desc)}</p>
                      ))}
                    </DialogDescription>
                  )}
                </DialogHeader>
              </ScrollArea>
            </DialogContent>
          </Dialog>
        ))}
      </div>
    </div>
  );
}
