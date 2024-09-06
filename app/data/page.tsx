import { Suspense } from "react";
import { terms } from "@/data/terms";
import ClientComponent from "./components/ClientComponent";

export default function Page() {
  return (
    <div className="container mx-auto p-4 lg:flex lg:gap-6">
      <Suspense fallback={<div>Loading...</div>}>
        <ClientComponent terms={terms} />
      </Suspense>
    </div>
  );
}
