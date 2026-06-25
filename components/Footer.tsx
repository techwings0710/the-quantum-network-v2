import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-surface-container-lowest border-t border-white/5 w-full py-xl mt-xl">
      <div className="max-w-container-max mx-auto px-md grid grid-cols-1 md:grid-cols-4 gap-lg">
        <div className="space-y-md">
          <span className="font-headline-md text-headline-md font-bold text-on-surface">
            The Quantum Network
          </span>
          <p className="text-on-surface-variant font-body-md">
            Pioneering the future of computation and bridging the gap between
            research and enterprise.
          </p>
        </div>
        <div className="space-y-md">
          <h4 className="font-label-md text-primary">RESOURCES</h4>
          <div className="flex flex-col gap-sm">
            <a
              className="text-on-surface-variant hover:text-primary transition-colors"
              href="#"
            >
              Editorial Guidelines
            </a>
            <a
              className="text-on-surface-variant hover:text-primary transition-colors"
              href="#"
            >
              Research Archives
            </a>
            <a
              className="text-on-surface-variant hover:text-primary transition-colors"
              href="#"
            >
              Brand Assets
            </a>
          </div>
        </div>
        <div className="space-y-md">
          <h4 className="font-label-md text-primary">COMPANY</h4>
          <div className="flex flex-col gap-sm">
            <a
              className="text-on-surface-variant hover:text-primary transition-colors"
              href="#"
            >
              Advertise
            </a>
            <a
              className="text-on-surface-variant hover:text-primary transition-colors"
              href="#"
            >
              Contact
            </a>
            <a
              className="text-on-surface-variant hover:text-primary transition-colors"
              href="#"
            >
              Careers
            </a>
          </div>
        </div>
        <div className="space-y-md">
          <h4 className="font-label-md text-primary">LEGAL</h4>
          <div className="flex flex-col gap-sm">
            <a
              className="text-on-surface-variant hover:text-primary transition-colors"
              href="#"
            >
              Privacy Policy
            </a>
            <a
              className="text-on-surface-variant hover:text-primary transition-colors"
              href="#"
            >
              Terms of Service
            </a>
            <a
              className="text-on-surface-variant hover:text-primary transition-colors"
              href="#"
            >
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
      <div className="max-w-container-max mx-auto px-md mt-xl pt-lg border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-md">
        <p className="text-on-surface-variant text-sm">
          © 2024 The Quantum Network. Pioneering the future of computation.
        </p>
        <div className="flex gap-md">
          <Link className="text-on-surface-variant hover:text-primary" href="#">
            <span className="material-symbols-outlined">public</span>
          </Link>
          <Link className="text-on-surface-variant hover:text-primary" href="#">
            <span className="material-symbols-outlined">alternate_email</span>
          </Link>
          <Link className="text-on-surface-variant hover:text-primary" href="#">
            <span className="material-symbols-outlined">rss_feed</span>
          </Link>
        </div>
      </div>
    </footer>
  );
}
