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
import Info from "../components/home/Info";
import News from "@/components/home/News";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Home() {
  const [openDialog, setOpenDialog] = useState<string | null>(null);
  const [coverNumber, setCoverNumber] = useState(1);

  useEffect(() => {
    // Generate random number between 1 and 22
    const randomNum = Math.floor(Math.random() * 22) + 1;
    setCoverNumber(randomNum);
  }, []);

  const buttons = [
    {
      name: "Data",
      name2: "設定資料集",
      description: [
        "『転生したらスライムだった件』に登場する設定をまとめています。",
        "キャラクター、スキル、魔法、アーツ、武具、所属、魔物、その他用語のカテゴリーに分けており、それぞれの詳細画面から関連の用語にアクセスすることができます。",
      ],
      href: "/data",
    },
    {
      name: "Sage",
      name2: "解説・考察",
      description: [
        "いくつかのコンテンツを用意しています。",
        "現在は私個人の解説・考察記事とEPランキングのみですが、将来的にはクイズも作る予定です。",
      ],
      href: "/sage",
    },
  ];

  return (
    <main className="h-dvh flex flex-col items-center justify-center overflow-hidden">
      <div className="flex flex-col lg:flex-row items-center justify-center lg:space-x-10 lg:w-[80%] h-[90%]">
        <div className="flex flex-col w-[60vw] md:w-[50vw] lg:w-[20vw]">
          <div
            className="relative w-full items-center justify-center mx-auto"
            style={{ aspectRatio: 97 / 138 }}
          >
            <Link href="https://gcnovels.jp/slime/novel.html" target="_blank">
              <Image
                src={`https://gcnovels.jp/slime/img/cover/img_novel${String(
                  coverNumber
                ).padStart(2, "0")}.jpg`}
                alt={`Book Cover ${coverNumber}`}
                objectFit="cover"
                layout="fill"
                className="object-cover rounded-lg"
                style={{ aspectRatio: 97 / 138 }}
                priority
              />
            </Link>
          </div>
          {/* Reflection */}
          <div
            className="mt-2 relative w-full items-center justify-center mx-auto"
            style={{
              aspectRatio: 97 / 65,
              // transform: "rotateX(180deg) translateY(20px)",
            }}
          >
            <div className="absolute inset-0" style={{ perspective: "1000px" }}>
              <Image
                src={`https://gcnovels.jp/slime/img/cover/img_novel${String(
                  coverNumber
                ).padStart(2, "0")}.jpg`}
                alt=""
                fill
                className="object-cover object-bottom rounded-lg"
                style={{
                  maskImage:
                    "linear-gradient(to top, rgba(0,0,0,0.5), rgba(0,0,0,0) 100%)",
                  WebkitMaskImage:
                    "linear-gradient(to top, rgba(0,0,0,0.5), rgba(0,0,0,0) 100%)",
                  transform: "scaleY(-1)",
                  opacity: 0.6,
                  filter: "brightness(1.4) contrast(0.6)",
                }}
              />
            </div>
          </div>
        </div>
        <div className="w-full max-w-md md:max-w-lg grid grid-cols-1 gap-5 pt-6 lg:h-[75%] -mt-28 md:-mt-56 lg:-mt-0">
          <div className="grid grid-cols-2 gap-5 w-full">
            {buttons.map((button) => (
              <div
                key={button.name}
                className="relative bg-white z-10 rounded-md"
              >
                <Link href={button.href} className="w-full">
                  <Button
                    variant="ghost"
                    className="w-full h-14 shadow relative overflow-hidden rounded-md"
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
                  <DialogContent className="max-w-[90%] md:max-w-[70%] lg:max-w-[50%]  rounded-lg">
                    <DialogHeader>
                      <DialogTitle>{button.name2}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-2 text-sm">
                      {button.description.map((desc, index) => (
                        <p key={index} className="">
                          {desc}
                        </p>
                      ))}
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            ))}
          </div>
          <div className="relative w-full bg-white z-10">
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
              <DialogContent className="max-w-[90%] md:max-w-[70%] lg:max-w-[50%] h-[80%] lg:h-auto rounded-lg px-0">
                <DialogHeader>
                  <DialogTitle className="px-6">転スラ百科</DialogTitle>
                </DialogHeader>
                <Info />
              </DialogContent>
            </Dialog>
          </div>
          <ScrollArea className="h-full hidden lg:block shadow-inner px-4 rounded-md bg-gray-50/50">
            <News />
          </ScrollArea>
        </div>
      </div>
    </main>
  );
}
