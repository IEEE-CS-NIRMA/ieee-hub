import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Users, Calendar, BookOpen, Trophy } from "lucide-react";
import AnimatedText from "@/components/AnimatedText";
import {
  fadeUp, fadeIn, scaleIn, slideLeft, slideRight,
  staggerContainer, lineReveal, counterVariant, badgePop, cardHover,
} from "@/lib/animations";
import { useRef } from "react";

const stats = [
  { icon: Users, label: "Members", value: "200+" },
  { icon: Calendar, label: "Events Hosted", value: "50+" },
  { icon: BookOpen, label: "Workshops", value: "30+" },
  { icon: Trophy, label: "Competitions Won", value: "15+" },
];

const whyJoin = [
  {
    title: "Networking",
    desc: "Connect with industry leaders, researchers, and fellow tech enthusiasts across the globe.",
    color: "bg-primary",
  },
  {
    title: "Research Opportunities",
    desc: "Access IEEE's vast digital library and publish your research in renowned journals.",
    color: "bg-secondary",
  },
  {
    title: "Technical Growth",
    desc: "Attend workshops, hackathons, and speaker sessions to level up your skills.",
    color: "bg-foreground text-background",
  },
];

const upcomingEvents = [
  { title: "HackNirma 2025", date: "April 15, 2025", desc: "24-hour hackathon with prizes worth ₹1,00,000" },
  { title: "AI Workshop Series", date: "April 22, 2025", desc: "Hands-on workshop on building AI applications" },
  { title: "Tech Talk: Web3", date: "May 5, 2025", desc: "Industry expert talks on the future of decentralized web" },
];

