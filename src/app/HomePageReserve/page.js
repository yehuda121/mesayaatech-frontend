import React from "react";

export default function HomePage() {
  return (
    <div className="bg-gray-100 text-gray-900">
      {/* ניווט עליון */}
      <nav className="bg-white shadow-lg p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-600">מסייעטק</h1>
        <div className="space-x-4">
          <a href="#about" className="text-gray-700 hover:text-blue-500">אודות</a>
          <a href="#mentors" className="text-gray-700 hover:text-blue-500">מצא מנטור</a>
          <a href="#jobs" className="text-gray-700 hover:text-blue-500">משרות</a>
          <a href="#signup" className="bg-blue-500 text-white px-4 py-2 rounded-lg">הירשם</a>
        </div>
      </nav>

      {/* באנר ראשי */}
      <header className="text-center py-20 bg-blue-500 text-white">
        <h2 className="text-4xl font-bold">מחברים בין מילואימניקים למנטורים בדרך להצלחה!</h2>
        <p className="mt-4 text-lg">מצא מנטור, קבל הכנה לראיונות וגלה משרות פתוחות</p>
        <div className="mt-6">
          <button className="bg-white text-blue-500 px-6 py-3 rounded-lg shadow-lg mr-4">מצא מנטור</button>
          <button className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg">גלה משרות</button>
        </div>
      </header>

      {/* יתרונות הפלטפורמה */}
      <section id="about" className="py-16 text-center">
        <h3 className="text-3xl font-bold">למה מסייעטק?</h3>
        <div className="flex justify-center mt-6 space-x-8">
          <div className="w-1/4 p-4 bg-white shadow-lg rounded-lg">
            <h4 className="font-bold text-xl">🎯 התאמה חכמה</h4>
            <p>מצא מנטור רלוונטי לפי תחום ומיקום</p>
          </div>
          <div className="w-1/4 p-4 bg-white shadow-lg rounded-lg">
            <h4 className="font-bold text-xl">📝 הכנה לראיונות</h4>
            <p>קבל פידבק AI לשיפור הראיונות</p>
          </div>
          <div className="w-1/4 p-4 bg-white shadow-lg rounded-lg">
            <h4 className="font-bold text-xl">💼 משרות בלעדיות</h4>
            <p>עיין בהזדמנויות עבודה שמציעים שגרירים</p>
          </div>
        </div>
      </section>

      {/* עדויות משתמשים */}
      <section id="testimonials" className="py-16 bg-gray-200 text-center">
        <h3 className="text-3xl font-bold">מה אומרים עלינו?</h3>
        <div className="mt-6 space-y-4">
          <p className="italic">"המערכת עזרה לי למצוא עבודה בתוך חודשיים!" – יואב ר.</p>
          <p className="italic">"המנטור שלי היה מדהים, הכין אותי לכל שלב בראיונות." – דניאל ש.</p>
        </div>
      </section>

      {/* קריאה לפעולה */}
      <section id="signup" className="py-16 text-center bg-blue-500 text-white">
        <h3 className="text-3xl font-bold">מוכן לעשות את הצעד הבא בקריירה שלך?</h3>
        <button className="bg-white text-blue-500 px-6 py-3 rounded-lg mt-6">הירשם עכשיו – זה בחינם!</button>
      </section>

      {/* תחתית האתר */}
      <footer className="bg-gray-800 text-white py-4 text-center">
        <p>© 2025 מסייעטק - כל הזכויות שמורות</p>
      </footer>
    </div>
  );
}
