"use client";

import SimpleIDE from "@/components/studio/SimpleIDE";
import { useRouter } from "next/navigation";

export default function NewComponentPage() {
  const router = useRouter();

  return (
    <div className="fixed inset-0 z-[100] bg-background">
      <SimpleIDE onClose={() => router.push("/dashboard/studio")} />
    </div>
  );
}
