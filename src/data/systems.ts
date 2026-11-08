// All technical values are SAMPLE values for the concept. Replace with supplier test reports.
export type Family = 'pvc' | 'alu' | 'facade';
export type Product = 'window' | 'balconyDoor' | 'slidingDoor' | 'entranceDoor';

export interface System {
  id: string;
  name: string;
  family: Family;
  depth: number; // mm
  chambers: number;
  thermal: boolean;
  uf: number; // W/m2K frame
  uwDouble: number; // whole window, double low-E
  uw3: number | null; // whole window, triple (null = not available)
  glazing: [number, number]; // mm
  maxW: number;
  maxH: number;
  maxSash: number; // max sash width, mm
  price: number; // AMD per m2, excl. VAT, standard double glazing
  level: 0 | 1 | 2;
  uses: string[]; // keys of sys.useKeys
  products: Product[];
  img?: string;
  blurb: Record<'en' | 'ru' | 'hy', string>;
}

export const SYSTEMS: System[] = [
  {
    id: 'pvc60', name: 'PVC 60', family: 'pvc', depth: 60, chambers: 3, thermal: true, uf: 1.3, uwDouble: 1.4, uw3: null, glazing: [24, 32],
    maxW: 2200, maxH: 2200, maxSash: 900, price: 38000, level: 0, uses: ['windows', 'balcony'], products: ['window', 'balconyDoor', 'entranceDoor'],
    blurb: {
      en: 'Efficient everyday PVC system for apartments and houses.',
      ru: 'Практичная ПВХ-система для квартир и домов.',
      hy: 'Գործնական PVC համակարգ բնակարանների և տների համար։',
    },
  },
  {
    id: 'pvc70', name: 'PVC 70', family: 'pvc', depth: 70, chambers: 5, thermal: true, uf: 1.1, uwDouble: 1.2, uw3: 1.0, glazing: [24, 40],
    maxW: 2600, maxH: 2400, maxSash: 1000, price: 46000, level: 1, uses: ['windows', 'balcony', 'doors'], products: ['window', 'balconyDoor', 'entranceDoor'],
    blurb: {
      en: 'Five chambers and room for triple glazing. The balanced choice.',
      ru: 'Пять камер и место под тройной стеклопакет. Сбалансированный выбор.',
      hy: 'Հինգ խցիկ և տեղ եռակի ապակեփաթեթի համար։ Հավասարակշռված ընտրություն։',
    },
  },
  {
    id: 'pvc82', name: 'PVC 82', family: 'pvc', depth: 82, chambers: 7, thermal: true, uf: 0.9, uwDouble: 1.0, uw3: 0.8, glazing: [24, 52],
    maxW: 3000, maxH: 2600, maxSash: 1100, price: 56000, level: 2, uses: ['windows', 'balcony', 'doors', 'sliding'], products: ['window', 'balconyDoor', 'slidingDoor', 'entranceDoor'],
    blurb: {
      en: 'Seven chambers for cold regions and low-energy houses.',
      ru: 'Семь камер для холодных регионов и энергоэффективных домов.',
      hy: 'Յոթ խցիկ ցուրտ տարածաշրջանների և էներգաարդյունավետ տների համար։',
    },
  },
  {
    id: 'alrox45', name: 'ALROX 45', family: 'alu', depth: 45, chambers: 2, thermal: false, uf: 5.5, uwDouble: 3.6, uw3: null, glazing: [4, 28],
    maxW: 3000, maxH: 2600, maxSash: 1200, price: 52000, level: 1, uses: ['windows', 'doors', 'partitions'], products: ['window', 'balconyDoor', 'slidingDoor', 'entranceDoor'], img: 'img/site/alrox-45.webp',
    blurb: {
      en: 'Aluminium without thermal break for windows, doors and partitions where insulation is not required.',
      ru: 'Алюминий без терморазрыва для окон, дверей и перегородок, где утепление не требуется.',
      hy: 'Ալյումին՝ առանց ջերմաբաժանիչի, պատուհանների, դռների և միջնորմների համար, որտեղ ջերմամեկուսացում չի պահանջվում։',
    },
  },
  {
    id: 'alrox65', name: 'ALROX 65', family: 'alu', depth: 65, chambers: 3, thermal: true, uf: 2.4, uwDouble: 1.7, uw3: 1.4, glazing: [6, 40],
    maxW: 4000, maxH: 3000, maxSash: 1400, price: 72000, level: 2, uses: ['windows', 'doors', 'glazing', 'terraces'], products: ['window', 'balconyDoor', 'slidingDoor', 'entranceDoor'], img: 'img/site/alrox-65.webp',
    blurb: {
      en: 'Thermally broken aluminium for windows, doors, entrance groups and glazed structures.',
      ru: 'Алюминий с терморазрывом для окон, дверей, входных групп и остеклённых конструкций.',
      hy: 'Ջերմաբաժանիչով ալյումին պատուհանների, դռների, մուտքային խմբերի և ապակեպատ կոնստրուկցիաների համար։',
    },
  },
  {
    id: 'alrox500', name: 'ALROX 500', family: 'facade', depth: 50, chambers: 3, thermal: true, uf: 1.8, uwDouble: 1.6, uw3: 1.3, glazing: [6, 50],
    maxW: 6000, maxH: 4000, maxSash: 1500, price: 98000, level: 2, uses: ['facades', 'entrances', 'panoramic'], products: ['window', 'entranceDoor'], img: 'img/site/alrox-500.webp',
    blurb: {
      en: 'Facade system for vertical and inclined transparent structures and panoramic glazing.',
      ru: 'Фасадная система для вертикальных и наклонных светопрозрачных конструкций и панорамного остекления.',
      hy: 'Ֆասադային համակարգ ուղղահայաց և թեք լուսաթափանց կոնստրուկցիաների և համայնապատկերային ապակեպատման համար։',
    },
  },
];

export const sysById = (id: string) => SYSTEMS.find((s) => s.id === id) ?? SYSTEMS[1];
