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

    const animateCount = (el) => {
      const target = +el.dataset.count;
      const suf = el.dataset.suffix || "";
      const dur = 1400;
      const t0 = performance.now();
      const step = (t) => {
        const p = Math.min((t - t0) / dur, 1);
        const e = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * e) + suf;
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };

    const items = [...root.querySelectorAll("[data-reveal], [data-count]")];

    // Safety net. `reveal-on` gates every [data-reveal] behind opacity:0, so
    // if the observer never delivers — an old engine, a restored scroll
    // position, a jump straight to a deep anchor — the page reads as blank.
    // Nothing is worth that, so a stalled reveal shows itself anyway.
    const bail = setTimeout(() => {
      root
        .querySelectorAll("[data-reveal]:not(.is-in)")
        .forEach((el) => el.classList.add("is-in"));
    }, 2200);

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const el = e.target;
          if (el.hasAttribute("data-reveal")) {
            const d = +(el.dataset.revealDelay || 0);
            setTimeout(() => el.classList.add("is-in"), d);
          }
          if (el.hasAttribute("data-count")) animateCount(el);
          io.unobserve(el);
        });
      },
      { threshold: 0.15 }
    );
    items.forEach((el) => io.observe(el));

    // Parallax is a desktop affordance. Below 900px the sections are short
    // and the drifting element is usually a decorative blob, so the drift
    // just walks it over the copy — and it costs a layout read per element
    // per scroll frame on the slowest devices.
    const narrow =
      window.matchMedia("(max-width: 900px)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const plx = narrow
      ? []
      : [...root.querySelectorAll("[data-parallax]")].map((el) => ({
          el,
          speed: +el.dataset.parallax,
        }));
    let raf = null;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = null;
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
      clearTimeout(bail);
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return rootRef;
}
