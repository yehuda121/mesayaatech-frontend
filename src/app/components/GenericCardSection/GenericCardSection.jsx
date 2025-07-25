'use client';

import { t } from '@/app/utils/loadTranslations';
import './genericCardSection.css';
import { useLanguage } from "@/app/utils/language/useLanguage";

export default function GenericCardSection({
  titleKey,
  filters,
  data,
  renderCard,
  onCardClick,
  emptyTextKey = 'noItemsFound',
  getItemKey
}) {
  const language = useLanguage();

  const filtersWrapperClass = `card-section-filters ${
    filters.length === 1 ? 'single-filter' :
    filters.length === 2 ? 'double-filter' : 
    filters.length === 3 ? 'triple-filter' : ''
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
          {/* {data.map((item, i) => (
            <div
              key={i}
              className="card-section-item"
              onClick={onCardClick ? () => onCardClick(item) : undefined}
            >
              {renderCard(item)}
            </div>
          ))} */}
          {data.map((item, i) => {
            const key = getItemKey ? getItemKey(item, i) : i;
            return (
              <div
                key={key}
                className="card-section-item"
                onClick={onCardClick ? () => onCardClick(item) : undefined}
              >
                {renderCard(item)}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
} 
