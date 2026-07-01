"use client";

interface ShareButtonsProps {
  title: string;
  url: string;
}

export function ShareButtons({ title, url }: ShareButtonsProps) {
  const encodedTitle = encodeURIComponent(title);
  const encodedUrl = encodeURIComponent(url);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // Clipboard may be unavailable
    }
  }

  return (
    <div className="flex items-center gap-sm pt-md border-t border-white/5">
      <span className="font-label-sm text-label-sm text-on-surface-variant mr-sm">
        SHARE
      </span>
      <a
        href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors"
        aria-label="Share on X"
      >
        <span className="material-symbols-outlined text-sm">share</span>
      </a>
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors"
        aria-label="Share on LinkedIn"
      >
        <span className="material-symbols-outlined text-sm">link</span>
      </a>
      <button
        onClick={copyLink}
        className="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors"
        aria-label="Copy link"
      >
        <span className="material-symbols-outlined text-sm">content_copy</span>
      </button>
    </div>
  );
}
