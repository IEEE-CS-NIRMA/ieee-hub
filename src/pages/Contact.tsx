import { useEffect, useRef, useState } from "react";
import { Mail, MapPin, Linkedin, Github } from "lucide-react";
import { SiDiscord } from "react-icons/si";
import { SplineScene } from "@/components/ui/splite";

const socialLinks = [
  { label: "LinkedIn", icon: Linkedin, href: "#" },
  { label: "Discord", icon: SiDiscord, href: "#" },
  { label: "GitHub", icon: Github, href: "#" },
];

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const sectionRef = useRef<HTMLElement | null>(null);
  const interactionRef = useRef<HTMLDivElement | null>(null);
  const splineHostRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const interactionEl = sectionRef.current;
    const splineHost = splineHostRef.current;
    if (!interactionEl || !splineHost) return;

    let rafId = 0;
    let lastEvent: PointerEvent | null = null;
    let inside = false;

    const dispatchToSpline = (event: PointerEvent) => {
      const canvas = splineHost.querySelector("canvas");
      if (!canvas) return;

      // Let native events drive interaction when cursor is already over the canvas.
      if (event.target instanceof Node && canvas.contains(event.target)) return;

      const sourceRect = interactionEl.getBoundingClientRect();
      const targetRect = canvas.getBoundingClientRect();
      if (sourceRect.width === 0 || sourceRect.height === 0) return;

      const xRatioRaw = (event.clientX - sourceRect.left) / sourceRect.width;
      const yRatioRaw = (event.clientY - sourceRect.top) / sourceRect.height;
      const xRatio = Math.min(1, Math.max(0, xRatioRaw));
      const yRatio = Math.min(1, Math.max(0, yRatioRaw));

      const mappedX = targetRect.left + xRatio * targetRect.width;
      const mappedY = targetRect.top + yRatio * targetRect.height;

      if (!inside) {
        inside = true;
        canvas.dispatchEvent(
          new PointerEvent("pointerenter", {
            bubbles: false,
            cancelable: false,
            pointerId: event.pointerId,
            pointerType: event.pointerType,
            isPrimary: event.isPrimary,
            clientX: mappedX,
            clientY: mappedY,
          }),
        );
        canvas.dispatchEvent(
          new PointerEvent("pointerover", {
            bubbles: false,
            cancelable: false,
            pointerId: event.pointerId,
            pointerType: event.pointerType,
            isPrimary: event.isPrimary,
            clientX: mappedX,
            clientY: mappedY,
          }),
        );
        canvas.dispatchEvent(
          new MouseEvent("mouseenter", {
            bubbles: false,
            cancelable: false,
            view: window,
            clientX: mappedX,
            clientY: mappedY,
          }),
        );
        canvas.dispatchEvent(
          new MouseEvent("mouseover", {
            bubbles: false,
            cancelable: false,
            view: window,
            clientX: mappedX,
            clientY: mappedY,
          }),
        );
      }

      canvas.dispatchEvent(
        new PointerEvent("pointermove", {
          bubbles: false,
          cancelable: false,
          pointerId: event.pointerId,
          pointerType: event.pointerType,
          isPrimary: event.isPrimary,
          clientX: mappedX,
          clientY: mappedY,
        }),
      );
      canvas.dispatchEvent(
        new MouseEvent("mousemove", {
          bubbles: false,
          cancelable: false,
          view: window,
          clientX: mappedX,
          clientY: mappedY,
        }),
      );
    };

    const onPointerMove = (event: PointerEvent) => {
      lastEvent = event;
      if (rafId) return;
      rafId = window.requestAnimationFrame(() => {
        if (lastEvent) dispatchToSpline(lastEvent);
        rafId = 0;
      });
    };

    const onPointerLeave = () => {
      const canvas = splineHost.querySelector("canvas");
      if (!canvas || !inside) return;
      inside = false;
      canvas.dispatchEvent(
        new PointerEvent("pointerleave", {
          bubbles: false,
          cancelable: false,
        }),
      );
      canvas.dispatchEvent(
        new PointerEvent("pointerout", {
          bubbles: false,
          cancelable: false,
        }),
      );
      canvas.dispatchEvent(
        new MouseEvent("mouseleave", {
          bubbles: false,
          cancelable: false,
          view: window,
        }),
      );
      canvas.dispatchEvent(
        new MouseEvent("mouseout", {
          bubbles: false,
          cancelable: false,
          view: window,
        }),
      );
    };

    interactionEl.addEventListener("pointermove", onPointerMove, true);
    interactionEl.addEventListener("pointerleave", onPointerLeave, true);

    return () => {
      interactionEl.removeEventListener("pointermove", onPointerMove, true);
      interactionEl.removeEventListener("pointerleave", onPointerLeave, true);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Message sent! (Demo)");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="min-h-screen">
      <section
        ref={sectionRef}
        className="py-16 px-4 border-b-[3px] border-foreground"
      >
        <div className="container mx-auto">
          <h1 className="text-4xl md:text-6xl font-heading font-extrabold mb-3">
            Contact <span className="text-primary">IEEE CS</span>
          </h1>
          <div className="line-accent w-20 mb-8" />

          <div
            ref={interactionRef}
            className="grid lg:grid-cols-2 gap-8 items-stretch lg:min-h-[72vh]"
          >
            <form onSubmit={handleSubmit} className="brutal-card space-y-5">
              <h2 className="text-2xl font-heading font-extrabold">
                Send a Message
              </h2>

              <div>
                <label className="font-heading font-bold text-sm uppercase tracking-wide block mb-2">
                  Name
                </label>
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
                <label className="font-heading font-bold text-sm uppercase tracking-wide block mb-2">
                  Email
                </label>
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
                <label className="font-heading font-bold text-sm uppercase tracking-wide block mb-2">
                  Message
                </label>
                <textarea
                  required
                  rows={6}
                  value={form.message}
                  onChange={(e) =>
                    setForm({ ...form, message: e.target.value })
                  }
                  className="w-full brutal-border p-3 bg-background text-foreground font-body focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  placeholder="Write your message..."
                />
              </div>

              <button
                type="submit"
                className="brutal-btn-primary w-full text-center"
              >
                Send Message &rarr;
              </button>
            </form>

            <div
              ref={splineHostRef}
              className="relative overflow-hidden min-h-[420px] sm:min-h-[520px] lg:min-h-0"
            >
              <SplineScene
                scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
                className="absolute inset-0 h-full w-full"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="container mx-auto grid md:grid-cols-3 gap-6">
          <div className="brutal-card">
            <div className="flex items-start gap-4">
              <div className="brutal-border bg-primary p-3 shrink-0">
                <Mail size={22} className="text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-heading font-extrabold text-lg mb-1">
                  Email
                </h3>
                <a
                  href="mailto:ieee@nirmauni.ac.in"
                  className="font-body text-muted-foreground hover:text-primary transition-colors"
                >
                  ieee@nirmauni.ac.in
                </a>
              </div>
            </div>
          </div>

          <div className="brutal-card">
            <div className="flex items-start gap-4">
              <div className="brutal-border bg-secondary p-3 shrink-0">
                <MapPin size={22} className="text-secondary-foreground" />
              </div>
              <div>
                <h3 className="font-heading font-extrabold text-lg mb-1">
                  Location
                </h3>
                <p className="font-body text-muted-foreground">
                  Nirma University
                  <br />
                  Sarkhej-Gandhinagar Highway
                  <br />
                  Ahmedabad, Gujarat 382481
                </p>
              </div>
            </div>
          </div>

          <div className="brutal-card bg-foreground text-background">
            <h3 className="font-heading font-extrabold text-lg mb-2">
              Follow Us
            </h3>
            <p className="font-body text-sm opacity-80 mb-4">
              Stay updated with our latest events and announcements.
            </p>
            <div className="flex flex-wrap gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="border-[3px] border-background px-3 py-2 font-heading font-bold text-xs uppercase inline-flex items-center gap-2 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all"
                >
                  <social.icon size={14} />
                  {social.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
