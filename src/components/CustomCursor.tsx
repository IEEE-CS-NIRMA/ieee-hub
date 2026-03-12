import { useEffect, useState } from "react";
import { useTheme } from "./ThemeProvider";

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isInFooter, setIsInFooter] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    const move = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);

      // Check if cursor is inside the footer or any inverted section
      const el = document.elementFromPoint(e.clientX, e.clientY);
      setIsInFooter(!!el?.closest("footer, [data-cursor-invert]"));
    };

    const handleOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("button, a, [role='button'], .brutal-btn, input, textarea, select")) {
        setIsHovering(true);
      }
    };

    const handleOut = () => setIsHovering(false);
    const handleLeave = () => setIsVisible(false);
    const handleEnter = () => setIsVisible(true);

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", handleOver);
    window.addEventListener("mouseout", handleOut);
    document.addEventListener("mouseleave", handleLeave);
    document.addEventListener("mouseenter", handleEnter);

    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", handleOver);
      window.removeEventListener("mouseout", handleOut);
      document.removeEventListener("mouseleave", handleLeave);
      document.removeEventListener("mouseenter", handleEnter);
    };
  }, [isVisible]);

  // Footer is bg-foreground (dark in light mode, light in dark mode),
  // so inside the footer the cursor should be the inverse of the page cursor.
  const baseColor = theme === "dark" ? "255,255,255" : "0,0,0";
  const footerColor = theme === "dark" ? "0,0,0" : "255,255,255";
  const color = isInFooter ? footerColor : baseColor;

  const size = isHovering ? 48 : 32;

  // Hide on touch devices
  if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
    return null;
  }

  return (
    <>
      {/* Outer ring */}
      <div
        className="fixed pointer-events-none z-[9999] rounded-full transition-[width,height,opacity,border-color,background-color] duration-150 ease-out"
        style={{
          width: size,
          height: size,
          left: position.x - size / 2,
          top: position.y - size / 2,
          border: `2px solid rgba(${color}, ${isHovering ? 0.5 : 0.7})`,
          opacity: isVisible ? 1 : 0,
          mixBlendMode: isHovering ? "difference" : "normal",
        }}
      />
      {/* Inner dot */}
      <div
        className="fixed pointer-events-none z-[9999] rounded-full transition-[width,height,opacity,background-color] duration-100 ease-out"
        style={{
          width: isHovering ? 8 : 6,
          height: isHovering ? 8 : 6,
          left: position.x - (isHovering ? 4 : 3),
          top: position.y - (isHovering ? 4 : 3),
          backgroundColor: `rgba(${color}, 0.9)`,
          opacity: isVisible ? 1 : 0,
        }}
      />
    </>
  );
};

export default CustomCursor;
