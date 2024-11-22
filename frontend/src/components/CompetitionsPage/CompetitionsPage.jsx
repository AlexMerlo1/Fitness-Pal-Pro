import React, { useState } from 'react'
import './CompetitionsPage.css'

const CompetitionsPage2 = () => {

    // for top menu bar
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const toggleDropdown = () => {
        setDropdownVisible(!dropdownVisible);
      };
    const openHomePage = () => {
        window.open("http://localhost:3000/home");
    };
    const openWorkoutsPage = () => {
        window.open("http://localhost:3000/workoutplans");
    };
    const openCompetitionsPage = () => {
        window.open("http://localhost:3000/Competitions");
    };
    const openMilestonesPage = () => {
        window.open("http://localhost:3000/goals");
    };
    const openFriendsPage = () => {
        window.open("http://localhost:3000/home");
    };
    // end of top menu bar


  return (
    <div class="competitions-container">
        
        {/* for top menu bar */}
        <header className="the-header">
            <div className="logo-div" >
                <div className="logo-button" onClick={openHomePage}></div>
                <div className="logo-name" onClick={openHomePage}>Lift Ledger</div>
            </div>
            <div className="menubar-div" >
                <div className="menu-button" onClick={openWorkoutsPage}>Workouts</div>
                <div className="menu-button" onClick={openCompetitionsPage}>Competitions</div>
                <div className="menu-button" onClick={openMilestonesPage}>Milestones</div>
                <div className="menu-button" onClick={openFriendsPage}>Friends</div>
                <div className="the-profile-button" onClick={toggleDropdown}></div>
            </div>
            {dropdownVisible && (
            <div className="the-dropdown-menu">
                <ul>
                <li>View Profile</li>
                <li>Settings</li>
                <li>Log Out</li>
                </ul>
            </div>
            )}
        </header>
        {/* end of top menu bar */}

        <h1>This is The Competitions Page</h1>

        <div class="comp-info">
            <div class="competition-cards">
                <button class="competition-card">Max Bench</button>
                <button class="competition-card">Max Steps</button>
                <button class="competition-card">Max Steps</button>
                <button class="competition-card">Group X Class</button>
                <button class="competition-card">Group X Class</button>
                <button class="competition-card">Group X Class</button>
                <button class="competition-card">Group X Class</button>
                <button class="competition-card">Group X Class</button>
                <button class="competition-card">Group X Class</button>
                <button class="competition-card">Group X Class</button>
                <button class="competition-card">Group X Class</button>
                <button class="competition-card">Group X Class</button>
                <button class="competition-card">Group X Class</button>
                <button class="competition-card">Group X Class</button>
                <button class="competition-card">Group X Class</button>
                <button class="competition-card">Group X Class</button>
                <button class="competition-card">Group X Class</button>
            </div>
            <div class="competition-details">
                <div class="competition-header">
                    <h2>Max Bench</h2>
                    <button class="join-button">Join</button>
                </div>
                <p class="date-range">Open: Now - Fri Nov. 15</p>
                <div class="leaderboard">
                    <h3>Leaderboard</h3>
                    <table class="table">
                        <tr>
                            <th>1.</th>
                            <td>315 lb</td>
                            <td>Ben</td>
                        </tr>
                        <tr>
                            <th>2.</th>
                            <td>275 lb</td>
                            <td>Alex</td>
                        </tr>
                        <tr>
                            <th>3.</th>
                            <td>270 lb</td>
                            <td>Brett</td>
                        </tr>
                        <tr>
                            <th>4.</th>
                            <td>225 lb</td>
                            <td>James</td>
                        </tr>
                        <tr>
                            <th>5.</th>
                            <td>205 lb</td>
                            <td>Max</td>
                        </tr>
                    </table>
                </div>
                <div class="rewards">
                    <h3>Rewards</h3>
                    <table class="table">
                        <tr>
                            <th>1.</th>
                            <td>$25 gift card</td>
                        </tr>
                        <tr>
                            <th>2.</th>
                            <td>$15 gift card</td>
                        </tr>
                        <tr>
                            <th>3.</th>
                            <td>$10 gift card</td>
                        </tr>
                    </table>
                    <p>30 fit cash for all</p>
                </div>
                <div class="rewards">
                    <h3>Rewards</h3>
                    <table class="table">
                        <tr>
                            <th>1.</th>
                            <td>$25 gift card</td>
                        </tr>
                        <tr>
                            <th>2.</th>
                            <td>$15 gift card</td>
                        </tr>
                        <tr>
                            <th>3.</th>
                            <td>$10 gift card</td>
                        </tr>
                    </table>
                    <p>30 fit cash for all</p>
                </div>
                <div class="rewards">
                    <h3>Rewards</h3>
                    <table class="table">
                        <tr>
                            <th>1.</th>
                            <td>$25 gift card</td>
                        </tr>
                        <tr>
                            <th>2.</th>
                            <td>$15 gift card</td>
                        </tr>
                        <tr>
                            <th>3.</th>
                            <td>$10 gift card</td>
                        </tr>
                    </table>
                    <p>30 fit cash for all</p>
                </div>
                <div class="rewards">
                    <h3>Rewards</h3>
                    <table class="table">
                        <tr>
                            <th>1.</th>
                            <td>$25 gift card</td>
                        </tr>
                        <tr>
                            <th>2.</th>
                            <td>$15 gift card</td>
                        </tr>
                        <tr>
                            <th>3.</th>
                            <td>$10 gift card</td>
                        </tr>
                    </table>
                    <p>30 fit cash for all</p>
                </div>
            </div>
        </div>
    </div>
  )
}

export default CompetitionsPage2