import { en, type Dict } from '../i18n/en';
import { ru } from '../i18n/ru';
import { hy } from '../i18n/hy';

export const LANGS = ['hy', 'ru', 'en'] as const;
export type Lang = (typeof LANGS)[number];
export const DEFAULT_LANG: Lang = 'hy';
export const LANG_LABEL: Record<Lang, string> = { hy: 'ՀԱՅ', ru: 'РУС', en: 'EN' };
export const dicts: Record<Lang, Dict> = { en, ru, hy };

export const PAGES = ['', 'configurator', 'savings', 'systems', 'projects', 'production', 'quote', 'homeowners', 'architects', 'developers', 'dealers'] as const;
export type PageKey = (typeof PAGES)[number];

export const SITE = 'https://branding-company.github.io';
export const BASE: string = (import.meta.env.BASE_URL || '/').replace(/\/$/, '');

/** Path inside the site, e.g. href('hy','configurator') -> /eurog-redesign-concept/hy/configurator/ */
export function href(lang: Lang, page: string = ''): string {
  return `${BASE}/${lang}/${page ? page + '/' : ''}`;
}
export function asset(path: string): string {
  return `${BASE}/${path.replace(/^\//, '')}`;
}
export function absolute(lang: Lang, page: string = ''): string {
  return SITE + href(lang, page);
}
export function seoKey(page: PageKey): keyof Dict['seo'] {
  return (page === '' ? 'home' : page) as keyof Dict['seo'];
}
