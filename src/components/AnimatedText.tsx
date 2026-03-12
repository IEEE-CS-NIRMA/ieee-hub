import { motion } from "framer-motion";
import { wordContainer, wordItem } from "@/lib/animations";

interface AnimatedTextProps {
  text: string;
  className?: string;
  el?: "h1" | "h2" | "h3" | "p" | "span";
  delay?: number;
}

/**
 * Splits text into words and animates each word in with a 3-D flip-up effect.
 */
const AnimatedText = ({ text, className = "", el = "h1", delay = 0 }: AnimatedTextProps) => {
  const words = text.split(" ");
  const Tag = motion[el];

  return (
    <Tag
      className={`${className} overflow-hidden`}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.06, delayChildren: delay } },
      }}
      initial="hidden"
      animate="visible"
      style={{ perspective: 600 }}
    >
      {words.map((word, i) => (
        <motion.span
          key={i}
          variants={wordItem}
          className="inline-block mr-[0.25em] last:mr-0"
          style={{ transformOrigin: "bottom center" }}
        >
          {word}
        </motion.span>
      ))}
    </Tag>
  );
};

export default AnimatedText;
