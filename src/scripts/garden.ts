// The garden at the foot of the page, drawn entirely out of 0s and 1s. The scene is
// painted at one pixel per character cell, then shown through a sheet of digits, so
// each digit takes the colour of whatever is behind it. It sprouts the first time it
// scrolls into view, sways in a gentle wind, sheds petals when it's brushed or swiped
// through, and a tap on a bare flower grows them back.
// After the header of Sam Rose's Bloom Filters post: https://samwho.dev/bloom-filters

type RGB = [number, number, number];

interface Point {
  x: number;
  y: number;
  // Seconds, from the event's timestamp.
  t: number;
}

// The scene is laid out in world units: an 800-wide bed of flowers, centred on the
// page, scaled so that WORLD_HEIGHT fills the band. Soil and grass run to both edges.
const ART_WIDTH = 800;
const WORLD_HEIGHT = 294;
const GROUND = 280;
// Each character cell covers 5 × 7 world units, which makes the soil the bottom two rows.
const CELL_WIDTH = 5;
const CELL_HEIGHT = 7;
const ROWS = WORLD_HEIGHT / CELL_HEIGHT;

interface FlowerSpec {
  // Where the stem meets the soil.
  x: number;
  // Stem length once grown.
  height: number;
  // Scale of the head.
  size: number;
  // Resting tilt, in degrees.
  lean: number;
  // Index into the --garden-bloom colours.
  color: number;
}

// Heights alternate so neighbouring heads don't overlap, even swaying.
const FLOWERS: FlowerSpec[] = [
  { x: 78, height: 118, size: 0.78, lean: -8, color: 1 },
  { x: 168, height: 190, size: 0.92, lean: -5, color: 0 },
  { x: 262, height: 132, size: 0.82, lean: -3, color: 2 },
  { x: 352, height: 212, size: 1, lean: -1, color: 1 },
  { x: 446, height: 150, size: 0.86, lean: 2, color: 0 },
  { x: 536, height: 204, size: 0.96, lean: 3, color: 2 },
  { x: 630, height: 126, size: 0.8, lean: 5, color: 1 },
  { x: 722, height: 176, size: 0.9, lean: 7, color: 0 },
];

// A head is a ring of petals around a centre, like a daisy: few enough, with gaps
// wide enough, that each petal still reads at one colour per digit. `base` is how far
// out from the centre a petal starts. More rings can be added, outermost first.
const RINGS = [{ count: 9, base: 8, length: 44, width: 14, turn: 0 }];
const CENTER_RADIUS = 13;
const HEAD_RADIUS = Math.max(...RINGS.map((ring) => ring.base + ring.length));

// Every petal on a head, outer ring first so the inner ring draws on top. They open
// from the middle out, so `order` counts the inner ring first.
const PETALS = RINGS.flatMap((ring, r) =>
  Array.from({ length: ring.count }, (_, i) => ({
    ring: r,
    angle: (i / ring.count) * Math.PI * 2 + ring.turn,
    order: RINGS.slice(r + 1).reduce((sum, inner) => sum + inner.count, 0) + i,
  })),
);

// Leaves up each stem, as a fraction of its length, and the side they grow on.
const LEAVES = [
  { at: 0.3, side: -1, length: 40 },
  { at: 0.52, side: 1, length: 33 },
];

// Light falls from the top left, so petals facing it are drawn a little stronger.
const LIGHT = -Math.PI / 4;

// Seconds after a flower sprouts: the stem grows, then the bud forms, then the petals open.
const STEM_TIME = 1.1;
const BUD_AT = 0.7;
const OPEN_AT = 0.9;
const PETAL_TIME = 0.6;
const PETAL_STAGGER = 0.035;
const REGROW_STAGGER = 0.05;
const GROWN = OPEN_AT + (PETALS.length - 1) * PETAL_STAGGER + PETAL_TIME;
// World units a second the soil spreads out from the middle when the garden is planted.
const SOIL_SPEED = 1100;

// Sway, in degrees. The wind alone moves a flower a few degrees; a hard swipe can take
// it to MAX_BEND. Shaking builds up energy, and past SHED_ENERGY a petal comes loose.
const WIND_BEND = 4;
const MAX_BEND = 32;
const MAX_SWAY = 200;
const DAMPING = 0.28;
const SHED_ENERGY = 55;
const SHED_GAP = 0.15;
// A flower left bare grows its petals back by itself after this many seconds.
const REGROW_AFTER = 30;

