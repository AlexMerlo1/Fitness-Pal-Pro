import React, { useState, useEffect } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import FriendCard from '../FriendCard/FriendCard';
import './FriendPopup.css';

const FriendsPopup = ({ onClose }) => {
  const [searchTerm, setSearchTerm] = useState(''); 
  const [friends, setFriends] = useState([]); 
  const [loading, setLoading] = useState(false); 

  // Fetch friends when the search term changes
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFriends([]); // Clear friends if search term is empty
      return;
    }
    
    const fetchFriends = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:5000/search_friends?search=${searchTerm}`);
        const data = await response.json();
        if (response.ok) {
          setFriends(data.friends); // Update friends list with search results
        } else {
          console.error(data.message); // Handle errors if needed
        }
      } catch (error) {
        console.error('Error fetching friends:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchFriends();
  }, [searchTerm]);

  const handleOverlayClick = (e) => {
    // Close if you click anywhere on the screen
    if (e.target.classList.contains('popup-overlay')) {
      onClose();
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };


  

  return (
    <div className='popup-overlay' onClick={handleOverlayClick}>
      <div className='popup-container'>
        <div className='header'>
          <h2>Your Friends <br />{friends.length} Friends</h2>
          <input 
            type="text" 
            placeholder="Search..." 
            value={searchTerm} 
            onChange={handleSearchChange} 
          />
        </div>
        {loading ? (
          <p>Loading...</p> // Show loading text or spinner while fetching
        ) : (
          <ul className='friends-list'>
            {friends.map((friend) => (
              <li key={friend.id} className="friend-item">
                <FriendCard friend={friend.username} />
              </li>
            ))}
          </ul>
        )}
        <button className='close-button' onClick={onClose}><FaArrowLeft /></button>
      </div>
    </div>
  );
};

export default FriendsPopup;
