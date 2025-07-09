import React from 'react';
import './notificationsStyle.css';

export default function ConfirmDialog({ title, message, onConfirm, onCancel }) {
  if (!message) return null;
  if(message.length > 100) {
    message = message.substring(0, 100) + '...';
  }
  return (
    <div className="confirm-overlay">
      <div className="confirm-dialog">
        <button className="confirm-close" onClick={onCancel}>✖</button>
        {title && <h2 className="confirm-title">{title}</h2>}
        <p className="confirm-message">{message}</p>
        <div className="confirm-actions">
          <button className="confirm-btn confirm-yes" onClick={onConfirm}>כן</button>
          <button className="confirm-btn confirm-no" onClick={onCancel}>לא</button>
        </div>
      </div>
    </div>
  );
}
