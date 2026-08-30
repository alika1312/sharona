import { readFileSync } from 'node:fs';
import { JSDOM } from 'jsdom';

const html = readFileSync(new URL('../dist/index.html', import.meta.url), 'utf8');
const dom = new JSDOM(html, { pretendToBeVisual: true, url: 'https://x/' });
const { window } = dom;
global.window = window;
global.document = window.document;
global.requestAnimationFrame = window.requestAnimationFrame.bind(window);
global.cancelAnimationFrame = window.cancelAnimationFrame.bind(window);
global.getComputedStyle = window.getComputedStyle.bind(window);

window.matchMedia = (q) => ({ matches: /hover: hover/.test(q), addEventListener() {}, removeEventListener() {} });
window.scrollTo = ({ top }) => { Object.defineProperty(window, 'scrollY', { value: top, writable: true, configurable: true }); };
Object.defineProperty(window, 'scrollY', { value: 0, writable: true, configurable: true });
Object.defineProperty(window, 'innerWidth', { value: 1440, writable: true, configurable: true });
Object.defineProperty(window, 'innerHeight', { value: 900, writable: true, configurable: true });
window.document.elementFromPoint = () => window.document.body;

// jsdom has no SVG geometry
const proto = window.SVGElement.prototype;
proto.getTotalLength = () => 1200;
proto.getPointAtLength = (l) => ({ x: 905 - (l / 1200) * 750, y: 46 });

// give every element a plausible box so the choreography actually executes
let i = 0;
window.Element.prototype.getBoundingClientRect = function () {
  i++;
  const h = this.tagName === 'SECTION' ? 2400 : 300;
  const top = (i % 7) * 120 - 200;
  return { x: 40, y: top, top, left: 40, right: 640, bottom: top + h, width: 600, height: h, toJSON() {} };
};
Object.defineProperty(window.HTMLElement.prototype, 'offsetWidth', { get: () => 600, configurable: true });
Object.defineProperty(window.HTMLElement.prototype, 'offsetHeight', { get: () => 300, configurable: true });
Object.defineProperty(window.HTMLElement.prototype, 'offsetLeft', { get: () => 30, configurable: true });
Object.defineProperty(window.HTMLElement.prototype, 'offsetTop', { get: () => 20, configurable: true });
Object.defineProperty(window.HTMLElement.prototype, 'scrollWidth', { get: () => 1800, configurable: true });

const root = window.document.querySelector('.organic-v2');
if (!root) throw new Error('root not found in prerendered HTML');

const errs = [];
window.addEventListener('error', (e) => errs.push('window error: ' + e.message));

const { createHomeMotion } = await import('../src/design/motion.js?' + Date.now());
const m = createHomeMotion(root, { motion: 'full', snapSections: true, showIntro: false, cursorDot: true });

// drive the page through every section, both directions, with wheel input
const frame = () => new Promise((r) => setTimeout(r, 4));
const wheel = (dy) => window.dispatchEvent(new window.WheelEvent('wheel', { deltaY: dy, cancelable: true }));
const move = (x, y) => window.dispatchEvent(new window.MouseEvent('pointermove', { clientX: x, clientY: y }));

try {
  for (let y = 0; y <= 24000; y += 300) {
    window.scrollY = y;
    wheel(120);
    move((y / 60) % 1400, (y / 40) % 880);
    await frame();
  }
  for (let y = 24000; y >= 0; y -= 600) {
    window.scrollY = y;
    wheel(-120);
    await frame();
  }
  // keyboard + carousel nav + FAQ remeasure
  window.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'ArrowRight' }));
  window.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'ArrowLeft' }));
  window.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'PageDown' }));
  root.querySelectorAll('[data-carnav]').forEach((b) => b.click());
  m.remeasure();
  await frame();
  Object.defineProperty(window, 'innerWidth', { value: 700, writable: true, configurable: true });
  window.dispatchEvent(new window.Event('resize'));
  for (let k = 0; k < 20; k++) { window.scrollY = k * 500; await frame(); }
  m.destroy();
} catch (e) {
  errs.push('THROW: ' + e.stack);
}

// NaN in any inline style means a broken transform
const bad = [...root.querySelectorAll('*')]
  .filter((el) => /NaN|undefined|Infinity/.test(el.getAttribute('style') || ''))
  .slice(0, 6)
  .map((el) => `${el.tagName}[${[...el.attributes].map(a => a.name).filter(n => n.startsWith('data-')).join(',')}]: ${el.getAttribute('style').slice(0, 160)}`);

console.log(errs.length ? 'ERRORS:\n' + errs.join('\n') : 'no exceptions');
console.log(bad.length ? 'BAD STYLES:\n' + bad.join('\n') : 'no NaN/undefined in inline styles');
