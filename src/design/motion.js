// Homepage motion controller — ported from the Claude Design "Kinetic"
// handoff (the <script type="text/x-dc"> component in the Sharona Kinetic
// canvas).
//
// It is a single requestAnimationFrame loop that reads scroll/pointer state
// once per frame and writes transforms. Everything is progressive
// enhancement: the markup ships fully visible, and `prime()` is what hides
// the animated bits — so without JS (and for crawlers) the page still reads
// as plain, complete content.
//
// Scroll choreography works off `[data-pin-sec]` sections: each is a tall
// block whose `[data-pin-inner]` is `position:sticky`, so its progress
// through the viewport (0→1) becomes the timeline for that section. Sections
// whose content is too tall scale down to fit (see measurePins); only when
// even that would be too small do they unpin and fall back to normal flow.
//
// On top of that, Kinetic adds section snapping: scrolling into the seam
// between two sections latches there, the locked section leans toward its
// exit as you keep pushing, and past a threshold the page hard-cuts to the
// next one. Desktop + fine pointer + no reduced-motion only.

const CB = "cubic-bezier(.2,.7,.2,1)";

export function createHomeMotion(root, props = {}) {
  const m = new HomeMotion(root, props);
  m.mount();
  return m;
}

class HomeMotion {
  constructor(root, props) {
    this.root = root;
    this.props = props;
    this.timers = [];
  }

  q(s) {
    return this.root.querySelector(s);
  }
  qa(s) {
    return [...this.root.querySelectorAll(s)];
  }
  cl(v, a, b) {
    return v < a ? a : v > b ? b : v;
  }
  later(fn, ms) {
    this.timers.push(setTimeout(fn, ms));
  }
  seg(p, a, b) {
    return this.cl((p - a) / (b - a || 1), 0, 1);
  }
  es(t) {
    return t * t * (3 - 2 * t);
  }
  mix(a, b, t) {
    return a + (b - a) * t;
  }
  prog(y) {
    const h = document.documentElement.scrollHeight - window.innerHeight;
    return h > 0 ? (y / h).toFixed(4) : "0";
  }

  /* ============================ lifecycle ============================ */

  mount() {
    this.reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    this.fine = window.matchMedia("(hover: hover)").matches;
    this.amp = this.reduce ? 0 : (this.props.motion || "full") === "calm" ? 0.45 : 1;

    this.mx = window.innerWidth * 0.5;
    this.my = window.innerHeight * 0.4;
    this.cx = this.mx;
    this.cy = this.my;
    this.sy = window.scrollY;
    this.sySm = window.scrollY;
    this.lag = 0;
    this.velS = 0;
    this.liqV = 0;
    this.mqX = 0;
    this.mqCycle = 0;

    this.onMove = (e) => {
      this.mx = e.clientX;
      this.my = e.clientY;
    };
    window.addEventListener("pointermove", this.onMove, { passive: true });
    // Under 901px nothing pins: the sections are laid out by CSS and the
    // scroll-driven choreography steps out of the way entirely.
    this.narrow = window.innerWidth < 901;
    this.onResize = () => {
      this.mqCycle = 0;
      this.deckM = null;
      this.pinsM = null;
      this.narrow = window.innerWidth < 901;
      this._mreset = false;
    };
    window.addEventListener("resize", this.onResize, { passive: true });
    // Fonts and images settle after first paint; re-measure once they have.
    this.later(() => {
      this.pinsM = null;
      this.deckM = null;
    }, 1500);

    this.prime();
    this.splitChars();
    this.splitWords();
    this.setupDot();
    this.setupStack();
    this.setupTilt();
    this.setupPath();
    this.mobileDots();

    this.pins = this.qa("[data-pin-sec]");
    // The site footer, not the <footer> inside a testimonial card.
    this.footerEl = [...document.querySelectorAll("footer")].find(
      (f) => !this.root.contains(f)
    );
    this.snapEls = [this.q("#top"), ...this.pins, this.footerEl].filter(Boolean);
    this.dirS = 1;
    this.hold = null;
    this.holdA = 0;
    this.jumpCool = 0;
    this.jumpTo = 0;
    this.lastIn = 0;
    this.setupSnapInput();

    this.pinner = this.q("#approach [data-pin-inner]");
    this.ghost = this.q("[data-ghost]");
    this.spot = this.q("[data-spot]");
    this.ghostPop = 0;
    this.deck = this.qa("[data-deck]");
    this.grid = this.q('[data-m="grid"]');
    this.portrait = this.q("[data-ab-portrait]");
    this.abStats = this.q("[data-ab-stats]");
    this.counters = this.qa("[data-count]");
    this.cform = this.q("[data-cform]");
    this.cfs = this.qa("[data-cf]");
    this.reveals = this.qa("[data-reveal]");
    this.blobs = this.qa("[data-blob]").map((el, i) => ({
      el,
      w: +el.dataset.w || 1,
      ph: i * 1.7,
    }));
    this.turb = this.q("[data-turb]");
    this.liqEl = this.q("[data-liqmap]");
    this.liqWrap = this.q("[data-liquid]");
    this.hint = this.q("[data-hint]");
    this.marquee = this.q("[data-marquee]");
    this.gallery = this.q("[data-gallery]");
    this.track = this.q("[data-track]");
    this.gitems = this.qa("[data-gitem]");
    this.faqSec = this.q("#faq");
    this.faqs = this.qa("[data-faq]");
    this.magnets = this.qa("[data-magnet]").concat(
      [...document.querySelectorAll("[data-magnet]")].filter(
        (el) => !this.root.contains(el)
      )
    );
    this.plx = this.qa("[data-parallax]").map((el) => ({
      el,
      s: +el.dataset.parallax,
    }));

    this.t0 = performance.now();
    this.last = this.t0;
    const frame = (now) => {
      this.raf = requestAnimationFrame(frame);
      const t = (now - this.t0) / 1000;
      const dt = Math.min(0.05, (now - this.last) / 1000);
      this.last = now;
      const vh = window.innerHeight;
      const vw = window.innerWidth;

      const y0 = window.scrollY;
      this.velS += (y0 - this.sy - this.velS) * 0.2;
      this.sy = y0;
      if (Math.abs(this.velS) > 1) this.dirS = this.velS > 0 ? 1 : -1;
      this.snapStep(y0, vh, now);

      // A hard-cut jump would tear every scrubbed section through its whole
      // timeline in one frame; `lag` is the smoothed scroll position the
      // choreography reads instead, so the cut plays as a sweep.
      const y = window.scrollY;
      const ks = this.reduce ? 1 : 1 - Math.exp(-dt / 0.115);
      this.sySm += (y - this.sySm) * ks;
      const mxl = vh * 1.1;
      if (Math.abs(y - this.sySm) > mxl)
        this.sySm = y - Math.sign(y - this.sySm) * mxl;
      this.lag = y - this.sySm;

      this.cx += (this.mx - this.cx) * 0.13;
      this.cy += (this.my - this.cy) * 0.13;

      this.pinPass(vh);
      this.revealPass(vh);
      document.documentElement.style.setProperty("--progress", this.prog(this.sySm));
      this.blobField(t, vh);
      this.headWave(t, vh);
      this.liquid(t, vh);
      this.marqueeStep(dt);
      this.wordsScrub(vh);
      this.aboutStep();
      this.contactStep();
      if (this.narrow) {
        this.mobileReset();
      } else {
        this.stepsStep();
        this.servicesStep();
        this.galleryStep(vh, vw);
        this.stackStep(vh, dt);
        this.faqStep();
      }
      this.parallaxStep(vh);
      this.magnetStep();
      this.footerStep(vh);
      this.railStep(vh);
      this.dotStep();
    };
    this.raf = requestAnimationFrame(frame);
    this.runIntro();
  }

