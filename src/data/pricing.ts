// SAMPLE price model for the concept. Replace the tables with the EURO.G price list.
import { SYSTEMS, sysById, type Product, type System } from './systems';

export type Opening = 'fixed' | 'tiltTurn' | 'turn' | 'tilt' | 'sliding';
export type Glazing = 'double' | 'lowE' | 'triple' | 'acoustic' | 'laminated';
export type Colour = 'white' | 'anthracite' | 'oak' | 'grey' | 'ral' | 'anodised';

export const VAT = 0.2;

export const PRODUCT_RULES: Record<Product, { minW: number; minH: number; defW: number; defH: number; sashes: number[]; openings: Opening[]; defOpening: Opening }> = {
  window: { minW: 400, minH: 400, defW: 1200, defH: 1400, sashes: [1, 2, 3, 4], openings: ['fixed', 'tiltTurn', 'turn', 'tilt'], defOpening: 'tiltTurn' },
  balconyDoor: { minW: 600, minH: 1900, defW: 900, defH: 2150, sashes: [1, 2], openings: ['tiltTurn', 'turn'], defOpening: 'tiltTurn' },
  slidingDoor: { minW: 1400, minH: 1900, defW: 2400, defH: 2200, sashes: [2, 3], openings: ['sliding'], defOpening: 'sliding' },
  entranceDoor: { minW: 800, minH: 1900, defW: 1000, defH: 2100, sashes: [1, 2], openings: ['turn'], defOpening: 'turn' },
};

export const GLAZING_ADD: Record<Glazing, number> = { double: -4000, lowE: 0, triple: 22000, acoustic: 18000, laminated: 15000 };
export const HARDWARE: Record<Opening, number> = { fixed: 0, tiltTurn: 26000, turn: 16000, tilt: 14000, sliding: 42000 };

export const COLOURS: Record<System['family'] | 'any', Colour[]> = {
  pvc: ['white', 'anthracite', 'oak', 'grey'],
  alu: ['white', 'anthracite', 'grey', 'ral', 'anodised'],
  facade: ['white', 'anthracite', 'grey', 'ral', 'anodised'],
  any: [],
};
export const COLOUR_HEX: Record<Colour, string> = { white: '#EEF0F2', anthracite: '#3B3F47', oak: '#A8743F', grey: '#8D8E8D', ral: '#6B7F8E', anodised: '#B9BCC0' };

function colourFactor(sys: System, c: Colour): number {
  if (sys.family === 'pvc') return c === 'white' ? 0 : 0.12;
  if (c === 'white') return 0;
  if (c === 'anodised') return 0.14;
  return 0.06;
}

export interface Config {
  product: Product; w: number; h: number; sashes: number; opening: Opening; system: string; glazing: Glazing; colour: Colour; qty: number;
}
export interface Quote {
  area: number; profile: number; glass: number; hardware: number; door: number; colour: number; unit: number; total: number; uw: number; perM2: number; lo: number; hi: number;
}

export function glazingAllowed(sys: System, g: Glazing): boolean {
  if (g === 'triple') return sys.uw3 !== null;
  return true;
}

export function uwFor(sys: System, g: Glazing): number {
  switch (g) {
    case 'triple': return sys.uw3 ?? sys.uwDouble;
    case 'double': return +(sys.uwDouble + 0.5).toFixed(1);
    case 'acoustic': return +(sys.uwDouble + 0.1).toFixed(1);
    case 'laminated': return +(sys.uwDouble + 0.1).toFixed(1);
    default: return sys.uwDouble;
  }
}

