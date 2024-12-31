"use client";

import { useState, useMemo } from "react";
import { Crown, SquareArrowOutUpRight } from "lucide-react";
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

  const formattedId = (id: number) => id.toString().padStart(3, "0");

  const termsWithIds = useMemo(() => {
    let currentId = 1;
    return terms.map((term, index) => {
      if (index > 0 && term.ep === terms[index - 1].ep) {
        return { ...term, id: currentId - 1 };
      } else {
        return { ...term, id: currentId++ };
      }
    });
  }, []);

  return (
    <div className="space-y-8">
      <div className="px-4 space-y-4">
        <h3 className="text-xl font-semibold">EP ランキング</h3>
        <p>
          EP（存在値）とは、魔素量や身体能力を数値化した上に、装備している武具の含有エネルギーを加味したもの。大ざっぱに言ってしまえば
          “エネルギー量” です。
        </p>
        <div className="space-y-2">
          <p>
            作中の強さを表す唯一といってもいい指標ですので、ランキング形式でまとめてみました。
          </p>
          <div className="flex space-x-2 text-muted-foreground text-sm">
            <div>※</div>
            <div>個人名が判明しているキャラクターのみをまとめています。</div>
          </div>
          <div className="flex space-x-2 text-muted-foreground text-sm">
            <div>※</div>
            <div>
              数値の横のプラスとマイナスは、それぞれ「以上」と「以下」を表しています。
            </div>
          </div>
        </div>
      </div>
      <Button variant="ghost" className="shadow p-4 mx-4 rounded-lg " asChild>
        <Link href="/" target="_blank">
          <div className="flex items-center space-x-5">
            <p>EP（存在値）の詳細はこちら</p>
            <SquareArrowOutUpRight className="h-4 w-4 mt-0.5" />
          </div>
        </Link>
      </Button>
      <div>
        <Table>
          <TableCaption>21巻時点</TableCaption>
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
          <DialogContent>
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
