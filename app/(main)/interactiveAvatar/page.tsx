"use client";

import InteractiveAvatar from "@/components/InteractiveAvatar";
import { Toaster } from "sonner";

export default function InteractiveAvatarPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <Toaster position="top-right" richColors closeButton />
      <InteractiveAvatar />
    </main>
  );
} 