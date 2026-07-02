"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { FormEvent, useEffect, useRef } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const SIGNIN_STYLES = `
  .signin-glass-card {
    background: rgba(26, 32, 42, 0.6);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    position: relative;
    overflow: hidden;
  }
  .signin-glass-card::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  }
  .signin-luminous-glow {
    filter: blur(120px);
    opacity: 0.15;
    pointer-events: none;
  }
  .signin-page .material-symbols-outlined {
    font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24;
  }
  .signin-input-glow:focus-within {
    box-shadow: 0 0 20px rgba(173, 198, 255, 0.1);
  }
  .signin-quantum-dot {
    width: 6px;
    height: 6px;
    background: #adc6ff;
    border-radius: 50%;
    position: relative;
  }
  .signin-quantum-dot::after {
    content: '';
    position: absolute;
    inset: -4px;
    border: 1px solid rgba(173, 198, 255, 0.4);
    border-radius: 50%;
    animation: signin-pulse 2s infinite;
  }
  @keyframes signin-pulse {
    0% { transform: scale(1); opacity: 1; }
    100% { transform: scale(2.5); opacity: 0; }
  }
`;

export default function SignInPage() {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const inputs = document.querySelectorAll("#signin-form input");
    inputs.forEach((input) => {
      const group = input.parentElement?.parentElement;
      if (!group) return;

      const onFocus = () => group.classList.add("scale-[1.01]");
      const onBlur = () => group.classList.remove("scale-[1.01]");

      input.addEventListener("focus", onFocus);
      input.addEventListener("blur", onBlur);
    });

    const handleMouseMove = (e: MouseEvent) => {
      const card = cardRef.current;
      if (!card) return;

      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      if (x > 0 && x < rect.width && y > 0 && y < rect.height) {
        card.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(173, 198, 255, 0.08) 0%, rgba(26, 32, 42, 0.6) 50%)`;
      } else {
        card.style.background = "rgba(26, 32, 42, 0.6)";
      }
    };

    document.addEventListener("mousemove", handleMouseMove);
    return () => document.removeEventListener("mousemove", handleMouseMove);
  }, []);

  function handleGoogleSignIn() {
    signIn("google", { callbackUrl: "/" });
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    handleGoogleSignIn();
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: SIGNIN_STYLES }} />
      <div className="signin-page min-h-screen flex flex-col bg-background text-on-surface antialiased selection:bg-primary/30">
        {/* Atmospheric Background Elements */}
        <div className="fixed inset-0 overflow-hidden -z-10">
          <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-primary signin-luminous-glow rounded-full" />
          <div className="absolute bottom-[5%] right-[-10%] w-[35%] h-[35%] bg-secondary signin-luminous-glow rounded-full" />
        </div>

        <Header />

        <main className="flex-grow flex items-center justify-center px-margin-mobile py-xl relative mt-16">
          <div className="w-full max-w-[480px] z-10">
            {/* Glassmorphic Auth Card */}
            <div
              ref={cardRef}
              className="signin-glass-card rounded-xl p-lg md:p-xl shadow-2xl"
            >
              <div className="space-y-sm mb-lg">
                <h1 className="font-headline-lg text-headline-lg text-on-surface">
                  Welcome back
                </h1>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Sign in to access the latest quantum news, research highlights,
                  and ecosystem opportunities.
                </p>
              </div>

              <form
                id="signin-form"
                className="space-y-md"
                onSubmit={handleSubmit}
              >
                {/* Email Field */}
                <div className="space-y-xs group">
                  <label
                    className="font-label-sm text-label-sm text-on-surface-variant group-focus-within:text-primary transition-colors"
                    htmlFor="email"
                  >
                    Email address
                  </label>
                  <div className="relative signin-input-glow border-b border-outline-variant focus-within:border-primary transition-all duration-300">
                    <input
                      className="w-full bg-transparent border-none py-sm px-0 focus:ring-0 font-body-md text-body-md text-on-surface placeholder:text-outline-variant/50"
                      id="email"
                      placeholder="name@organization.com"
                      required
                      type="email"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-xs group">
                  <label
                    className="font-label-sm text-label-sm text-on-surface-variant group-focus-within:text-primary transition-colors"
                    htmlFor="password"
                  >
                    Password
                  </label>
                  <div className="relative signin-input-glow border-b border-outline-variant focus-within:border-primary transition-all duration-300">
                    <input
                      className="w-full bg-transparent border-none py-sm px-0 focus:ring-0 font-body-md text-body-md text-on-surface placeholder:text-outline-variant/50"
                      id="password"
                      placeholder="••••••••"
                      required
                      type="password"
                    />
                  </div>
                </div>

                {/* Utils Row */}
                <div className="flex items-center justify-between font-label-md text-label-md">
                  <label className="flex items-center gap-base cursor-pointer group">
                    <input
                      className="w-4 h-4 rounded bg-surface-container-highest border-outline-variant text-primary focus:ring-offset-background focus:ring-primary"
                      type="checkbox"
                    />
                    <span className="text-on-surface-variant group-hover:text-on-surface transition-colors">
                      Remember me
                    </span>
                  </label>
                  <a
                    className="text-primary hover:text-primary-fixed-dim transition-colors"
                    href="#"
                  >
                    Forgot password?
                  </a>
                </div>

                {/* Sign In CTA */}
                <button
                  className="w-full py-md bg-primary text-on-primary font-headline-md text-headline-md rounded-lg shadow-[0_0_20px_rgba(173,198,255,0.2)] hover:shadow-[0_0_30px_rgba(173,198,255,0.4)] active:scale-[0.98] transition-all duration-200 mt-md"
                  type="submit"
                >
                  Sign In
                </button>
              </form>

              {/* Divider */}
              <div className="relative flex items-center my-lg">
                <div className="flex-grow border-t border-outline-variant/30" />
                <span className="flex-shrink mx-4 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest">
                  or continue with
                </span>
                <div className="flex-grow border-t border-outline-variant/30" />
              </div>

              {/* Social Auth */}
              <div className="grid grid-cols-2 gap-md">
                <button
                  type="button"
                  onClick={() =>
                    signIn("google", {
                      callbackUrl: "/",
                    })
                  }
                  className="flex items-center justify-center gap-base py-sm bg-surface-container-low border border-outline-variant/30 rounded-lg font-label-md text-label-md text-on-surface hover:bg-surface-container-high transition-colors active:scale-[0.98]"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    public
                  </span>
                  Google
                </button>
                <button
                  type="button"
                  className="flex items-center justify-center gap-base py-sm bg-surface-container-low border border-outline-variant/30 rounded-lg font-label-md text-label-md text-on-surface hover:bg-surface-container-high transition-colors active:scale-[0.98]"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    terminal
                  </span>
                  GitHub
                </button>
              </div>

              {/* Footer link */}
              <div className="mt-xl text-center">
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Don&apos;t have an account?{" "}
                  <Link
                    className="text-primary font-semibold hover:underline underline-offset-4 decoration-primary/30 transition-all"
                    href="/join-us"
                  >
                    Join the network
                  </Link>
                </p>
              </div>
            </div>

            {/* Supporting Text Overlay */}
            <div className="mt-lg px-md text-center">
              <p className="font-label-sm text-label-sm text-outline tracking-wider uppercase opacity-50">
                Secure Enterprise Portal 2.0
              </p>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
