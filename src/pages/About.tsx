import { motion } from "framer-motion";
import {
  fadeUp,
  slideLeft,
  slideRight,
  scaleIn,
  staggerContainer,
  lineReveal,
  badgePop,
} from "@/lib/animations";
import AnimatedText from "@/components/AnimatedText";

const sections = [
  {
    title: "Our Mission",
    content:
      "To foster a community of passionate technologists at Nirma University who push the boundaries of computing and engineering. We aim to bridge the gap between academia and industry through hands-on experiences.",
    accent: "bg-primary",
  },
  {
    title: "What We Do",
    content:
      "We organize hackathons, workshops, speaker sessions, coding competitions, and technical seminars. Our events cover diverse domains including AI/ML, Web Development, Cybersecurity, Cloud Computing, and more.",
    accent: "bg-secondary",
  },
  {
    title: "Our Impact",
    content:
      "Since our establishment, we've trained 500+ students, hosted 1+ events, collaborated with leading tech companies, and helped members secure positions at top organizations worldwide.",
    accent: "bg-foreground text-background",
  },
  {
    title: "Community & Research",
    content:
      "As part of the global IEEE network, our members get access to the IEEE Digital Library, research publications, and a worldwide community of 400,000+ professionals and students.",
    accent: "bg-primary",
  },
];

const About = () => {
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
              className="inline-block brutal-border bg-secondary px-4 py-2 mb-6"
            >
              <span className="font-heading font-extrabold text-secondary-foreground text-sm uppercase tracking-widest">
                About Us
              </span>
            </motion.div>

            <div className="overflow-hidden">
              <AnimatedText
                text="Who We Are"
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
              The IEEE Computer Society Student Chapter at Nirma University is a
              vibrant community of tech enthusiasts, developers, researchers,
              and innovators working together to make a difference in the world
              of technology.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ── Sections ─────────────────────────────────────────── */}
      <section className="py-20 px-4">
        <div className="container mx-auto space-y-8">
          {sections.map((section, i) => (
            <motion.div
              key={section.title}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.2 }}
              variants={i % 2 === 0 ? slideLeft : slideRight}
              custom={0}
              className={`brutal-border brutal-shadow p-8 md:p-12 ${i % 2 === 1 ? "md:ml-auto md:max-w-3xl" : ""}`}
              whileHover={{
                y: -5,
                boxShadow: "var(--shadow-brutal-hover)",
                transition: { type: "spring", stiffness: 120 },
              }}
            >
              <div className="flex items-start gap-6">
                <div className="hidden md:block shrink-0">
                  <motion.div
                    className={`inline-flex items-center justify-center w-14 h-14 brutal-border ${section.accent} font-heading font-extrabold text-lg`}
                    initial={{ scale: 0.5, opacity: 0, rotate: -15 }}
                    whileInView={{ scale: 1, opacity: 1, rotate: 0 }}
                    viewport={{ once: false }}
                    transition={{
                      delay: 0.2,
                      type: "spring",
                      stiffness: 200,
                      damping: 15,
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </motion.div>
                </div>
                <div className="flex-1">
                  <div
                    className={`inline-block brutal-border md:hidden ${section.accent} px-4 py-2 mb-4`}
                  >
                    <span className="font-heading font-extrabold text-sm uppercase tracking-widest">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-heading font-extrabold mb-4">
                    {section.title}
                  </h2>
                  <motion.div
                    className="line-accent w-12 mb-4"
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: false }}
                    transition={{
                      delay: 0.3,
                      duration: 0.6,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  />
                  <p className="font-body text-lg text-muted-foreground">
                    {section.content}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Values ───────────────────────────────────────────── */}
      <section
        data-cursor-invert
        className="py-24 px-4 bg-foreground text-background border-t-[3px] border-foreground"
      >
        <div className="container mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.2 }}
          >
            <motion.div
              variants={badgePop}
              custom={0}
              className="inline-block border-[3px] border-background px-4 py-2 mb-4"
            >
              <span className="font-heading font-bold text-xs uppercase tracking-widest">
                Principles
              </span>
            </motion.div>
            <motion.h2
              variants={fadeUp}
              custom={0}
              className="text-4xl md:text-5xl font-heading font-extrabold mb-3"
            >
              Our <span className="text-primary">Values</span>
            </motion.h2>
            <motion.div
              className="h-[3px] bg-primary origin-left w-16 mb-12"
              variants={lineReveal}
              custom={0}
            />

            <motion.div
              variants={staggerContainer}
              className="grid md:grid-cols-4 gap-4"
            >
              {["Innovation", "Collaboration", "Excellence", "Integrity"].map(
                (value, i) => (
                  <motion.div
                    key={value}
                    variants={scaleIn}
                    custom={i + 1}
                    className="border-[3px] border-background p-6 text-center"
                    whileHover={{
                      backgroundColor: "hsl(var(--primary))",
                      color: "hsl(var(--primary-foreground))",
                      borderColor: "hsl(var(--primary))",
                      y: -6,
                      transition: { duration: 0.22 },
                    }}
                  >
                    <span className="font-heading font-extrabold text-xs uppercase tracking-widest opacity-40 block mb-2">
                      0{i + 1}
                    </span>
                    <h3 className="text-2xl font-heading font-extrabold uppercase">
                      {value}
                    </h3>
                  </motion.div>
                ),
              )}
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;
