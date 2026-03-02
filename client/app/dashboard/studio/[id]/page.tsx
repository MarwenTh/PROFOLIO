"use client";

import SimpleIDE from "@/components/studio/SimpleIDE";
import { useRouter, useParams } from "next/navigation";

export default function EditComponentPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  return (
    <div className="fixed inset-0 z-[100] bg-background">
      <SimpleIDE
        initialId={id}
        onClose={() => router.push("/dashboard/studio")}
      />
    </div>
  );
}
