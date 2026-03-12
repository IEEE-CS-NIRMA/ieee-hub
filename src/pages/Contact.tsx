import { motion } from "framer-motion";
import { Mail, MapPin } from "lucide-react";
import { useState } from "react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5 },
  }),
};

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Message sent! (Demo)");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="py-20 md:py-28 px-4 border-b-[3px] border-foreground">
        <div className="container mx-auto">
          <motion.div initial="hidden" animate="visible">
            <motion.div variants={fadeUp} custom={0} className="inline-block brutal-border bg-secondary px-4 py-2 mb-6">
              <span className="font-heading font-extrabold text-secondary-foreground text-sm uppercase tracking-widest">
                Get in Touch
              </span>
            </motion.div>
            <motion.h1 variants={fadeUp} custom={1} className="text-5xl md:text-7xl font-heading font-extrabold leading-[0.9] mb-6">
              Contact <span className="text-primary">Us</span>
            </motion.h1>
            <motion.p variants={fadeUp} custom={2} className="text-xl font-body text-muted-foreground max-w-2xl">
              Have questions? Want to collaborate? Reach out to us!
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 gap-8"
          >
            {/* Left: Info */}
            <motion.div variants={fadeUp} custom={0} className="space-y-6">
              <div className="brutal-card">
                <div className="flex items-start gap-4">
                  <div className="brutal-border bg-primary p-3">
                    <Mail size={24} className="text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-heading font-extrabold text-lg mb-1">Email</h3>
                    <a href="mailto:ieee@nirmauni.ac.in" className="font-body text-muted-foreground hover:text-primary transition-colors">
                      ieee@nirmauni.ac.in
                    </a>
                  </div>
                </div>
              </div>

              <div className="brutal-card">
                <div className="flex items-start gap-4">
                  <div className="brutal-border bg-secondary p-3">
                    <MapPin size={24} className="text-secondary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-heading font-extrabold text-lg mb-1">Location</h3>
                    <p className="font-body text-muted-foreground">
                      Nirma University<br />
                      Sarkhej-Gandhinagar Highway<br />
                      Ahmedabad, Gujarat 382481
                    </p>
                  </div>
                </div>
              </div>

              <div className="brutal-card bg-foreground text-background">
                <h3 className="font-heading font-extrabold text-lg mb-2">Follow Us</h3>
                <p className="font-body text-sm opacity-80 mb-4">
                  Stay updated with our latest events and announcements.
                </p>
                <div className="flex gap-3">
                  {["LinkedIn", "Instagram", "Twitter"].map((s) => (
                    <a
                      key={s}
                      href="#"
                      className="border-[3px] border-background px-3 py-2 font-heading font-bold text-xs uppercase
                        hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all"
                    >
                      {s}
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Right: Form */}
            <motion.div variants={fadeUp} custom={1}>
              <form onSubmit={handleSubmit} className="brutal-card space-y-6">
                <h2 className="text-2xl font-heading font-extrabold mb-2">Send a Message</h2>

                <div>
                  <label className="font-heading font-bold text-sm uppercase tracking-wide block mb-2">Name</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full brutal-border p-3 bg-background text-foreground font-body focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label className="font-heading font-bold text-sm uppercase tracking-wide block mb-2">Email</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full brutal-border p-3 bg-background text-foreground font-body focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label className="font-heading font-bold text-sm uppercase tracking-wide block mb-2">Message</label>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full brutal-border p-3 bg-background text-foreground font-body focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    placeholder="Write your message..."
                  />
                </div>

                <button type="submit" className="brutal-btn-primary w-full text-center">
                  Send Message →
                </button>
              </form>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
