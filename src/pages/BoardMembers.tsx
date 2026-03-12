import { motion } from "framer-motion";
import { Linkedin } from "lucide-react";
import { fadeUp, staggerContainer, lineReveal, badgePop, scaleIn } from "@/lib/animations";
import AnimatedText from "@/components/AnimatedText";

const members = [
  {
    name: "Arjun Patel",
    position: "Chairperson",
    bio: "Final year CSE student passionate about AI and community building.",
    color: "bg-primary text-primary-foreground",
  },
  {
    name: "Priya Sharma",
    position: "Vice Chair",
    bio: "Leading initiatives in cloud computing and open source advocacy.",
    color: "bg-secondary text-secondary-foreground",
  },
  {
    name: "Rahul Mehta",
    position: "Technical Lead",
    bio: "Full-stack developer and competitive programmer with 1500+ on Codeforces.",
    color: "bg-foreground text-background",
  },
  {
    name: "Ananya Desai",
    position: "Design Lead",
    bio: "UI/UX enthusiast crafting beautiful and accessible digital experiences.",
    color: "bg-primary text-primary-foreground",
  },
  {
    name: "Karan Singh",
    position: "Event Lead",
    bio: "Organized 20+ tech events and hackathons with 1000+ participants.",
    color: "bg-secondary text-secondary-foreground",
  },
  {
    name: "Neha Joshi",
    position: "Marketing Lead",
    bio: "Building the IEEE CS Nirma brand across digital platforms.",
    color: "bg-foreground text-background",
  },
];

const BoardMembers = () => {
  return (
    <div className="min-h-screen">
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="py-20 md:py-28 px-4 border-b-[3px] border-foreground overflow-hidden">
        <div className="container mx-auto">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
            <motion.div variants={badgePop} custom={0} className="inline-block brutal-border bg-foreground text-background px-4 py-2 mb-6">
              <span className="font-heading font-extrabold text-sm uppercase tracking-widest">Team</span>
            </motion.div>

            <div className="overflow-hidden">
              <AnimatedText
                text="Board Members"
                el="h1"
                className="text-5xl md:text-7xl font-heading font-extrabold leading-[0.9] mb-4"
                delay={0.1}
              />
            </div>

            <motion.div className="line-accent w-20 mb-6 mt-2" variants={lineReveal} custom={0} />

            <motion.p variants={fadeUp} custom={2} className="text-xl font-body text-muted-foreground max-w-2xl">
              Meet the passionate leaders driving IEEE Computer Society at Nirma University.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ── Grid ─────────────────────────────────────────────── */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={staggerContainer}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {members.map((member, i) => (
              <motion.div
                key={member.name}
                variants={scaleIn}
                custom={i}
                className="brutal-card overflow-hidden group"
                whileHover={{ y: -6, boxShadow: "var(--shadow-brutal-hover)", transition: { type: "spring", stiffness: 150 } }}
              >
                {/* Avatar with overlay reveal effect */}
                <div className={`w-full h-48 brutal-border mb-6 flex items-center justify-center relative overflow-hidden ${member.color}`}>
                  <motion.div
                    className="absolute inset-0 bg-primary"
                    initial={{ scaleY: 1, originY: 0 }}
                    whileInView={{ scaleY: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 + 0.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  />
                  <motion.span
                    className="text-6xl font-heading font-extrabold opacity-50 relative z-10"
                    initial={{ scale: 0.5, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 0.5 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 + 0.45, type: "spring", stiffness: 150 }}
                  >
                    {member.name.split(" ").map(n => n[0]).join("")}
                  </motion.span>
                </div>

                {/* Position badge */}
                <motion.div
                  className="inline-block brutal-border bg-primary px-3 py-1 mb-3"
                  initial={{ opacity: 0, x: -15 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 + 0.5, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                  <span className="font-heading font-bold text-primary-foreground text-xs uppercase">
                    {member.position}
                  </span>
                </motion.div>

                <h3 className="text-xl font-heading font-extrabold mb-2">{member.name}</h3>
                <p className="font-body text-muted-foreground mb-4">{member.bio}</p>

                <motion.a
                  href="#"
                  className="brutal-border inline-flex items-center gap-2 px-4 py-2 bg-background text-foreground font-heading font-bold text-sm
                    hover:bg-foreground hover:text-background transition-all"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Linkedin size={16} /> LinkedIn
                </motion.a>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default BoardMembers;
