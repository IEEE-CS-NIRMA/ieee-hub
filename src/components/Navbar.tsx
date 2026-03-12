import { motion, useScroll, useTransform } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { useTheme } from "./ThemeProvider";
import { Sun, Moon, Menu, X } from "lucide-react";
import { useState, useRef } from "react";
import logoBlack from "@/assets/ieee-cs-logo-black.png";
import logoWhite from "@/assets/ieee-cs-logo-white.png";
import { staggerContainer, fadeIn } from "@/lib/animations";

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
  const navRef = useRef<HTMLElement>(null);
  const { scrollY } = useScroll();
  const navShadow = useTransform(scrollY, [0, 60], [0, 1]);

  const logo = theme === "dark" ? logoWhite : logoBlack;

  return (
    <motion.nav
      ref={navRef}
      className="sticky top-0 z-50 bg-background brutal-border border-t-0 border-x-0 border-b-[3px]"
      style={{ boxShadow: useTransform(navShadow, (v) => `0 4px ${Math.round(v * 24)}px rgba(0,0,0,${v * 0.08})`) }}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group shrink-0">
          <motion.img
            src={logo}
            alt="IEEE Computer Society"
            className="h-8 md:h-10 w-auto"
            whileHover={{ scale: 1.04 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          />
        </Link>

        {/* Desktop Nav */}
        <motion.div
          className="hidden lg:flex items-center gap-2"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {navLinks.map((link, i) => (
            <motion.div key={link.to} variants={fadeIn} custom={i}>
              <Link
                to={link.to}
                className={`brutal-border px-4 py-2 font-heading font-bold text-sm uppercase tracking-wide transition-all
                  hover:bg-foreground hover:text-background hover:brutal-shadow-sm
                  ${location.pathname === link.to ? "bg-foreground text-background" : "bg-background text-foreground"}`}
              >
                {link.label}
              </Link>
            </motion.div>
          ))}

          <motion.button
            variants={fadeIn}
            custom={navLinks.length}
            onClick={toggleTheme}
            className="brutal-border p-2 ml-2 bg-primary text-primary-foreground transition-all hover:brutal-shadow-sm"
            aria-label="Toggle theme"
            whileHover={{ scale: 1.1, rotate: 15 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
          </motion.button>
        </motion.div>

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

      {/* Mobile menu */}
      <motion.div
        initial={false}
        animate={mobileOpen ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="lg:hidden overflow-hidden"
      >
        <div className="border-t-[3px] border-foreground bg-background">
          {navLinks.map((link, i) => (
            <motion.div
              key={link.to}
              initial={{ x: -20, opacity: 0 }}
              animate={mobileOpen ? { x: 0, opacity: 1 } : { x: -20, opacity: 0 }}
              transition={{ delay: i * 0.05, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={`block px-6 py-4 font-heading font-bold text-sm uppercase tracking-wide border-b-[2px] border-foreground transition-all
                  hover:bg-foreground hover:text-background
                  ${location.pathname === link.to ? "bg-foreground text-background" : ""}`}
              >
                {link.label}
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.nav>
  );
};

export default Navbar;
