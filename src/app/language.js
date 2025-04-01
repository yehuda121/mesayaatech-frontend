// Global variable to determine if the display language is English or Hebrew
// true for English, false for Hebrew
// var isEnglish = true;
// export { isEnglish };


export function getLanguagePreference() {
    if (typeof window !== 'undefined') {
      const storedLang = localStorage.getItem('language');
      return storedLang ? storedLang : 'he';  // ברירת מחדל עברית
    }
    return 'he';
  }
  
  export function setLanguagePreference(lang) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', lang);
    }
  }
  