import React from 'react';
import './Notification.css';

const Notification = ({ type, data, onActionComplete }) => {
  let notificationMessage = '';
  let showButton = false;

  // Set the message based on the notification type
  switch (type) {
    case 'friend-request':
      notificationMessage = `${data.user_id} has sent you a friend request.`;
      showButton = true; // Show button for friend-request type
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

  const handleAcceptFriendRequest = async () => {
    try {
      console.log('Handling friend request for data:', data.friend_id); 
      const token = localStorage.getItem('token'); // Use JWT token for authorization
      if (!token) {
        alert('You are not logged in!');
        return;
      }
  
      const response = await fetch('http://localhost:5000/accept_friend_request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_username: data.user_id, // Pass current user
          requestor_username: data.friend_id, // Pass requester username
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        alert(`Error: ${errorData.message}`);
        return;
      }
  
      const result = await response.json();
      alert(result.message);
  
      // Notify parent component about the action completion
      if (onActionComplete) {
        onActionComplete(data); // Refresh notifications after the friend request action
      }
    } catch (error) {
      console.error('Error accepting friend request:', error);
      alert('An error occurred. Please try again later.');
    }
  };
  
  return (
    <div className={`notification notification-${type}`}>
      <p>{notificationMessage}</p>

      {/* Only for 'friend-request' type */}
      {showButton && (
        <button className="accept-friend-button" onClick={handleAcceptFriendRequest}>
          Accept
        </button>
      )}
    </div>
  );
};

export default Notification;
