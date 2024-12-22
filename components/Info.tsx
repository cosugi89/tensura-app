import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";
import Link from "next/link";
import News from "./News";

export default function Info() {
  const icons = [
    {
      name: "YouTnbe",
      href: "https://www.youtube.com/@co_sugi",
      svg: "/youtube.svg",
    },
    {
      name: "X",
      href: "https://x.com/CO_sugi_",
      svg: "/x.svg",
    },
    {
      name: "note",
      href: "https://note.com/co_sugi",
      svg: "/note.svg",
    },
  ];

  return (
    <ScrollArea className="h-full text-sm md:text-base">
      <div className="flex flex-col h-full">
        <div className="mb-6 flex flex-col">
          <div className="mx-6 mt-2 mb-6 p-4 shadow rounded-md">
            <p>
              転スラの設定をまとめたり、解説や考察の記事を投稿したりしているサイトです。情報源は主に書籍です。
              <br />
              随時更新予定なのでサイトに関するご希望・ご指摘などあればご連絡ください！
              <br />
              <br />
              ご連絡は以下からお願いします。
            </p>
          </div>
          <div className="mx-auto space-x-4">
            {icons.map((icon) => (
              <Button key={icon.name} variant="ghost" className="shadow">
                <Link href={icon.href} target="_blank">
                  <Image
                    src={icon.svg}
                    alt={icon.name}
                    width={20}
                    height={20}
                  />
                </Link>
              </Button>
            ))}
          </div>
        </div>
        <div className="space-y-6 h-full flex flex-col lg:hidden">
          <div className="mx-6 shadow-inner px-2 rounded-md">
            <News />
          </div>
          <p className="mx-auto text-xs">&copy; 2025 cosugi</p>
        </div>
      </div>
    </ScrollArea>
  );
}
