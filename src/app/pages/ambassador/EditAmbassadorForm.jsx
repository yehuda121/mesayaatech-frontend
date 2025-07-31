'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { t } from '@/app/utils/loadTranslations';
import AlertMessage from '@/app/components/Notifications/AlertMessage';
import Button from '@/app/components/Button/Button';
import { translatedJobFields } from '@/app/components/jobs/jobFields';
import './ambassador.css';
import { locations } from '@/app/components/Locations';
import { useLanguage } from "@/app/utils/language/useLanguage";
import AccordionSection from '@/app/components/AccordionSection';
import SanitizeAmbassadorForm from './SanitizeAmbassadorForm';
import ConfirmDialog from '@/app/components/Notifications/ConfirmDialog';

export default function EditAmbassadorForm({ userData, onSave , onClose, onDelete, role }) {
  const router = useRouter();
  const [formData, setFormData] = useState(userData || {});
  const [initialData, setInitialData] = useState(userData || {});
  const [alert, setAlert] = useState(null);
  const [saving, setSaving] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const language = useLanguage();

  useEffect(() => {
    if (userData) {
      setFormData(userData);
      setInitialData(userData);
    }
  }, [userData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        jobFields: checked
          ? [...(prev.jobFields || []), value]
          : prev.jobFields.filter(f => f !== value),
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { errors, sanitized } = SanitizeAmbassadorForm({ formData, language, t });

    if (errors.length > 0) {
      setAlert({ message: errors[0], type: 'error' });
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setFormData(prev => ({ ...prev, ...sanitized }));
      return;
    }

    const updatedFormData = { ...formData, ...sanitized };

    setSaving(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/update-user-form`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${sessionStorage.getItem('idToken')}` },
        body: JSON.stringify(updatedFormData)
      });
      const result = await res.json();
      if (res.ok) {
        setAlert({ message: t('saveSuccess', language), type: 'success' });
        setInitialData(updatedFormData);
        sessionStorage.setItem('ambassadorFullName', updatedFormData.fullName);
        onSave(result);
      } else {
        setAlert({ message: result.error || t('saveError', language), type: 'error' });
      }
    } catch (err) {
      console.error(err);
      setAlert({ message: t('saveError', language), type: 'error' });
    } finally {
      setSaving(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleCancel = () => {
    setFormData(initialData);
    setAlert(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
     if (onClose) onClose();
  };

  const handleDeleteClick = () => {
    setShowConfirmDialog(true);
  };
  const confirmDelete = () => {
    setShowConfirmDialog(false);
    onDelete(userData);
  };

  const cancelDelete = () => {
    setShowConfirmDialog(false);
  };

  const isModified = JSON.stringify(formData) !== JSON.stringify(initialData);

  return (
    <div className="ambassador-edit-form-page">
      <div className="ambassador-form-container" dir={language === 'he' ? 'rtl' : 'ltr'}>

        <h1 className="text-3xl font-bold text-center">{t('editUserDetails', language)}</h1>

        <form onSubmit={handleSubmit}>
          <AccordionSection titleKey={t('personalDetails', language)} initiallyOpen={true}>
            <label>{t('fullName', language)}<span className="required-star">*</span>:
              <input name="fullName" value={formData.fullName || ''} onChange={handleChange} />
            </label>

            <label>{t('email', language)}<span className="required-star">*</span>:
              <input name="idNumber" value={formData.email || ''} readOnly className="readonly-red"/>
            </label>

            <label>{t('idNumber', language)}<span className="required-star">*</span>:
              <input name="email" value={formData.idNumber || ''} readOnly className="readonly-red"/>
            </label>

            <label>{t('phone', language)}:
              <input name="phone" value={formData.phone || ''} onChange={handleChange} />
            </label>
          </AccordionSection>

          <AccordionSection titleKey={t('professionalDetails', language)}>
            <label>{t('currentCompany', language)}:
              <input name="currentCompany" value={formData.currentCompany || ''} onChange={handleChange} />
            </label>

            <label>{t('position', language)}:
              <input name="position" value={formData.position || ''} onChange={handleChange} />
            </label>

            <label>{t('location', language)}<span className="required-star">*</span>:
              <select name="location" value={formData.location} onChange={handleChange}>
                <option value="">{t('selectLocation', language)}</option>
                {locations.map((region, regionIndex) => (
                  <optgroup 
                    key={regionIndex} 
                    className='font-bold'
                    label={language === 'he' ? region.region.he : region.region.en}
                  >
                    {region.locations.map((loc, locIndex) => (
                      <option key={locIndex} value={language === 'he' ? loc.he : loc.en}>
                        {language === 'he' ? loc.he : loc.en}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </label>

            <label>{t('canShareJobs', language)}<span className="required-star">*</span>:
              <select name="canShareJobs" value={formData.canShareJobs || ''} onChange={handleChange}>
                <option value="">{language === 'he' ? 'בחר' : 'Select'}</option>
                <option value="כן">{language === 'he' ? 'כן' : 'Yes'}</option>
                <option value="אולי">{language === 'he' ? 'אולי' : 'Maybe'}</option>
                <option value="לא">{language === 'he' ? 'לא' : 'No'}</option>
              </select>
            </label>

            <fieldset>
              <legend>{t('ambassadorJobFieldsTitle', language)}</legend>
              {Object.keys(translatedJobFields).map((field) => (
                <label key={field} className="register-checkbox-label" style={{ flexDirection: language === 'he' ? 'row-reverse' : 'row' }}>
                  <input
                    type="checkbox"
                    name="jobFields"
                    value={field}
                    checked={(formData.jobFields || []).includes(field)}
                    onChange={handleChange}
                  />
                  {translatedJobFields[field][language]}
                </label>
              ))}
            </fieldset>

            <label>{t('linkedin', language)}:
              <input name="linkedin" value={formData.linkedin || ''} onChange={handleChange} />
            </label>
          </AccordionSection>

          <div className="ambassador-buttons-group">
            <Button text={t('saveChanges', language)} type="submit" disabled={!isModified || saving} />
            <Button text={t('cancel', language)} type="button" onClick={handleCancel} />
            {role === 'admin' && (
              <Button color='red' text={t('deleteUser', language)} type="button" onClick={handleDeleteClick} />
            )}
          </div>
        </form>

        {alert && (
          <AlertMessage message={alert.message} type={alert.type} onClose={() => setAlert(null)} />
        )}

        {showConfirmDialog && (
          <ConfirmDialog
            title={t('confirmDelete', language)}
            message={t('confirmDeleteUser', language)}
            onConfirm={confirmDelete}
            onCancel={cancelDelete}
          />
        )}

      </div>
    </div>
  );
}
