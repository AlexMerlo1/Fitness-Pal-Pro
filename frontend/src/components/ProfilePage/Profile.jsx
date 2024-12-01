import './Profile.css';
import TopBar from '../TopBar/TopBar.jsx';

const Profile = () => {


  return (
    <div className='Profile-container'>
      <TopBar profileClass="ActiveProfile"/>
      <div className="Profile-icon"></div>
      <h1>BenBraniff</h1>
      <div className="logout">Log Out</div>
    </div>
  );
};

export default Profile;
