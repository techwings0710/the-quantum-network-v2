"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface SaveButtonProps {
  articleId: string;
  initialSaved: boolean;
  authenticated: boolean;
}

export function SaveButton({ articleId, initialSaved, authenticated }: SaveButtonProps) {
  const [saved, setSaved] = useState(initialSaved);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleToggle() {
    if (!authenticated) {
      router.push("/auth/signin");
      return;
    }

    if (loading) return;
    setLoading(true);

    const nextSaved = !saved;
    setSaved(nextSaved); // optimistic update

    try {
      const response = await fetch("/api/saved-articles", {
        method: nextSaved ? "POST" : "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ articleId }),
      });

      if (!response.ok) {
        throw new Error("Failed to toggle save status");
      }
    } catch (error) {
      console.error("Save toggle error:", error);
      setSaved(saved); // revert on error
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleToggle}
      className={`w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center transition-colors ${
        saved
          ? "text-primary hover:bg-surface-container"
          : "text-on-surface-variant hover:text-primary hover:bg-surface-container"
      }`}
      aria-label={saved ? "Unsave article" : "Save article"}
      title={saved ? "Unsave article" : "Save article"}
    >
      <span
        className="material-symbols-outlined text-sm"
        style={{
          fontVariationSettings: saved ? "'FILL' 1, 'wght' 400" : "'FILL' 0, 'wght' 300",
        }}
      >
        bookmark
      </span>
    </button>
  );
}
