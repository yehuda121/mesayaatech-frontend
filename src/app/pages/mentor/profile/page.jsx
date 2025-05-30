// 'use client';
// import { useEffect, useState } from 'react';
// import { jwtDecode } from 'jwt-decode';
// import { getLanguage } from '@/app/language';
// import EditMentorForm from '../components/EditMentorForm';
// import { t } from '@/app/utils/loadTranslations';
// import '../../reservist/reservist.css';

// export default function MentorProfilePage() {
//   const [language, setLanguage] = useState(getLanguage());
//   const [idNumber, setIdNumber] = useState(null);
//   const [userData, setUserData] = useState(null);

//   useEffect(() => {
//     const handleLangChange = () => setLanguage(getLanguage());
//     window.addEventListener('languageChanged', handleLangChange);
//     return () => window.removeEventListener('languageChanged', handleLangChange);
//   }, []);

//   useEffect(() => {
//     const token = localStorage.getItem('idToken');
//     if (token) {
//       try {
//         const decoded = jwtDecode(token);
//         setIdNumber(decoded['custom:idNumber'] || decoded.sub);
//       } catch (err) {
//         console.error('Failed to decode token:', err);
//       }
//     }
//   }, []);

//   useEffect(() => {
//     if (!idNumber) return;
//     const fetchData = async () => {
//       try {
//         const res = await fetch(`http://localhost:5000/api/get-user-form?userType=mentor&idNumber=${idNumber}`);
//         const data = await res.json();
//         setUserData(data);
//       } catch (err) {
//         console.error('Failed to fetch mentor data:', err);
//       }
//     };
//     fetchData();
//   }, [idNumber]);

//   return (
//     <div className="reservist-main">
//       <h1 className="text-2xl font-bold mb-6 text-center">
//         {t('editUserDetails', language)}
//       </h1>

//       {userData && (
//         <EditMentorForm
//           userData={userData}
//           onSave={(updated) => setUserData(updated)}
//         />
//       )}
//     </div>
//   );
// }
