 // let currentLanguage = 'he';
 // let currentLanguage = localStorage.getItem('language') || 'he';


// export function getLanguage() {
//   return currentLanguage;
// }

// export function toggleLanguage() {
//   currentLanguage = currentLanguage === 'he' ? 'en' : 'he';
//   localStorage.setItem('language', currentLanguage);
//   document.documentElement.lang = currentLanguage;
//   document.body.setAttribute('dir', currentLanguage === 'he' ? 'rtl' : 'ltr');

//   window.dispatchEvent(new Event("languageChanged"));

//   return currentLanguage;
// }

// export function isEnglishLanguage() {
//   return currentLanguage === 'en';
// }
export function getLanguage() {
  return localStorage.getItem('language') || 'he';
}

export function toggleLanguage() {
  const newLang = getLanguage() === 'he' ? 'en' : 'he';
  localStorage.setItem('language', newLang);
  document.documentElement.lang = newLang;
  document.body.setAttribute('dir', newLang === 'he' ? 'rtl' : 'ltr');

  window.dispatchEvent(new Event("languageChanged"));

  return newLang;
}

export function isEnglishLanguage() {
  return getLanguage() === 'en';
}