export function priceOf(c: Config): Quote {
  const sys = sysById(c.system);
  const area = (c.w * c.h) / 1e6;
  const billable = Math.max(area, 0.8);
  const fixedShare = c.opening === 'fixed' ? 0.88 : 1;
  const profile = billable * sys.price * fixedShare;
  const glass = billable * GLAZING_ADD[c.glazing];
  const hardware = c.sashes * HARDWARE[c.opening];
  const door = c.product === 'entranceDoor' ? 65000 : c.product === 'balconyDoor' ? 18000 : 0;
  const colour = (profile + glass) * colourFactor(sys, c.colour);
  const net = profile + glass + hardware + door + colour;
  const unit = Math.round((net * (1 + VAT)) / 500) * 500;
  const r = (n: number) => Math.round(n * (1 + VAT) / 100) * 100;
  return {
    area, profile: r(profile), glass: r(glass), hardware: r(hardware), door: r(door), colour: r(colour), unit,
    total: unit * c.qty, uw: uwFor(sys, c.glazing), perM2: Math.round(unit / billable / 100) * 100,
    lo: Math.round((unit * 0.92) / 1000) * 1000, hi: Math.round((unit * 1.1) / 1000) * 1000,
  };
}

export function limitsFor(c: Config) {
  const sys = sysById(c.system);
  return { maxW: sys.maxW, maxH: sys.maxH, maxSash: sys.maxSash };
}

export const fmt = (n: number, lang: string) => new Intl.NumberFormat(lang === 'hy' ? 'hy-AM' : lang === 'ru' ? 'ru-RU' : 'en-US', { maximumFractionDigits: 0 }).format(n).replace(/ /g, ' ');

// ---- Savings model (sample) ----
export const CITIES: { id: string; hdd: number; names: Record<'en' | 'ru' | 'hy', string> }[] = [
  { id: 'yerevan', hdd: 2700, names: { en: 'Yerevan', ru: 'Ереван', hy: 'Երևան' } },
  { id: 'gyumri', hdd: 4200, names: { en: 'Gyumri', ru: 'Гюмри', hy: 'Գյումրի' } },
  { id: 'vanadzor', hdd: 3800, names: { en: 'Vanadzor', ru: 'Ванадзор', hy: 'Վանաձոր' } },
  { id: 'dilijan', hdd: 3500, names: { en: 'Dilijan', ru: 'Дилижан', hy: 'Դիլիջան' } },
  { id: 'sevan', hdd: 4900, names: { en: 'Sevan', ru: 'Севан', hy: 'Սևան' } },
  { id: 'kapan', hdd: 2900, names: { en: 'Kapan', ru: 'Капан', hy: 'Կապան' } },
];
export const OLD_WINDOWS: Record<string, { u: number; leak: number }> = {
  woodSingle: { u: 4.8, leak: 0.25 },
  woodDouble: { u: 2.8, leak: 0.25 },
  pvcOld: { u: 2.0, leak: 0.1 },
  alu: { u: 4.0, leak: 0.15 },
};
export const FUELS: Record<string, { price: number; co2: number }> = {
  gas: { price: 24, co2: 0.2 },
  electric: { price: 43, co2: 0.3 },
  heatpump: { price: 15, co2: 0.1 },
  central: { price: 22, co2: 0.2 },
};
export function savingsCalc(o: { hdd: number; area: number; old: string; sys: string; glazing: Glazing; price: number; co2: number }) {
  const old = OLD_WINDOWS[o.old];
  const sys = sysById(o.sys);
  const uNew = uwFor(sys, o.glazing);
  const kwh = (u: number, leak: number) => (u * o.area * o.hdd * 24 * (1 + leak)) / 1000;
  const kOld = kwh(old.u, old.leak);
  const kNew = kwh(uNew, 0);
  const cOld = kOld * o.price;
  const cNew = kNew * o.price;
  const save = Math.max(0, cOld - cNew);
  const w = Math.min(Math.max(o.area / 1.4 ** 2, 1), 60);
  // price of replacing: area at system price + glazing + avg hardware, incl. VAT
  const invest = Math.round(((o.area * (sys.price + GLAZING_ADD[o.glazing]) + (o.area / 1.8) * HARDWARE.tiltTurn) * (1 + VAT)) / 1000) * 1000;
  return { kOld, kNew, cOld, cNew, save, pct: kOld > 0 ? Math.round((1 - kNew / kOld) * 100) : 0, invest, payback: save > 0 ? invest / save : Infinity, co2: Math.max(0, (kOld - kNew) * o.co2), uOld: old.u, uNew, windows: Math.round(w) };
}