const Index = () => {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress: heroProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const shapeY1 = useTransform(heroProgress, [0, 1], [0, -80]);
  const shapeY2 = useTransform(heroProgress, [0, 1], [0, 60]);
  const shapeY3 = useTransform(heroProgress, [0, 1], [0, -40]);

  return (
    <div className="min-h-screen">
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section ref={heroRef} className="relative overflow-hidden py-24 md:py-36 px-4">
        {/* Parallax background shapes */}
        <motion.div
          className="absolute top-10 right-10 w-32 h-32 bg-primary brutal-border brutal-shadow rotate-12 opacity-20"
          style={{ y: shapeY1 }}
        />
        <motion.div
          className="absolute bottom-20 left-10 w-24 h-24 bg-secondary brutal-border brutal-shadow -rotate-6 opacity-20"
          style={{ y: shapeY2 }}
        />
        <motion.div
          className="absolute top-1/2 right-1/3 w-16 h-16 bg-foreground opacity-10 rotate-45"
          style={{ y: shapeY3 }}
        />

        <div className="container mx-auto relative z-10">
          {/* Badge */}
          <motion.div
            variants={badgePop}
            custom={0}
            initial="hidden"
            animate="visible"
            className="inline-block brutal-border bg-primary px-4 py-2 mb-6"
          >
            <span className="font-heading font-extrabold text-primary-foreground text-sm uppercase tracking-widest">
              Student Chapter
            </span>
          </motion.div>

          {/* Word-by-word headline */}
          <div className="max-w-4xl mb-6 overflow-hidden" style={{ perspective: 800 }}>
            <AnimatedText
              text="IEEE Computer Society —"
              el="h1"
              className="text-5xl md:text-7xl lg:text-8xl font-heading font-extrabold leading-[0.95]"
              delay={0.15}
            />
            <motion.span
              className="block text-5xl md:text-7xl lg:text-8xl font-heading font-extrabold leading-[0.95] text-primary overflow-hidden"
              initial={{ clipPath: "inset(0% 100% 0% 0%)" }}
              animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
              transition={{ delay: 0.65, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            >
              Nirma University
            </motion.span>
          </div>

          {/* Animated accent line */}
          <motion.div
            className="line-accent w-24 mb-8"
            variants={lineReveal}
            initial="hidden"
            animate="visible"
            custom={0}
            transition={{ delay: 0.9 }}
          />

          <motion.p
            variants={fadeUp}
            custom={0}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.75 }}
            className="text-xl md:text-2xl font-body max-w-xl mb-10 text-muted-foreground"
          >
            Empowering innovation, technology, and future engineers.
          </motion.p>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="flex flex-wrap gap-4"
            style={{ originX: 0 }}
          >
            <motion.div variants={fadeUp} custom={1}>
              <Link to="/events" className="brutal-btn-primary flex items-center gap-2">
                Explore Events <ArrowRight size={18} />
              </Link>
            </motion.div>
            <motion.div variants={fadeUp} custom={2}>
              <a href="#" className="brutal-btn-secondary">Join IEEE</a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── About IEEE CS ─────────────────────────────────────── */}
      <section className="py-24 px-4 border-t-[3px] border-foreground overflow-hidden">
        <div className="container mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="grid md:grid-cols-2 gap-16 items-center"
          >
            <motion.div variants={slideLeft} custom={0}>
              <motion.div variants={badgePop} custom={0} className="inline-block brutal-border bg-secondary px-4 py-2 mb-6">
                <span className="font-heading font-bold text-secondary-foreground text-xs uppercase tracking-widest">About Us</span>
              </motion.div>
              <h2 className="text-4xl md:text-5xl font-heading font-extrabold mb-4">
                About <span className="text-primary">IEEE CS</span>
              </h2>
              <motion.div className="line-accent w-16 mb-6" variants={lineReveal} custom={0} />
              <p className="font-body text-lg text-muted-foreground mb-4">
                The IEEE Computer Society is the world's leading organization of computing professionals,
                driving technology innovation and excellence for the benefit of humanity.
              </p>
              <p className="font-body text-lg text-muted-foreground mb-8">
                Our student chapter at Nirma University brings together passionate tech enthusiasts
                to learn, innovate, and grow together.
              </p>
              <Link to="/about" className="brutal-btn-outline inline-flex items-center gap-2">
                Learn More <ArrowRight size={18} />
              </Link>
            </motion.div>

            <motion.div variants={slideRight} custom={0} className="grid grid-cols-2 gap-4">
              {[
                { label: "Est.", value: "2015", color: "bg-primary text-primary-foreground" },
                { label: "Active Members", value: "200+", color: "bg-secondary text-secondary-foreground" },
              ].map((item, i) => (
                <motion.div
                  key={item.value}
                  variants={scaleIn}
                  custom={i + 1}
                  className={`brutal-card ${item.color}`}
                  whileHover={{ y: -4, transition: { type: "spring", stiffness: 300 } }}
                >
                  <h3 className="text-2xl font-extrabold">{item.label}</h3>
                  <p className="text-4xl font-extrabold">{item.value}</p>
                </motion.div>
              ))}
              <motion.div
                variants={scaleIn}
                custom={3}
                className="brutal-card col-span-2"
                whileHover={{ y: -4, transition: { type: "spring", stiffness: 300 } }}
              >
                <p className="font-body text-lg font-semibold">
                  "Technology is best when it brings people together."
                </p>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Upcoming Events ───────────────────────────────────── */}
      <section className="py-24 px-4 bg-muted border-t-[3px] border-foreground">
        <div className="container mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
          >
            <motion.div variants={badgePop} custom={0} className="inline-block brutal-border bg-primary px-4 py-2 mb-4">
              <span className="font-heading font-bold text-primary-foreground text-xs uppercase tracking-widest">Upcoming</span>
            </motion.div>
            <motion.h2 variants={fadeUp} custom={0} className="text-4xl md:text-5xl font-heading font-extrabold mb-3">
              Upcoming <span className="text-primary">Events</span>
            </motion.h2>
            <motion.div className="line-accent w-16 mb-12" variants={lineReveal} custom={0} />

            <motion.div
              variants={staggerContainer}
              className="grid md:grid-cols-3 gap-6"
            >
              {upcomingEvents.map((event, i) => (
                <motion.div
                  key={event.title}
                  variants={fadeUp}
                  custom={i + 1}
                  className="brutal-card flex flex-col"
                  whileHover={{ y: -6, boxShadow: "var(--shadow-brutal-hover)", transition: { type: "spring", stiffness: 150 } }}
                >
                  <div className="inline-block brutal-border bg-primary px-3 py-1 mb-4 self-start">
                    <span className="font-heading font-bold text-primary-foreground text-xs uppercase">{event.date}</span>
                  </div>
                  <h3 className="text-xl font-heading font-extrabold mb-2">{event.title}</h3>
                  <p className="font-body text-muted-foreground mb-6 flex-1">{event.desc}</p>
                  <button className="brutal-btn-outline text-sm">Register →</button>
                </motion.div>
              ))}
            </motion.div>

            <motion.div variants={fadeUp} custom={4} className="mt-10 text-center">
              <Link to="/events" className="brutal-btn-primary inline-flex items-center gap-2">
                View All Events <ArrowRight size={18} />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Why Join ──────────────────────────────────────────── */}
      <section className="py-24 px-4 border-t-[3px] border-foreground">
        <div className="container mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
          >
            <motion.div variants={badgePop} custom={0} className="inline-block brutal-border bg-secondary px-4 py-2 mb-4">
              <span className="font-heading font-bold text-secondary-foreground text-xs uppercase tracking-widest">Reasons</span>
            </motion.div>
            <motion.h2 variants={fadeUp} custom={0} className="text-4xl md:text-5xl font-heading font-extrabold mb-3">
              Why Join <span className="text-primary">IEEE?</span>
            </motion.h2>
            <motion.div className="line-accent w-16 mb-12" variants={lineReveal} custom={0} />

            <motion.div variants={staggerContainer} className="grid md:grid-cols-3 gap-6">
              {whyJoin.map((item, i) => (
                <motion.div
                  key={item.title}
                  variants={fadeUp}
                  custom={i + 1}
                  className={`brutal-border brutal-shadow p-8 ${item.color}`}
                  whileHover={{ y: -6, boxShadow: "var(--shadow-brutal-hover)", transition: { type: "spring", stiffness: 150 } }}
                >
                  <span className="font-heading font-extrabold text-xs uppercase tracking-widest opacity-50 mb-3 block">
                    0{i + 1}
                  </span>
                  <h3 className="text-2xl font-heading font-extrabold mb-4 uppercase">{item.title}</h3>
                  <p className="font-body text-base">{item.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Stats ─────────────────────────────────────────────── */}
      <section data-cursor-invert className="py-24 px-4 bg-foreground text-background border-t-[3px] border-foreground">
        <div className="container mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <motion.div variants={badgePop} custom={0} className="inline-block border-[3px] border-background px-4 py-2 mb-4">
              <span className="font-heading font-bold text-xs uppercase tracking-widest">By the Numbers</span>
            </motion.div>
            <motion.h2 variants={fadeUp} custom={0} className="text-4xl md:text-5xl font-heading font-extrabold mb-12">
              Our <span className="text-primary">Impact</span>
            </motion.h2>

            <motion.div
              variants={staggerContainer}
              className="grid grid-cols-2 md:grid-cols-4 gap-6"
            >
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  variants={counterVariant}
                  custom={i}
                  className="text-center border-[3px] border-background p-6"
                  whileHover={{ backgroundColor: "hsl(var(--primary))", color: "hsl(var(--primary-foreground))", borderColor: "hsl(var(--primary))", transition: { duration: 0.25 } }}
                >
                  <stat.icon size={32} className="mx-auto mb-3" />
                  <p className="stat-value text-4xl md:text-5xl">{stat.value}</p>
                  <p className="font-body text-sm uppercase tracking-wide mt-2 opacity-70">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Index;
