import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
} from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

type BeatWindow = {
  start: number;
  fullIn: number;
  fadeOutStart: number;
  end: number;
  fromY: number;
  toY: number;
};

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

const normalize = (value: number, start: number, end: number) => {
  if (end <= start) return 1;
  return clamp01((value - start) / (end - start));
};

const smoothstep = (value: number) => value * value * (3 - 2 * value);

const getBeatState = (progress: number, window: BeatWindow) => {
  if (progress < window.start || progress > window.end) {
    return { opacity: 0, y: window.fromY };
  }

  if (progress <= window.fullIn) {
    const t = smoothstep(normalize(progress, window.start, window.fullIn));
    return {
      opacity: t,
      y: window.fromY * (1 - t),
    };
  }

  if (progress < window.fadeOutStart) {
    return { opacity: 1, y: 0 };
  }

  const t = smoothstep(normalize(progress, window.fadeOutStart, window.end));
  return {
    opacity: 1 - t,
    y: window.toY * t,
  };
};

const getFinalBeatState = (
  progress: number,
  start: number,
  fullIn: number,
  fromY: number,
) => {
  if (progress < start) {
    return { opacity: 0, y: fromY };
  }

  if (progress <= fullIn) {
    const t = smoothstep(normalize(progress, start, fullIn));
    return {
      opacity: t,
      y: fromY * (1 - t),
    };
  }

  return { opacity: 1, y: 0 };
};

