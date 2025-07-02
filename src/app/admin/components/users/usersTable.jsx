'use client';

import { useEffect, useState } from 'react';
import { t } from '@/app/utils/loadTranslations';
import EditReservistForm from '@/app/pages/reservist/components/EditReservistForm';
import EditMentorForm from '@/app/pages/mentor/components/EditMentorForm';
import EditAmbassadorForm from '@/app/pages/ambassador/EditAmbassadorForm';
import { useLanguage } from "@/app/utils/language/useLanguage";

export default function UsersTable({ defaultStatusFilter = null }) {
  const [users, setUsers] = useState([]);
  const [selectedForm, setSelectedForm] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const language = useLanguage();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/imports-user-registration-form/all`);
      const data = await res.json();
      if (!Array.isArray(data)) {
        console.error(t('fetchErrorNotArray', language));
        setUsers([]);
        return;
      }
      setUsers(data);
    } catch (err) {
      console.error(t('fetchUsersError', language), err);
    }
  };

  const handleStatusChange = async (user, status) => {
    try {
      if (status === 'approved') {
        const createRes = await fetch('http://localhost:5000/api/approve-user', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: user.email,
            name: user.fullName,
            role: user.userType,
            idNumber: user.idNumber
          })
        });
        if (!createRes.ok) {
          const errorText = await createRes.text();
          console.error(t('cognitoCreateError', language), errorText);
          alert(t('emailSendFail', language));
          return;
        }
      }

      const res = await fetch('http://localhost:5000/api/update-user-status/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: user.fullName,
          idNumber: user.idNumber,
          userType: user.userType,
          status
        })
      });
      if (!res.ok) {
        console.error(t('dynamoStatusError', language), await res.text());
        return;
      }

      setUsers(prev =>
        prev.map(u =>
          u.idNumber === user.idNumber && u.userType === user.userType
            ? { ...u, status }
            : u
        )
      );
    } catch (err) {
      console.error(t('statusGeneralError', language), err);
      alert(t('generalStatusError', language));
    }
  };

  const handleDeleteUser = async (user) => {
    try {
      if (user.status === 'approved' && user.email) {
        const cognitoRes = await fetch('http://localhost:5000/api/delete-cognito-user', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: user.email })
        });
        if (!cognitoRes.ok) {
          const text = await cognitoRes.text();
          console.error(t('cognitoDeleteError', language), text);
          alert(t('cognitoDeleteError', language));
        }
      }

      const res = await fetch('http://localhost:5000/api/delete-user-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userType: user.userType,
          idNumber: user.idNumber
        })
      });
      if (!res.ok) {
        const text = await res.text();
        console.error(t('dynamoDeleteError', language), text);
        alert(t('dynamoDeleteError', language));
        return;
      }

      setUsers(prev => prev.filter(u => !(u.idNumber === user.idNumber && u.userType === user.userType)));
      setSelectedForm(null);
      alert(t('userDeletedSuccessfully', language));
    } catch (err) {
      console.error(t('generalDeleteError', language), err);
      alert(t('generalDeleteError', language));
    }
  };

  const statusMap = {
    pending: t('pending', language),
    approved: t('approved', language),
    denied: t('denied', language)
  };

  const userTypeMap = {
    reservist: t('reservist', language),
    mentor: t('mentor', language),
    ambassador: t('ambassador', language)
  };

  const filteredUsers = users.filter((user) => {
    const text = searchTerm.toLowerCase();
    const matchText =
      user.fullName?.toLowerCase().includes(text) ||
      user.email?.toLowerCase().includes(text) ||
      user.phone?.toLowerCase().includes(text);

    const matchType = filterType === 'all' || user.userType === filterType;
    const matchStatus = filterStatus === 'all' || user.status === filterStatus;

    return matchText && matchType && matchStatus;
  });

  const handleSaveUser = async (updatedUser) => {
    try {
      const res = await fetch('http://localhost:5000/api/update-user-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedUser)
      });

      if (!res.ok) {
        console.error(t('updateUserError', language), await res.text());
        return;
      }

      setUsers(prev =>
        prev.map(u =>
          u.idNumber === updatedUser.idNumber && u.userType === updatedUser.userType
            ? updatedUser
            : u
        )
      );
      setSelectedForm(null);
    } catch (err) {
      console.error(t('updateUserError', language), err);
    }
  };

  return (
    <div dir="rtl" className="users-table-container">
      <div className="users-table-wrapper">
        <div className="users-filters">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t('searchPlaceholder', language)}
          />

          <select
            value={filterType}
            onChange={(e) =>{
              const value = e.target.value;
              setFilterType(value === 'type' ? 'all' : value);
            }}
          >
            <option value="type">{t('userType', language)}</option>
            <option value="reservist">{t('reservist', language)}</option>
            <option value="mentor">{t('mentor', language)}</option>
            <option value="ambassador">{t('ambassador', language)}</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => {
              const value = e.target.value;
              setFilterStatus(value === 'status' ? 'all' : value);
            }}
          >
            <option value="status">{t('status', language)}</option>
            <option value="pending">{t('pending', language)}</option>
            <option value="approved">{t('approved', language)}</option>
            <option value="denied">{t('denied', language)}</option>
          </select>
        </div>

        <table className="table-style">
          <thead>
            <tr>
              <th>{t('name', language)}</th>
              <th>{t('id', language)}</th>
              <th>{t('status', language)}</th>
              <th>{t('userType', language)}</th>
              <th>{t('actions', language)}</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={`${user.userType}-${user.idNumber}`} onClick={() => setSelectedForm(user)}>
                <td>{user.fullName}</td>
                <td>{user.idNumber}</td>
                <td>{statusMap[user.status] || user.status}</td>
                <td>{userTypeMap[user.userType] || user.userType}</td>
                <td>
                  <div className="users-buttons">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (user.status !== 'approved') handleStatusChange(user, 'approved');
                      }}
                      disabled={user.status === 'approved'}
                      className={`users-button approve ${user.status === 'approved' ? 'disabled' : ''}`}
                    >
                      {t('approve', language)}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (user.status !== 'denied') handleStatusChange(user, 'denied');
                      }}
                      disabled={user.status === 'denied'}
                      className={`users-button deny ${user.status === 'denied' ? 'disabled' : ''}`}
                    >
                      {t('deny', language)}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {selectedForm && selectedForm.userType === 'reservist' && (
          <div className='editForm-modal-overlay'>
            <EditReservistForm
              userData={selectedForm}
              onClose={() => setSelectedForm(null)}
              onSave={handleSaveUser}
              onDelete={handleDeleteUser}
              role={'admin'}
            />
          </div>
        )}

        {selectedForm && selectedForm.userType === 'mentor' && (
          <div className='editForm-modal-overlay'>
            <EditMentorForm
              userData={selectedForm}
              onClose={() => setSelectedForm(null)}
              onSave={handleSaveUser}
              onDelete={handleDeleteUser}
              role={'admin'}
            />
          </div>
        )}

        {selectedForm && selectedForm.userType === 'ambassador' && (
          <div className='editForm-modal-overlay'>
            <EditAmbassadorForm
              userData={selectedForm}
              onClose={() => setSelectedForm(null)}
              onSave={handleSaveUser}
              onDelete={handleDeleteUser}
              role={'admin'}
            />
          </div>
        )}
        
      </div>
    </div>
  );
}
