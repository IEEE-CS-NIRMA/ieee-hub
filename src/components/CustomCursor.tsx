import { useEffect, useState } from "react";
import { useTheme } from "./ThemeProvider";

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    const move = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
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

  const color = theme === "dark" ? "255,255,255" : "0,0,0";
  const size = isHovering ? 48 : 32;

  // Hide on touch devices
  if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
    return null;
  }

  return (
    <>
      {/* Outer ring */}
      <div
        className="fixed pointer-events-none z-[9999] rounded-full transition-[width,height,opacity] duration-200 ease-out"
        style={{
          width: size,
          height: size,
          left: position.x - size / 2,
          top: position.y - size / 2,
          border: `2px solid rgba(${color}, ${isHovering ? 0.4 : 0.6})`,
          opacity: isVisible ? 1 : 0,
          mixBlendMode: isHovering ? "difference" : "normal",
        }}
      />
      {/* Inner dot */}
      <div
        className="fixed pointer-events-none z-[9999] rounded-full transition-[width,height,opacity] duration-100 ease-out"
        style={{
          width: isHovering ? 8 : 6,
          height: isHovering ? 8 : 6,
          left: position.x - (isHovering ? 4 : 3),
          top: position.y - (isHovering ? 4 : 3),
          backgroundColor: `rgba(${color}, 0.8)`,
          opacity: isVisible ? 1 : 0,
        }}
      />
    </>
  );
};

export default CustomCursor;