// Loose petals: how fast they fall, and how many are kept before the oldest go.
const GRAVITY = 110;
const MAX_PETALS = 160;

const TAU = Math.PI * 2;
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const smooth = (value: number) => {
  const t = clamp(value, 0, 1);
  return t * t * (3 - 2 * t);
};
const easeOut = (value: number) => 1 - (1 - clamp(value, 0, 1)) ** 3;
// Overshoots a little before settling, so a petal pops open.
const pop = (value: number) => {
  const t = clamp(value, 0, 1) - 1;
  return 1 + 2.4 * t ** 3 + 1.4 * t ** 2;
};
const rgba = ([r, g, b]: RGB, alpha: number) => `rgb(${r} ${g} ${b} / ${alpha})`;

// A repeatable pseudo-random number in [0, 1) for an integer and a seed.
const hash = (n: number, seed: number) => {
  let h = Math.imul(n ^ Math.imul(seed, 0x9e3779b1), 0x85ebca6b);
  h = Math.imul(h ^ (h >>> 13), 0xc2b2ae35);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
};

// Smooth noise in [-1, 1]: random values at whole numbers, eased between.
const noise = (x: number, seed: number) => {
  const i = Math.floor(x);
  const a = hash(i, seed) * 2 - 1;
  const b = hash(i + 1, seed) * 2 - 1;
  return a + (b - a) * smooth(x - i);
};

// The wind at a place and time, roughly between -1.5 and 1.5. A slow swell with gusts
// on top, delayed across the page so each gust rolls through from the left.
const wind = (x: number, time: number) => {
  const t = time - x / 500;
  return Math.sin(t * 0.8) * 0.45 + noise(t * 0.45, 1) * 0.8 + noise(time * 1.7 + x / 90, 2) * 0.2;
};

const distanceToSegment = (x: number, y: number, a: Point, b: Point) => {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const lengthSquared = dx * dx + dy * dy;
  const t = lengthSquared === 0 ? 0 : clamp(((x - a.x) * dx + (y - a.y) * dy) / lengthSquared, 0, 1);
  return Math.hypot(x - a.x - t * dx, y - a.y - t * dy);
};

// A petal from its base at (0, 0) to its tip at (0, -length), widest about two thirds out.
const petalPath = (length: number, width: number) => {
  const w = width * 0.65;
  const path = new Path2D();
  path.moveTo(0, 0);
  path.bezierCurveTo(w * 0.9, -length * 0.2, w * 1.15, -length * 0.95, 0, -length);
  path.bezierCurveTo(-w * 1.15, -length * 0.95, -w * 0.9, -length * 0.2, 0, 0);
  return path;
};
const PETAL_PATHS = RINGS.map((ring) => petalPath(ring.length, ring.width));

// A leaf one unit long, pointing along +x with its fuller edge on top.
const LEAF_PATH = new Path2D();
LEAF_PATH.moveTo(0, 0);
LEAF_PATH.bezierCurveTo(0.25, -0.32, 0.7, -0.3, 1, 0);
LEAF_PATH.bezierCurveTo(0.7, 0.14, 0.3, 0.16, 0, 0);

interface Flower extends FlowerSpec {
  // Its place in FLOWERS, which seeds the small differences between its petals.
  seed: number;
  // Garden time at which it starts to grow.
  sprout: number;
  // Current sway away from the lean, in degrees, and how fast it's changing.
  bend: number;
  sway: number;
  energy: number;
  // Direction of the last push, so shaking back and forth counts for more.
  lastPush: number;
  lastShed: number;
  // Indexes into PETALS of the petals it has lost.
  missing: Set<number>;
  // Set while lost petals grow back.
  regrowAt?: number;
}

// Each petal is turned and stretched a little, differently on every flower, so the
// heads don't look stamped out.
const petalTweak = (flower: Flower, index: number) => ({
  turn: (hash(flower.seed * 64 + index, 5) - 0.5) * 0.14,
  stretch: 0.9 + hash(flower.seed * 64 + index, 6) * 0.2,
});

interface Petal {
  // Middle of the petal, in world units.
  x: number;
  y: number;
  vx: number;
  vy: number;
  angle: number;
  spin: number;
  // The angle it turns to once lying on the ground.
  rest?: number;
  // Offsets its flutter from the other petals'.
  phase: number;
  ring: number;
  size: number;
  color: number;
  settled: boolean;
}

