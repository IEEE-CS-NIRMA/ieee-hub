import { useEffect, useRef, useState } from "react";
import {
  MotionValue,
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
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

const useBeatMotion = (progress: MotionValue<number>, window: BeatWindow) => {
  const opacity = useTransform(
    progress,
    (value) => getBeatState(clamp01(value), window).opacity,
  );
  const y = useTransform(
    progress,
    (value) => getBeatState(clamp01(value), window).y,
  );
  return { opacity, y };
};

const useFinalBeatMotion = (
  progress: MotionValue<number>,
  start: number,
  fullIn: number,
  fromY: number,
) => {
  const opacity = useTransform(
    progress,
    (value) => getFinalBeatState(clamp01(value), start, fullIn, fromY).opacity,
  );
  const y = useTransform(
    progress,
    (value) => getFinalBeatState(clamp01(value), start, fullIn, fromY).y,
  );
  return { opacity, y };
};

type NavigatorWithHints = Navigator & {
  deviceMemory?: number;
  connection?: {
    saveData?: boolean;
    effectiveType?: string;
  };
};

const HeroSection = () => {
  const rootRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastSeekAtRef = useRef(0);
  const targetTimeRef = useRef(0);
  const durationRef = useRef(0);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [isLowPowerMode, setIsLowPowerMode] = useState(false);
  const [videoSrc, setVideoSrc] = useState("/optimized-hero-lite.mp4");

  const scheduleScrub = () => {
    if (rafRef.current !== null) {
      return;
    }

    const tick = () => {
      const video = videoRef.current;
      if (!video || !videoLoaded || durationRef.current <= 0) {
        rafRef.current = null;
        return;
      }

      const now = performance.now();
      const minSeekIntervalMs = isLowPowerMode ? 58 : 40;
      const frameStep = isLowPowerMode ? 1 / 12 : 1 / 18;
      const settleThreshold = isLowPowerMode ? 0.1 : 0.065;

      const currentTime = video.currentTime;
      const targetTime = targetTimeRef.current;
      const diff = targetTime - currentTime;

      if (Math.abs(diff) <= settleThreshold) {
        rafRef.current = null;
        return;
      }

      if (now - lastSeekAtRef.current >= minSeekIntervalMs) {
        const maxStep = isLowPowerMode ? 0.1 : 0.14;
        const nextTime =
          currentTime + Math.sign(diff) * Math.min(Math.abs(diff), maxStep);
        const quantizedTime = Math.round(nextTime / frameStep) * frameStep;

        if (typeof video.fastSeek === "function") {
          video.fastSeek(quantizedTime);
        } else {
          video.currentTime = quantizedTime;
        }

        lastSeekAtRef.current = now;
      }

      rafRef.current = window.requestAnimationFrame(tick);
    };

    rafRef.current = window.requestAnimationFrame(tick);
  };

  const { scrollYProgress } = useScroll({
    target: rootRef,
    offset: ["start start", "end end"],
  });

  useEffect(() => {
    const nav = navigator as NavigatorWithHints;
    const cpuCores = nav.hardwareConcurrency ?? 8;
    const memoryGb = nav.deviceMemory ?? 8;
    const connectionType = nav.connection?.effectiveType;
    const isSafari =
      /^((?!chrome|android).)*safari/i.test(nav.userAgent) &&
      !/crios|fxios|edgios/i.test(nav.userAgent);
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const lowCpu = cpuCores <= 8;
    const lowMemory = memoryGb <= 8;
    const saveData = nav.connection?.saveData === true;
    const slowNetwork = connectionType === "2g" || connectionType === "3g";

    const lowPower =
      reducedMotion ||
      lowCpu ||
      lowMemory ||
      saveData ||
      slowNetwork ||
      isSafari;
    setIsLowPowerMode(lowPower);
    setVideoSrc(lowPower ? "/optimized-hero-lite.mp4" : "/optimized-hero.mp4");

    const video = videoRef.current;
    if (!video) return;

    const markLoaded = () => {
      if (!videoRef.current) return;
      if (Number.isFinite(videoRef.current.duration)) {
        durationRef.current = videoRef.current.duration;
      }
      setVideoLoaded(videoRef.current.readyState >= 2);
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

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    setVideoLoaded(false);
    durationRef.current = 0;
    video.load();
  }, [videoSrc]);

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    const clamped = clamp01(value);

    if (!videoLoaded || durationRef.current <= 0 || !videoRef.current) {
      return;
    }

    targetTimeRef.current = clamped * durationRef.current;

    scheduleScrub();
  });

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  const beat1 = useBeatMotion(scrollYProgress, {
    start: -0.02,
    fullIn: 0,
    fadeOutStart: 0.1,
    end: 0.15,
    fromY: 0,
    toY: -50,
  });

  const beat2 = useBeatMotion(scrollYProgress, {
    start: 0.15,
    fullIn: 0.2,
    fadeOutStart: 0.4,
    end: 0.45,
    fromY: 50,
    toY: -50,
  });

  const beat3 = useBeatMotion(scrollYProgress, {
    start: 0.45,
    fullIn: 0.5,
    fadeOutStart: 0.65,
    end: 0.7,
    fromY: 50,
    toY: -50,
  });

  const beat4 = useBeatMotion(scrollYProgress, {
    start: 0.7,
    fullIn: 0.75,
    fadeOutStart: 0.8,
    end: 0.85,
    fromY: 50,
    toY: -50,
  });

  const beat5 = useFinalBeatMotion(scrollYProgress, 0.85, 0.9, 50);

  return (
    <section ref={rootRef} className="relative h-[400vh]">
      <div
        className="sticky top-0 h-screen overflow-hidden border-b-[3px] border-foreground"
        style={{ backgroundColor: "#111A2C" }}
      >
        <motion.video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          style={{
            objectPosition: "center center",
            transform: "translateZ(0)",
            willChange: "transform",
          }}
          src={videoSrc}
          muted
          playsInline
          preload="auto"
          disablePictureInPicture
          onError={() => {
            if (videoSrc === "/optimized-hero-lite.mp4") {
              setVideoSrc("/optimized-hero.mp4");
            }
          }}
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
