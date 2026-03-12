import { motion } from "framer-motion";
import { useState } from "react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.5 },
  }),
};

type EventCategory = "all" | "workshop" | "competition" | "talk" | "hackathon";

interface EventItem {
  title: string;
  date: string;
  desc: string;
  category: EventCategory;
}

const events: EventItem[] = [
  { title: "HackNirma 2025", date: "April 15, 2025", desc: "24-hour hackathon with prizes worth ₹1,00,000. Build innovative solutions.", category: "hackathon" },
  { title: "AI/ML Workshop", date: "April 22, 2025", desc: "Hands-on workshop on building machine learning models from scratch.", category: "workshop" },
  { title: "Tech Talk: Web3 & Blockchain", date: "May 5, 2025", desc: "Industry expert discusses the future of decentralized web.", category: "talk" },
  { title: "Competitive Programming Contest", date: "May 12, 2025", desc: "Test your algorithmic skills in this intense coding contest.", category: "competition" },
  { title: "Cloud Computing Bootcamp", date: "May 20, 2025", desc: "3-day bootcamp on AWS, GCP, and Azure fundamentals.", category: "workshop" },
  { title: "Cybersecurity CTF", date: "June 1, 2025", desc: "Capture The Flag competition for aspiring security professionals.", category: "competition" },
  { title: "Speaker Session: Open Source", date: "June 10, 2025", desc: "Learn how to contribute to open source and build your portfolio.", category: "talk" },
  { title: "Full Stack Web Dev Workshop", date: "June 18, 2025", desc: "Build a complete web application from frontend to backend.", category: "workshop" },
  { title: "CodeSprint 3.0", date: "July 5, 2025", desc: "Speed coding competition with real-world problem statements.", category: "hackathon" },
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

const Events = () => {
  const [activeFilter, setActiveFilter] = useState<EventCategory>("all");

  const filtered = activeFilter === "all" ? events : events.filter((e) => e.category === activeFilter);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="py-20 md:py-28 px-4 border-b-[3px] border-foreground">
        <div className="container mx-auto">
          <motion.div initial="hidden" animate="visible">
            <motion.div variants={fadeUp} custom={0} className="inline-block brutal-border bg-primary px-4 py-2 mb-6">
              <span className="font-heading font-extrabold text-primary-foreground text-sm uppercase tracking-widest">
                Events
              </span>
            </motion.div>
            <motion.h1 variants={fadeUp} custom={1} className="text-5xl md:text-7xl font-heading font-extrabold leading-[0.9] mb-6">
              Our <span className="text-primary">Events</span>
            </motion.h1>
            <motion.p variants={fadeUp} custom={2} className="text-xl font-body text-muted-foreground max-w-2xl">
              From hackathons to workshops, we've got something for every tech enthusiast.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Filters + Events */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-12">
            {filters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setActiveFilter(filter.value)}
                className={`brutal-border px-5 py-3 font-heading font-bold text-sm uppercase tracking-wide transition-all
                  hover:brutal-shadow-sm hover:-translate-y-0.5
                  ${activeFilter === filter.value ? "bg-foreground text-background brutal-shadow-sm" : "bg-background text-foreground"}`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {/* Grid */}
          <motion.div
            initial="hidden"
            animate="visible"
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filtered.map((event, i) => (
              <motion.div
                key={event.title}
                variants={fadeUp}
                custom={i}
                className="brutal-card hover:brutal-shadow-hover hover:-translate-y-1 transition-all flex flex-col"
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className={`brutal-border px-3 py-1 font-heading font-bold text-xs uppercase ${categoryColors[event.category]}`}>
                    {event.category}
                  </span>
                </div>
                <h3 className="text-xl font-heading font-extrabold mb-2">{event.title}</h3>
                <p className="font-heading font-semibold text-sm text-primary mb-2">{event.date}</p>
                <p className="font-body text-muted-foreground mb-6 flex-1">{event.desc}</p>
                <button className="brutal-btn-primary text-sm w-full">Register →</button>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Events;