// Reads a CSS colour into RGB by painting it, so any syntax the browser knows works.
const swatch = Object.assign(document.createElement('canvas'), { width: 1, height: 1 }).getContext('2d', {
  willReadFrequently: true,
})!;
const parseColor = (value: string): RGB => {
  swatch.fillStyle = '#000';
  swatch.fillStyle = value || '#000';
  swatch.clearRect(0, 0, 1, 1);
  swatch.fillRect(0, 0, 1, 1);
  const [r, g, b] = swatch.getImageData(0, 0, 1, 1).data;
  return [r, g, b];
};

export class Garden {
  private readonly host: HTMLElement;
  private readonly canvas: HTMLCanvasElement;
  private readonly context: CanvasRenderingContext2D;
  // The scene at one pixel per cell.
  private readonly cells = document.createElement('canvas');
  private readonly cellContext: CanvasRenderingContext2D;
  // A digit in every cell, at full resolution. The cells show through these.
  private readonly glyphs = document.createElement('canvas');

  private readonly flowers: Flower[];
  // Drawn back to front: the tallest stand behind.
  private readonly backToFront: Flower[];
  private petals: Petal[] = [];

  // Seconds since the garden was planted. Only runs while it's animating.
  private time = 0;
  private planted = false;
  private visible = false;
  private reduced: boolean;
  private frame = 0;
  private lastFrame = 0;

  // CSS pixels per world unit, device pixels per CSS pixel, and the band's CSS size.
  private scale = 1;
  private ratio = 1;
  private width = 0;
  private height = 0;
  // Cells are laid out from the middle of the band, so the digits stay put around the
  // flowers as the window resizes. `left` is the world x of the first cell's left edge.
  private columns = 0;
  private left = 0;

  private stem: RGB = [0, 0, 0];
  private center: RGB = [0, 0, 0];
  private soilFill: CanvasGradient | string = '';
  // Per bloom colour, a gradient for each ring's petal shape.
  private petalFills: CanvasGradient[][] = [];

  private pointer?: Point;
  private press?: { x: number; y: number; moved: boolean; flower?: Flower };

  constructor(host: HTMLElement) {
    this.host = host;
    this.canvas = host.querySelector('canvas')!;
    this.context = this.canvas.getContext('2d')!;
    this.cellContext = this.cells.getContext('2d')!;

    this.flowers = FLOWERS.map((spec, i) => ({
      ...spec,
      seed: i,
      // Flowers come up from the middle outwards, each a little out of step.
      sprout: 0.25 + Math.abs(spec.x - ART_WIDTH / 2) / 400 + hash(i, 3) * 0.12,
      bend: 0,
      sway: 0,
      energy: 0,
      lastPush: 0,
      lastShed: -Infinity,
      missing: new Set(),
    }));
    this.backToFront = [...this.flowers].sort((a, b) => b.height - a.height);

    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    this.reduced = motion.matches;
    motion.addEventListener('change', () => {
      this.reduced = motion.matches;
      this.settle();
    });

    // Colours follow the theme: one picked with the theme switch, or the system's.
    const repaint = () => {
      this.readColors();
      if (!this.frame) this.paint();
    };
    new MutationObserver(repaint).observe(document.documentElement, { attributeFilter: ['data-theme'] });
    matchMedia('(prefers-color-scheme: dark)').addEventListener('change', repaint);

    new ResizeObserver(() => {
      if (this.layout()) this.paint();
    }).observe(host);

    // Runs only while on screen. It's planted once at least half of it is in view,
    // so the growing is seen rather than over before the visitor scrolls down.
    new IntersectionObserver(
      ([entry]) => {
        this.visible = entry.isIntersecting;
        if (entry.intersectionRatio >= 0.5) this.planted = true;
        if (this.visible) this.start();
        else this.stop();
      },
      { threshold: [0, 0.5] },
    ).observe(host);

    this.canvas.addEventListener('pointerdown', this.pointerDown);
    this.canvas.addEventListener('pointermove', this.pointerMove);
    this.canvas.addEventListener('pointerup', this.pointerUp);
    this.canvas.addEventListener('pointerleave', this.pointerEnd);
    this.canvas.addEventListener('pointercancel', this.pointerEnd);

    this.readColors();
    this.layout();
    this.settle();
  }

