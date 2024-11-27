import React, { useState, useEffect } from 'react';
import './CompetitionsPage.css';

const CompetitionsPage = () => {
  const [selectedCompetition, setSelectedCompetition] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [userPerformance, setUserPerformance] = useState('');
  const [userId] = useState(localStorage.getItem('user_id')); // Assume user ID is stored in localStorage

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
  
  const fetchLeaderboard = async (competitionName) => {
    console.log("Fetching leaderboard for:", competitionName); // Debug log
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
    if (selectedCompetition) {
      fetchLeaderboard(selectedCompetition);
    }
  }, [selectedCompetition]);

  return (
    <div className="competitions-container">
      <div className="top-bar">
        <h1>Competitions</h1>
      </div>
      <div className="comp-info">
        <div className="competition-cards">
          {['Max Bench', 'Max Steps', 'Group X Class', 'Cycling Challenge', 'Swimming Contest'].map((competition, index) => (
            <button key={index} className="competition-card" onClick={() => setSelectedCompetition(competition)}>
              {competition}
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
