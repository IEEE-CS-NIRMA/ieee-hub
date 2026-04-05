import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  fadeUp,
  staggerContainer,
  lineReveal,
  badgePop,
} from "@/lib/animations";
import AnimatedText from "@/components/AnimatedText";
import {
  eventFilters,
  fallbackEvents,
  fetchPublishedEvents,
  type EventCategory,
  type EventFilter,
} from "@/lib/content/events";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";

const categoryColors: Record<EventCategory, string> = {
  workshop: "bg-secondary text-secondary-foreground",
  competition: "bg-primary text-primary-foreground",
  talk: "bg-foreground text-background",
  hackathon: "bg-primary text-primary-foreground",
};

const eventCardVariants = {
  hidden: { opacity: 0, scale: 0.94, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      delay: i * 0.06,
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};

const eventMetaVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.06 + 0.12,
      duration: 0.35,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};

function getEmbeddableRegistrationUrl(url: string) {
  if (!url) {
    return url;
  }

  if (!url.includes("docs.google.com/forms")) {
    return url;
  }

  try {
    const parsed = new URL(url);
    parsed.searchParams.set("embedded", "true");
    return parsed.toString();
  } catch {
    return url;
  }
}

function isPastEventDate(eventDate: string) {
  const parsedDate = new Date(eventDate);

  if (Number.isNaN(parsedDate.getTime())) {
    return false;
  }

  const endOfEventDay = new Date(parsedDate);
  endOfEventDay.setHours(23, 59, 59, 999);
  return endOfEventDay.getTime() < Date.now();
}