  // With reduced motion the garden is drawn once, fully grown and still.
  private settle() {
    if (!this.reduced) {
      this.start();
      return;
    }
    this.stop();
    this.planted = true;
    this.time = Math.max(...this.flowers.map((flower) => flower.sprout)) + GROWN;
    this.petals = [];
    for (const flower of this.flowers) {
      flower.bend = flower.sway = flower.energy = 0;
      flower.missing.clear();
      flower.regrowAt = undefined;
    }
    this.canvas.style.cursor = '';
    this.paint();
  }

  private start() {
    if (this.frame || this.reduced || !this.visible || !this.planted) return;
    this.lastFrame = performance.now();
    this.frame = requestAnimationFrame(this.tick);
  }

  private stop() {
    cancelAnimationFrame(this.frame);
    this.frame = 0;
  }

  private tick = (now: number) => {
    // Capped, so coming back to the tab doesn't jump the garden ahead.
    this.update(clamp((now - this.lastFrame) / 1000, 0, 1 / 20));
    this.lastFrame = now;
    this.paint();
    this.frame = requestAnimationFrame(this.tick);
  };

  // Sizes the canvases to the band. Returns whether anything changed.
  private layout() {
    const { width, height } = this.host.getBoundingClientRect();
    const ratio = window.devicePixelRatio || 1;
    if (!width || !height || (width === this.width && height === this.height && ratio === this.ratio)) return false;
    this.width = width;
    this.height = height;
    this.ratio = ratio;
    this.scale = height / WORLD_HEIGHT;

    const half = Math.ceil(width / 2 / (CELL_WIDTH * this.scale));
    this.columns = half * 2;
    this.left = ART_WIDTH / 2 - half * CELL_WIDTH;

    this.canvas.width = Math.round(width * ratio);
    this.canvas.height = Math.round(height * ratio);
    this.cells.width = this.columns;
    this.cells.height = ROWS;
    // Resizing a canvas resets its state, so the scene's transform is set again: world
    // units in, one pixel per cell out.
    this.cellContext.setTransform(1 / CELL_WIDTH, 0, 0, 1 / CELL_HEIGHT, -this.left / CELL_WIDTH, 0);
    this.drawGlyphs();
    return true;
  }

  // Fills the glyph sheet with a 0 or 1 in every cell. Each digit is drawn once and
  // stamped, which is much quicker than drawing text thousands of times.
  private drawGlyphs() {
    const { canvas, glyphs, columns } = this;
    glyphs.width = canvas.width;
    glyphs.height = canvas.height;
    const cellWidth = CELL_WIDTH * this.scale * this.ratio;
    const cellHeight = canvas.height / ROWS;
    const gridX = canvas.width / 2 - (columns / 2) * cellWidth;

    const spriteWidth = Math.ceil(cellWidth);
    const spriteHeight = Math.ceil(cellHeight);
    let baseline = 0;
    const sprites = ['0', '1'].map((digit) => {
      const sprite = Object.assign(document.createElement('canvas'), { width: spriteWidth, height: spriteHeight });
      const context = sprite.getContext('2d')!;
      context.font = `800 ${cellHeight * 0.9}px system-ui, sans-serif`;
      context.textAlign = 'center';
      // Both digits share the 0's baseline, centred in the cell.
      if (!baseline) {
        const metrics = context.measureText('0');
        baseline = (spriteHeight + metrics.actualBoundingBoxAscent - metrics.actualBoundingBoxDescent) / 2;
      }
      context.fillText(digit, spriteWidth / 2, baseline);
      return sprite;
    });

    const context = glyphs.getContext('2d')!;
    for (let row = 0; row < ROWS; row++) {
      const y = Math.round(row * cellHeight + (cellHeight - spriteHeight) / 2);
      for (let column = 0; column < columns; column++) {
        const x = Math.round(gridX + column * cellWidth + (cellWidth - spriteWidth) / 2);
        // Seeded by the cell's place relative to the middle, so resizing keeps the pattern.
        context.drawImage(sprites[hash(column - columns / 2, row + 1) < 0.5 ? 0 : 1], x, y);
      }
    }
  }

