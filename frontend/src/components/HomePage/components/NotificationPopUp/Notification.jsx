import React from 'react';
import './Notification.css'; 

const Notification = ({ type, data }) => {
  let notificationMessage = '';
  let showButton = false;  

  // Set the message based on the notification type
  switch (type) {
    case 'friend-request':
      notificationMessage = `${data.user_id} has sent you a friend request.`;
      showButton = true;  // Show button for friend-request type
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

      {/* Only for 'friend-request' type */}
      {showButton && (
        <button className="action-button">Accept</button>
      )}
    </div>
  );
};

export default Notification;
