import React, { useState, useEffect } from 'react';
import './CompetitionsPage.css';
import TopBar from '../TopBar/TopBar.jsx';

const CompetitionsPage = () => {
  const [competitions, setCompetitions] = useState([]);
  const [selectedCompetition, setSelectedCompetition] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [awards, setAwards] = useState([]);
  const [userCompetitionsLog, setUserCompetitionsLog] = useState([]);
  const [userId] = useState(localStorage.getItem('user_id'));
  const [hasJoined, setHasJoined] = useState(false);

  const [newCompetition, setNewCompetition] = useState({
    name: '',
    description: '',
    visibility: 'public',
    start_date: '',
    end_date: '',
    awards: [
      { rank: 1, reward: '' },
      { rank: 2, reward: '' },
      { rank: 3, reward: '' }
    ]
  });

  const [showPopup, setShowPopup] = useState(false);

  const handleShowPopup = (competitionName) => {
    setSelectedCompetition(competitionName);
    setShowPopup(true);
  };
  
  const closePopup = () => {
    setShowPopup(false);
    setSelectedCompetition(null);
  };
  

  const handleAwardChange = (index, field, value) => {
    const updatedAwards = [...newCompetition.awards];
    updatedAwards[index][field] = value;
    setNewCompetition({ ...newCompetition, awards: updatedAwards });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCompetition({
      ...newCompetition,
      [name]: value
    });
  };
  useEffect(() => {
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

    const fetchUserCompetitionsLog = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:5000/user_competitions_log?user_id=${userId}`);
        const data = await response.json();
        if (response.ok) {
          setUserCompetitionsLog(data);
        } else {
          console.error('Error fetching user competitions log:', data.message);
        }
      } catch (error) {
        console.error('Error fetching user competitions log:', error);
      }
    };

    fetchCompetitions();
    fetchUserCompetitionsLog();
  }, [userId]);

  const fetchLeaderboard = async (competitionName) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/leaderboard?competition_name=${competitionName}`);
      const data = await response.json();
      if (response.ok) {
        setLeaderboard(data);
      } else {
        console.error('Failed to fetch leaderboard:', data.message);
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    }
  };

  const fetchAwards = async (competitionName) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/awards?competition_name=${competitionName}`);
      const data = await response.json();
      if (response.ok) {
        setAwards(data);
      } else {
        console.error('Failed to fetch awards:', data.message);
      }
    } catch (error) {
      console.error('Error fetching awards:', error);
    }
  };

  const handleJoinCompetition = async (competitionName) => {
    if (hasJoined) {
      alert('You have already joined this competition.');
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
        alert('You have successfully joined the competition!');
        setHasJoined(true); // Update state
        fetchCompetitions(); // Refresh competitions list
        fetchLeaderboard(competitionName); // Fetch updated leaderboard
      } else {
        console.error('Error joining competition:', data.message);
        alert('Failed to join competition.');
      }
    } catch (error) {
      console.error('Error joining competition:', error);
    }
  };
  

  const checkIfUserJoined = async (competitionName) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/has_joined?user_id=${userId}&competition_name=${competitionName}`);
      const data = await response.json();
      setHasJoined(data.has_joined);
    } catch (error) {
      console.error('Error checking if user joined:', error);
    }
  };

  const handleCreateCompetition = async (e) => {
    e.preventDefault(); // Prevent form submission refresh
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
        setNewCompetition({
          name: '',
          description: '',
          visibility: 'public',
          start_date: '',
          end_date: '',
          awards: [{ rank: 1, reward: '' }, { rank: 2, reward: '' }, { rank: 3, reward: '' }]
        });
        setShowPopup(false);
        fetchCompetitions(); // Refresh competition list
      } else {
        alert(data.message || 'Failed to create competition.');
      }
    } catch (error) {
      console.error('Error creating competition:', error);
    }
  };

  const handleUpdatePerformance = async (competitionName) => {
    const newPerformance = prompt(`Enter your new performance for ${competitionName}:`);
    if (!newPerformance) {
      alert('Performance is required to update.');
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:5000/update_performance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          competition_name: competitionName,
          performance: parseFloat(newPerformance),
        }),
      });

      const data = await response.json();
      if (response.ok) {
        alert('Performance updated successfully!');
        fetchLeaderboard(competitionName);
      } else {
        alert(data.message || 'Failed to update performance.');
      }
    } catch (error) {
      console.error('Error updating performance:', error);
    }
  };

  const handleCompetitionClick = (competition) => {
    setSelectedCompetition(competition);
    fetchLeaderboard(competition.name);
    fetchAwards(competition.name);
    checkIfUserJoined(competition.name);
  };

  return (
    <div className="competitions-container">
      <TopBar compClass="ActiveTab" />

      {/* Competitions Display */}
      <div className="comp-info">
        <div className="Search-div">
          <input className="Search-bar" placeholder="Competitions"></input>
          <div className="competition-cards">
            {competitions.map((competition) => (
              <button
                key={competition.id}
                className="competition-card"
                onClick={() => handleCompetitionClick(competition)}
              >
                <h3>{competition.name}</h3>
              </button>
            ))}
          </div>
        </div>
        
        {/* Selected Competition Details */}
        {selectedCompetition && (
          <div className="competition-details">
            <div className="competition-header">
              <h2>{selectedCompetition.name}</h2>
              {!hasJoined ? (
                <button
                  className="join-button"
                  onClick={() => handleJoinCompetition(selectedCompetition.name)}
                >
                  Join
                </button>
              ) : (
                <button
                  className="edit-button"
                  onClick={() => handleUpdatePerformance(selectedCompetition.name)}
                >
                  Edit Score
                </button>
              )}
            </div>
            <p className="description">{selectedCompetition.description}</p>
            <p className="date-range">
              Open: {selectedCompetition.start_date} to {selectedCompetition.end_date}
            </p>

            {/* Leaderboard */}
            <div className="leaderboard">
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
            </div>

            {/* Rewards Table */}
            <div className="rewards">
              <h3>Rewards</h3>
              <table className="table">
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Reward</th>
                  </tr>
                </thead>
                <tbody>
                  {awards.map((award, index) => (
                    <tr key={index}>
                      <td>{award.rank}</td>
                      <td>{award.reward}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="competitions-log">
          <h2>Competitions Log</h2>
          <table className="table">
            <thead>
              <tr>
                <th>Competition</th>
                <th>Your Rank</th>
                <th>Your Performance</th>
              </tr>
            </thead>
            <tbody>
              {userCompetitionsLog.map((logEntry, index) => (
                <tr key={index}>
                  <td>{logEntry.competition_name}</td>
                  <td>{logEntry.rank}</td>
                  <td>{logEntry.performance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Competition Button */}
      <div className="create-comp-container">
        <button className="create-comp-btn" onClick={() => setShowPopup(true)}>Create New Competition</button>
        {showPopup && (
          <div className="popup">
            <div className="popup-content">
              <h2>Create New Competition</h2>
              
              {/* Competition Details Form */}
              <form className="competition-form">
                <label>
                  Name:
                  <input
                    type="text"
                    name="name"
                    value={newCompetition.name}
                    onChange={handleInputChange}
                    placeholder="Enter competition name"
                  />
                </label>
                
                <label>
                  Description:
                  <input
                    type="text"
                    name="description"
                    value={newCompetition.description}
                    onChange={handleInputChange}
                    placeholder="Enter description"
                  />
                </label>
                
                <label>
                  Visibility:
                  <select
                    name="visibility"
                    value={newCompetition.visibility}
                    onChange={handleInputChange}
                  >
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                  </select>
                </label>
                
                <label>
                  Start Date:
                  <input
                    type="date"
                    name="start_date"
                    value={newCompetition.start_date}
                    onChange={handleInputChange}
                  />
                </label>
                
                <label>
                  End Date:
                  <input
                    type="date"
                    name="end_date"
                    value={newCompetition.end_date}
                    onChange={handleInputChange}
                  />
                </label>

                {/* Rewards Input Fields */}
                <h3>Awards</h3>
                {newCompetition.awards.map((award, index) => (
                  <div key={index} className="award-entry">
                    <label>Rank {award.rank}:</label>
                    <input
                      type="text"
                      placeholder={`Rank ${award.rank} Reward`}
                      value={award.reward}
                      onChange={(e) => handleAwardChange(index, 'reward', e.target.value)}
                    />
                  </div>
                ))}
                <div className="button-group">
                  <button className="create-comp-btn" onClick={handleCreateCompetition}>Create Competition</button>
                  <button className="close-btn" onClick={() => setShowPopup(false)}>Close</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompetitionsPage;
