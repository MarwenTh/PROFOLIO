"use client";
import React from "react";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export const CallToAction = () => {
  const { status } = useSession();
  const router = useRouter();

  const handleJoin = () => {
    if (status === "authenticated") {
      router.push("/dashboard");
    } else {
      router.push("/login");
    }
  };

  return (
    <div className="h-[20rem] w-full bg-white dark:bg-neutral-950 relative flex flex-col items-center justify-center antialiased transition-colors duration-300">
      <div className="max-w-2xl mx-auto p-4">
        <h1 className="relative z-10 text-lg md:text-5xl bg-clip-text text-transparent bg-gradient-to-b from-neutral-800 to-neutral-500 dark:from-neutral-200 dark:to-neutral-600 text-center font-sans font-bold">
          Ready to launch your career?
        </h1>
        <p className="text-neutral-500 max-w-lg mx-auto my-2 text-sm text-center relative z-10">
          Join thousands of developers, designers, and creatives who use PROFOLIO to land their dream jobs.
        </p>
        <div className="flex justify-center mt-8 relative z-10">
            <button 
              onClick={handleJoin}
              className="px-8 py-4 rounded-full bg-black text-white dark:bg-white dark:text-black font-bold text-lg hover:scale-105 transition-transform shadow-xl"
            >
                Join Now
            </button>
        </div>
      </div>
      <BackgroundBeams />
    </div>
  );
};

export const BackgroundBeams = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        "absolute top-0 left-0 w-full h-full bg-white dark:bg-neutral-950 overflow-hidden pointer-events-none transition-colors duration-300",
        className
      )}
    >
        <div className="absolute inset-0 bg-white dark:bg-neutral-950 [mask-image:radial-gradient(transparent,white)] pointer-events-none" />
        
        {/* Simple decorative elements instead of heavy canvas for now for stability */}
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-indigo-500/10 rounded-full blur-3xl" />
    </div>
  );
};
