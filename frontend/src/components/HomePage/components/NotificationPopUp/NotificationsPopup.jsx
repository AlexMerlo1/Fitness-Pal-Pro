import React from 'react';

const NotificationsPopup = ({ notifications, onClose }) => {
  return (
    <div className="notifications-popup">
      <div className="popup-header">
        <h3>Notifications</h3>
        <button onClick={onClose}>Close</button>
      </div>
      <ul>
        {notifications.map((notification, index) => (
          <li key={index}>{notification}</li>
        ))}
      </ul>
    </div>
  );
};

export default NotificationsPopup;
