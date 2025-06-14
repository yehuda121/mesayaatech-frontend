'use client';

import { useEffect, useState } from 'react';
import { getLanguage } from '@/app/language';
import { t } from '@/app/utils/loadTranslations';
import Button from '@/app/components/Button';
import './GenericForm.css';

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
  onCloseIcon
}) {
  const [language, setLanguage] = useState(getLanguage());

  useEffect(() => {
    const handleLangChange = () => setLanguage(getLanguage());
    window.addEventListener('languageChanged', handleLangChange);
    return () => window.removeEventListener('languageChanged', handleLangChange);
  }, []);

  const handleFieldChange = (key, value) => {
    onChange({ ...data, [key]: value });
  };

  // return (
  //   <div dir={language === 'he' ? 'rtl' : 'ltr'} className="generic-form-container text-start relative">
  //     {onCloseIcon && (
  //       <button className="modal-close" onClick={onCloseIcon} aria-label="Close">✖</button>
  //     )}

  //     <form className="generic-form-grid">
  //       <h2 className="generic-form-title">{t(titleKey, language)}</h2>

  //       {fields.map((field) => {
  //         const { key, type, readonly, labelOverride, transform } = field;
  //         const label = t(labelOverride || key, language);
  //         const rawValue = data[key];
  //         const value = type === 'checkbox'
  //           ? transform?.toValue
  //             ? transform.toValue(rawValue)
  //             : !!rawValue
  //           : rawValue || '';

  //         if (type === 'checkbox') {
  //           return (
  //             <label key={key} className="generic-form-checkbox-row">
  //               <input
  //                 type="checkbox"
  //                 checked={value}
  //                 onChange={(e) =>
  //                   handleFieldChange(
  //                     key,
  //                     transform?.fromEvent
  //                       ? transform.fromEvent(e.target.checked)
  //                       : e.target.checked
  //                   )
  //                 }
  //               />
  //               <span className="checkbox-label-text">{label}</span>
  //             </label>
  //           );
  //         }

  //         if (type === 'file') {
  //           return (
  //             <label key={key} className="generic-form-label">
  //               <span className="generic-form-label-text">{label}</span>
  //               <input
  //                 type="file"
  //                 onChange={(e) =>
  //                   handleFieldChange(key, e.target.files?.[0] || null)
  //                 }
  //               />
  //             </label>
  //           );
  //         } else if (type === 'select') {
  //           return (
  //             <label key={key} className="generic-form-label">
  //               <span className="generic-form-label-text">{label}</span>
  //               <select
  //                 className="generic-form-input"
  //                 value={value}
  //                 onChange={(e) => handleFieldChange(key, e.target.value)}
  //               >
  //                 {(field.options || []).map((opt) => (
  //                   <option key={opt.value} value={opt.value}>
  //                     {opt.label}
  //                   </option>
  //                 ))}
  //               </select>
  //             </label>
  //           );
  //         }

  //         return (
  //           <label key={key} className="generic-form-label">
  //             <span className="generic-form-label-text">{label}</span>
  //             {readonly ? (
  //               <div className="readonly-value">{value || '-'}</div>
  //             ) : type === 'textarea' ? (
  //               <textarea
  //                 className="generic-form-input"
  //                 value={value}
  //                 onChange={(e) => handleFieldChange(key, e.target.value)}
  //               />
  //             ) : type === 'date' || type === 'time' ? (
  //               <input
  //                 type={type}
  //                 className="generic-form-input"
  //                 value={value}
  //                 onChange={(e) => handleFieldChange(key, e.target.value)}
  //               />
  //             ) : (
  //               <input
  //                 type="text"
  //                 className="generic-form-input"
  //                 value={value}
  //                 onChange={(e) => handleFieldChange(key, e.target.value)}
  //               />
  //             )}
  //           </label>
  //         );
  //       })}

  //       {children && <div className="generic-form-extra">{children}</div>}

  //       <div className="generic-form-buttons">
  //         {deleteLabel && (
  //           <Button
  //             text={t(deleteLabel, language)}
  //             onClick={onDelete}
  //             type="button"
  //             className="delete-button"
  //           />
  //         )}
  //         {secondaryLabel && (
  //           <Button
  //             text={t(secondaryLabel, language)}
  //             onClick={onSecondary}
  //             type="button"
  //           />
  //         )}
  //         {primaryLabel && (
  //           <Button
  //             text={t(primaryLabel, language)}
  //             type="button"
  //             onClick={async () => {
  //             const success = await onPrimary();
  //             if (success === false) return; // stop everything if validation failed
  //             // here you can add further logic if needed
  //           }}
  //             disabled={disabledPrimary}
  //           />
  //         )}
  //       </div>
  //       <div className="mt-7"></div>
  //     </form>
  //   </div>
  // );
  return (
    <div className="generic-form-wrapper">
      <div dir={language === 'he' ? 'rtl' : 'ltr'} className="generic-form-container text-start relative">
        {onCloseIcon && (
          <button className="modal-close" onClick={onCloseIcon} aria-label="Close">✖</button>
        )}

        <form className="generic-form-grid">
          <h2 className="generic-form-title">{t(titleKey, language)}</h2>

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
                <label key={key} className="generic-form-checkbox-row">
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
                  <span className="checkbox-label-text">{label}</span>
                </label>
              );
            }

            if (type === 'file') {
              return (
                <label key={key} className="generic-form-label">
                  <span className="generic-form-label-text">{label}</span>
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
                <label key={key} className="generic-form-label">
                  <span className="generic-form-label-text">{label}</span>
                  <select
                    className="generic-form-input"
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
              <label key={key} className="generic-form-label">
                <span className="generic-form-label-text">{label}</span>
                {readonly ? (
                  <div className="readonly-value">{value || '-'}</div>
                ) : type === 'textarea' ? (
                  <textarea
                    className="generic-form-input"
                    value={value}
                    onChange={(e) => handleFieldChange(key, e.target.value)}
                  />
                ) : type === 'date' || type === 'time' ? (
                  <input
                    type={type}
                    className="generic-form-input"
                    value={value}
                    onChange={(e) => handleFieldChange(key, e.target.value)}
                  />
                ) : (
                  <input
                    type="text"
                    className="generic-form-input"
                    value={value}
                    onChange={(e) => handleFieldChange(key, e.target.value)}
                  />
                )}
              </label>
            );
          })}

          {children && <div className="generic-form-extra">{children}</div>}

          <div className="generic-form-buttons">
            {deleteLabel && (
              <Button
                text={t(deleteLabel, language)}
                onClick={onDelete}
                type="button"
                className="delete-button"
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
              />
            )}
          </div>
          <div className="mt-7"></div>
        </form>
      </div>
    </div>
  );

}
