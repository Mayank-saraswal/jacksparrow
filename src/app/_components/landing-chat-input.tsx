"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Sparkle } from "@phosphor-icons/react/dist/ssr";

export function LandingChatInput({ 
  isSignedIn, 
  className,
  placeholder = "Ask the AI assistant to do something..."
}: { 
  isSignedIn: boolean;
  className?: string;
  placeholder?: string;
}) {
  const router = useRouter();
  const [query, setQuery] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isSubmitting) return;

    setIsSubmitting(true);
    const encoded = encodeURIComponent(query.trim());
    const targetUrl = `/dashboard?q=${encoded}`;

    if (isSignedIn) {
      router.push(targetUrl);
    } else {
      router.push(`/sign-up?redirect_url=${encodeURIComponent(targetUrl)}`);
    }
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className={`relative flex items-center group ${className ?? "w-full max-w-[500px] mx-auto mt-8"}`}
    >
      <div className="absolute left-4 z-10 flex items-center justify-center pointer-events-none text-muted-foreground group-focus-within:text-[#FF4C00] transition-colors duration-300">
        <Sparkle weight="fill" className="size-5" />
      </div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        disabled={isSubmitting}
        className="w-full h-[52px] pl-[46px] pr-[54px] rounded-full bg-background/50 backdrop-blur-xl border border-border/80 text-foreground text-[18px] sm:text-[20px] shadow-lg ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#FF4C00] focus-visible:border-[#FF4C00] hover:border-border dark:hover:border-neutral-600 placeholder:text-muted-foreground disabled:opacity-50 font-sans"
      />
      <button
        type="submit"
        disabled={!query.trim() || isSubmitting}
        className="absolute right-1.5 h-10 w-10 flex items-center justify-center rounded-full bg-[#FF4C00] text-white transition-all duration-300 hover:bg-[#e64400] disabled:opacity-0 disabled:scale-90 shadow-sm"
      >
        <ArrowRight weight="bold" className="size-4" />
      </button>
    </form>
  );
}
