// 'use client';
// import React, { useState } from 'react';
// import { isEnglish } from '@/app/language';
// import { useRouter } from "next/navigation";

// const dummyReservists = [
//   {
//     name: 'מאי ניגרי',
//     fieldHe: 'פיתוח תוכנה',
//     fieldEn: 'Software Development',
//     location: 'תל אביב',
//     statusHe: 'ממתין לפגישה',
//     statusEn: 'Waiting for meeting',
//   },
//   {
//     name: 'יהודה שמולביץ',
//     fieldHe: 'שיווק דיגיטלי',
//     fieldEn: 'Digital Marketing',
//     location: 'חיפה',
//     statusHe: 'בתהליך ליווי',
//     statusEn: 'In mentoring process',
//   },
// ];

// export default function MyReservistsPage() {
//   const [language, setLanguage] = useState(isEnglish ? 'en' : 'he');
//   const router = useRouter();

//   const toggleLanguage = () => {
//     const newLang = language === 'he' ? 'en' : 'he';
//     setLanguage(newLang);
//     document.documentElement.lang = newLang;
//     document.body.setAttribute('dir', newLang === 'he' ? 'rtl' : 'ltr');
//   };

//   return (
//     <div className="p-8">
//       <div className={`flex justify-between items-center mb-6 ${language === 'he' ? 'flex-row-reverse' : ''}`}>
//         <h1 className="text-3xl font-bold text-blue-700">
//           {language === 'he' ? 'רשימת המלווים שלי' : 'My Reservists'}
//         </h1>
//         <div className={`flex gap-4 ${language === 'he' ? 'flex-row-reverse' : ''}`}>
//           <button
//             onClick={() => router.push("/pages/mentor/MentorHomePage")}
//             className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
//           >
//             {language === 'he' ? 'חזרה לדף הראשי' : 'Back to Dashboard'}
//           </button>
//           <button
//             onClick={toggleLanguage}
//             className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
//           >
//             {language === 'he' ? 'English' : 'עברית'}
//           </button>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {dummyReservists.map((res, index) => (
//           <div key={index} className="bg-white p-6 rounded-lg shadow-md text-right">
//             <h2 className="text-xl font-semibold text-blue-800">{res.name}</h2>
//             <p className="text-gray-700">
//               {language === 'he' ? 'תחום' : 'Field'}: {language === 'he' ? res.fieldHe : res.fieldEn}
//             </p>
//             <p className="text-gray-700">
//               {language === 'he' ? 'מיקום' : 'Location'}: {res.location}
//             </p>
//             <p className="text-gray-600 mt-2 font-medium">
//               {language === 'he' ? 'סטטוס' : 'Status'}: {language === 'he' ? res.statusHe : res.statusEn}
//             </p>
//             <div className={`mt-4 flex gap-2 ${language === 'he' ? 'justify-start' : 'justify-end'}`}>
//               <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
//                 {language === 'he' ? 'לפרטים' : 'Details'}
//               </button>
//               <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
//                 {language === 'he' ? 'סיום תהליך' : 'Finish'}
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }
'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getLanguage, toggleLanguage } from '@/app/language';

const dummyReservists = [
  {
    name: 'מאי ניגרי',
    fieldHe: 'פיתוח תוכנה',
    fieldEn: 'Software Development',
    location: 'תל אביב',
    statusHe: 'ממתין לפגישה',
    statusEn: 'Waiting for meeting',
  },
  {
    name: 'יהודה שמולביץ',
    fieldHe: 'שיווק דיגיטלי',
    fieldEn: 'Digital Marketing',
    location: 'חיפה',
    statusHe: 'בתהליך ליווי',
    statusEn: 'In mentoring process',
  },
];

export default function MyReservistsPage() {
  const [language, setLanguage] = useState(getLanguage());
  const router = useRouter();

  const handleToggleLanguage = () => {
    const newLang = toggleLanguage();
    setLanguage(newLang);
  };

  useEffect(() => {
    // במידה ומשנים שפה בעמוד אחר
    const lang = getLanguage();
    setLanguage(lang);
  }, []);

  return (
    <div className="p-8">
      <div className={`flex justify-between items-center mb-6 ${language === 'he' ? 'flex-row-reverse' : ''}`}>
        <h1 className="text-3xl font-bold text-blue-700">
          {language === 'he' ? 'רשימת המלווים שלי' : 'My Reservists'}
        </h1>
        <div className={`flex gap-4 ${language === 'he' ? 'flex-row-reverse' : ''}`}>
          <button
            onClick={() => router.push("/pages/mentor/MentorHomePage")}
            className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
          >
            {language === 'he' ? 'חזרה לדף הראשי' : 'Back to Dashboard'}
          </button>
          <button
            onClick={handleToggleLanguage}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            {language === 'he' ? 'English' : 'עברית'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dummyReservists.map((res, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-md text-right">
            <h2 className="text-xl font-semibold text-blue-800">{res.name}</h2>
            <p className="text-gray-700">
              {language === 'he' ? 'תחום' : 'Field'}: {language === 'he' ? res.fieldHe : res.fieldEn}
            </p>
            <p className="text-gray-700">
              {language === 'he' ? 'מיקום' : 'Location'}: {res.location}
            </p>
            <p className="text-gray-600 mt-2 font-medium">
              {language === 'he' ? 'סטטוס' : 'Status'}: {language === 'he' ? res.statusHe : res.statusEn}
            </p>
            <div className={`mt-4 flex gap-2 ${language === 'he' ? 'justify-start' : 'justify-end'}`}>
              <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                {language === 'he' ? 'לפרטים' : 'Details'}
              </button>
              <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                {language === 'he' ? 'סיום תהליך' : 'Finish'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
