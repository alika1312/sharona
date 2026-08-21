// Homepage motion controller — ported from the Claude Design "Organic v2"
// handoff (the <script type="text/x-dc"> component in the Sharona canvas).
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
// whose content is taller than the viewport unpin themselves (see
// measurePins) and fall back to a normal flowing layout.

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

  /* ============================ lifecycle ============================ */

  mount() {
    this.reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    this.fine = window.matchMedia("(hover: hover)").matches;
    this.amp = this.reduce ? 0 : (this.props.motion || "full") === "calm" ? 0.45 : 1;

    this.mx = window.innerWidth * 0.5;
    this.my = window.innerHeight * 0.4;
    this.sy = window.scrollY;
    this.velS = 0;
    this.mqX = 0;
    this.mqCycle = 0;

    this.onMove = (e) => {
      this.mx = e.clientX;
      this.my = e.clientY;
    };
    window.addEventListener("pointermove", this.onMove, { passive: true });
    this.onResize = () => {
      this.mqCycle = 0;
      this.deckM = null;
      this.pinsM = null;
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
    this.setupPath();

    this.pins = this.qa("[data-pin-sec]");
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
    this.marquee = this.q("[data-marquee]");
    this.gallery = this.q("[data-gallery]");
    this.track = this.q("[data-track]");
    this.gitems = this.qa("[data-gitem]");
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
      const y = window.scrollY;
      this.velS += (y - this.sy - this.velS) * 0.2;
      this.sy = y;

      this.pinPass(vh);
      this.revealPass(vh);
      this.blobField(t, vh);
      this.headWave(t, vh);
      this.marqueeStep(dt);
      this.wordsScrub(vh);
      this.aboutStep();
      this.stepsStep();
      this.servicesStep();
      this.contactStep();
      this.galleryStep(vh, vw);
      this.stackStep();
      this.parallaxStep(vh);
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
    this.timers.forEach(clearTimeout);
    this.timers = [];
    if (this.intro) this.intro.remove();
    if (this.dotEl) {
      this.dotEl.remove();
      window.removeEventListener("pointermove", this.dotWake);
      this.root.classList.remove("cursor-dot-on");
    }
    document.documentElement.style.overflow = "";
  }

  /* Hide the animated elements. Done from JS so the served HTML stays
     readable without it. */
  prime() {
    if (this.reduce) return;
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
    hide("[data-cform]", "translateY(70px) scale(.94)");
    this.qa("[data-cf]").forEach((el) => {
      el.style.opacity = "0";
      el.style.transform = "translateX(38px)";
    });
    this.qa("[data-ring]").forEach((el) => (el.style.opacity = "0"));
    const g = this.q("[data-ghost]");
    if (g) g.style.opacity = "0";
    const s = this.q("[data-spot]");
    if (s) s.style.opacity = "0";
  }

  /* ============================ pinning ============================ */

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
      let need = 0;
      [...inner.children].forEach((k) => {
        if (getComputedStyle(k).position === "absolute") return;
        need = Math.max(need, k.getBoundingClientRect().height);
      });
      el._need = need;
    });
    // Content taller than the viewport can't be pinned without clipping it,
    // so those sections fall back to normal flow (see organic.css).
    pins.forEach((el) => {
      if (narrow || this.reduce || el._need > vh - 24) el.dataset.unpin = "1";
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
      el._vis = r.bottom > -160 && r.top < vh + 160;
      if (!el._vis) return;
      el._p = el._flow
        ? this.cl((vh * 0.82 - r.top) / (r.height * 0.5 || 1), 0, 1)
        : this.cl(-r.top / (r.height - vh || 1), 0, 1);
    });
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
    this.revealPass(window.innerHeight);
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
  }

  /* ============================ reveal ============================ */

  revealPass(vh) {
    if (!this.reveals || !this.reveals.length) return;
    this.reveals = this.reveals.filter((el) => {
      const r = el.getBoundingClientRect();
      if (!(r.top < vh * 0.9 && r.bottom > -40)) return true;
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
      const c = r.top + r.height / 2 - vh / 2;
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
    this.blobs.forEach((b) => {
      const dx = Math.sin(t * 0.27 + b.ph) * 44 * this.amp;
      const dy = Math.cos(t * 0.21 + b.ph * 1.3) * 38 * this.amp;
      const s = 1 + Math.sin(t * 0.42 + b.ph) * 0.07 * this.amp;
      b.el.style.transform = `translate3d(${dx.toFixed(1)}px,${dy.toFixed(1)}px,0) scale(${s.toFixed(3)})`;
    });
  }

  // Headline characters bob on a slow sine wave.
  headWave(t, vh) {
    if (!this.headReady || !this.chars.length || !this.charHost || this.amp === 0) return;
    const r = this.charHost.getBoundingClientRect();
    if (r.bottom < -60 || r.top > vh + 60) return;
    this.chars.forEach((c, i) => {
      const wave = Math.sin(t * 1.15 + i * 0.4) * 4.5;
      c.el.style.transform = `translateY(${(wave * this.amp).toFixed(2)}px)`;
    });
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
        if (r.bottom < -60 || r.top > vh + 60) return;
        p = this.cl((vh * 0.88 - r.top) / (r.height + vh * 0.2), 0, 1);
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
        // Hand the card back to CSS once it has landed, so :hover works.
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
    const sk = this.cl(this.velS * 0.06, -4, 4) * this.amp;
    this.gitems.forEach((it, i) => {
      const ir = it.getBoundingClientRect();
      const k = Math.max(
        0,
        1 - Math.abs(ir.left + ir.width / 2 - vw / 2) / (vw * 0.52)
      );
      it.style.opacity = (0.42 + k * 0.58).toFixed(3);
      it.style.transform = `skewY(${sk.toFixed(2)}deg) translateY(${(Math.sin(p * 6 + i) * 10 * this.amp).toFixed(1)}px) scale(${(0.88 + k * 0.14).toFixed(3)})`;
    });
  }

  /* ============================ testimonial stack ============================ */

  setupStack() {
    this.cards = this.qa("[data-card]");
    this.voices = this.q("#voices");
    this.fsm = null;
  }

  stackStep() {
    if (this.reduce) return;
    if (!this.cards.length || !this.voices || !this.voices._vis) return;
    const n = this.cards.length;
    const p = this.voices._p;
    const f = this.cl((p - 0.1) / 0.68, 0, 1) * (n - 1);
    // Smooth the target so a flicked scroll doesn't snap the deck.
    this.fsm = this.fsm === null ? f : this.fsm + (f - this.fsm) * 0.16;
    const cw = (this.cards[0] && this.cards[0].offsetWidth) || 620;
    const ff = this.fsm;
    const out = window.innerWidth * 0.55 + cw * 0.5 + 320;
    this.cards.forEach((el, i) => {
      const pos = i - ff;
      let x, y, rot, sc, z;
      let op = 1;
      if (pos >= 0) {
        // still in the deck, stacked behind the front card
        const d = Math.min(pos, 2.8);
        x = d * -26;
        y = d * 16;
        rot = d * -3.4;
        sc = 1 - d * 0.055;
        op = pos > 2.5 ? 0 : 1;
        z = 10 - Math.round(d);
      } else {
        // flying off
        const t = Math.min(1, -pos);
        const e = t * t * (3 - 2 * t);
        x = e * out;
        y = -e * 30;
        rot = e * 17;
        sc = 1 - e * 0.05;
        op = this.cl(1 - e * 1.5, 0, 1);
        z = 20;
      }
      el.style.opacity = op.toFixed(3);
      el.style.zIndex = z;
      el.style.transform = `translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,0) rotate(${rot.toFixed(2)}deg) scale(${sc.toFixed(3)})`;
      el.setAttribute("aria-hidden", op < 0.15 ? "true" : "false");
    });
  }

  /* ============================ cursor dot ============================ */

  setupDot() {
    if (this.props.cursorDot === false || this.reduce || !this.fine) return;
    const d = document.createElement("div");
    d.setAttribute("aria-hidden", "true");
    d.dataset.cursorDot = "";
    d.style.cssText =
      "position:fixed;top:0;left:0;width:10px;height:10px;margin:-5px 0 0 -5px;" +
      "border-radius:50%;background:var(--color-accent);z-index:88;pointer-events:none;" +
      "opacity:0;transition:opacity .25s ease";
    this.root.appendChild(d);
    this.dotEl = d;
    // The dot replaces the system cursor (see .cursor-dot-on in organic.css),
    // so only hide the real one once we know where the pointer actually is —
    // until the first move, mx/my are just a guess at the centre.
    this.root.classList.add("cursor-dot-on");
    const wake = () => {
      d.style.opacity = "1";
      window.removeEventListener("pointermove", wake);
    };
    window.addEventListener("pointermove", wake, { passive: true, once: true });
    this.dotWake = wake;
  }

  dotStep() {
    if (!this.dotEl) return;
    this.dotEl.style.transform = `translate(${this.mx.toFixed(1)}px,${this.my.toFixed(1)}px)`;
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
