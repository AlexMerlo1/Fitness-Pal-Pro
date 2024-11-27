import React, { useEffect, useState, useRef } from 'react';
import './NotificationPopup.css';
import Notification from './Notification'; 

const NotificationsPopup = ({ onClose }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);  
  const [error, setError] = useState(null);  
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
        console.log('Notifications response data:', data);

        if (data.pending_requests && Array.isArray(data.pending_requests)) {
          setNotifications(data.pending_requests); 
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
  }, [onClose]);

  const refreshNotifications = async () => {
    setLoading(true);  // Set loading to true while refreshing
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
      console.log('Notifications response data after refresh:', data); // Log the refreshed data

      if (data.pending_requests && Array.isArray(data.pending_requests)) {
        setNotifications(data.pending_requests);
      } else {
        setNotifications([]);
      }
    } catch (error) {
      console.error('Error fetching notifications after refresh:', error);
      setError('Could not load notifications. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="notifications-popup-container">
      <div className="notifications-popup" ref={popupRef}>
        <button className="close-button" onClick={onClose}>✖</button>
        <h3>Notifications</h3>

        {loading && !error ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : notifications.length > 0 ? (
          <ul>
            {notifications.map((notification, index) => (
              <li key={index}>
                <Notification 
                  type={notification.type}
                  data={notification} 
                  onActionComplete={(updatedData) => {
                    console.log('Friend request action completed for:', updatedData);
                    refreshNotifications();
                  }}
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