const Events = () => {
  const [isSubmittingRegistration, setIsSubmittingRegistration] =
    useState(false);
  const [activeRegistrationEvent, setActiveRegistrationEvent] = useState<{
    id: string;
    title: string;
  } | null>(null);
  const [activeExternalRegistration, setActiveExternalRegistration] = useState<{
    title: string;
    url: string;
  } | null>(null);
  const [registrationForm, setRegistrationForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    college: "",
    year: "",
    branch: "",
  });
  const [activeFilter, setActiveFilter] = useState<EventFilter>("all");
  const [activePoster, setActivePoster] = useState<{
    title: string;
    url: string;
  } | null>(null);
  const [posterRenderWidth, setPosterRenderWidth] = useState<number | null>(
    null,
  );
  const [isPosterTitleCompact, setIsPosterTitleCompact] = useState(false);
  const posterTitleRef = useRef<HTMLHeadingElement | null>(null);

  useEffect(() => {
    if (!activePoster) {
      setPosterRenderWidth(null);
      setIsPosterTitleCompact(false);
      return;
    }

    const evaluateTitleFit = () => {
      const titleElement = posterTitleRef.current;
      if (!titleElement) {
        return;
      }

      setIsPosterTitleCompact(
        titleElement.scrollWidth > titleElement.clientWidth,
      );
    };

    const rafId = window.requestAnimationFrame(evaluateTitleFit);
    window.addEventListener("resize", evaluateTitleFit);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener("resize", evaluateTitleFit);
    };
  }, [activePoster, posterRenderWidth]);

  useEffect(() => {
    if (
      !activePoster &&
      !activeExternalRegistration &&
      !activeRegistrationEvent
    ) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") {
        return;
      }

      if (activePoster) {
        setActivePoster(null);
        return;
      }

      if (activeExternalRegistration) {
        setActiveExternalRegistration(null);
        return;
      }

      if (activeRegistrationEvent && !isSubmittingRegistration) {
        setActiveRegistrationEvent(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    activePoster,
    activeExternalRegistration,
    activeRegistrationEvent,
    isSubmittingRegistration,
  ]);

  const { data, isLoading, isPlaceholderData } = useQuery({
    queryKey: ["events"],
    queryFn: fetchPublishedEvents,
    placeholderData: {
      items: fallbackEvents,
      source: "fallback" as const,
    },
  });

  const events = data?.items ?? fallbackEvents;
  const filtered =
    activeFilter === "all"
      ? events
      : events.filter((e) => e.category === activeFilter);

  const resetRegistrationForm = () => {
    setRegistrationForm({
      fullName: "",
      email: "",
      phone: "",
      college: "",
      year: "",
      branch: "",
    });
  };

  const handleRegistrationSubmit = async (
    submitEvent: React.FormEvent<HTMLFormElement>,
  ) => {
    submitEvent.preventDefault();

    if (!activeRegistrationEvent) {
      return;
    }

    const matchingEvent = events.find(
      (event) => event.id === activeRegistrationEvent.id,
    );

    if (matchingEvent && isPastEventDate(matchingEvent.date)) {
      toast.error("Registration for this event is closed.");
      setActiveRegistrationEvent(null);
      return;
    }

    if (!isSupabaseConfigured || !supabase) {
      toast.error("Supabase is not configured.");
      return;
    }

    try {
      setIsSubmittingRegistration(true);

      const { error } = await supabase.from("event_registrations").insert({
        event_id: activeRegistrationEvent.id,
        full_name: registrationForm.fullName.trim(),
        email: registrationForm.email.trim().toLowerCase(),
        phone: registrationForm.phone.trim() || null,
        college: registrationForm.college.trim() || null,
        year: registrationForm.year.trim() || null,
        branch: registrationForm.branch.trim() || null,
      });

      if (error) {
        if (error.code === "23505") {
          toast.error("You are already registered for this event.");
        } else {
          toast.error("Could not complete registration. Please try again.");
        }
        return;
      }

      toast.success("Registration submitted successfully.");
      resetRegistrationForm();
      setActiveRegistrationEvent(null);
    } catch (registrationError) {
      console.error("Event registration failed", registrationError);
      toast.error("Could not complete registration. Please try again.");
    } finally {
      setIsSubmittingRegistration(false);
    }
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
              className="inline-block brutal-border bg-primary px-4 py-2 mb-6"
            >
              <span className="font-heading font-extrabold text-primary-foreground text-sm uppercase tracking-widest">
                Events
              </span>
            </motion.div>

            <div className="overflow-hidden">
              <AnimatedText
                text="Our Events"
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
              From hackathons to workshops, we've got something for every tech
              enthusiast.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ── Filters + Grid ───────────────────────────────────── */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          {!isLoading && !isPlaceholderData && data?.source === "fallback" && (
            <div className="brutal-border bg-secondary text-secondary-foreground px-4 py-3 mb-8 font-heading font-bold text-xs uppercase tracking-wide inline-flex">
              Demo data active. Connect Supabase to manage events dynamically.
            </div>
          )}

          {/* Filters */}
          <motion.div
            className="flex flex-wrap gap-3 mb-12"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            {eventFilters.map((filter, i) => (
              <motion.button
                key={filter.value}
                variants={fadeUp}
                custom={i}
                onClick={() => setActiveFilter(filter.value)}
                className={`brutal-border px-5 py-3 font-heading font-bold text-sm uppercase tracking-wide transition-all
                  hover:brutal-shadow-sm hover:-translate-y-0.5
                  ${activeFilter === filter.value ? "bg-foreground text-background brutal-shadow-sm" : "bg-background text-foreground"}`}
                whileTap={{ scale: 0.96 }}
              >
                {filter.label}
              </motion.button>
            ))}
          </motion.div>

          {/* Grid with AnimatePresence for filter transitions */}
          <motion.div
            layout
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {isLoading && filtered.length === 0 && (
              <div className="md:col-span-2 lg:col-span-3 font-heading font-bold uppercase tracking-wide text-sm text-muted-foreground">
                Loading events...
              </div>
            )}

            {!isLoading && filtered.length === 0 && (
              <div className="md:col-span-2 lg:col-span-3 brutal-border p-6 font-body text-muted-foreground">
                No events found for this category yet.
              </div>
            )}

            <AnimatePresence mode="popLayout">
              {filtered.map((event, i) =>
                (() => {
                  const isPastEvent = isPastEventDate(event.date);

                  return (
                    <motion.div
                      key={event.id}
                      layout
                      custom={i}
                      variants={eventCardVariants}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: false, amount: 0.2 }}
                      exit={{ opacity: 0, scale: 0.85, y: -10 }}
                      className="brutal-card flex flex-col"
                      whileHover={{
                        y: -6,
                        boxShadow: "var(--shadow-brutal-hover)",
                        transition: { type: "spring", stiffness: 150 },
                      }}
                    >
                      <motion.div
                        className="flex items-center gap-3 mb-4"
                        custom={i}
                        variants={eventMetaVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: false, amount: 0.3 }}
                      >
                        <span
                          className={`brutal-border px-3 py-1 font-heading font-bold text-xs uppercase ${categoryColors[event.category]}`}
                        >
                          {event.category}
                        </span>
                      </motion.div>
                      <h3 className="text-xl font-heading font-extrabold mb-2">
                        {event.title}
                      </h3>
                      <p className="font-heading font-semibold text-sm text-primary mb-2">
                        {event.date}
                      </p>
                      <p className="font-body text-muted-foreground mb-6 flex-1">
                        {event.desc}
                      </p>
                      <div className="mt-auto grid grid-cols-2 gap-3">
                        {event.posterLink ? (
                          <motion.button
                            type="button"
                            onClick={() =>
                              setActivePoster({
                                title: event.title,
                                url: event.posterLink ?? "",
                              })
                            }
                            className="brutal-border px-4 py-3 bg-background text-foreground font-heading font-extrabold uppercase tracking-wide text-base md:text-lg inline-flex items-center justify-center text-center hover:bg-foreground hover:text-background transition-all"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            Poster
                          </motion.button>
                        ) : (
                          <motion.button
                            type="button"
                            disabled
                            className="brutal-border bg-background text-muted-foreground cursor-not-allowed px-4 py-3 font-heading font-extrabold uppercase tracking-wide text-base md:text-lg inline-flex items-center justify-center text-center"
                          >
                            Poster Soon
                          </motion.button>
                        )}

                        {event.registrationMode === "internal" ? (
                          <motion.button
                            type="button"
                            onClick={
                              isPastEvent
                                ? undefined
                                : () =>
                                    setActiveRegistrationEvent({
                                      id: event.id,
                                      title: event.title,
                                    })
                            }
                            disabled={isPastEvent}
                            className={`px-4 py-3 font-heading font-extrabold uppercase tracking-wide text-base md:text-lg inline-flex items-center justify-center text-center ${
                              isPastEvent
                                ? "brutal-border bg-background text-muted-foreground cursor-not-allowed"
                                : "brutal-btn-primary"
                            }`}
                            whileHover={
                              isPastEvent ? undefined : { scale: 1.02 }
                            }
                            whileTap={{ scale: 0.98 }}
                          >
                            {isPastEvent ? "Registration Closed" : "Register →"}
                          </motion.button>
                        ) : event.registrationLink ? (
                          <motion.button
                            type="button"
                            onClick={
                              isPastEvent
                                ? undefined
                                : () =>
                                    setActiveExternalRegistration({
                                      title: event.title,
                                      url: event.registrationLink ?? "",
                                    })
                            }
                            disabled={isPastEvent}
                            className={`px-4 py-3 font-heading font-extrabold uppercase tracking-wide text-base md:text-lg inline-flex items-center justify-center text-center ${
                              isPastEvent
                                ? "brutal-border bg-background text-muted-foreground cursor-not-allowed"
                                : "brutal-btn-primary"
                            }`}
                            whileHover={
                              isPastEvent ? undefined : { scale: 1.02 }
                            }
                            whileTap={{ scale: 0.98 }}
                          >
                            {isPastEvent ? "Registration Closed" : "Register →"}
                          </motion.button>
                        ) : (
                          <motion.button
                            type="button"
                            disabled
                            className="brutal-border bg-background text-muted-foreground cursor-not-allowed px-4 py-3 font-heading font-extrabold uppercase tracking-wide text-base md:text-lg inline-flex items-center justify-center text-center"
                          >
                            Registration Soon
                          </motion.button>
                        )}
                      </div>
                    </motion.div>
                  );
                })(),
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      <AnimatePresence>
        {activePoster && (
          <motion.div
            className="fixed inset-0 z-50 bg-foreground/70 p-4 md:p-8 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActivePoster(null)}
          >
            <motion.div
              className="w-fit max-w-[95vw] brutal-border bg-background p-3 md:p-4"
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              onClick={(clickEvent) => clickEvent.stopPropagation()}
            >
              <div
                className="flex items-center justify-between gap-3 mb-4"
                style={
                  posterRenderWidth
                    ? { width: `${posterRenderWidth}px` }
                    : undefined
                }
              >
                <h3
                  ref={posterTitleRef}
                  className={`font-heading font-extrabold uppercase leading-tight min-w-0 flex-1 break-words ${isPosterTitleCompact ? "text-sm md:text-base" : "text-lg md:text-2xl"}`}
                >
                  {activePoster.title} Poster
                </h3>
                <button
                  type="button"
                  onClick={() => setActivePoster(null)}
                  className="brutal-border px-3 py-2 font-heading font-bold text-xs uppercase hover:bg-foreground hover:text-background transition-colors"
                >
                  Close
                </button>
              </div>

              <div className="brutal-border overflow-hidden bg-background w-fit max-w-[92vw]">
                <img
                  src={activePoster.url}
                  alt={`${activePoster.title} poster`}
                  className="block w-auto h-auto max-w-[92vw] max-h-[78vh]"
                  onLoad={(loadEvent) => {
                    setPosterRenderWidth(loadEvent.currentTarget.clientWidth);
                  }}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {activeExternalRegistration && (
          <motion.div
            className="fixed inset-0 z-50 bg-foreground/70 p-4 md:p-8 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveExternalRegistration(null)}
          >
            <motion.div
              className="w-full max-w-5xl h-[85vh] brutal-border bg-background p-4 md:p-5 flex flex-col"
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              onClick={(clickEvent) => clickEvent.stopPropagation()}
            >
              <div className="flex items-start md:items-center justify-between gap-3 mb-4">
                <div>
                  <p className="font-heading font-bold text-xs uppercase tracking-wider text-muted-foreground mb-1">
                    External Registration
                  </p>
                  <h3 className="font-heading font-extrabold text-lg md:text-2xl leading-tight">
                    {activeExternalRegistration.title}
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={activeExternalRegistration.url}
                    target="_blank"
                    rel="noreferrer"
                    className="brutal-border px-3 py-2 font-heading font-bold text-xs uppercase hover:bg-foreground hover:text-background transition-colors"
                  >
                    Open in New Tab
                  </a>
                  <button
                    type="button"
                    onClick={() => setActiveExternalRegistration(null)}
                    className="brutal-border px-3 py-2 font-heading font-bold text-xs uppercase hover:bg-foreground hover:text-background transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>

              <div className="brutal-border overflow-hidden bg-background flex-1 min-h-0">
                <iframe
                  src={getEmbeddableRegistrationUrl(
                    activeExternalRegistration.url,
                  )}
                  title={`${activeExternalRegistration.title} registration form`}
                  className="w-full h-full"
                  loading="lazy"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {activeRegistrationEvent && (
          <motion.div
            className="fixed inset-0 z-50 bg-foreground/70 p-4 md:p-8 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              if (!isSubmittingRegistration) {
                setActiveRegistrationEvent(null);
              }
            }}
          >
            <motion.div
              className="w-full max-w-2xl brutal-border bg-background p-5 md:p-6"
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              onClick={(clickEvent) => clickEvent.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-4 mb-5">
                <div>
                  <p className="font-heading font-bold text-xs uppercase tracking-wider text-muted-foreground mb-2">
                    Internal Registration
                  </p>
                  <h3 className="font-heading font-extrabold text-xl md:text-2xl leading-tight">
                    {activeRegistrationEvent.title}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveRegistrationEvent(null)}
                  disabled={isSubmittingRegistration}
                  className="brutal-border px-3 py-2 font-heading font-bold text-xs uppercase hover:bg-foreground hover:text-background transition-colors disabled:opacity-60"
                >
                  Close
                </button>
              </div>

              <form className="space-y-4" onSubmit={handleRegistrationSubmit}>
                <div className="grid md:grid-cols-2 gap-3">
                  <input
                    required
                    value={registrationForm.fullName}
                    onChange={(changeEvent) =>
                      setRegistrationForm((prev) => ({
                        ...prev,
                        fullName: changeEvent.target.value,
                      }))
                    }
                    placeholder="Full Name"
                    className="w-full brutal-border px-3 py-3 bg-background font-body"
                  />
                  <input
                    required
                    type="email"
                    value={registrationForm.email}
                    onChange={(changeEvent) =>
                      setRegistrationForm((prev) => ({
                        ...prev,
                        email: changeEvent.target.value,
                      }))
                    }
                    placeholder="Email"
                    className="w-full brutal-border px-3 py-3 bg-background font-body"
                  />
                  <input
                    value={registrationForm.phone}
                    onChange={(changeEvent) =>
                      setRegistrationForm((prev) => ({
                        ...prev,
                        phone: changeEvent.target.value,
                      }))
                    }
                    placeholder="Phone Number"
                    className="w-full brutal-border px-3 py-3 bg-background font-body"
                  />
                  <input
                    value={registrationForm.college}
                    onChange={(changeEvent) =>
                      setRegistrationForm((prev) => ({
                        ...prev,
                        college: changeEvent.target.value,
                      }))
                    }
                    placeholder="College"
                    className="w-full brutal-border px-3 py-3 bg-background font-body"
                  />
                  <input
                    value={registrationForm.year}
                    onChange={(changeEvent) =>
                      setRegistrationForm((prev) => ({
                        ...prev,
                        year: changeEvent.target.value,
                      }))
                    }
                    placeholder="Year"
                    className="w-full brutal-border px-3 py-3 bg-background font-body"
                  />
                  <input
                    value={registrationForm.branch}
                    onChange={(changeEvent) =>
                      setRegistrationForm((prev) => ({
                        ...prev,
                        branch: changeEvent.target.value,
                      }))
                    }
                    placeholder="Branch"
                    className="w-full brutal-border px-3 py-3 bg-background font-body"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingRegistration}
                  className="brutal-btn-primary w-full text-center disabled:opacity-70"
                >
                  {isSubmittingRegistration
                    ? "Submitting..."
                    : "Submit Registration"}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Events;
