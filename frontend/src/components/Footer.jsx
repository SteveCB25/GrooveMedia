export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      data-testid="footer"
      className="bg-neutral-black py-10"
    >
      <div className="container-custom">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo & Location */}
          <div className="text-center md:text-left">
            <span className="font-heading font-extrabold text-xl text-white">
              Local Lead Systems
            </span>
            <p className="text-white/40 font-body text-sm mt-1">
              Montgomery • Howard • Frederick Counties
            </p>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6 text-white/40 font-body text-sm">
            <a
              href="#"
              className="hover:text-white transition-colors"
              data-testid="privacy-link"
            >
              Privacy
            </a>
            <a
              href="#"
              className="hover:text-white transition-colors"
              data-testid="terms-link"
            >
              Terms
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/10 mt-6 pt-6">
          <p className="text-center text-white/30 font-body text-sm">
            © {currentYear} Local Lead Systems
          </p>
        </div>
      </div>
    </footer>
  );
}
