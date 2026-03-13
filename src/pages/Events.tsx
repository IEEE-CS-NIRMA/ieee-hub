import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  fadeUp,
  staggerContainer,
  lineReveal,
  badgePop,
  scaleIn,
} from "@/lib/animations";
import AnimatedText from "@/components/AnimatedText";

type EventCategory = "all" | "workshop" | "competition" | "talk" | "hackathon";

interface EventItem {
  title: string;
  date: string;
  desc: string;
  category: EventCategory;
}

const events: EventItem[] = [
  {
    title: "HackNirma 2025",
    date: "April 15, 2025",
    desc: "24-hour hackathon with prizes worth ₹1,00,000. Build innovative solutions.",
    category: "hackathon",
  },
  {
    title: "AI/ML Workshop",
    date: "April 22, 2025",
    desc: "Hands-on workshop on building machine learning models from scratch.",
    category: "workshop",
  },
  {
    title: "Tech Talk: Web3 & Blockchain",
    date: "May 5, 2025",
    desc: "Industry expert discusses the future of decentralized web.",
    category: "talk",
  },
  {
    title: "Competitive Programming Contest",
    date: "May 12, 2025",
    desc: "Test your algorithmic skills in this intense coding contest.",
    category: "competition",
  },
  {
    title: "Cloud Computing Bootcamp",
    date: "May 20, 2025",
    desc: "3-day bootcamp on AWS, GCP, and Azure fundamentals.",
    category: "workshop",
  },
  {
    title: "Cybersecurity CTF",
    date: "June 1, 2025",
    desc: "Capture The Flag competition for aspiring security professionals.",
    category: "competition",
  },
  {
    title: "Speaker Session: Open Source",
    date: "June 10, 2025",
    desc: "Learn how to contribute to open source and build your portfolio.",
    category: "talk",
  },
  {
    title: "Full Stack Web Dev Workshop",
    date: "June 18, 2025",
    desc: "Build a complete web application from frontend to backend.",
    category: "workshop",
  },
  {
    title: "CodeSprint 3.0",
    date: "July 5, 2025",
    desc: "Speed coding competition with real-world problem statements.",
    category: "hackathon",
  },
];

const filters: { label: string; value: EventCategory }[] = [
  { label: "All Events", value: "all" },
  { label: "Workshops", value: "workshop" },
  { label: "Competitions", value: "competition" },
  { label: "Talks", value: "talk" },
  { label: "Hackathons", value: "hackathon" },
];

const categoryColors: Record<string, string> = {
  workshop: "bg-secondary text-secondary-foreground",
  competition: "bg-primary text-primary-foreground",
  talk: "bg-foreground text-background",
  hackathon: "bg-primary text-primary-foreground",
};

const eventCardVariants = {
  hidden: { opacity: 0, scale: 0.94, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      delay: i * 0.06,
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};

const eventMetaVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.06 + 0.12,
      duration: 0.35,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};

const Events = () => {
  const [activeFilter, setActiveFilter] = useState<EventCategory>("all");
  const filtered =
    activeFilter === "all"
      ? events
      : events.filter((e) => e.category === activeFilter);

  return (
    <div className="min-h-screen">
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="py-20 md:py-28 px-4 border-b-[3px] border-foreground overflow-hidden">
        <div className="container mx-auto">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.div
              variants={badgePop}
              custom={0}
              className="inline-block brutal-border bg-primary px-4 py-2 mb-6"
            >
              <span className="font-heading font-extrabold text-primary-foreground text-sm uppercase tracking-widest">
                Events
              </span>
            </motion.div>

            <div className="overflow-hidden">
              <AnimatedText
                text="Our Events"
                el="h1"
                className="text-5xl md:text-7xl font-heading font-extrabold leading-[0.9] mb-4"
                delay={0.1}
              />
            </div>

            <motion.div
              className="line-accent w-20 mb-6 mt-2"
              variants={lineReveal}
              custom={0}
            />

            <motion.p
              variants={fadeUp}
              custom={2}
              className="text-xl font-body text-muted-foreground max-w-2xl"
            >
              From hackathons to workshops, we've got something for every tech
              enthusiast.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ── Filters + Grid ───────────────────────────────────── */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          {/* Filters */}
          <motion.div
            className="flex flex-wrap gap-3 mb-12"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            {filters.map((filter, i) => (
              <motion.button
                key={filter.value}
                variants={fadeUp}
                custom={i}
                onClick={() => setActiveFilter(filter.value)}
                className={`brutal-border px-5 py-3 font-heading font-bold text-sm uppercase tracking-wide transition-all
                  hover:brutal-shadow-sm hover:-translate-y-0.5
                  ${activeFilter === filter.value ? "bg-foreground text-background brutal-shadow-sm" : "bg-background text-foreground"}`}
                whileTap={{ scale: 0.96 }}
              >
                {filter.label}
              </motion.button>
            ))}
          </motion.div>

          {/* Grid with AnimatePresence for filter transitions */}
          <motion.div
            layout
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filtered.map((event, i) => (
                <motion.div
                  key={event.title}
                  layout
                  custom={i}
                  variants={eventCardVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: false, amount: 0.2 }}
                  exit={{ opacity: 0, scale: 0.85, y: -10 }}
                  className="brutal-card flex flex-col"
                  whileHover={{
                    y: -6,
                    boxShadow: "var(--shadow-brutal-hover)",
                    transition: { type: "spring", stiffness: 150 },
                  }}
                >
                  <motion.div
                    className="flex items-center gap-3 mb-4"
                    custom={i}
                    variants={eventMetaVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: false, amount: 0.3 }}
                  >
                    <span
                      className={`brutal-border px-3 py-1 font-heading font-bold text-xs uppercase ${categoryColors[event.category]}`}
                    >
                      {event.category}
                    </span>
                  </motion.div>
                  <h3 className="text-xl font-heading font-extrabold mb-2">
                    {event.title}
                  </h3>
                  <p className="font-heading font-semibold text-sm text-primary mb-2">
                    {event.date}
                  </p>
                  <p className="font-body text-muted-foreground mb-6 flex-1">
                    {event.desc}
                  </p>
                  <motion.button
                    className="brutal-btn-primary text-sm w-full"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Register →
                  </motion.button>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Events;
