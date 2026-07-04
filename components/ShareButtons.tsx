"use client";

interface ShareButtonsProps {
  title: string;
  url: string;
}

export function ShareButtons({ title, url }: ShareButtonsProps) {
  const encodedTitle = encodeURIComponent(title);
  const encodedUrl = encodeURIComponent(url);

  async function handleShare() {
    try {
      if (navigator.share) {
        await navigator.share({
          title,
          url,
        });
        return;
      }

      window.open(
        `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
        "_blank",
        "noopener,noreferrer"
      );
    } catch {
      // user cancelled
    }
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      alert("Link copied!");
    } catch {
      alert("Unable to copy link.");
    }
  }

  function openSource() {
    window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <div className="flex items-center gap-sm pt-md border-t border-white/5">
      <span className="font-label-sm text-label-sm text-on-surface-variant mr-sm">
        SHARE
      </span>

      {/* Share */}
      <button
        onClick={handleShare}
        className="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors"
        aria-label="Share article"
        title="Share article"
      >
        <span className="material-symbols-outlined text-sm">
          share
        </span>
      </button>

      {/* Open Original */}
      <button
        onClick={openSource}
        className="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors"
        aria-label="Open original article"
        title="Read original article"
      >
        <span className="material-symbols-outlined text-sm">
          open_in_new
        </span>
      </button>

      {/* Copy */}
      <button
        onClick={copyLink}
        className="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors"
        aria-label="Copy link"
        title="Copy article link"
      >
        <span className="material-symbols-outlined text-sm">
          content_copy
        </span>
      </button>
    </div>
  );
}