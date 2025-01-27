import type { Metadata } from "next";
import { M_PLUS_1 } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const inter = M_PLUS_1({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "転スラ百科",
  description:
    "転スラの設定をまとめたり、解説や考察の記事を投稿したりしているサイトです。情報源は主に書籍です。随時更新予定なのでサイトに関するご希望・ご指摘などあればご連絡ください！",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="jp" suppressHydrationWarning>
      <body className={inter.className}>{children}</body>
      <Toaster />
    </html>
  );
}
