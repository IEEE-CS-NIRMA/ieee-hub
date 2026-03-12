import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Users, Calendar, BookOpen, Trophy } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5 },
  }),
};

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
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden py-20 md:py-32 px-4">
        {/* Background shapes */}
        <div className="absolute top-10 right-10 w-32 h-32 bg-primary brutal-border brutal-shadow rotate-12 opacity-20" />
        <div className="absolute bottom-20 left-10 w-24 h-24 bg-secondary brutal-border brutal-shadow -rotate-6 opacity-20" />
        <div className="absolute top-1/2 right-1/3 w-16 h-16 bg-foreground opacity-10 rotate-45" />

        <div className="container mx-auto relative z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            className="max-w-4xl"
          >
            <motion.div variants={fadeUp} custom={0} className="inline-block brutal-border bg-primary px-4 py-2 mb-6">
              <span className="font-heading font-extrabold text-primary-foreground text-sm uppercase tracking-widest">
                Student Chapter
              </span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              custom={1}
              className="text-5xl md:text-7xl lg:text-8xl font-heading font-extrabold leading-[0.9] mb-6"
            >
              IEEE Computer
              <br />
              Society —
              <br />
              <span className="text-primary">Nirma University</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              custom={2}
              className="text-xl md:text-2xl font-body max-w-xl mb-10 text-muted-foreground"
            >
              Empowering innovation, technology, and future engineers.
            </motion.p>

            <motion.div variants={fadeUp} custom={3} className="flex flex-wrap gap-4">
              <Link to="/events" className="brutal-btn-primary flex items-center gap-2">
                Explore Events <ArrowRight size={18} />
              </Link>
              <a href="#" className="brutal-btn-secondary">
                Join IEEE
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* About IEEE CS */}
      <section className="py-20 px-4 border-t-[3px] border-foreground">
        <div className="container mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 gap-12 items-center"
          >
            <motion.div variants={fadeUp} custom={0}>
              <h2 className="text-4xl md:text-5xl font-heading font-extrabold mb-6">
                About <span className="text-primary">IEEE CS</span>
              </h2>
              <p className="font-body text-lg text-muted-foreground mb-4">
                The IEEE Computer Society is the world's leading organization of computing professionals, 
                driving technology innovation and excellence for the benefit of humanity.
              </p>
              <p className="font-body text-lg text-muted-foreground mb-6">
                Our student chapter at Nirma University brings together passionate tech enthusiasts 
                to learn, innovate, and grow together.
              </p>
              <Link to="/about" className="brutal-btn-outline inline-flex items-center gap-2">
                Learn More <ArrowRight size={18} />
              </Link>
            </motion.div>

            <motion.div variants={fadeUp} custom={1} className="grid grid-cols-2 gap-4">
              <div className="brutal-card bg-primary text-primary-foreground">
                <h3 className="text-2xl font-extrabold">Est.</h3>
                <p className="text-4xl font-extrabold">2015</p>
              </div>
              <div className="brutal-card bg-secondary text-secondary-foreground">
                <h3 className="text-2xl font-extrabold">200+</h3>
                <p className="font-body text-sm">Active Members</p>
              </div>
              <div className="brutal-card col-span-2">
                <p className="font-body text-lg font-semibold">
                  "Technology is best when it brings people together."
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-20 px-4 bg-muted border-t-[3px] border-foreground">
        <div className="container mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <motion.h2 variants={fadeUp} custom={0} className="text-4xl md:text-5xl font-heading font-extrabold mb-12">
              Upcoming <span className="text-primary">Events</span>
            </motion.h2>

            <div className="grid md:grid-cols-3 gap-6">
              {upcomingEvents.map((event, i) => (
                <motion.div
                  key={event.title}
                  variants={fadeUp}
                  custom={i + 1}
                  className="brutal-card hover:brutal-shadow-hover hover:-translate-y-1 transition-all"
                >
                  <div className="inline-block brutal-border bg-primary px-3 py-1 mb-4">
                    <span className="font-heading font-bold text-primary-foreground text-xs uppercase">{event.date}</span>
                  </div>
                  <h3 className="text-xl font-heading font-extrabold mb-2">{event.title}</h3>
                  <p className="font-body text-muted-foreground mb-4">{event.desc}</p>
                  <button className="brutal-btn-outline text-sm">Register →</button>
                </motion.div>
              ))}
            </div>

            <motion.div variants={fadeUp} custom={4} className="mt-8 text-center">
              <Link to="/events" className="brutal-btn-primary inline-flex items-center gap-2">
                View All Events <ArrowRight size={18} />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Why Join */}
      <section className="py-20 px-4 border-t-[3px] border-foreground">
        <div className="container mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <motion.h2 variants={fadeUp} custom={0} className="text-4xl md:text-5xl font-heading font-extrabold mb-12">
              Why Join <span className="text-primary">IEEE?</span>
            </motion.h2>

            <div className="grid md:grid-cols-3 gap-6">
              {whyJoin.map((item, i) => (
                <motion.div
                  key={item.title}
                  variants={fadeUp}
                  custom={i + 1}
                  className={`brutal-border brutal-shadow p-8 ${item.color} hover:brutal-shadow-hover hover:-translate-y-1 transition-all`}
                >
                  <h3 className="text-2xl font-heading font-extrabold mb-4 uppercase">{item.title}</h3>
                  <p className="font-body text-base">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 px-4 bg-foreground text-background border-t-[3px] border-foreground">
        <div className="container mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                variants={fadeUp}
                custom={i}
                className="text-center border-[3px] border-background p-6 hover:bg-primary hover:text-primary-foreground transition-all"
              >
                <stat.icon size={32} className="mx-auto mb-3" />
                <p className="text-4xl md:text-5xl font-heading font-extrabold">{stat.value}</p>
                <p className="font-body text-sm uppercase tracking-wide mt-2">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Index;
