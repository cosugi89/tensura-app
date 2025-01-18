"use client";

import { useState, useMemo } from "react";
import { Crown, HelpCircleIcon, SquareArrowOutUpRight } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Ep, terms } from "@/data/ep";

export default function EpRankingContent() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTerm, setSelectedTerm] = useState<Ep | null>(null);

  const handleRowClick = (term: Ep) => {
    setSelectedTerm(term);
  };

  const formattedId = (id: number | string) => {
    if (id === "-") return id;
    return id.toString().padStart(3, "0");
  };

  const termsWithIds = useMemo(() => {
    let currentId = 1;
    let consecutiveCount = 0;

    return terms.map((term, index) => {
      if (!term.character) {
        return { ...term, id: "-" };
      }

      if (
        index > 0 &&
        term.ep === terms[index - 1].ep &&
        terms[index - 1].character
      ) {
        consecutiveCount++;
        return { ...term, id: currentId - 1 };
      } else {
        currentId += consecutiveCount;
        consecutiveCount = 0;
        return { ...term, id: currentId++ };
      }
    });
  }, []);

  return (
    <div className="space-y-8">
      <div className="shadow-lg rounded-lg p-4 text-sm bg-background">
        <div className=" container mx-auto">
          <div className="px-4">
            <div className="">
              <div className="relative text-xl font-semibold w-fit">
                {/* <Dialog>
                <DialogTrigger asChild>
                  <Button
                    size="icon"
                    variant="outline"
                    className="absolute -top-2 -right-9 h-6 w-6 rounded-full p-0"
                  >
                    <HelpCircleIcon className="h-4 w-4" />
                    <span className="sr-only">Open description</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-[90%] md:max-w-[70%] lg:max-w-[50%]  rounded-lg">
                  <DialogHeader>
                    <DialogTitle>ランキングの見方</DialogTitle>
                  </DialogHeader>
                  <div className="flex space-x-2 text-muted-foreground text-sm">
                    <div>※</div>
                    <div>
                      個人名が判明しているキャラクターのみをまとめています。
                    </div>
                  </div>
                  <div className="flex space-x-2 text-muted-foreground text-sm">
                    <div>※</div>
                    <div>
                      数値の横のプラスとマイナスは、それぞれ「以上」と「以下」を表しています。
                    </div>
                  </div>
                </DialogContent>
              </Dialog> */}
              </div>
            </div>
            <div className="space-y-1 mb-4">
              <p>
                EP（存在値）とは、魔素量や身体能力を数値化した上に、装備している武具の含有エネルギーを加味したもの。大ざっぱに言ってしまえば
                “エネルギー量” です。
              </p>
              <p>
                作中の強さを表す唯一といってもいい指標ですので、ランキング形式でまとめてみました。
              </p>
              <div className="flex space-x-2 text-muted-foreground text-xs pt-3">
                <div>※</div>
                <div>
                  数値の横のプラスとマイナスは、それぞれ「以上」と「以下」を表しています。
                </div>
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            className="shadow p-4 mx-4 rounded-lg bg-gradient-to-br from-orange-50 md:my-3"
            asChild
          >
            <Link href="/data?category=その他&termId=存在値" target="_blank">
              <div className="flex items-center space-x-5">
                <p>EP（存在値）の詳細はこちら</p>
                <SquareArrowOutUpRight className="h-4 w-4 mt-0.5" />
              </div>
            </Link>
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-8">
        <Table>
          {/* <TableCaption>21巻時点</TableCaption> */}
          <TableHeader>
            <TableRow>
              <TableHead className="">
                <Crown className="w-4 h-4" />
              </TableHead>
              <TableHead>EP</TableHead>
              <TableHead>キャラクター</TableHead>
              <TableHead className="text-right hidden md:block content-center">
                参考場所
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {termsWithIds.map((term) => (
              <TableRow
                key={term.name}
                onClick={() => handleRowClick(term)}
                className="cursor-pointer hover:bg-muted/50"
                role="button"
                aria-haspopup="dialog"
              >
                <TableCell
                  className={`font-medium ${
                    term.id === 1
                      ? "text-amber-400"
                      : term.id === 2
                      ? "text-slate-400"
                      : term.id === 3
                      ? "text-orange-700"
                      : ""
                  }`}
                >
                  {formattedId(term.id)}
                </TableCell>
                <TableCell className="text-xs md:text-base">
                  {term.ep}
                </TableCell>
                <TableCell className="text-xs md:text-base">
                  {term.name}
                </TableCell>

                <TableCell className="text-right hidden md:block">
                  {term.volume}巻
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Dialog
          open={!!selectedTerm}
          onOpenChange={() => setSelectedTerm(null)}
        >
          <DialogContent className="max-w-[90%] md:max-w-[70%] lg:max-w-[50%]  rounded-lg">
            <DialogHeader>
              <DialogTitle>{selectedTerm?.name}</DialogTitle>
              <DialogDescription>
                <p className="mb-3">EP：{selectedTerm?.ep}</p>
                <p>{selectedTerm?.volume}巻で判明したEPです。</p>
                <p>{selectedTerm?.description}</p>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
