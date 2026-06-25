"use client";

import { useEffect } from "react";

export function GlassCardObserver() {
  useEffect(() => {
    const cards = document.querySelectorAll(".glass-card");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1 },
    );

    cards.forEach((card) => {
      card.classList.add("glass-card-reveal");
      observer.observe(card);
    });

    return () => observer.disconnect();
  }, []);

  return null;
}
