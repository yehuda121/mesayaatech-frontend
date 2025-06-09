// module.exports = {
//   nput: ['src/app/**/*.{js,jsx}'], // שנה לנתיב הרלוונטי אצלך
//   output: 'src/locales/$LOCALE/$NAMESPACE.json',
//   defaultValue: '',
//   keepRemoved: false, // שומר רק מה שנמצא בשימוש
//   verbose: true
// };
module.exports = {
    input: ['**/*.{js,jsx,ts,tsx}'],// סרוק את כל קבצי הקוד
    output: 'src/app/i18n/$LOCALE.json',// שמור את קובצי השפה כאן
    locales: ['en', 'he'],
    defaultNamespace: 'translation',
    defaultValue: '',
    useKeysAsDefaultValue: false,
    keepRemoved: false, // חשוב! ימחק מפתחות שלא נמצאים בשימוש
    keySeparator: false, // אם אתה לא משתמש במפתחות כמו "form.title"
    nsSeparator: false,  // אם אין לך שמותpניימספייסים בקוד
    verbose: true
};

// פקודה להרצה לנקות מפתחות ולהוסיף אוטומטית
// npx i18next-parser --config src/app/i18next-parser.config.js