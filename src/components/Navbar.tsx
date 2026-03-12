import { Link, useLocation } from "react-router-dom";
import { useTheme } from "./ThemeProvider";
import { Sun, Moon, Menu, X } from "lucide-react";
import { useState } from "react";
import logoBlack from "@/assets/ieee-cs-logo-black.png";
import logoWhite from "@/assets/ieee-cs-logo-white.png";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/events", label: "Events" },
  { to: "/board", label: "Board Members" },
  { to: "/contact", label: "Contact" },
];

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const logo = theme === "dark" ? logoWhite : logoBlack;

  return (
    <nav className="sticky top-0 z-50 bg-background brutal-border border-t-0 border-x-0 border-b-[3px]">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group shrink-0">
          <img src={logo} alt="IEEE Computer Society" className="h-8 md:h-10 w-auto" />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-2">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`brutal-border px-4 py-2 font-heading font-bold text-sm uppercase tracking-wide transition-all
                hover:bg-foreground hover:text-background hover:brutal-shadow-sm
                ${location.pathname === link.to ? "bg-foreground text-background" : "bg-background text-foreground"}`}
            >
              {link.label}
            </Link>
          ))}

          <button
            onClick={toggleTheme}
            className="brutal-border p-2 ml-2 bg-primary text-primary-foreground transition-all hover:brutal-shadow-sm hover:scale-105"
            aria-label="Toggle theme"
          >
            {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
          </button>
        </div>

        {/* Mobile controls */}
        <div className="flex lg:hidden items-center gap-2">
          <button
            onClick={toggleTheme}
            className="brutal-border p-2 bg-primary text-primary-foreground"
            aria-label="Toggle theme"
          >
            {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
          </button>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="brutal-border p-2 bg-background text-foreground"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden border-t-[3px] border-foreground bg-background">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMobileOpen(false)}
              className={`block px-6 py-4 font-heading font-bold text-sm uppercase tracking-wide border-b-[2px] border-foreground transition-all
                hover:bg-foreground hover:text-background
                ${location.pathname === link.to ? "bg-foreground text-background" : ""}`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
