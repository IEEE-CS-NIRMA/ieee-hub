import { useCallback, useEffect, useMemo, useRef } from "react";
import { useGesture } from "@use-gesture/react";
import "./dome-gallery.css";

type GalleryImage = { src: string; alt?: string };

type DomeGalleryProps = {
  images?: GalleryImage[];
  fit?: number;
  fitBasis?: "auto" | "min" | "max" | "width" | "height";
  minRadius?: number;
  maxRadius?: number;
  padFactor?: number;
  overlayBlurColor?: string;
  maxVerticalRotationDeg?: number;
  dragSensitivity?: number;
  enlargeTransitionMs?: number;
  segments?: number;
  dragDampening?: number;
  openedImageWidth?: string;
  openedImageHeight?: string;
  imageBorderRadius?: string;
  openedImageBorderRadius?: string;
  grayscale?: boolean;
};

const DEFAULT_IMAGES: GalleryImage[] = [
  {
    src: "https://images.unsplash.com/photo-1755331039789-7e5680e26e8f?q=80&w=774&auto=format&fit=crop",
    alt: "Abstract art",
  },
  {
    src: "https://images.unsplash.com/photo-1755569309049-98410b94f66d?q=80&w=772&auto=format&fit=crop",
    alt: "Modern sculpture",
  },
  {
    src: "https://images.unsplash.com/photo-1755497595318-7e5e3523854f?q=80&w=774&auto=format&fit=crop",
    alt: "Digital artwork",
  },
  {
    src: "https://images.unsplash.com/photo-1755353985163-c2a0fe5ac3d8?q=80&w=774&auto=format&fit=crop",
    alt: "Contemporary art",
  },
  {
    src: "https://images.unsplash.com/photo-1745965976680-d00be7dc0377?q=80&w=774&auto=format&fit=crop",
    alt: "Geometric pattern",
  },
  {
    src: "https://images.unsplash.com/photo-1752588975228-21f44630bb3c?q=80&w=774&auto=format&fit=crop",
    alt: "Textured surface",
  },
  {
    src: "https://pbs.twimg.com/media/Gyla7NnXMAAXSo_?format=jpg&name=large",
    alt: "Social media image",
  },
];

const DEFAULTS = {
  maxVerticalRotationDeg: 5,
  dragSensitivity: 20,
  enlargeTransitionMs: 300,
  segments: 35,
};

const clamp = (v: number, min: number, max: number) =>
  Math.min(Math.max(v, min), max);
const normalizeAngle = (d: number) => ((d % 360) + 360) % 360;
const wrapAngleSigned = (deg: number) => {
  const a = (((deg + 180) % 360) + 360) % 360;
  return a - 180;
};

const getDataNumber = (el: HTMLElement, name: string, fallback: number) => {
  const dataKey = name
    .replace(/-([a-z])/g, (_, c: string) => c.toUpperCase())
    .replace(/^data/, "");
  const attr =
    (el.dataset as Record<string, string | undefined>)[dataKey] ??
    el.getAttribute(`data-${name}`);
  const n = attr == null ? Number.NaN : parseFloat(attr);
  return Number.isFinite(n) ? n : fallback;
};

