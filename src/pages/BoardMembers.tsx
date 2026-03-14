import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Linkedin } from "lucide-react";
import {
  fadeUp,
  staggerContainer,
  lineReveal,
  badgePop,
  scaleIn,
} from "@/lib/animations";
import AnimatedText from "@/components/AnimatedText";
import {
  boardThemeClasses,
  fallbackBoardMembers,
  fetchPublishedBoardMembers,
  getInitials,
} from "@/lib/content/boardMembers";

const BoardMembers = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["board-members"],
    queryFn: fetchPublishedBoardMembers,
    placeholderData: {
      items: fallbackBoardMembers,
      source: "fallback" as const,
    },
  });

  const members = data?.items ?? fallbackBoardMembers;

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
              className="inline-block brutal-border bg-foreground text-background px-4 py-2 mb-6"
            >
              <span className="font-heading font-extrabold text-sm uppercase tracking-widest">
                Team
              </span>
            </motion.div>

            <div className="overflow-hidden">
              <AnimatedText
                text="Board Members"
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
              Meet the passionate leaders driving IEEE Computer Society at Nirma
              University.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ── Grid ─────────────────────────────────────────────── */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          {data?.source === "fallback" && (
            <div className="brutal-border bg-secondary text-secondary-foreground px-4 py-3 mb-8 font-heading font-bold text-xs uppercase tracking-wide inline-flex">
              Demo data active. Connect Supabase to manage board members
              dynamically.
            </div>
          )}

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={staggerContainer}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {isLoading && members.length === 0 && (
              <div className="md:col-span-2 lg:col-span-3 font-heading font-bold uppercase tracking-wide text-sm text-muted-foreground">
                Loading board members...
              </div>
            )}

            {members.map((member, i) => (
              <motion.div
                key={member.id}
                variants={scaleIn}
                custom={i}
                className="brutal-card overflow-hidden group"
                whileHover={{
                  y: -6,
                  boxShadow: "var(--shadow-brutal-hover)",
                  transition: { type: "spring", stiffness: 150 },
                }}
              >
                {/* Avatar with overlay reveal effect */}
                <div
                  className={`w-full h-48 brutal-border mb-6 flex items-center justify-center relative overflow-hidden ${boardThemeClasses[member.themeVariant]}`}
                >
                  {member.photoUrl && (
                    <img
                      src={member.photoUrl}
                      alt={member.name}
                      className="absolute inset-0 w-full h-full object-cover"
                      loading="lazy"
                    />
                  )}
                  <motion.div
                    className={`absolute inset-0 ${member.photoUrl ? "bg-black/20" : "bg-primary"}`}
                    initial={{ scaleY: 1, originY: 0 }}
                    whileInView={{ scaleY: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      delay: i * 0.08 + 0.2,
                      duration: 0.6,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  />
                  {!member.photoUrl && (
                    <motion.span
                      className="text-6xl font-heading font-extrabold opacity-50 relative z-10"
                      initial={{ scale: 0.5, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 0.5 }}
                      viewport={{ once: true }}
                      transition={{
                        delay: i * 0.08 + 0.45,
                        type: "spring",
                        stiffness: 150,
                      }}
                    >
                      {getInitials(member.name)}
                    </motion.span>
                  )}
                </div>

                {/* Position badge */}
                <motion.div
                  className="inline-block brutal-border bg-primary px-3 py-1 mb-3"
                  initial={{ opacity: 0, x: -15 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    delay: i * 0.08 + 0.5,
                    duration: 0.4,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  <span className="font-heading font-bold text-primary-foreground text-xs uppercase">
                    {member.position}
                  </span>
                </motion.div>

                <h3 className="text-xl font-heading font-extrabold mb-2">
                  {member.name}
                </h3>
                <p className="font-body text-muted-foreground mb-4">
                  {member.bio}
                </p>

                {member.linkedinUrl ? (
                  <motion.a
                    href={member.linkedinUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="brutal-border inline-flex items-center gap-2 px-4 py-2 bg-background text-foreground font-heading font-bold text-sm
                      hover:bg-foreground hover:text-background transition-all"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <Linkedin size={16} /> LinkedIn
                  </motion.a>
                ) : (
                  <button
                    type="button"
                    disabled
                    className="brutal-border inline-flex items-center gap-2 px-4 py-2 bg-background text-muted-foreground font-heading font-bold text-sm cursor-not-allowed"
                  >
                    <Linkedin size={16} /> LinkedIn Soon
                  </button>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default BoardMembers;
