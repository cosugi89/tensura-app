import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";
import Link from "next/link";

export default function Info() {
  const news = [
    {
      category: "更新情報",
      date: "2024/01/01",
      detail: "1Lorem ipsum dolor, sit amet consectetur adipisicing elit.",
    },
    {
      category: "更新情報",
      date: "2024/01/01",
      detail: "1Lorem ipsum dolor, sit amet consectetur adipisicing elit.",
    },
    {
      category: "更新情報",
      date: "2024/01/01",
      detail: "1Lorem ipsum dolor, sit amet consectetur adipisicing elit.",
    },
    {
      category: "更新情報",
      date: "2024/01/01",
      detail: "1Lorem ipsum dolor, sit amet consectetur adipisicing elit.",
    },
    {
      category: "更新情報",
      date: "2024/01/01",
      detail: "1Lorem ipsum dolor, sit amet consectetur adipisicing elit.",
    },
    {
      category: "更新情報",
      date: "2024/01/01",
      detail: "1Lorem ipsum dolor, sit amet consectetur adipisicing elit.",
    },
    {
      category: "更新情報",
      date: "2024/01/01",
      detail: "1Lorem ipsum dolor, sit amet consectetur adipisicing elit.",
    },
    {
      category: "更新情報",
      date: "2024/01/01",
      detail: "1Lorem ipsum dolor, sit amet consectetur adipisicing elit.",
    },
  ];

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
    <div className="flex flex-col lg:grid grid-cols-2 h-full">
      <div className="mb-6 flex flex-col col-span-1">
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
                <Image src={icon.svg} alt={icon.name} width={20} height={20} />
              </Link>
            </Button>
          ))}
        </div>
      </div>
      <div className="space-y-6 h-full flex flex-col">
        <div className="mx-6 shadow-inner px-4 rounded-md lg:hidden">
          <div className="py-4 space-y-4">
            {news.map((e) => (
              <div className="shadow p-4 rounded-md space-y-3">
                <div className="flex items-center space-x-4">
                  <div className="col-span-1 text-xs p-[3px] rounded-full bg-accent text-center w-28">
                    {e.category}
                  </div>
                  <div className="col-span-2 text-xs ">{e.date}</div>
                </div>
                <p>{e.detail}</p>
              </div>
            ))}
          </div>
        </div>
        <ScrollArea className="hidden lg:block max-h-[62vh]">
          <div className="mx-6 shadow-inner px-4 rounded-md ">
            <div className="py-4 space-y-4">
              {news.map((e) => (
                <div className="shadow p-4 rounded-md space-y-3">
                  <div className="flex items-center space-x-4">
                    <div className="col-span-1 text-xs p-[3px] rounded-full bg-accent text-center w-28">
                      {e.category}
                    </div>
                    <div className="col-span-2 text-xs ">{e.date}</div>
                  </div>
                  <p>{e.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </ScrollArea>
        <p className="mx-auto text-xs">&copy; 2025 cosugi</p>
      </div>
    </div>
  );
}
