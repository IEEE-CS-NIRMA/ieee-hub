import { motion } from "framer-motion";
import { Mail, MapPin, Linkedin, Twitter, Github } from "lucide-react";
import { useState } from "react";
import {
  fadeUp,
  slideLeft,
  slideRight,
  staggerContainer,
  lineReveal,
  badgePop,
} from "@/lib/animations";
import AnimatedText from "@/components/AnimatedText";

const socialLinks = [
  { label: "LinkedIn", icon: Linkedin },
  { label: "Twitter", icon: Twitter },
  { label: "GitHub", icon: Github },
];

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [focused, setFocused] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Message sent! (Demo)");
    setForm({ name: "", email: "", message: "" });
  };

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
                Get in Touch
              </span>
            </motion.div>

            <div className="overflow-hidden">
              <AnimatedText
                text="Contact Us"
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
              Have questions? Want to collaborate? Reach out to us!
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ── Contact Section ───────────────────────────────────── */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="grid md:grid-cols-2 gap-8"
          >
            {/* Left: Info */}
            <motion.div variants={slideLeft} custom={0} className="space-y-6">
              {[
                {
                  icon: Mail,
                  title: "Email",
                  color: "bg-primary",
                  iconColor: "text-primary-foreground",
                  content: (
                    <a
                      href="mailto:ieee@nirmauni.ac.in"
                      className="font-body text-muted-foreground hover:text-primary transition-colors fancy-link"
                    >
                      ieee@nirmauni.ac.in
                    </a>
                  ),
                },
                {
                  icon: MapPin,
                  title: "Location",
                  color: "bg-secondary",
                  iconColor: "text-secondary-foreground",
                  content: (
                    <p className="font-body text-muted-foreground">
                      Nirma University
                      <br />
                      Sarkhej-Gandhinagar Highway
                      <br />
                      Ahmedabad, Gujarat 382481
                    </p>
                  ),
                },
              ].map((item, i) => (
                <motion.div
                  key={item.title}
                  className="brutal-card"
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    delay: i * 0.12,
                    duration: 0.6,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  whileHover={{
                    y: -4,
                    boxShadow: "var(--shadow-brutal-hover)",
                    transition: { type: "spring", stiffness: 200 },
                  }}
                >
                  <div className="flex items-start gap-4">
                    <motion.div
                      className={`brutal-border ${item.color} p-3 shrink-0`}
                      whileHover={{ rotate: 10, scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <item.icon size={24} className={item.iconColor} />
                    </motion.div>
                    <div>
                      <h3 className="font-heading font-extrabold text-lg mb-1">
                        {item.title}
                      </h3>
                      {item.content}
                    </div>
                  </div>
                </motion.div>
              ))}

              <motion.div
                className="brutal-card bg-foreground text-background"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{
                  delay: 0.24,
                  duration: 0.6,
                  ease: [0.16, 1, 0.3, 1],
                }}
                whileHover={{
                  y: -4,
                  boxShadow: "var(--shadow-brutal-hover)",
                  transition: { type: "spring", stiffness: 200 },
                }}
              >
                <h3 className="font-heading font-extrabold text-lg mb-2">
                  Follow Us
                </h3>
                <p className="font-body text-sm opacity-80 mb-4">
                  Stay updated with our latest events and announcements.
                </p>
                <motion.div
                  className="flex gap-3"
                  variants={staggerContainer}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  {socialLinks.map((social, i) => (
                    <motion.a
                      key={social.label}
                      href="#"
                      variants={badgePop}
                      custom={i}
                      className="border-[3px] border-background px-3 py-2 font-heading font-bold text-xs uppercase inline-flex items-center gap-2
                        hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all"
                      whileHover={{ y: -3 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <social.icon size={14} />
                      {social.label}
                    </motion.a>
                  ))}
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Right: Form */}
            <motion.div variants={slideRight} custom={0}>
              <motion.form
                onSubmit={handleSubmit}
                className="brutal-card space-y-6"
                whileHover={{
                  boxShadow: "var(--shadow-brutal-hover)",
                  transition: { duration: 0.2 },
                }}
              >
                <h2 className="text-2xl font-heading font-extrabold mb-2">
                  Send a Message
                </h2>
                <motion.div
                  className="line-accent w-12 mb-4"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                />

                {[
                  {
                    key: "name",
                    label: "Name",
                    type: "text",
                    placeholder: "Your name",
                  },
                  {
                    key: "email",
                    label: "Email",
                    type: "email",
                    placeholder: "your@email.com",
                  },
                ].map((field) => (
                  <motion.div
                    key={field.key}
                    animate={{ y: focused === field.key ? -2 : 0 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <label className="font-heading font-bold text-sm uppercase tracking-wide block mb-2">
                      {field.label}
                    </label>
                    <input
                      type={field.type}
                      required
                      value={form[field.key as "name" | "email"]}
                      onChange={(e) =>
                        setForm({ ...form, [field.key]: e.target.value })
                      }
                      onFocus={() => setFocused(field.key)}
                      onBlur={() => setFocused(null)}
                      className="w-full brutal-border p-3 bg-background text-foreground font-body focus:outline-none focus:ring-2 focus:ring-primary transition-shadow"
                      placeholder={field.placeholder}
                    />
                  </motion.div>
                ))}

                <motion.div
                  animate={{ y: focused === "message" ? -2 : 0 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <label className="font-heading font-bold text-sm uppercase tracking-wide block mb-2">
                    Message
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) =>
                      setForm({ ...form, message: e.target.value })
                    }
                    onFocus={() => setFocused("message")}
                    onBlur={() => setFocused(null)}
                    className="w-full brutal-border p-3 bg-background text-foreground font-body focus:outline-none focus:ring-2 focus:ring-primary resize-none transition-shadow"
                    placeholder="Write your message..."
                  />
                </motion.div>

                <motion.button
                  type="submit"
                  className="brutal-btn-primary w-full text-center"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Send Message →
                </motion.button>
              </motion.form>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
