import { Suspense } from "react";
import RoseView from "./RoseView";

export function generateStaticParams() {
  return [];
}

export const dynamic = "force-dynamic";
export const dynamicParams = true;

export default function RosePage({ params }: { params: { id: string } }) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-pink-50 to-white">
          <div className="text-2xl text-pink-600">Loading your special message...</div>
        </div>
      }
    >
      <RoseView params={params} />
    </Suspense>
  );
}
