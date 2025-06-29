
import he from '@/app/i18n/he.json';
import en from '@/app/i18n/en.json';

const translationsMap = { he, en };
export function t(key, lang = 'he') {
  const value = translationsMap[lang]?.[key];
  if (!value) {
    console.warn(`Missing translation for key: "${key}" in language: "${lang}"`);
    return key;
  }
  return value;
}
