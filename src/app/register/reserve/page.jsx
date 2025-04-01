'use client';
import { useState, useEffect } from 'react';
import { Auth } from 'aws-amplify';
import AWS from 'aws-sdk';
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import Button from '../../../components/Button';
import { getLanguagePreference, setLanguagePreference } from '../../language';
import '../../LandingPage.css';
import '../../utils/amplify-config';

export default function MilouimnikRegisterForm() {
  const [language, setLanguage] = useState("he");
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    armyRole: '',
    location: '',
    fields: [],
    experience: '',
    linkedin: '',
    notes: '',
    password: '',
  });
  const [success, setSuccess] = useState('');

  useEffect(() => {
    setLanguage(getLanguagePreference());
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData((prev) => ({
        ...prev,
        fields: checked
          ? [...prev.fields, value]
          : prev.fields.filter((field) => field !== value),
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const uploadFormToS3 = async (data) => {
    const s3 = new S3Client({
      region: 'eu-north-1',
      credentials: {
        accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
      },
    });

    const params = {
      Bucket: 'mesayaatech-bucket',
      Key: `pending/reserve/${data.email}.json`,
      Body: JSON.stringify(data),
      ContentType: 'application/json',
    };

    await s3.send(new PutObjectCommand(params));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await Auth.signUp({
        username: formData.email,
        password: formData.password,
        attributes: {
          email: formData.email,
          phone_number: formData.phone,
          'custom:role': 'reserve',
          name: formData.fullName,
        },
      });

      AWS.config.update({
        region: 'eu-north-1',
        credentials: new AWS.Credentials(
          process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
          process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY
        ),
      });

      const dynamoDB = new AWS.DynamoDB.DocumentClient();

      await dynamoDB.put({
        TableName: 'pending_users',
        Item: {
          userType: 'reserve',
          email: formData.email,
          fullName: formData.fullName,
          phone: formData.phone,
          armyRole: formData.armyRole,
          location: formData.location,
          fields: formData.fields,
          experience: formData.experience,
          linkedin: formData.linkedin,
          notes: formData.notes,
          createdAt: new Date().toISOString(),
        },
      }).promise();

      await uploadFormToS3({
        ...formData,
        userType: 'reserve',
        createdAt: new Date().toISOString(),
      });

      setSuccess(language === "he" ? 'הבקשה נשלחה בהצלחה! ממתין לאישור מנהל' : 'Request submitted successfully! Waiting for admin approval');
    } catch (error) {
      console.error('Error:', error);
      setSuccess(language === "he" ? 'אירעה שגיאה במהלך ההרשמה' : 'An error occurred during registration');
    }
  };

  const toggleLanguage = () => {
    setLanguage(prev => {
      const nextLang = prev === "he" ? "en" : "he";
      setLanguagePreference(nextLang);
      if (typeof document !== 'undefined') {
        document.documentElement.lang = nextLang;
        document.body.setAttribute("dir", nextLang === "he" ? "rtl" : "ltr");
      }
      return nextLang;
    });
  };
  

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white shadow-md rounded-lg space-y-6">
      <h1 className="text-3xl font-bold text-center">
        {language === "he" ? "הרשמה למילואימניק" : "Reservist Registration"}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <label>{language === "he" ? "שם מלא*" : "Full Name*"}
          <input name="fullName" required value={formData.fullName} onChange={handleChange} className="border p-2 w-full rounded" />
        </label>

        <label>{language === "he" ? "אימייל*" : "Email*"}
          <input name="email" type="email" required value={formData.email} onChange={handleChange} className="border p-2 w-full rounded" />
        </label>

        <label>{language === "he" ? "סיסמה*" : "Password*"}
          <input name="password" type="password" required value={formData.password} onChange={handleChange} className="border p-2 w-full rounded" />
        </label>

        <label>{language === "he" ? "טלפון*" : "Phone*"}
          <input name="phone" type="tel" required value={formData.phone} onChange={handleChange} className="border p-2 w-full rounded" />
        </label>

        <label>{language === "he" ? "תפקיד במילואים*" : "Army Role*"}
          <input name="armyRole" required value={formData.armyRole} onChange={handleChange} className="border p-2 w-full rounded" />
        </label>

        <label>{language === "he" ? "מיקום*" : "Location*"}
          <input name="location" required value={formData.location} onChange={handleChange} className="border p-2 w-full rounded" />
        </label>

        <fieldset>
          <legend className="font-semibold">
            {language === "he" ? "תחומי עיסוק (סמן כמה שתרצה):" : "Relevant fields (choose as many as you like):"}
          </legend>
          {['הייטק', 'ניהול', 'לוגיסטיקה', 'חינוך', 'שיווק', 'אחר'].map((field) => (
            <label key={field} className="block">
              <input
                type="checkbox"
                name="fields"
                value={field}
                checked={formData.fields.includes(field)}
                onChange={handleChange}
                className="mr-2"
              />
              {field}
            </label>
          ))}
        </fieldset>

        <label>{language === "he" ? "ניסיון מקצועי*" : "Professional Experience*"}
          <textarea name="experience" required value={formData.experience} onChange={handleChange} className="border p-2 w-full rounded h-24" />
        </label>

        <label>{language === "he" ? "קישור ללינקדאין" : "LinkedIn (optional)"}
          <input name="linkedin" value={formData.linkedin} onChange={handleChange} className="border p-2 w-full rounded" />
        </label>

        <label>{language === "he" ? "הערות נוספות" : "Additional Notes (optional)"}
          <textarea name="notes" value={formData.notes} onChange={handleChange} className="border p-2 w-full rounded h-24" />
        </label>

        <Button text={language === "he" ? "שלח בקשה" : "Submit Request"} type="submit" />
      </form>

      {success && <p className="text-green-600 text-center font-bold mt-4">{success}</p>}

      <div className="absolute top-4 right-4">
        <Button text={language === "he" ? "English" : "עברית 🇮🇱"} onClick={toggleLanguage} />
      </div>
    </div>
  );
}