  private readColors() {
    const style = getComputedStyle(this.host);
    const read = (token: string) => parseColor(style.getPropertyValue(token).trim());
    this.stem = read('--garden-stem');
    this.center = read('--garden-center');

    const soil = read('--garden-soil');
    const soilFill = this.cellContext.createLinearGradient(0, GROUND, 0, WORLD_HEIGHT);
    soilFill.addColorStop(0, rgba(soil, 1));
    soilFill.addColorStop(1, rgba(soil, 0.4));
    this.soilFill = soilFill;

    // In each petal's own coordinates, paler towards the base where the petals crowd
    // together, so each one still reads on its own.
    this.petalFills = [1, 2, 3].map((n) => {
      const color = read(`--garden-bloom-${n}`);
      return RINGS.map(({ length }) => {
        const fill = this.cellContext.createLinearGradient(0, 0, 0, -length);
        fill.addColorStop(0, rgba(color, 0.4));
        fill.addColorStop(0.5, rgba(color, 0.9));
        fill.addColorStop(1, rgba(color, 1));
        return fill;
      });
    });
  }

  // Where a flower's head is right now, and how far along it is.
  private pose(flower: Flower) {
    const age = this.time - flower.sprout;
    const grown = easeOut(age / STEM_TIME);
    const angle = ((flower.lean + flower.bend) * Math.PI) / 180;
    const length = flower.height * grown;
    return { age, grown, angle, x: flower.x + Math.sin(angle) * length, y: GROUND - Math.cos(angle) * length };
  }

  // How open a petal is, from 0 to a little over 1 as it pops. Lost petals stay at 0
  // until the flower regrows them.
  private petalOpen(flower: Flower, index: number, age: number) {
    const { order } = PETALS[index];
    if (!flower.missing.has(index)) return pop((age - OPEN_AT - order * PETAL_STAGGER) / PETAL_TIME);
    if (flower.regrowAt === undefined) return 0;
    return pop((this.time - flower.regrowAt - order * REGROW_STAGGER) / PETAL_TIME);
  }

  private update(dt: number) {
    this.time += dt;
    const { time } = this;

    for (const flower of this.flowers) {
      const { grown } = this.pose(flower);
      // A damped spring pulled towards where the wind would hold it. Taller stems are
      // slower and sway further. Small steps keep a hard flick stable.
      const omega = TAU / (1.1 + flower.height / 250);
      const target = wind(flower.x, time) * WIND_BEND * (0.5 + flower.height / 400) * grown;
      const steps = Math.ceil(dt * 120);
      for (let i = 0; i < steps; i++) {
        const h = dt / steps;
        flower.sway += (omega * omega * (target - flower.bend) - 2 * DAMPING * omega * flower.sway) * h;
        flower.bend += flower.sway * h;
        if (Math.abs(flower.bend) > MAX_BEND) {
          flower.bend = Math.sign(flower.bend) * MAX_BEND;
          flower.sway *= -0.3;
        }
      }
      flower.energy *= Math.exp(-dt * 2);

      if (flower.regrowAt !== undefined) {
        if (time - flower.regrowAt > PETAL_TIME + (PETALS.length - 1) * REGROW_STAGGER) {
          flower.missing.clear();
          flower.regrowAt = undefined;
        }
      } else if (flower.missing.size > 0 && time - flower.lastShed > REGROW_AFTER) {
        this.regrow(flower);
      }
    }

    const right = this.left + this.columns * CELL_WIDTH;
    let lost = false;
    for (const petal of this.petals) {
      if (petal.settled) {
        if (petal.rest !== undefined) petal.angle += (petal.rest - petal.angle) * Math.min(1, dt * 8);
        continue;
      }
      // Drifts with the wind and flutters side to side, falling at a gentle terminal speed.
      const breeze = wind(petal.x, time) * 45;
      petal.vx += ((breeze - petal.vx) * 1.2 + Math.sin(time * 3 + petal.phase) * 30) * dt;
      petal.vy += (GRAVITY - petal.vy * 0.6) * dt;
      petal.x += petal.vx * dt;
      petal.y += petal.vy * dt;
      petal.angle += (petal.spin + Math.sin(time * 2.2 + petal.phase) * 0.9) * dt;
      if (petal.vy > 0 && petal.y >= GROUND - 3) this.land(petal);
      if (petal.x < this.left - HEAD_RADIUS || petal.x > right + HEAD_RADIUS) lost = true;
    }
    if (lost) this.petals = this.petals.filter((petal) => petal.x >= this.left - HEAD_RADIUS && petal.x <= right + HEAD_RADIUS);
  }

  private land(petal: Petal) {
    petal.y = GROUND - 3 + Math.random() * 4;
    petal.vx = petal.vy = 0;
    petal.settled = true;
    // Lies flat, turning to whichever way round is nearer.
    petal.rest = Math.round((petal.angle - Math.PI / 2) / Math.PI) * Math.PI + Math.PI / 2 + (Math.random() - 0.5) * 0.4;
  }

