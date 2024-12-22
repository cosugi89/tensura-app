"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { HelpCircle } from "lucide-react";
import Info from "../components/Info";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Home() {
  const [openDialog, setOpenDialog] = useState<string | null>(null);
  const [coverNumber, setCoverNumber] = useState(1);

  useEffect(() => {
    // Generate random number between 1 and 21
    const randomNum = Math.floor(Math.random() * 21) + 1;
    setCoverNumber(randomNum);
  }, []);

  const buttons = [
    {
      name: "Data",
      name2: "設定資料集",
      description: "View and analyze data related to the book.",
      href: "/data",
    },
    {
      name: "Sage",
      name2: "解説・考察",
      description: "Get insights and recommendations from our AI sage.",
      href: "/sage",
    },
  ];

  return (
    <main className="flex max-h-screen flex-col items-center justify-between p-14">
      <div className="flex-1 flex items-center justify-center w-full">
        <Link href="https://gcnovels.jp/slime/novel.html" target="_blank">
          <Image
            src={`https://gcnovels.jp/slime/img/cover/img_novel${String(
              coverNumber
            ).padStart(2, "0")}.jpg`}
            alt={`Book Cover ${coverNumber}`}
            width={485}
            height={690}
            className="rounded-lg shadow-lg "
            priority
          />
        </Link>
      </div>
      <div className="w-full max-w-md md:max-w-lg grid grid-cols-1 gap-5 pt-6">
        <div className="grid grid-cols-2 gap-5 w-full">
          {buttons.map((button) => (
            <div key={button.name} className="relative">
              <Link href={button.href} className="w-full">
                <Button
                  variant="ghost"
                  className="w-full h-14 shadow relative overflow-hidden"
                >
                  <span className="absolute bottom-1 left-2 text-xs text-muted">
                    {button.name}
                  </span>
                  <span className="font-medium">{button.name2}</span>
                </Button>
              </Link>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    size="icon"
                    variant="outline"
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                  >
                    <HelpCircle className="h-4 w-4" />
                    <span className="sr-only">
                      Open {button.name} description
                    </span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-[90%] rounded-lg">
                  <DialogHeader>
                    <DialogTitle>{button.name2}</DialogTitle>
                  </DialogHeader>
                  <p>{button.description}</p>
                </DialogContent>
              </Dialog>
            </div>
          ))}
        </div>
        <div className="relative w-full">
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                className="w-full shadow relative overflow-hidden"
              >
                <span className="absolute bottom-1 left-2 text-xs text-muted">
                  Info
                </span>
                <span className="font-medium">このサイトについて</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[90%] h-[80%] rounded-lg px-0">
              <DialogHeader>
                <DialogTitle className="px-6">転スラ百科</DialogTitle>
              </DialogHeader>
              <ScrollArea className="h-full text-sm md:text-base lg:hidden">
                <Info />
              </ScrollArea>
              <div className="hidden lg:block h-full">
                <Info />
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </main>
  );
}
