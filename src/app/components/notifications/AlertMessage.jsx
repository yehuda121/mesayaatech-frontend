import React from 'react';
import './notificationsStyle.css';

export default function AlertMessage({ message, type = 'info', onClose }) {
  return (
    <div className={`alert-message ${type}`}>
      <span className="alert-icon">
        {type === 'success' && '✅'}
        {type === 'error' && '❌'}
        {type === 'warning' && '⚠️'}
        {type === 'info' && 'ℹ️'}
      </span>
      <span className="alert-text">{message}</span>
      <button className="alert-close-btn" onClick={onClose}>✖</button>
    </div>
  );
}