  private shed(flower: Flower) {
    const left = PETALS.map((_, i) => i).filter((i) => !flower.missing.has(i));
    if (left.length === 0) return;
    // The outer ring goes first.
    const ring = Math.min(...left.map((i) => PETALS[i].ring));
    const choices = left.filter((i) => PETALS[i].ring === ring);
    const index = choices[Math.floor(Math.random() * choices.length)];
    flower.missing.add(index);
    flower.lastShed = this.time;

    const { angle, x, y } = this.pose(flower);
    const { base, length } = RINGS[PETALS[index].ring];
    const { turn, stretch } = petalTweak(flower, index);
    const direction = PETALS[index].angle + turn + angle * 0.8;
    const reach = (base + (length * stretch) / 2) * flower.size;
    // Part of the head's speed across its arc, so the petal carries on the way it was swinging.
    const swing = clamp(((flower.sway * Math.PI) / 180) * flower.height * 0.6, -140, 140);
    this.petals.push({
      x: x + Math.sin(direction) * reach,
      y: y - Math.cos(direction) * reach,
      vx: Math.cos(angle) * swing + (Math.random() - 0.5) * 30,
      vy: Math.sin(angle) * swing - 30 - Math.random() * 40,
      angle: direction,
      spin: (Math.random() - 0.5) * 6,
      phase: Math.random() * TAU,
      ring: PETALS[index].ring,
      size: flower.size,
      color: flower.color,
      settled: false,
    });
    if (this.petals.length > MAX_PETALS) {
      const oldest = this.petals.findIndex((petal) => petal.settled);
      this.petals.splice(Math.max(0, oldest), 1);
    }
  }

  private regrow(flower: Flower) {
    if (flower.missing.size === 0 || flower.regrowAt !== undefined) return;
    flower.regrowAt = this.time;
    flower.energy = 0;
  }

  // The nearest open flower whose head is under a point.
  private flowerAt(point: Point) {
    let nearest: Flower | undefined;
    let best = Infinity;
    for (const flower of this.flowers) {
      const { age, x, y } = this.pose(flower);
      const distance = Math.hypot(point.x - x, point.y - y);
      if (age > GROWN && distance < HEAD_RADIUS * flower.size + 8 && distance < best) {
        nearest = flower;
        best = distance;
      }
    }
    return nearest;
  }

  // A pointer moved from one point to another through the garden. Flowers near its
  // path are pushed along with it, and fallen petals near it are kicked up.
  private brush(from: Point, to: Point) {
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    if (dx === 0 && dy === 0) return;
    const speed = Math.hypot(dx, dy) / Math.max(to.t - from.t, 1 / 240);
    // Faster movements push harder.
    const force = Math.min(3, speed / 500);

    for (const flower of this.flowers) {
      const pose = this.pose(flower);
      const head = 1 - distanceToSegment(pose.x, pose.y, from, to) / (HEAD_RADIUS * flower.size + 14);
      const stemX = (flower.x + pose.x) / 2;
      const stemY = (GROUND + pose.y) / 2;
      const stem = (1 - distanceToSegment(stemX, stemY, from, to) / 24) * 0.6;
      const reach = Math.max(head, stem, 0) * pose.grown;
      if (reach === 0) continue;

      const push = (clamp(dx, -40, 40) * reach * force * 1.1) / flower.size;
      flower.sway = clamp(flower.sway + push, -MAX_SWAY, MAX_SWAY);
      const direction = Math.sign(push);
      const shake = direction !== 0 && direction !== flower.lastPush ? 1.5 : 1;
      if (direction !== 0) flower.lastPush = direction;
      flower.energy = Math.min(120, flower.energy + Math.abs(push) * shake);
      if (
        flower.energy > SHED_ENERGY &&
        Math.abs(flower.sway) > 25 &&
        this.time - flower.lastShed > SHED_GAP &&
        pose.age > GROWN &&
        flower.regrowAt === undefined
      ) {
        this.shed(flower);
        flower.energy -= 30;
      }
    }

    // Petals in the air are carried along a little. Fallen ones are flicked back up, but
    // only by a quick pass: a slow one leaves them where they lie.
    const along = (dx / Math.hypot(dx, dy)) * Math.min(speed, 600) * 0.5;
    for (const petal of this.petals) {
      const reach = 1 - distanceToSegment(petal.x, petal.y, from, to) / 24;
      if (reach <= 0) continue;
      if (petal.settled) {
        if (speed < 300) continue;
        petal.settled = false;
        petal.rest = undefined;
        petal.vy = -Math.min(160, 40 + speed * 0.08) * reach;
      }
      petal.vx += (along - petal.vx) * reach * 0.5;
      petal.spin += (Math.random() - 0.5) * 6 * reach;
    }
  }

