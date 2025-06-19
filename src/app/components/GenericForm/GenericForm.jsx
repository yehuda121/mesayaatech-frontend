'use client';

import { useEffect, useState } from 'react';
import { getLanguage } from '@/app/language';
import { t } from '@/app/utils/loadTranslations';
import Button from '@/app/components/Button';
import './GenericForm.css';
import { FaEnvelope, FaPhone, FaUser, FaIdCard, FaLinkedin } from 'react-icons/fa';

export default function GenericForm({
  titleKey,
  fields,
  data,
  onChange,
  onPrimary,
  onSecondary,
  primaryLabel,
  secondaryLabel,
  deleteLabel,
  onDelete,
  disabledPrimary,
  children,
  onCloseIcon,
  isModal = false
}) {
  const [language, setLanguage] = useState(getLanguage());

  useEffect(() => {
    if (isModal) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isModal]);

  useEffect(() => {
    const handleLangChange = () => setLanguage(getLanguage());
    window.addEventListener('languageChanged', handleLangChange);
    return () => window.removeEventListener('languageChanged', handleLangChange);
  }, []);

  const handleFieldChange = (key, value) => {
    onChange({ ...data, [key]: value });
  };

  return (
    <div className="GF-generic-form-wrapper">

      <div dir={language === 'he' ? 'rtl' : 'ltr'} className="GF-generic-form-container text-start relative">
        {onCloseIcon && (
          <button className="GF-modal-close" onClick={onCloseIcon} aria-label="Close">✖</button>
        )}

        <form className="GF-generic-form-grid">

          {fields.map((field) => {
            const { key, type, readonly, labelOverride, transform } = field;
            const label = t(labelOverride || key, language);
            const rawValue = data[key];
            const value = type === 'checkbox'
              ? transform?.toValue
                ? transform.toValue(rawValue)
                : !!rawValue
              : rawValue || '';

            if (type === 'checkbox') {
              return (
                <label key={key} className="GF-generic-form-checkbox-row">
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) =>
                      handleFieldChange(
                        key,
                        transform?.fromEvent
                          ? transform.fromEvent(e.target.checked)
                          : e.target.checked
                      )
                    }
                  />
                  <span className="GF-checkbox-label-text">{label}</span>
                </label>
              );
            }

            if (type === 'file') {
              return (
                <label key={key} className="GF-generic-form-label">
                  <span className="GF-generic-form-label-text">{label}</span>
                  <input
                    type="file"
                    onChange={(e) =>
                      handleFieldChange(key, e.target.files?.[0] || null)
                    }
                  />
                </label>
              );
            } else if (type === 'select') {
              return (
                <label key={key} className="GF-generic-form-label">
                  <span className="GF-generic-form-label-text">{label}</span>
                  <select
                    className="GF-generic-form-input"
                    value={value}
                    onChange={(e) => handleFieldChange(key, e.target.value)}
                  >
                    {(field.options || []).map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </label>
              );
            }

            return (
              <label key={key} className="GF-generic-form-label">
                <span className="GF-generic-form-label-text">{label}</span>
                {readonly ? (
                  <div className="GF-readonly-value">{value || '-'}</div>
                ) : type === 'textarea' ? (
                  <textarea
                    className="GF-generic-form-input"
                    value={value}
                    onChange={(e) => handleFieldChange(key, e.target.value)}
                  />
                ) : (
                  <div className="GF-input-with-icon">
                    {key === 'email' && <FaEnvelope className="GF-input-icon" />}
                    {key === 'phone' && <FaPhone className="GF-input-icon" />}
                    {key === 'fullName' && <FaUser className="GF-input-icon" />}
                    {key === 'idNumber' && <FaIdCard className="GF-input-icon" />}
                    {key === 'linkedin' && <FaLinkedin className="GF-input-icon" />}
                    <input
                      type={type}
                      className={`GF-generic-form-input ${['email', 'phone', 'fullName', 'idNumber', 'linkedin'].includes(key) ? 'GF-input-icon-padding' : ''}`}
                      value={value}
                      onChange={(e) => handleFieldChange(key, e.target.value)}
                    />
                  </div>
                )}
              </label>
            );
          })}

          {children && <div className="GF-generic-form-extra">{children}</div>}

          <div className="GF-generic-form-buttons">
            {deleteLabel && (
              <Button
                text={t(deleteLabel, language)}
                onClick={onDelete}
                type="button"
                className="GF-delete-button"
              />
            )}
            {secondaryLabel && (
              <Button
                text={t(secondaryLabel, language)}
                onClick={onSecondary}
                type="button"
              />
            )}
            {primaryLabel && (
              <Button
                text={t(primaryLabel, language)}
                type="button"
                onClick={async () => {
                  const success = await onPrimary();
                  if (success === false) return;
                }}
                disabled={disabledPrimary}
                className="GF-primary-button"
              />
            )}
          </div>
          <div className="mt-7"></div>
        </form>
      </div>
    </div>
  );
}