  destroy() {
    cancelAnimationFrame(this.raf);
    window.removeEventListener("pointermove", this.onMove);
    window.removeEventListener("resize", this.onResize);
    if (this.onWheel) window.removeEventListener("wheel", this.onWheel);
    if (this.onKeyNav) window.removeEventListener("keydown", this.onKeyNav);
    if (this.onAnchor) document.removeEventListener("click", this.onAnchor);
    if (this.onDragMove) {
      window.removeEventListener("pointermove", this.onDragMove);
      window.removeEventListener("pointerup", this.onDragUp);
      window.removeEventListener("pointercancel", this.onDragUp);
    }
    if (this.stackScroller)
      this.stackScroller.removeEventListener("scroll", this.onStackScroll);
    if (this.dotsHost) this.dotsHost.textContent = "";
    this.timers.forEach(clearTimeout);
    this.timers = [];
    // The footer outlives this page, so its letters must not stay scattered.
    (this.fchars || []).forEach((s) => (s.style.transform = ""));
    if (this.intro) this.intro.remove();
    if (this.dotEl) {
      this.dotEl.remove();
      window.removeEventListener("pointermove", this.dotWake);
      window.removeEventListener("pointerdown", this.onDotDown);
      window.removeEventListener("pointerup", this.onDotUp);
      this.root.classList.remove("cursor-dot-on");
    }
    document.documentElement.style.overflow = "";
    document.documentElement.style.removeProperty("--progress");
  }

  // The FAQ answers change height when they open, so the pin measurement
  // (and therefore the fit scale) has to be redone.
  remeasure() {
    this.pinsM = null;
  }

  /* ============================ mobile ============================
     Under 901px the pinned choreography is off and CSS lays the
     sections out instead. Two things still need JS: the reviews rail
     gets pagination dots, and any transform the desktop path already
     wrote has to be handed back (this also covers a desktop→mobile
     resize mid-session). */

  mobileDots() {
    const dots = this.q("[data-mdots]");
    const stack = this.stack || this.q("[data-stack]");
    if (!dots || !stack) return;
    const cards = this.cards && this.cards.length ? this.cards : this.qa("[data-card]");
    if (!cards.length) return;
    dots.textContent = "";
    cards.forEach((card, i) => {
      const b = document.createElement("button");
      b.type = "button";
      b.setAttribute("aria-label", `המלצה ${i + 1}`);
      if (i === 0) b.dataset.on = "1";
      b.addEventListener("click", () => {
        stack.scrollTo({
          left: card.offsetLeft - (stack.clientWidth - card.offsetWidth) / 2,
          behavior: "smooth",
        });
      });
      dots.appendChild(b);
    });
    this.dotsHost = dots;
    const dotEls = [...dots.children];
    let tick = 0;
    this.onStackScroll = () => {
      cancelAnimationFrame(tick);
      tick = requestAnimationFrame(() => {
        const mid = stack.scrollLeft + stack.clientWidth / 2;
        let best = 0;
        let bd = Infinity;
        cards.forEach((c, i) => {
          const d = Math.abs(c.offsetLeft + c.offsetWidth / 2 - mid);
          if (d < bd) {
            bd = d;
            best = i;
          }
        });
        dotEls.forEach((d, i) => (d.dataset.on = i === best ? "1" : ""));
      });
    };
    stack.addEventListener("scroll", this.onStackScroll, { passive: true });
    this.stackScroller = stack;
  }

  mobileReset() {
    if (this._mreset) return;
    this._mreset = true;
    this.qa("[data-card],[data-gitem],[data-deck],[data-step],[data-faq]").forEach(
      (el) => {
        el.style.opacity = "";
        el.style.transform = "";
        el.style.zIndex = "";
        // stackStep hides the off-deck cards from AT; on the mobile rail
        // every card is a peer, so that has to come back off.
        if (el.hasAttribute("aria-hidden")) el.removeAttribute("aria-hidden");
      }
    );
    if (this.track) this.track.style.transform = "";
  }

