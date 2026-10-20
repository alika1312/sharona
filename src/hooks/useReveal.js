import { useEffect, useRef } from "react";

// Progressive-enhancement scroll choreography shared by all pages.
// Content is fully visible without JS; only once this runs do we add
// `reveal-on` (which hides [data-reveal] until it scrolls into view).
// Also drives [data-count] count-up numbers and [data-parallax] drift.
export function useReveal() {
  const rootRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    root.classList.add("reveal-on");
    // Everything scheduled below is tracked so leaving the page cancels it,
    // instead of letting it fire against a detached tree.
    const timers = new Set();
    const frames = new Set();
    const later = (fn, ms) => {
      const t = setTimeout(() => {
        timers.delete(t);
        fn();
      }, ms);
      timers.add(t);
    };
    const nextFrame = (fn) => {
      const f = requestAnimationFrame((t) => {
        frames.delete(f);
        fn(t);
      });
      frames.add(f);
    };

    const animateCount = (el) => {
      const target = +el.dataset.count;
      const suf = el.dataset.suffix || "";
      const dur = 1400;
      const t0 = performance.now();
      const step = (t) => {
        const p = Math.min((t - t0) / dur, 1);
        const e = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * e) + suf;
        if (p < 1) nextFrame(step);
      };
      nextFrame(step);
    };

    const items = [...root.querySelectorAll("[data-reveal], [data-count]")];
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const el = e.target;
          if (el.hasAttribute("data-reveal")) {
            const d = +(el.dataset.revealDelay || 0);
            later(() => el.classList.add("is-in"), d);
          }
          if (el.hasAttribute("data-count")) animateCount(el);
          io.unobserve(el);
        });
      },
      { threshold: 0.15 }
    );
    items.forEach((el) => io.observe(el));

    const plx = [...root.querySelectorAll("[data-parallax]")].map((el) => ({
      el,
      speed: +el.dataset.parallax,
    }));
    let pending = false;
    const onScroll = () => {
      if (pending) return;
      pending = true;
      nextFrame(() => {
        pending = false;
        const vh = window.innerHeight;
        plx.forEach(({ el, speed }) => {
          const r = el.getBoundingClientRect();
          const c = r.top + r.height / 2 - vh / 2;
          el.style.transform = `translateY(${(c * speed).toFixed(1)}px)`;
        });
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      timers.forEach(clearTimeout);
      frames.forEach(cancelAnimationFrame);
    };
  }, []);

  return rootRef;
}
