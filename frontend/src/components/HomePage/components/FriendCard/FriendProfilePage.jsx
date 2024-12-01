import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './FriendProfilePage.css';
import { FaArrowLeft } from 'react-icons/fa';

// BackButton Component
const BackButton = () => {
  const navigate = useNavigate();

  const goBack = () => {
    navigate('/workouts'); // Navigates to the /workouts route
  };

  return (
    <button className="back-button" onClick={goBack}>
      <FaArrowLeft />
    </button>
  );
};

const FriendProfilePage = () => {
  const { friendId } = useParams();
  const [profile, setProfile] = useState(null);

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`http://localhost:5000/profile/${friendId}`);
        const data = await response.json();
        if (response.ok) {
          setProfile(data);
        } else {
          console.error('Error fetching profile:', data.message);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchProfile();
  }, [friendId]);

  if (!profile) return <p className="loading-message">Loading profile...</p>;

  return (
    <div className="full-page">
      <div className="profile-container">
        {/* Use the BackButton component */}
        <BackButton />
        <div className="profile-header">
          <h1 className="profile-username">{profile.username}</h1>
          <p className="profile-bio">{profile.bio}</p>
          <p className="profile-friends-count">{profile.friends_count} Friends</p>
        </div>

        <div className="workouts-section">
          <h2>Recent Workouts</h2>
          {profile.latest_workouts.length > 0 ? (
            <ul className="workouts-list">
              {profile.latest_workouts.map((workout, index) => (
                <li key={index} className="workout-item">
                  <h3 className="workout-name">{workout.workout_name}</h3>
                  <p className="workout-date">Date: {new Date(workout.date_created).toLocaleDateString()}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No recent workouts available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FriendProfilePage;
