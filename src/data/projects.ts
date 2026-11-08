// SAMPLE projects. The current EURO.G site lists placeholders; replace with real references.
export type PType = 'house' | 'apartments' | 'commercial' | 'public' | 'industrial';
export interface Project {
  id: string; type: PType; city: Record<'en' | 'ru' | 'hy', string>; name: Record<'en' | 'ru' | 'hy', string>; lon: number; lat: number; year: number; systems: string[]; img: string; area: number;
}
const c = (en: string, ru: string, hy: string) => ({ en, ru, hy });
export const PROJECTS: Project[] = [
  { id: 'p1', type: 'house', city: c('Tsaghkadzor', 'Цахкадзор', 'Ծաղկաձոր'), name: c('Mountain residence', 'Дом в горах', 'Լեռնային առանձնատուն'), lon: 44.72, lat: 40.53, year: 2024, systems: ['ALROX 65', 'PVC 82'], img: 'img/site/project-1.jpg', area: 86 },
  { id: 'p2', type: 'apartments', city: c('Yerevan, Arabkir', 'Ереван, Арабкир', 'Երևան, Արաբկիր'), name: c('Residential block', 'Жилой дом', 'Բազմաբնակարան շենք'), lon: 44.5, lat: 40.2, year: 2025, systems: ['PVC 70'], img: 'img/site/project-2.jpg', area: 1450 },
  { id: 'p3', type: 'commercial', city: c('Yerevan, Kentron', 'Ереван, Кентрон', 'Երևան, Կենտրոն'), name: c('Office entrance hall', 'Входная группа офиса', 'Գրասենյակի մուտքի խումբ'), lon: 44.51, lat: 40.18, year: 2024, systems: ['ALROX 500', 'ALROX 65'], img: 'img/site/project-3.jpg', area: 210 },
  { id: 'p4', type: 'house', city: c('Dilijan', 'Дилижан', 'Դիլիջան'), name: c('Forest house', 'Дом в лесу', 'Անտառային տուն'), lon: 44.86, lat: 40.74, year: 2023, systems: ['PVC 82'], img: 'img/site/project-1.jpg', area: 64 },
  { id: 'p5', type: 'apartments', city: c('Gyumri', 'Гюмри', 'Գյումրի'), name: c('Apartment complex', 'Жилой комплекс', 'Բնակելի համալիր'), lon: 43.85, lat: 40.79, year: 2023, systems: ['PVC 70', 'PVC 60'], img: 'img/site/project-2.jpg', area: 2100 },
  { id: 'p6', type: 'commercial', city: c('Yerevan, Ajapnyak', 'Ереван, Аджапняк', 'Երևան, Աջափնյակ'), name: c('Business centre facade', 'Фасад бизнес-центра', 'Բիզնես կենտրոնի ֆասադ'), lon: 44.46, lat: 40.2, year: 2025, systems: ['ALROX 500'], img: 'img/site/sol-facade.jpg', area: 1800 },
  { id: 'p7', type: 'industrial', city: c('Armavir', 'Армавир', 'Արմավիր'), name: c('Production hall', 'Производственный корпус', 'Արտադրամաս'), lon: 43.87, lat: 40.15, year: 2022, systems: ['ALROX 45'], img: 'img/site/facility.jpg', area: 620 },
  { id: 'p8', type: 'public', city: c('Vanadzor', 'Ванадзор', 'Վանաձոր'), name: c('School extension', 'Пристройка к школе', 'Դպրոցի ընդլայնում'), lon: 44.49, lat: 40.81, year: 2024, systems: ['PVC 70'], img: 'img/site/pro-2.jpg', area: 380 },
  { id: 'p9', type: 'house', city: c('Sevan', 'Севан', 'Սևան'), name: c('Lakeside house', 'Дом у озера', 'Տուն լճի ափին'), lon: 44.95, lat: 40.55, year: 2025, systems: ['PVC 82', 'ALROX 65'], img: 'img/site/project-1.jpg', area: 72 },
  { id: 'p10', type: 'apartments', city: c('Kapan', 'Капан', 'Կապան'), name: c('Residential building', 'Жилой дом', 'Բնակելի շենք'), lon: 46.41, lat: 39.21, year: 2023, systems: ['PVC 70'], img: 'img/site/project-2.jpg', area: 940 },
  { id: 'p11', type: 'commercial', city: c('Jermuk', 'Джермук', 'Ջերմուկ'), name: c('Hotel entrance', 'Вход в отель', 'Հյուրանոցի մուտք'), lon: 45.67, lat: 39.84, year: 2024, systems: ['ALROX 65'], img: 'img/site/project-3.jpg', area: 160 },
  { id: 'p12', type: 'public', city: c('Goris', 'Горис', 'Գորիս'), name: c('Municipal building', 'Здание администрации', 'Վարչական շենք'), lon: 46.34, lat: 39.51, year: 2022, systems: ['ALROX 500', 'ALROX 65'], img: 'img/site/sol-facade.jpg', area: 520 },
  { id: 'p13', type: 'industrial', city: c('Abovyan', 'Абовян', 'Աբովյան'), name: c('Warehouse and offices', 'Склад и офисы', 'Պահեստ և գրասենյակներ'), lon: 44.63, lat: 40.27, year: 2025, systems: ['ALROX 45', 'ALROX 65'], img: 'img/site/facility.jpg', area: 760 },
  { id: 'p14', type: 'house', city: c('Ararat', 'Арарат', 'Արարատ'), name: c('Garden villa', 'Вилла с садом', 'Այգու վիլլա'), lon: 44.7, lat: 39.83, year: 2024, systems: ['ALROX 65'], img: 'img/site/project-1.jpg', area: 110 },
];

// Stylised outline of Armenia (lon, lat), clockwise from the north-west.
export const OUTLINE: [number, number][] = [
  [43.45, 40.12], [43.6, 40.42], [43.78, 40.78], [43.95, 41.04], [44.25, 41.2], [44.6, 41.2], [44.85, 41.28], [45.05, 41.2], [45.2, 41.05], [45.3, 40.95], [45.2, 40.72],
  [45.55, 40.45], [45.95, 40.2], [46.25, 39.92], [46.55, 39.6], [46.58, 39.3], [46.38, 39.14], [46.15, 38.9], [46.05, 38.85], [45.8, 39.08], [45.5, 39.4], [45.25, 39.65],
  [44.95, 39.75], [44.78, 39.7], [44.6, 39.76], [44.2, 40.0], [43.75, 40.08],
];
const S = 160, COS = Math.cos((40 * Math.PI) / 180);
export const project = (lon: number, lat: number): [number, number] => [12 + (lon - 43.3) * COS * S, 10 + (41.4 - lat) * S];
export const MAP_W = 460, MAP_H = 450;
export const outlinePath = () => OUTLINE.map(([lo, la], i) => { const [x, y] = project(lo, la); return `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`; }).join(' ') + 'Z';
