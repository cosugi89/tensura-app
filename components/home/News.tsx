export default function News() {
  const news = [
    {
      category: "更新情報",
      date: "2024/01/01",
      detail: "転スラ設定まとめサイト「転スラ百科」リニューアル！",
    },
    {
      category: "更新情報",
      date: "2024/01/01",
      detail: "転スラ設定まとめサイト「転スラ百科」リニューアル！",
    },
    {
      category: "更新情報",
      date: "2024/01/01",
      detail: "転スラ設定まとめサイト「転スラ百科」リニューアル！",
    },
    {
      category: "更新情報",
      date: "2024/01/01",
      detail: "転スラ設定まとめサイト「転スラ百科」リニューアル！",
    },
    {
      category: "更新情報",
      date: "2024/01/01",
      detail: "転スラ設定まとめサイト「転スラ百科」リニューアル！",
    },
    {
      category: "更新情報",
      date: "2024/01/01",
      detail: "転スラ設定まとめサイト「転スラ百科」リニューアル！",
    },
    {
      category: "更新情報",
      date: "2024/01/01",
      detail: "転スラ設定まとめサイト「転スラ百科」リニューアル！",
    },
    {
      category: "更新情報",
      date: "2024/01/01",
      detail: "転スラ設定まとめサイト「転スラ百科」リニューアル！",
    },
    {
      category: "発表",
      date: "2024/01/01",
      detail: "転スラ設定まとめサイト「転スラ百科」リニューアル！",
    },
  ];

  return (
    <div className="mx-2 py-4 space-y-4">
      {news.map((e) => (
        <div
          key={e.detail}
          className="shadow p-4 rounded-md space-y-3 bg-background"
        >
          <div className="flex items-center space-x-4">
            <div className="col-span-1 text-xs p-[3px] rounded-full bg-accent text-center w-28">
              {e.category}
            </div>
            <div className="col-span-2 text-xs ">{e.date}</div>
          </div>
          <p className="text-sm">{e.detail}</p>
        </div>
      ))}
    </div>
  );
}
