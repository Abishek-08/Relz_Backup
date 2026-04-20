//for single fixed colors
// export const PALETTE = [
//   '#6366F1', '#10B981', '#F59E0B', '#EF4444', '#3B82F6', '#8B5CF6',
//   '#14B8A6', '#F43F5E', '#84CC16', '#EAB308', '#22C55E', '#06B6D4'
// ];

// export function colorForLabel(label = '') {
//   let hash = 0;
//   for (let i = 0; i < label.length; i++) hash = (hash * 31 + label.charCodeAt(i)) >>> 0;
//   return PALETTE[hash % PALETTE.length];
// }

//random 60+

function hslToHex(h, s, l) {
  // h [0..360], s/l [0..100]
  s /= 100; l /= 100;
  const k = n => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = n => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  const toHex = x => Math.round(255 * x).toString(16).padStart(2, '0');
  return `#${toHex(f(0))}${toHex(f(8))}${toHex(f(4))}`;
}

/**
 * Generate N visually distinct colors by distributing hues around the wheel,
 * with slight L alternation to reduce adjacency collisions.
 */
export function generatePalette(count = 64, {
  saturation = 68,         // balanced chroma for light + dark UIs
  lightnessA = 56,         // alternated lightness A
  lightnessB = 48,         // alternated lightness B
  hueOffset = 0,           // rotate hues to match brand if needed
} = {}) {
  const colors = [];
  for (let i = 0; i < count; i++) {
    const hue = (hueOffset + (360 * i / count)) % 360;
    const l = i % 2 === 0 ? lightnessA : lightnessB;
    colors.push(hslToHex(hue, saturation, l));
  }
  return colors;
}

// Default palette: 64 distinct colors
export const PALETTE = generatePalette(64);

// Stable hash mapping
function hashLabel(label = '') {
  let h = 0;
  for (let i = 0; i < label.length; i++) {
    h = (h * 31 + label.charCodeAt(i)) >>> 0;
  }
  return h;
}

export function colorForLabel(label = '', palette = PALETTE) {
  if (!palette?.length) palette = PALETTE;
  const idx = hashLabel(label) % palette.length;
  return palette[idx];
}

/**
 * Optional helpers for UI states
 */
export function tint(hex, amt = 0.12) {
  const n = hex.replace('#', '');
  const num = parseInt(n, 16);
  let r = (num >> 16) & 0xff;
  let g = (num >> 8) & 0xff;
  let b = num & 0xff;
  const t = amt >= 0 ? 255 : 0;
  const p = Math.abs(amt);
  r = Math.round((t - r) * p) + r;
  g = Math.round((t - g) * p) + g;
  b = Math.round((t - b) * p) + b;
  return `#${(1 << 24 | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
}

// Example: brand-rotated palette (e.g., seed around your PRIMARY hue)
export function buildBrandPalette(seedHue = 255 /* ~indigo */, count = 80) {
  return generatePalette(count, { hueOffset: seedHue % 360 });
}