let currentLanguage = 'he';

export function getLanguage() {
  return currentLanguage;
}

export function toggleLanguage() {
  currentLanguage = currentLanguage === 'he' ? 'en' : 'he';
  document.documentElement.lang = currentLanguage;
  document.body.setAttribute('dir', currentLanguage === 'he' ? 'rtl' : 'ltr');

  window.dispatchEvent(new Event("languageChanged"));

  return currentLanguage;
}

export function isEnglishLanguage() {
  return currentLanguage === 'en';
}
