import React from 'react';
import './Notification.css'; // Add styles if needed

const Notification = ({ type, data }) => {
  let notificationMessage = '';

  // Set the message based on the notification type
  switch (type) {
    case 'friend_request':
      notificationMessage = `${data.user} has sent you a friend request.`;
      break;
    case 'friend_request_accepted':
      notificationMessage = `${data.user} accepted your friend request.`;
      break;
    case 'message':
      notificationMessage = `${data.user} sent you a message: ${data.message}`;
      break;
    default:
      notificationMessage = 'You have a new notification.';
  }

  return (
    <div className={`notification notification-${type}`}>
      <p>{notificationMessage}</p>
    </div>
  );
};

export default Notification;
