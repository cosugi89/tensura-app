import { Suspense } from "react";
import ClientComponent from "./components/ClientComponent";

export default function Page() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <ClientComponent />
      </Suspense>
    </div>
  );
}