  private toWorld(event: PointerEvent): Point {
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: ART_WIDTH / 2 + (event.clientX - rect.left - rect.width / 2) / this.scale,
      y: (event.clientY - rect.top) / this.scale,
      t: event.timeStamp / 1000,
    };
  }

  private get interactive() {
    return !this.reduced && this.frame !== 0;
  }

  private pointerDown = (event: PointerEvent) => {
    if (!this.interactive || !event.isPrimary || event.button !== 0) return;
    const point = this.toWorld(event);
    this.pointer = point;
    this.press = { x: event.clientX, y: event.clientY, moved: false, flower: this.flowerAt(point) };
  };

  private pointerMove = (event: PointerEvent) => {
    if (!this.interactive || !event.isPrimary) return;
    const point = this.toWorld(event);
    const previous = this.pointer;
    this.pointer = point;
    if (this.press && Math.hypot(event.clientX - this.press.x, event.clientY - this.press.y) > 8) this.press.moved = true;
    if (event.pointerType === 'mouse') {
      // Bare flowers can be clicked to grow back.
      const flower = this.flowerAt(point);
      this.canvas.style.cursor = flower && flower.missing.size > 0 && flower.regrowAt === undefined ? 'pointer' : '';
    }
    // A mouse brushes the flowers just by passing over them; a finger or pen has to be down.
    if (previous && (event.pointerType === 'mouse' || event.buttons !== 0)) this.brush(previous, point);
  };

  // A tap on a bare flower grows its petals back; on a full one it gives it a nudge.
  private pointerUp = (event: PointerEvent) => {
    const press = this.press;
    this.press = undefined;
    if (!this.interactive || !press || press.moved || !press.flower) return;
    const flower = this.flowerAt(this.toWorld(event));
    if (flower !== press.flower) return;
    if (flower.missing.size > 0) this.regrow(flower);
    else flower.sway = clamp(flower.sway + (Math.random() < 0.5 ? -1 : 1) * 60, -MAX_SWAY, MAX_SWAY);
    this.canvas.style.cursor = '';
  };

  private pointerEnd = () => {
    this.pointer = undefined;
    this.press = undefined;
    this.canvas.style.cursor = '';
  };

  private paint() {
    if (!this.columns) return;
    const context = this.cellContext;
    context.clearRect(this.left, 0, this.columns * CELL_WIDTH, WORLD_HEIGHT);
    if (this.planted) {
      this.paintGround();
      for (const flower of this.backToFront) this.paintFlower(flower);
      this.paintGrass();
      for (const petal of this.petals) this.paintPetal(petal);
    }
    this.present();
  }

  // The soil spreads out from the middle as the garden is planted.
  private groundSpan() {
    const reach = this.time * SOIL_SPEED;
    return [Math.max(this.left, ART_WIDTH / 2 - reach), Math.min(this.left + this.columns * CELL_WIDTH, ART_WIDTH / 2 + reach)];
  }

  private paintGround() {
    const [from, to] = this.groundSpan();
    if (to <= from) return;
    this.cellContext.fillStyle = this.soilFill;
    this.cellContext.fillRect(from, GROUND, to - from, WORLD_HEIGHT - GROUND);
  }

  // A fringe of blades along the top of the soil, in front of the stems.
  private paintGrass() {
    const [from, to] = this.groundSpan();
    const context = this.cellContext;
    context.beginPath();
    for (let x = Math.ceil(from / 4) * 4; x < to; x += 4) {
      const i = x / 4;
      const tall = 3 + hash(i, 7) * 9;
      const lean = wind(x, this.time) * 1.6 + (hash(i, 8) - 0.5) * 3;
      context.moveTo(x - 1.6, GROUND + 1);
      context.lineTo(x + lean, GROUND - tall);
      context.lineTo(x + 1.6, GROUND + 1);
    }
    context.fillStyle = rgba(this.stem, 0.9);
    context.fill();
  }

  private paintFlower(flower: Flower) {
    const { age, grown, angle, x, y } = this.pose(flower);
    if (age <= 0) return;
    const context = this.cellContext;

    // The stem rises straight from the soil and curves into its lean.
    const bendY = GROUND - (GROUND - y) * 0.55;
    context.beginPath();
    context.moveTo(flower.x, GROUND);
    context.quadraticCurveTo(flower.x, bendY, x, y);
    context.lineWidth = 5.5;
    context.lineCap = 'round';
    context.strokeStyle = rgba(this.stem, 0.95);
    context.stroke();

    context.fillStyle = rgba(this.stem, 0.85);
    for (const [i, leaf] of LEAVES.entries()) {
      const open = easeOut((age - leaf.at * STEM_TIME) / 0.5);
      if (open <= 0 || grown === 0) continue;
      // The point on the stem's curve, and the curve's direction there.
      const t = leaf.at;
      const px = (1 - t) ** 2 * flower.x + 2 * (1 - t) * t * flower.x + t * t * x;
      const py = (1 - t) ** 2 * GROUND + 2 * (1 - t) * t * bendY + t * t * y;
      const along = Math.atan2(2 * t * (x - flower.x), -(2 * (1 - t) * (bendY - GROUND) + 2 * t * (y - bendY)));
      const flutter = Math.sin(this.time * 2.1 + i * 2 + flower.x) * 0.06;
      context.save();
      context.translate(px, py);
      context.rotate(along + leaf.side * 0.95 + flutter - Math.PI / 2);
      const length = leaf.length * flower.size * open;
      // Left leaves are mirrored so their fuller edge stays on top.
      context.scale(length, length * leaf.side);
      context.fill(LEAF_PATH);
      context.restore();
    }

    const bud = easeOut((age - BUD_AT) / 0.35);
    if (bud <= 0) return;
    context.save();
    context.translate(x, y);
    context.rotate(angle * 0.8);
    context.scale(flower.size, flower.size);
    // A closed green bud, which the centre and petals then open out of. Once they're
    // gone, a little of it shows under the bare centre.
    context.fillStyle = rgba(this.stem, 0.95);
    context.beginPath();
    context.ellipse(0, 2, 8 * bud, 11 * bud, 0, 0, TAU);
    context.fill();

    for (const [index, petal] of PETALS.entries()) {
      const open = this.petalOpen(flower, index, age);
      if (open <= 0) continue;
      const { turn, stretch } = petalTweak(flower, index);
      context.save();
      // Petals unfurl as they open: turned in a little, close to the centre, and small.
      context.rotate(petal.angle + turn + (1 - open) * 0.5);
      context.translate(0, -RINGS[petal.ring].base * open);
      context.scale(open, open * stretch);
      context.globalAlpha = Math.min(1, open) * (0.8 + 0.2 * Math.cos(petal.angle + turn + angle * 0.8 - LIGHT));
      context.fillStyle = this.petalFills[flower.color][petal.ring];
      context.fill(PETAL_PATHS[petal.ring]);
      context.restore();
    }

    const center = easeOut((age - OPEN_AT) / 0.4);
    if (center > 0) {
      context.fillStyle = rgba(this.center, 1);
      context.beginPath();
      context.arc(0, 0, CENTER_RADIUS * center, 0, TAU);
      context.fill();
    }
    context.restore();
  }

  private paintPetal(petal: Petal) {
    const context = this.cellContext;
    const { length } = RINGS[petal.ring];
    context.save();
    context.translate(petal.x, petal.y);
    context.rotate(petal.angle);
    context.scale(petal.size, petal.size);
    // The petal's shape runs from its base up to its tip; its position is its middle.
    context.translate(0, length / 2);
    context.fillStyle = this.petalFills[petal.color][petal.ring];
    context.fill(PETAL_PATHS[petal.ring]);
    context.restore();
  }

  // Shows the cells through the digits: each cell is stretched over its digit, and
  // only the digit's shape is kept.
  private present() {
    const { context, canvas } = this;
    const cellWidth = CELL_WIDTH * this.scale * this.ratio;
    context.globalCompositeOperation = 'source-over';
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.imageSmoothingEnabled = false;
    context.drawImage(this.cells, canvas.width / 2 - (this.columns / 2) * cellWidth, 0, this.columns * cellWidth, canvas.height);
    context.globalCompositeOperation = 'destination-in';
    context.drawImage(this.glyphs, 0, 0);
    context.globalCompositeOperation = 'source-over';
  }
}
