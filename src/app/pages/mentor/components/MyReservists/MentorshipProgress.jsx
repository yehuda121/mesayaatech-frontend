'use client';

import { useEffect, useState } from 'react';
import { getLanguage } from '@/app/language';
import { t } from '@/app/utils/loadTranslations';
import Button from '@/app/components/Button';
import ConfirmDialog from '@/app/components/Notifications/ConfirmDialog';
import ToastMessage from '@/app/components/Notifications/ToastMessage';
import AddNewMeeting from './AddNewMeeting';
import GenericCardSection from '@/app/components/GenericCardSection/GenericCardSection';
import { Edit2, Trash2 } from 'lucide-react';
import EditMeeting from './EditMeeting';

export default function MentorshipProgress({ reservistId, mentorId }) {
  const [language, setLanguage] = useState(getLanguage());
  const [progressData, setProgressData] = useState(null);
  const [toast, setToast] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingMeetingIndex, setEditingMeetingIndex] = useState(null);

  useEffect(() => {
    const handleLangChange = () => setLanguage(getLanguage());
    window.addEventListener('languageChanged', handleLangChange);
    fetchProgress();
    return () => window.removeEventListener('languageChanged', handleLangChange);
  }, []);

  const fetchProgress = async () => {
    try {
      await fetch('http://localhost:5000/api/init-progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mentorId, reservistId })
      });

      const res = await fetch(`http://localhost:5000/api/getAllProcess?mentorId=${mentorId}&reservistId=${reservistId}`);
      const data = await res.json();
      if (res.ok) setProgressData(data);
      else throw new Error(data.error);
    } catch (err) {
      console.error(err);
      setToast({ message: t('fetchProgressError', language), type: 'error' });
    }
  };

  const handleStageAdvance = () => {
    setConfirmDialog({
      message: t('confirmStageAdvance', language),
      onConfirm: async () => {
        try {
          const res = await fetch('http://localhost:5000/api/advance-stage', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ mentorId, reservistId })
          });
          if (res.ok) {
            await fetchProgress();
            setToast({ message: t('stageAdvanced', language), type: 'success' });
          } else {
            throw new Error();
          }
        } catch {
          setToast({ message: t('stageAdvanceFailed', language), type: 'error' });
        } finally {
          setConfirmDialog(null);
        }
      },
      onCancel: () => setConfirmDialog(null)
    });
  };

    const handleEditMeeting = (index) => {
        console.log('עריכה של אינדקס:', index);
        setEditingMeetingIndex(index);
    };

    const handleDeleteMeeting = (index) => {
        setConfirmDialog({
            message: t('confirmDeleteMeeting', language),
            onConfirm: async () => {
                try {
                    const res = await fetch('http://localhost:5000/api/delete-meeting', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ mentorId, reservistId, meetingIndex: index })
                    });
                    if (res.ok) {
                        fetchProgress();
                        setToast({ message: t('meetingDeleted', language), type: 'success' });
                    } else {
                        throw new Error();
                    }
                } catch {
                    setToast({ message: t('deleteMeetingFailed', language), type: 'error' });
                } finally {
                    setConfirmDialog(null);
                }
            },
            onCancel: () => setConfirmDialog(null)
        });
    };


  const progressStages = [
    t('stage1', language),
    t('stage2', language),
    t('stage3', language),
    t('stage4', language),
    t('stage5', language)
  ];

  return (
    <div>
      <h2 className='font-bold text-center text-xl'>{t('mentorshipProgressTitle', language)}</h2>

      {progressData && (
        <div>
            <p className="mt-4 text-lg">
                <span
                    className={`px-3 py-1 rounded-full font-semibold inline-block ${
                        progressData?.progressStage === 1 ? 'bg-gray-200 text-gray-800' :
                        progressData?.progressStage === 2 ? 'bg-blue-200 text-blue-800' :
                        progressData?.progressStage === 3 ? 'bg-yellow-200 text-yellow-800' :
                        progressData?.progressStage === 4 ? 'bg-orange-200 text-orange-800' :
                        progressData?.progressStage === 5 ? 'bg-green-200 text-green-800' :
                        'bg-red-200 text-red-800'
                    }`}
                >
                    {Number.isInteger(progressData?.progressStage) &&
                    progressData.progressStage >= 1 &&
                    progressData.progressStage <= progressStages.length
                    ? progressStages[progressData.progressStage - 1]
                    : t('unknownStage', language)}
                </span>
            </p>
            
            <div className='flex gap-3 mt-3 mb-3 justify-end'>
              <div className={progressData?.progressStage >= 5 ? 'opacity-50 cursor-not-allowed' : ''}>
                <Button 
                  text={t('advanceStage', language)} 
                  onClick={handleStageAdvance} 
                  disabled={progressData?.progressStage >= 5} 
                />
              </div>
                <Button text={t('addMeeting', language)} onClick={() => setShowModal(true)} />
            </div>

            <GenericCardSection
                titleKey="meetingHistory"
                filters={[]}
                data={(progressData.meetings || []).map((m, i) => ({ ...m, __index: i }))}
                // data={progressData.meetings || []}
                emptyTextKey="noMeetingsYet"
                renderCard={(m) => (
                <div>
                    <p><strong>{t('meetingDate', language)}:</strong> {m.date}</p>
                    <p><strong>{t('meetingMode', language)}:</strong> {m.mode}</p>
                    <p><strong>{t('meetingTopics', language)}:</strong> {m.topics}</p>
                    <p><strong>{t('meetingTasks', language)}:</strong> {m.tasks}</p>
                    <p><strong>{t('futurTasks', language)}:</strong> {m.futurTasks}</p>
                    <p><strong>{t('note', language)}:</strong> {m.note}</p>                    
                    <div className='flex mt-4 gap-5'>
                        <button title={t('delete', language)} onClick={() => handleDeleteMeeting(m.__index)}>
                            <Trash2 size={18} />
                        </button>
                        <button title={t('edit', language)} onClick={() => handleEditMeeting(m.__index)}>
                            <Edit2 size={18} />
                        </button>         
                    </div>
                </div>
                )}
            />
            </div>
        )}

        {showModal && (
            <div style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            }}>
            <AddNewMeeting
                mentorId={mentorId}
                reservistId={reservistId}
                onAdd={() => {
                fetchProgress();
                setShowModal(false);
                }}
                onClose={() => setShowModal(false)}
            />
            <div style={{ textAlign: 'right', marginTop: '10px' }}>
                <Button text={t('close', language)} onClick={() => setShowModal(false)} />
            </div>
            </div>
        )}

        {editingMeetingIndex !== null && progressData?.meetings?.[editingMeetingIndex] && (
            <div style={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
            }}>
                <EditMeeting
                    meeting={progressData.meetings[editingMeetingIndex]}
                    index={editingMeetingIndex}
                    mentorId={mentorId}
                    reservistId={reservistId}
                    onSave={() => {
                        fetchProgress();
                        setEditingMeetingIndex(null);
                    }}
                    onClose={() => setEditingMeetingIndex(null)}
                />
                <div style={{ textAlign: 'right', marginTop: '10px' }}>
                    <Button text={t('close', language)} onClick={() => setEditingMeetingIndex(null)} />
                </div>
            </div>
        )}

        {toast && <ToastMessage message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        {confirmDialog && <ConfirmDialog {...confirmDialog} />}
    </div>
  );
}
