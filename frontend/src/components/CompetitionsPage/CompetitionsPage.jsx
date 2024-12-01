import React, { useState, useEffect } from 'react';
import './CompetitionsPage.css';

const CompetitionsPage = () => {
  const [selectedCompetition, setSelectedCompetition] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [userPerformance, setUserPerformance] = useState('');
  const [userId] = useState(localStorage.getItem('user_id')); // Assume user ID is stored in localStorage
  const [competitions, setCompetitions] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [newCompetition, setNewCompetition] = useState({ name: '', description: '', visibility: 'public' });

  // Fetch all competitions (default and custom)
  const fetchCompetitions = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/competitions?user_id=${userId}`);
      const data = await response.json();
      if (response.ok) {
        setCompetitions(data);
      } else {
        console.error('Error fetching competitions:', data.message);
      }
    } catch (error) {
      console.error('Error fetching competitions:', error);
    }
  };

  // Fetch leaderboard for a selected competition
  const fetchLeaderboard = async (competitionName) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/leaderboard?competition_name=${competitionName}`);
      const data = await response.json();
      if (response.ok) {
        setLeaderboard(data);
      } else {
        alert(data.message || 'Failed to fetch leaderboard.');
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      alert('An error occurred while fetching the leaderboard.');
    }
  };

  // Handle joining a competition
  const handleJoinCompetition = async (competitionName) => {
    if (!userId) {
      alert('User ID is missing. Please log in.');
      return;
    }

    const initialPerformance = prompt(`Enter your initial performance for ${competitionName}:`);
    if (!initialPerformance) {
      alert('Performance is required to join the competition.');
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:5000/join_competition', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          competition_name: competitionName,
          performance: parseFloat(initialPerformance),
        }),
      });

      const data = await response.json();
      if (response.ok) {
        alert(`Successfully joined competition: ${competitionName}`);
        fetchLeaderboard(competitionName); // Refresh leaderboard
      } else {
        alert(data.message || 'Failed to join competition.');
      }
    } catch (error) {
      console.error('Error joining competition:', error);
      alert('An error occurred while joining the competition.');
    }
  };

  // Handle creating a new competition
  const handleCreateCompetition = async () => {
    if (!newCompetition.name || !userId) {
      alert('Competition name and user ID are required!');
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:5000/create_competition', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newCompetition, user_id: userId }),
      });

      const data = await response.json();
      if (response.ok) {
        alert('Competition created successfully!');
        setNewCompetition({ name: '', description: '', visibility: 'public' });
        setShowPopup(false);
        fetchCompetitions(); // Refresh competition list
      } else {
        alert(data.message || 'Failed to create competition.');
      }
    } catch (error) {
      console.error('Error creating competition:', error);
      alert('An error occurred while creating the competition.');
    }
  };

  // Handle updating performance
  const handlePerformanceSubmit = async () => {
    if (!userPerformance) {
      alert('Please enter a performance value before submitting.');
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:5000/update_performance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          competition_name: selectedCompetition,
          performance: parseFloat(userPerformance),
        }),
      });

      const data = await response.json();
      if (response.ok) {
        alert('Performance updated successfully!');
        fetchLeaderboard(selectedCompetition); // Refresh leaderboard
      } else {
        alert(data.message || 'Failed to update performance.');
      }
    } catch (error) {
      console.error('Error updating performance:', error);
      alert('An error occurred while updating performance.');
    }
  };

  useEffect(() => {
    fetchCompetitions();
    if (selectedCompetition) {
      fetchLeaderboard(selectedCompetition);
    }
  }, [selectedCompetition]);

  return (
    <div className="competitions-container">
      <div className="top-bar">
        <h1>Competitions</h1>
      </div>
      <button className="add-competition-button" onClick={() => setShowPopup(true)}>
        Create Competition
      </button>
      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <h2>Create a Competition</h2>
            <input
              type="text"
              placeholder="Competition Name"
              value={newCompetition.name}
              onChange={(e) => setNewCompetition({ ...newCompetition, name: e.target.value })}
            />
            <textarea
              placeholder="Description"
              value={newCompetition.description}
              onChange={(e) => setNewCompetition({ ...newCompetition, description: e.target.value })}
            />
            <select
              value={newCompetition.visibility}
              onChange={(e) => setNewCompetition({ ...newCompetition, visibility: e.target.value })}
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
            <button onClick={handleCreateCompetition}>Create</button>
            <button onClick={() => setShowPopup(false)}>Cancel</button>
          </div>
        </div>
      )}
      <div className="comp-info">
        <div className="competition-cards">
          {competitions.map((competition) => (
            <button
              key={competition.id}
              className="competition-card"
              onClick={() => setSelectedCompetition(competition.name)}
            >
              <h3>{competition.name}</h3>
              <p>{competition.description}</p>
            </button>
          ))}
        </div>
        {selectedCompetition && (
          <div className="competition-details">
            <h2>{selectedCompetition}</h2>
            <button className="join-button" onClick={() => handleJoinCompetition(selectedCompetition)}>
              Join
            </button>
            <h3>Leaderboard</h3>
            <table className="table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Performance</th>
                  <th>User</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((entry, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{entry.performance}</td>
                    <td>{entry.username}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <h3>Update Performance</h3>
            <input
              type="text"
              value={userPerformance}
              onChange={(e) => setUserPerformance(e.target.value)}
              placeholder="Enter your performance"
            />
            <button onClick={handlePerformanceSubmit}>Submit</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompetitionsPage;
