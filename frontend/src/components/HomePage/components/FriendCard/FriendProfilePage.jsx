import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const FriendProfilePage = () => {
  const { friendId } = useParams();
  const [profile, setProfile] = useState(null);
  const [workouts, setWorkouts] = useState([]);

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

  // Fetch recent workouts
  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const response = await fetch(`http://localhost:5000/workouts/${friendId}`);
        const data = await response.json();
        if (response.ok) {
          setWorkouts(data);
        } else {
          console.error('Error fetching workouts:', data.message);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchWorkouts();
  }, [friendId]);

  if (!profile) return <p>Loading profile...</p>;

  return (
    <div>
      <h1>{profile.username}'s Profile</h1>
      <p>{profile.bio}</p>

      <h2>Recent Workouts</h2>
      {workouts.length > 0 ? (
        <ul>
          {workouts.map((workout) => (
            <li key={workout.id}>
              <h3>{workout.name}</h3>
              <p>Date: {new Date(workout.date).toLocaleDateString()}</p>
              <p>Duration: {workout.duration} minutes</p>
              <p>Exercises:</p>
              <ul>
                {workout.exercises.map((exercise, index) => (
                  <li key={index}>
                    {exercise.name}: {exercise.reps} reps, {exercise.sets} sets
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      ) : (
        <p>No recent workouts available.</p>
      )}
    </div>
  );
};

export default FriendProfilePage;
