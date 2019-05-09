import React from 'react';
import user from '../store/user';
import {Link} from 'react-router-dom';

const Dashboard = props => {
  return (
    <div>
      <h1>Welcome back user</h1>
      <div>
        <Link to="/create-room">
          <button type="button">Create a room</button>
        </Link>
        <br />
        <Link to="/room">Join a room</Link>

        <br />
        <Link to="/playlist">Go to Playlist</Link>
        {/* <button type="button">Join a room</button> */}
      </div>
    </div>
  );
};

export default Dashboard;