  /* Hide the animated elements. Done from JS so the served HTML stays
     readable without it. */
  prime() {
    // On mobile the scrubbed sections are laid out (and revealed) by CSS, so
    // hiding them here would only cause a flash before mobileReset clears it.
    if (this.reduce || this.narrow) return;
    this.qa("[data-reveal]").forEach((el) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(22px)";
      el.style.transition = `opacity .85s ${CB}, transform .85s ${CB}`;
    });
    const hide = (sel, transform) =>
      this.qa(sel).forEach((el) => {
        el.style.opacity = "0";
        el.style.willChange = "transform,opacity";
        if (transform) el.style.transform = transform;
      });
    hide("[data-ab-portrait]", "scale(.86) translateY(90px)");
    hide("[data-ab-stats]", "translateY(30px)");
    hide("[data-step]", "translateY(54px) scale(.8)");
    hide("[data-deck]", null);
    hide("[data-faq]", "translateY(34px)");
    hide("[data-cform]", "translateY(70px) scale(.94)");
    this.qa("[data-cf]").forEach((el) => {
      el.style.opacity = "0";
      el.style.transform = "translateX(38px)";
    });
    this.qa("[data-ring]").forEach((el) => (el.style.opacity = "0"));
    // Every card past the first starts hidden; stackStep sweeps them in.
    this.qa("[data-card]").forEach((el, i) => {
      if (i > 0) el.style.opacity = "0";
    });
    this.qa("[data-carnav]").forEach((el) => {
      el.style.opacity = "0";
      el.style.pointerEvents = "none";
    });
    const h2 = this.q("[data-vhint2]");
    if (h2) h2.style.opacity = "0";
    const g = this.q("[data-ghost]");
    if (g) g.style.opacity = "0";
    const s = this.q("[data-spot]");
    if (s) s.style.opacity = "0";
  }

  /* ============================ pinning ============================ */

  /* Sections stay pinned — and keep their animation — by scaling their
     content to the viewport. Unpinning is only the last resort for very
     short windows. */
  measurePins() {
    const pins = this.pins || [];
    const vh = window.innerHeight;
    const narrow = window.innerWidth < 900;
    pins.forEach((el) => {
      if (el.dataset.unpin) el.dataset.unpin = "";
    });
    pins.forEach((el) => {
      const inner = el._inner || (el._inner = el.querySelector("[data-pin-inner]"));
      if (!inner) return;
      el._kids = [...inner.children].filter(
        (k) => getComputedStyle(k).position !== "absolute"
      );
      el._reel = el._kids.some((k) => k.hasAttribute("data-track"));
      el._kids.forEach((k) => {
        if (k.style.transform && !k.hasAttribute("data-track")) k.style.transform = "";
      });
      let need = 0;
      el._kids.forEach((k) => {
        need = Math.max(need, k.getBoundingClientRect().height);
      });
      el._need = need;
    });
    pins.forEach((el) => {
      el._fit = 1;
      const fit = el._need ? this.cl((vh - 36) / el._need, 0, 1) : 1;
      if (narrow || this.reduce || fit < 0.6 || (el._reel && el._need > vh - 16)) {
        el.dataset.unpin = "1";
        return;
      }
      if (fit >= 0.999) return;
      el._fit = fit;
      (el._kids || []).forEach((k) => {
        k.style.transformOrigin = "center";
        k.style.transform = `scale(${fit.toFixed(4)})`;
      });
    });
    pins.forEach((el) => {
      el._flow = !el._inner || getComputedStyle(el._inner).position !== "sticky";
    });
    this.pinsM = true;
  }

  pinPass(vh) {
    if (!this.pinsM) this.measurePins();
    (this.pins || []).forEach((el) => {
      const r = el.getBoundingClientRect();
      const top = r.top + this.lag;
      el._vis = r.bottom + this.lag > -220 && top < vh + 220;
      if (!el._vis) return;
      el._p = el._flow
        ? this.cl((vh * 0.82 - top) / (r.height * 0.5 || 1), 0, 1)
        : this.cl(-top / (r.height - vh || 1), 0, 1);
    });
  }

  /* ==================== section snapping ====================
     Scrolling into the seam between two sections latches there. Keep
     pushing and the locked section leans toward its exit; past the
     threshold the page hard-cuts and `lag` sweeps the next one in. */

  snapOff() {
    return (
      this.props.snapSections === false ||
      this.reduce ||
      !this.fine ||
      window.innerWidth < 901
    );
  }

  setY(v) {
    const t = Math.round(v);
    window.scrollTo({ top: t, behavior: "instant" });
    this.sy = t;
    this.velS = 0;
  }

  // The seam ahead of (or behind) `y`: where the current section's timeline
  // finishes, and where the next one begins.
  seam(y, vh, dir) {
    const els = this.snapEls || [];
    if (els.length < 2) return null;
    const sy = window.scrollY;
    const tops = els.map((el) => Math.round(el.getBoundingClientRect().top + sy));
    const max = Math.max(0, document.documentElement.scrollHeight - vh - 1);
    if (y >= max - 2 && dir > 0) return null;
    let i = 0;
    for (let k = 0; k < tops.length; k++) if (y >= tops[k] - 2) i = k;
    const k = dir < 0 ? i - 1 : i;
    if (k < 0 || tops[k + 1] === undefined) return null;
    if (tops[k + 1] > max - 2) return null;
    const end = tops[k] + Math.max(0, tops[k + 1] - tops[k] - vh);
    if (tops[k + 1] - end < 40) return null;
    return { k, end, next: tops[k + 1], el: els[k] };
  }

  snapStep(y, vh, now) {
    if (this.snapOff()) {
      this.hold = null;
      this.jumpA = null;
      this.charge(null, 0);
      return;
    }
    const j = this.jumpA;
    if (j) {
      const t = this.cl((now - j.t0) / j.dur, 0, 1);
      const e = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      this.setY(j.from + (j.to - j.from) * e);
      this.charge(j.el, 1 - e);
      if (t >= 1) {
        this.jumpA = null;
        this.jumpTo = j.to;
        this.jumpCool = now + 130;
      }
      return;
    }
    if (now < this.jumpCool) {
      this.setY(this.jumpTo);
      this.charge(null, 0);
      return;
    }
    const h = this.hold;
    if (h) {
      const d = y - h.anchor;
      if (h.up ? d > 2 : d < -2) {
        this.hold = null;
        this.holdA = 0;
        this.charge(null, 0);
        return;
      }
      if (Math.abs(d) > 0.5) {
        this.holdA += d;
        this.lastIn = now;
        this.setY(h.anchor);
      } else if (now - (this.lastIn || 0) > 400) this.holdA *= 0.92;
      this.chgDir = h.up ? -1 : 1;
      this.charge(h.el, this.cl(Math.abs(this.holdA) / 88, 0, 1));
      this.checkJump(now);
      return;
    }
    const z = this.seam(y, vh, 1);
    if (!z || y <= z.end + 1) {
      this.holdA = 0;
      this.charge(null, 0);
      return;
    }
    const up = this.dirS < 0;
    this.latch(up ? z.next : z.end, up, z, y, now);
  }

  // The locked section leans toward its exit as you push against the lock.
  charge(el, target) {
    if (el && el !== this._chgSec) {
      if (this._chgT) {
        this._chgT.style.transform = "";
        this._chgT.style.opacity = "";
      }
      this._chgSec = el;
      this._chgT = el.querySelector("[data-pin-inner]") || el;
      this.chg = 0;
    }
    const t = this._chgT;
    if (!t) return;
    this.chg = (this.chg || 0) + (target - (this.chg || 0)) * 0.22;
    if (this.chg < 0.004) {
      this.chg = 0;
      if (t.style.transform) {
        t.style.transform = "";
        t.style.opacity = "";
      }
      return;
    }
    const e = this.es(this.chg);
    const dir = this.chgDir || 1;
    t.style.transform = `translateY(${(-dir * e * 13).toFixed(1)}px) scale(${(1 - e * 0.022).toFixed(4)})`;
    t.style.opacity = (1 - e * 0.13).toFixed(3);
  }

  latch(anchor, up, z, y, now) {
    this.hold = { up, anchor, end: z.end, next: z.next, el: z.el };
    this.holdA = y - anchor;
    this.lastIn = now;
    this.chgDir = up ? -1 : 1;
    if (Math.round(window.scrollY) !== Math.round(anchor)) this.setY(anchor);
    this.checkJump(now);
  }

  checkJump(now) {
    const h = this.hold;
    if (!h) return;
    if (!h.up && this.holdA >= 88) this.jump(h.next, now, h.el);
    else if (h.up && this.holdA <= -88) this.jump(h.end, now, h.el);
  }

  jump(t, now, el) {
    this.hold = null;
    this.holdA = 0;
    const to = Math.round(
      this.cl(t, 0, Math.max(0, document.documentElement.scrollHeight - window.innerHeight - 1))
    );
    const from = window.scrollY;
    this.jumpTo = to;
    const d = Math.abs(to - from);
    if (d < 6) {
      this.setY(to);
      this.jumpCool = now + 130;
      return;
    }
    this.jumpA = {
      from,
      to,
      t0: now,
      dur: this.cl(240 + d * 0.42, 300, 620),
      el: el || this._chgSec,
    };
  }

  setupSnapInput() {
    this.onWheel = (e) => {
      if (this.snapOff()) return;
      const now = performance.now();
      if (this.jumpA || now < this.jumpCool) {
        e.preventDefault();
        return;
      }
      const d =
        e.deltaY *
        (e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? window.innerHeight : 1);
      if (!d) return;
      const y = window.scrollY;
      const vh = window.innerHeight;
      if (!this.hold) {
        this.dirS = d > 0 ? 1 : -1;
        if (d > 0) {
          const s = this.seam(y, vh, 1);
          if (s && y <= s.end + 1 && y + d > s.end) {
            e.preventDefault();
            this.latch(s.end, false, s, y + d, now);
          }
        } else {
          const s = this.seam(y, vh, -1);
          if (s && y >= s.next - 1 && y + d < s.next) {
            e.preventDefault();
            this.latch(s.next, true, s, y + d, now);
          }
        }
        return;
      }
      // Reversing direction always releases the lock.
      if ((this.hold.up && d > 0) || (!this.hold.up && d < 0)) {
        this.hold = null;
        this.holdA = 0;
        this.dirS = d > 0 ? 1 : -1;
        return;
      }
      e.preventDefault();
      this.holdA += d;
      this.lastIn = now;
      this.checkJump(now);
    };
    window.addEventListener("wheel", this.onWheel, { passive: false });

    // Keyboard paging past a lock jumps rather than nudging.
    this.onKeyNav = (e) => {
      if (this.snapOff() || !this.hold) return;
      const dn = ["ArrowDown", "PageDown", " ", "Spacebar"].includes(e.key);
      const upk = ["ArrowUp", "PageUp"].includes(e.key);
      if (!dn && !upk) return;
      const h = this.hold;
      if (dn && !h.up) {
        e.preventDefault();
        this.jump(h.next, performance.now());
      } else if (upk && h.up) {
        e.preventDefault();
        this.jump(h.end, performance.now());
      } else {
        this.hold = null;
        this.holdA = 0;
        this.dirS = dn ? 1 : -1;
      }
    };
    window.addEventListener("keydown", this.onKeyNav);

    // In-page anchors ride the same jump animation, so landing on a pinned
    // section starts its timeline at 0 instead of somewhere in the middle.
    this.onAnchor = (e) => {
      if (e.defaultPrevented || e.button) return;
      const a = e.target.closest && e.target.closest('a[href^="#"], a[href^="/#"]');
      // The skip link has to keep its default behaviour — that's what moves
      // focus into the main landmark.
      if (!a || a.classList.contains("skip-link")) return;
      const href = a.getAttribute("href");
      const id = href.slice(href.indexOf("#") + 1);
      const t = id && document.getElementById(id);
      if (!t) return;
      e.preventDefault();
      const dest = Math.round(t.getBoundingClientRect().top + window.scrollY);
      if (this.snapOff()) {
        window.scrollTo({ top: dest, behavior: "smooth" });
        return;
      }
      this.jump(dest, performance.now(), null);
    };
    document.addEventListener("click", this.onAnchor);
  }

  /* ============================ intro ============================ */

  runIntro() {
    if (this.props.showIntro === false || this.reduce) {
      this.startReveals();
      return;
    }
    let seen = false;
    try {
      seen = sessionStorage.getItem("sharona-intro") === "1";
    } catch {
      seen = true; // no storage → don't risk showing it on every navigation
    }
    if (seen) {
      this.startReveals();
      return;
    }
    try {
      sessionStorage.setItem("sharona-intro", "1");
    } catch {
      /* ignore */
    }

    const ov = document.createElement("div");
    ov.setAttribute("aria-hidden", "true");
    ov.style.cssText =
      "position:fixed;inset:0;z-index:200;background:var(--color-bg);display:flex;align-items:center;justify-content:center;overflow:hidden";
    ov.innerHTML =
      '<div style="position:absolute;inset:0;filter:url(#goo);display:flex;align-items:center;justify-content:center">' +
      '<div data-intro-a style="position:absolute;width:190px;height:190px;border-radius:50%;background:#7a8a5e;transform:translateX(-190px) scale(.6);transition:transform .85s cubic-bezier(.65,0,.35,1)"></div>' +
      '<div data-intro-b style="position:absolute;width:150px;height:150px;border-radius:50%;background:#c67139;transform:translateX(190px) scale(.6);transition:transform .85s cubic-bezier(.65,0,.35,1),opacity .5s ease .35s"></div>' +
      "</div>" +
      '<div data-intro-name style="position:relative;font-family:var(--font-heading);font-size:clamp(30px,5vw,58px);color:var(--color-bg);opacity:0;transform:translateY(16px);transition:opacity .7s ease,transform .9s ' +
      CB +
      ';letter-spacing:.01em">שרונה בר-נס</div>';
    document.body.appendChild(ov);
    this.intro = ov;

    const a = ov.querySelector("[data-intro-a]");
    const b = ov.querySelector("[data-intro-b]");
    const nm = ov.querySelector("[data-intro-name]");
    document.documentElement.style.overflow = "hidden";
    requestAnimationFrame(() => {
      a.style.transform = "translateX(-34px) scale(1)";
      b.style.transform = "translateX(34px) scale(1)";
    });
    this.later(() => {
      a.style.transition = "transform 1s cubic-bezier(.65,0,.35,1)";
      a.style.transform = "translateX(0) scale(9)";
      b.style.transform = "translateX(0) scale(1.1)";
      b.style.opacity = "0";
      nm.style.opacity = "1";
      nm.style.transform = "translateY(0)";
    }, 820);
    this.later(() => {
      ov.style.transition = `opacity .8s ease, transform 1.1s ${CB}`;
      ov.style.opacity = "0";
      ov.style.transform = "scale(1.08)";
      document.documentElement.style.overflow = "";
      this.startReveals();
    }, 1980);
    this.later(() => {
      ov.remove();
      this.intro = null;
    }, 2900);
  }

  /* ============================ split text ============================ */

  splitChars() {
    this.chars = [];
    this.charHost = null;
    if (this.reduce) return; // leave the headline as plain, static text

    this.qa("[data-split]").forEach((host) => {
      const text = host.textContent;
      host.textContent = "";
      const words = text.split(" ");
      words.forEach((word, wi) => {
        const wrap = document.createElement("span");
        wrap.style.cssText = "display:inline-block;white-space:nowrap";
        [...word].forEach((c) => {
          const outer = document.createElement("span");
          outer.style.cssText =
            "display:inline-block;white-space:pre;will-change:transform";
          const inner = document.createElement("span");
          inner.style.cssText =
            "display:inline-block;white-space:pre;opacity:0;transform:translateY(115%) rotate(7deg);transition:opacity .7s ease,transform .95s cubic-bezier(.19,.9,.22,1)";
          inner.textContent = c;
          outer.appendChild(inner);
          wrap.appendChild(outer);
          this.chars.push({ el: outer, inner });
        });
        host.appendChild(wrap);
        if (wi < words.length - 1) host.appendChild(document.createTextNode(" "));
      });
      if (!this.charHost) this.charHost = host.closest("h1");
    });
  }

  splitWords() {
    this.wordHosts = this.qa("[data-words]").map((el) => {
      const words = el.textContent.split(/\s+/).filter(Boolean);
      el.textContent = "";
      const spans = words.map((w, i) => {
        const s = document.createElement("span");
        s.style.cssText = "display:inline-block;opacity:.14;will-change:opacity,transform";
        s.textContent = w;
        el.appendChild(s);
        if (i < words.length - 1) el.appendChild(document.createTextNode(" "));
        return s;
      });
      if (this.reduce) spans.forEach((s) => (s.style.opacity = "1"));
      return { el, words: spans, p: -1 };
    });
  }

  startReveals() {
    // Reveal what is already on screen; the rAF loop picks up the rest as
    // they scroll in.
    this.revealPass(window.innerHeight, true);
    this.chars.forEach((c, i) =>
      this.later(() => {
        c.inner.style.opacity = "1";
        c.inner.style.transform = "none";
      }, 120 + i * 34)
    );
    this.later(
      () => this.qa("[data-line]").forEach((l) => (l.style.overflow = "visible")),
      400 + this.chars.length * 34 + 900
    );
    this.headReady = true;
    // The "touch the portrait" nudge has done its job after a few seconds.
    if (this.hint) {
      this.later(() => {
        this.hint.style.transition = "opacity .6s ease";
        this.hint.style.opacity = "0";
      }, 7000);
    }
  }

  /* ============================ reveal ============================ */

  revealPass(vh, force) {
    if (!this.reveals || !this.reveals.length) return;
    this.reveals = this.reveals.filter((el) => {
      const r = el.getBoundingClientRect();
      if (!force && !(r.top < vh * 0.9 && r.bottom > -40)) return true;
      const d = this.reduce ? 0 : +(el.dataset.revealDelay || 0);
      this.later(() => {
        el.style.opacity = "1";
        el.style.transform = "none";
      }, d);
      return false;
    });
  }

  /* ============================ rail / parallax ============================ */

  railStep(vh) {
    if (!this.dots) {
      this.dots = this.qa("[data-dot-nav]");
      if (!this.dots.length) return;
    }
    let active = 0;
    this.dots.forEach((d, i) => {
      const t = document.getElementById(d.dataset.target);
      if (t && t.getBoundingClientRect().top < vh * 0.42) active = i;
    });
    if (this._active === active) return;
    this._active = active;
    this.dots.forEach((d, i) => {
      d.style.height = i === active ? "26px" : "9px";
      d.style.background =
        i === active
          ? "var(--color-accent-2)"
          : "color-mix(in srgb, var(--color-accent-2) 40%, transparent)";
      if (i === active) d.setAttribute("aria-current", "true");
      else d.removeAttribute("aria-current");
    });
  }

  parallaxStep(vh) {
    if (this.amp === 0) return;
    this.plx.forEach(({ el, s }) => {
      const r = el.getBoundingClientRect();
      if (r.bottom < -100 || r.top > vh + 100) return;
      const c = r.top + this.lag + r.height / 2 - vh / 2;
      el.style.transform = `translateY(${(c * s * this.amp).toFixed(1)}px)`;
    });
  }

  /* ============================ hero ============================ */

  blobField(t, vh) {
    if (!this.blobs.length || this.amp === 0) return;
    const hero = this.hero || (this.hero = this.q("#top"));
    if (!hero) return;
    const r = hero.getBoundingClientRect();
    if (r.bottom < 0 || r.top > vh) return;
    // The blob field also leans toward the pointer.
    const nx = this.cl((this.cx - r.left) / r.width - 0.5, -0.6, 0.6);
    const ny = this.cl((this.cy - r.top) / r.height - 0.5, -0.6, 0.6);
    this.blobs.forEach((b) => {
      const dx =
        Math.sin(t * 0.27 + b.ph) * 44 * this.amp + nx * 74 * b.w * this.amp;
      const dy =
        Math.cos(t * 0.21 + b.ph * 1.3) * 38 * this.amp + ny * 74 * b.w * this.amp;
      const s = 1 + Math.sin(t * 0.42 + b.ph) * 0.07 * this.amp;
      b.el.style.transform = `translate3d(${dx.toFixed(1)}px,${dy.toFixed(1)}px,0) scale(${s.toFixed(3)})`;
    });
  }

  // Headline characters bob on a slow sine wave, and shy away from the cursor.
  headWave(t, vh) {
    if (!this.headReady || !this.chars.length || !this.charHost || this.amp === 0)
      return;
    const r = this.charHost.getBoundingClientRect();
    if (r.bottom < -60 || r.top > vh + 60) return;
    this.chars.forEach((c, i) => {
      const el = c.el;
      const x = r.left + el.offsetLeft + el.offsetWidth / 2;
      const yy = r.top + el.offsetTop + el.offsetHeight / 2;
      const near = this.fine
        ? Math.max(0, 1 - Math.hypot(this.cx - x, this.cy - yy) / 165)
        : 0;
      const wave = Math.sin(t * 1.15 + i * 0.4) * 4.5;
      el.style.transform = `translateY(${((wave - near * 20) * this.amp).toFixed(2)}px) rotate(${(near * -3 * this.amp).toFixed(2)}deg)`;
    });
  }

  // The hero portrait ripples under the cursor via an SVG displacement map.
  liquid(t, vh) {
    if (!this.liqEl || !this.liqWrap) return;
    const r = this.liqWrap.getBoundingClientRect();
    if (r.bottom < 0 || r.top > vh) {
      if (this.liqV > 0.05) {
        this.liqV = 0;
        this.liqEl.setAttribute("scale", "0");
      }
      return;
    }
    const d = Math.hypot(
      this.cx - (r.left + r.width / 2),
      this.cy - (r.top + r.height / 2)
    );
    const target = this.fine ? Math.max(0, 1 - d / (r.width * 1.05)) * 30 * this.amp : 0;
    this.liqV += (target - this.liqV) * 0.1;
    this.liqEl.setAttribute("scale", this.liqV.toFixed(2));
    if (this.turb && this.liqV > 0.5) {
      this.turb.setAttribute(
        "baseFrequency",
        `${(0.008 + Math.sin(t * 0.5) * 0.003).toFixed(4)} ${(0.013 + Math.cos(t * 0.37) * 0.004).toFixed(4)}`
      );
    }
  }

  marqueeStep(dt) {
    const el = this.marquee;
    if (!el) return;
    if (!this.mqCycle) this.mqCycle = el.scrollWidth / 3;
    if (!this.mqCycle) return;
    this.mqX += (46 + Math.abs(this.velS) * 8) * dt;
    if (this.mqX > this.mqCycle) this.mqX -= this.mqCycle;
    const sk = this.cl(-this.velS * 0.32, -7, 7) * this.amp;
    el.style.transform = `translateX(${this.mqX.toFixed(1)}px) skewX(${sk.toFixed(2)}deg)`;
  }

  /* ============================ scrubbed words ============================ */

  wordsScrub(vh) {
    if (this.reduce) return;
    this.wordHosts.forEach((h) => {
      if (h.sec === undefined) {
        h.sec = h.el.closest("[data-pin-sec]");
        h.si = h.sec ? [...h.sec.querySelectorAll("[data-words]")].indexOf(h.el) : 0;
      }
      let p;
      if (h.sec) {
        if (!h.sec._vis) return;
        p = this.seg(h.sec._p, 0.02 + h.si * 0.08, 0.42 + h.si * 0.08);
      } else {
        const r = h.el.getBoundingClientRect();
        const rt = r.top + this.lag;
        if (r.bottom + this.lag < -60 || rt > vh + 60) return;
        p = this.cl((vh * 0.88 - rt) / (r.height + vh * 0.2), 0, 1);
      }
      if (Math.abs(p - h.p) < 0.004) return;
      h.p = p;
      const n = h.words.length;
      h.words.forEach((w, i) => {
        const wp = this.cl(p * n * 1.45 - i, 0, 1);
        w.style.opacity = (0.14 + wp * 0.86).toFixed(3);
        w.style.transform = `translateY(${((1 - wp) * 8).toFixed(2)}px)`;
        w.style.filter = wp > 0.97 ? "none" : `blur(${((1 - wp) * 3).toFixed(2)}px)`;
      });
    });
  }

  /* ============================ about ============================ */

  aboutStep() {
    if (this.reduce) return;
    const sec = this.aboutSec || (this.aboutSec = this.q("#about"));
    if (!sec || !sec._vis) return;
    const p = sec._p;
    if (this.portrait) {
      const e = this.es(this.seg(p, 0, 0.34));
      const k = this.seg(p, 0.05, 1);
      this.portrait.style.opacity = e.toFixed(3);
      this.portrait.style.transform = `translateY(${((1 - e) * 90).toFixed(1)}px) scale(${(0.86 + e * 0.14).toFixed(3)}) rotate(${((1 - e) * -7).toFixed(2)}deg)`;
      // The blob radius morphs as the section scrubs, so the silhouette is
      // never quite the same twice.
      this.portrait.style.borderRadius =
        `${(48 + k * 7).toFixed(1)}% ${(52 - k * 7).toFixed(1)}% ${(55 - k * 9).toFixed(1)}% ${(45 + k * 9).toFixed(1)}%/` +
        `${(56 - k * 10).toFixed(1)}% ${(46 + k * 8).toFixed(1)}% ${(54 - k * 8).toFixed(1)}% ${(44 + k * 10).toFixed(1)}%`;
    }
    if (this.abStats) {
      const e = this.es(this.seg(p, 0.44, 0.64));
      this.abStats.style.opacity = e.toFixed(3);
      this.abStats.style.transform = `translateY(${((1 - e) * 30).toFixed(1)}px)`;
    }
    (this.counters || []).forEach((el, i) => {
      const e = this.es(this.seg(p, 0.46 + i * 0.05, 0.86));
      const txt = Math.round(+el.dataset.count * e) + (el.dataset.suffix || "");
      if (el.textContent !== txt) el.textContent = txt;
    });
  }

  /* ============================ contact ============================ */

  contactStep() {
    if (this.reduce) return;
    const sec = this.contactSec || (this.contactSec = this.q("#contact"));
    if (!sec || !sec._vis) return;
    const p = sec._p;
    if (this.cform) {
      const e = this.es(this.seg(p, 0.04, 0.4));
      this.cform.style.opacity = e.toFixed(3);
      this.cform.style.transform = `translateY(${((1 - e) * 70).toFixed(1)}px) scale(${(0.94 + e * 0.06).toFixed(3)}) rotate(${((1 - e) * 2.2).toFixed(2)}deg)`;
    }
    // Fields slide in one after another, then hand control back to CSS so
    // focus rings and :focus transforms behave normally.
    (this.cfs || []).forEach((el, i) => {
      const e = this.es(this.seg(p, 0.22 + i * 0.07, 0.48 + i * 0.07));
      if (e >= 1) {
        if (el.dataset.on !== "1") {
          el.dataset.on = "1";
          el.style.opacity = "";
          el.style.transform = "";
        }
        return;
      }
      el.dataset.on = "0";
      el.style.opacity = e.toFixed(3);
      el.style.transform = `translateX(${((1 - e) * 38).toFixed(1)}px)`;
    });
  }

  /* ============================ approach ============================ */

  setupPath() {
    if (this.reduce) return;
    this.pathSvg = this.q("[data-path]");
    this.pathLine = this.q("[data-pathline]");
    this.dot = this.q("[data-dot]");
    this.steps = this.qa("[data-step]");
    if (this.pathLine && this.pathLine.getTotalLength) {
      this.pathLen = this.pathLine.getTotalLength();
      this.pathLine.style.strokeDasharray = `${this.pathLen} ${this.pathLen}`;
      this.pathLine.style.strokeDashoffset = this.pathLen;
    }
  }

  stepsStep() {
    if (this.reduce) return;
    const sec = this.approach || (this.approach = this.q("#approach"));
    if (!sec || !sec._vis || !this.steps || !this.steps.length) return;
    const p = sec._p;
    const n = this.steps.length;
    const sp = this.seg(p, 0.05, 0.78);
    const settle = this.es(this.seg(p, 0.8, 0.95)); // at the end, everything lands
    const f = sp * (n + 0.4) - 0.8; // fractional "current step"
    const drawn = this.es(sp);

    if (this.pathLine && this.pathLen && this.pathSvg) {
      this.pathLine.style.strokeDashoffset = (this.pathLen * (1 - drawn)).toFixed(1);
      const pr = this.pathSvg.getBoundingClientRect();
      if (this.dot && pr.width) {
        const pt = this.pathLine.getPointAtLength(this.pathLen * drawn);
        this.dot.style.transform = `translate(${((pt.x / 1000) * pr.width - 9).toFixed(1)}px,${((pt.y / 100) * pr.height - 9).toFixed(1)}px) scale(${(1 - settle * 0.5).toFixed(2)})`;
        const vis = sp > 0.02 && settle < 0.7 ? "1" : "0";
        if (this.dot.style.opacity !== vis) this.dot.style.opacity = vis;
      }
    }

    let peak = 0;
    let actEl = null;
    this.steps.forEach((s, i) => {
      const d = f - i;
      let op, ty, sc, rot;
      if (d <= 0) {
        const e = this.es(this.cl(1 + d, 0, 1));
        op = e;
        ty = (1 - e) * 54;
        sc = 0.8 + e * 0.2;
        rot = (1 - e) * 7;
      } else {
        const k = this.cl(d / 2.2, 0, 1);
        op = 1 - k * 0.62;
        ty = -k * 12;
        sc = 1 - k * 0.11;
        rot = 0;
      }
      const a = Math.max(0, 1 - Math.abs(d) / 0.9) * (1 - settle);
      if (a > peak) peak = a;
      if (Math.abs(d) < 0.55) actEl = s;
      op = this.mix(op, 1, settle);
      ty = this.mix(ty, 0, settle);
      sc = this.mix(sc, 1, settle);
      rot = this.mix(rot, 0, settle);
      s.style.opacity = op.toFixed(3);
      s.style.transform = `translateY(${ty.toFixed(1)}px) scale(${sc.toFixed(3)}) rotate(${rot.toFixed(2)}deg)`;
      const num = s._num || (s._num = s.querySelector("[data-num]"));
      if (num)
        num.style.transform = `scale(${(1 + a * 0.22).toFixed(3)}) rotate(${(a * -7).toFixed(2)}deg)`;
      const ring = s._ring || (s._ring = s.querySelector("[data-ring]"));
      if (ring) {
        ring.style.opacity = (a * 0.8).toFixed(3);
        ring.style.transform = `scale(${(1 + a * 0.42).toFixed(3)})`;
      }
    });

    if (this.ghost) {
      const txt = String(this.cl(Math.round(f), 0, n - 1) + 1);
      if (this.ghost.textContent !== txt) {
        this.ghost.textContent = txt;
        this.ghostPop = 1;
      }
      this.ghostPop *= 0.87;
      this.ghost.style.opacity = (this.cl(sp * 4, 0, 1) * (1 - settle)).toFixed(3);
      this.ghost.style.transform = `translate(50%,-50%) scale(${(1 + this.ghostPop * 0.09).toFixed(3)})`;
    }
    if (this.spot) {
      this.spot.style.opacity = (peak * 0.8).toFixed(3);
      if (actEl && this.pinner) {
        const ir = this.pinner.getBoundingClientRect();
        const sr = actEl.getBoundingClientRect();
        this.spot.style.left = `${(sr.left - ir.left + sr.width / 2).toFixed(0)}px`;
        this.spot.style.top = `${(sr.top - ir.top + 60).toFixed(0)}px`;
      }
    }
  }

  /* ============================ services ============================ */

  // Cards start piled at the grid's centre and get dealt out to their slots.
  measureDeck() {
    if (!this.grid || !this.deck.length) return;
    const gx = this.grid.offsetLeft + this.grid.offsetWidth / 2;
    const gy = this.grid.offsetTop + this.grid.offsetHeight / 2;
    this.deck.forEach((el) => {
      el._dx = gx - (el.offsetLeft + el.offsetWidth / 2);
      el._dy = gy - (el.offsetTop + el.offsetHeight / 2);
    });
    this.deckM = true;
  }

  servicesStep() {
    if (this.reduce) return;
    const sec = this.servSec || (this.servSec = this.q("#services"));
    if (!sec || !sec._vis || !this.deck.length) return;
    if (!this.deckM) this.measureDeck();
    const p = sec._p;
    const n = this.deck.length;
    const span = 0.72 / n; // deal every card within the pin, whatever the count
    this.deck.forEach((el, i) => {
      const s0 = 0.08 + i * span;
      const e = this.es(this.seg(p, s0, s0 + 0.34));
      if (e >= 1) {
        // Hand the card back to CSS once it has landed, so hover/tilt works.
        if (el.dataset.dealt !== "1") {
          el.dataset.dealt = "1";
          el.style.opacity = "1";
          el.style.transform = "none";
          el.style.zIndex = "";
        }
        return;
      }
      el.dataset.dealt = "0";
      el.style.opacity = this.es(this.seg(p, s0 - 0.07, s0 + 0.08)).toFixed(3);
      el.style.zIndex = String(n + 4 - i);
      el.style.transform =
        `translate(${((el._dx || 0) * (1 - e)).toFixed(1)}px,${((el._dy || 0) * (1 - e)).toFixed(1)}px) ` +
        `rotate(${((i - (n - 1) / 2) * 9 * (1 - e)).toFixed(2)}deg) scale(${(0.86 + e * 0.14).toFixed(3)})`;
    });
  }

  // Pointer tilt on the dealt service cards.
  setupTilt() {
    if (!this.fine || this.reduce) return;
    this.qa("[data-tilt]").forEach((card) => {
      card.addEventListener("pointermove", (e) => {
        if (card.dataset.dealt === "0") return;
        const r = card.getBoundingClientRect();
        const nx = (e.clientX - r.left) / r.width - 0.5;
        const ny = (e.clientY - r.top) / r.height - 0.5;
        const a = this.amp;
        card.style.transform =
          `perspective(950px) rotateY(${(nx * 9 * a).toFixed(2)}deg) rotateX(${(-ny * 9 * a).toFixed(2)}deg) ` +
          `translateY(${(-10 * a).toFixed(1)}px) scale(${(1 + 0.02 * a).toFixed(3)})`;
        card.style.backgroundImage = `radial-gradient(320px circle at ${(e.clientX - r.left).toFixed(0)}px ${(e.clientY - r.top).toFixed(0)}px, color-mix(in srgb, var(--color-accent-2) 22%, transparent), transparent 72%)`;
        card.style.boxShadow = "var(--shadow-lg)";
      });
      card.addEventListener("pointerleave", () => {
        card.style.transform = "none";
        card.style.backgroundImage = "none";
        card.style.boxShadow = "var(--shadow-sm)";
      });
    });
  }

  /* ============================ gallery ============================ */

  galleryStep(vh, vw) {
    if (!this.gallery || !this.track || !this.gallery._vis) return;
    if (this.gallery._flow) {
      if (this.track.style.transform) this.track.style.transform = "";
      return;
    }
    const p = this.gallery._p;
    const max = Math.max(0, this.track.offsetWidth - vw);
    // RTL: the track starts flush right and slides right-to-left.
    this.track.style.transform = `translateX(${(p * max).toFixed(1)}px)`;
    this.gitems.forEach((it) => {
      const ir = it.getBoundingClientRect();
      const k = Math.max(
        0,
        1 - Math.abs(ir.left + ir.width / 2 - vw / 2) / (vw * 0.52)
      );
      it.style.opacity = (0.42 + k * 0.58).toFixed(3);
      it.style.transform = `scale(${(0.9 + k * 0.12).toFixed(3)})`;
    });
  }

  /* ============================ FAQ ============================ */

  faqStep() {
    if (this.reduce) return;
    const sec = this.faqSec;
    if (!sec || !sec._vis || !this.faqs || !this.faqs.length) return;
    const p = sec._p;
    this.faqs.forEach((it, i) => {
      const t = this.es(this.seg(p, 0.03 + i * 0.07, 0.32 + i * 0.07));
      it.style.opacity = t.toFixed(3);
      it.style.transform = `translateY(${((1 - t) * 34).toFixed(1)}px)`;
    });
  }

  /* ============================ testimonial stack ============================
     One card at a time sweeps in from alternating sides; at the end of the
     section all of them gather into a running, draggable carousel. */

  setupStack() {
    this.stack = this.q("[data-stack]");
    this.cards = this.qa("[data-card]");
    this.voices = this.q("#voices");
    this.vstage = this.voices && this.voices.querySelector("[data-pin-inner]");
    this.hint1 = this.q("[data-vhint]");
    this.hint2 = this.q("[data-vhint2]");
    this.carOff = null;
    this.carGoal = 0;
    this.carStep = 500;
    this.carOn = 0;
    this.carHover = false;
    this.carDrag = null;
    this.carNav = this.qa("[data-carnav]");
    this.carNav.forEach((b) =>
      b.addEventListener("click", () => {
        const st = this.carStep;
        this.carGoal =
          Math.round(this.carGoal / st) * st + (+b.dataset.carnav || 1) * st;
        this.carT = 0;
      })
    );
    if (this.stack) {
      this.stack.addEventListener("pointerenter", () => (this.carHover = true));
      this.stack.addEventListener("pointerleave", () => (this.carHover = false));
    }
    if (!this.vstage) return;
    this.vstage.addEventListener("pointerdown", (e) => {
      if (this.carOn < 0.5 || e.target.closest("[data-carnav]")) return;
      this.carDrag = { x: e.clientX, g: this.carGoal };
    });
    this.onDragMove = (e) => {
      if (!this.carDrag) return;
      this.carGoal = this.carDrag.g - (e.clientX - this.carDrag.x);
    };
    this.onDragUp = () => {
      if (this.carDrag) {
        const st = this.carStep;
        this.carGoal = Math.round(this.carGoal / st) * st;
        this.carT = 0;
      }
      this.carDrag = null;
    };
    window.addEventListener("pointermove", this.onDragMove, { passive: true });
    window.addEventListener("pointerup", this.onDragUp, { passive: true });
    window.addEventListener("pointercancel", this.onDragUp, { passive: true });
  }

  wrapS(v, m) {
    if (!m) return v;
    v = ((v % m) + m) % m;
    return v > m / 2 ? v - m : v;
  }

  stackStep(vh, dt) {
    if (this.reduce) return;
    if (!this.cards.length || !this.voices || !this.voices._vis) return;
    const n = this.cards.length;
    const p = this.voices._p;
    const vw = window.innerWidth;
    const fit = this.voices._fit || 1;
    const cw = (this.cards[0] && this.cards[0].offsetWidth) || 620;
    const out = (vw * 0.55) / fit + cw * 0.62;

    // one card at a time, each sweeping in from the opposite side
    const s = this.seg(p, 0.04, 0.7) * (n - 1 + 0.34);
    // then all of them gather into a running carousel
    const cB = this.es(this.seg(p, 0.745, 0.95));
    this.carOn = cB;

    const csc = 0.72;
    const step = cw * csc + 26;
    const span = n * step;
    this.carStep = step;
    if (cB > 0.002) {
      if (this.carOff === null) {
        this.carOff = (n - 1) * step;
        this.carGoal = this.carOff;
      }
      // The carousel idles forward on its own, unless you're holding it.
      if (this.carDrag || this.carHover || this.amp === 0) this.carT = 0;
      else {
        this.carT = (this.carT || 0) + (dt || 0.016);
        if (this.carT > 3.4) {
          this.carT = 0;
          this.carGoal = Math.round(this.carGoal / step) * step - step;
        }
      }
      this.carOff += (this.carGoal - this.carOff) * 0.09;
    }

    this.cards.forEach((el, i) => {
      const dir = i % 2 === 0 ? 1 : -1;
      const t = s - i;
      const eout = this.es(this.cl((t - 0.34) / 0.8, 0, 1));
      const d = Math.min(Math.max(0, -t), 2.8);
      let x = d * -24 + dir * out * eout;
      let y = d * 15 - eout * 26;
      let rot = d * -3.2 + dir * 16 * eout;
      let sc = 1 - d * 0.05 - eout * 0.04;
      let op = this.cl((2.75 - d) / 0.5, 0, 1) * this.cl(1 - eout * 1.5, 0, 1);
      let z = t > 0 ? 20 : 12 - Math.round(d);
      if (cB > 0.002) {
        const cx = this.wrapS(i * step - this.carOff, span);
        const k = this.cl(1 - Math.abs(cx) / ((vw * 0.5) / fit + cw * 0.35), 0, 1);
        x = this.mix(x, cx, cB);
        y = this.mix(y, 0, cB);
        rot = this.mix(rot, 0, cB);
        sc = this.mix(sc, csc * (1 + 0.06 * k), cB);
        op = this.mix(op, 0.2 + 0.8 * Math.pow(k, 1.2), cB);
        z = Math.round(this.mix(z, 4 + k * 16, cB));
      }
      el.style.opacity = op.toFixed(3);
      el.style.zIndex = z;
      el.style.transform = `translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,0) rotate(${rot.toFixed(2)}deg) scale(${sc.toFixed(3)})`;
      el.setAttribute("aria-hidden", op < 0.15 ? "true" : "false");
    });

    this.carNav.forEach((b) => {
      b.style.opacity = (cB * 0.92).toFixed(3);
      b.style.pointerEvents = cB > 0.6 ? "auto" : "none";
    });
    if (this.hint1) this.hint1.style.opacity = (1 - cB).toFixed(3);
    if (this.hint2) this.hint2.style.opacity = cB.toFixed(3);
  }

  /* ============================ magnets ============================ */

  // CTAs drift toward a nearby cursor.
  magnetStep() {
    if (!this.fine || this.amp === 0) return;
    this.magnets.forEach((el) => {
      const r = el.getBoundingClientRect();
      if (!r.width || r.bottom < 0 || r.top > window.innerHeight) return;
      const dx = this.cx - (r.left + r.width / 2);
      const dy = this.cy - (r.top + r.height / 2);
      const d = Math.hypot(dx, dy);
      const k = Math.max(0, 1 - d / 150);
      el.style.transform = `translate(${(dx * 0.18 * k * this.amp).toFixed(1)}px,${(dy * 0.18 * k * this.amp).toFixed(1)}px) scale(${(1 + k * 0.06 * this.amp).toFixed(3)})`;
    });
  }

  // The footer wordmark scatters away from the cursor, letter by letter.
  footerStep(vh) {
    if (this.amp === 0) return;
    if (!this.fchars) {
      const host = document.querySelector("[data-footer-name]");
      if (!host) {
        this.fchars = [];
        return;
      }
      const text = host.textContent;
      host.textContent = "";
      this.fchars = [];
      text.split(" ").forEach((word, wi, arr) => {
        const wrap = document.createElement("span");
        wrap.style.cssText = "display:inline-block;white-space:nowrap";
        [...word].forEach((c) => {
          const s = document.createElement("span");
          s.style.cssText = "display:inline-block;white-space:pre;will-change:transform";
          s.textContent = c;
          wrap.appendChild(s);
          this.fchars.push(s);
        });
        host.appendChild(wrap);
        if (wi < arr.length - 1) host.appendChild(document.createTextNode(" "));
      });
      this.fhost = host;
    }
    if (!this.fchars.length || !this.fhost) return;
    const r = this.fhost.getBoundingClientRect();
    if (r.bottom < 0 || r.top > vh) return;
    this.fchars.forEach((s) => {
      const x = r.left + s.offsetLeft + s.offsetWidth / 2;
      const y = r.top + s.offsetTop + s.offsetHeight / 2;
      const dx = x - this.cx;
      const dy = y - this.cy;
      const d = Math.hypot(dx, dy);
      const k = Math.max(0, 1 - d / 190);
      s.style.transform = `translate(${(dx * 0.4 * k * this.amp).toFixed(1)}px,${(dy * 0.4 * k * this.amp).toFixed(1)}px) rotate(${(k * 8 * this.amp).toFixed(2)}deg)`;
    });
  }

  /* ============================ cursor dot ============================ */

  setupDot() {
    if (this.props.cursorDot === false || this.reduce || !this.fine) return;
    if (window.innerWidth < 901) return;
    const d = document.createElement("div");
    d.setAttribute("aria-hidden", "true");
    d.dataset.cursorDot = "";
    d.style.cssText =
      "position:fixed;top:0;left:0;width:13px;height:13px;margin:-6.5px 0 0 -6.5px;" +
      "border-radius:999px;background:var(--color-accent);z-index:120;pointer-events:none;" +
      `opacity:0;transition:opacity .3s ease,width .22s ${CB},height .22s ${CB},margin .22s ${CB};` +
      "will-change:transform";
    this.root.appendChild(d);
    this.dotEl = d;
    // The dot replaces the system cursor (see .cursor-dot-on in organic.css),
    // so only hide the real one once we know where the pointer actually is —
    // until the first move, mx/my are just a guess at the centre.
    this.root.classList.add("cursor-dot-on");
    const wake = () => {
      this.cWoke = true;
      d.style.opacity = "1";
      window.removeEventListener("pointermove", wake);
    };
    window.addEventListener("pointermove", wake, { passive: true, once: true });
    this.dotWake = wake;
    this.cDown = false;
    this.onDotDown = () => (this.cDown = true);
    this.onDotUp = () => (this.cDown = false);
    window.addEventListener("pointerdown", this.onDotDown, { passive: true });
    window.addEventListener("pointerup", this.onDotUp, { passive: true });
  }

  // The dot swells into a ring over anything interactive, and pinches on press.
  dotStep() {
    const d = this.dotEl;
    if (!d) return;
    d.style.transform = `translate3d(${this.mx.toFixed(1)}px,${this.my.toFixed(1)}px,0)`;
    const over = document.elementFromPoint(this.mx, this.my);
    const hot = !!(
      over &&
      over.closest &&
      over.closest("a,button,input,textarea,[data-tilt],[data-card]")
    );
    const size = this.cDown ? 9 : hot ? 26 : 13;
    if (this._cSize !== size) {
      this._cSize = size;
      d.style.width = `${size}px`;
      d.style.height = `${size}px`;
      d.style.margin = `${-size / 2}px 0 0 ${-size / 2}px`;
    }
    if (!this.cWoke) return;
    const op = hot ? "0.45" : "1";
    if (this._cOp !== op) {
      this._cOp = op;
      d.style.opacity = op;
    }
  }

  /* ============================ form ============================ */

  // Called by the React form once EmailJS actually confirms the send — the
  // design fired this on click, which would have celebrated failures too.
  playFormSuccess() {
    const bloom = this.q("[data-bloom]");
    const succ = this.q("[data-success]");
    const check = this.q("[data-check]");
    if (bloom) {
      bloom.style.transition = `transform 1.1s ${CB}`;
      bloom.style.transform = "scale(34)";
    }
    this.later(() => {
      if (succ) {
        succ.style.opacity = "1";
        succ.style.transform = "none";
      }
      if (check) check.style.strokeDashoffset = "0";
    }, 480);
  }
}
