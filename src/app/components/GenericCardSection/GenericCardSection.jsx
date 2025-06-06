'use client';

import { useState, useEffect } from 'react';
import { getLanguage } from '@/app/language';
import { t } from '@/app/utils/loadTranslations';
import './genericCardSection.css';

export default function GenericCardSection({
  titleKey,
  filters,
  data,
  renderCard,
  onCardClick,
  emptyTextKey = 'noItemsFound'
}) {
  const [language, setLanguage] = useState(getLanguage());

  useEffect(() => {
    const handleLangChange = () => setLanguage(getLanguage());
    window.addEventListener('languageChanged', handleLangChange);
    return () => window.removeEventListener('languageChanged', handleLangChange);
  }, []);

  const filtersWrapperClass = `card-section-filters ${
    filters.length === 1 ? 'single-filter' :
    filters.length === 2 ? 'double-filter' : ''
  }`;

  return (
    <div className="card-section-container" dir={language === 'he' ? 'rtl' : 'ltr'}>
      <h2 className="card-section-title">{t(titleKey, language)}</h2>

      <div className={filtersWrapperClass}>
        {filters}
      </div>

      {data.length === 0 ? (
        <p className="card-section-empty">{t(emptyTextKey, language)}</p>
      ) : (
        <div className="card-section-grid">
          {data.map((item, i) => (
            <div
              key={i}
              className="card-section-item"
              onClick={onCardClick ? () => onCardClick(item) : undefined}
            >
              {renderCard(item)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 
