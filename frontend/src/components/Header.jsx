import { useState, useEffect } from "react";
import { Phone } from "lucide-react";
import { Button } from "./ui/button";

export default function Header({ onGetAudit, scrollToSection }) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      data-testid="header"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white shadow-md py-2"
          : "bg-white/95 backdrop-blur-sm py-4"
      }`}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a
            href="/"
            className="flex items-center gap-2"
            data-testid="logo"
          >
            <span className="font-heading font-extrabold text-xl md:text-2xl text-navy tracking-tight">
              Local Lead Systems
            </span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6" data-testid="desktop-nav">
            <button
              onClick={() => scrollToSection("how-it-works")}
              className="font-body font-medium text-neutral-800 hover:text-navy transition-colors"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection("pricing")}
              className="font-body font-medium text-neutral-800 hover:text-navy transition-colors"
            >
              Pricing
            </button>
            <button
              onClick={() => scrollToSection("faq")}
              className="font-body font-medium text-neutral-800 hover:text-navy transition-colors"
            >
              FAQ
            </button>
          </nav>

          {/* CTA Buttons */}
          <div className="flex items-center gap-3">
            {/* Mobile Call Button - Large and Tappable */}
            <a
              href="tel:+1234567890"
              className="md:hidden flex items-center justify-center w-12 h-12 bg-orange text-white rounded-sm shadow-lg active:scale-95 transition-transform"
              data-testid="mobile-call-btn"
            >
              <Phone className="w-5 h-5" />
            </a>

            {/* Desktop CTA */}
            <Button
              onClick={onGetAudit}
              className="btn-primary hidden sm:flex"
              data-testid="header-cta-btn"
            >
              Free Website Check
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