const HeroSection = () => {
  const rootRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const targetTimeRef = useRef(0);
  const durationRef = useRef(0);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [rawProgress, setRawProgress] = useState(0);

  const { scrollYProgress } = useScroll({
    target: rootRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 160,
    damping: 26,
    mass: 0.2,
  });

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const markLoaded = () => {
      if (!videoRef.current) return;
      if (Number.isFinite(videoRef.current.duration)) {
        durationRef.current = videoRef.current.duration;
      }
      setVideoLoaded(videoRef.current.readyState >= 1);
    };

    video.addEventListener("canplay", markLoaded);
    video.addEventListener("loadedmetadata", markLoaded);
    video.addEventListener("loadeddata", markLoaded);
    video.addEventListener("durationchange", markLoaded);

    // Handle cache-hit case where metadata is already available.
    if (video.readyState >= 1) {
      markLoaded();
    }

    return () => {
      video.removeEventListener("canplay", markLoaded);
      video.removeEventListener("loadedmetadata", markLoaded);
      video.removeEventListener("loadeddata", markLoaded);
      video.removeEventListener("durationchange", markLoaded);
    };
  }, []);

  useMotionValueEvent(smoothProgress, "change", (value) => {
    const clamped = clamp01(value);
    setRawProgress(clamped);

    if (!videoLoaded || durationRef.current <= 0 || !videoRef.current) {
      return;
    }

    targetTimeRef.current = clamped * durationRef.current;

    if (rafRef.current !== null) {
      return;
    }

    rafRef.current = window.requestAnimationFrame(() => {
      rafRef.current = null;
      const video = videoRef.current;
      if (!video) return;

      const nextTime = targetTimeRef.current;
      if (Math.abs(video.currentTime - nextTime) > 0.016) {
        video.currentTime = nextTime;
      }
    });
  });

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  const beat1 = getBeatState(rawProgress, {
    start: -0.02,
    fullIn: 0,
    fadeOutStart: 0.1,
    end: 0.15,
    fromY: 0,
    toY: -50,
  });

  const beat2 = getBeatState(rawProgress, {
    start: 0.15,
    fullIn: 0.2,
    fadeOutStart: 0.4,
    end: 0.45,
    fromY: 50,
    toY: -50,
  });

  const beat3 = getBeatState(rawProgress, {
    start: 0.45,
    fullIn: 0.5,
    fadeOutStart: 0.65,
    end: 0.7,
    fromY: 50,
    toY: -50,
  });

  const beat4 = getBeatState(rawProgress, {
    start: 0.7,
    fullIn: 0.75,
    fadeOutStart: 0.8,
    end: 0.85,
    fromY: 50,
    toY: -50,
  });

  const beat5 = getFinalBeatState(rawProgress, 0.85, 0.9, 50);
  const endLogoShift = smoothstep(normalize(rawProgress, 0.82, 0.92));
  const videoObjectPosition = `${50 + endLogoShift * 20}% center`;
  const endVideoTranslateX = endLogoShift * 18;
  const endVideoScale = 1 - endLogoShift * 0.08;

  return (
    <section ref={rootRef} className="relative h-[400vh]">
      <div
        className="sticky top-0 h-screen overflow-hidden border-b-[3px] border-foreground"
        style={{ backgroundColor: "#111A2C" }}
      >
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          style={{
            objectPosition: videoObjectPosition,
            transform: `translateX(${endVideoTranslateX}%) scale(${endVideoScale})`,
            transformOrigin: "center center",
          }}
          src="/optimized-hero.mp4"
          muted
          playsInline
          preload="auto"
          disablePictureInPicture
          aria-label="IEEE CS 3D logo animation"
        />

        <div className="absolute inset-0 z-10 pointer-events-none text-white">
          <motion.div
            className="absolute inset-0 flex items-center justify-center px-6 text-center"
            style={{ opacity: beat1.opacity, y: beat1.y }}
          >
            <div className="max-w-5xl">
              <h1 className="text-5xl md:text-7xl font-heading font-extrabold leading-[0.95]">
                IEEE <span className="text-primary">Computer Society</span>
              </h1>
            </div>
          </motion.div>

          <motion.div
            className="absolute inset-0 flex items-center justify-start px-6 md:px-14"
            style={{ opacity: beat2.opacity, y: beat2.y }}
          >
            <div className="max-w-3xl text-left">
              <h2 className="text-3xl md:text-5xl font-heading font-extrabold leading-tight">
                <span className="text-primary">Build.</span> Learn. Lead.
              </h2>
            </div>
          </motion.div>

          <motion.div
            className="absolute inset-0 flex items-center justify-end px-6 md:px-14"
            style={{ opacity: beat3.opacity, y: beat3.y }}
          >
            <div className="max-w-3xl text-right">
              <h2 className="text-3xl md:text-5xl font-heading font-extrabold leading-tight">
                Workshops. <span className="text-primary">Hackathons.</span>{" "}
                Impact.
              </h2>
            </div>
          </motion.div>

          <motion.div
            className="absolute inset-0 flex items-center justify-center px-6 text-center"
            style={{ opacity: beat4.opacity, y: beat4.y }}
          >
            <div className="max-w-4xl">
              <h2 className="text-3xl md:text-5xl font-heading font-extrabold leading-tight">
                Join the <span className="text-primary">Chapter</span>.
              </h2>
            </div>
          </motion.div>

          <motion.div
            className="absolute inset-0 flex items-center px-6 md:px-12 pointer-events-auto"
            style={{ opacity: beat5.opacity, y: beat5.y }}
          >
            <div className="w-full max-w-5xl md:max-w-[56%] lg:max-w-[52%]">
              <div className="inline-block brutal-border bg-primary px-3 py-1.5 mb-5">
                <span className="font-heading font-extrabold text-primary-foreground text-xs uppercase tracking-widest">
                  Student Chapter
                </span>
              </div>

              <div className="max-w-3xl mb-5 overflow-hidden">
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-heading font-extrabold leading-[0.95]">
                  IEEE Computer Society -
                </h1>
                <span className="block text-3xl md:text-5xl lg:text-6xl font-heading font-extrabold leading-[0.95] text-primary">
                  Nirma University
                </span>
              </div>

              <div className="line-accent w-16 mb-6" />

              <p className="text-base md:text-xl font-body max-w-lg mb-7 text-white/85">
                Empowering innovation, technology, and future engineers.
              </p>

              <div className="flex flex-wrap gap-3">
                <Link
                  to="/events"
                  className="brutal-btn-primary inline-flex items-center gap-2 text-sm md:text-base"
                >
                  Explore Events <ArrowRight size={18} />
                </Link>
                <a
                  href="#"
                  className="brutal-btn-secondary text-sm md:text-base"
                >
                  Join IEEE
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