const buildItems = (pool: GalleryImage[], seg: number) => {
  const xCols = Array.from({ length: seg }, (_, i) => -37 + i * 2);
  const evenYs = [-4, -2, 0, 2, 4];
  const oddYs = [-3, -1, 1, 3, 5];

  const coords = xCols.flatMap((x, c) => {
    const ys = c % 2 === 0 ? evenYs : oddYs;
    return ys.map((y) => ({ x, y, sizeX: 2, sizeY: 2 }));
  });

  const totalSlots = coords.length;
  const normalizedImages = pool.length > 0 ? pool : DEFAULT_IMAGES;

  const shuffle = <T,>(input: T[]) => {
    const arr = [...input];
    for (let i = arr.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  const usedImages: GalleryImage[] = [];
  let deck = shuffle(normalizedImages);
  let deckIndex = 0;

  for (let i = 0; i < totalSlots; i += 1) {
    if (deckIndex >= deck.length) {
      deck = shuffle(normalizedImages);
      deckIndex = 0;
    }

    let candidate = deck[deckIndex];

    if (
      normalizedImages.length > 1 &&
      usedImages.length > 0 &&
      candidate.src === usedImages[usedImages.length - 1].src
    ) {
      const nextIndex = (deckIndex + 1) % deck.length;
      candidate = deck[nextIndex];
      deck[nextIndex] = deck[deckIndex];
      deck[deckIndex] = candidate;
    }

    usedImages.push(candidate);
    deckIndex += 1;
  }

  return coords.map((c, i) => ({
    ...c,
    src: usedImages[i].src,
    alt: usedImages[i].alt ?? "",
  }));
};

const computeItemBaseRotation = (
  offsetX: number,
  offsetY: number,
  sizeX: number,
  sizeY: number,
  segments: number,
) => {
  const unit = 360 / segments / 2;
  const rotateY = unit * (offsetX + (sizeX - 1) / 2);
  const rotateX = unit * (offsetY - (sizeY - 1) / 2);
  return { rotateX, rotateY };
};

const DomeGallery = ({
  images = DEFAULT_IMAGES,
  fit = 0.5,
  fitBasis = "auto",
  minRadius = 600,
  maxRadius = Number.POSITIVE_INFINITY,
  padFactor = 0.25,
  overlayBlurColor = "#060010",
  maxVerticalRotationDeg = DEFAULTS.maxVerticalRotationDeg,
  dragSensitivity = DEFAULTS.dragSensitivity,
  enlargeTransitionMs = DEFAULTS.enlargeTransitionMs,
  segments = DEFAULTS.segments,
  dragDampening = 2,
  openedImageWidth = "250px",
  openedImageHeight = "350px",
  imageBorderRadius = "30px",
  openedImageBorderRadius = "30px",
  grayscale = true,
}: DomeGalleryProps) => {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const mainRef = useRef<HTMLElement | null>(null);
  const sphereRef = useRef<HTMLDivElement | null>(null);
  const frameRef = useRef<HTMLDivElement | null>(null);
  const viewerRef = useRef<HTMLDivElement | null>(null);
  const scrimRef = useRef<HTMLDivElement | null>(null);
  const focusedElRef = useRef<HTMLDivElement | null>(null);
  const originalTilePositionRef = useRef<{
    left: number;
    top: number;
    width: number;
    height: number;
  } | null>(null);

  const rotationRef = useRef({ x: 0, y: 0 });
  const startRotRef = useRef({ x: 0, y: 0 });
  const startPosRef = useRef<{ x: number; y: number } | null>(null);
  const draggingRef = useRef(false);
  const movedRef = useRef(false);
  const inertiaRAF = useRef<number | null>(null);
  const autoRotateRAF = useRef<number | null>(null);
  const openingRef = useRef(false);
  const openStartedAtRef = useRef(0);
  const lastDragEndAt = useRef(0);
  const scrollLockedRef = useRef(false);

  const lockScroll = useCallback(() => {
    if (scrollLockedRef.current) return;
    scrollLockedRef.current = true;
    document.body.classList.add("dg-scroll-lock");
  }, []);

  const unlockScroll = useCallback(() => {
    if (!scrollLockedRef.current) return;
    if (rootRef.current?.getAttribute("data-enlarging") === "true") return;
    scrollLockedRef.current = false;
    document.body.classList.remove("dg-scroll-lock");
  }, []);

  const items = useMemo(() => buildItems(images, segments), [images, segments]);

  const applyTransform = (xDeg: number, yDeg: number) => {
    const el = sphereRef.current;
    if (el) {
      el.style.transform = `translateZ(calc(var(--radius) * -1)) rotateX(${xDeg}deg) rotateY(${yDeg}deg)`;
    }
  };

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const ro = new ResizeObserver((entries) => {
      const cr = entries[0].contentRect;
      const w = Math.max(1, cr.width);
      const h = Math.max(1, cr.height);
      const minDim = Math.min(w, h);
      const maxDim = Math.max(w, h);
      const aspect = w / h;

      let basis: number;
      switch (fitBasis) {
        case "min":
          basis = minDim;
          break;
        case "max":
          basis = maxDim;
          break;
        case "width":
          basis = w;
          break;
        case "height":
          basis = h;
          break;
        default:
          basis = aspect >= 1.3 ? w : minDim;
      }

      let radius = basis * fit;
      radius = Math.min(radius, h * 1.35);
      radius = clamp(radius, minRadius, maxRadius);

      root.style.setProperty("--radius", `${Math.round(radius)}px`);
      root.style.setProperty(
        "--viewer-pad",
        `${Math.max(8, Math.round(minDim * padFactor))}px`,
      );
      root.style.setProperty("--overlay-blur-color", overlayBlurColor);
      root.style.setProperty("--tile-radius", imageBorderRadius);
      root.style.setProperty("--enlarge-radius", openedImageBorderRadius);
      root.style.setProperty(
        "--image-filter",
        grayscale ? "grayscale(1)" : "none",
      );
      applyTransform(rotationRef.current.x, rotationRef.current.y);
    });

    ro.observe(root);
    return () => ro.disconnect();
  }, [
    fit,
    fitBasis,
    minRadius,
    maxRadius,
    padFactor,
    overlayBlurColor,
    grayscale,
    imageBorderRadius,
    openedImageBorderRadius,
  ]);

  const stopInertia = useCallback(() => {
    if (inertiaRAF.current) {
      cancelAnimationFrame(inertiaRAF.current);
      inertiaRAF.current = null;
    }
  }, []);

  const startInertia = useCallback(
    (vx: number, vy: number) => {
      const MAX_V = 1.4;
      let vX = clamp(vx, -MAX_V, MAX_V) * 80;
      let vY = clamp(vy, -MAX_V, MAX_V) * 80;
      let frames = 0;
      const d = clamp(dragDampening ?? 2, 0.2, 4);
      const frictionMul = clamp(0.9 + d * 0.025, 0.9, 0.99);
      const stopThreshold = clamp(0.03 - d * 0.005, 0.005, 0.03);
      const maxFrames = Math.round(70 + d * 80);

      const step = () => {
        vX *= frictionMul;
        vY *= frictionMul;
        if (Math.abs(vX) < stopThreshold && Math.abs(vY) < stopThreshold) {
          inertiaRAF.current = null;
          return;
        }
        if (++frames > maxFrames) {
          inertiaRAF.current = null;
          return;
        }
        const nextX = clamp(
          rotationRef.current.x - vY / 200,
          -maxVerticalRotationDeg,
          maxVerticalRotationDeg,
        );
        const nextY = wrapAngleSigned(rotationRef.current.y + vX / 200);
        rotationRef.current = { x: nextX, y: nextY };
        applyTransform(nextX, nextY);
        inertiaRAF.current = requestAnimationFrame(step);
      };

      stopInertia();
      inertiaRAF.current = requestAnimationFrame(step);
    },
    [dragDampening, maxVerticalRotationDeg, stopInertia],
  );

  useGesture(
    {
      onDragStart: ({ event }) => {
        if (focusedElRef.current) return;
        stopInertia();
        const evt = event as PointerEvent;
        draggingRef.current = true;
        movedRef.current = false;
        startRotRef.current = { ...rotationRef.current };
        startPosRef.current = { x: evt.clientX, y: evt.clientY };
      },
      onDrag: ({
        event,
        last,
        velocity = [0, 0],
        direction = [0, 0],
        movement,
      }) => {
        if (
          focusedElRef.current ||
          !draggingRef.current ||
          !startPosRef.current
        )
          return;
        const evt = event as PointerEvent;
        const dxTotal = evt.clientX - startPosRef.current.x;
        const dyTotal = evt.clientY - startPosRef.current.y;

        if (!movedRef.current && dxTotal * dxTotal + dyTotal * dyTotal > 16) {
          movedRef.current = true;
        }

        const nextX = clamp(
          startRotRef.current.x - dyTotal / dragSensitivity,
          -maxVerticalRotationDeg,
          maxVerticalRotationDeg,
        );
        const nextY = wrapAngleSigned(
          startRotRef.current.y + dxTotal / dragSensitivity,
        );
        rotationRef.current = { x: nextX, y: nextY };
        applyTransform(nextX, nextY);

        if (last) {
          draggingRef.current = false;
          const [vMagX, vMagY] = velocity;
          const [dirX, dirY] = direction;
          let vx = vMagX * dirX;
          let vy = vMagY * dirY;
          if (
            Math.abs(vx) < 0.001 &&
            Math.abs(vy) < 0.001 &&
            Array.isArray(movement)
          ) {
            const [mx, my] = movement;
            vx = clamp((mx / dragSensitivity) * 0.02, -1.2, 1.2);
            vy = clamp((my / dragSensitivity) * 0.02, -1.2, 1.2);
          }
          if (Math.abs(vx) > 0.005 || Math.abs(vy) > 0.005)
            startInertia(vx, vy);
          if (movedRef.current) lastDragEndAt.current = performance.now();
          movedRef.current = false;
        }
      },
    },
    { target: mainRef, eventOptions: { passive: true } },
  );

  const closeFocused = useCallback(() => {
    const el = focusedElRef.current;
    if (!el) return;

    const parent = el.parentElement;
    const overlay =
      viewerRef.current?.querySelector<HTMLDivElement>(".enlarge");
    if (!parent || !overlay) return;

    overlay.remove();
    parent.style.setProperty("--rot-y-delta", "0deg");
    parent.style.setProperty("--rot-x-delta", "0deg");
    el.style.visibility = "";
    el.style.zIndex = "0";
    focusedElRef.current = null;
    rootRef.current?.removeAttribute("data-enlarging");
    openingRef.current = false;
    unlockScroll();
  }, [unlockScroll]);

  useEffect(() => {
    const scrim = scrimRef.current;
    if (!scrim) return;

    const onScrimClick = () => {
      if (performance.now() - openStartedAtRef.current < 220) return;
      closeFocused();
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeFocused();
    };

    scrim.addEventListener("click", onScrimClick);
    window.addEventListener("keydown", onKey);

    return () => {
      scrim.removeEventListener("click", onScrimClick);
      window.removeEventListener("keydown", onKey);
    };
  }, [closeFocused]);

  const openItemFromElement = useCallback(
    (el: HTMLDivElement) => {
      if (openingRef.current) return;
      openingRef.current = true;
      openStartedAtRef.current = performance.now();
      lockScroll();

      const parent = el.parentElement;
      if (
        !parent ||
        !frameRef.current ||
        !mainRef.current ||
        !viewerRef.current
      ) {
        openingRef.current = false;
        unlockScroll();
        return;
      }

      focusedElRef.current = el;
      const offsetX = getDataNumber(parent as HTMLElement, "offset-x", 0);
      const offsetY = getDataNumber(parent as HTMLElement, "offset-y", 0);
      const sizeX = getDataNumber(parent as HTMLElement, "size-x", 2);
      const sizeY = getDataNumber(parent as HTMLElement, "size-y", 2);
      const parentRot = computeItemBaseRotation(
        offsetX,
        offsetY,
        sizeX,
        sizeY,
        segments,
      );

      const parentY = normalizeAngle(parentRot.rotateY);
      const globalY = normalizeAngle(rotationRef.current.y);
      let rotY = -(parentY + globalY) % 360;
      if (rotY < -180) rotY += 360;
      const rotX = -parentRot.rotateX - rotationRef.current.x;

      (parent as HTMLElement).style.setProperty("--rot-y-delta", `${rotY}deg`);
      (parent as HTMLElement).style.setProperty("--rot-x-delta", `${rotX}deg`);

      const tileR = el.getBoundingClientRect();
      const mainR = mainRef.current.getBoundingClientRect();
      const frameR = frameRef.current.getBoundingClientRect();

      originalTilePositionRef.current = {
        left: tileR.left,
        top: tileR.top,
        width: tileR.width,
        height: tileR.height,
      };

      el.style.visibility = "hidden";
      const overlay = document.createElement("div");
      overlay.className = "enlarge";

      const applyDynamicSize = (aspectRatio: number) => {
        const safeRatio =
          Number.isFinite(aspectRatio) && aspectRatio > 0
            ? aspectRatio
            : tileR.width / tileR.height;
        const OPEN_SCALE = 4;
        const boxWidth = tileR.width * OPEN_SCALE;
        const boxHeight = tileR.height * OPEN_SCALE;

        let targetWidth = boxWidth;
        let targetHeight = targetWidth / safeRatio;

        if (targetHeight > boxHeight) {
          targetHeight = boxHeight;
          targetWidth = targetHeight * safeRatio;
        }

        const centeredLeft = (mainR.width - targetWidth) / 2;
        const centeredTop = (mainR.height - targetHeight) / 2;

        overlay.style.left = `${centeredLeft}px`;
        overlay.style.top = `${centeredTop}px`;
        overlay.style.width = `${targetWidth}px`;
        overlay.style.height = `${targetHeight}px`;
      };

      applyDynamicSize(tileR.width / tileR.height);
      overlay.style.opacity = "0";
      overlay.style.transform = "scale(0.9)";
      overlay.style.transition = `opacity ${enlargeTransitionMs}ms ease, transform ${enlargeTransitionMs}ms cubic-bezier(0.16, 1, 0.3, 1)`;

      const img = document.createElement("img");
      img.src =
        (parent as HTMLElement).dataset.src ||
        el.querySelector("img")?.src ||
        "";
      img.alt = el.getAttribute("aria-label") || "Opened image";

      const updateFromNaturalSize = () => {
        if (img.naturalWidth > 0 && img.naturalHeight > 0) {
          applyDynamicSize(img.naturalWidth / img.naturalHeight);
        }
      };

      if (img.complete) {
        updateFromNaturalSize();
      } else {
        img.addEventListener("load", updateFromNaturalSize, { once: true });
      }

      overlay.appendChild(img);

      viewerRef.current.appendChild(overlay);

      requestAnimationFrame(() => {
        overlay.style.opacity = "1";
        overlay.style.transform = "scale(1)";
        rootRef.current?.setAttribute("data-enlarging", "true");
      });
    },
    [
      enlargeTransitionMs,
      lockScroll,
      openedImageHeight,
      openedImageWidth,
      segments,
      unlockScroll,
    ],
  );

  const onTileClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (draggingRef.current || movedRef.current) return;
      if (performance.now() - lastDragEndAt.current < 80) return;
      openItemFromElement(e.currentTarget);
    },
    [openItemFromElement],
  );

  useEffect(() => {
    return () => {
      document.body.classList.remove("dg-scroll-lock");
    };
  }, []);

  useEffect(() => {
    const AUTO_ROTATE_DEG_PER_SEC = 4;
    let lastTs = 0;

    const tick = (ts: number) => {
      if (!lastTs) lastTs = ts;
      const deltaSec = (ts - lastTs) / 1000;
      lastTs = ts;

      const isEnlarged =
        rootRef.current?.getAttribute("data-enlarging") === "true";
      const idle =
        !draggingRef.current &&
        !openingRef.current &&
        !focusedElRef.current &&
        !isEnlarged &&
        inertiaRAF.current === null;

      if (idle && deltaSec > 0) {
        const nextY = wrapAngleSigned(
          rotationRef.current.y + AUTO_ROTATE_DEG_PER_SEC * deltaSec,
        );
        rotationRef.current = { x: rotationRef.current.x, y: nextY };
        applyTransform(rotationRef.current.x, nextY);
      }

      autoRotateRAF.current = requestAnimationFrame(tick);
    };

    autoRotateRAF.current = requestAnimationFrame(tick);

    return () => {
      if (autoRotateRAF.current) {
        cancelAnimationFrame(autoRotateRAF.current);
        autoRotateRAF.current = null;
      }
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className="sphere-root"
      style={
        {
          "--segments-x": segments,
          "--segments-y": segments,
          "--overlay-blur-color": overlayBlurColor,
          "--tile-radius": imageBorderRadius,
          "--enlarge-radius": openedImageBorderRadius,
          "--image-filter": grayscale ? "grayscale(1)" : "none",
        } as React.CSSProperties
      }
    >
      <main ref={mainRef} className="sphere-main">
        <div className="stage">
          <div ref={sphereRef} className="sphere">
            {items.map((it, i) => (
              <div
                key={`${it.x},${it.y},${i}`}
                className="item"
                data-src={it.src}
                data-offset-x={it.x}
                data-offset-y={it.y}
                data-size-x={it.sizeX}
                data-size-y={it.sizeY}
                style={
                  {
                    "--offset-x": it.x,
                    "--offset-y": it.y,
                    "--item-size-x": it.sizeX,
                    "--item-size-y": it.sizeY,
                  } as React.CSSProperties
                }
              >
                <div
                  className="item__image"
                  role="button"
                  tabIndex={0}
                  aria-label={it.alt || "Open image"}
                  onClick={onTileClick}
                >
                  <img src={it.src} draggable={false} alt={it.alt} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="viewer" ref={viewerRef}>
          <div ref={scrimRef} className="scrim" />
          <div ref={frameRef} className="frame" />
        </div>
      </main>
    </div>
  );
};

export default DomeGallery;
