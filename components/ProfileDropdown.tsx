"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { useEffect, useRef, useState } from "react";

interface ProfileDropdownProps {
  name: string | null | undefined;
  image: string | null | undefined;
}

export function ProfileDropdown({ name, image }: ProfileDropdownProps) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-sm hover:opacity-80 transition-opacity"
      >
        {image && (
          <img
            src={image}
            alt={name ?? "User"}
            className="w-8 h-8 rounded-full border border-white/10"
          />
        )}
        {name && (
          <span className="hidden lg:block font-body-md text-body-md text-on-surface max-w-[120px] truncate">
            {name}
          </span>
        )}
        <span className="material-symbols-outlined text-on-surface-variant text-sm">
          expand_more
        </span>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-sm w-48 glass-card rounded-xl overflow-hidden shadow-lg z-50">
          <div className="py-xs">
            <Link
              href="/profile"
              onClick={() => setOpen(false)}
              className="flex items-center gap-sm px-md py-sm text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low transition-colors font-body-md text-sm"
            >
              <span className="material-symbols-outlined text-sm">person</span>
              My Profile
            </Link>
            <Link
              href="/profile/saved"
              onClick={() => setOpen(false)}
              className="flex items-center gap-sm px-md py-sm text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low transition-colors font-body-md text-sm"
            >
              <span className="material-symbols-outlined text-sm">bookmark</span>
              Saved Articles
            </Link>
            <button
              onClick={() => signOut()}
              className="w-full flex items-center gap-sm px-md py-sm text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low transition-colors font-body-md text-sm"
            >
              <span className="material-symbols-outlined text-sm">logout</span>
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
