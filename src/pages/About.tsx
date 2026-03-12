import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5 },
  }),
};

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
      "Since our establishment, we've trained 500+ students, hosted 50+ events, collaborated with leading tech companies, and helped members secure positions at top organizations worldwide.",
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
      {/* Hero */}
      <section className="py-20 md:py-28 px-4 border-b-[3px] border-foreground">
        <div className="container mx-auto">
          <motion.div initial="hidden" animate="visible">
            <motion.div variants={fadeUp} custom={0} className="inline-block brutal-border bg-secondary px-4 py-2 mb-6">
              <span className="font-heading font-extrabold text-secondary-foreground text-sm uppercase tracking-widest">
                About Us
              </span>
            </motion.div>
            <motion.h1 variants={fadeUp} custom={1} className="text-5xl md:text-7xl font-heading font-extrabold leading-[0.9] mb-6">
              Who <span className="text-primary">We Are</span>
            </motion.h1>
            <motion.p variants={fadeUp} custom={2} className="text-xl font-body text-muted-foreground max-w-2xl">
              The IEEE Computer Society Student Chapter at Nirma University is a vibrant community 
              of tech enthusiasts, developers, researchers, and innovators working together to make 
              a difference in the world of technology.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Sections */}
      <section className="py-20 px-4">
        <div className="container mx-auto space-y-8">
          {sections.map((section, i) => (
            <motion.div
              key={section.title}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={0}
              className={`brutal-border brutal-shadow p-8 md:p-12 ${i % 2 === 0 ? "" : "md:ml-auto md:max-w-3xl"} hover:brutal-shadow-hover hover:-translate-y-1 transition-all`}
            >
              <div className={`inline-block brutal-border ${section.accent} px-4 py-2 mb-4`}>
                <span className="font-heading font-extrabold text-sm uppercase tracking-widest">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-heading font-extrabold mb-4">{section.title}</h2>
              <p className="font-body text-lg text-muted-foreground">{section.content}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section data-cursor-invert className="py-20 px-4 bg-foreground text-background border-t-[3px] border-foreground">
        <div className="container mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <motion.h2 variants={fadeUp} custom={0} className="text-4xl md:text-5xl font-heading font-extrabold mb-12">
              Our <span className="text-primary">Values</span>
            </motion.h2>
            <div className="grid md:grid-cols-4 gap-4">
              {["Innovation", "Collaboration", "Excellence", "Integrity"].map((value, i) => (
                <motion.div
                  key={value}
                  variants={fadeUp}
                  custom={i + 1}
                  className="border-[3px] border-background p-6 text-center hover:bg-primary hover:text-primary-foreground transition-all"
                >
                  <h3 className="text-2xl font-heading font-extrabold uppercase">{value}</h3>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;
