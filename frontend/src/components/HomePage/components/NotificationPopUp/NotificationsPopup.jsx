import React, { useEffect, useState, useRef } from 'react';
import './NotificationPopup.css';
import Notification from './Notification'; // Import the Notification component

const NotificationsPopup = ({ onClose }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);  // Add loading state
  const [error, setError] = useState(null);  // Add error state
  const popupRef = useRef(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('No token found. Please log in.');
          setLoading(false);
          return;
        }

        const response = await fetch('http://localhost:5000/notifications', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch notifications');
        }

        const data = await response.json();
        console.log('Notifications response data:', data); // Log the entire response for debugging

        // Extract notifications from the correct field (pending_requests)
        if (data.pending_requests && Array.isArray(data.pending_requests)) {
          setNotifications(data.pending_requests); // Set notifications to the correct field
        } else {
          setNotifications([]);  // Set empty array if the field is missing or not an array
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
        setError('Could not load notifications. Please try again later.');
      } finally {
        setLoading(false);  // Set loading to false after fetch completes
      }
    };

    fetchNotifications();

    // Handle click outside the popup
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]); // Don't include `loading` and `notifications` in the dependency array

  return (
    <div className="notifications-popup-container">
      <div className="notifications-popup" ref={popupRef}>
        <button className="close-button" onClick={onClose}>✖</button>
        <h3>Notifications</h3>

        {/* Show loading message while fetching */}
        {loading && !error ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="error-message">{error}</p> // Display error message
        ) : notifications.length > 0 ? (
          <ul>
            {notifications.map((notification, index) => (
              <li key={index}>
                {/* Pass notification type and data to the Notification component */}
                <Notification 
                  type={notification.type} // Assuming 'status' is the type
                  data={notification} 
                />
              </li>
            ))}
          </ul>
        ) : (
          <p>No notifications</p>
        )}
      </div>
    </div>
  );
};

export default NotificationsPopup;
