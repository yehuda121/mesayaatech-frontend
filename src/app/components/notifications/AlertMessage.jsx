// import React from 'react';
// import './notificationsStyle.css';

// export default function AlertMessage({ message, type = 'info', onClose }) {
//   if (!message) return null;

//   const shortMessage = message.length > 100
//     ? message.substring(0, 100) + '...'
//     : message;

//   return (
//     <div className={`alert-message ${type}`}>
//       <span className="alert-icon">
//         {type === 'success' && '✅'}
//         {type === 'error' && '❌'}
//         {type === 'warning' && '⚠️'}
//         {type === 'info' && 'ℹ️'}
//       </span>
//       <span className="alert-text">{shortMessage}</span>
//       <button className="alert-close-btn" onClick={onClose}>✖</button>
//     </div>
//   );
// }
import React from 'react';
import './notificationsStyle.css';

export default function AlertMessage({ message, type = 'info', onClose }) {
  if (!message) return null;

  let safeMessage = '';

  try {
    if (typeof message === 'string') {
      safeMessage = message;
    } else if (message instanceof Error) {
      safeMessage = message.message || message.toString();
    } else {
      safeMessage = JSON.stringify(message);
    }
  } catch (e) {
    safeMessage = 'Unknown error';
  }

  const shortMessage = safeMessage.length > 100
    ? safeMessage.substring(0, 100) + '...'
    : safeMessage;

  console.log('AlertMessage rendered with type:', type, 'and message:', shortMessage);
  return (
    <div className={`alert-message ${type}`}>
      <span className="alert-icon">
        {type === 'success' && '✅'}
        {type === 'error' && '❌'}
        {type === 'warning' && '⚠️'}
        {type === 'info' && 'ℹ️'}
      </span>
      <span className="alert-text">{shortMessage}</span>
      <button className="alert-close-btn" onClick={onClose}>✖</button>
    </div>
  );
}
