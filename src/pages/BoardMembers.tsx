import { motion } from "framer-motion";
import { Linkedin } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5 },
  }),
};

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
      {/* Hero */}
      <section className="py-20 md:py-28 px-4 border-b-[3px] border-foreground">
        <div className="container mx-auto">
          <motion.div initial="hidden" animate="visible">
            <motion.div variants={fadeUp} custom={0} className="inline-block brutal-border bg-foreground text-background px-4 py-2 mb-6">
              <span className="font-heading font-extrabold text-sm uppercase tracking-widest">
                Team
              </span>
            </motion.div>
            <motion.h1 variants={fadeUp} custom={1} className="text-5xl md:text-7xl font-heading font-extrabold leading-[0.9] mb-6">
              Board <span className="text-primary">Members</span>
            </motion.h1>
            <motion.p variants={fadeUp} custom={2} className="text-xl font-body text-muted-foreground max-w-2xl">
              Meet the passionate leaders driving IEEE Computer Society at Nirma University.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Grid */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {members.map((member, i) => (
              <motion.div
                key={member.name}
                variants={fadeUp}
                custom={i}
                className="brutal-card hover:brutal-shadow-hover hover:-translate-y-1 transition-all"
              >
                {/* Avatar placeholder */}
                <div className={`w-full h-48 brutal-border mb-6 flex items-center justify-center ${member.color}`}>
                  <span className="text-6xl font-heading font-extrabold opacity-50">
                    {member.name.split(" ").map(n => n[0]).join("")}
                  </span>
                </div>

                <div className="inline-block brutal-border bg-primary px-3 py-1 mb-3">
                  <span className="font-heading font-bold text-primary-foreground text-xs uppercase">
                    {member.position}
                  </span>
                </div>

                <h3 className="text-xl font-heading font-extrabold mb-2">{member.name}</h3>
                <p className="font-body text-muted-foreground mb-4">{member.bio}</p>

                <a
                  href="#"
                  className="brutal-border inline-flex items-center gap-2 px-4 py-2 bg-background text-foreground font-heading font-bold text-sm
                    hover:bg-foreground hover:text-background transition-all"
                >
                  <Linkedin size={16} /> LinkedIn
                </a>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default BoardMembers;
