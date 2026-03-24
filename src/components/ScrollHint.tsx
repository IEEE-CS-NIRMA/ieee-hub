import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const SCROLL_HIDE_THRESHOLD = 24;

const ScrollHint = () => {
  const { pathname } = useLocation();
  const [isVisible, setIsVisible] = useState(pathname === "/");

  useEffect(() => {
    if (pathname !== "/") {
      setIsVisible(false);
      return;
    }

    const handleScroll = () => {
      setIsVisible(window.scrollY < SCROLL_HIDE_THRESHOLD);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [pathname]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.28, ease: "easeOut" }}
          className="pointer-events-none fixed bottom-6 left-1/2 z-[70] -translate-x-1/2"
          aria-hidden="true"
        >
          <div className="h-14 w-8 rounded-full border-[3px] border-white/95 bg-[#081226]/65 p-1">
            <motion.div
              className="mx-auto h-3.5 w-3.5 rounded-full bg-white/45"
              animate={{
                y: [0, 28, 28, 0, 0],
                opacity: [0.45, 1, 0, 0, 0.45],
              }}
              transition={{
                duration: 2.4,
                repeat: Number.POSITIVE_INFINITY,
                times: [0, 0.55, 0.72, 0.9, 1],
                ease: ["easeOut", "linear", "linear", "easeIn"],
              }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ScrollHint;
