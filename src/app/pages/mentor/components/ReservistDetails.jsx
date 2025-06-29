'use client';

import { useEffect, useState } from 'react';
import { t } from '@/app/utils/loadTranslations';
import GenericForm from '@/app/components/GenericForm/GenericForm';
import { Contact } from 'lucide-react';
import { useLanguage } from "@/app/utils/language/useLanguage";

export default function ReservistDetailsModal({ reservist, onClose }) {
  const language = useLanguage();

  if (!reservist) return null;

  const renderLine = (labelKey, value, isLink = false) => {
    if (!value) return null;
    return (
      <p>
        <strong>{t(labelKey, language)}:</strong>{' '}
        {isLink ? (
          <a href={value} target="_blank" rel="noreferrer" className="text-blue-600 underline">
            {value}
          </a>
        ) : (
          value
        )}
      </p>
    );
  };

  return (
    <div className="modal-overlay">
      <GenericForm
        titleKey="reservistDetails"
        fields={[]}
        data={{}}
        onChange={() => {}}
        onCloseIcon={onClose}
      >
        <div className="modal-body text-start space-y-2">
          <p className='font-bold text-center'>{t('Contact', language)}</p>
          {renderLine('fullName', reservist.fullName)}
          {renderLine('idNumber', reservist.idNumber)}
          {renderLine('email', reservist.email)}
          {renderLine('phone', reservist.phone)}
          {renderLine('location', reservist.location)}
          <p className='font-bold text-center'>{t('aboutMe', language)}</p>
          {renderLine('aboutMe', reservist.aboutMe)}
          {renderLine('armyRole', reservist.armyRole)}    
          {renderLine('fields', reservist.fields?.join(', '))}
          {renderLine('experience', reservist.experience)}
          {renderLine('linkedin', reservist.linkedin, true)}
          {renderLine('notes', reservist.notes)}
        </div>
      </GenericForm>
    </div>
  );
}
