import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  fadeUp,
  staggerContainer,
  lineReveal,
  badgePop,
} from "@/lib/animations";
import AnimatedText from "@/components/AnimatedText";
import {
  eventFilters,
  fallbackEvents,
  fetchPublishedEvents,
  type EventCategory,
  type EventFilter,
} from "@/lib/content/events";

const categoryColors: Record<EventCategory, string> = {
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
  const [activeFilter, setActiveFilter] = useState<EventFilter>("all");
  const { data, isLoading } = useQuery({
    queryKey: ["events"],
    queryFn: fetchPublishedEvents,
    placeholderData: {
      items: fallbackEvents,
      source: "fallback" as const,
    },
  });

  const events = data?.items ?? fallbackEvents;
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
          {!isLoading && data?.source === "fallback" && (
            <div className="brutal-border bg-secondary text-secondary-foreground px-4 py-3 mb-8 font-heading font-bold text-xs uppercase tracking-wide inline-flex">
              Demo data active. Connect Supabase to manage events dynamically.
            </div>
          )}

          {/* Filters */}
          <motion.div
            className="flex flex-wrap gap-3 mb-12"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            {eventFilters.map((filter, i) => (
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
            {isLoading && filtered.length === 0 && (
              <div className="md:col-span-2 lg:col-span-3 font-heading font-bold uppercase tracking-wide text-sm text-muted-foreground">
                Loading events...
              </div>
            )}

            {!isLoading && filtered.length === 0 && (
              <div className="md:col-span-2 lg:col-span-3 brutal-border p-6 font-body text-muted-foreground">
                No events found for this category yet.
              </div>
            )}

            <AnimatePresence mode="popLayout">
              {filtered.map((event, i) => (
                <motion.div
                  key={event.id}
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
                  {event.registrationLink ? (
                    <motion.a
                      href={event.registrationLink}
                      target="_blank"
                      rel="noreferrer"
                      className="brutal-btn-primary text-sm w-full text-center"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Register →
                    </motion.a>
                  ) : (
                    <motion.button
                      type="button"
                      disabled
                      className="brutal-border bg-background text-muted-foreground cursor-not-allowed px-6 py-4 font-heading font-bold uppercase tracking-wide text-sm w-full"
                    >
                      Registration Soon
                    </motion.button>
                  )}
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
