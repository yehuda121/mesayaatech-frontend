import React, { useEffect, useState } from 'react';
import './notificationsStyle.css';

export default function ToastMessage({ message, type = 'info', duration = 3000, onClose }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300); // Wait for fade-out animation
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!visible) return null;

  return (
    <div className={`toast-message ${type}`}>
      <span>{message}</span>
      <button className="toast-close-btn" onClick={() => {
        setVisible(false);
        setTimeout(onClose, 300);
      }}>✖</button>
    </div>
  );
}
