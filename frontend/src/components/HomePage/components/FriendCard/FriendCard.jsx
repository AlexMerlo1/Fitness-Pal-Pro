import React from 'react';
import { useNavigate } from 'react-router-dom';

  const add_friend = async (friendId) => {
    try {
      const token = localStorage.getItem('token');  // Get the token from localStorage (or wherever you store it)
      const response = await fetch('http://localhost:5000/add_friend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,  // Send the token in the Authorization header
        },
        body: JSON.stringify({
          friend_id: friendId,  
        }),
      });
  
      const data = await response.json();
      if (response.ok) {
        console.log('Friend added successfully:', data);
        // Optionally, update UI to reflect the new friend status
      } else {
        console.error('Failed to add friend:', data.message);
      }
    } catch (error) {
      console.error('Error adding friend:', error);
    }
  };

const FriendCard = ({ friend }) => {
  const navigate = useNavigate();
  const view_profile = (friendId) => {
    navigate(`/profile/${friendId}`); 
  };
  return (
    <div className="friend-card">
      <h3>{friend}</h3>
      <button onClick={() => add_friend(friend)}>Add Friend</button>
      <button onClick={() => view_profile(friend)}>View Profile</button>
    </div>
  );
};

export default FriendCard;
