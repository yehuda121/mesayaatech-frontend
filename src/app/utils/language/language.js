
// export function getLanguage() {
//   return localStorage.getItem('language') || 'he';
// }

// export function toggleLanguage() {
//   const newLang = getLanguage() === 'he' ? 'en' : 'he';
//   localStorage.setItem('language', newLang);
//   document.documentElement.lang = newLang;
//   document.body.setAttribute('dir', newLang === 'he' ? 'rtl' : 'ltr');

//   window.dispatchEvent(new Event("languageChanged"));

//   return newLang;
// }

// export function isEnglishLanguage() {
//   return getLanguage() === 'en';
// }
export function getLanguage() {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('language') || 'he';
  }
  return 'he'; 
}

export function toggleLanguage() {
  if (typeof window !== 'undefined') {
    const newLang = getLanguage() === 'he' ? 'en' : 'he';
    localStorage.setItem('language', newLang);
    document.documentElement.lang = newLang;
    document.body.setAttribute('dir', newLang === 'he' ? 'rtl' : 'ltr');
    window.dispatchEvent(new Event("languageChanged"));
    return newLang;
  }
  return 'he';
}

export function isEnglishLanguage() {
  return getLanguage() === 'en';
}
