import { Link } from "react-router-dom";
import { Linkedin, Github, Instagram } from "lucide-react";
import { SiDiscord } from "react-icons/si";
import logoWhite from "@/assets/IEEE_CS_Nirma_logo_full_white.svg";

const socialLinks = [
  { label: "LinkedIn", icon: Linkedin, href: "#" },
  {
    label: "Instagram",
    icon: Instagram,
    href: "https://www.instagram.com/ieee.cs.sbnu?igsh=MW5rOXJ0cmFhYjhocg==",
  },
  { label: "Discord", icon: SiDiscord, href: "#" },
  { label: "GitHub", icon: Github, href: "#" },
];

const Footer = () => {
  return (
    <footer className="bg-foreground text-background brutal-border border-b-0 border-x-0 border-t-[4px]">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <img
              src={logoWhite}
              alt="IEEE Computer Society"
              className="h-10 w-auto mb-4"
            />
            <p className="font-body text-sm opacity-80 mt-2">
              IEEE Computer Society Student Chapter
              <br />
              Nirma University, Ahmedabad
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading font-extrabold text-lg mb-4 uppercase">
              Quick Links
            </h3>
            <div className="flex flex-col gap-2">
              {[
                { to: "/", label: "Home" },
                { to: "/about", label: "About Us" },
                { to: "/events", label: "Events" },
                { to: "/board", label: "Board Members" },
                { to: "/contact", label: "Contact" },
              ].map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="font-body text-sm hover:text-primary transition-colors uppercase tracking-wide"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-heading font-extrabold text-lg mb-4 uppercase">
              Connect
            </h3>
            <div className="flex gap-3 flex-wrap">
              {socialLinks.map((platform) => (
                <a
                  key={platform.label}
                  href={platform.href}
                  target={
                    platform.href.startsWith("http") ? "_blank" : undefined
                  }
                  rel={
                    platform.href.startsWith("http") ? "noreferrer" : undefined
                  }
                  className="border-[3px] border-background px-3 py-2 font-heading font-bold text-xs uppercase inline-flex items-center gap-2
                    hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all"
                >
                  <platform.icon size={14} />
                  {platform.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t-[3px] border-background mt-8 pt-6 text-center">
          <p className="font-body text-sm opacity-70">
            © {new Date().getFullYear()} IEEE Computer Society Nirma University.
            All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
